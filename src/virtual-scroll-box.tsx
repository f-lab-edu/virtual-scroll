import Box from "./Box";
import { useEffect, useState, useRef } from "react";

const BOX_HEIGHT = 80;
const BOX_GAP = 4;
const PADDING_NODE = 4;
const NODE_HEIGHT = BOX_HEIGHT + BOX_GAP;

const VirtualScrollBox = () => {
  const items = Array.from({ length: 100000 }, (_, i) => i); // 노드 개수
  const [startIdx, setStartIdx] = useState<number>(0);
  const [visibleNodeCount, setVisibleNodeCount] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafId = useRef<number | null>(null);

  const containerObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.contentRect.height === 0) return;
      computeVisibleCount(entry.contentRect.height);
    });
  });

  // 출력할 범위 인덱스 계산
  const computeRange = () => {
    if (!containerRef.current) return;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    const scrollTop = containerRef.current.scrollTop;
    let startIdx = Math.floor(scrollTop / NODE_HEIGHT) - PADDING_NODE;
    if (startIdx < 0) {
      startIdx = 0;
    }

    rafId.current = requestAnimationFrame(() => {
      setStartIdx(startIdx);
      rafId.current = null;
    });
  };

  // 현재 출력 가능한 노드 개수 계산
  const computeVisibleCount = (height: number) => {
    const count = Math.floor(height / NODE_HEIGHT) + PADDING_NODE * 2;
    setVisibleNodeCount(count);
  };

  useEffect(() => {
    if (containerRef.current) {
      // 초기화
      const computedStyle = getComputedStyle(containerRef.current);
      const paddingTop = parseFloat(computedStyle.paddingTop.replace("px", ""));
      const paddingBottom = parseFloat(
        computedStyle.paddingBottom.replace("px", "")
      );
      computeVisibleCount(
        containerRef.current.clientHeight - (paddingTop + paddingBottom)
      );
      computeRange();

      containerRef.current.addEventListener("scroll", computeRange, {
        passive: true,
      });
      containerObserver.observe(containerRef.current);
    }
    return () => {
      containerRef.current?.removeEventListener("scroll", computeRange);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`w-full h-screen overflow-y-auto`}>
      <div
        className="flex flex-col gap-2"
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
    </div>
  );
};

export default VirtualScrollBox;
