import React from "react";
import Content from "../../Content/Content";
import CollectionCards from "../../Design/CollectionCards";

const Collection = () => {
  return (
    <Content>
      <section className="grid mt-5 md:mt-8 md:grid-cols-4 gap-6 pt-2">
        <CollectionCards image="https://i.ibb.co.com/tDvv9dx/men-Collection-Image.jpg" />
        <CollectionCards image="https://i.ibb.co.com/L1qD7w9/Women-Collection-Image.jpg" />
        <CollectionCards image="https://i.ibb.co.com/y4qmns4/kids-Collection-Image.jpg" />
        <CollectionCards image="https://i.ibb.co.com/SRhMB2x/accessories.jpg" />
      </section>
    </Content>
  );
};

export default Collection;
// https://ibb.co.com/qktcpzn
// https://ibb.co.com/QDM7FmD
// https://ibb.co.com/SBMMzLd
// https://ibb.co.com/QMq7wBY
