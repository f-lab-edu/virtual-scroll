import Box from "./Box";
import { useEffect, useState } from "react";

const BOX_HEIGHT = 80;
const BOX_GAP = 4;
const NODE_HEIGHT = BOX_HEIGHT + BOX_GAP;

const VirtualScrollBox = () => {
  const items = Array.from({ length: 1000 }, (_, i) => i); // 노드 개수
  const [startIdx, setStartIdx] = useState<number>(0);
  const [visibleNodeCount, setVisibleNodeCount] = useState<number>(0);

  const computeRange = () => {
    const scrollTop = window.scrollY;
    const startIdx = Math.floor(scrollTop / NODE_HEIGHT);

    setStartIdx(startIdx);
  };

  useEffect(() => {
    // 현재 출력 가능한 노드 개수 계산
    const windowHeight = window.innerHeight;
    setVisibleNodeCount(Math.floor(windowHeight / NODE_HEIGHT));

    computeRange();
    window.addEventListener("scroll", computeRange, { passive: true });
    return () => {
      window.removeEventListener("scroll", computeRange);
    };
  }, []);

  return (
    <div
      className={`flex flex-col gap-2 w-full h-screen`}
      style={{
        paddingTop: `${startIdx * NODE_HEIGHT}px`,
        paddingBottom: `${
          (items.length - 1 - (startIdx + visibleNodeCount)) * NODE_HEIGHT
        }px`,
      }}
    >
      {items.map(
        (v, i) =>
          i >= startIdx &&
          i <= startIdx + visibleNodeCount && <Box key={i}>{v}</Box>
      )}
    </div>
  );
};

export default VirtualScrollBox;
