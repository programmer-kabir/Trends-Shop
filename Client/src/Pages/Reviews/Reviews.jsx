import React, { useEffect, useState } from "react";
import { Button, Divider, Form, Input, Modal } from "antd";
import Rating from "react-rating";
import { AiFillStar, AiOutlineUserAdd } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../Redux/Reviews/reviewsSlice";
import { useParams } from "react-router-dom";

const Reviews = ({ onFinish, setRating }) => {
  const { id } = useParams();
  // console.log(id);
  const dispatch = useDispatch();
  const { isLoading, Reviews, error } = useSelector((state) => state.Reviews);

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch,Reviews]);
  const currentData = Reviews.filter((review) => review.productId === id);

  return (
    <div className="py-8">
      <div>
        <span className="flex items-center">
          <span className="h-px flex-1 bg-black"></span>
          <span className="shrink-0 px-3 uppercase  font-semibold text-[#0284C7]">
            Review's
          </span>
          <span className="h-px flex-1 bg-black"></span>
        </span>
      </div>
      {/* Show */}
      <div className="">
        {currentData.map((review) => (
          <div key={review._id} className="border rounded-md  mt-5 p-5">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex  items-center gap-3">
                <AiOutlineUserAdd />
                <h2>{review.name}</h2>
              </div>
              <div className="mt-1">
                <Rating
                  readonly
                  placeholderRating={review?.rating}
                  emptySymbol={<AiFillStar color="#D6D6D6" size={20} />}
                  placeholderSymbol={<AiFillStar color="#FF9933" size={20} />}
                  fullSymbol={<AiFillStar color="#FF9933" size={20} />}
                />
              </div>
            </div>
            <div className="pt-1">
              <p className="font-light text-sm">{review?.Reviews}</p>
            </div>
          </div>
        ))}
      </div>
      <Form
        name="register"
        layout="vertical"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 35 }}
        className="space-y-4 px-5 py-5 mt-7 border rounded-md"
        onFinish={onFinish}
      >
        <div className="mt-1">
          <label className="block text-sm text-gray-700 mb-1">
            <span className="text-red-500">* </span>Rating
          </label>
          <Rating
            emptySymbol={<AiFillStar color="#D6D6D6" size={20} />}
            placeholderSymbol={<AiFillStar color="#FF9933" size={20} />}
            fullSymbol={<AiFillStar color="#FF9933" size={20} />}
            onChange={(value) => setRating(value)} // Update rating state on change
          />
        </div>
        <Form.Item
          label="Reviews"
          name="Reviews"
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
