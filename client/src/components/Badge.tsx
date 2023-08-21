import React from "react";

function Badge({ status }: { status: string }) {
  function statusColour() {
    switch (status.toLowerCase()) {
      case "paid":
      case "success":
      case "delivered":
        return "bg-green-100 text-green-600";
      case "not paid":
        return "bg-red-100 text-red-600";
      default:
        return "bg-orange-100 text-orange-600";
    }
  }
  return (
    <span
      className={`${statusColour()} font-medium px-3 py-1 text-xs rounded-xl w-fit`}
    >
      {status}
    </span>
  );
}

export default Badge;
