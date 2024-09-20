import React, { useEffect, useState } from "react";
import { GrFormEdit } from "react-icons/gr";
import District from "../../../Components/Apis/Distric";
import Division from "../../../Components/Apis/Division";
import upZillah from "../../../Components/Apis/upZillah";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { fetchUser } from "../../Redux/Users/userSlice";
import { fetchShoes } from "../../Redux/Shoes/shoesSlice";
import useAuth from "../../../Components/Hooks/useAuth";
const MyProfile = () => {
  const dispatch = useDispatch();
  const { isLoading, Users, error } = useSelector((state) => state.Users);

  useEffect(() => {
    dispatch(fetchUser());
  }, [Users]);
  const { user } = useAuth()
  const matchingUsers = Users.filter(
    (userData) => userData.email === user?.email
  );
  // const matchingUsers = ''
  const {
    handleSubmit,
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm();
  const [district] = District();
  const [division] = Division();
  const [upZillahs] = upZillah();
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpzillah, setSelectedUpzillah] = useState("");
  const selectedDivisionId = division.find(
    (div) => div.name === selectedDivision
  )?.id;
  // console.log("selectedDistrict", selectedDistrict);
  const districtsInSelectedDivision = selectedDivisionId
    ? district.filter((dist) => dist.division_id === selectedDivisionId)
    : [];

  // Upzillah
  const upzillahsInSelectedDistrict = selectedDistrict
    ? upZillahs.filter((upzillah) => upzillah.district_id === selectedDistrict)
    : [];
  useEffect(() => {
    // console.log("Divisions:", division);
  }, [division]);
  let firstName;
  let lastName;
  const addedPhoneNumber = async () => {
    const email = user?.email;
    // Get the input element by its ID
    const phoneNumberInput = document.getElementById("number");
    const number = phoneNumberInput.value
    // Log the input value to the console
    
    const data = {email, number};
    console.log(data);
    const response = await axios
      .put(
        `${import.meta.env.VITE_LOCALHOST_KEY}/users`,
        data
      )
      .then((data) => {
        // console.log(data.data);
        if (data.data.modifiedCount > 0) {
          // dispatch(updateUser(data));
          phoneNumberInput.value = '';
          toast.success("Successfully Your Number added");
        }
      });
  };
  const [isEditMode, setEditMode] = useState(false);
  
  const onSubmit = async (data) => {
    // console.log(data);
    const name = data.firstName + " " + lastName;
    console.log(name);

    const districtId = data.district;
    const districts = district.find((dis) => dis.id === districtId);
    const districtName = districts.name;
    // console.log(data.date);
    name;
    data.district = districtName;
    const response = await axios
      .put(`${import.meta.env.VITE_LOCALHOST_KEY}/users`, data)
      .then((data) => {
        console.log(data.data);
        if (data.data.modifiedCount > 0) {
          toast.success("Successfully Your Data Update");
          setEditMode(false);
        }
      });
  };
  return (
    <div>
      <div className="px-5 pt-7 ">
        <div className="">
          <h2 className="text-xl font-semibold">ACCOUNT INFORMATION</h2>
          <p className="text-gray-700 text-sm">
            This section contains your personal information
          </p>

          {/* Profile */}
          <div className="pt-10 ">
            <div
              className="py-5 bg-white w-2/3"
              style={{
                boxShadow:
                  "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
              }}
            >
              <div className="flex justify-between px-6 ">
                <p className="text-xl  font-semibold">Personal Information</p>
                <button
                  className="px-4 bg-black py-2 rounded-md text-white"
                  onClick={() => setEditMode(!isEditMode)} // Toggle edit mode
                >
                  {isEditMode ? "Cancel" : "Edit"}
                </button>
              </div>
              <div className="w-full gap-2 flex">
                {/* Add more dropdowns or inputs as needed */}
              </div>
              <hr className="my-5" />

              {isEditMode ? (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="px-5 space-y-4"
                >
                  {/* First Name */}
                  <label
                    htmlFor="firstName"
                    className={`relative block overflow-hidden rounded border ${
                      errors.firstName ? "border-red-500" : "border-gray-600"
                    } px-3 pt-3 shadow-sm outline-none`}
                  >
                    <input
                      type="text"
                      id="firstName"
                      defaultValue={firstName}
                      {...register("firstName")}
                      placeholder="First Name"
                      className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent  focus:outline-none focus:ring-0 sm:text-sm"
                    />

                    <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs">
                      First Name*
                    </span>
                  </label>
                 
                  {/* Email */}
                  <label
                    htmlFor="email"
                    className={`relative block overflow-hidden rounded border ${
                      errors.email ? "border-red-500" : "border-gray-600"
                    } px-3 pt-3 shadow-sm outline-none`}
                  >
                    <input
                      type="email"
                      id="email"
                      {...register("email", { required: true })}
                      defaultValue={matchingUsers[0]?.email}
                      readOnly
                      placeholder="Email"
                      className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                    />

                    <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs">
                      Email*
                    </span>
                  </label>
                  {/* Gender */}
                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Gender
                    </label>

                    <select
                      name="gender"
                      id="gender"
                      {...register("gender", { required: true })}
                      defaultValue={matchingUsers?.gender}
                      className={`border ${
                        errors.date
                          ? "border-red-500 outline-none"
                          : "border-gray-700"
                      } w-full py-2 rounded px-3`}
                    >
                      <option value="" selected disabled>
                        Please select
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                 
                  {/* Division and District */}
                  <div className="w-full gap-2 flex">
                    <div className="w-1/2">
                      <label
                        htmlFor="division"
                        className={`relative block  overflow-hidden rounded border ${
                          errors.divison
                            ? "border-red-500 "
                            : "border-gray-600 "
                        } px-3 pt-3 shadow-sm outline-none `}
                      >
                        <select
                          id="division"
                          {...register("divison", { required: true })}
                          defaultValue={matchingUsers[0]?.divison}
                          value={selectedDivision}
                          onChange={(e) => setSelectedDivision(e.target.value)}
                          className=" rounded-xl h-8 w-full border-none bg-transparent p-0 placeholder-transparent text-lg outline-none"
                        >
                          <option value="" disabled>
                            Select Division
                          </option>
                          {division.map((divisions) => (
                            <option key={divisions.id} value={divisions.name}>
                              {divisions.name}
                            </option>
                          ))}
                        </select>

                        <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs">
                          Division*
                        </span>
                      </label>
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="district"
                        className={`relative block overflow-hidden rounded border ${
                          errors.district ? "border-red-500" : "border-gray-600"
                        } px-3 pt-3 shadow-sm outline-none`}
                      >
                        <select
                          id="district"
                          {...register("district", { required: true })}
                          defaultValue={matchingUsers[0]?.district}
                          value={selectedDistrict}
                          onChange={(e) => setSelectedDistrict(e.target.value)}
                          className=" rounded-xl h-8 w-full border-none bg-transparent p-0 placeholder-transparent text-lg outline-none"
                        >
                          <option value="" disabled>
                            Select District
                          </option>
                          {districtsInSelectedDivision.map((district) => (
                            <option key={district.id} value={district.id}>
                              {district.name}
                            </option>
                          ))}
                        </select>

                        <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs">
                          District*
                        </span>
                      </label>
                    </div>
                  </div>
                  {/* Upzillah and village */}
                  <div className="flex gap-2 w-full">
                    <div className="w-1/2">
                      <label
                        htmlFor="upZillah"
                        className={`relative block overflow-hidden rounded border ${
                          errors.upZillah ? "border-red-500" : "border-gray-600"
                        } px-3 pt-3 shadow-sm outline-none`}
                      >
                        <select
                          id="upZillah"
                          {...register("upZillah", { required: true })}
                          defaultValue={matchingUsers[0]?.upZillah}
                          value={selectedUpzillah}
                          onChange={(e) => setSelectedUpzillah(e.target.value)}
                          className=" rounded-xl h-8 w-full border-none bg-transparent p-0 placeholder-transparent text-lg outline-none"
                        >
                          <option value="" disabled>
                            Select up zillah
                          </option>
                          {upzillahsInSelectedDistrict.map((upzillah) => (
                            <option key={upzillah.id} value={upzillah.name}>
                              {upzillah.name}
                            </option>
                          ))}
                        </select>

                        <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs">
                          Select up zillah
                        </span>
                      </label>
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="village"
                        className={`relative block overflow-hidden rounded border ${
                          errors.village ? "border-red-500" : "border-gray-600"
                        } px-3 pt-3 shadow-sm outline-none`}
                      >
                        <input
                          type="text"
                          {...register("village", { required: true })}
                          defaultValue={matchingUsers[0]?.village}
                          id="village"
                          placeholder="village Name"
                          className=" rounded-xl h-8 w-full border-none bg-transparent p-0 placeholder-transparent text-lg outline-none"
                        />

                        <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs">
                          village Name*
                        </span>
                      </label>
                    </div>
                  </div>

                  <button className="bg-black px-3 py-3 rounded-md text-white">
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="px-5  flex justify-between">
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-800">First Name</p>
                      <p className="font-semibold">{matchingUsers[0]?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-800">Email</p>
                      <p className="font-semibold">{matchingUsers[0]?.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-800">Gender</p>
                      <p className="font-semibold">
                        {matchingUsers[0]?.gender
                          ? matchingUsers[0]?.gender
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-800">Division Name</p>
                      <p className="font-semibold">
                        {matchingUsers[0]?.divison
                          ? matchingUsers[0]?.divison
                          : "N/A"}
                      </p>
                    </div>
                    
                    {/*  */}
                    <div>
                      <p className="text-gray-800">Village Name</p>
                      <p className="font-semibold">
                        {matchingUsers[0]?.village
                          ? matchingUsers[0]?.village
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                  
                    <div>
                      <p className="text-gray-800">Phone Number</p>
                      <p className="font-semibold">
                        {matchingUsers[0]?.number
                          ? matchingUsers[0]?.number
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-800">Others Phone Number</p>
                      <p className="font-semibold">
                        {matchingUsers[0]?.otherNumber
                          ? matchingUsers[0]?.otherNumber
                          : "N/A"}
                      </p>
                    </div>
                   
                    <div>
                      <p className="text-gray-800">District Name</p>
                      <p className="font-semibold">
                        {matchingUsers[0]?.district
                          ? matchingUsers[0]?.district
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-800">Up Zillah Name</p>
                      <p className="font-semibold">
                        {matchingUsers[0]?.upZillah
                          ? matchingUsers[0]?.upZillah
                          : "N/A"}
                      </p>
                    </div>
                    
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Add a Phone Number */}
          {!isEditMode && (
            <div className="my-7 w-2/3">
              <div
                className="py-5 "
                style={{
                  boxShadow:
                    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                }}
              >
                <p className="text-xl px-6 font-semibold">Add Phone Number</p>
                <hr className="my-5" />
                <div className="px-5 space-y-3">
                  {/* input Number */}
                  <label
                    htmlFor="number"
                    className="relative block overflow-hidden rounded border border-gray-600 px-3 pt-3 shadow-sm outline-none"
                  >
                    <input
                      type="number"
                      id="number"
                      placeholder="Phone Number"
                      defaultValue={matchingUsers[0]?.number}
                      className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                    />

                    <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs">
                      Phone Number*
                    </span>
                  </label>
                  <button
                    onClick={addedPhoneNumber}
                    className="w-full bg-black text-white py-3 rounded-md text-center"
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
