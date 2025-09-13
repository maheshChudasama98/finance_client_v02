import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useAmountVisibility } from 'src/hooks/use-amount-visibility';

import { formatToINR } from 'src/utils/format-number';

export default function QuickInsights({
  currentMonth = [],
  currentYearData = {},
  lastMonth = [],
  topCategories = [],
  currentBalance = 0,
}) {
  const { isAmountVisible } = useAmountVisibility();

  const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Handle both array and object formats for lastMonth
  const lastMonthData = Array.isArray(lastMonth) ? lastMonth[0] || {} : lastMonth;
  const currentMonthData = Array.isArray(currentMonth) ? currentMonth[0] || {} : currentMonth;

  const netIncome = (currentYearData?.totalIn || 0) - (currentYearData?.totalOut || 0);
  const monthlyChange = calculatePercentageChange(currentMonthData?.totalIn, lastMonthData?.totalIn);
  const expenseChange = calculatePercentageChange(currentMonthData?.totalOut, lastMonthData?.totalOut);

  const insights = [
    {
      title: 'Net Income',
      value: netIncome,
      change: monthlyChange - expenseChange,
      color: netIncome >= 0 ? 'success.main' : 'error.main',
      icon:
        netIncome >= 0 ? (
          <i className="fa-solid fa-arrow-trend-up" style={{ color: '#00A76F' }} />
        ) : (
          <i className="fa-solid fa-arrow-trend-down" style={{ color: '#FF5630' }} />
        ),
    },
    {
      title: 'Current Balance',
      value: currentBalance,
      change: topCategories?.[0]?.totalOut || 0,
      color: 'warning.main',
      icon: '💰',
    },
    {
      title: 'Savings Rate',
      value: currentYearData?.totalIn > 0 ? (netIncome / currentYearData.totalIn) * 100 : 0,
      change: 0,
      color: 'info.main',
      icon: <i className="fa-solid fa-piggy-bank" style={{ color: '#FFAB00' }} />,
      format: 'percentage',
    },
  ];

  const formatValue = (value, format) => {
    if (format === 'percentage') {
      return `${value.toFixed(1)}%`;
    }
    if (format === 'currency') {
      return formatToINR(value, isAmountVisible);
    }
    if (format === 'text') {
      return value;
    }
    return formatToINR(value, isAmountVisible);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Quick Insights
        </Typography>

        <Grid container spacing={2}>
          {insights.map((insight, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'grey.50',
                  border: 1,
                  borderColor: 'grey.200',
                }}
              >
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <Typography variant="h5">{insight.icon}</Typography>
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
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

QuickInsights.propTypes = {
  currentMonth: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  currentYearData: PropTypes.object,
  lastMonth: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  topCategories: PropTypes.array,
  currentBalance: PropTypes.number,
};
