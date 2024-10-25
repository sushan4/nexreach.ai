'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

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
  { browser: 'direct sales', visitors: 275, fill: 'var(--color-direct)' },
  { browser: 'retail sales', visitors: 200, fill: 'var(--color-retail)' },
  { browser: 'wholesale sales', visitors: 287, fill: 'var(--color-wholesale)' },
  { browser: 'B2B sales', visitors: 173, fill: 'var(--color-B2B)' },
  { browser: 'social media sales', visitors: 190, fill: 'var(--color-social)' }
];

const chartConfig = {
  visitors: {
    label: 'Visitors'
  },
  direct: {
    label: 'direct sales',
    color: 'hsl(var(--chart-1))'
  },
  retail: {
    label: 'retail sales',
    color: 'hsl(var(--chart-2))'
  },
  wholesale: {
    label: 'wholesale sales',
    color: 'hsl(var(--chart-3))'
  },
  B2B: {
    label: 'B2B sales',
    color: 'hsl(var(--chart-4))'
  },
  social: {
    label: 'social media sales',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig;

export function PieGraph() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Reveue Breakup </CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[360px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
