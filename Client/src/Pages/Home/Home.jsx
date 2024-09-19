import React from "react";
import Banner from "../../Components/Home/Banner/Banner";
import Collection from "../../Components/Home/Collection/Collection";
import BestSelling from "../../Components/Home/BestSelling/BestSelling";

const Home = () => {
  return (
    <div className="space-y-5">
      <Banner />
      <Collection />
      <BestSelling />
    </div>
  );
};

export default Home;
