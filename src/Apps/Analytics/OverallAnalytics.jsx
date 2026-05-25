import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/system';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { useAmountVisibility } from 'src/hooks/use-amount-visibility';

import { formatToINR } from 'src/utils/format-number';

import { DashboardService } from 'src/Services/AnalystData.Services';

export default function OverallAnalytics() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { isAmountVisible } = useAmountVisibility();

  const [monthlyData, setMonthlyData] = useState([]);

  const summaryStats = {
    totalIncome: monthlyData?.reduce((sum, item) => sum + (Number(item?.totalIn) || 0), 0),
    totalExpense: monthlyData?.reduce((sum, item) => sum + (Number(item?.totalOut) || 0), 0),
    totalInvestment: monthlyData?.reduce(
      (sum, item) => sum + (Number(item?.totalInvestment) || 0),
      0
    ),
    totalCredit: monthlyData?.reduce((sum, item) => sum + (Number(item?.totalCredit) || 0), 0),
    totalDebit: monthlyData?.reduce((sum, item) => sum + (Number(item?.totalDebit) || 0), 0),
    netSavings: monthlyData?.reduce(
      (sum, item) => sum + (Number(item?.totalIn) || 0) - (Number(item?.totalOut) || 0),
      0
    ),
    savingsRate:
      monthlyData.reduce((sum, item) => sum + (Number(item.totalIn) || 0), 0) > 0
        ? (monthlyData.reduce(
            (sum, item) => sum + (Number(item.totalIn) || 0) - (Number(item.totalOut) || 0),
            0
          ) /
            monthlyData.reduce((sum, item) => sum + (Number(item.totalIn) || 0), 0)) *
          100
        : 0,
  };

  // Fetch dashboard, categories, subcategories
  useEffect(() => {
    dispatch(
      DashboardService({ SelectedYear: new Date().getFullYear() }, (res) => {
        if (res.status) {
          const monthData = res?.data?.monthBase || [];
          setMonthlyData(monthData);
        }
      })
    );
  }, []);

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Overall Financial Analytics
          </Typography>
        }
      />

      <Grid container spacing={3} sx={{ my: 2, px: 2 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              border: `solid 1px ${theme.palette.border?.success}`,
              background: `${theme.palette.gradients?.success}`,
              borderRadius: 1,
            }}
          >
            <Typography variant="h4" color="success.main" gutterBottom>
              {formatToINR(summaryStats.totalIncome, isAmountVisible)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Income
            </Typography>
            <Chip
              label={`${summaryStats.savingsRate.toFixed(1)}% savings rate`}
              color="success"
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 1,
              border: `solid 1px ${theme.palette.border?.error}`,
              background: `${theme.palette.gradients?.error}`,
            }}
          >
            <Typography variant="h4" color="error.main" gutterBottom>
              {formatToINR(summaryStats.totalExpense, isAmountVisible)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Expense
            </Typography>
            <Chip
              label={`${(
                (Number(summaryStats?.totalExpense || 0) / Number(summaryStats?.totalIncome || 0)) *
                  100 || 0
              ).toFixed(1)}% of income`}
              color="error"
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 1,
              border: `solid 1px ${theme.palette.border?.warning}`,
              background: `${theme.palette.gradients?.warning}`,
            }}
          >
            <Typography variant="h4" color="warning.main" gutterBottom>
              {formatToINR(summaryStats.netSavings, isAmountVisible)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Net Savings
            </Typography>
            <Chip
              label={summaryStats.netSavings >= 0 ? 'Positive' : ' Negative'}
              color="warning"
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 1,
              border: `solid 1px ${theme.palette.border?.info}`,
              background: `${theme.palette.gradients?.info}`,
            }}
          >
            <Typography variant="h4" color="info.main" gutterBottom>
              {formatToINR(summaryStats.totalInvestment, isAmountVisible)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Investment
            </Typography>
            <Chip
              label={`${(
                (Number(summaryStats?.totalInvestment || 0) /
                  Number(summaryStats?.totalIncome || 0)) *
                  100 || 0
              )?.toFixed(0)}% of income`}
              color="info"
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}
