import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';

import AnimatedChart from './AnimatedChart';
import AnimatedCounter from './AnimatedCounter';

export default function AccountPerformanceChart({ selectedAccount }) {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedAccount) {
      fetchPerformanceData();
    }
  }, [selectedAccount]);

  const fetchPerformanceData = () => {
    setLoading(true);

    const mockData = {
      monthlyData: [
        { month: 'Jan', income: 45000, expense: 32000, balance: 13000 },
        { month: 'Feb', income: 52000, expense: 38000, balance: 14000 },
        { month: 'Mar', income: 48000, expense: 35000, balance: 13000 },
        { month: 'Apr', income: 55000, expense: 42000, balance: 13000 },
        { month: 'May', income: 60000, expense: 45000, balance: 15000 },
        { month: 'Jun', income: 58000, expense: 40000, balance: 18000 },
      ],
      trends: {
        totalIncome: 540000,
        totalExpense: 450000,
        netSavings: 90000,
        growthRate: 12.5,
        expenseRatio: 83.3,
      },
    };
    setPerformanceData(mockData);
    setLoading(false);
  };

  if (!selectedAccount) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Select an account to view performance details
        </Typography>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card sx={{ p: 3 }}>
        <Typography variant="h6">Loading performance data...</Typography>
      </Card>
    );
  }

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6">{selectedAccount.AccountName}</Typography>
              <Chip
                label={selectedAccount.isActive ? 'Active' : 'Inactive'}
                size="small"
                color={selectedAccount.isActive ? 'success' : 'error'}
              />
            </Stack>
          }
          subheader={`Performance Overview - ${selectedAccount.AccountName}`}
        />
      </Card>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Total Income
            </Typography>
            <AnimatedCounter
              value={performanceData.trends.totalIncome}
              format="currency"
              variant="h6"
              color="success.main"
              duration={1500}
            />
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Total Expenses
            </Typography>
            <AnimatedCounter
              value={performanceData.trends.totalExpense}
              format="currency"
              variant="h6"
              color="error.main"
              duration={1500}
            />
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Net Savings
            </Typography>
            <AnimatedCounter
              value={performanceData.trends.netSavings}
              format="currency"
              variant="h6"
              color="info.main"
              duration={1500}
            />
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Growth Rate
            </Typography>
            <AnimatedCounter
              value={performanceData.trends.growthRate}
              format="decimal"
              suffix="%"
              variant="h6"
              color="success.main"
              duration={1500}
            />
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <AnimatedChart
            title="Monthly Performance"
            height={300}
            animationDuration={2500}
            chart={{
              labels: performanceData.monthlyData.map((item) => item.month),
              series: [
                {
                  name: 'Income',
                  type: 'column',
                  fill: 'solid',
                  color: '#00A76F',
                  data: performanceData.monthlyData.map((item) => item.income),
                },
                {
                  name: 'Expense',
                  type: 'column',
                  fill: 'solid',
                  color: '#FF4842',
                  data: performanceData.monthlyData.map((item) => item.expense),
                },
                {
                  name: 'Balance',
                  type: 'line',
                  color: '#00B8D9',
                  data: performanceData.monthlyData.map((item) => item.balance),
                },
              ],
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Performance Indicators
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Savings Rate</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {(
                      (performanceData.trends.netSavings / performanceData.trends.totalIncome) *
                      100
                    ).toFixed(1)}
                    %
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={
                    (performanceData.trends.netSavings / performanceData.trends.totalIncome) * 100
                  }
                  sx={{
                    mt: 0.5,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      backgroundColor: 'success.main',
                    },
                  }}
                />
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Account Utilization</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {((selectedAccount.CurrentAmount / selectedAccount.MaxAmount) * 100).toFixed(1)}
                    %
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={(selectedAccount.CurrentAmount / selectedAccount.MaxAmount) * 100}
                  sx={{
                    mt: 0.5,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      backgroundColor: 'info.main',
                    },
                  }}
                />
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Growth vs Start</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {(
                      ((selectedAccount.CurrentAmount - selectedAccount.StartAmount) /
                        selectedAccount.StartAmount) *
                      100
                    ).toFixed(1)}
                    %
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(
                    Math.abs(
                      ((selectedAccount.CurrentAmount - selectedAccount.StartAmount) /
                        selectedAccount.StartAmount) *
                        100
                    ),
                    100
                  )}
                  sx={{
                    mt: 0.5,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

AccountPerformanceChart.propTypes = {
  selectedAccount: PropTypes.object,
};
