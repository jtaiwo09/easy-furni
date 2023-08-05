import React from "react";

function SlideArrow({ className, style, onClick }: any) {
  return (
    <div
      style={{ ...style }}
      className={`${className} !w-[40px] !h-[40px] rounded-full bg-yellow-300 flex justify-center items-center`}
      onClick={onClick}
    >
      N
    </div>
  );
}

export default SlideArrow;
