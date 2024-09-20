import React from "react";
import Banner from "../../Components/Home/Banner/Banner";
import Collection from "../../Components/Home/Collection/Collection";
import BestSelling from "../../Components/Home/BestSelling/BestSelling";
import MensCollection from "../../Components/Home/MensCollection/MensCollection";
import WomensCollection from "../../Components/Home/WomensCollection/WomensCollection";
import KidsCollection from "../../Components/Home/KidsCollection/KidsCollection";

const Home = () => {
  return (
    <div className="space-y-20">
      <Banner />
      <Collection />
      <BestSelling />
      <MensCollection />
      <WomensCollection />
      <KidsCollection />
    </div>
  );
};

export default Home;
