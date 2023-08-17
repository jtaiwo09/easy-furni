"use client";
import React, { useEffect, useState } from "react";
import CustomButton from "../form/CustomButton";
import ProductTable from "./tables/ProductTable";
import CustomModal from "../CustomModal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextField from "../form/TextField";
import CustomSelect from "../form/CustomSelect";
import { categoriesData } from "@/utils/data";
import { AiOutlineCloudUpload, AiOutlineEye } from "react-icons/ai";
import { BiTrashAlt } from "react-icons/bi";
import ConfirmationModal from "../modals/ConfirmationModal";
import FormHelperText from "@mui/material/FormHelperText";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { createProduct } from "@/redux/slices/productSlice";
import CurrencyTextField from "../form/CurrencyTextField";
import TextEditor from "../form/TextEditor";
import { stripHtml } from "string-strip-html";
import { toast } from "react-toastify";

type CreateProductFormData = {
  name: string;
  description: any;
  category: string;
  tags: any;
  originalPrice: any;
  discountPrice: any;
  stock: any;
  images: any;
};

const schema = yup.object().shape({
  name: yup.string().required("Product title is required"),
  description: yup
    .mixed()
    .test("checkIfEmpty", "Description is required", (v: any) => {
      return v && stripHtml(v).result.length > 0;
    })
    .test("checkLength", "Maximum character limit is 2000", (v: any) => {
      return v && stripHtml(v).result.length <= 2000;
    }),
  category: yup.string().required("Category is required"),
  tags: yup.string().notRequired(),
  originalPrice: yup
    .number()
    .typeError("Must be a number")
    .test("notLessThanZero", "Price must not be 0", (value: any) => value > 0)
    .required("Price is required")
    .nullable(),
  discountPrice: yup
    .number()
    .typeError("Must be a number")
    .test(
      "notLessThanZero",
      "Discount price must not be 0",
      (value: any) => value > 0
    )
    .required("Discount price is required")
    .nullable(),
  stock: yup
    .number()
    .typeError("Must be a number")
    .required("Stock is required"),
  images: yup
    .mixed()
    .test("checkIfLessThan2", "Please upload at least 2 images", (v: any) => {
      return v.length >= 2;
    })
    .test(
      "checkIfGreaterThan3",
      "Please upload not more than 3 images",
      (v: any) => {
        return v.length <= 3;
      }
    )
    .nullable(),
  // .test("fileSize", "File size must not be more than 8mb", (value: any) => {
  //   return value.some((item: any) => {
  //     const base64str = item.split("base64,")[1];
  //     const decoded = atob(base64str ?? "");
  //     return value && decoded.length <= 1000000;
  //   });
  // }),
});

