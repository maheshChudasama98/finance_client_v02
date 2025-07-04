import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { TimeDurationList } from 'src/constance';
import {
  DashboardService,
  BalanceFollService,
  TopCategoriesService,
  BalanceOverviewService,
  AccountOverviewService,
} from 'src/Services/AnalystData.Services';

import { DateRangePicker } from 'src/components/inputs';
import { CustomSelect, CustomButtonGroup } from 'src/components/CustomComponents';

import OverView from './OverView';
import AccountCards from './AccountCards';
import QuickInsights from './QuickInsights';
import LoadingSkeleton from './LoadingSkeleton';
import DashboardSummary from './DashboardSummary';
import AppCurrentVisits from './app-current-visits';

export default function Index() {
  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [currentYearBaseLoader, setCurrentYearBaseLoader] = useState(true);
  const [currentYearBaseData, setCurrentYearBaseData] = useState({});
  const [lastYearBaseData, setLastYearBaseData] = useState({});
  const [currentYearMonthBaseData, setCurrentYearMonthBaseData] = useState([]);
  const [lastMonth, setLastMonth] = useState([]);
  const [currentMonth, setCurrentMonth] = useState([]);
  const [topTen, setTopTen] = useState([]);

  const [dataFlowTimeDuration, setDataFlowTimeDuration] = useState('WEEK');
  const [dataFlowIncrement, setDataFlowIncrement] = useState([]);

  const [cashFlowData, setCashFlowData] = useState([]);
  const [cashFlowDuration, setCashFlowDuration] = useState('Last_Thirty_Days');

  const [accountOverview, setAccountOverview] = useState({});

  useEffect(() => {
    setCurrentYearBaseLoader(true);

    dispatch(
      DashboardService({ SelectedYear: new Date(selectedYear).getFullYear() }, (res) => {
        setCurrentYearBaseLoader(false);
        if (res.status) {
          setCurrentYearBaseData(res?.data?.currentYear || {});
          setLastYearBaseData(res?.data?.lastYear || {});
          setCurrentYearMonthBaseData(res?.data?.monthBase || []);
          setLastMonth(res?.data?.lastMonthData || []);
          setCurrentMonth(res?.data?.currentMonth || []);
        }
        setCurrentYearBaseLoader(false);
      })
    );
  }, [selectedYear]);

  useEffect(() => {
    dispatch(
      AccountOverviewService({}, (res) => {
        if (res.status) {
          setAccountOverview(res.data);
        }
      })
    );

    dispatch(
      TopCategoriesService({ Duration: 'MONTH' }, (res) => {
        setCurrentYearBaseLoader(false);
        if (res.status) {
          setTopTen(res?.data?.list?.[0]?.topTenOut || []);
        }
      })
    );
  }, []);

  useEffect(() => {
    dispatch(
      BalanceOverviewService({ Duration: dataFlowTimeDuration }, (res) => {
        if (res.status) {
          setDataFlowIncrement(res?.data?.increment);
        }
      })
    );
  }, [dataFlowTimeDuration]);

  useEffect(() => {
    dispatch(
      BalanceFollService({ Duration: cashFlowDuration }, (res) => {
        if (res.status) {
          setCashFlowData(res?.data);
        }
      })
    );
  }, [cashFlowDuration]);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                mb: 0.5,
              }}
              variant="h4"
            >
              Welcome back 👋
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Here&apos;s what&apos;s happening with your finances today
            </Typography>
          </Box>

          <DateRangePicker
            disableFuture
            format="YYYY"
            label="Select Year"
            onChange={(event) => {
              setSelectedYear(event);
            }}
            openTo="year"
            value={selectedYear}
            views={['year']}
          />
        </Box>

        {/* Key Metrics Cards */}
        <DashboardSummary
          currentYearData={currentYearBaseData}
          lastYearData={lastYearBaseData}
          currentMonth={currentMonth}
          lastMonth={lastMonth}
          loading={currentYearBaseLoader}
        />
      </Box>

      {/* Quick Insights */}
      <Box sx={{ mb: 2 }}>
        <QuickInsights
          currentMonth={currentMonth}
          currentYearData={currentYearBaseData}
          lastMonth={lastMonth}
          topCategories={topTen}
        />
      </Box>

      {/* Charts Section */}
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={3}>
          {/* Balance Overview Chart */}
          <Grid item xs={12} lg={8}>
            {!currentYearBaseLoader ? (
              <OverView
                title="Balance Overview"
                height={300}
                chart={{
                  labels:
                    currentYearMonthBaseData?.length > 0
                      ? currentYearMonthBaseData?.map((item, key) => item?.monthName)
                      : [],
                  series: [
                    {
                      name: 'Income',
                      type: 'column',
                      fill: 'solid',
                      color: '#00A76F',
                      data:
                        currentYearMonthBaseData?.length > 0
                          ? currentYearMonthBaseData?.map((item, key) => item?.totalIn || 0)
                          : [],
                    },
                    {
                      name: 'Expense',
                      type: 'column',
                      fill: 'solid',
                      color: '#FFAb00',
                      data:
                        currentYearMonthBaseData?.length > 0
                          ? currentYearMonthBaseData?.map((item, key) => item?.totalOut || 0)
                          : [],
                    },
                  ],
                }}
              />
            ) : (
              <LoadingSkeleton type="chart" />
            )}
          </Grid>

          {/* Top Categories Chart */}
          <Grid item xs={12} lg={4}>
            <AppCurrentVisits
              title="Top Categories"
              type="radialBar"
              chart={{
                series: topTen?.slice(0, 5)?.map((item) => ({
                  label: item?.CategoryName || '',
                  value: item?.totalOut || 0,
                })),
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Data Flow and Cash Flow Section */}
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={3}>
          {/* Data Flow Chart */}
          <Grid item xs={12} lg={6}>
            <OverView
              height={280}
              title={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Data Flow
                  </Typography>
                  <Box>
                    <CustomSelect
                      callBackAction={(value) => setDataFlowTimeDuration(value)}
                      defaultValue={dataFlowTimeDuration}
                      labelKey="Value"
                      menuList={TimeDurationList}
                      size="small"
                      sx={{ width: 120 }}
                      valueKey="Key"
                    />
                  </Box>
                </Box>
              }
              chart={{
                labels:
                  dataFlowIncrement?.length > 0
                    ? dataFlowIncrement?.map((item, key) => item?.duration)
                    : [],
                series: [
                  {
                    name: 'Income',
                    type: 'area',
                    fill: 'gradient',
                    color: '#00A76F',
                    data:
                      dataFlowIncrement?.length > 0
                        ? dataFlowIncrement?.map((item, key) => item?.totalIn || 0)
                        : [],
                  },
                  {
                    name: 'Expense',
                    type: 'area',
                    fill: 'gradient',
                    color: '#FFAb00',
                    data:
                      dataFlowIncrement?.length > 0
                        ? dataFlowIncrement?.map((item, key) => item?.totalOut || 0)
                        : [],
                  },
                ],
              }}
            />
          </Grid>

          {/* Cash Flow Chart */}
          <Grid item xs={12} lg={6}>
            <OverView
              height={280}
              title={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Cash Flow
                  </Typography>
                  <CustomButtonGroup
                    defaultValue={cashFlowDuration}
                    onSelect={(value) => {
                      setCashFlowDuration(value);
                    }}
                  />
                </Box>
              }
              chart={{
                labels:
                  cashFlowData?.length > 0 ? cashFlowData?.map((item, key) => item?.Date) : [],
                series: [
                  {
                    name: 'Cash Flow',
                    type: 'line',
                    color: '#00A76F',
                    data:
                      cashFlowData?.length > 0
                        ? cashFlowData?.map((item, key) => item?.Count || 0)
                        : [],
                  },
                ],
                options: {
                  xaxis: {
                    labels: {
                      show: false,
                    },
                  },
                  yaxis: {
                    labels: {
                      show: false,
                    },
                  },
                  chart: {
                    zoom: { enabled: true },
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Investment Chart */}
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <OverView
              title="Investment Overview"
              height={280}
              chart={{
                labels:
                  currentYearMonthBaseData?.length > 0
                    ? currentYearMonthBaseData?.map((item, key) => item?.monthName)
                    : [],
                series: [
                  {
                    name: 'Investment',
                    type: 'column',
                    fill: 'solid',
                    color: '#00B8D9',
                    data:
                      currentYearMonthBaseData?.length > 0
                        ? currentYearMonthBaseData?.map((item, key) => item?.totalInvestment || 0)
                        : [],
                  },
                ],
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Account Section */}
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AccountCards accounts={accountOverview.accountSummary} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

Index.propTypes = {};
