"use server";
import { db } from "@/drizzle/db";
import {
  organization,
  organizationTables,
  shippingMethods,
  shippingRates,
  shippingZones,
} from "@/drizzle/schema";
import { getOrganizationBySlug } from "@/lib/organization-check";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface StoreSettings {
  storeStatus: string;
  storeVisibility: boolean;
  guestCheckout: boolean;
  showOutOfStock: boolean;
  allReviews: boolean;
  productPerPage: number;
  productSort: string;
  autoCancelUnpaidOrder: boolean;
  cancelMin: number;
}

export interface StoreShippingSettings {
  name: string;
  description: string;
  isActive: boolean;
}

export interface StoreZoneSettings {
  zoneName: string;
  zoneActive: boolean;
}

// ============================================
// 1. CREATE SETTINGS (First time setup)
// ============================================
export const createOrganizationSettings = async (
  storeslug: string,
  storeSettings: StoreSettings,
) => {
  try {
    const storeData = await db.query.organization.findFirst({
      where: eq(organization.slug, storeslug),
    });

    if (!storeData) {
      return { success: false, error: "Organization not found" };
    }

    // Check if settings already exist
    const existing = await db.query.organizationTables.findFirst({
      where: eq(organizationTables.organizationId, storeData.id),
    });

    if (existing) {
      return {
        success: false,
        error: "Settings already exist. Use update instead.",
        code: "ALREADY_EXISTS",
      };
    }

    // Insert new settings
    const [newSettings] = await db
      .insert(organizationTables)
      .values({
        organizationId: storeData.id,
        storeStatus: storeSettings.storeStatus || "active",
        storeVisibility: storeSettings.storeVisibility ?? true,
        guestCheckout: storeSettings.guestCheckout ?? true,
        showOutOfStock: storeSettings.showOutOfStock ?? false,
        allReviews: storeSettings.allReviews ?? true,
        productPerPage: storeSettings.productPerPage ?? 20,
        productSort: storeSettings.productSort ?? "newest",
        autoCancelUnpaidOrder: storeSettings.autoCancelUnpaidOrder ?? false,
        cancelMin: storeSettings.cancelMin ?? 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return {
      success: true,
      data: newSettings,
      message: "Settings created successfully",
    };
  } catch (error) {
    console.error("Error creating organization settings:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create settings",
    };
  }
};

// ============================================
// 2. UPDATE SETTINGS (Existing settings)
// ============================================
export const updateOrganizationSettings = async (
  storeslug: string,
  settingId: string | undefined,
  storeSettings: StoreSettings,
) => {
  try {
    const storeData = await db.query.organization.findFirst({
      where: eq(organization.slug, storeslug),
    });

    if (!storeData) {
      return { success: false, error: "Organization not found" };
    }

    // Check if settings exist
    const existing = await db.query.organizationTables.findFirst({
      where: eq(organizationTables.organizationId, storeData.id),
    });

    if (!existing) {
      return {
        success: false,
        error: "Settings don't exist. Use create instead.",
        code: "NOT_FOUND",
      };
    }

    // Update existing settings
    const [updatedSettings] = await db
      .update(organizationTables)
      .set({
        storeStatus: storeSettings.storeStatus || "active",
        storeVisibility: storeSettings.storeVisibility ?? true,
        guestCheckout: storeSettings.guestCheckout ?? true,
        showOutOfStock: storeSettings.showOutOfStock ?? false,
        allReviews: storeSettings.allReviews ?? true,
        productPerPage: storeSettings.productPerPage ?? 20,
        productSort: storeSettings.productSort ?? "newest",
        autoCancelUnpaidOrder: storeSettings.autoCancelUnpaidOrder ?? false,
        cancelMin: storeSettings.cancelMin ?? 30,
        updatedAt: new Date(),
      })
      .where(eq(organizationTables.organizationId, storeData.id))
      .returning();

    revalidatePath(`/dashboard/${storeslug}/settings/store-preference`);

    return {
      success: true,
      data: updatedSettings,
      message: "Settings updated successfully",
    };
  } catch (error) {
    console.error("Error updating organization settings:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update settings",
    };
  }
};

// ============================================
// 3. SAVE SETTINGS (Smart - Create OR Update)
// ============================================
export const saveOrganizationsSettings = async (
  storeslug: string,
  storeSettings: StoreSettings,
) => {
  try {
    const storeData = await db.query.organization.findFirst({
      where: eq(organization.slug, storeslug),
    });

    if (!storeData) {
      return { success: false, error: "Organization not found" };
    }

    // Check if settings already exist
    const existing = await db.query.organizationTables.findFirst({
      where: eq(organizationTables.organizationId, storeData.id),
    });

    const settingsData = {
      organizationId: storeData.id,
      storeStatus: storeSettings.storeStatus || "active",
      storeVisibility: storeSettings.storeVisibility ?? true,
      guestCheckout: storeSettings.guestCheckout ?? true,
      showOutOfStock: storeSettings.showOutOfStock ?? false,
      allReviews: storeSettings.allReviews ?? true,
      productPerPage: storeSettings.productPerPage ?? 20,
      productSort: storeSettings.productSort ?? "newest",
      autoCancelUnpaidOrder: storeSettings.autoCancelUnpaidOrder ?? false,
      cancelMin: storeSettings.cancelMin ?? 30,
      updatedAt: new Date(),
    };

    let result;

    if (!existing) {
      // Insert new settings
      const [newSettings] = await db
        .insert(organizationTables)
        .values({
          ...settingsData,
          createdAt: new Date(),
        })
        .returning();
      result = newSettings;
    } else {
      // Update existing settings
      const [updatedSettings] = await db
        .update(organizationTables)
        .set(settingsData)
        .where(eq(organizationTables.organizationId, storeData.id))
        .returning();
      result = updatedSettings;
    }

    revalidatePath(`/dashboard/${storeslug}/settings/store-preference`);

    return {
      success: true,
      data: result,
      message: existing
        ? "Settings updated successfully"
        : "Settings created successfully",
    };
  } catch (error) {
    console.error("Error saving organization settings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save settings",
    };
  }
};

// ============================================
// 4. GET SETTINGS
// ============================================
export const getOrganizationWithSettings = async (storeSlug: string) => {
  const storeData = await db.query.organization.findFirst({
    where: eq(organization.slug, storeSlug),
    with: {
      settings: true,
    },
  });
  return storeData;
};

// ============================================
// 5. SHIPPING METHODS
// ============================================
export const saveOrganizationsShippingSettings = async (
  storeslug: string,
  shippingSettingForm: StoreShippingSettings,
) => {
  try {
    const storeData = await db.query.organization.findFirst({
      where: eq(organization.slug, storeslug),
    });

    if (!storeData) {
      return { success: false, error: "Organization not found" };
    }

    const [newMethod] = await db
      .insert(shippingMethods)
      .values({
        organizationId: storeData.id,
        name: shippingSettingForm.name || "Standard Shipping",
        description: shippingSettingForm.description || "",
        isActive: shippingSettingForm.isActive ?? true,
      })
      .returning();

    return {
      success: true,
      data: {
        shippingMethod: newMethod,
      },
      message: "Shipping method created successfully",
    };
  } catch (error) {
    console.error("Error creating shipping method:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create shipping method",
    };
  }
};

// ============================================
// 6. SHIPPING ZONES
// ============================================
export const saveOrganizationsZonShippingSettings = async (
  storeslug: string,
  shippingSettingForm: StoreZoneSettings,
) => {
  try {
    const storeData = await db.query.organization.findFirst({
      where: eq(organization.slug, storeslug),
    });

    if (!storeData) {
      return { success: false, error: "Organization not found" };
    }

    const [newZone] = await db
      .insert(shippingZones)
      .values({
        organizationId: storeData.id,
        name: shippingSettingForm.zoneName || "Default Zone",
        isActive: shippingSettingForm.zoneActive ?? true,
      })
      .returning();

    return {
      success: true,
      data: {
        shippingZone: newZone,
      },
      message: "Shipping zone created successfully",
    };
  } catch (error) {
    console.error("Error creating shipping zone:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create shipping zone",
    };
  }
};

// ============================================
// 7. SHIPPING RATES
// ============================================
export const saveOrganizationsrateSettings = async (
  storeslug: string,
  rateForm: any,
) => {
  try {
    const storeData = await db.query.organization.findFirst({
      where: eq(organization.slug, storeslug),
    });

    if (!storeData) {
      return { success: false, error: "Organization not found" };
    }

    const [newRate] = await db
      .insert(shippingRates)
      .values({
        shippingMethodId: rateForm.methodId,
        shippingZoneId: rateForm.zoneId,
        price: rateForm.price,
      })
      .returning();

    return {
      success: true,
      data: {
        shippingZone: newRate,
      },
      message: "Shipping zone created successfully",
    };
  } catch (error) {
    console.error("Error creating shipping zone:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create shipping zone",
    };
  }
};

// ============================================
// 8. GET SHIPPING SETTINGS
// ============================================
export const getOrganizationWithShippingSettings = async (
  storeSlug: string,
) => {
  const storeData = await db.query.organization.findFirst({
    where: eq(organization.slug, storeSlug),
    with: {
      settings: true,
      shippingMethods: true,
      shippingZones: {
        with: {
          rates: true,
        },
      },
    },
  });
  return storeData;
};
