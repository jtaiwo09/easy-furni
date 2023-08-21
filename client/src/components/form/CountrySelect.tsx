import FormHelperText from "@mui/material/FormHelperText";
import { Country } from "country-state-city";

interface IProps {
  name: string;
  label: string;
  defaultText?: string;
  errors: any;
  register: any;
  formGroup: string;
}
function CountrySelect({
  name,
  label,
  defaultText = "Select from the list",
  errors,
  register,
  formGroup,
}: IProps) {
  return (
    <div className={`${formGroup}`}>
      <label
        htmlFor={name}
        className="leading-[18px] text-sm font-medium block tracking-[0.5px] mb-1"
      >
        {label}
      </label>
      <select
        id={name}
        className="w-full h-[46px] px-4 border border-form-border focus:outline-none"
        {...register(name)}
      >
        <option value="">{defaultText}</option>
        {Country &&
          Country.getAllCountries().map((item) => (
            <option key={item.isoCode} value={item.isoCode}>
              {item.name}
            </option>
          ))}
      </select>
      <FormHelperText className="!text-red-500 mt-1">
        {errors[name]?.message}
      </FormHelperText>
    </div>
  );
}

export default CountrySelect;
