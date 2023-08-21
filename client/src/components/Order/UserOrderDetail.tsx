"use client";
import CustomModal from "@/components/CustomModal";
import CustomButton from "@/components/form/CustomButton";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getAllUsersOrders } from "@/redux/slices/orderSlice";
import { requestRefundApi } from "@/services/order";
import { createProductReviewApi } from "@/services/product";
import { currencyConverter, formatDate, truncate } from "@/utils/helperFunc";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormHelperText, Rating } from "@mui/material";
import { Country, State } from "country-state-city";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import Badge from "../Badge";
import Image from "next/image";

const schema = yup.object().shape({
  rating: yup.number().required("Rating is required"),
  comment: yup.string().notRequired(),
});

function UserOrderDetail({ id, order }: { id: string; order: Order }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [refundModal, setRefundModal] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [selectedItemForReturn, setSelectedItemForReturn] = useState<string[]>(
    []
  );

  interface ReviewFormData {
    rating: any;
    comment: string | any;
  }

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ReviewFormData>({
    defaultValues: {
      rating: null,
      comment: "",
    },
    resolver: yupResolver(schema),
  });

  const refundHandler = async () => {
    try {
      setLoading(true);
      const data = {
        orderId: order?._id,
        productIds: selectedItemForReturn,
        reason,
        status: "Processing refund",
      };
      const res = await requestRefundApi(data);
      setLoading(false);
      toast.success(res.message);
      router.refresh();
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const toggleReviewModal = () => {
    setOpen((prev) => !prev);
  };

  const reviewHandler = async (data: ReviewFormData) => {
    setLoading(true);
    const payload = {
      user,
      productId: selectedItem?._id,
      orderId: id,
      ...data,
    };

    const res = await createProductReviewApi(payload);
    setLoading(false);
    if (res.success) {
      toast.success(res.message);
      dispatch(getAllUsersOrders(user!._id));
      reset();
      toggleReviewModal();
    } else {
      setLoading(false);
      toast.error(res.message);
    }
  };

  const handleRating = (value: number | null, onChange: any) => {
    onChange(value);
  };

  const selectReturnItemHandler = (item: string) => {
    const id = selectedItemForReturn.includes(item);
    if (id) {
      const newValue = selectedItemForReturn.filter((el) => el !== item);
      setSelectedItemForReturn(newValue);
    } else {
      setSelectedItemForReturn((prev: string[]) => [item, ...prev]);
    }
  };

  return (
    <div className="py-10">
      {order &&
        order.cart.map((item) => (
          <div
            key={item._id}
            className="py-10 border-b border-form-border flex justify-between"
          >
            <div className="flex items-center space-x-5">
              <Image
                src={`${item.images[0]?.url}`}
                alt=""
                width={80}
                height={80}
                className="w-[80x] h-[80px]"
              />
              <div className="w-full">
                <h5 className=" text-lg mb-1 ">{item.name}</h5>
                <p className="font-semibold text-gray-700 text-lg">{`${currencyConverter(
                  item.discountPrice
                )} x ${item.qty}`}</p>
              </div>
            </div>
            {!item.isReviewed && order.status === "Delivered" ? (
              <CustomButton
                text="write a Review"
                handleClick={() => {
                  toggleReviewModal(), setSelectedItem(item);
                }}
                extraClass="h-fit"
              />
            ) : null}
          </div>
        ))}
      <p className="mt-3 text-[18px] text-right">
        Total Price: <strong>{currencyConverter(order?.totalPrice)}</strong>
      </p>
      <br />
      <div className="w-full lg:flex">
        <div className="w-full lg:w-[60%]">
          <h4 className="text-[20px] font-[600]">Shipping Address:</h4>
          <div className="text-base">
            <h4 className="pt-2">{order?.shippingAddress.address}</h4>
            <h4>
              {
                Country.getCountryByCode(order?.shippingAddress.country ?? "")
                  ?.name
              }
            </h4>
            <h4>
              {
                State.getStateByCodeAndCountry(
                  order?.shippingAddress.state ?? "",
                  order?.shippingAddress.country ?? ""
                )?.name
              }
            </h4>
            <h4>{order?.user?.phoneNumber}</h4>
          </div>
        </div>
        <br />
        <div className="w-full lg:w-[40%]">
          <h4 className="text-[20px] font-[600] mb-2">Payment Info:</h4>
          <h4 className="mb-2">
            <span className="font-semibold text-sm">Status : </span>
            <Badge status={order?.paymentInfo?.paid ? "Paid" : "Not Paid"} />
          </h4>
          <h4 className="mb-2">
            <span className="font-semibold text-sm">Payment Method : </span>
            {order?.paymentInfo?.type}
          </h4>
          <h4 className="mb-2">
            <span className="font-semibold text-sm">Payment Date : </span>
            {formatDate(order?.paidAt)}
          </h4>
        </div>
      </div>
      <br />
      <div className="w-full lg:w-[40%]">
        <h4 className="text-[20px] font-[600] mb-2">Track Info:</h4>
        <h4 className="text-sm mb-2">
          <span className="font-semibold inline-block">Status : </span>{" "}
          <Badge status={order?.status ?? ""} />
        </h4>
        {order.status === "Delivered" && (
          <h4 className="text-sm mb-2">
            <span className="font-semibold inline-block">Delivery Date : </span>{" "}
            {formatDate(order?.deliveredAt)}
          </h4>
        )}
      </div>
      <br />
      {order?.status === "Delivered" && (
        <CustomButton
          text="Request A Return"
          extraClass="mt-4"
          loading={loading}
          handleClick={() => setRefundModal(true)}
        />
      )}

      <CustomModal open={open} handleClose={toggleReviewModal} boxStyle="">
        <div className="">
          <h2 className="text-center font-semibold text-2xl mb-5">
            Give a Review
          </h2>
          {selectedItem ? (
            <div className="flex items-center space-x-5">
              <Image
                src={`${selectedItem.images[0]?.url}`}
                alt=""
                width={80}
                height={80}
                className="w-[80px] h-[80px]"
              />
              <div className="w-full">
                <h5 className=" text-xl mb-1 ">{selectedItem.name}</h5>
                <p className="font-semibold text-gray-700 text-lg">{`${currencyConverter(
                  selectedItem.discountPrice
                )} x ${selectedItem.qty}`}</p>
              </div>
            </div>
          ) : null}
          <form onSubmit={handleSubmit(reviewHandler)} className="">
            <div className="mt-5">
              <label
                htmlFor="rating"
                className="block mb-1 text-lg font-semibold"
              >
                Give a rating
              </label>
              <Controller
                name="rating"
                control={control}
                defaultValue={null}
                render={({ field }) => {
                  const { onChange, ...rest } = field;
                  return (
                    <Rating
                      {...rest}
                      size="large"
                      className=""
                      precision={0.5}
                      onChange={(_, value) => handleRating(value, onChange)}
                    />
                  );
                }}
              />

              <FormHelperText className="!text-red-500 mt-1">
                {errors.rating?.message as any}
              </FormHelperText>
            </div>
            <div className="mt-4">
              <label
                htmlFor="rating"
                className="block mb-1 text-lg font-semibold"
              >
                Write a comment{" "}
                <span className="text-gray-600 ml text-sm font-normal">
                  (Optional)
                </span>
              </label>
              <textarea
                {...register("comment")}
                className="w-full min-h-[120px] focus:outline-none border border-form-border rounded-none p-3"
              ></textarea>
            </div>
            <CustomButton
              loading={loading}
              text="Submit"
              type="submit"
              extraClass="mt-5"
            />
          </form>
        </div>
      </CustomModal>
      <CustomModal open={refundModal} handleClose={() => setRefundModal(false)}>
        <div className="">
          <h2 className="text-sm uppercase pb-2 border-b mb-2 font-medium">
            Please select the item to return and give your return.
          </h2>
          <div className="">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
              {order.cart.map((item) => (
                <div
                  className={`relative cursor-pointer flex items-center h-[80px] bg-white border-solid rounded-sm p-2 overflow-hidden ${
                    selectedItemForReturn.includes(item._id)
                      ? "border-text-hover border bg-text-hover/[0.05] select-none"
                      : "border"
                  }`}
                  key={item._id}
                  onClick={() => {
                    selectReturnItemHandler(item._id);
                  }}
                >
                  <Image
                    src={item?.images[0]?.url}
                    alt=""
                    fill
                    className="h-full w-auto object-contain mix-blend-darken"
                  />
                  <div className="px-3">
                    <p className="text-base mb-1 font-medium">
                      {truncate(item?.name, 18)}
                    </p>
                    <p className="">
                      {currencyConverter(
                        item?.discountPrice
                          ? item?.discountPrice
                          : item?.originalPrice
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label
                htmlFor="reason"
                className="text-xs uppercase font-medium mb-1 block"
              >
                Give Reasons
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e: any) => setReason(e.target.value)}
                className="p-3 text-sm min-h-[100px] w-full focus:outline-none border rounded-sm"
              ></textarea>
              <CustomButton
                disabled={selectedItemForReturn.length < 1 || !reason}
                text="Submit"
                extraClass="mt-5"
                handleClick={refundHandler}
              />
            </div>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}

export default UserOrderDetail;
