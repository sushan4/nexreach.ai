'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'An interactive bar chart';

const chartData = [
  { date: '2024-04-01', Hair: 222, Face: 150 },
  { date: '2024-04-02', Hair: 97, Face: 180 },
  { date: '2024-04-03', Hair: 167, Face: 120 },
  { date: '2024-04-04', Hair: 242, Face: 260 },
  { date: '2024-04-05', Hair: 373, Face: 290 },
  { date: '2024-04-06', Hair: 301, Face: 340 },
  { date: '2024-04-07', Hair: 245, Face: 180 },
  { date: '2024-04-08', Hair: 409, Face: 320 },
  { date: '2024-04-09', Hair: 59, Face: 110 },
  { date: '2024-04-10', Hair: 261, Face: 190 },
  { date: '2024-04-11', Hair: 327, Face: 350 },
  { date: '2024-04-12', Hair: 292, Face: 210 },
  { date: '2024-04-13', Hair: 342, Face: 380 },
  { date: '2024-04-14', Hair: 137, Face: 220 },
  { date: '2024-04-15', Hair: 120, Face: 170 },
  { date: '2024-04-16', Hair: 138, Face: 190 },
  { date: '2024-04-17', Hair: 446, Face: 360 },
  { date: '2024-04-18', Hair: 364, Face: 410 },
  { date: '2024-04-19', Hair: 243, Face: 180 },
  { date: '2024-04-20', Hair: 89, Face: 150 },
  { date: '2024-04-21', Hair: 137, Face: 200 },
  { date: '2024-04-22', Hair: 224, Face: 170 },
  { date: '2024-04-23', Hair: 138, Face: 230 },
  { date: '2024-04-24', Hair: 387, Face: 290 },
  { date: '2024-04-25', Hair: 215, Face: 250 },
  { date: '2024-04-26', Hair: 75, Face: 130 },
  { date: '2024-04-27', Hair: 383, Face: 420 },
  { date: '2024-04-28', Hair: 122, Face: 180 },
  { date: '2024-04-29', Hair: 315, Face: 240 },
  { date: '2024-04-30', Hair: 454, Face: 380 },
  { date: '2024-05-01', Hair: 165, Face: 220 },
  { date: '2024-05-02', Hair: 293, Face: 310 },
  { date: '2024-05-03', Hair: 247, Face: 190 },
  { date: '2024-05-04', Hair: 385, Face: 420 },
  { date: '2024-05-05', Hair: 481, Face: 390 },
  { date: '2024-05-06', Hair: 498, Face: 520 },
  { date: '2024-05-07', Hair: 388, Face: 300 },
  { date: '2024-05-08', Hair: 149, Face: 210 },
  { date: '2024-05-09', Hair: 227, Face: 180 },
  { date: '2024-05-10', Hair: 293, Face: 330 },
  { date: '2024-05-11', Hair: 335, Face: 270 },
  { date: '2024-05-12', Hair: 197, Face: 240 },
  { date: '2024-05-13', Hair: 197, Face: 160 },
  { date: '2024-05-14', Hair: 448, Face: 490 },
  { date: '2024-05-15', Hair: 473, Face: 380 },
  { date: '2024-05-16', Hair: 338, Face: 400 },
  { date: '2024-05-17', Hair: 499, Face: 420 },
  { date: '2024-05-18', Hair: 315, Face: 350 },
  { date: '2024-05-19', Hair: 235, Face: 180 },
  { date: '2024-05-20', Hair: 177, Face: 230 },
  { date: '2024-05-21', Hair: 82, Face: 140 },
  { date: '2024-05-22', Hair: 81, Face: 120 },
  { date: '2024-05-23', Hair: 252, Face: 290 },
  { date: '2024-05-24', Hair: 294, Face: 220 },
  { date: '2024-05-25', Hair: 201, Face: 250 },
  { date: '2024-05-26', Hair: 213, Face: 170 },
  { date: '2024-05-27', Hair: 420, Face: 460 },
  { date: '2024-05-28', Hair: 233, Face: 190 },
  { date: '2024-05-29', Hair: 78, Face: 130 },
  { date: '2024-05-30', Hair: 340, Face: 280 },
  { date: '2024-05-31', Hair: 178, Face: 230 },
  { date: '2024-06-01', Hair: 178, Face: 200 },
  { date: '2024-06-02', Hair: 470, Face: 410 },
  { date: '2024-06-03', Hair: 103, Face: 160 },
  { date: '2024-06-04', Hair: 439, Face: 380 },
  { date: '2024-06-05', Hair: 88, Face: 140 },
  { date: '2024-06-06', Hair: 294, Face: 250 },
  { date: '2024-06-07', Hair: 323, Face: 370 },
  { date: '2024-06-08', Hair: 385, Face: 320 },
  { date: '2024-06-09', Hair: 438, Face: 480 },
  { date: '2024-06-10', Hair: 155, Face: 200 },
  { date: '2024-06-11', Hair: 92, Face: 150 },
  { date: '2024-06-12', Hair: 492, Face: 420 },
  { date: '2024-06-13', Hair: 81, Face: 130 },
  { date: '2024-06-14', Hair: 426, Face: 380 },
  { date: '2024-06-15', Hair: 307, Face: 350 },
  { date: '2024-06-16', Hair: 371, Face: 310 },
  { date: '2024-06-17', Hair: 475, Face: 520 },
  { date: '2024-06-18', Hair: 107, Face: 170 },
  { date: '2024-06-19', Hair: 341, Face: 290 },
  { date: '2024-06-20', Hair: 408, Face: 450 },
  { date: '2024-06-21', Hair: 169, Face: 210 },
  { date: '2024-06-22', Hair: 317, Face: 270 },
  { date: '2024-06-23', Hair: 480, Face: 530 },
  { date: '2024-06-24', Hair: 132, Face: 180 },
  { date: '2024-06-25', Hair: 141, Face: 190 },
  { date: '2024-06-26', Hair: 434, Face: 380 },
  { date: '2024-06-27', Hair: 448, Face: 490 },
  { date: '2024-06-28', Hair: 149, Face: 200 },
  { date: '2024-06-29', Hair: 103, Face: 160 },
  { date: '2024-06-30', Hair: 446, Face: 400 }
];

const chartConfig = {
  views: {
    label: 'Page Views'
  },
  Hair: {
    label: 'Hair',
    color: 'hsl(var(--chart-1))'
  },
  Face: {
    label: 'Face',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('Hair');

  const total = React.useMemo(
    () => ({
      Hair: chartData.reduce((acc, curr) => acc + curr.Hair, 0),
      Face: chartData.reduce((acc, curr) => acc + curr.Face, 0)
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Performance</CardTitle>
          <CardDescription>
            Showing total sales for each product
          </CardDescription>
        </div>
        <div className="flex">
          {['Hair', 'Face'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
