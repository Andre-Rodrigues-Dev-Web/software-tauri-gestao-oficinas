import React from "react";

export function SimpleLineChart({ title, values, labels, lineColor = "#111827" }: { title: string; values: number[]; labels: string[]; lineColor?: string }) {
  const width = 420;
  const height = 160;
  const padding = 24;
  const max = Math.max(1, ...values);
  const stepX = (width - padding * 2) / Math.max(1, values.length - 1);
  const points = values.map((v, i) => [padding + i * stepX, height - padding - (v / max) * (height - padding * 2)] as const);
  const path = points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="font-semibold mb-2">{title}</div>
      <svg width={width} height={height} role="img">
        <path d={path} fill="none" stroke={lineColor} strokeWidth={2} />
      </svg>
    </div>
  );
}
