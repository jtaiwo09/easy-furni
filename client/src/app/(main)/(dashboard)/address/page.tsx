"use client";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  deleteUserAddress,
  editUserAddress,
  setDefaultAddress,
  updatUserAddress,
} from "@/redux/slices/userSlice";
import { toast } from "react-toastify";
import { Country, State } from "country-state-city";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { MdEdit } from "react-icons/md";
import { BiLoader, BiTrashAlt } from "react-icons/bi";
import CustomButton from "@/components/form/CustomButton";
import Loader from "@/components/Layout/Loader";
import CustomModal from "@/components/CustomModal";
import CountrySelect from "@/components/form/CountrySelect";
import StateSelect from "@/components/form/SateSelect";
import TextField from "@/components/form/TextField";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import CustomCheckbox from "@/components/form/CustomCheckbox";

export interface AddressFormData {
  country: string;
  state: string;
  address: string;
  phoneNumber: string;
  default: boolean;
}

const schema = yup.object().shape({
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  address: yup.string().required("Address is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number")
    .required("Phone Number is required"),
  default: yup.boolean(),
});

function page() {
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addressId, setAddressId] = useState("");
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressFormData | any>({
    defaultValues: {
      country: "",
      state: "",
      address: "",
      phoneNumber: "",
      default: false,
    },
    values: {
      phoneNumber: user?.phoneNumber ?? "",
    },
    resolver: yupResolver(schema),
  });

  const toggleModal = () => {
    setOpen((prev) => !prev);
    if (open) {
      reset();
    }
    if (open && update) {
      setUpdate(false);
      setAddressId("");
    }
  };

  const onSubmit = async (data: AddressFormData) => {
    try {
      let res;
      if (!update) {
        res = await dispatch(updatUserAddress(data)).unwrap();
      } else {
        res = await dispatch(
          editUserAddress({ id: addressId, ...data })
        ).unwrap();
      }
      if (res.success) {
        toast.success("Address updated successfully!");
        toggleModal();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getAddressInfo = useCallback(
    (stateCode: string, countryCode: string) => {
      const country = Country && Country.getCountryByCode(countryCode);
      const state =
        State && State.getStateByCodeAndCountry(stateCode, countryCode);

      return `${state?.name}, ${country?.name}`;
    },
    []
  );

  const handleDefault = async (id: string) => {
    try {
      const res = await dispatch(setDefaultAddress(id)).unwrap();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (id: string) => {
    toggleModal();
    setUpdate(true);
    const address = user?.addresses.find((address) => address._id === id);
    setValue("address", address?.address);
    setValue("country", address?.country);
    setValue("phoneNumber", address?.phoneNumber);
    setValue("state", address?.state);
    setValue("default", address?.default);
    setAddressId(id);
  };

  const handleDelete = async () => {
    try {
      const res = await dispatch(deleteUserAddress(addressId)).unwrap();
      if (res.success) {
        toast.success("Address deleted successfully");
        setDeleteModal(false);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!user) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold">My Addresses</h2>
        <CustomButton text="Add New" handleClick={toggleModal} />
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {user.addresses.map((item) => (
          <div
            key={item._id}
            className=" rounded-md shadow-sm bg-white border flex flex-col"
          >
            <div className={`px-4 py-5 ${item.default && "bg-primary/20 "}`}>
              <p className="">{item.address}</p>
              <p className="">{getAddressInfo(item.state, item.country)}</p>
              <p className="">{item.phoneNumber}</p>
              {item.default && (
                <p className="mt-3 text-green-600 text-sm font-medium">
                  Default Address
                </p>
              )}
            </div>
            <div className="border-t px-4 py-2 mt-auto">
              <div className="flex justify-between">
                <button
                  onClick={() => handleDefault(item._id)}
                  className="flex items-center uppercase text-sm font-medium disabled:text-gray-400 enabled:hover:bg-primary enabled:hover:text-white rounded-sm px-2"
                  disabled={item.default || loading}
                >
                  {loading && (
                    <BiLoader className="text-xl mr-2 animate-spin" />
                  )}
                  set as default
                </button>
                <div className="w-fit flex gap-2 items-center">
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEdit(item._id)}>
                      <MdEdit className="text-lg text-primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      className="mr-2"
                      onClick={() => {
                        setDeleteModal(true), setAddressId(item._id);
                      }}
                    >
                      <BiTrashAlt className="text-lg text-red-500" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <CustomModal open={open} handleClose={toggleModal}>
        <div>
          <h2 className="text-xl uppercase text-center font-semibold">
            {update ? "Update Address" : "Add Address"}
          </h2>
          <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
            <CountrySelect
              label="Select Country"
              name="country"
              formGroup=" mb-4 w-full"
              register={register}
              errors={errors}
            />
            <StateSelect
              label="Select State"
              name="state"
              formGroup=" mb-4 w-full"
              isoCode={watch("country")}
              register={register}
              errors={errors}
            />
            <TextField
              name="address"
              label="Address"
              inputClass="leading-[24px]"
              formGroup=" mb-4 w-full"
              register={register}
              errors={errors}
            />
            <TextField
              name="phoneNumber"
              label="Phone Number"
              inputClass="leading-[24px]"
              formGroup=" mb-4 w-full"
              register={register}
              errors={errors}
            />
            <CustomCheckbox
              name="default"
              label="Set as default address"
              formGroup=" mb-4 w-full"
              register={register}
              errors={errors}
            />
            <CustomButton
              text={update ? "Update" : "Submit"}
              type="submit"
              extraClass="mt-10"
            />
          </form>
        </div>
      </CustomModal>
      <ConfirmationModal
        title="Do you want to delete this address?"
        okText="Delete"
        okBtn={handleDelete}
        cancelBtn={() => setDeleteModal(false)}
        open={deleteModal}
        boxStyle="!max-w-[450px]"
        okBtnClass="bg-red-500 text-white hover:text-red-500 hover:bg-red-500 border !border-[red]"
        loading={loading}
      >
        <div className="my-5">This address will be permanently deleted</div>
      </ConfirmationModal>
    </div>
  );
}

export default page;
