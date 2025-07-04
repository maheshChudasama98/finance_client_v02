import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { formatToINR } from 'src/utils/format-number';

export default function QuickInsights({
  currentMonth = [],
  currentYearData = {},
  lastMonth = [],
  topCategories = [],
}) {
  const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const netIncome = (currentYearData?.totalIn || 0) - (currentYearData?.totalOut || 0);
  const monthlyChange = calculatePercentageChange(currentMonth?.totalIn, lastMonth?.totalIn);
  const expenseChange = calculatePercentageChange(currentMonth?.totalOut, lastMonth?.totalOut);

  const insights = [
    {
      title: 'Net Income',
      value: netIncome,
      change: monthlyChange - expenseChange,
      color: netIncome >= 0 ? 'success.main' : 'error.main',
      icon: netIncome >= 0 ? '📈' : '📉'
    },
    {
      title: 'Savings Rate',
      value: currentYearData?.totalIn > 0 ? ((netIncome / currentYearData.totalIn) * 100) : 0,
      change: 0,
      color: 'info.main',
      icon: '💰',
      format: 'percentage'
    },
    {
      title: 'Top Category',
      value: topCategories?.[0]?.CategoryName || 'N/A',
      change: topCategories?.[0]?.totalOut || 0,
      color: 'warning.main',
      icon: '🏆',
      format: 'text'
    }
  ];

  const formatValue = (value, format) => {
    if (format === 'percentage') {
      return `${value.toFixed(1)}%`;
    }
    if (format === 'currency') {
      return formatToINR(value);
    }
    if (format === 'text') {
      return value;
    }
    return formatToINR(value);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Quick Insights
        </Typography>
        
        <Grid container spacing={3}>
          {insights.map((insight, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                bgcolor: 'grey.50',
                border: 1,
                borderColor: 'grey.200'
              }}>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <Typography variant="h5">
                    {insight.icon}
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography color="text.secondary" sx={{ mb: 0.5 }} variant="body2">
                      {insight.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: insight.color,
                        fontWeight: 700,
                      }}
                      variant="h6"
                    >
                      {formatValue(insight.value, insight.format)}
                    </Typography>
                  </Box>
                </Stack>
                
                {/* {insight.format !== 'text' && insight.change !== 0 && (
                  <Typography
                    color={insight.change >= 0 ? 'success.main' : 'error.main'}
                    sx={{ fontWeight: 600 }}
                    variant="caption"
                  >
                    {insight.change >= 0 ? '+' : ''}
                    {insight.change.toFixed(1)}% from last month
                  </Typography>
                )} */}
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

QuickInsights.propTypes = {
  currentMonth: PropTypes.array,
  currentYearData: PropTypes.object,
  lastMonth: PropTypes.array,
  topCategories: PropTypes.array,
}; 