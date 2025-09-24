import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useAmountVisibility } from 'src/hooks/use-amount-visibility';

import { formatToINR } from 'src/utils/format-number';

import { TimeDurationList } from 'src/constance';
import {
  DashboardService,
  BalanceFollService,
  TopCategoriesService,
  BalanceOverviewService,
} from 'src/Services/AnalystData.Services';

import { DateRangePicker } from 'src/components/inputs';
import { CustomSelect, CustomButtonGroup } from 'src/components/CustomComponents';

import OverView from './OverView';
import AccountList from './AccountList';
import QuickInsights from './QuickInsights';
import GrowthRateChart from './GrowthRateChart';
import LoadingSkeleton from './LoadingSkeleton';
import DashboardSummary from './DashboardSummary';
import AppCurrentVisits from './app-current-visits';
import YearlyOverviewPDF from '../../DocumentToPDF/YearlyOverviewPDF';

export default function Index() {
  const dispatch = useDispatch();
  const { isAmountVisible } = useAmountVisibility();

  const DefaultTimeFrame = localStorage.getItem('DefaultTimeFrame');
  const DefaultDuration = localStorage.getItem('DefaultDuration');

  const [currentBalance, setCurrentBalance] = useState(0);

  const [topTen, setTopTen] = useState([]);
  const [lastMonth, setLastMonth] = useState([]);
  const [currentMonth, setCurrentMonth] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [lastYearBaseData, setLastYearBaseData] = useState({});
  const [currentYearBaseData, setCurrentYearBaseData] = useState({});
  const [currentYearBaseLoader, setCurrentYearBaseLoader] = useState(true);
  const [currentYearMonthBaseData, setCurrentYearMonthBaseData] = useState([]);

  const [dataFlowIncrement, setDataFlowIncrement] = useState([]);
  const [dataFlowTimeDurationLoader, setDataFlowTimeDurationLoader] = useState(true);
  const [dataFlowTimeDuration, setDataFlowTimeDuration] = useState(DefaultTimeFrame || 'WEEK');

  const [cashFlowData, setCashFlowData] = useState([]);
  const [downloadFlag, setDownloadFlag] = useState(false);
  const [cashFlowDurationLoader, setCashFlowDurationLoader] = useState(true);
  const [cashFlowDuration, setCashFlowDuration] = useState(DefaultDuration || 'Last_Thirty_Days');

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
      TopCategoriesService({ Duration: 'MONTH' }, (res) => {
        setCurrentYearBaseLoader(false);
        if (res.status) {
          setTopTen(res?.data?.list?.[0]?.topTenOut || []);
        }
      })
    );
  }, []);

  useEffect(() => {
    setDataFlowTimeDurationLoader(true);
    dispatch(
      BalanceOverviewService({ Duration: dataFlowTimeDuration }, (res) => {
        setDataFlowTimeDurationLoader(false);
        if (res.status) {
          setDataFlowIncrement(res?.data?.increment);
        }
      })
    );
  }, [dataFlowTimeDuration]);

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

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            alignItems: 'center',
            display: { md: 'flex', xs: 'block' },
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

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: { xs: 3, md: 0 } }}>
            {!downloadFlag && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<i className="fa-solid fa-download" />}
                onClick={() => setDownloadFlag(true)}
                disabled={currentYearBaseLoader}
              >
                Download
              </Button>
            )}

            {downloadFlag && (
              <YearlyOverviewPDF
                setFlag={setDownloadFlag}
                selectedYear={selectedYear}
                currentYearData={currentYearBaseData}
                lastYearData={lastYearBaseData}
                currentMonth={currentMonth}
                lastMonth={lastMonth}
                currentYearMonthBaseData={currentYearMonthBaseData}
                // dataFlowIncrement={dataFlowIncrement}
                // topCategories={topTen}
              />
            )}
            <DateRangePicker
              disableFuture
              format="YYYY"
              label=""
              onChange={(event) => {
                setSelectedYear(event);
              }}
              sx={{ width: 200 }}
              openTo="year"
              value={selectedYear}
              views={['year']}
            />
          </Box>
        </Box>
        <AccountList setCurrentBalance={setCurrentBalance} />
      </Box>

      {/* Account List Section */}
      <Box sx={{ mb: 2 }}>
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
          currentBalance={currentBalance}
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
                  options: {
                    stroke: {
                      width: [1],
                    },
                  },
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
          <Grid item xs={12} lg={6}>
            {dataFlowTimeDurationLoader ? (
              <LoadingSkeleton type="chart" />
            ) : (
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
            )}
          </Grid>

          {/* Cash Flow Chart */}
          <Grid item xs={12} lg={6}>
            {cashFlowDurationLoader ? (
              <LoadingSkeleton type="chart" loading={cashFlowDurationLoader} height={280} />
            ) : (
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
                    chart: {
                      zoom: { enabled: true },
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: (val, opts) => {
                        if (
                          opts.dataPointIndex === Number((cashFlowData?.length || 0) - 1) ||
                          null
                        ) {
                          // return val?.toLocaleString('en-IN');
                          return formatToINR(val, isAmountVisible);
                        }
                        return '';
                      },
                      // style: {
                      //   colors: ['#ffffff'],
                      //   fontSize: '12px',
                      //   fontWeight: 'bold',
                      // },
                      // background: {
                      //   enabled: true,
                      //   foreColor: '#00A76F',
                      //   borderRadius: 4,
                      //   padding: 6,
                      // },
                      offsetY: -10,
                      offsetX: -10,
                    },
                    // markers: {
                    //   hover: {
                    //     sizeOffset: 4,
                    //   },
                    //   size: 4,
                    // },
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
                  },
                }}
              />
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Investment Chart */}
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            {currentYearBaseLoader ? (
              <LoadingSkeleton type="chart" loading={cashFlowDurationLoader} height={280} />
            ) : (
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
            )}
          </Grid>

          {/* Growth Rate Chart */}
          <Grid item xs={12} lg={6}>
            {currentYearBaseLoader ? (
              <LoadingSkeleton type="chart" loading={cashFlowDurationLoader} height={280} />
            ) : (
              <GrowthRateChart
                loading={currentYearBaseLoader}
                monthlyData={currentYearMonthBaseData}
                title="Monthly Growth Rate"
              />
            )}
          </Grid>
        </Grid>
      </Box>

      {/* PDF Download Component */}
    </Container>
  );
}

Index.propTypes = {};
