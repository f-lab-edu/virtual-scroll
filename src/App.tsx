import { useState, useEffect } from "react";
import { NODE_HEIGHT } from "./constants";

const gap = 0;
const nodePadding = 1;
const rowHeight = NODE_HEIGHT + gap;

import Box from "./box";
function App() {
  const [scrollTop, setScrollTop] = useState<number>(0);
  const windowHeight = window.innerHeight;
  const items = Array.from({ length: 10000 }, (_, i) => i);

  const onScroll = () => {
    setScrollTop(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // NOTE 디버깅용 콘솔. 이후 지우기
  useEffect(() => {
    console.log("scrollTop", scrollTop);
  }, [scrollTop]);

  const startIdx = Math.max(0, Math.floor(scrollTop / rowHeight) - nodePadding);
  const endIdx = Math.min(
    items.length,
    Math.ceil((scrollTop + windowHeight) / rowHeight) + nodePadding
  );

  const offsetY = startIdx * rowHeight;
  const visibleItems = items.slice(startIdx, endIdx);

  const totalHeight = items.length * rowHeight;

  return (
    <div className="w-full min-h-screen">
      <div className="relative" style={{ height: totalHeight }}>
        <div
          className="flex flex-col gap-2"
          style={{ transform: `translateY(${offsetY}px)` }}
        >
          {visibleItems.map((item, i) => (
            <Box key={i}>{startIdx + i}</Box>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
