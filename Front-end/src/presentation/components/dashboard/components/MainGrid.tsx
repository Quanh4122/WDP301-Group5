import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import CustomizedDataGrid from './CustomizedDataGrid';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard, { StatCardProps } from './StatCard';
import { getUserTrend, getRequestTrend } from "../dashboardAPI";
import React, { useEffect, useState } from "react";

const MainGrid = () => {
  // posts will be an array of 2 arrays (each API's output wrapped in an array)
  const [posts, setPosts] = useState<any[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userTrend, requestTrend] = await Promise.all([
          getUserTrend(),
          getRequestTrend()
        ]);
        // Wrap each result in an array if it's not already one.
        const userTrendArr = Array.isArray(userTrend) ? userTrend : [userTrend];
        const requestTrendArr = Array.isArray(requestTrend) ? requestTrend : [requestTrend];
        setPosts([userTrendArr, requestTrendArr]);
      } catch (error) {
        console.error("Error fetching trends:", error);
      }
    };

    fetchData();
  }, []);

  // Flatten the nested array so we can easily map over each StatCard.
  const flatPosts = posts.flat();

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {flatPosts.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 6 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12 }}>
          <CustomizedDataGrid />
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
};

export default MainGrid;
