import React from "react";

const Box = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-pink-100 h-20 flex justify-center items-center shrink-0">
      {children}
    </div>
  );
};

export default Box;
