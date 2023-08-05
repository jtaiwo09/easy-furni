import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { RxAvatar } from "react-icons/rx";

function Upload({ label }: any) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const handleFileUpload = (field: any, e: any) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      field.onChange(e.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <Controller
      name={label}
      control={control}
      render={({ field }) => {
        return (
          <div className="">
            <label
              htmlFor="avatar"
              className="text-sm font-medium text-primary/70"
            ></label>
            <div className="mt-2 flex items-center">
              <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                {field.value ? (
                  <img
                    src={field.value}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <RxAvatar className="h-8 w-8" />
                )}
              </span>
              <label
                htmlFor="file-input"
                className="cursor-pointer ml-5 flex items-center justify-center px-4 py-2 border border-borderCol rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:bg-gray-50"
              >
                <span>Upload a file</span>
                <input
                  onChange={(e: any) => handleFileUpload(field, e)}
                  onBlur={field.onBlur}
                  name="avatar"
                  type="file"
                  id="file-input"
                  accept=".jpeg,.jpg,.png"
                  className="sr-only"
                />
              </label>
            </div>
            <p className="text-red-500 text-xs mt-1">
              {errors[label]?.message as any}
            </p>
          </div>
        );
      }}
    />
  );
}

export default Upload;
