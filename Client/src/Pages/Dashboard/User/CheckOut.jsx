import React, { useState } from "react";
import useBooked from "../../../Components/Hooks/useBooked";
import LoadingSpinner from "../../../Components/Design/LoadingSpinner/LoadingSpinner";
import Content from "../../../Components/Content/Content";
import { FaPlus } from "react-icons/fa6";
import { Form, Input, Radio } from "antd";
import { TbCurrencyTaka } from "react-icons/tb";
const CheckOut = () => {
  const [booked, loading] = useBooked();
  const [shippingCost, setShippingCost] = useState(0);
  console.log(booked);
  const subTotal = booked.reduce(
    (total, data) => total + data.price * data.quantity,
    0
  );
  const totalCost = subTotal + shippingCost;
  const onFinish = (data) => {
    console.log(data);
  };
  return (
    <Content>
      <div className="pt-5 px-5">
        {loading ? (
          <section>
            <div className="flex items-center justify-between">
              <div className="border-2 rounded-md p-5 border-[#f50400] w-1/2">
                <h1 className="text-[#f50400] text-xl font-bold text-center">
                  YOUR'S ORDER
                </h1>
                <div className="flex items-center justify-between border-b-2 border-gray-200">
                  <h5 className="text-[18px] uppercase font-bold">Product</h5>
                  <h5 className="text-[18px] uppercase font-bold">Sub Total</h5>
                </div>
                {booked.map((data) => (
                  <div key={data._id}>
                    <div className="flex items-center pt-5 justify-between border-b-2 border-gray-200">
                      <h5 className="text-gray-900 flex items-center gap-1">
                        {data?.productName}{" "}
                        <FaPlus
                          size={12}
                          className="rotate-45"
                          color="#111827"
                        />{" "}
                        {data.quantity}
                      </h5>
                      <h5 className="uppercase font-bold">
                        {data?.price * data.quantity}৳
                      </h5>
                    </div>
                  </div>
                ))}
                <div className="flex items-center pt-2 justify-between">
                  <h5 className="text-[17px] uppercase font-bold">sub Total</h5>
                  <h5 className="text-[17px] uppercase font-bold">
                    {subTotal}৳
                  </h5>
                </div>
                {/* Shipping */}
                <div className="pt-4 w-full">
                  <span className="flex items-center">
                    <span className="h-[2px] flex-1 bg-gray-200"></span>
                    <span className="shrink-0 px-6  font-semibold">
                      Shipping
                    </span>
                    <span className="h-[2px] flex-1 bg-gray-200"></span>
                  </span>

                  {/* cost inside sylhet*/}
                  <div className="bg-neutral-200 mt-5">
                    <Radio
                      className="flex gap-1 text-[16px] items-center w-full p-2 rounded-sm"
                      value={60}
                      checked={shippingCost === 60} // Check if selected
                      onChange={() => setShippingCost(60)} // Update shipping cost
                    >
                      <span>Inside Dhaka City: </span>
                      <span className="font-semibold inline-flex gap-0 items-center">
                        60
                        <span>
                          <TbCurrencyTaka size={20} />
                        </span>
                      </span>
                    </Radio>
                  </div>
                  <div className="bg-neutral-200 mt-2">
                    <Radio
                      className="flex gap-1 text-[16px] items-center w-full p-2 rounded-sm"
                      value={120}
                      checked={shippingCost === 120} // Check if selected
                      onChange={() => setShippingCost(120)} // Update shipping cost
                    >
                      <span>Outside Dhaka City: </span>
                      <span className="font-semibold inline-flex gap-0 items-center">
                        120
                        <span>
                          <TbCurrencyTaka size={20} />
                        </span>
                      </span>
                    </Radio>
                  </div>
                  <div className="bg-neutral-200 mt-2 p-2 px-2 flex justify-between items-start font-bold uppercase text-[16px]">
                    <h2>Total</h2>
                    <h2>{totalCost}৳</h2>
                  </div>
                </div>
              </div>

              <div className="w-1/2">
              
                <h1 className="text-[#f50400] text-xl font-bold text-center">
                  BILLING & SHIPPING
                </h1>

                <Form
                  name="register"
                  layout="vertical"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 35 }}
                  className="space-y-4 px-5"
                  onFinish={onFinish}
                >
                  <Form.Item
                    name="text"
                    rules={[
                      { required: true, message: "Please input your Name" },
                      { type: "string", message: "Please enter a valid Name " },
                    ]}
                  >
                    <Input
                      className="py-2  font-semibold text-xl"
                      placeholder="Enter your Transition ID "
                    />
                  </Form.Item>
                </Form>
              </div>
            </div>
          </section>
        ) : (
          <>
            <LoadingSpinner />
          </>
        )}
      </div>
    </Content>
  );
};

export default CheckOut;
