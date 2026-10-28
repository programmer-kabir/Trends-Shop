import React from "react";
import HeroBanner from "../../Components/Home/Banner/HeroBanner";
import TrustFeatures from "../../Components/Home/TrustFeatures/TrustFeatures";
import FeaturedCategories from "../../Components/Home/Collection/FeaturedCategories";
import ShoeSilhouetteGuide from "../../Components/Home/Silhouette/ShoeSilhouetteGuide";
import BestSelling from "../../Components/Home/BestSelling/BestSelling";
import FlashDeal from "../../Components/Home/FlashDeal/FlashDeal";
import CraftsmanshipStory from "../../Components/Home/Craftsmanship/CraftsmanshipStory";
import LeatherCareGuide from "../../Components/Home/Care/LeatherCareGuide";
import MensCollection from "../../Components/Home/MensCollection/MensCollection";
import WomensCollection from "../../Components/Home/WomensCollection/WomensCollection";
import KidsCollection from "../../Components/Home/KidsCollection/KidsCollection";
import Testimonials from "../../Components/Home/Testimonials/Testimonials";
import VIPClubCoupons from "../../Components/Home/CouponCode/VIPClubCoupons";

const Home = () => {
  return (
    <div className="space-y-0 transition-colors">
      {/* 1. Hero Luxury Banner */}
      <HeroBanner />

      {/* 2. Value Proposition & Trust Badges */}
      <TrustFeatures />

      {/* 3. Curated Signature Categories */}
      <FeaturedCategories />

      {/* 4. Footwear Architecture & Silhouettes Guide (New) */}
      <ShoeSilhouetteGuide />

      {/* 5. Best Selling Showcase */}
      <BestSelling />

      {/* 6. Limited Flash Deal with Countdown */}
      <FlashDeal />

      {/* 7. Handcrafted Leather Story & Standards */}
      <CraftsmanshipStory />

      {/* 8. Artisanal Leather Care & Longevity Ritual (New) */}
      <LeatherCareGuide />

      {/* 9. Men's Handcrafted Collection */}
      <MensCollection />

      {/* 10. Women's Artisanal Footwear */}
      <WomensCollection />

      {/* 11. Kid's Heritage Collection */}
      <KidsCollection />

      {/* 12. Verified Customer Reviews & Social Proof */}
      <Testimonials />

      {/* 13. Promotional Vouchers & VIP Club */}
      <VIPClubCoupons />
    </div>
  );
};

export default Home;
