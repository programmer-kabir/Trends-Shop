import React, { useState } from "react";
import { Button, Divider, Form, Input, Modal } from "antd";
import { Link } from "react-router-dom";
import Rating from "react-rating";
import { AiFillStar } from "react-icons/ai";

const Reviews = ({ onFinish, setRating }) => {
  return (
    <div className="py-8">
      <Form
        name="register"
        layout="vertical"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 35 }}
        className="space-y-4 px-5"
        onFinish={onFinish}
      >
        <Form.Item
          label="Name"
          name="Name"
          rules={[
            { required: true, message: "Please enter your name" },
            {
              type: "text",
              message: "Please enter your name",
            },
          ]}
        >
          <Input placeholder="Enter your Name" />
        </Form.Item>
        <div className="mt-1">
          <label className="block text-sm text-gray-700 mb-1">
            <span className="text-red-500">* </span>Rating
          </label>
          <Rating
            emptySymbol={<AiFillStar color="#D6D6D6" size={16} />}
            placeholderSymbol={<AiFillStar color="#FF9933" size={16} />}
            fullSymbol={<AiFillStar color="#FF9933" size={16} />}
            onChange={(value) => setRating(value)} // Update rating state on change
          />
        </div>
        <Form.Item
          label="Description"
          name="Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea placeholder="Write your's reviews......" />
        </Form.Item>

        <Form.Item>
          <Button
            className="bg-[#f50400] text-white font-semibold uppercase"
            htmlType="submit"
            block
          >
            Submit Reviews
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Reviews;
