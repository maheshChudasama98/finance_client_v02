import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { formatToINR } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

export default function DetailedAnalytics({
  monthlyData = [],
  categoriesData = [],
  subCategoriesData = [],
  accountsData = [],
  labelsData = [],
  selectedYear,
  onYearChange,
}) {
  const [chartType, setChartType] = useState('area');
  const [timeRange, setTimeRange] = useState('year');

  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const handleTimeRangeChange = (event, newRange) => {
    if (newRange !== null) {
      setTimeRange(newRange);
    }
  };

  // Income vs Expense Trend Chart
  const incomeExpenseChartData = {
    labels: monthlyData.map((item) => item.monthName),
    series: [
      {
        name: 'Income',
        type: chartType,
        fill: chartType === 'area' ? 'gradient' : 'solid',
        color: '#00A76F',
        data: monthlyData.map((item) => item.totalIn || 0),
      },
      {
        name: 'Expense',
        type: chartType,
        fill: chartType === 'area' ? 'gradient' : 'solid',
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

  const chartOptions = useChart({
    colors: ['#00A76F', '#FF4842', '#00B8D9', '#FFC107'],
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
    colors: [
      '#00A76F',
      '#FF4842',
      '#00B8D9',
      '#FFC107',
      '#7A0C2E',
      '#2065D1',
      '#F5A623',
      '#8E24AA',
    ],
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
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

  return (
    <Box sx={{ p: 2 }}>
      {/* Header Controls */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h5">Detailed Financial Analytics</Typography>
              <Chip label={`${selectedYear}`} color="primary" variant="outlined" />
            </Stack>
          }
          action={
            <Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center">
              <ToggleButtonGroup
                value={chartType}
                exclusive
                onChange={handleChartTypeChange}
                size="small"
              >
                <ToggleButton value="area">Area</ToggleButton>
                <ToggleButton value="line">Line</ToggleButton>
                <ToggleButton value="bar">Bar</ToggleButton>
              </ToggleButtonGroup>

              <ToggleButtonGroup
                value={timeRange}
                exclusive
                onChange={handleTimeRangeChange}
                size="small"
              >
                <ToggleButton value="month">Month</ToggleButton>
                <ToggleButton value="quarter">Quarter</ToggleButton>
                <ToggleButton value="year">Year</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          }
        />
      </Card>

      {/* Main Charts Grid */}
      <Grid container spacing={3}>
        {/* Income vs Expense Trend */}
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

        {/* Category Distribution */}
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

        {/* Account Balance Trend */}
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

        {/* Investment vs Savings */}
        <Grid item xs={12} lg={6}>
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

        {/* Sub-Category Analysis */}
        <Grid item xs={12}>
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
      </Grid>

      {/* Summary Statistics */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Financial Summary" />
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="success.main" gutterBottom>
                      {formatToINR(monthlyData.reduce((sum, item) => sum + (item.totalIn || 0), 0))}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Income
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="error.main" gutterBottom>
                      {formatToINR(
                        monthlyData.reduce((sum, item) => sum + (item.totalOut || 0), 0)
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Expense
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="info.main" gutterBottom>
                      {formatToINR(
                        monthlyData.reduce((sum, item) => sum + (item.totalInvestment || 0), 0)
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Investment
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="warning.main" gutterBottom>
                      {formatToINR(
                        monthlyData.reduce(
                          (sum, item) => sum + (item.totalIn || 0) - (item.totalOut || 0),
                          0
                        )
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Net Savings
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

DetailedAnalytics.propTypes = {
  monthlyData: PropTypes.array,
  categoriesData: PropTypes.array,
  subCategoriesData: PropTypes.array,
  accountsData: PropTypes.array,
  labelsData: PropTypes.array,
  selectedYear: PropTypes.number,
  onYearChange: PropTypes.func,
};
