"use client";
import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Product from "./Product";
import { fetchNewProduct } from "@/services/product";
import { toast } from "react-toastify";
import { BiLoader } from "react-icons/bi";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className="mt-8 w-full min-h-[100px]"
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function NewProducts() {
  const [value, setValue] = useState(0);
  const [filterByCategory, setFilterByCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const tabs = useMemo(() => ["Sofa", "Dinning", "Table", "Chair", "Bed"], []);

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setLoading(true);
    setValue(newValue);
    const category = tabs[newValue];
    const res = await fetchNewProduct(category);
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setFilterByCategory(data.products);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="py-14">
      <h1 className="text-[24px] mb-5 font-bold leading-[30px] tracking-[1px] text-primary text-center uppercase">
        New Products
      </h1>
      <div className="max-w-[1200px] mx-auto">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="New products"
          variant="scrollable"
          allowScrollButtonsMobile
          className="xs:w-fit xs:mx-auto"
        >
          {tabs.map((item, i) => (
            <Tab
              label={item}
              key={i}
              {...a11yProps(i)}
              className="text-primary/50 font-semibold border-none"
            />
          ))}
        </Tabs>

        {tabs.map((item, i) => (
          <TabPanel key={item} value={value} index={i}>
            {loading ? (
              <div className="w-full h-[100px] flex justify-center items-center">
                <BiLoader className="animate-spin text-4xl" />
              </div>
            ) : (
              <>
                {filterByCategory.length > 0 ? (
                  <Box className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] px-5 col-gap">
                    {filterByCategory.map((product: any) => (
                      <Product key={product._id} data={product} />
                    ))}
                  </Box>
                ) : (
                  <div className="w-full min-h-[100px] text-base flex justify-center items-center">
                    No {tabs[i]} Found
                  </div>
                )}
              </>
            )}
          </TabPanel>
        ))}
      </div>
    </div>
  );
}

export default NewProducts;
