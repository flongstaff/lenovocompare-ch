---
name: chart-generator
description: Generate a responsive Recharts component with mobile-first patterns
argument-hint: "<chart-type> <name> <data>"
user-invocable: true
disable-model-invocation: true
---

# Chart Component Generator

Generate a Recharts visualization with responsive design patterns.

## Usage

```
/chart-generator <chart-type> <component-name> <data-description>
```

**Examples:**

- `/chart-generator LineChart SavingsProjection "Monthly savings over time"`
- `/chart-generator AreaChart FanChart "Projection with percentile bands"`
- `/chart-generator PieChart Allocation "Category breakdown"`
- `/chart-generator BarChart Comparison "Side-by-side metric comparison"`

## Supported Types

| Type          | Use Case              |
| ------------- | --------------------- |
| LineChart     | Trends over time      |
| AreaChart     | Ranges/bands/stacked  |
| BarChart      | Comparisons           |
| PieChart      | Proportions           |
| ComposedChart | Multiple series types |

## Instructions

1. **Check project setup**: Look at existing chart components for naming conventions, file locations, and import patterns.

2. **Look up Recharts docs** using context7: `resolve-library-id recharts` then `get-library-docs` with the relevant chart type as topic.

3. **Generate the component** following these responsive patterns:

### Component Template

```jsx
import { useMemo } from "react";
import { ResponsiveContainer, ChartType, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export const ComponentName = ({ data, height = "h-48 sm:h-64" }) => {
  const chartData = useMemo(() => data, [data]);

  return (
    <div className={`${height} w-full`}>
      <ResponsiveContainer width="100%" height="100%">
        <ChartType data={chartData} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="key" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11 }} width={40} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
        </ChartType>
      </ResponsiveContainer>
    </div>
  );
};
```

### Responsive Guidelines

- **Heights**: `h-48 sm:h-64` (small), `h-56 sm:h-72` (medium), `h-64 sm:h-80 lg:h-96` (large)
- **Font sizes**: `fontSize: 11` for ticks and labels
- **YAxis width**: 35-40px fixed (not auto)
- **XAxis interval**: `preserveStartEnd` to avoid label crowding
- **Grid**: `vertical={false}` for cleaner look
- **Margins**: `{ top: 10, right: 10, bottom: 5, left: 0 }`

### Chart-Specific Patterns

**LineChart**: `<Line type="monotone" strokeWidth={2} dot={false} />`
**AreaChart Fan**: Multiple `<Area>` with decreasing opacity for percentile bands
**PieChart**: `<Pie outerRadius="75%">` with `<Cell>` for colors
**BarChart**: `<Bar radius={[4,4,0,0]}/>` for rounded top corners

### Formatting

- Currency: Use project's formatter or `Intl.NumberFormat`
- Percentages: `tickFormatter={(v) => `${v}%``}
- Large numbers: `tickFormatter={(v) => `${(v/1000).toFixed(0)}k``}

4. **Place the file** following project conventions (check existing component locations).

5. **Add TypeScript types** if the project uses TypeScript — define a props interface with typed data shape.
