import React from "react";
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Bar,
  ComposedChart,
} from "recharts";

export type PopulationChartData = {
  "Nation ID": string;
  Nation: string;
  Year: number;
  "Total Population": number;
};

interface PopulationChartProps {
  data: PopulationChartData[];
  chartType?: "line" | "bar";
}

export const PopulationChart: React.FC<PopulationChartProps> = ({
  data,
  chartType = "bar",
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={data}
        margin={{ top: 16, right: 24, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="Year" />
        <YAxis domain={["dataMin", "dataMax + 1000"]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--accent-3)",
            border: "1px solid var(--accent-1)",
            borderRadius: "8px",
          }}
          labelFormatter={(label) => `Year: ${label}`}
          formatter={(value) =>
            value.toLocaleString("de-DE", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
          }
        />
        <Legend />
        {chartType === "line" && (
          <>
            <Line
              type="monotone"
              dataKey="Total Population"
              stroke="#f44336"
              name="Population"
              activeDot={{ r: 8 }}
            />
          </>
        )}
        {chartType === "bar" && (
          <>
            <Bar
              dataKey="Total Population"
              fill="#f44336"
              name="Population"
              radius={[4, 4, 0, 0]}
            />
          </>
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
