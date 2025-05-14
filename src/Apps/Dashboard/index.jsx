import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { formatToINR } from 'src/utils/format-number';
import { calculatePercentageChange } from 'src/utils/utils';

import { TimeDurationList } from 'src/constance';
import {
  DashboardService,
  BalanceFollService,
  TopCategoriesService,
  BalanceOverviewService,
  TopSubCategoriesService,
} from 'src/Services/AnalystData.Services';

import Scrollbar from 'src/components/scrollbar';
import { DateRangePicker } from 'src/components/inputs';
import { DataNotFound } from 'src/components/DataNotFound';
import { CustomSelect, CustomAvatar, CustomButtonGroup } from 'src/components/CustomComponents';

import { Table } from 'antd';

import InfoBox from './InfoBox';
import OverView from './OverView';
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
  const [topTenSubCategories, setTopTenSubCategories] = useState([]);

  const [dataFlowTimeDuration, setDataFlowTimeDuration] = useState('WEEK');
  const [dataFlowIncrement, setDataFlowIncrement] = useState([]);

  const [cashFlowData, setCashFlowData] = useState([]);
  const [cashFlowDuration, setCashFlowDuration] = useState('Last_Thirty_Days');

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

    dispatch(
      TopSubCategoriesService({ Duration: 'MONTH' }, (res) => {
        setCurrentYearBaseLoader(false);
        if (res.status) {
          setTopTenSubCategories(res?.data?.list?.[0]?.topTenOut || []);
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

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'CategoryName',
      key: 'CategoryName',
      width: '70%',
    },
    {
      title: 'Amount',
      dataIndex: 'totalOut',
      key: 'totalOut',
      align: 'right',
      width: '30%',
    },
  ];

  const tableSetData = topTen.map((item, index) => ({
    item,
    key: index,
    CategoryName: (
      <Stack direction="row" alignItems="center" spacing={2}>
        <CustomAvatar
          width={{ xs: 40, md: 40, lg: 40 }}
          height={{ xs: 40, md: 40, lg: 40 }}
          iconSize={15}
          icon={item?.Icon || ''}
          bgColor={item?.Color || ''}
        />
        <Typography variant="light">{item?.CategoryName}</Typography>
      </Stack>
    ),
    totalOut: (
      <Typography variant="light" color="error">
        {formatToINR(item?.totalOut) || ''}
      </Typography>
    ),
  }));

  const topTenSubCategoriesData = topTenSubCategories.map((item, index) => ({
    item,
    key: index,
    CategoryName: (
      <Stack direction="row" alignItems="center" spacing={2}>
        <CustomAvatar
          width={{ xs: 40, md: 40, lg: 40 }}
          height={{ xs: 40, md: 40, lg: 40 }}
          iconSize={15}
          icon={item?.Icon || ''}
          bgColor={item?.Color || ''}
        />
        <Typography variant="light">{item?.SubCategoryName}</Typography>
      </Stack>
    ),
    totalOut: (
      <Typography variant="light" color="error">
        {formatToINR(item?.totalOut) || ''}
      </Typography>
    ),
  }));

  return (
    <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
      <Box sx={{ justifyContent: 'space-between', display: 'flex' }}>
        <Typography variant="h4" sx={{ ml: 2 }} color="text.secondary">
          Hi, Welcome back 👋
        </Typography>

        <DateRangePicker
          label="Select Year"
          disableFuture
          views={['year']}
          openTo="year"
          format="YYYY"
          value={selectedYear}
          onChange={(event) => {
            setSelectedYear(event);
          }}
        />
      </Box>

      <Box sx={{ marginTop: 3 }}>
        <Grid container spacing={2}>
          {/*  Total Income  */}
          <Grid item xs={6} sm={6} md={3}>
            <InfoBox
              title="Total Income"
              amount={currentYearBaseData?.totalIn || 0}
              previousValue={
                calculatePercentageChange(currentMonth?.totalIn, lastMonth?.totalIn) || 0
              }
              loader={currentYearBaseLoader}
            />
          </Grid>

          {/*  Total Expense  */}
          <Grid item xs={6} sm={6} md={3}>
            <InfoBox
              flag={false}
              title="Total Expense"
              amount={currentYearBaseData?.totalOut || 0}
              previousValue={
                calculatePercentageChange(currentMonth?.totalOut, lastMonth?.totalOut) || 0
              }
              loader={currentYearBaseLoader}
            />
          </Grid>

          {/*  Total Investment  */}
          <Grid item xs={6} sm={6} md={3}>
            <InfoBox
              title="Total Investment"
              amount={currentYearBaseData?.totalInvestment || 0}
              previousValue={
                calculatePercentageChange(
                  currentMonth?.totalInvestment,
                  lastMonth?.totalInvestment
                ) || 0
              }
              loader={currentYearBaseLoader}
            />
          </Grid>

          {/*  Total Debit  */}
          <Grid item xs={6} sm={6} md={3}>
            <InfoBox
              title="Total Debit"
              amount={currentYearBaseData?.totalDebit || 0}
              previousValue={
                calculatePercentageChange(
                  currentYearBaseData?.totalDebit,
                  lastYearBaseData?.totalDebit
                ) || 0
              }
              loader={currentYearBaseLoader}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            {!currentYearBaseLoader ? (
              <OverView
                title="Balance overview"
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
                      data:
                        currentYearMonthBaseData?.length > 0
                          ? currentYearMonthBaseData?.map((item, key) => item?.totalOut || 0)
                          : [],
                    },
                  ],
                }}
              />
            ) : (
              <Card sx={{ p: 2 }}>
                <Skeleton variant="text" sx={{ fontSize: 20 }} width={250} />
                <Skeleton variant="rounded" height={330} animation="wave" />
              </Card>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <AppCurrentVisits
              title="Top 5 Categories"
              type="radialBar"
              chart={{
                series: topTen?.slice(0, 5)?.map((item) => ({
                  label: item?.CategoryName || '',
                  value: item?.totalOut || 0,
                })),
              }}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <OverView
              height={300}
              title={
                <Box
                  sx={{
                    justifyContent: 'space-between',
                    display: 'flex',
                  }}
                >
                  <Typography variant="big">Data Flow</Typography>
                  <Box>
                    <CustomSelect
                      valueKey="Key"
                      labelKey="Value"
                      size="small"
                      sx={{ width: 120 }}
                      menuList={TimeDurationList}
                      defaultValue={dataFlowTimeDuration}
                      callBackAction={(value) => setDataFlowTimeDuration(value)}
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
                    data:
                      dataFlowIncrement?.length > 0
                        ? dataFlowIncrement?.map((item, key) => item?.totalOut || 0)
                        : [],
                  },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <OverView
              height={260}
              title={
                <Box
                  sx={{
                    justifyContent: 'space-between',
                    display: 'flex',
                  }}
                >
                  <Typography variant="big">Cash Flow</Typography>
                  <Box>
                    <CustomButtonGroup
                      defaultValue={cashFlowDuration}
                      onSelect={(value) => {
                        setCashFlowDuration(value);
                      }}
                    />
                  </Box>
                </Box>
              }
              chart={{
                labels:
                  cashFlowData?.length > 0 ? cashFlowData?.map((item, key) => item?.Date) : [],
                series: [
                  {
                    name: ' ',
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

          <Grid item xs={12} md={6}>
            <OverView
              title="Investment"
              height={260}
              chart={{
                labels:
                  currentYearMonthBaseData?.length > 0
                    ? currentYearMonthBaseData?.map((item, key) => item?.monthName)
                    : [],
                series: [
                  {
                    name: '',
                    type: 'column',
                    fill: 'solid',
                    color: '#00b8d9',
                    data:
                      currentYearMonthBaseData?.length > 0
                        ? currentYearMonthBaseData?.map((item, key) => item?.totalInvestment || 0)
                        : [],
                  },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Top Ten Category" />
              <Scrollbar
                sx={{
                  height: 310,
                  '& .simplebar-content': {
                    height: 310,
                    display: 'flex',
                    flexDirection: 'column',
                  },
                }}
              >
                {tableSetData && tableSetData.length > 0 ? (
                  <Table
                    dataSource={tableSetData}
                    showHeader={false}
                    columns={columns}
                    pagination={false}
                    rowKey="CategoryName"
                  />
                ) : (
                  <DataNotFound />
                )}
              </Scrollbar>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Top ten sub category" />
              <Scrollbar
                sx={{
                  height: 310,
                  '& .simplebar-content': {
                    height: 310,
                    display: 'flex',
                    flexDirection: 'column',
                  },
                }}
              >
                {topTenSubCategoriesData && topTenSubCategoriesData.length > 0 ? (
                  <Table
                    dataSource={topTenSubCategoriesData}
                    showHeader={false}
                    columns={columns}
                    pagination={false}
                    rowKey="CategoryName"
                  />
                ) : (
                  <DataNotFound />
                )}
              </Scrollbar>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

Index.propTypes = {};
