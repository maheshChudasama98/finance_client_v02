import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';

import { formatToINR } from 'src/utils/format-number';

import AnimatedCounter from './AnimatedCounter';

export default function DashboardSummary({
  currentMonth = [],
  currentYearData = {},
  lastMonth = [],
  lastYearData = {},
}) {
  const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getMetricColor = (title, previous) => {
    if (title === 'Total Expense') {
      return previous <= 0 ? 'success.main' : 'error.main';
    }
    return previous >= 0 ? 'success.main' : 'error.main';
  };

  const metrics = [
    {
      title: 'Total Income',
      current: currentYearData?.totalIn || 0,
      previous: calculatePercentageChange(currentMonth?.totalIn, lastMonth?.totalIn),
      color: '#5BC43A',
      positive: true
    },
    {
      title: 'Total Expense',
      current: currentYearData?.totalOut || 0,
      previous: calculatePercentageChange(currentMonth?.totalOut, lastMonth?.totalOut),
      color: '#FF5630',
      positive: false
    },
    {
      title: 'Total Investment',
      current: currentYearData?.totalInvestment || 0,
      previous: calculatePercentageChange(currentMonth?.totalInvestment, lastMonth?.totalInvestment),
      color: '#00B8D9',
      positive: true
    },
    {
      title: 'Total Debit',
      current: currentYearData?.totalDebit || 0,
      previous: calculatePercentageChange(currentYearData?.totalDebit, lastYearData?.totalDebit),
      color: '#8E33FF',
      positive: false
    }
  ];


  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card 
            sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Title */}
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 500,
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  fontSize: '0.75rem'
                }}
              >
                {metric.title}
              </Typography>

              {/* Amount */}
              <Box sx={{ mb: 2 }}>
                <AnimatedCounter 
                  value={metric.current} 
                  format="currency" 
                  variant="h4" 
                  duration={1500}
                  sx={{ 
                    fontWeight: 700,
                    color: 'text.primary',
                    lineHeight: 1.2
                  }}
                />
              </Box>

              {/* Progress Bar */}
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Monthly Change
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      color: getMetricColor(metric.title, metric.previous)
                    }}
                  >
                    {metric.previous >= 0 ? '+' : ''}
                    {metric.previous.toFixed(1)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(Math.abs(metric.previous), 100)}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      backgroundColor: getMetricColor(metric.title, metric.previous),
                    },
                  }}
                />
              </Box>

              {/* Year over Year */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    vs Last Year
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      color: 'text.primary'
                    }}
                  >
                    {formatToINR(metric.current)}
                  </Typography>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

DashboardSummary.propTypes = {
  currentMonth: PropTypes.array,
  currentYearData: PropTypes.object,
  lastMonth: PropTypes.array,
  lastYearData: PropTypes.object,
}; 