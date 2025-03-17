import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { useState, useEffect } from 'react';
import { getCarAvailability } from '../dashboardAPI';

// Update your interface to match the expected type from @mui/x-charts
interface ChartSeries {
  id: string;
  label: string;
  showMark: boolean;
  curve: 'linear'; // Use the literal type 'linear'
  stack: 'total';  // Use literal if that's what you expect
  area: boolean;
  stackOrder: 'ascending'; // Use literal if that's what you expect
  data: number[];
}

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function getNext30Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    days.push(
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
  }
  return days;
}

export default function SessionsChart() {
  const theme = useTheme();
  const [chartSeries, setChartSeries] = useState<ChartSeries[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCarAvailability();
        // Make sure the data returned from your API conforms to the ChartSeries type.
        setChartSeries(data);
      } catch (error) {
        console.error("Error fetching car availability:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const xAxisLabels = getNext30Days();

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  // Find the series for "inuse". Fallback to 0 if not found.
  const inUseCount = chartSeries.find(series => series.id === 'inuse')?.data[0] || 0;

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Car Utilization
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {inUseCount} in use
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Car utilization for the next 30 days
          </Typography>
        </Stack>
        <LineChart
          colors={[theme.palette.primary.light, theme.palette.primary.main]}
          xAxis={[
            {
              scaleType: 'point',
              data: xAxisLabels,
              tickInterval: (index, i) => (i + 1) % 5 === 0,
            },
          ]}
          series={chartSeries}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiAreaElement-series-reserved': {
              fill: "url('#reserved')",
            },
            '& .MuiAreaElement-series-free': {
              fill: "url('#free')",
            },
          }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          <AreaGradient color={theme.palette.primary.light} id="reserved" />
          <AreaGradient color={theme.palette.primary.main} id="free" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
