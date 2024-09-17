import React from 'react'
import SocialIcons from './SocialIcons'
import { Link } from 'react-router-dom'
import SubscribeInput from './SubscripeInput'

const Footer = () => {
  return (
    <div>
       <div className="w-full bg-slate-800 mt-10 pt-12">
      <div className=" mx-auto md:flex justify-between items-start p-10 space-y-5 md:space-y-0 gap-5 ">
        <div className="leading-7 flex-shrink-0 w-full md:w-1/3">
          <div className="flex flex-col justify-start items-start " > 

          <div> <h5 className=" font-semibold text-gray-200 tracking-wide border-b-2 border-[#bb6e6e]">
            ABOUT US
          </h5>
          <p className="text-balance text-sm mt-3 text-gray-200">
            Trendy is premium leather shoes and fashion accessories kingdom. We
            provide the best quality shoes and accessories for ladies and gents.
          </p></div>
          <div> <SubscribeInput /></div>

          </div>
        </div>
        <div className="leading-7 flex-shrink-0 w-full md:w-1/3">
         <div>  
          

         <div>  <h5 className="text-gray-200 font-semibold tracking-wide border-b-2 border-[#bb6e6e]">
            POLICY
          </h5>
          <div className="mt-3 space-y-2">
            <Link
              to="/complain"
              className="inline-block focus:outline-none text-sm hover:text-[#b35c5c] text-balance text-gray-200"
            >
              Exchange & Complaint
            </Link>
            <Link
              to="/"
              className="inline-block focus:outline-none ms-3 text-sm hover:text-[#b35c5c] text-balance text-gray-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/"
              className="inline-block focus:outline-none text-sm hover:text-[#b35c5c] text-balance text-gray-200"
            >
              Terms and Conditions
            </Link>
          </div> </div>
         <div>  <img src="https://voguesultana.com/images/payments.png" height={100}  width={400} alt="logo" /> </div>
          
             </div>
         
        </div>
        <div className="leading-7 flex-shrink-0 w-full md:w-1/3">
        <div className="flex flex-col justify-start items-start">  <div className="mb-8">
          <h5 className="text-gray-200 font-semibold tracking-wide border-b-2 border-[#bb6e6e]">
            CONNECT WITH US
          </h5>
          <p className="text-balance text-gray-200 text-sm mt-3">
            Join Our Facebook Group Richkid <br /> Offer and Review and Like Our Page.
          </p>
          </div>
         <div> <SocialIcons /></div></div>
        </div>
      </div>
     
      <div className="bg-gray-700 text-white text-sm">
        <p className="text-center text-balance pt-2 pb-2">
          Copyright © 2024 | Trendy Lifestyle
        </p>
      </div>
    </div>
    </div>
  )
}

export default Footer