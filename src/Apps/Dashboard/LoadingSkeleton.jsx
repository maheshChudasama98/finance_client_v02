import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Unstable_Grid2';
import CardContent from '@mui/material/CardContent';

export default function LoadingSkeleton({ count = 4, type = 'metrics' }) {
  const renderMetricsSkeleton = () => (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="80%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={6} sx={{ borderRadius: 3, mb: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton variant="text" width="40%" height={16} />
                <Skeleton variant="text" width="30%" height={16} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderChartSkeleton = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={280} sx={{ borderRadius: 2 }} />
      </CardContent>
    </Card>
  );

  const renderAccountSkeleton = () => (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width="30%" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="20%" height={20} />
      </Box>
      <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="70%" height={20} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width="50%" height={16} />
                  </Box>
                  <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                </Box>
                <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="80%" height={24} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={4} sx={{ borderRadius: 2, mb: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={6} sx={{ borderRadius: 3, mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton variant="text" width="40%" height={16} />
                  <Skeleton variant="text" width="40%" height={16} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  switch (type) {
    case 'metrics':
      return renderMetricsSkeleton();
    case 'chart':
      return renderChartSkeleton();
    case 'accounts':
      return renderAccountSkeleton();
    default:
      return renderMetricsSkeleton();
  }
}

LoadingSkeleton.propTypes = {
  count: PropTypes.number,
  type: PropTypes.oneOf(['accounts', 'chart', 'metrics']),
}; 