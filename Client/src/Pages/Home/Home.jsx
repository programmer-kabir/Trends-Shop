import React from "react";
import Banner from "../../Components/Home/Banner/Banner";
import Collection from "../../Components/Home/Collection/Collection";
import BestSelling from "../../Components/Home/BestSelling/BestSelling";
import MensCollection from "../../Components/Home/MensCollection/MensCollection";

const Home = () => {
  return (
    <div className="space-y-20">
      <Banner />
      <BestSelling />
      <MensCollection />
    </div>
  );
};

export default Home;
