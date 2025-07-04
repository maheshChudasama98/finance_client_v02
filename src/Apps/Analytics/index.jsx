import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { formatToINR } from 'src/utils/format-number';

import { TimeDurationList } from 'src/constance';
import {
  DashboardService,
  PerformanceService,
  MonthlyReportService,
  TopCategoriesService,
  AccountOverviewService,
  TopSubCategoriesService,
} from 'src/Services/AnalystData.Services';

import Loader from 'src/components/Loaders/Loader';
import { DateRangePicker } from 'src/components/inputs';
import { DataNotFound } from 'src/components/DataNotFound';
import { CustomAvatar, CustomSelect, CustomTransactions } from 'src/components/CustomComponents';

import { Table } from 'antd';

import OverView from './OverView';
import AccountCards from './AccountCards';
import PDFCreateComponent from './PDFMonthly';
import AccountAnalytics from './AccountAnalytics';
import DetailedAnalytics from './DetailedAnalytics';
import EnhancedAnalytics from './EnhancedAnalytics';
import AccountSummaryWidget from './AccountSummaryWidget';

const columns = [
  {
    title: 'Name',
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

const columns2 = [
  {
    title: 'Month',
    dataIndex: 'monthName',
    key: 'monthName',
    width: '40%',
  },
  {
    title: 'Income',
    dataIndex: 'totalIn',
    key: 'totalIn',
    align: 'right',
    width: '10%',
  },
  {
    title: 'Expense',
    dataIndex: 'totalOut',
    key: 'totalOut',
    align: 'right',
    width: '10%',
  },
  {
    title: 'Investment',
    dataIndex: 'totalInvestment',
    key: 'totalInvestment',
    align: 'right',
    width: '10%',
  },
  {
    title: 'Credit',
    dataIndex: 'totalCredit',
    key: 'totalCredit',
    align: 'right',
    width: '10%',
  },
  {
    title: 'Debit',
    dataIndex: 'totalDebit',
    key: 'totalDebit',
    align: 'right',
    width: '10%',
  },
];

const performance = [
  {
    title: 'Duration',
    dataIndex: 'duration',
    key: 'duration',
  },
  {
    title: 'Income',
    dataIndex: 'totalIn',
    key: 'totalIn',
    align: 'right',
    width: '10%',
  },
  {
    title: 'Expense',
    dataIndex: 'totalOut',
    key: 'totalOut',
    align: 'right',
    width: '10%',
  },
  {
    title: 'Credit',
    dataIndex: 'totalCredit',
    key: 'totalCredit',
    align: 'right',
    width: '10%',
  },
  {
    title: 'Debit',
    dataIndex: 'totalDebit',
    key: 'totalDebit',
    align: 'right',
    width: '10%',
  },
];

export default function Index() {
  const dispatch = useDispatch();

  const [list, setList] = useState({});
  const [downloadFlag, setDownloadFlag] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [subCategoriesList, setSubCategoriesList] = useState([]);
  const [categorySelectedDate, setCategorySelectedDate] = useState(new Date());
  const [categoriesBaseLoader, setCategoriesBaseLoader] = useState(false);
  const [currentYearMonthBaseData, setCurrentYearMonthBaseData] = useState([]);

  const [tabValue, setTabValue] = useState('5');

  const [duration, setDuration] = useState('MONTH');
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [performanceList, setPerformanceList] = useState([]);
  const [accountOverview, setAccountOverview] = useState({});

  useEffect(() => {
    setCategoriesBaseLoader(true);
    if (tabValue === '0' || tabValue === '4' || tabValue === '5') {
      dispatch(
        DashboardService({ SelectedYear: new Date(categorySelectedDate).getFullYear() }, (res) => {
          setCategoriesBaseLoader(false);
          if (res.status) {
            const monthData = res?.data?.monthBase || [];
            setCurrentYearMonthBaseData(monthData);
          }
        })
      );
    }

    if (tabValue === '1' || tabValue === '4' || tabValue === '5') {
      dispatch(
        TopCategoriesService(
          {
            Duration: 'MONTH',
            SelectedDate: new Date(categorySelectedDate),
          },
          (res) => {
            setCategoriesBaseLoader(false);
            if (res.status) {
              setCategoriesList(res?.data?.list?.[0]?.topTenOut || []);
            }
          }
        )
      );
    }

    if (tabValue === '2' || tabValue === '4' || tabValue === '5') {
      dispatch(
        TopSubCategoriesService(
          {
            Duration: 'MONTH',
            SelectedDate: new Date(categorySelectedDate),
          },
          (res) => {
            setCategoriesBaseLoader(false);
            if (res.status) {
              setSubCategoriesList(res?.data?.list?.[0]?.topTenOut || []);
            }
          }
        )
      );
    }

    if (tabValue === '3' || tabValue === '4' || tabValue === '5') {
      dispatch(
        PerformanceService(
          { SelectedDate: new Date(categorySelectedDate), Duration: duration },
          (res) => {
            setCategoriesBaseLoader(false);
            if (res.status) {
              setPerformanceList(res?.data?.list);
              setExpandedRowKeys([]);
            }
          }
        )
      );
    }

    if (tabValue === '6' || tabValue === '4' || tabValue === '5') {
      dispatch(
        AccountOverviewService({}, (res) => {
          setCategoriesBaseLoader(false);
          if (res.status) {
            setAccountOverview(res.data);
          }
        })
      );
    }
  }, [categorySelectedDate, tabValue, duration]);

  const tableSetData = categoriesList.map((item, index) => ({
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
    totalOut: <Typography variant="light">{formatToINR(item?.totalOut) || ''}</Typography>,
  }));

  const subCategoriesData = subCategoriesList.map((item, index) => ({
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
    totalOut: <Typography variant="light">{formatToINR(item?.totalOut) || ''}</Typography>,
  }));

  const currentYearMonthBaseList = currentYearMonthBaseData.map((item, index) => ({
    item,
    key: index,
    monthName: <Typography variant="small">{item?.monthName || ''}</Typography>,
    totalIn: (
      <Typography variant="light">
        {item?.totalOut > 0 ? formatToINR(item?.totalIn) : '' || ''}
      </Typography>
    ),
    totalOut: (
      <Typography variant="light">
        {item?.totalOut > 0 ? formatToINR(item?.totalOut) : '' || ''}
      </Typography>
    ),
    totalInvestment: (
      <Typography variant="light">
        {item?.totalInvestment > 0 ? formatToINR(item?.totalInvestment) : '' || ''}
      </Typography>
    ),
    totalCredit: (
      <Typography variant="light">
        {item?.totalCredit > 0 ? formatToINR(item?.totalCredit) : '' || ''}
      </Typography>
    ),
    totalDebit: (
      <Typography variant="light">
        {item?.totalDebit > 0 ? formatToINR(item?.totalDebit) : '' || ''}
      </Typography>
    ),
  }));

  const performanceSetData = performanceList?.map((item, index) => ({
    key: index,
    value: item,
    child: <CustomTransactions list={item.child} flag />,
    duration: <Typography variant="normal">{item?.duration}</Typography>,
    totalIn: <Typography variant="light">{formatToINR(item?.totalIn) || '-'}</Typography>,
    totalOut: <Typography variant="light">{formatToINR(item?.totalOut) || '-'}</Typography>,
    totalDebit: <Typography variant="light">{formatToINR(item?.totalDebit) || '-'}</Typography>,
    totalCredit: <Typography variant="light">{formatToINR(item?.totalCredit) || '-'}</Typography>,
    totalInvestment: (
      <Typography variant="light">{formatToINR(item?.totalInvestment) || '-'}</Typography>
    ),
  }));

  const MonthlyReportDownload = () => {
    dispatch(
      MonthlyReportService(
        {
          Duration: 'MONTH',
          SelectedDate: new Date(categorySelectedDate),
        },
        (res) => {
          if (res.status) {
            setDownloadFlag(true);
            setList(res?.data || []);
          }
        }
      )
    );
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleExpand = (expanded, record) => {
    setExpandedRowKeys((prev) =>
      expanded ? [...prev, record.key] : prev.filter((key) => key !== record.key)
    );
  };

  // Chart data for monthly trends
  const monthlyChartData = {
    labels: currentYearMonthBaseData.map((item) => item.monthName),
    series: [
      {
        name: 'Income',
        type: 'area',
        fill: 'gradient',
        color: '#00A76F',
        data: currentYearMonthBaseData.map((item) => item.totalIn || 0),
      },
      {
        name: 'Expense',
        type: 'area',
        fill: 'gradient',
        color: '#FF4842',
        data: currentYearMonthBaseData.map((item) => item.totalOut || 0),
      },
    ],
  };

  // Chart data for category distribution
  const categoryChartData = {
    labels: categoriesList.slice(0, 8).map((item) => item.CategoryName),
    series: [
      {
        name: 'Expense',
        type: 'pie',
        data: categoriesList.slice(0, 8).map((item) => item.totalOut || 0),
      },
    ],
  };

  return (
    <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
      <Card>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h4">Financial Analytics</Typography>
              <Chip
                label={`${new Date(categorySelectedDate).getFullYear()}`}
                color="primary"
                variant="outlined"
              />
            </Stack>
          }
          sx={{ mb: 2 }}
          action={
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="contained"
                color="success"
                startIcon={<i className="fa-solid fa-download" />}
                onClick={MonthlyReportDownload}
              >
                Download Report
              </Button>

              <DateRangePicker
                disableFuture
                label=""
                openTo="year"
                format="MMM-YYYY"
                views={['year', 'month']}
                value={categorySelectedDate}
                onChange={(event) => {
                  setCategorySelectedDate(event);
                }}
              />
            </Stack>
          }
        />

        <Divider sx={{ mx: 2 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            px: 2,
            mb: 2,
          }}
        >
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            disableRipple
            value={tabValue}
            onChange={handleChange}
          >
            <Tab value="5" label="Enhanced Analytics" />
            <Tab value="0" label="Overview" />
            <Tab value="1" label="Categories" />
            <Tab value="2" label="Sub Categories" />
            <Tab value="3" label="Performance" />
            <Tab value="6" label="Accounts" />
            {/* <Tab value="4" label="Detailed Analysis" /> */}
          </Tabs>

          {tabValue === '3' && (
            <Box>
              <CustomSelect
                valueKey="Key"
                labelKey="Value"
                size="small"
                sx={{ width: 120, placeItems: 'end', mt: 2 }}
                menuList={TimeDurationList}
                defaultValue={duration}
                callBackAction={(value) => setDuration(value)}
              />
            </Box>
          )}
        </Box>

        {categoriesBaseLoader ? (
          <Box sx={{ display: 'flex', height: '50vh' }}>
            <Loader />
          </Box>
        ) : (
          <>
            {tabValue === '0' && (
              <Box sx={{ p: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <OverView
                      title="Monthly Financial Trends"
                      subheader="Income vs Expense comparison"
                      height={400}
                      chart={monthlyChartData}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardHeader title="Monthly Breakdown" />
                      <Box sx={{ p: 2 }}>
                        {currentYearMonthBaseList && currentYearMonthBaseList?.length > 0 ? (
                          <Table
                            dataSource={currentYearMonthBaseList}
                            columns={columns2}
                            pagination={false}
                            size="small"
                          />
                        ) : (
                          <DataNotFound />
                        )}
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {tabValue === '1' && (
              <Box sx={{ p: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardHeader title="Top Categories by Expense" />
                      <Box sx={{ p: 2 }}>
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
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <OverView
                      title="Category Distribution"
                      subheader="Expense breakdown by category"
                      height={400}
                      chart={categoryChartData}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {tabValue === '2' && (
              <Box sx={{ p: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardHeader title="Top Sub-Categories by Expense" />
                      <Box sx={{ p: 2 }}>
                        {subCategoriesData && subCategoriesData.length > 0 ? (
                          <Table
                            dataSource={subCategoriesData}
                            showHeader={false}
                            columns={columns}
                            pagination={false}
                            rowKey="CategoryName"
                          />
                        ) : (
                          <DataNotFound />
                        )}
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardHeader title="Sub-Category Analysis" />
                      <Box sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Detailed breakdown of expenses by sub-categories for better financial
                          planning
                        </Typography>
                        <Stack spacing={2}>
                          {subCategoriesList.slice(0, 5).map((item, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <CustomAvatar
                                  width={24}
                                  height={24}
                                  iconSize={12}
                                  icon={item?.Icon || ''}
                                  bgColor={item?.Color || ''}
                                />
                                <Typography variant="body2">{item?.SubCategoryName}</Typography>
                              </Stack>
                              <Typography variant="body2" fontWeight="bold">
                                {formatToINR(item?.totalOut)}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {tabValue === '3' && (
              <Box sx={{ p: 2 }}>
                <Card>
                  <CardHeader title="Performance Analysis" />
                  <Box sx={{ p: 2 }}>
                    {performanceList && performanceList?.length > 0 ? (
                      <Table
                        columns={performance}
                        dataSource={performanceSetData}
                        pagination={false}
                        expandable={{
                          expandedRowKeys,
                          onExpand: handleExpand,
                          expandedRowRender: (record) => record.child,
                        }}
                      />
                    ) : (
                      <DataNotFound />
                    )}
                  </Box>
                </Card>
              </Box>
            )}

            {tabValue === '4' && (
              <DetailedAnalytics
                monthlyData={currentYearMonthBaseData}
                categoriesData={categoriesList}
                subCategoriesData={subCategoriesList}
                selectedYear={new Date(categorySelectedDate).getFullYear()}
                onYearChange={(year) => {
                  const newDate = new Date(categorySelectedDate);
                  newDate.setFullYear(year);
                  setCategorySelectedDate(newDate);
                }}
              />
            )}

            {tabValue === '5' && (
              <EnhancedAnalytics
                monthlyData={currentYearMonthBaseData}
                categoriesData={categoriesList}
                subCategoriesData={subCategoriesList}
                selectedYear={new Date(categorySelectedDate).getFullYear()}
                onYearChange={(year) => {
                  const newDate = new Date(categorySelectedDate);
                  newDate.setFullYear(year);
                  setCategorySelectedDate(newDate);
                }}
              />
            )}

            {tabValue === '6' && (
              <Box sx={{ p: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <AccountSummaryWidget accountsList={accountOverview.accountSummary} />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <AccountAnalytics accountsList={accountOverview.accountSummary} />
                  </Grid>
                  <Grid item xs={12}>
                    <AccountCards accounts={accountOverview.accountSummary} />
                  </Grid>
                </Grid>
              </Box>
            )}
          </>
        )}
      </Card>

      {downloadFlag && (
        <PDFCreateComponent list={list} setFlag={(value) => setDownloadFlag(value)} />
      )}
    </Box>
  );
}

Index.propTypes = {};
