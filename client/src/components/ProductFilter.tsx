"use client";
import { categoriesData } from "@/utils/data";
import React from "react";
import CurrencyInput from "react-currency-input-field";
import CustomButton from "./form/CustomButton";
import Slider from "@mui/material/Slider";
import Drawer from "./modals/Drawer";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { toggleFilter } from "@/redux/slices/productSlice";
import { useRouter, useSearchParams } from "next/navigation";

interface IProps {
  filterObject: any;
  setFilterObject: any;
}

function ProductFilter({ filterObject, setFilterObject }: IProps) {
  const [value, setValue] = React.useState<number[]>([0, 50000]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { showFilter } = useAppSelector((state) => state.product);

  const handleSlideChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  const activeTab = (v: string) => {
    return searchParams.get("category") === v;
  };

  const handleClick = (title: string) => {
    const params = { ...filterObject, category: title };
    setFilterObject(params);
    const queryString = new URLSearchParams(params).toString();
    router.push(`/product?${queryString}`);
  };

  const filterByPrice = async () => {
    const params = {
      ...filterObject,
      "discountPrice[$gte]": `${value[0]}`,
      "discountPrice[$lte]": `${value[1]}`,
    };
    setFilterObject(params);
    const queryString = new URLSearchParams(params).toString();
    router.push(`/product?${queryString}`);
  };

  const clearFilter = () => {
    setFilterObject({});
    router.push("/product");
  };

  const inputHandler = (v: any, str: string) => {
    const inputValue = Number(v);
    if (str === "min") {
      if (!isNaN(inputValue)) {
        setValue((prev) => [inputValue, prev[1]]);
      } else {
        setValue((prev) => [0, prev[1]]);
      }
    } else if (str === "max") {
      if (!isNaN(inputValue)) {
        setValue((prev) => [prev[0], inputValue]);
      } else {
        setValue((prev) => [prev[0], 0]);
      }
    }
  };

  return (
    <>
      <div className="w-[25%] min-w-[250px] bg-white rounded-md shadow-sm p-4 h-fit sticky top-[80px] hidden sm:block">
        <div className="mb-6">
          <h2 className="mb-2 font-semibold">Category</h2>
          <ul>
            <li
              onClick={clearFilter}
              className="cursor-pointer text-sm py-1.5 hover:text-text-hover font-medium"
            >
              All
            </li>
            {categoriesData &&
              categoriesData.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleClick(item.title)}
                  className={`${
                    activeTab(item.title) && "!text-text-hover"
                  } cursor-pointer text-sm py-1.5 hover:text-text-hover font-medium`}
                >
                  {item.title}
                </li>
              ))}
          </ul>
        </div>
        <div className="">
          <h2 className="mb-2 font-semibold">Price</h2>
          <Slider
            getAriaLabel={() => "Temperature range"}
            value={value}
            size="small"
            step={1000}
            min={0}
            max={50000}
            onChange={handleSlideChange}
            valueLabelDisplay="auto"
          />
          <div className="flex items-center mt-2 gap-1">
            <div className="">
              <label htmlFor="min" className="text-sm font-semibold mb-1 block">
                Min
              </label>
              <CurrencyInput
                id="min"
                placeholder="Min"
                value={value[0]}
                onValueChange={(e) => inputHandler(e, "min")}
                className="h-[40px] border border-form-border w-full focus:outline-none rounded-none px-2 text-sm"
                intlConfig={{ locale: "en-NG", currency: "NGN" }}
              />
            </div>
            -
            <div className="">
              <label htmlFor="max" className="text-sm font-semibold mb-1 block">
                Max
              </label>
              <CurrencyInput
                id="max"
                placeholder="Max"
                value={value[1]}
                onValueChange={(e) => inputHandler(e, "max")}
                className="h-[40px] border border-form-border w-full focus:outline-none rounded-none px-2 text-sm"
                intlConfig={{ locale: "en-NG", currency: "NGN" }}
              />
            </div>
          </div>
          <CustomButton
            text="Save"
            extraClass="mt-3"
            handleClick={filterByPrice}
          />
        </div>
        <CustomButton
          text="Clear Filter"
          extraClass="mt-10 w-full"
          handleClick={clearFilter}
        />
      </div>
      <Drawer
        anchor="left"
        open={showFilter}
        toggleModal={() => dispatch(toggleFilter())}
        width={350}
        showCloseBtn={true}
      >
        <div className=" mt-10 mb-8">
          <div className="mb-6">
            <h2 className="pb-2 font-semibold border-b px-5">Category</h2>
            <ul className="px-4">
              <li
                onClick={clearFilter}
                className="cursor-pointer text-sm py-1.5 hover:text-text-hover font-medium"
              >
                All
              </li>
              {categoriesData &&
                categoriesData.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleClick(item.title)}
                    className="cursor-pointer text-sm py-1.5 hover:text-text-hover font-medium"
                  >
                    {item.title}
                  </li>
                ))}
            </ul>
          </div>
          <div className="">
            <h2 className="pb-2 font-semibold border-b px-4">Price</h2>
            <div className="px-4">
              <Slider
                getAriaLabel={() => "Temperature range"}
                value={value}
                size="small"
                step={1000}
                min={0}
                max={50000}
                onChange={handleSlideChange}
                valueLabelDisplay="auto"
              />
              <div className="flex items-center mt-2 gap-1">
                <div className="">
                  <label
                    htmlFor="min"
                    className="text-sm font-semibold mb-1 block"
                  >
                    Min
                  </label>
                  <CurrencyInput
                    id="min"
                    placeholder="Min"
                    value={value[0]}
                    onValueChange={(e) => inputHandler(e, "min")}
                    className="h-[40px] border border-form-border w-full focus:outline-none rounded-none px-2 text-sm"
                    intlConfig={{ locale: "en-NG", currency: "NGN" }}
                  />
                </div>
                -
                <div className="">
                  <label
                    htmlFor="max"
                    className="text-sm font-semibold mb-1 block"
                  >
                    Max
                  </label>
                  <CurrencyInput
                    id="max"
                    placeholder="Max"
                    value={value[1]}
                    onValueChange={(e) => inputHandler(e, "max")}
                    className="h-[40px] border border-form-border w-full focus:outline-none rounded-none px-2 text-sm"
                    intlConfig={{ locale: "en-NG", currency: "NGN" }}
                  />
                </div>
              </div>
              <CustomButton
                text="Save"
                extraClass="mt-3"
                handleClick={filterByPrice}
              />
            </div>
          </div>
          <div className="px-4">
            <CustomButton
              text="Clear Filter"
              extraClass="mt-10 w-full"
              handleClick={clearFilter}
            />
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default ProductFilter;
