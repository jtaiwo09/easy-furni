import React from "react";

function Badge({ status }: { status: string }) {
  function statusColour() {
    switch (status.toLowerCase()) {
      case "paid":
      case "success":
      case "delivered":
        return "bg-green-200/80 text-green-600 border border-green-500";
      case "not paid":
        return "bg-red-200/80 text-red-600 border border-red-500";
      default:
        return "bg-orange-200/80 text-orange-600 border border-red-500";
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
