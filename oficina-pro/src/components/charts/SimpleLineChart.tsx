import React, { useMemo, useState } from "react";

export function SimpleLineChart({
  title,
  values,
  labels,
  lineColor = "#111827",
  width = 420,
  height = 160,
  labelAngle = 0,
  labelFontSize = 10,
  labelColor = "#6b7280",
  valueFormatter,
}: {
  title: string;
  values: number[];
  labels: string[];
  lineColor?: string;
  width?: number;
  height?: number;
  labelAngle?: number;
  labelFontSize?: number;
  labelColor?: string;
  valueFormatter?: (n: number) => string;
}) {
  const padding = 24;
  const max = Math.max(1, ...values);
  const stepX = (width - padding * 2) / Math.max(1, values.length - 1);
  const fmt = valueFormatter ?? ((n: number) => n.toLocaleString("pt-BR"));

  // Extra bottom padding to fit labels if rotated
  const labelPadding = labelAngle === 0 ? Math.max(18, labelFontSize + 6) : Math.max(28, Math.ceil(labelFontSize * 2.2));
  const svgHeight = height + labelPadding;
  const labelY = height + (labelAngle === 0 ? 12 : 6);
  const textAnchor = labelAngle === 0 ? "middle" : "end";

  const points = useMemo(
    () => values.map((v, i) => [padding + i * stepX, height - padding - (v / max) * (height - padding * 2)] as const),
    [values, stepX, height, padding, max]
  );
  const path = points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");

  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="font-semibold mb-2">{title}</div>
      <svg width={width} height={svgHeight} role="img">
        {/* Line path */}
        <path d={path} fill="none" stroke={lineColor} strokeWidth={2} />

        {/* Points and hover handlers */}
        {points.map((p, i) => (
          <g key={i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
          >
            <circle cx={p[0]} cy={p[1]} r={3} fill={lineColor} />
            {/* Larger invisible hit area for easier hover */}
            <circle cx={p[0]} cy={p[1]} r={10} fill="transparent" />
          </g>
        ))}

        {/* X-axis labels */}
        {labels.map((l, i) => {
          const x = padding + i * stepX;
          return (
            <text
              key={`lbl-${i}`}
              x={x}
              y={labelY}
              textAnchor={textAnchor}
              fontSize={labelFontSize}
              fill={labelColor}
              transform={labelAngle !== 0 ? `rotate(${labelAngle} ${x} ${labelY})` : undefined}
            >
              {l}
            </text>
          );
        })}

        {/* Tooltip */}
        {hover !== null && (
          (() => {
            const x = points[hover][0];
            const y = points[hover][1];
            const tipPaddingX = 8;
            const tipPaddingY = 6;
            const label = labels[hover];
            const val = fmt(values[hover]);
            const text = `${label}: ${val}`;
            // Estimate text width (rough): fontSize * 0.6 * chars
            const estCharW = labelFontSize * 0.6;
            const w = Math.max(40, Math.ceil(estCharW * text.length) + tipPaddingX * 2);
            const h = labelFontSize + tipPaddingY * 2;
            const tx = Math.min(Math.max(x - w / 2, padding), width - padding - w);
            const ty = Math.max(y - h - 8, 4);
            return (
              <g key="tooltip">
                <rect x={tx} y={ty} rx={6} ry={6} width={w} height={h} fill="#111827" opacity={0.9} />
                <text x={tx + tipPaddingX} y={ty + h / 2 + labelFontSize / 3} fontSize={labelFontSize} fill="#ffffff">
                  {text}
                </text>
              </g>
            );
          })()
        )}
      </svg>
    </div>
  );
}
