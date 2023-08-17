import IconButton from "@mui/material/IconButton";
import React from "react";
import { MdClose } from "react-icons/md";
import ProductItem from "./ProductItem";
import Drawer from "./modals/Drawer";
import { AiOutlineHeart } from "react-icons/ai";
import { useAppSelector } from "@/redux/hook";
import { BsHeart } from "react-icons/bs";

interface IProps {
  toggleModal: () => void;
  showWishlist: boolean;
}

function WishlistDrawer({ toggleModal, showWishlist }: IProps) {
  const { wishlist } = useAppSelector((state) => state.wishlist);
  return (
    <Drawer
      anchor="right"
      open={showWishlist}
      toggleModal={toggleModal}
      width={350}
      showCloseBtn={false}
    >
      <>
        <div className="py-7 flex items-center justify-between border-b border-borderCol px-4 sticky top-0 w-full">
          <div className="flex items-center">
            <AiOutlineHeart className="mr-2 text-3xl" />
            <span className="font-medium text-base">
              {wishlist.length} Items
            </span>
          </div>

          <IconButton onClick={toggleModal} className="">
            <MdClose />
          </IconButton>
        </div>
        <div className="h-[calc(100vh-97px)] px-4 pt-6 pb-4">
          {wishlist.length > 0 ? (
            <div className="h-[calc(100vh-298px)] overflow-y-auto">
              {wishlist.map((product) => (
                <ProductItem
                  key={product._id}
                  type="wishlist"
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="w-full h-[calc(100%-129px)] ">
              <div className="w-full min-h-[200px] flex flex-col justify-center items-center mt-[40%] px-4">
                <p className="text-center mb-2">
                  No products added to the wishlist
                </p>
                <div className="h-[80px] w-[80px] rounded-full bg-gray-200 flex justify-center items-center">
                  <BsHeart className="text-black/40" size={30} />
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    </Drawer>
  );
}

export default WishlistDrawer;
