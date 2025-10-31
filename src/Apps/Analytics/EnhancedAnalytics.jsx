import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/system';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useAmountVisibility } from 'src/hooks/use-amount-visibility';

import { formatToINR } from 'src/utils/format-number';

import {
  DashboardService,
  SavingFollService,
  BalanceFollService,
  TopCategoriesService,
  TopSubCategoriesService,
} from 'src/Services/AnalystData.Services';

import Loader from 'src/components/Loaders/Loader';
import Chart, { useChart } from 'src/components/chart';
import { DateRangePicker } from 'src/components/inputs';
import { AnimatedChart } from 'src/components/Animated';
import { CustomButtonGroup } from 'src/components/CustomComponents';

import LoadingSkeleton from '../Dashboard/LoadingSkeleton';

export default function EnhancedAnalytics() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { isAmountVisible } = useAmountVisibility();

  const [selectYear, setSelectYear] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [subCategoriesList, setSubCategoriesList] = useState([]);
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

  //

  const chartOptionsMain = useChart({
    stroke: {
      width: [2, 2, 2, 2],
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return formatToINR(value || 0, isAmountVisible);
          }
          return value;
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        formatter: (val) => {
          const sign = val < 0 ? '-' : '';
          const absVal = Math.abs(val);

          if (absVal >= 10000000) {
            return `${sign}${(absVal / 10000000).toFixed(1).replace(/\.0$/, '')}Cr`;
          }
          if (absVal >= 100000) {
            return `${sign}${(absVal / 100000).toFixed(1).replace(/\.0$/, '')}L`;
          }
          if (absVal >= 1000) {
            return `${sign}${(absVal / 1000).toFixed(1).replace(/\.0$/, '')}k`;
          }
          return `${sign}${absVal}`;
        },
      },
    },
    xaxis: {
      labels: {},
      axisBorder: {
        show: true,
        color: theme.palette.border.strong,
        height: 1,
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: theme.palette.border.strong,
        height: 6,
        offsetX: 0,
        offsetY: 0,
      },
    },
  });

  const chartOptions = useChart({
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

    xaxis: {
      labels: {
        show: true,
        formatter: (val) => {
          const sign = val < 0 ? '-' : '';
          const absVal = Math.abs(val);

          if (absVal >= 10000000) {
            return `${sign}${(absVal / 10000000).toFixed(1).replace(/\.0$/, '')}Cr`;
          }
          if (absVal >= 100000) {
            return `${sign}${(absVal / 100000).toFixed(1).replace(/\.0$/, '')}L`;
          }
          if (absVal >= 1000) {
            return `${sign}${(absVal / 1000).toFixed(1).replace(/\.0$/, '')}k`;
          }
          return `${sign}${absVal}`;
        },
      },
      axisBorder: {
        show: true,
        color: theme.palette.border.strong,
        height: 1,
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: theme.palette.border.strong,
        height: 6,
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: {
      labels: {},
    },
  });

  const chartOptionsGrowth = useChart({
    stroke: {
      width: 1.5,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return `${value} %`;
          }
          return value;
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        formatter: (val) => {
          const absVal = Math.abs(val);
          return `${absVal}%`;
        },
      },
    },
    xaxis: {
      labels: {},
      axisBorder: {
        show: true,
        color: theme.palette.border.strong,
        height: 1,
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: theme.palette.border.strong,
        height: 6,
        offsetX: 0,
        offsetY: 0,
      },
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
        color: theme.palette.info.main,
        data: monthlyData.map((item) => item?.totalInvestment || 0),
      },
      {
        name: 'Savings',
        type: 'column',
        fill: 'solid',
        color: theme.palette.warning.main,
        data: monthlyData.map((item) => (item?.totalIn || 0) - (item?.totalOut || 0)),
      },
    ],
  };

  // Top Categories (Out) - Bar
  const topCategoriesBarData = {
    labels: categoriesList.slice(0, 10).map((item) => item?.CategoryName),
    series: [
      {
        name: 'Expense',
        data: categoriesList.slice(0, 10).map((item) => item?.totalOut || 0),
      },
    ],
  };

  // Top Sub Categories (Out) - Bar
  const topSubCategoriesBarData = {
    labels: subCategoriesList.slice(0, 10).map((item) => item?.SubCategoryName),
    series: [
      {
        name: 'Expense',
        data: subCategoriesList.slice(0, 10).map((item) => item?.totalOut || 0),
      },
    ],
  };

  // Growth rate MoM (Income and Expense)
  const growthLabels = (monthlyData || []).map((m) => m?.monthName);

  let baseline = null;
  const growthDataSet = {
    income: monthlyData?.map((item) => {
      const currentIncome = item?.totalIn || 0;

      if (currentIncome <= 0) {
        return 0;
      }

      if (baseline === null) {
        baseline = currentIncome;
        return 100;
      }

      return ((currentIncome / baseline) * 100).toFixed(2);
    }),
    expenses: monthlyData.map((item) => {
      const currentIncome = item?.totalOut || 0;

      if (currentIncome <= 0) {
        return 0;
      }

      if (baseline === null) {
        baseline = currentIncome;
        return 100;
      }

      return ((currentIncome / baseline) * 100).toFixed(2);
    }),
    investment: monthlyData.map((item) => {
      const currentIncome = item?.totalInvestment || 0;

      if (currentIncome <= 0) {
        return 0;
      }

      if (baseline === null) {
        baseline = currentIncome;
        return 100;
      }

      return ((currentIncome / baseline) * 100).toFixed(2);
    }),
  };

  const investmentOverviewData = {
    labels: monthlyData.map((m) => m?.monthName),
    series: [
      {
        name: 'Investment',
        data: monthlyData.map((m) => Number(m?.totalInvestment || 0)),
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

  // Fetch dashboard, categories, subcategories
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

    dispatch(
      TopSubCategoriesService({ Duration: 'YEAR', SelectedDate: new Date(selectYear) }, (res) => {
        if (res.status) {
          setSubCategoriesList(res?.data?.list?.[0]?.topTenOut || []);
        }
      })
    );
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

      <Grid container spacing={3} sx={{ px: 2, mb: 2 }}>
        <Grid item xs={12} lg={8}>
          <AnimatedChart
            title="Income vs Expense Trend"
            subheader="Monthly comparison of income and expenses"
            height={350}
            chart={{
              labels: incomeExpenseChartData?.labels,
              series: [
                {
                  name: 'Income',
                  type: 'area',
                  fill: 'gradient',
                  color: theme.palette.success.main,
                  data: incomeExpenseChartData.series[0]?.data,
                },
                {
                  name: 'Expense',
                  type: 'area',
                  fill: 'gradient',
                  color: theme.palette.error.main,
                  data: incomeExpenseChartData.series[1]?.data,
                },
              ],
              options: {
                ...chartOptionsMain,
                fill: {
                  type: ['gradient', 'gradient'],
                },
              },
            }}
          />
        </Grid>

        <Grid item xs={12} lg={4}>
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
                      border: `node`,
                      fontSize: 12,
                      labels: {
                        colors: theme.palette.text?.secondary,
                        useSeriesColors: false,
                      },
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
                          const total = (series || []).reduce((a, b) => a + Number(b || 0), 0) || 1;
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
                    stroke: {
                      show: true,
                      width: 2,
                      colors: [theme.palette.background?.paper], // border color
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
                  height={345}
                />
              )}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <AnimatedChart
            title="Investment vs Savings"
            subheader="Monthly investment and savings comparison"
            height={350}
            chart={{
              labels: investmentSavingsData.labels,
              series: investmentSavingsData.series,
              options: {
                ...chartOptionsMain,
                fill: {
                  type: ['solid', 'solid'],
                },
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <CashFlowComponent dispatch={dispatch} theme={theme} isAmountVisible={isAmountVisible} />
        </Grid>
        <Grid item xs={12}>
          <SavingFlowComponent
            dispatch={dispatch}
            theme={theme}
            isAmountVisible={isAmountVisible}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ px: 2, mb: 2 }}>
        <Grid item xs={12} lg={6}>
          <AnimatedChart
            title="Top Categories (Out)"
            subheader="Highest spending categories"
            height={350}
            chart={{
              labels: topCategoriesBarData?.labels,
              series: [
                {
                  type: 'bar',
                  fill: 'solid',
                  color: theme.palette.warning.main,
                  data: topCategoriesBarData?.series[0]?.data,
                },
              ],
              options: {
                ...chartOptions,
                plotOptions: {
                  bar: { ...chartOptions.plotOptions?.bar, horizontal: true },
                },
                fill: {
                  type: 'solid',
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <AnimatedChart
            title="Top Sub Categories (Out)"
            subheader="Highest spending subcategories"
            height={350}
            chart={{
              labels: topSubCategoriesBarData?.labels,
              series: [
                {
                  name: 'Income',
                  type: 'bar',
                  fill: 'solid',
                  color: theme.palette.info.main,
                  data: topSubCategoriesBarData?.series[0]?.data,
                },
              ],
              options: {
                ...chartOptions,
                plotOptions: {
                  bar: { ...chartOptions.plotOptions?.bar, horizontal: true },
                },
                fill: {
                  type: 'solid',
                },
              },
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ px: 2, mb: 2 }}>
        <Grid item xs={12} lg={6}>
          <AnimatedChart
            title="Monthly Growth Rate"
            subheader="Growth rate month over month"
            height={300}
            chart={{
              labels: growthLabels,
              series: [
                {
                  name: 'Income %',
                  type: 'area',
                  color: theme.palette.success.main,
                  data: growthDataSet?.income,
                },
                {
                  name: 'Expense %',
                  type: 'area',
                  color: theme.palette.error.main,
                  data: growthDataSet?.expenses,
                },
                {
                  name: 'Investment %',
                  type: 'area',
                  color: theme.palette.info.main,
                  data: growthDataSet?.investment,
                },
              ],
              options: {
                ...chartOptionsGrowth,
                fill: {
                  type: ['gradient', 'gradient', 'gradient'],
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <AnimatedChart
            title="Investment Overview (Year)"
            subheader="Monthly investments"
            height={300}
            chart={{
              labels: investmentOverviewData?.labels,
              series: [
                {
                  name: 'Income',
                  type: 'bar',
                  fill: 'solid',
                  color: theme.palette.info.main,
                  data: investmentOverviewData?.series[0]?.data,
                },
              ],
              options: {
                ...chartOptionsMain,
              },
            }}
          />
        </Grid>
      </Grid>
    </Card>
  );
}

const CashFlowComponent = ({ dispatch, theme, isAmountVisible }) => {
  const DefaultDuration = localStorage.getItem('DefaultDuration');
  const [cashFlowDurationLoader, setCashFlowDurationLoader] = useState(true);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [cashFlowDuration, setCashFlowDuration] = useState(DefaultDuration || 'Six_Month');

  useEffect(() => {
    setCashFlowDurationLoader(true);
    dispatch(
      BalanceFollService({ Duration: cashFlowDuration }, (res) => {
        setCashFlowDurationLoader(false);
        if (res.status) {
          setCashFlowData(res?.data);
        }
      })
    );
  }, [cashFlowDuration]);

  const chartOptionsMain = useChart({
    stroke: {
      width: [2, 2, 2, 2],
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return formatToINR(value || 0, isAmountVisible);
          }
          return value;
        },
      },
    },

    yaxis: {
      labels: {
        show: true,
        formatter: (val) => {
          const sign = val < 0 ? '-' : '';
          const absVal = Math.abs(val);

          if (absVal >= 10000000) {
            return `${sign}${(absVal / 10000000).toFixed(1).replace(/\.0$/, '')}Cr`;
          }
          if (absVal >= 100000) {
            return `${sign}${(absVal / 100000).toFixed(1).replace(/\.0$/, '')}L`;
          }
          if (absVal >= 1000) {
            return `${sign}${(absVal / 1000).toFixed(1).replace(/\.0$/, '')}k`;
          }
          return `${sign}${absVal}`;
        },
      },
    },
    xaxis: {
      labels: {},
      axisBorder: {
        show: true,
        color: theme?.palette?.border?.strong,
        height: 1,
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: theme?.palette?.border?.strong,
        height: 6,
        offsetX: 0,
        offsetY: 0,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        if (opts.dataPointIndex === Number((cashFlowData?.length || 0) - 1) || null) {
          // return val?.toLocaleString('en-IN');
          return formatToINR(val, isAmountVisible);
        }
        return '';
      },
      style: {
        colors: ['#ffffff'],
        fontSize: '12px',
        fontWeight: 'bold',
      },
      background: {
        enabled: true,
        foreColor: '#00A76F',
        borderRadius: 4,
        padding: 6,
      },
      offsetY: -10,
      offsetX: -10,
    },
  });

  if (cashFlowDurationLoader) {
    return <LoadingSkeleton type="chart" loading={cashFlowDurationLoader} height={300} />;
  }

  return (
    <AnimatedChart
      title="Cash Flow Trend"
      subheader="Based on selected duration"
      action={
        <CustomButtonGroup
          defaultValue={cashFlowDuration}
          onSelect={(value) => {
            setCashFlowDuration(value);
          }}
        />
      }
      height={300}
      chart={{
        labels: cashFlowData?.length > 0 ? cashFlowData?.map((item, key) => item?.Date) : [],
        series: [
          {
            name: 'Cash Flow',
            type: 'area',
            color: theme.palette.success.main,
            data:
              cashFlowData?.length > 0 ? cashFlowData?.map((item, key) => item?.Count || 0) : [],
          },
        ],
        options: {
          ...chartOptionsMain,
          chart: {
            type: 'area',
            zoom: {
              enabled: true,
              type: 'x',
              autoScaleYaxis: true,
            },
            toolbar: {
              show: true,
              tools: {
                download: false,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true,
              },
            },
          },

          fill: {
            type: ['gradient'],
          },
        },
      }}
    />
  );
};

const SavingFlowComponent = ({ dispatch, theme, isAmountVisible }) => {
  const DefaultDuration = localStorage.getItem('DefaultDuration');
  const [cashFlowDurationLoader, setCashFlowDurationLoader] = useState(true);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [cashFlowDuration, setCashFlowDuration] = useState(DefaultDuration || 'Six_Month');

  useEffect(() => {
    setCashFlowDurationLoader(true);
    dispatch(
      SavingFollService({ Duration: cashFlowDuration }, (res) => {
        setCashFlowDurationLoader(false);
        if (res.status) {
          setCashFlowData(res?.data);
        }
      })
    );
  }, [cashFlowDuration]);

  const chartOptionsMain = useChart({
    stroke: {
      width: [2, 2, 2, 2],
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return formatToINR(value || 0, isAmountVisible);
          }
          return value;
        },
      },
    },

    yaxis: {
      labels: {
        show: true,
        formatter: (val) => {
          const sign = val < 0 ? '-' : '';
          const absVal = Math.abs(val);

          if (absVal >= 10000000) {
            return `${sign}${(absVal / 10000000).toFixed(1).replace(/\.0$/, '')}Cr`;
          }
          if (absVal >= 100000) {
            return `${sign}${(absVal / 100000).toFixed(1).replace(/\.0$/, '')}L`;
          }
          if (absVal >= 1000) {
            return `${sign}${(absVal / 1000).toFixed(1).replace(/\.0$/, '')}k`;
          }
          return `${sign}${absVal}`;
        },
      },
    },
    xaxis: {
      labels: {},
      axisBorder: {
        show: true,
        color: theme?.palette?.border?.strong,
        height: 1,
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: theme?.palette?.border?.strong,
        height: 6,
        offsetX: 0,
        offsetY: 0,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        if (opts.dataPointIndex === Number((cashFlowData?.length || 0) - 1) || null) {
          // return val?.toLocaleString('en-IN');
          return formatToINR(val, isAmountVisible);
        }
        return '';
      },
      style: {
        colors: ['#ffffff'],
        fontSize: '12px',
        fontWeight: 'bold',
      },
      background: {
        enabled: true,
        foreColor: '#00A76F',
        borderRadius: 4,
        padding: 6,
      },
      offsetY: -10,
      offsetX: -10,
    },
  });

  if (cashFlowDurationLoader) {
    return <LoadingSkeleton type="chart" loading={cashFlowDurationLoader} height={300} />;
  }

  return (
    <AnimatedChart
      title="Saving Flow Trend"
      subheader="Based on selected duration"
      action={
        <CustomButtonGroup
          defaultValue={cashFlowDuration}
          onSelect={(value) => {
            setCashFlowDuration(value);
          }}
        />
      }
      height={300}
      chart={{
        labels: cashFlowData?.length > 0 ? cashFlowData?.map((item, key) => item?.Date) : [],
        series: [
          {
            name: 'Saving Flow',
            type: 'area',
            color: theme.palette.info.main,
            data:
              cashFlowData?.length > 0 ? cashFlowData?.map((item, key) => item?.Count || 0) : [],
          },
        ],
        options: {
          ...chartOptionsMain,
          chart: {
            type: 'area',
            zoom: {
              enabled: true,
              type: 'x',
              autoScaleYaxis: true,
            },
            toolbar: {
              show: true,
              tools: {
                download: false,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true,
              },
            },
          },

          fill: {
            type: ['gradient'],
          },
        },
      }}
    />
  );
};