function Products({ data, id }: any) {
  const dispatch = useAppDispatch();
  const { seller } = useAppSelector((state) => state.seller);
  const { loading } = useAppSelector((state) => state.product);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [preview, setPreview] = useState("");
  const [uploadedImages, setUploadedImages] = useState<any>([]);
  const [ImageIndex, setImageIndex] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      category: "",
      tags: "",
      originalPrice: null,
      discountPrice: null,
      stock: null,
      images: null,
    },
    resolver: yupResolver(schema),
  });

  const toggleModal = () => {
    setOpen((prev) => !prev);

    if (open) {
      reset();
      setUploadedImages([]);
    }
  };

  useEffect(() => {
    setValue("images", uploadedImages);
  }, [uploadedImages]);

  const handleImageChange = (e: any) => {
    const files = Array.from(e.target.files);
    files.forEach((file: any) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        setUploadedImages((prev: any) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = () => {
    const newImages = [...uploadedImages].filter((_, i) => i !== ImageIndex);
    setUploadedImages(newImages);
    setDeleteModal(false);
  };

  const onSubmit = async (data: CreateProductFormData) => {
    const {
      name,
      category,
      description,
      discountPrice,
      originalPrice,
      stock,
      tags,
      images,
    } = data;

    const newForm = new FormData();

    images.forEach((image: string) => {
      newForm.set("images", image);
    });
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("tags", tags);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("stock", stock);
    newForm.append("shopId", seller?._id);
    try {
      const res = await dispatch(
        createProduct({ ...data, shopId: seller?._id })
      ).unwrap();
      if (res.success) {
        toast.success("Product created successfully!");
        toggleModal();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleShowPreview = (item: any) => {
    setShow((prev) => !prev);
    setPreview(item);
  };

  const closePreview = () => {
    setShow(false);
  };

  const toggleDeleteModal = (index: any) => {
    setDeleteModal((prev) => !prev);
    setImageIndex(index);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">Products</h2>
        <CustomButton text="Create Product" handleClick={toggleModal} />
      </div>
      <ProductTable data={data} id={id} />
      <CustomModal open={open} handleClose={toggleModal}>
        <div>
          <h2 className="text-xl uppercase text-center font-semibold">
            Create Product
          </h2>
          <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              name="name"
              label="Title"
              inputClass="leading-[24px]"
              formGroup=" mb-4 w-full"
              register={register}
              errors={errors}
            />
            <TextEditor
              name="description"
              label="Description"
              formGroup=" mb-4 w-full"
              errors={errors}
              control={control}
            />
            {/* <TextField
              name="description"
              label="Description"
              inputClass="leading-[24px]"
              formGroup=" mb-4 w-full"
              register={register}
              errors={errors}
            /> */}
            <CustomSelect
              label="Category"
              name="category"
              defaultText="Select Category"
              formGroup=" mb-4 w-full"
              register={register}
              options={categoriesData}
              errors={errors}
            />
            <TextField
              name="tags"
              label="Tags"
              inputClass="leading-[24px]"
              placeholder="Enter product tags"
              formGroup=" mb-4 w-full"
              register={register}
              errors={errors}
            />
            <CurrencyTextField
              name="originalPrice"
              label="Original Price"
              formGroup=" mb-4 w-full"
              placeholder="Enter your product price"
              control={control}
              errors={errors}
            />
            <CurrencyTextField
              name="discountPrice"
              label="Price (With Discount)"
              placeholder="Enter your product price with discount"
              formGroup=" mb-4 w-full"
              control={control}
              errors={errors}
            />
            <TextField
              name="stock"
              label="Product Stock"
              inputClass="leading-[24px]"
              placeholder="Enter your product stock"
              formGroup=" mb-4 w-full"
              register={register}
              errors={errors}
            />
            <div>
              <label
                htmlFor="upload"
                className="leading-[18px] text-sm font-medium block tracking-[0.5px] mb-1"
              >
                Upload Images
              </label>
              <input
                type="file"
                name="images"
                id="upload"
                className="hidden"
                multiple
                onChange={handleImageChange}
              />
              <div className="w-full flex items-center flex-wrap">
                {uploadedImages.length < 3 && (
                  <label
                    htmlFor="upload"
                    className="h-[80px] w-[80px] group cursor-pointer hover:border-blue-400 flex justify-center items-center border-[1.5px] border-dashed border-gray-400 rounded-sm mr-2"
                  >
                    <AiOutlineCloudUpload
                      size={30}
                      className="cursor-pointer text-gray-400 group-hover:text-blue-400"
                    />
                  </label>
                )}

                {uploadedImages &&
                  uploadedImages.map((item: any, index: any) => (
                    <div
                      key={index}
                      className="group relative h-[80px] w-[80px] border border-form-border rounded-sm mr-2 last:mr-0 overflow-hidden"
                    >
                      <img
                        src={item}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                      <div className="hidden group-hover:flex absolute top-0 bottom-0 w-full h-full items-center justify-center bg-black/30">
                        <div className="w-fit flex gap-2">
                          <AiOutlineEye
                            onClick={() => handleShowPreview(item)}
                            className="text-white text-lg cursor-pointer"
                          />
                          <BiTrashAlt
                            onClick={() => toggleDeleteModal(index)}
                            className="text-white text-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {errors.images && (
                <FormHelperText className="!text-red-500">
                  {errors.images?.message as any}
                </FormHelperText>
              )}
            </div>
            <CustomButton
              loading={loading}
              text="Create"
              type="submit"
              extraClass="mt-10"
            />
          </form>
        </div>
      </CustomModal>
      <CustomModal
        open={show}
        handleClose={closePreview}
        boxStyle="!max-w-[500px]"
      >
        <div className="">
          <img
            src={preview}
            alt=""
            className="w-full h-[400px] object-contain"
          />
        </div>
      </CustomModal>
      <ConfirmationModal
        title="Are you sure, you want to delete this?"
        okText="Delete"
        okBtn={handleDelete}
        cancelBtn={() => setDeleteModal(false)}
        open={deleteModal}
        boxStyle="!max-w-[450px]"
        okBtnClass="bg-red-500 text-white hover:text-red-500 hover:bg-red-500 border !border-[red]"
      >
        <div className="my-5">This will be deleted</div>
      </ConfirmationModal>
    </div>
  );
}

export default Products;
