"use client";
import CustomModal from "@/components/CustomModal";
import CustomButton from "@/components/form/CustomButton";
import { baseUrl } from "@/server";
import React, { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { GrSecure } from "react-icons/gr";
import { AiOutlineCheckSquare } from "react-icons/ai";

function page() {
  const [token, setToken] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch(`${baseUrl}/order/token-verification/${token}`);
    const result = await res.json();
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setMessage(result.message);
    } else {
      setMessage(result.message);
      setSuccess(false);
    }
    toggleModal();
  };

  const toggleModal = () => {
    setOpen((prev) => !prev);
    setToken("");
  };

  return (
    <div className="mt-[70px] min-h-[calc(100vh-409px)] bg-[#f4f4f4] ">
      <div className="container flex justify-center h-full">
        <div className="my-[10%] w-[90%] max-w-[400px]">
          <div className="bg-white rounded-md w-full border p-6">
            <div className="w-fit mx-auto mb-4">
              <GrSecure size={40} />
            </div>
            <h1 className="uppercase text-center text-2xl font-semibold mb-1">
              Verify Token
            </h1>
            <p className="text-sm mb-5 text-center">
              Please request the token from the buyer to complete the delivery.
            </p>
            <div className="w-full">
              <label htmlFor="" className="block mb-1 text-sm font-medium">
                Enter Token
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value.trim());
                }}
                className="w-full h-[46px] border px-4 focus:outline-none"
              />
              <CustomButton
                loading={loading}
                disabled={!token}
                text="Submit"
                handleClick={handleSubmit}
                extraClass="mt-5 w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <CustomModal
        open={open}
        handleClose={toggleModal}
        boxStyle="!max-w-[400px]"
      >
        <>
          {success ? (
            <div className="p-5">
              <AiOutlineCheckSquare className="text-6xl text-green-500 mx-auto w-fit block" />
              <p className="text-lg my-6 text-center font-medium">{`Thank you, ${message}`}</p>
              <CustomButton
                text="Close"
                extraClass="w-fit mx-auto"
                handleClick={toggleModal}
              />
            </div>
          ) : (
            <div className="p-5">
              <MdErrorOutline className="text-6xl text-red-500 mx-auto w-fit block" />
              <p className="text-lg my-6 text-center font-medium">{`${message}, please try again`}</p>
              <CustomButton
                text="Close"
                extraClass="w-fit mx-auto"
                handleClick={toggleModal}
              />
            </div>
          )}
        </>
      </CustomModal>
    </div>
  );
}

export default page;
