import React, { useContext, useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { fetchCategories } from "../../Redux/Categories/categoriesSlice";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { fetchBooked } from "../../Redux/Booked/bookedSlice";
import { FavoritesContext } from "../../../Provider/FavoritesContext";
import { useTheme } from "../../../Provider/ThemeContext";
import AnnouncementBar from "../../../Components/Home/Announcement/AnnouncementBar";

const Navbar = () => {
  const { user, logOut, loading } = useAuth();
  const [letter, setLetter] = useState("");
  const [nav, setNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navSearch, setNavSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoading, Users, error } = useSelector((state) => state.Users);
  const { Categories = [] } = useSelector((state) => state.Categories || {});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchBooked(user?.email));
    dispatch(fetchCategories());
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

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/products/ALL?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch("");
    }
  };

  const getSafeSubName = (sub) =>
    typeof sub === "object" && sub !== null ? sub.name || sub.title || "" : String(sub || "");

  const MensItems = useMemo(() => {
    const defaultItems = [
      { name: "All Men's Footwear", link: "/products/MEN'S" },
      { name: "Formal Shoes (Oxford & Derby)", link: "/products/MAN'S-FORMAL" },
      { name: "Casual Loafers & Slip-ons", link: "/products/MAN'S-CASUAL" },
      { name: "Sports & Athletic Shoes", link: "/products/MAN'S-SPORT" },
    ];
    const cat = Categories.find(
      (c) =>
        ((c.department || c.gender) === "MEN'S" || c.name.toLowerCase().includes("men")) &&
        !c.name.toLowerCase().includes("women")
    );
    if (!cat || !cat.subcategories || cat.subcategories.length === 0) {
      return defaultItems;
    }
    return [
      { name: "All Men's Footwear", link: "/products/MEN'S" },
      ...cat.subcategories.map((sub) => {
        const subName = getSafeSubName(sub);
        return {
          name: subName,
          link: `/products/${encodeURIComponent(subName.replace(/\s+/g, "-"))}`,
        };
      }),
    ];
  }, [Categories]);

  const WomensItems = useMemo(() => {
    const defaultItems = [
      { name: "All Women's Footwear", link: "/products/WOMEN'S" },
      { name: "Formal Heels & Pumps", link: "/products/WOMEN'S-FORMAL" },
      { name: "Casual Loafers & Flats", link: "/products/WOMEN'S-CASUAL" },
      { name: "Sports & Running Shoes", link: "/products/WOMEN'S-SPORT" },
    ];
    const cat = Categories.find(
      (c) =>
        (c.department || c.gender) === "WOMEN'S" || c.name.toLowerCase().includes("women")
    );
    if (!cat || !cat.subcategories || cat.subcategories.length === 0) {
      return defaultItems;
    }
    return [
      { name: "All Women's Footwear", link: "/products/WOMEN'S" },
      ...cat.subcategories.map((sub) => {
        const subName = getSafeSubName(sub);
        return {
          name: subName,
          link: `/products/${encodeURIComponent(subName.replace(/\s+/g, "-"))}`,
        };
      }),
    ];
  }, [Categories]);

  const KidsItems = useMemo(() => {
    const defaultItems = [
      { name: "All Kid's Footwear", link: "/products/KID'S" },
      { name: "School & Formal Shoes", link: "/products/KID'S-FORMAL" },
      { name: "Casual Slip-ons & Loafers", link: "/products/KID'S-CASUAL" },
      { name: "Active Runners & Trainers", link: "/products/KID'S-SPORT" },
    ];
    const cat = Categories.find(
      (c) => (c.department || c.gender) === "KID'S" || c.name.toLowerCase().includes("kid")
    );
    if (!cat || !cat.subcategories || cat.subcategories.length === 0) {
      return defaultItems;
    }
    return [
      { name: "All Kid's Footwear", link: "/products/KID'S" },
      ...cat.subcategories.map((sub) => {
        const subName = getSafeSubName(sub);
        return {
          name: subName,
          link: `/products/${encodeURIComponent(subName.replace(/\s+/g, "-"))}`,
        };
      }),
    ];
  }, [Categories]);
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
        {!scrolled && <AnnouncementBar />}
        <Content>
          <div className="mx-auto">
            <div className="py-3 md:py-2 flex justify-between items-center">
              <Link to="/" className="flex items-center gap-2">
                <img
                  className="h-9 md:h-11 w-auto object-contain dark:invert dark:hue-rotate-180 transition-all duration-300"
                  src={logo}
                  alt="Trends Shop"
                />
              </Link>

              <div className="hidden md:flex gap-6 items-center">
                <DropDown name="Men's" items={MensItems} />
                <DropDown name="Women's" items={WomensItems} />
                <DropDown name="Kid's" items={KidsItems} />
              </div>

              <div className="flex items-center space-x-4 md:space-x-5">
                {/* Search */}
                <form
                  onSubmit={handleNavSearch}
                  className="w-56 lg:w-64 py-1.5 px-3 hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 rounded-full transition-all focus-within:ring-2 focus-within:ring-amber-500"
                >
                  <FiSearch className="text-slate-400 dark:text-slate-300 text-lg cursor-pointer" onClick={handleNavSearch} />
                  <input
                    type="search"
                    value={navSearch}
                    onChange={(e) => setNavSearch(e.target.value)}
                    placeholder="Search luxury shoes..."
                    className="w-full text-sm outline-none bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </form>

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
                        className="text-slate-800 dark:text-slate-100 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                <div
                  className={
                    nav
                      ? "fixed right-0 top-0 w-full overflow-auto h-full text-center md:hidden bg-white dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 ease-in-out duration-500 z-50 shadow-2xl"
                      : "ease-in-out duration-500 w-full h-full top-0 fixed overflow-auto right-[-100%] z-50"
                  }
                >
                  <div className="px-5 text-left pb-16">
                    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-white/10">
                      <Link to="/" onClick={handleNav}>
                        <img
                          className="h-9 w-auto object-contain dark:invert dark:hue-rotate-180"
                          src={logo}
                          alt="Trends Shop"
                        />
                      </Link>
                      <button
                        onClick={handleNav}
                        className="p-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-amber-500 transition-colors"
                      >
                        <RxCross2 size={24} />
                      </button>
                    </div>

                    <div className="flex flex-col justify-center items-start pt-6 font-medium space-y-3">
                      <MobileDropDown name="Men's" items={MensItems} />
                      <MobileDropDown name="Women's" items={WomensItems} />
                      <MobileDropDown name="Kid's" items={KidsItems} />
                    </div>

                    <Link to="/products/MAN'S-FORMAL" onClick={handleNav}>
                      <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl mt-8 flex justify-center gap-2 items-center px-5 py-3 shadow-lg shadow-amber-500/25 transition-all">
                        <span>Explore Collection</span>
                        <MdArrowForwardIos size={16} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              {isSidebarOpen && (
                <div 
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity flex justify-end"
                  onClick={toggleSidebar}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-[380px] bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-100 h-full shadow-2xl p-6 flex flex-col justify-between transform transition-transform duration-300 border-l border-slate-200 dark:border-white/10"
                  >
                    <div>
                      <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-white/10">
                        <h2 className="text-base font-extrabold tracking-wide uppercase">Shopping Bag</h2>
                        <button
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                          onClick={toggleSidebar}
                        >
                          <RxCross2 size={20} />
                        </button>
                      </div>

                      <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
                          <FiShoppingCart size={32} />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Your Cart is Empty</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[220px]">
                          Discover our handcrafted collection of luxury leather footwear.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
                      <Link
                        to="/products/ALL"
                        onClick={toggleSidebar}
                        className="w-full block py-3 text-center text-xs font-bold uppercase tracking-wider rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 transition-all"
                      >
                        Explore Footwear Shop
                      </Link>
                      <button
                        onClick={toggleSidebar}
                        className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                      >
                        Continue Browsing
                      </button>
                    </div>
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
