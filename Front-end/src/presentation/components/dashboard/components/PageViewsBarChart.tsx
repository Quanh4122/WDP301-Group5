import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { getIncomeData } from '../dashboardAPI';
import dayjs from 'dayjs';

export default function PageViewsBarChart() {
  const theme = useTheme();
  const colorPalette = [
    theme.palette.primary.dark,
    theme.palette.primary.main,
    theme.palette.primary.light,
  ];

  const [incomeData, setIncomeData] = useState([]);
  const [xAxisData, setXAxisData] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      // Fetch income data from the backend
      const data = await getIncomeData();
      setIncomeData(data);

      // Compute x-axis labels for a 7-month window: past 3 months, current month, and next 3 months
      const months = [];
      const current = dayjs();
      const startMonth = current.subtract(3, 'month');
      for (let i = 0; i < 7; i++) {
        months.push(startMonth.add(i, 'month').format('MMM'));
      }
      setXAxisData(months);
    }
    fetchData();
  }, []);

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Income Data
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
              Income Overview
            </Typography>
            <Chip size="small" color="error" label="-8%" />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Income for the past 3 months, current month, and next 3 months
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'band',
              data: xAxisData.length
                ? xAxisData
                : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            },
          ]}
          series={incomeData.length ? incomeData : []}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
