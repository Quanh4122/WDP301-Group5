import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from "react";
import { getRequestTrend, getUserTrend } from './dashboardAPI';
import StatCard from './components/StatCard';
import SessionsChart from './components/SessionsChart';
import PageViewsBarChart from './components/PageViewsBarChart';


export default function Dashboard(props: { disableCustomTheme?: boolean }) {
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
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, marginTop: '50px', marginBottom: '50px' }}>
        {/* cards */}
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Tổng quát thống kê
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
        {/* <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Details
        </Typography>
        <Grid container spacing={2} columns={12}>
          <Grid size={{ xs: 12 }}>
            <CustomizedDataGrid />
          </Grid>
        </Grid> */}
      </Box>
    );
}