import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import ToggleButton from '@mui/material/ToggleButton';
import TableContainer from '@mui/material/TableContainer';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { formatToINR } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

export default function EnhancedAnalytics({
  monthlyData = [],
  categoriesData = [],
  subCategoriesData = [],
  accountsData = [],
  labelsData = [],
  selectedYear,
  onYearChange,
}) {
  const [selectedView, setSelectedView] = useState('overview');

  // const handleChartTypeChange = (event, newType) => {
  //   if (newType !== null) {
  //     setChartType(newType);
  //   }
  // };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setSelectedView(newView);
    }
  };

  // Calculate summary statistics
  const summaryStats = {
    totalIncome: monthlyData.reduce((sum, item) => sum + (Number(item.totalIn) || 0), 0),
    totalExpense: monthlyData.reduce((sum, item) => sum + (Number(item.totalOut) || 0), 0),
    totalInvestment: monthlyData.reduce(
      (sum, item) => sum + (Number(item.totalInvestment) || 0),
      0
    ),
    totalCredit: monthlyData.reduce((sum, item) => sum + (Number(item.totalCredit) || 0), 0),
    totalDebit: monthlyData.reduce((sum, item) => sum + (Number(item.totalDebit) || 0), 0),
    netSavings: monthlyData.reduce(
      (sum, item) => sum + (Number(item.totalIn) || 0) - (Number(item.totalOut) || 0),
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

  // Income vs Expense Trend Chart
  const incomeExpenseChartData = {
    labels: monthlyData.map((item) => item.monthName),
    series: [
      {
        name: 'Income',
        type: 'area',
        fill: 'gradient',
        color: '#00A76F',
        data: monthlyData.map((item) => item.totalIn || 0),
      },
      {
        name: 'Expense',
        type: 'area',
        fill: 'gradient',
        color: '#FF4842',
        data: monthlyData.map((item) => item.totalOut || 0),
      },
    ],
  };

  // Category Distribution Pie Chart
  const categoryDistributionData = {
    labels: categoriesData.slice(0, 8).map((item) => item.CategoryName),
    series: [
      {
        name: 'Expense',
        type: 'pie',
        data: categoriesData.slice(0, 8).map((item) => item.totalOut || 0),
      },
    ],
  };

  // Sub-Category Bar Chart
  const subCategoryBarData = {
    labels: subCategoriesData.slice(0, 10).map((item) => item.SubCategoryName),
    series: [
      {
        name: 'Expense',
        type: 'bar',
        fill: 'solid',
        color: '#00B8D9',
        data: subCategoriesData.slice(0, 10).map((item) => item.totalOut || 0),
      },
    ],
  };

  // Account Balance Trend
  const accountBalanceData = {
    labels: monthlyData.map((item) => item.monthName),
    series: [
      {
        name: 'Account Balance',
        type: 'line',
        fill: 'gradient',
        color: '#00A76F',
        data: monthlyData.map((item, index) => {
          let balance = 0;
          for (let i = 0; i <= index; i += 1) {
            balance += (monthlyData[i].totalIn || 0) - (monthlyData[i].totalOut || 0);
          }
          return balance;
        }),
      },
    ],
  };

  // Investment vs Savings Chart
  const investmentSavingsData = {
    labels: monthlyData.map((item) => item.monthName),
    series: [
      {
        name: 'Investment',
        type: 'column',
        fill: 'solid',
        color: '#00B8D9',
        data: monthlyData.map((item) => item.totalInvestment || 0),
      },
      {
        name: 'Savings',
        type: 'column',
        fill: 'solid',
        color: '#00A76F',
        data: monthlyData.map((item) => (item.totalIn || 0) - (item.totalOut || 0)),
      },
    ],
  };

  // Monthly Growth Rate Chart
  const growthRateData = {
    labels: monthlyData.map((item) => item.monthName),
    series: [
      {
        name: 'Growth Rate (%)',
        type: 'line',
        fill: 'gradient',
        color: '#FFC107',
        data: monthlyData.map((item, index) => {
          if (index === 0) return 0;
          const prevIncome = monthlyData[index - 1].totalIn || 0;
          const currentIncome = item.totalIn || 0;
          return prevIncome > 0 ? ((currentIncome - prevIncome) / prevIncome) * 100 : 0;
        }),
      },
    ],
  };

  const chartOptions = useChart({
    // colors: ['#00A76F', '#FF4842', '#00B8D9', '#FFC107'],
    plotOptions: {
      bar: {
        columnWidth: '16%',
      },
      pie: {
        donut: {
          size: '60%',
        },
      },
    },
    fill: {
      type: ['gradient', 'gradient', 'solid', 'solid'],
    },
    stroke: {
      width: [2, 2, 0, 0],
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return formatToINR(value);
          }
          return value;
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
  });

  const pieChartOptions = useChart({
    // colors: ['#00A76F', '#FF4842', '#00B8D9', '#FFC107', '#7A0C2E', '#2065D1', '#F5A623', '#8E24AA',],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => formatToINR(value),
      },
    },
    legend: {
      position: 'bottom',
    },
  });

  const barChartOptions = useChart({
    colors: ['#00B8D9'],
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 4,
      },
    },
    tooltip: {
      y: {
        formatter: (value) => formatToINR(value),
      },
    },
    xaxis: {
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px',
        },
      },
    },
  });

  const lineChartOptions = useChart({
    colors: ['#FFC107'],
    stroke: {
      width: 2,
    },
    tooltip: {
      y: {
        formatter: (value) => `${value.toFixed(2)}%`,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value.toFixed(1)}%`,
      },
    },
  });

  // Helper function to get savings rate message
  const getSavingsRateMessage = (rate) => {
    if (rate >= 20) return 'Excellent savings rate!';
    if (rate >= 10) return 'Good savings rate, consider increasing.';
    return 'Low savings rate, focus on reducing expenses.';
  };

  // Helper function to get investment rate message
  const getInvestmentRateMessage = (rate) => {
    if (rate >= 15) return 'Great investment allocation!';
    return 'Consider increasing investment allocation for better returns.';
  };

  // Helper function to get expense ratio message
  const getExpenseRatioMessage = (ratio) => {
    if (ratio <= 70) return 'Good expense management!';
    return 'High expense ratio, review spending patterns.';
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header Controls */}

      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h5">Enhanced Financial Analytics</Typography>
          </Stack>
        }
        action={
          <Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center">
            <ToggleButtonGroup
              value={selectedView}
              exclusive
              onChange={handleViewChange}
              size="small"
            >
              <ToggleButton value="overview">Overview</ToggleButton>
              <ToggleButton value="trends">Trends</ToggleButton>
              <ToggleButton value="breakdown">Breakdown</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        }
      />

      {/* Summary Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" gutterBottom>
                {console.log(summaryStats, 'summaryStats summaryStats')}
                {formatToINR(summaryStats.totalIncome)}
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
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" color="error.main" gutterBottom>
                {formatToINR(summaryStats.totalExpense)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Expense
              </Typography>
              <Chip
                label={`${((summaryStats.totalExpense / summaryStats.totalIncome) * 100).toFixed(
                  1
                )}% of income`}
                color="error"
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" gutterBottom>
                {formatToINR(summaryStats.netSavings)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Net Savings
              </Typography>
              <Chip
                label={summaryStats.netSavings >= 0 ? 'Positive' : 'Negative'}
                color={summaryStats.netSavings >= 0 ? 'success' : 'error'}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" gutterBottom>
                {formatToINR(summaryStats.totalInvestment)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Investment
              </Typography>
              <Chip
                label={`${((summaryStats.totalInvestment / summaryStats.totalIncome) * 100).toFixed(
                  1
                )}% of income`}
                color="info"
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Charts based on selected view */}
      {selectedView === 'overview' && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardHeader
                title="Income vs Expense Trend"
                subheader="Monthly comparison of income and expenses"
              />
              <Box sx={{ p: 3, pb: 1 }}>
                <Chart
                  dir="ltr"
                  type="line"
                  series={incomeExpenseChartData.series}
                  options={{
                    ...chartOptions,
                    xaxis: {
                      categories: incomeExpenseChartData.labels,
                    },
                  }}
                  width="100%"
                  height={350}
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card>
              <CardHeader title="Category Distribution" subheader="Expense breakdown by category" />
              <Box sx={{ p: 3, pb: 1 }}>
                <Chart
                  dir="ltr"
                  type="donut"
                  series={categoryDistributionData.series[0].data}
                  options={{
                    ...pieChartOptions,
                    labels: categoryDistributionData.labels,
                  }}
                  width="100%"
                  height={400}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedView === 'trends' && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Card>
              <CardHeader title="Account Balance Trend" subheader="Cumulative balance over time" />
              <Box sx={{ p: 3, pb: 1 }}>
                <Chart
                  dir="ltr"
                  type="area"
                  series={accountBalanceData.series}
                  options={{
                    ...chartOptions,
                    xaxis: {
                      categories: accountBalanceData.labels,
                    },
                  }}
                  width="100%"
                  height={300}
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card>
              <CardHeader
                title="Monthly Growth Rate"
                subheader="Income growth rate month over month"
              />
              <Box sx={{ p: 3, pb: 1 }}>
                <Chart
                  dir="ltr"
                  type="line"
                  series={growthRateData.series}
                  options={{
                    ...lineChartOptions,
                    xaxis: {
                      categories: growthRateData.labels,
                    },
                  }}
                  width="100%"
                  height={300}
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Investment vs Savings"
                subheader="Monthly investment and savings comparison"
              />
              <Box sx={{ p: 3, pb: 1 }}>
                <Chart
                  dir="ltr"
                  type="bar"
                  series={investmentSavingsData.series}
                  options={{
                    ...chartOptions,
                    xaxis: {
                      categories: investmentSavingsData.labels,
                    },
                  }}
                  width="100%"
                  height={300}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedView === 'breakdown' && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardHeader
                title="Top Sub-Categories by Expense"
                subheader="Detailed breakdown of expenses by sub-categories"
              />
              <Box sx={{ p: 3, pb: 1 }}>
                <Chart
                  dir="ltr"
                  type="bar"
                  series={subCategoryBarData.series}
                  options={{
                    ...barChartOptions,
                    xaxis: {
                      categories: subCategoryBarData.labels,
                    },
                  }}
                  width="100%"
                  height={400}
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card>
              <CardHeader title="Monthly Breakdown" />
              <Box sx={{ p: 2 }}>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell align="right">Income</TableCell>
                        <TableCell align="right">Expense</TableCell>
                        <TableCell align="right">Savings</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {monthlyData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.monthName}</TableCell>
                          <TableCell align="right">{formatToINR(item.totalIn || 0)}</TableCell>
                          <TableCell align="right">{formatToINR(item.totalOut || 0)}</TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              color={
                                (item.totalIn || 0) - (item.totalOut || 0) >= 0
                                  ? 'success.main'
                                  : 'error.main'
                              }
                            >
                              {formatToINR((item.totalIn || 0) - (item.totalOut || 0))}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Financial Insights */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Financial Insights & Recommendations" />
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Key Insights
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Savings Rate: {summaryStats.savingsRate.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2">
                        {getSavingsRateMessage(summaryStats.savingsRate)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Investment Rate:{' '}
                        {((summaryStats.totalInvestment / summaryStats.totalIncome) * 100).toFixed(
                          1
                        )}
                        %
                      </Typography>
                      <Typography variant="body2">
                        {getInvestmentRateMessage(
                          (summaryStats.totalInvestment / summaryStats.totalIncome) * 100
                        )}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Expense Ratio:{' '}
                        {((summaryStats.totalExpense / summaryStats.totalIncome) * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2">
                        {getExpenseRatioMessage(
                          (summaryStats.totalExpense / summaryStats.totalIncome) * 100
                        )}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Recommendations
                  </Typography>
                  <Stack spacing={2}>
                    {summaryStats.savingsRate < 20 && (
                      <Box>
                        <Typography variant="body2" color="warning.main" fontWeight="bold">
                          💡 Increase Savings
                        </Typography>
                        <Typography variant="body2">
                          Aim for at least 20% savings rate by reducing non-essential expenses.
                        </Typography>
                      </Box>
                    )}
                    {(summaryStats.totalInvestment / summaryStats.totalIncome) * 100 < 15 && (
                      <Box>
                        <Typography variant="body2" color="info.main" fontWeight="bold">
                          💡 Boost Investments
                        </Typography>
                        <Typography variant="body2">
                          Consider allocating 15-20% of income to investments for long-term growth.
                        </Typography>
                      </Box>
                    )}
                    {summaryStats.netSavings < 0 && (
                      <Box>
                        <Typography variant="body2" color="error.main" fontWeight="bold">
                          ⚠️ Negative Savings
                        </Typography>
                        <Typography variant="body2">
                          Immediate action needed: reduce expenses or increase income to achieve
                          positive savings.
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

EnhancedAnalytics.propTypes = {
  monthlyData: PropTypes.array,
  categoriesData: PropTypes.array,
  subCategoriesData: PropTypes.array,
  accountsData: PropTypes.array,
  labelsData: PropTypes.array,
  selectedYear: PropTypes.number,
  onYearChange: PropTypes.func,
};
