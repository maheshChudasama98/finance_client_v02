import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useAmountVisibility } from 'src/hooks/use-amount-visibility';

import { formatToINR } from 'src/utils/format-number';

import {
  DashboardService,
  TopCategoriesService,
  TopSubCategoriesService,
} from 'src/Services/AnalystData.Services';

import Loader from 'src/components/Loaders/Loader';
import Chart, { useChart } from 'src/components/chart';
import { DateRangePicker } from 'src/components/inputs';

export default function EnhancedAnalytics() {
  const dispatch = useDispatch();
  const { isAmountVisible } = useAmountVisibility();

  const [selectYear, setSelectYear] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  // const [subCategoriesList, setSubCategoriesList] = useState([]);
  const [isDrilldown, setIsDrilldown] = useState(false);
  const [drillCategory, setDrillCategory] = useState(null);
  const [drillSubCategories, setDrillSubCategories] = useState([]);
  const [drillLoading, setDrillLoading] = useState(false);

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

  const incomeExpenseChartData = {
    labels: monthlyData?.map((item) => item.monthName),
    series: [
      {
        name: 'Income',
        type: 'area',
        fill: 'gradient',
        color: '#00A76F',
        data: monthlyData.map((item) => item?.totalIn || 0),
      },
      {
        name: 'Expense',
        type: 'area',
        fill: 'gradient',
        color: '#FF4842',
        data: monthlyData.map((item) => item?.totalOut || 0),
      },
    ],
  };

  const categoryDistributionData = {
    labels: categoriesList.slice(0, 8).map((item) => item?.CategoryName),
    series: [
      {
        name: 'Expense',
        type: 'pie',
        data: categoriesList.slice(0, 8).map((item) => item?.totalOut || 0),
      },
    ],
  };

  const categoryColors = categoriesList.slice(0, 8).map((item) => item?.Color || '#9e9e9e');
  const subCategoryColors = drillSubCategories.map(() => drillCategory?.Color || '#9e9e9e');

  const chartOptions = useChart({
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
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => formatToINR(value),
      },
    },
    legend: {
      position: 'bottom',
    },
  });

  // Investment vs Savings Chart
  const investmentSavingsData = {
    labels: monthlyData.map((item) => item?.monthName),
    series: [
      {
        name: 'Investment',
        type: 'column',
        fill: 'solid',
        color: '#00B8D9',
        data: monthlyData.map((item) => item?.totalInvestment || 0),
      },
      {
        name: 'Savings',
        type: 'column',
        fill: 'solid',
        color: '#00A76F',
        data: monthlyData.map((item) => (item?.totalIn || 0) - (item?.totalOut || 0)),
      },
    ],
  };

  const handleCategorySliceClick = (dataPointIndex) => {
    if (isDrilldown) return;
    const list = categoriesList.slice(0, 8);
    const clicked = list?.[dataPointIndex];
    if (!clicked) return;
    setDrillCategory(clicked);
    setIsDrilldown(true);
    setDrillLoading(true);
    dispatch(
      TopSubCategoriesService(
        {
          Duration: 'YEAR',
          SelectedDate: new Date(selectYear),
          CategoryId: clicked?.CategoryId,
        },
        (res) => {
          setDrillLoading(false);
          if (res?.status) {
            const data = res?.data?.list?.[0]?.topTenOut || [];
            setDrillSubCategories(data);
          } else {
            setDrillSubCategories([]);
          }
        }
      )
    );
  };

  const handleBackFromDrilldown = () => {
    setIsDrilldown(false);
    setDrillCategory(null);
    setDrillSubCategories([]);
    setDrillLoading(false);
  };

  useEffect(() => {
    dispatch(
      DashboardService({ SelectedYear: new Date(selectYear).getFullYear() }, (res) => {
        if (res.status) {
          const monthData = res?.data?.monthBase || [];
          setMonthlyData(monthData);
        }
      })
    );

    dispatch(
      TopCategoriesService({ Duration: 'YEAR', SelectedDate: new Date(selectYear) }, (res) => {
        if (res.status) {
          setCategoriesList(res?.data?.list?.[0]?.topTenOut || []);
        }
      })
    );

    // dispatch(
    //   TopSubCategoriesService({ Duration: 'YEAR', SelectedDate: new Date(selectYear) }, (res) => {
    //     if (res.status) {
    //       setSubCategoriesList(res?.data?.list?.[0]?.topTenOut || []);
    //     }
    //   })
    // );
  }, [selectYear]);

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Enhanced Financial Analytics
          </Typography>
        }
        action={
          <DateRangePicker
            disableFuture
            label=""
            openTo="year"
            format="YYYY"
            views={['year']}
            value={selectYear}
            onChange={(event) => {
              setSelectYear(event);
            }}
          />
        }
      />

      <Grid container spacing={3} sx={{ my: 2, px: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 3, textAlign: 'center', border: 'solid 1px #EEE', borderRadius: 1 }}>
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

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 3, textAlign: 'center', border: 'solid 1px #EEE', borderRadius: 1 }}>
            <Typography variant="h4" color="error.main" gutterBottom>
              {formatToINR(summaryStats.totalExpense, isAmountVisible)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Expense
            </Typography>
            <Chip
              label={`${(
                (Number(summaryStats?.totalExpense || 0) / Number(summaryStats?.totalIncome || 0)) *
                100
              ).toFixed(1)}% of income`}
              color="error"
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 3, textAlign: 'center', border: 'solid 1px #EEE', borderRadius: 1 }}>
            <Typography variant="h4" color="warning.main" gutterBottom>
              {formatToINR(summaryStats.netSavings, isAmountVisible)}
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
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 3, textAlign: 'center', border: 'solid 1px #EEE', borderRadius: 1 }}>
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
                100
              )?.toFixed(0)}% of income`}
              color="info"
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ px: 2, mb: 2 }}>
        <Grid item xs={12} lg={8}>
          <Box sx={{ border: 'solid 1px #EEE', borderRadius: 1 }}>
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
                      categories: incomeExpenseChartData?.labels,
                    },
                  }}
                  width="100%"
                  height={350}
                />
              </Box>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Box sx={{ border: 'solid 1px #EEE', borderRadius: 1 }}>
            <Card>
              <CardHeader
                title={
                  isDrilldown
                    ? `Subcategories: ${drillCategory?.CategoryName || ''}`
                    : 'Category Distribution'
                }
                subheader={
                  isDrilldown ? 'Expense breakdown by subcategory' : 'Expense breakdown by category'
                }
                action={
                  isDrilldown ? (
                    <IconButton aria-label="back" onClick={handleBackFromDrilldown} size="small">
                      <ArrowBackIcon fontSize="small" />
                    </IconButton>
                  ) : null
                }
              />
              <Box
                sx={{
                  p: 3,
                  pb: 1,
                }}
              >
                {drillLoading ? (
                  <Box sx={{ display: 'flex', height: '365px' }}>
                    <Loader />
                  </Box>
                ) : (
                  <Chart
                    dir="ltr"
                    type="donut"
                    series={
                      isDrilldown
                        ? drillSubCategories.map((item) => item?.totalOut || 0)
                        : categoryDistributionData.series[0].data
                    }
                    options={{
                      ...pieChartOptions,
                      labels: isDrilldown
                        ? drillSubCategories.map((item) => item?.SubCategoryName)
                        : categoryDistributionData.labels,
                      colors: isDrilldown ? subCategoryColors : categoryColors,
                      legend: {
                        ...(pieChartOptions?.legend || {}),
                        position: 'bottom',
                        horizontalAlign: 'center',
                        fontSize: 12,
                        formatter: (seriesName, opts) => {
                          try {
                            const idx = opts?.seriesIndex ?? 0;
                            const seriesArr = opts?.w?.globals?.series || [];
                            const val = Number(seriesArr[idx] || 0);
                            const total = seriesArr.reduce((a, b) => a + Number(b || 0), 0) || 1;
                            const pct = ((val / total) * 100).toFixed(1);
                            return `${seriesName} (${pct}%)`;
                          } catch (e) {
                            return seriesName;
                          }
                        },
                        markers: { width: 8, height: 8, radius: 12 },
                        itemMargin: { horizontal: 8, vertical: 0 },
                      },
                      tooltip: {
                        enabled: true,
                        shared: false,
                        intersect: false,
                        followCursor: true,
                        custom: ({ series, seriesIndex, w }) => {
                          try {
                            const idx = typeof seriesIndex === 'number' ? seriesIndex : 0;
                            const val = Number(series?.[idx] || 0);
                            const total =
                              (series || []).reduce((a, b) => a + Number(b || 0), 0) || 1;
                            const pct = ((val / total) * 100).toFixed(1);
                            const label = w?.globals?.labels?.[idx] || '';
                            const color = (w?.config?.colors || [])[idx] || '#000';
                            return `
                              <div style="background:#fff; color:#000; padding:8px 10px; border:1px solid #e0e0e0; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                                <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                                  <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${color};"></span>
                                  <strong>${label}</strong>
                                </div>
                                <div style="display:flex; justify-content:space-between; gap:16px;">
                                  <span>${formatToINR(val, isAmountVisible)}</span>
                                  <span>${pct}%</span>
                                </div>
                              </div>`;
                          } catch (e) {
                            return '';
                          }
                        },
                      },
                      chart: {
                        ...(pieChartOptions?.chart || {}),
                        events: {
                          dataPointSelection: (event, chartContext, config) => {
                            handleCategorySliceClick(config?.dataPointIndex);
                          },
                        },
                      },
                    }}
                    width="100%"
                    height={400}
                  />
                )}
              </Box>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ border: 'solid 1px #EEE', borderRadius: 1 }}>
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
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}
