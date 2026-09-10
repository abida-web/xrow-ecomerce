"use client";
import { authClient } from "@/lib/auth-client";
import { deleteImageFromUploadthing } from "@/app/actions/product-actions";
import toast from "react-hot-toast";

// Sub-editors
import AnnouncementbarEdite from "./EditeSections/AnnouncementbarEdite";
import NavbarEdite from "./EditeSections/NavbarEdite";
import HeroBottomAlignedEdite from "./EditeSections/HeroBottomAlignedEdite";
import HeroMarqueeEdite from "./EditeSections/HeroMarqueeEdite";
import HeroLargeLogoEdite from "./EditeSections/HeroLargeLogoEdite";
import SlideshowFullFrameEdite from "./EditeSections/SlideshowFullFrameEdite";
import SlideshowLayeredEdite from "./EditeSections/SlideshowLayeredEdite";
import SlideshowInsetEdite from "./EditeSections/SlideshowInsetEdite";
import SplitShowcaseEdite from "./EditeSections/SplitShowcaseEdite";
import FeaturedProductsEdite from "./EditeSections/FeaturedProductsEdite";
import NewsletterSignupEdite from "./EditeSections/NewsletterSignupEdite";
import ContactFormEdite from "./EditeSections/ContactFormEdite";
import FaqEdite from "./EditeSections/FaqEdite";
import TestimonialsEdite from "./EditeSections/TestimonialsEdite";
import EditeFooter from "./EditeSections/EditeFooter";
const SectionsEditeBars = ({
  selectedSection,
  updateSectionSettings,
  updateContent,
  setLinksText,
  linksText,
  handleUpdateSection,
}: any) => {
  const settings = selectedSection?.defaultSettings || {};
  const content = selectedSection?.defaultContent || {};
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const removeImage = async (fileKey: string) => {
    const res = await deleteImageFromUploadthing(fileKey);
    if (res?.success) toast.success("Image deleted successfully");
    else toast.error("Failed to delete image");
  };

  // Shared props passed to every section editor
  const shared = {
    selectedSection,
    settings,
    content,
    updateSectionSettings,
    updateContent,
    handleUpdateSection,
    removeImage,
  };

  return (
    <div>
      {selectedSection?.name === "Announcement Bar" && (
        <AnnouncementbarEdite {...shared} />
      )}

      {selectedSection?.name === "Navbar" && (
        <NavbarEdite
          {...shared}
          activeOrganization={activeOrganization}
          linksText={linksText}
          setLinksText={setLinksText}
        />
      )}

      {selectedSection?.name === "Hero: Bottom Aligned" && (
        <HeroBottomAlignedEdite {...shared} />
      )}

      {selectedSection?.name === "Hero: Marquee" && (
        <HeroMarqueeEdite {...shared} />
      )}

      {selectedSection?.name === "Hero: Large Logo" && (
        <HeroLargeLogoEdite {...shared} />
      )}

      {selectedSection?.name === "Slideshow: Full Frame" && (
        <SlideshowFullFrameEdite {...shared} />
      )}

      {selectedSection?.name === "Slideshow: Layered" && (
        <SlideshowLayeredEdite {...shared} />
      )}

      {selectedSection?.name === "Slideshow: Inset" && (
        <SlideshowInsetEdite {...shared} />
      )}

      {selectedSection?.name === "Split Showcase" && (
        <SplitShowcaseEdite {...shared} />
      )}

      {selectedSection?.name === "Featured Products" && (
        <FeaturedProductsEdite {...shared} />
      )}

      {selectedSection?.name === "Newsletter Signup" && (
        <NewsletterSignupEdite {...shared} />
      )}

      {selectedSection?.name === "Contact Form" && (
        <ContactFormEdite {...shared} />
      )}

      {selectedSection?.name === "About / Rich Text" && (
        <ContactFormEdite {...shared} />
      )}
      {selectedSection?.name === "FAQ" && <FaqEdite {...shared} />}
      {selectedSection?.name === "Testimonials" && (
        <TestimonialsEdite {...shared} />
      )}
      {selectedSection?.name === "Footer" && <EditeFooter {...shared} />}
    </div>
  );
};

export default SectionsEditeBars;
