import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import {
  FaArrowRightToBracket,
  FaCodeCompare,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa6";
import { FiSearch, FiShoppingCart, FiUser, FiSun, FiMoon } from "react-icons/fi";
import { BsBagPlus } from "react-icons/bs";
import logo from "../../../assets/LOGO/LOGO.png";
import DropDown from "../../../Components/Design/DropDown";
import { RxCross2 } from "react-icons/rx";
import MobileDropDown from "../../../Components/Design/MobileDropDown";
import { MdArrowForwardIos, MdDashboard } from "react-icons/md";
import { LuUser2 } from "react-icons/lu";
import Content from "../../../Components/Content/Content";
import { TbCurrencyTaka } from "react-icons/tb";
import useAuth from "../../../Components/Hooks/useAuth";
import LoadingSpinner from "../../../Components/Design/LoadingSpinner/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../Redux/Users/userSlice";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { fetchBooked } from "../../Redux/Booked/bookedSlice";
import { FavoritesContext } from "../../../Provider/FavoritesContext";
import { useTheme } from "../../../Provider/ThemeContext";
const Navbar = () => {
  const { user, logOut, loading } = useAuth();
  const [letter, setLetter] = useState("");
  const [nav, setNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoading, Users, error } = useSelector((state) => state.Users);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchBooked(user?.email));
  }, [dispatch]);
  
  const currentUser =
    !isLoading && Users && user
      ? Users.filter((users) => users.email === user.email)
      : [];

  const handleNav = () => {
    setNav(!nav);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === "/" && window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (user && user.email) {
      const firstLetter = user.email.charAt(0).toUpperCase();
      setLetter(firstLetter);
    } 
  }, [user]);

  const MensItems = [
    { name: "CASUAL", link: "products/MAN'S-CASUAL" },
    { name: "FORMAL", link: "products/MAN'S-FORMAL" },
    { name: "SPORTS", link: "products/MAN'S-SPORT" },
  ];
  const WomensItems = [
    { name: "CASUAL", link: "products/WOMEN'S-CASUAL" },
    { name: "FORMAL", link: "products/WOMEN'S-FORMAL" },
    { name: "SPORTS", link: "products/WOMEN'S-SPORT" },
  ];
  const KidsItems = [
    { name: "FORMAL", link: "products/KID'S-FORMAL" },
    { name: "CASUAL", link: "products/KID'S-CASUAL" },
    { name: "SPORTS", link: "products/KID'S-SPORT" },
  ];
  const handleSignOut = () => {
    logOut();
  };

  const { favoriteTShirtCount } = useContext(FavoritesContext);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-white dark:bg-[#0B0F19] transition-colors">
      <nav
        className={`w-[100%] fixed top-0 left-0 right-0 bg-white/95 dark:bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-100 dark:border-white/10 z-50 mx-auto transition-all duration-300 ${
          scrolled ? "shadow-md" : ""
        } text-slate-800 dark:text-slate-100`}
      >
        <Content>
          <div className="mx-auto">
            <div className="py-3 md:py-2 flex justify-between items-center">
              <Link to="/" className="flex items-center gap-2">
                <img className="h-9 md:h-11 w-auto object-contain dark:brightness-110" src={logo} alt="Trends Shop" />
              </Link>

              <div className="hidden md:flex gap-6 items-center">
                <DropDown name="Men's" items={MensItems} />
                <DropDown name="Women's" items={WomensItems} />
                <DropDown name="Kid's" items={KidsItems} />
              </div>

              <div className="flex items-center space-x-4 md:space-x-5">
                {/* Search */}
                <div className="w-56 lg:w-64 py-1.5 px-3 hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 rounded-full transition-all focus-within:ring-2 focus-within:ring-amber-500">
                  <FiSearch className="text-slate-400 dark:text-slate-300 text-lg" />
                  <input
                    type="search"
                    placeholder="Search premium shoes..."
                    className="w-full text-sm outline-none bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Dark / Light Mode Toggle Button */}
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle Theme"
                  className="p-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 transition-transform active:scale-95 shadow-sm"
                  title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {theme === "dark" ? <FiSun size={19} /> : <FiMoon size={19} />}
                </button>

                {/* Wishlist */}
                <Link to="/wishlist" className="relative p-2 text-slate-700 dark:text-slate-200 hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                  <FaRegHeart size={21} />
                  {favoriteTShirtCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-[11px] font-bold text-white bg-amber-500 rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-pulse">
                      {favoriteTShirtCount}
                    </span>
                  )}
                </Link>

                {/* User / Dashboard / Login */}
                <div className="flex items-center gap-2">
                  {user ? (
                    <>
                      <Link
                        to={currentUser[0]?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
                        className="p-2 text-slate-700 dark:text-slate-200 hover:text-amber-500 transition-colors"
                        title="Dashboard"
                      >
                        <MdDashboard size={22} />
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="border border-amber-500/30 hover:border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white rounded-lg flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300"
                      >
                        <LuUser2 size={16} />
                        <span className="hidden sm:inline">Logout</span>
                      </button>
                    </>
                  ) : (
                    <Link to="/login">
                      <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300">
                        <LuUser2 size={16} />
                        <span>Login</span>
                      </button>
                    </Link>
                  )}
                </div>

                {/* Mobile Hamburger */}
                <div onClick={handleNav} className="block md:hidden cursor-pointer p-1 text-slate-700 dark:text-slate-200">
                  {nav ? (
                    <p />
                  ) : (
                    <div className="flex items-center gap-2 font-semibold">
                      <HiOutlineMenuAlt3
                        size={30}
                        className="text-black cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                <div
                  className={
                    nav
                      ? "fixed right-0  top-0 w-full overflow-auto  h-full text-center md:hidden bg-white  border-r-gray-900 ease-in-out duration-500"
                      : "ease-in-out duration-500 w-full h-full top-0 fixed overflow-auto right-[-100%]"
                  }
                >
                  <div className="px-5 text-left pb-16">
                    <div className="flex items-center justify-between py-3 ">
                      <Link to="/" className="">
                        <img className="w-1/3" src={logo} alt="" />
                        {/* <h2 className="text-2xl text-black font-semibold ">MernShop</h2> */}
                      </Link>
                      <button onClick={handleNav}>
                        <RxCross2
                          size={40}
                          className="primaryColor cursor-pointer hover:text-white border p-2 transition-background transition-text  duration-300 ease-in-out  hover:bg-[#F62977] rounded-full "
                        />
                      </button>
                    </div>
                    <div className="flex flex-col justify-center items-start pt-10 font-medium space-y-3 ">
                      <MobileDropDown name="Mens's" items={MensItems} />
                      <MobileDropDown name="Womens's" items={WomensItems} />
                      <MobileDropDown name="Kid's" items={KidsItems} />
                    </div>
                    <button className="bg-[#F50963] mt-8 flex gap-2 items-center px-5 py-3">
                      <p className=" font-medium">Getting Started </p>
                      <MdArrowForwardIos size={20} />
                    </button>
                    {/*  */}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              {isSidebarOpen && (
                <div className="fixed top-0 bottom-0 flex justify-end left-0 right-0 bg-black bg-opacity-50 z-50 transition-opacity ease-in-out duration-500">
                  <div
                    className={`w-[360px]   bg-white h-full  transform transition-transform duration-500 ease-in-out ${
                      isSidebarOpen
                        ? "translate-x-0 overflow-auto bg-white transition-all duration-700 ease-in-out"
                        : "translate-x-full transition-all bg-white 0.3s ease-in-out"
                    }`}
                  >
                    <div className="flex justify-between p-5">
                      <h2 className="text-base font-medium">SHOPPING CART</h2>
                      <button
                        className="flex items-center gap-2 hover:text-blue-500"
                        onClick={toggleSidebar}
                      >
                        <span className="text-base">close</span>
                        <FaArrowRightToBracket size={20} />
                      </button>
                    </div>
                    <div className="mt-32 border-b-2 pb-7 flex px-10 items-center flex-col justify-center ">
                      <img
                        className="p-2"
                        src="https://i.ibb.co/8XZwct2/empty-cart.png"
                        alt=""
                      />
                      <p className="py-5 font-medium ">Your Cart is empty</p>
                      <button className="primaryButton w-[140px]">
                        Go To Shop
                      </button>
                    </div>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Qui, alias! Nobis provident sunt quod architecto tenetur
                    praesentium, doloremque quos neque quaerat repellendus id
                    accusamus pariatur ratione magnam accusantium ipsam animi?
                    Voluptatum neque sapiente officiis dolor tempore et, magnam
                    vel quia! Quos fugiat neque fuga quaerat vitae ducimus sunt
                    est impedit reprehenderit, a quae aut accusamus maxime
                    magnam suscipit veritatis, odit odio accusantium laboriosam
                    quisquam voluptates. Eos odit accusantium saepe cumque unde
                    excepturi nulla provident labore quia, pariatur impedit,
                    numquam ab veniam debitis perferendis corrupti! Quis minima,
                    quas eaque quibusdam perferendis dolorem non adipisci
                    molestiae corrupti a earum, doloremque, aperiam culpa
                    provident hic. Illum officia deserunt non ea corporis
                    temporibus dolore repellat aliquid nesciunt dignissimos?
                    Quas nisi pariatur necessitatibus sunt sit vitae dicta at
                    quaerat impedit officia illum nam et, dolores qui commodi
                    ipsam, sequi, minima eius totam veritatis soluta! Libero
                    placeat blanditiis porro cumque animi tempora soluta sunt,
                    minus eum?
                  </div>
                </div>
              )}
            </div>
          </div>
        </Content>
      </nav>
    </div>
  );
};

export default Navbar;
