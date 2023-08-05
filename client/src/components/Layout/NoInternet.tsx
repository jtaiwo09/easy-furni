import React from "react";
import CustomModal from "../CustomModal";
import { BiWifiOff } from "react-icons/bi";
import CustomButton from "../form/CustomButton";

function NoInternet() {
  const reload = () => {
    window.location.reload();
  };
  return (
    <div>
      <CustomModal open={true} handleClose={() => {}} hideCloseButton={true}>
        <div className="flex items-center flex-col w-full text-center my-10">
          <BiWifiOff className="text-4xl" />
          <h2 className="text-lg font-semibold mt-1">Oops! No Internet</h2>
          <p className="mt-4">Check your connection and try again</p>
          <CustomButton
            text="Try again"
            handleClick={reload}
            extraClass="mt-5"
          />
        </div>
      </CustomModal>
    </div>
  );
}

export default NoInternet;
