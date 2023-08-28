"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { MdClose, MdOutlineShoppingCart } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import CustomButton from "../form/CustomButton";
import { AiOutlineBars, AiOutlineClose, AiOutlineHeart } from "react-icons/ai";
import { categoriesData, productData } from "@/utils/data";
import CategoriesData from "../CategoriesData";
import LoginIcon from "@mui/icons-material/Login";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import CartDrawer from "../CartDrawer";
import LogoutIcon from "@mui/icons-material/Logout";
import WishlistDrawer from "../WishlistDrawer";
import { useRouter } from "next/navigation";
import { getUser } from "@/redux/slices/userSlice";
import { getSeller } from "@/redux/slices/sellerSlice";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import Cookies from "universal-cookie";

function Navbar({ sellerToken }: { sellerToken: string | null }) {
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  const [showNav, setShowNav] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState<any>(null);
  const [toggleNavDropdown, setToggleNavDropdown] = useState(false);
  const [pos, setPos] = useState(0);
  const [showSearch, setshowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.cart);
  const { wishlist } = useAppSelector((state) => state.wishlist);

  const { data: session, status } = useSession();

  const auth = status === "authenticated";

  console.log(session);

  useEffect(() => {
    if (auth) {
      const token = session?.user.userToken;
      dispatch(getUser());
    }
    if (sellerToken) {
      dispatch(getSeller());
    }
  }, [auth, sellerToken]);

  useEffect(() => {
    window.addEventListener("scroll", function () {
      const currentScrollPos = window.pageYOffset;
      setPos(currentScrollPos);
      if (currentScrollPos > 10) {
        setShowNav(true);
      } else {
        setShowNav(false);
      }
    });
  }, []);

  const handleSearch = (e: any) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProduct =
      productData &&
      productData.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProduct);
  };

  const handleLogout = async () => {
    const cookies = new Cookies();
    cookies.remove("token", { path: "/" });
    await signOut({ callbackUrl: "/" });
  };

  const toggleCartModal = () => {
    setShowCart((prev) => !prev);
  };

  const toggleWishlistModal = () => {
    setShowWishlist((prev) => !prev);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const closeMobileNav = () => {
    setToggleNavDropdown(false);
  };

  return (
    <div
      style={{
        transform: `${!showNav ? `translateY(${-pos}px)` : "translateY(0px)"}`,
      }}
      className={`${
        showNav
          ? "bg-white fixed top-0 shadow-md transition-all duration-[0.8s]"
          : "bg-transparent absolute"
      } w-full z-[98]`}
    >
      <div className="px-5 sm:px-[30px] lg:px-[50px]">
        <div className="align-center h-[70px] flex justify-between">
          <Link
            href="/"
            className="uppercase inline-block font-semibold text-xl sm:text-2xl"
          >
            JTK STORE
          </Link>

          <div className="hidden lg:block h-full">
            {!showSearch ? (
              <div className="flex-1 flex gap-3 h-full items-center">
                <ul className="flex items-center gap-7 text-sm h-full">
                  <li className="relative h-full flex items-center group cursor-pointer select-none">
                    <Link
                      href="#"
                      className="flex items-center group-hover:text-text-hover font-semibold"
                    >
                      All Categories
                      <BiChevronDown className="text-xl text-[rgba(112,112,112,1)] group-hover:text-text-hover" />
                    </Link>
                    <CategoriesData categoriesData={categoriesData} />
                  </li>
                  <li>
                    <Link
                      href="/product"
                      className="hover:text-text-hover font-semibold"
                    >
                      Products
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      href="#"
                      className="hover:text-text-hover font-semibold"
                    >
                      Best Selling
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      href="/faq"
                      className="hover:text-text-hover font-semibold"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href={sellerToken ? "/dashboard" : "/shop/signup"}>
                      <CustomButton
                        type="button"
                        text={sellerToken ? "Dashboard" : "Become Seller"}
                        extraClass="uppercase w-full !text-xs rounded-[4px]"
                      />
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="relative h-full w-[700px]">
                <input
                  autoFocus
                  value={searchTerm}
                  onChange={handleSearch}
                  type="text"
                  placeholder="Search for products"
                  className="h-fit py-2 pl-9 focus:outline-none flex-1 w-full text-sm bg-transparent absolute top-0 bottom-0 my-auto"
                />
                <FiSearch className="text-[20px] text-gray-400 cursor-default absolute top-0 bottom-0 left-1 my-auto" />
                {searchTerm ? (
                  <div className="absolute top-[100%] mt-0.5 h-[250px] rounded-b-md overflow-auto w-full bg-slate-50 shadow-md z-[9]">
                    {searchData && searchData.length !== 0 ? (
                      <div className="">
                        {searchData.map((data: any) => {
                          const name = data.name;
                          const product_name = name.replace(/\s+/g, "-");
                          return (
                            <Link
                              href={`/product/${product_name}`}
                              className="block mb-2 hover:bg-slate-100  hover:font-medium px-4 text-sm"
                            >
                              <div className="w-full flex items-center py-3">
                                <Image
                                  src={data.image_Url[0].url}
                                  alt="product"
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 mr-2.5"
                                />
                                <h1>{product_name}</h1>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center font-medium">
                        No item found
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <div className="align-center h-full flex items-center gap-1 sm:gap-3">
            <div className="hidden lg:block">
              {!showSearch ? (
                <Tooltip title="Search">
                  <IconButton onClick={() => setshowSearch((prev) => !prev)}>
                    <FiSearch className="text-2xl cursor-pointer" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Close">
                  <IconButton
                    onClick={() => {
                      setshowSearch((prev) => !prev), setSearchTerm("");
                    }}
                  >
                    <MdClose className="text-2xl cursor-pointer" />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            <div className="relative h-full align-center group cursor-pointer">
              <Tooltip title="Wishlist">
                <IconButton className="relative" onClick={toggleWishlistModal}>
                  <AiOutlineHeart className="text-2xl" />
                  <span className=" center absolute top-1 right-1 w-4 h-4 text-[10px] font-bold text-white rounded-full bg-primary">
                    {wishlist.length}
                  </span>
                </IconButton>
              </Tooltip>
            </div>
            <div className="relative h-full align-center group cursor-pointer">
              <Tooltip title="Cart">
                <IconButton className="relative" onClick={toggleCartModal}>
                  <MdOutlineShoppingCart className="text-2xl" />
                  <span className=" center absolute top-1 right-1 w-4 h-4 text-[10px] font-bold text-white rounded-full bg-primary">
                    {cart.length}
                  </span>
                </IconButton>
              </Tooltip>
            </div>
            <div className="relative  h-full flex items-center cursor-pointer group">
              <Tooltip title="Profile">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  {isAuthenticated ? (
                    <Avatar
                      src={user?.avatar?.url}
                      sx={{ width: 32, height: 32 }}
                    ></Avatar>
                  ) : (
                    <Avatar
                      sizes="small"
                      sx={{ width: 32, height: 32 }}
                    ></Avatar>
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    padding: 0,
                    width: 200,
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 2,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {isAuthenticated && (
                  <Box>
                    <MenuItem
                      component={Link}
                      href="/profile"
                      onClick={handleClose}
                    >
                      <Avatar /> Profile
                    </MenuItem>
                    <Divider />
                  </Box>
                )}

                {isAuthenticated ? (
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                ) : (
                  <MenuItem component={Link} href="/api/auth/signin">
                    <ListItemIcon>
                      <LoginIcon fontSize="small" />
                    </ListItemIcon>
                    Login
                  </MenuItem>
                )}
              </Menu>
            </div>
            <div
              className="text-2xl text-primary cursor-pointer lg:hidden"
              onClick={() => setToggleNavDropdown((prev) => !prev)}
            >
              {!toggleNavDropdown ? <AiOutlineBars /> : <AiOutlineClose />}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${
          toggleNavDropdown ? "translate-y-[0px] " : "-translate-y-[100%]"
        } transition-all duration-[1s] bg-white  w-full absolute top-0 px-4 h-screen -z-[1] pt-[70px]`}
      >
        <form onSubmit={handleSearch}>
          <div className="relative border border-borderCol mt-4">
            <input
              value={searchTerm}
              onChange={handleSearch}
              type="text"
              placeholder="Search for products..."
              className="py-2 pl-3 w-full focus:outline-none text-sm"
            />
            <FiSearch className="text-2xl absolute top-0 bottom-0 my-auto right-2 text-gray-400" />
            {searchTerm ? (
              <div className="absolute top-[100%] mt-1 h-[250px] rounded-b-md overflow-auto w-full bg-slate-50 shadow-md z-[9]">
                {searchData && searchData.length !== 0 ? (
                  <div className="">
                    {searchData.map((data: any) => {
                      const name = data.name;
                      const product_name = name.replace(/\s+/g, "-");
                      return (
                        <Link
                          href={`/product/${product_name}`}
                          className="block mb-2 hover:bg-slate-100  hover:font-medium px-4 text-sm"
                        >
                          <div className="w-full flex items-center py-3">
                            <Image
                              src={data.image_Url[0].url}
                              alt="product"
                              width={40}
                              height={40}
                              className="w-10 h-10 mr-2.5"
                            />
                            <h1>{product_name}</h1>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-medium">
                    No item found
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </form>
        <ul className="flex flex-col gap-4 mt-5">
          <li className="relative h-full flex items-center group cursor-pointer select-none">
            <Link
              href="#"
              className="flex items-center group-hover:text-text-hover font-semibold"
            >
              All Categories
              <BiChevronDown className="text-xl text-[rgba(112,112,112,1)] group-hover:text-text-hover" />
            </Link>
            <CategoriesData categoriesData={categoriesData} />
          </li>
          <li onClick={closeMobileNav} className="w-fit">
            <Link
              href="/product"
              className="hover:text-text-hover font-semibold"
            >
              Products
            </Link>
          </li>
          {/* <li onClick={closeMobileNav} className="w-fit">
            <Link href="#" className="hover:text-text-hover font-semibold">
              Best Selling
            </Link>
          </li> */}
          <li onClick={closeMobileNav} className="w-fit">
            <Link href="#" className="hover:text-text-hover font-semibold">
              FAQ
            </Link>
          </li>

          <li className="w-fit" onClick={closeMobileNav}>
            {auth ? (
              <button
                className="bg-red-500 min-w-[100px] py-2 rounded-md text-white text-center text-sm font-medium"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <Link
                href="/api/auth/signin"
                className="font-medium text-sm min-w-[100px] bg-text-hover inline-block py-2 text-white rounded-md text-center"
              >
                Login
              </Link>
            )}
          </li>
          <li>
            <Link href={sellerToken ? "/dashboard" : "/shop/signup"}>
              <CustomButton
                type="button"
                text={sellerToken ? "Dashboard" : "Become Seller"}
                extraClass="uppercase w-full !text-xs rounded-[4px]"
              />
            </Link>
          </li>
        </ul>
      </div>
      <CartDrawer toggleModal={toggleCartModal} showCart={showCart} />
      <WishlistDrawer
        toggleModal={toggleWishlistModal}
        showWishlist={showWishlist}
      />
    </div>
  );
}

export default Navbar;
