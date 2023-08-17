import React from "react";
import DropdownList from "react-widgets/DropdownList";

interface Data {
  id: string;
  name: string;
}
function Dropdown({ data }: { data: Data | any }) {
  return (
    <div>
      <DropdownList
        data={data}
        dataKey="id"
        textField="name"
        defaultValue={"view"}
      />
    </div>
  );
}

export default Dropdown;
