"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { BiLoader, BiTrashAlt } from "react-icons/bi";
import ConfirmationModal from "../modals/ConfirmationModal";
import FormHelperText from "@mui/material/FormHelperText";
import { useAppSelector } from "@/redux/hook";
import CurrencyTextField from "../form/CurrencyTextField";
import TextEditor from "../form/TextEditor";
import { stripHtml } from "string-strip-html";
import { toast } from "react-toastify";
import { deleteCloudinaryImageApi } from "@/services";
import { baseUrl } from "@/server";
import { Fetcher } from "@/services/swr";
import Loader from "../Layout/Loader";
import {
  createProductApi,
  deleteProductApi,
  updateProductApi,
} from "@/services/swr/product/fetcher";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

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
      return v && stripHtml(v).result?.length > 0;
    })
    .test("checkLength", "Maximum character limit is 2000", (v: any) => {
      return v && stripHtml(v).result?.length <= 2000;
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
      return v?.length >= 2;
    })
    .test(
      "checkIfGreaterThan3",
      "Please upload not more than 3 images",
      (v: any) => {
        return v?.length <= 3;
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

function Products({ id }: { id: string }) {
  const { loading } = useAppSelector((state) => state.product);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [preview, setPreview] = useState("");
  const [uploadedImages, setUploadedImages] = useState<Image[]>([]);
  const [ImagePublicId, setImagePublicId] = useState("");
  const [productId, setProductId] = useState("");
  const [rawImageData, setRawImageData] = useState<any[]>([]);
  const [loader, setLoader] = useState(false);
  const uploads = useRef<Image[]>([]);
  const [deleteProductModal, setDeleteProductModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = useMemo(() => searchParams.get("page") ?? 1, [searchParams]);

  useEffect(() => {
    async function upload() {
      if (rawImageData.length > 0) {
        const res = await uploadToCloudinary(rawImageData);
        if (res.success) {
          localStorage.setItem("productId", productId);
          setUploadedImages((prev) => [...prev, ...res.images]);
          uploads.current = [...uploads.current, ...res.images];
          localStorage.setItem(
            "productImages",
            JSON.stringify(uploads.current)
          );
          setValue("images", uploads.current);
          setRawImageData([]);
        }
      }
    }
    upload();
  }, [rawImageData]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
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

  const { data, error, isLoading, mutate } = Fetcher({
    url: `product/get-all-products-shop/${id}`,
    page: Number(page),
  });

  if (isLoading) return <Loader />;

  if (error) {
    toast.error(error.message);
  }

  const products: Product[] = data?.products ?? [];

  const toggleModal = () => {
    setOpen((prev) => !prev);

    if (open) {
      reset();
      setProductId("");
      setUploadedImages([]);
    }
  };

  const uploadToCloudinary = (images: any) => {
    setLoader(true);
    return fetch(`${baseUrl}/util/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ images, path: "products" }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoader(false);
        return res;
      })
      .catch((error) => {
        setLoader(false);
        toast.error(error);
      });
  };

  const base64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject;
    });
  };

  const handleImageChange = (e: any) => {
    const files = Array.from(e.target.files);

    files.forEach(async (file: any) => {
      const result = await base64(file);
      setRawImageData((prev: any) => [...prev, result]);
    });
  };

  const handleDelete = async () => {
    try {
      setLoader(true);
      const res = await deleteCloudinaryImageApi(ImagePublicId);
      setLoader(false);
      if (res.success) {
        const filteredImages = uploadedImages.filter(
          (img) => img.public_id !== ImagePublicId
        );
        setUploadedImages(filteredImages);
        setValue("images", filteredImages);
        uploads.current = filteredImages;

        setDeleteModal(false);
        toast.success(res.message);
      }
    } catch (error: any) {
      setLoader(false);
      toast.error(error.message);
    }
  };

  const onSubmit = async (data: CreateProductFormData) => {
    if (!productId) {
      const res = await createProductApi({ ...data, shopId: id });
      if (res.success) {
        mutate();
        toast.success("Product created successfully!");
        toggleModal();
        localStorage.removeItem("productImages");
        uploads.current = [];
      }
    } else {
      const res = await updateProductApi({
        ...data,
        images: uploadedImages,
        productId,
      });
      if (res.success) {
        mutate();
        toast.success("Product updated successfully!");
        toggleModal();
        localStorage.removeItem("productImages");
        localStorage.removeItem("productId");
        uploads.current = [];
      }
    }
  };

  const handleShowPreview = (url: string) => {
    setShow((prev) => !prev);
    setPreview(url);
  };

  const closePreview = () => {
    setShow(false);
  };

  const toggleDeleteModal = (publicId: string) => {
    setDeleteModal((prev) => !prev);
    setImagePublicId(publicId);
  };

  const edit = (id: string) => {
    toggleModal();
    setProductId(id);
    const product = products.find((el) => el._id === id);

    if (product) {
      setValue("name", product.name);
      setValue("description", product.description);
      setValue("category", product.category);
      setValue("tags", product.tags);
      setValue("originalPrice", product.originalPrice);
      setValue("discountPrice", product.discountPrice);
      setValue("stock", product.stock);
      const storageImgs = localStorage.getItem("productImages");
      const prodId = localStorage.getItem("productId");
      if (prodId == id) {
        const parsedImgs = storageImgs
          ? JSON.parse(storageImgs)
          : product.images;
        setValue("images", parsedImgs);
        setUploadedImages(parsedImgs);
        uploads.current = parsedImgs;
      } else {
        setValue("images", product.images);
        setUploadedImages(product.images);
        uploads.current = product.images;
      }
    }
  };

  const deleteProduct = (id: string) => {
    setProductId(id);
    setDeleteProductModal(true);
  };

  const handleDeleteProduct = async () => {
    try {
      setLoader(true);
      const res = await deleteProductApi(productId);
      setLoader(false);
      if (res.success) {
        mutate();
        setDeleteProductModal(false);
        toast.success(res.message);
      }
    } catch (error: any) {
      setLoader(false);
      toast.error(error.message);
    }
  };

  const handlePagination = (page: any) => {
    router.push(`/dashboard/products?page=${page}`);
    mutate();
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-medium">Products</h2>
        <CustomButton text="Create Product" handleClick={toggleModal} />
      </div>
      <ProductTable
        data={data}
        edit={edit}
        deleteProduct={deleteProduct}
        handlePagination={handlePagination}
      />
      <CustomModal open={open} handleClose={toggleModal}>
        <div>
          <h2 className="text-xl uppercase text-center font-semibold">
            {productId ? "Update Product" : "Create Product"}
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
                disabled={loader}
                multiple
                onChange={handleImageChange}
              />
              <div className="w-full flex items-center flex-wrap">
                {uploadedImages.length < 3 && (
                  <label
                    htmlFor="upload"
                    className="h-[80px] w-[80px] group cursor-pointer hover:border-blue-400 flex justify-center items-center border-[1.5px] border-dashed border-gray-400 rounded-sm mr-2"
                  >
                    {loader ? (
                      <BiLoader className="animate-spin text-2xl text-blue-400" />
                    ) : (
                      <AiOutlineCloudUpload
                        size={30}
                        className="cursor-pointer text-gray-400 group-hover:text-blue-400"
                      />
                    )}
                  </label>
                )}

                {uploadedImages &&
                  uploadedImages.map((item: any, index: any) => (
                    <div
                      key={index}
                      className="relative group h-[80px] w-[80px] border border-form-border rounded-sm mr-2 last:mr-0 overflow-hidden"
                    >
                      <Image
                        src={item.url}
                        alt=""
                        fill
                        className="h-full w-full object-contain"
                      />
                      <div className="hidden group-hover:flex absolute top-0 bottom-0 w-full h-full items-center justify-center bg-black/30">
                        <div className="w-fit flex gap-2">
                          <AiOutlineEye
                            onClick={() => handleShowPreview(item.url)}
                            className="text-white text-lg cursor-pointer"
                          />
                          <BiTrashAlt
                            onClick={() => toggleDeleteModal(item.public_id)}
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
              text={productId ? "Update" : "Create"}
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
          <Image
            src={preview}
            alt=""
            width={400}
            height={400}
            className="w-full h-[400px] object-contain"
          />
        </div>
      </CustomModal>
      <ConfirmationModal
        title="Are you sure, you want to delete this?"
        okText="Delete"
        loading={loader}
        okBtn={handleDelete}
        cancelBtn={() => setDeleteModal(false)}
        open={deleteModal}
        boxStyle="!max-w-[450px]"
        okBtnClass="bg-red-500 text-white hover:text-red-500 hover:bg-red-500 border !border-[red]"
      >
        <div className="my-5">This will be deleted</div>
      </ConfirmationModal>
      <ConfirmationModal
        title="Do you want to delete this product?"
        okText="Delete"
        loading={loader}
        okBtn={handleDeleteProduct}
        cancelBtn={() => setDeleteProductModal(false)}
        open={deleteProductModal}
        boxStyle="!max-w-[450px]"
        okBtnClass="bg-red-500 text-white hover:text-red-500 hover:bg-red-500 border !border-[red]"
      >
        <div className="my-5">This product will permanently deleted</div>
      </ConfirmationModal>
    </div>
  );
}

export default Products;
