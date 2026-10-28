import React from "react";
import HeroBanner from "../../Components/Home/Banner/HeroBanner";
import TrustFeatures from "../../Components/Home/TrustFeatures/TrustFeatures";
import FeaturedCategories from "../../Components/Home/Collection/FeaturedCategories";
import BestSelling from "../../Components/Home/BestSelling/BestSelling";
import FlashDeal from "../../Components/Home/FlashDeal/FlashDeal";
import CraftsmanshipStory from "../../Components/Home/Craftsmanship/CraftsmanshipStory";
import MensCollection from "../../Components/Home/MensCollection/MensCollection";
import WomensCollection from "../../Components/Home/WomensCollection/WomensCollection";
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

      {/* 4. Best Selling Showcase */}
      <BestSelling />

      {/* 5. Limited Flash Deal with Countdown */}
      <FlashDeal />

      {/* 6. Handcrafted Leather Story & Standards */}
      <CraftsmanshipStory />

      {/* 7. Men's Handcrafted Collection */}
      <MensCollection />

      {/* 8. Women's Artisanal Footwear */}
      <WomensCollection />

      {/* 9. Verified Customer Reviews & Social Proof */}
      <Testimonials />

      {/* 10. Promotional Vouchers & VIP Club */}
      <VIPClubCoupons />
    </div>
  );
};

export default Home;
