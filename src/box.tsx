import type { FC, ReactNode } from "react";
import { NODE_HEIGHT } from "./constants";

interface BoxProps {
  children?: ReactNode;
  hidden?: boolean;
}

const Box: FC<BoxProps> = ({ children, hidden = false }) => {
  return (
    <div
      className="w-full bg-yellow-100 rounded-sm shrink-0"
      style={{ height: `${NODE_HEIGHT}px`, display: hidden ? "none" : "block" }}
    >
      {children}
    </div>
  );
};

export default Box;
