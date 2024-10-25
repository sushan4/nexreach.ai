'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
const chartData = [
  { month: 'January', Hair: 186, Face: 80 },
  { month: 'February', Hair: 305, Face: 200 },
  { month: 'March', Hair: 237, Face: 120 },
  { month: 'April', Hair: 73, Face: 190 },
  { month: 'May', Hair: 209, Face: 130 },
  { month: 'June', Hair: 214, Face: 140 }
];

const chartConfig = {
  Hair: {
    label: 'Hair',
    color: 'hsl(var(--chart-1))'
  },
  Face: {
    label: 'Face',
    color: 'hsl(var(--chart-2))'
  },
  Combo: {
    label: 'Combo',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export function AreaGraph() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Sales by Month</CardTitle>
        <CardDescription>
          Showing total sales for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="Face"
              type="natural"
              fill="var(--color-Face)"
              fillOpacity={0.4}
              stroke="var(--color-Face)"
              stackId="a"
            />
            <Area
              dataKey="Hair"
              type="natural"
              fill="var(--color-Hair)"
              fillOpacity={0.4}
              stroke="var(--color-Hair)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
