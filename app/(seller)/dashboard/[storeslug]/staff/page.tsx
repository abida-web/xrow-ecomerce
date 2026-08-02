"use client";

import { authClient } from "@/lib/auth-client";
import { useState, useEffect, useMemo } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import InvitationsTab from "../../_components/InvitationsTab";
import InvitationModal from "../../_components/InvitationModal";
import MembersTab from "../../_components/MembersTab";

interface InvitationProps {
  id: string;
  organizationId: string;
  email: string;
  role: "member" | "owner" | "admin" | "driver" | "staff";
  status: string;
  inviterId: string;
  expiresAt: Date;
  createdAt: Date;
}

interface Member {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  image?: string | null;
}

const CreateStaffSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email is required")
    .trim(),
  role: z.enum(["driver", "owner", "member", "staff"]),
});

type CreateStaffForm = z.infer<typeof CreateStaffSchema>;

const StaffPage = () => {
  const [invitations, setInvitations] = useState<InvitationProps[]>([]);
  const [openTab, setOpenTab] = useState<"INVITITIONS" | "MEMBERS">(
    "INVITITIONS",
  );
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: activeOrganization } = authClient.useActiveOrganization();

  // Transform members data to match the Member interface
  const transformedMembers = useMemo<Member[]>(() => {
    if (!activeOrganization?.members) return [];

    return activeOrganization.members.map((member: any) => ({
      id: member.id,
      userId: member.userId,
      name: member.user?.name || "N/A",
      email: member.user?.email || "N/A",
      role: member.role,
      createdAt: member.createdAt,
    }));
  }, [activeOrganization?.members]);

  const handleListInvitation = async () => {
    if (!activeOrganization?.id) return;

    try {
      const { data, error } = await authClient.organization.listInvitations({
        query: {
          organizationId: activeOrganization.id,
        },
      });

      if (error) {
        toast.error(error?.message || "Failed to fetch invitations");
        return;
      }

      setInvitations(data || []);
      toast.success("Invitations loaded successfully");
    } catch (error) {
      console.error("Unexpected error fetching invitations:", error);
      toast.error("Failed to load invitations");
    }
  };

  // Fetch initial data
  useEffect(() => {
    if (activeOrganization?.id) {
      handleListInvitation();
    }
  }, [activeOrganization?.id]);

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await authClient.organization.cancelInvitation({
        invitationId: invitationId,
      });
      await handleListInvitation();
      toast.success("Invitation cancelled successfully");
    } catch (error) {
      console.error("Error canceling invitation:", error);
      toast.error("Failed to cancel invitation");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await authClient.organization.removeMember({
        memberIdOrEmail: memberId,
        organizationId: activeOrganization?.id,
      });
      toast.success("Member removed successfully");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateStaffForm>({
    resolver: zodResolver(CreateStaffSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  async function handleCreateStaff(data: CreateStaffForm) {
    try {
      await authClient.organization.inviteMember({
        email: data.email,
        role: data.role,
        organizationId: activeOrganization?.id,
      });
      reset();
      setOpenInviteModal(false);
      await handleListInvitation();
      toast.success(`Invitation sent to ${data.email} successfully`);
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error("Failed to send invitation");
    }
  }

  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      if (openTab === "INVITITIONS") {
        await handleListInvitation();
      } else {
        toast.loading("Refreshing members...", { id: "refresh" });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      console.error("Error refreshing:", error);
      toast.error("Failed to refresh");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-5 mt-5">
          <button
            onClick={() => setOpenTab("INVITITIONS")}
            className={`font-semibold shadow shadow-gray-500 rounded-full py-1 px-5 transition-all duration-300 ${
              openTab === "INVITITIONS" &&
              "bg-orange-500 shadow-white text-white"
            }`}
          >
            Invitations
          </button>
          <button
            onClick={() => setOpenTab("MEMBERS")}
            className={`font-semibold shadow shadow-gray-500 rounded-full py-1 px-5 transition-all duration-300 ${
              openTab === "MEMBERS" && "bg-orange-500 shadow-white text-white"
            }`}
          >
            Members
          </button>
        </div>
        <div className="flex justify-between items-center gap-5">
          <button
            onClick={() => setOpenInviteModal(true)}
            className="bg-gray-50 hover:bg-gray-300 px-4 py-2 text-black rounded-md text-sm font-medium transition-colors"
          >
            Invite
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded-md text-sm font-medium transition-colors ${
              isRefreshing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {openTab === "INVITITIONS" && (
        <InvitationsTab
          invitations={invitations}
          handleCancelInvitation={handleCancelInvitation}
        />
      )}
      {openTab === "MEMBERS" && (
        <MembersTab
          members={transformedMembers}
          handleRemoveMember={handleRemoveMember}
        />
      )}

      {openInviteModal && (
        <InvitationModal
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          isSubmitting={isSubmitting}
          handleCreateStaff={handleCreateStaff}
          setOpenInviteModal={setOpenInviteModal}
        />
      )}
    </div>
  );
};

export default StaffPage;
