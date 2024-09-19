import React from "react";
import Banner from "../../Components/Home/Banner/Banner";
import Collection from "../../Components/Home/Collection/Collection";
import BestSelling from "../../Components/Home/BestSelling/BestSelling";
import MensCollection from "../../Components/Home/MensCollection/MensCollection";
import WomensCollection from "../../Components/Home/WomensCollection/WomensCollection";

const Home = () => {
  return (
    <div className="space-y-20">
      <Banner />
      <BestSelling />
      <MensCollection />
      <WomensCollection />
    </div>
  );
};

export default Home;
