import React, { useEffect, useRef, useState } from "react";

export function SimpleBarChart({ title, labels, values, barColor = "#3b82f6", height = 120, barWidth = 28, gap = 16, labelAngle = 0, labelFontSize = 10, labelColor = "#6b7280", fitToWidth = false }: { title: string; labels: string[]; values: number[]; barColor?: string; height?: number; barWidth?: number; gap?: number; labelAngle?: number; labelFontSize?: number; labelColor?: string; fitToWidth?: boolean }) {
  const max = Math.max(1, ...values);

  const labelPadding = labelAngle === 0 ? Math.max(18, labelFontSize + 8) : Math.max(28, Math.ceil(labelFontSize * 2.4));
  const svgHeight = height + labelPadding + 8;
  const labelY = height + (labelAngle === 0 ? 12 : 6);
  const textAnchor = labelAngle === 0 ? "middle" : "end";
  const dominantBaseline = labelAngle === 0 ? "auto" : "hanging";

  const leadingPad = labelAngle === 0 ? gap : Math.max(gap, Math.ceil(labelFontSize * 2));
  const trailingPad = gap;

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!fitToWidth) return;
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        setContainerWidth(cr.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [fitToWidth]);

  let dynBarWidth = barWidth;
  let dynGap = gap;
  if (fitToWidth && containerWidth) {
    const available = Math.max(0, containerWidth - leadingPad - trailingPad - 8); 
    const n = values.length;
    const minGap = 10;
    const minBar = 16;
    const maxBar = 80;
    let targetGap = Math.max(minGap, gap);
    let solvedBar = (available - (n - 1) * targetGap) / n;
    if (solvedBar < minBar) {
      targetGap = minGap;
      solvedBar = (available - (n - 1) * targetGap) / n;
    }
    dynBarWidth = Math.min(Math.max(solvedBar, minBar), maxBar);
    const remaining = available - n * dynBarWidth;
    dynGap = Math.max(minGap, remaining / Math.max(1, n - 1));
  }

  const innerWidth = values.length * dynBarWidth + (values.length - 1) * dynGap;
  const computedWidth = leadingPad + innerWidth + trailingPad;

  return (
    <div ref={containerRef} className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="font-semibold mb-2">{title}</div>
      <svg
        width="100%"
        height={svgHeight}
        role="img"
        aria-label={title}
        viewBox={`0 0 ${computedWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMin meet"
      >
        {values.map((v, i) => {
          const h = Math.round((v / max) * height);
          const x = leadingPad + i * (dynBarWidth + dynGap);
          const y = height - h;
          const cx = x + dynBarWidth / 2;
          return (
            <g key={i}>
              <rect x={x} y={y} width={dynBarWidth} height={h} rx={4} fill={barColor} />
              <text
                x={cx}
                y={labelY}
                textAnchor={textAnchor}
                fontSize={labelFontSize}
                fill={labelColor}
                dominantBaseline={dominantBaseline as any}
                transform={labelAngle !== 0 ? `rotate(${labelAngle} ${cx} ${labelY})` : undefined}
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
