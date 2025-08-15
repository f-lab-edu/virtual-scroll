import { useState, useEffect, useRef, useMemo } from "react";
import { NODE_HEIGHT } from "./constants";

const NODE_GAP = 8;
const PADDING_NODE = 3;
const ROW_HEIGHT = NODE_HEIGHT + NODE_GAP;

import Box from "./box";
function App() {
  const [range, setRange] = useState({ start: 0, end: 0 }); // 시작 끝 노드 인덱스

  const windowHeight = window.innerHeight; // 뷰포트 높이
  const items = Array.from({ length: 10000 }, (_, i) => i); // 노드 개수

  const frameRef = useRef<number | null>(null); //뷰포트?의 DOM
  const lastScrollTopRef = useRef<number>(0); // 계산용 마지막 스크롤 위치
  const lastRangeRef = useRef(range); // 계산용 마지막 범위

  const computeRange = (scrollTop: number, viewportHeight: number) => {
    const startIdx = Math.floor(scrollTop / ROW_HEIGHT);
    const visibleCount = Math.ceil(viewportHeight / ROW_HEIGHT); // 범위 안에 들어갈 실제 노드들 개수

    const start = Math.max(0, startIdx - PADDING_NODE);
    const end = Math.min(items.length, startIdx + visibleCount + PADDING_NODE);

    return { start, end };
  };

  const flush = () => {
    frameRef.current = null;

    const next = computeRange(lastScrollTopRef.current, windowHeight);

    if (
      next.start !== lastRangeRef.current.start ||
      next.end !== lastRangeRef.current.end
    ) {
      lastRangeRef.current = next;
      setRange(next);
    }
  };

  const onScroll = () => {
    if (typeof window === "undefined") return;

    lastScrollTopRef.current = window.scrollY;
    if (frameRef.current == null) {
      frameRef.current = requestAnimationFrame(flush);
    }
  };

  const slice = useMemo(() => {
    const nodes: React.ReactNode[] = [];
    for (let i = range.start; i < range.end; i++) {
      nodes.push(<Box key={i}>{i}</Box>);
    }
    return nodes;
  }, [items, range.start, range.end]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    lastScrollTopRef.current = window.scrollY;
    frameRef.current = requestAnimationFrame(flush);

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, [items.length]);

  const offsetY = range.start * ROW_HEIGHT;
  const totalHeight = items.length * ROW_HEIGHT;

  return (
    <div className="w-full min-h-screen">
      <div className="relative" style={{ height: `${totalHeight}px` }}>
        <div
          className="flex flex-col"
          style={{
            transform: `translateY(${offsetY}px)`,
            gap: `${NODE_GAP}px`,
          }}
        >
          {slice}
        </div>
      </div>
    </div>
  );
}

export default App;
