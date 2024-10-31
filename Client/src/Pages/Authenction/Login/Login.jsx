import React, { useState } from "react";
import { Button, Divider, Form, Input, Modal } from "antd";
import { GiCheckMark } from "react-icons/gi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/LOGO/LOGO.png";
import { IoMdCopy } from "react-icons/io";
import toast from 'react-hot-toast'
import useAuth from "../../../Components/Hooks/useAuth";
const Login = () => {
  const {SingInUser,setLoading} = useAuth()

  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const onFinish = (values) =>{
    SingInUser(values.email, values.password)
    .then((result) => {
      const loggedUser = result.user;
      setLoading(false);
      toast.success('login successful')
      navigate(from , {replace:true})
    });
  };
  
  // Email
  const email1 = "admin@gmail.com";
  const email2 = "user@gmail.com";

  const handleEmailCopy = (email) => {
    navigator.clipboard.writeText(email)
      .then(() => {
        toast.success(`Email copied to clipboard!`);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  // Password
  const password1 = "admin123@#";
  const password2 = "user123@#";

  const handlePasswordCopy = (password) => {
    navigator.clipboard.writeText(password)
      .then(() => {
        toast.success(`Password copied to clipboard!`);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };


    return (
    <section className="mt-2 md:mt-12 md:lg:mt-20 md:px-20">
      <div className=" px-4 sm:px-2 w-full flex flex-col sm:flex-row justify-around gap-5 items-center">
        <div className="md:w-1/2">
          <h2 className="text-2xl uppercase">
            Discover all the
            <br />
            benefits
          </h2>
          <p className=" text-sm pt-8">
            Create an account to enhance your shopping experience whit the help
            of our customized services:
          </p>
          <div className="pt-6 ps-5 text-sm grid grid-flow-row gap-3">
            <p className="flex gap-2 items-center">
              <GiCheckMark className="text-[10px]"></GiCheckMark>Seep up to date
              with the latest news{" "}
            </p>
            <p className="flex gap-2 items-center">
              <GiCheckMark className="text-[10px]"></GiCheckMark>Buy faster
            </p>
            <p className="flex gap-2 items-center">
              <GiCheckMark className="text-[10px]"></GiCheckMark>Save your
              favorite products
            </p>
          </div>
          <div className=" mt-8">
            <p className="text-lg">DON'T HAVE AN ACCOUNT?</p>
            <p className="text-sm mt-5">
              Create an account and Register yourself as Club member! Only club
              members can enjoy exclusive benefits.
            </p>
          </div>
          <Link to="/register">
            <Button className="w-full border bg-[#f50400] font-semibold text-white rounded-md px-2 py-1.5  mt-5">
              Register Now
            </Button>
          </Link>
        </div>

        <Divider className="h-96 hidden md:flex" type="vertical" />

        <div className="md:w-1/2 pt-5 ">
          <div>
            <img className="w-1/4 mx-auto" src={logo} alt="" />
            <h1 className="text-2xl text-center text-[#f50400] font-semibold">
              Login Trands Shop
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
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters long",
                  },
                ]}
              >
                <Input.Password placeholder="Enter your password" />
              </Form.Item>
                <Link to="/forget-password">
                  <p className="text-end underline py-1">Forget Password?</p>
                </Link>

              <Form.Item>
                <Button
                  className="bg-[#f50400] text-white font-semibold uppercase"
                  htmlType="submit"
                  block
                >
                  Login now
                </Button>
                <div className="text-center mt-4 ">
                  New user?
                  <span className="text-blue-300">
                    <Link to="/register"> Register Here</Link>
                  </span>
                </div>
              </Form.Item>
            </Form>
          </div>
          <div>
            <Button
              onClick={showModal}
              className="text-emerald-500"
              type="dashed"
            >
              Show Login Credentials
            </Button>
            <Modal
              title="Login Credentials"
              open={open}
              onCancel={handleCancel}
            >
             {/* Admin */}
             <h2 className="text-xl font-medium pt-1">Admin Credentials</h2>
              <div className="text-base pt-5 flex items-center justify-between">
                <p>Email: {email1}</p>
                <Button onClick={() => handleEmailCopy(email1)} type="text" className="text-[#1677ff]">
                  <IoMdCopy size={20} className="rotate-180" />
                  <p>Copy Email</p>
                </Button>
              </div>
              <div className="text-base pt-5 flex items-center justify-between">
                <p>Password: {password1}</p>
                <Button onClick={() => handlePasswordCopy(password1)} type="text" className="text-[#1677ff]">
                  <IoMdCopy size={20} className="rotate-180" />
                  <p>Copy Password</p>
                </Button>
              </div>

              {/* User */}
              <h2 className="text-xl font-medium pt-1">User Credentials</h2>
              <div className="text-base pt-5 flex items-center justify-between">
                <p>Email: {email2}</p>
                <Button onClick={() => handleEmailCopy(email2)} type="text" className="text-[#1677ff]">
                  <IoMdCopy size={20} className="rotate-180" />
                  <p>Copy Email</p>
                </Button>
              </div>
              <div className="text-base pt-5 flex items-center justify-between">
                <p>Password: {password2}</p>
                <Button onClick={() => handlePasswordCopy(password2)} type="text" className="text-[#1677ff]">
                  <IoMdCopy size={20} className="rotate-180" />
                  <p>Copy Password</p>
                </Button>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
