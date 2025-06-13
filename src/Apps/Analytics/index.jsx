import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { formatToINR } from 'src/utils/format-number';

import { TimeDurationList } from 'src/constance';
import {
  DashboardService,
  PerformanceService,
  MonthlyReportService,
  TopCategoriesService,
  TopSubCategoriesService,
} from 'src/Services/AnalystData.Services';

import Loader from 'src/components/Loaders/Loader';
import { DateRangePicker } from 'src/components/inputs';
import { DataNotFound } from 'src/components/DataNotFound';
import {
  CustomAvatar,
  CustomSelect,
  CustomTabLabel,
  CustomTransactions,
} from 'src/components/CustomComponents';

import { Table } from 'antd';

import PDFCreateComponent from './PDFMonthly';

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

  const [tabValue, setTabValue] = useState('0');

  const [duration, setDuration] = useState('MONTH');
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [performanceList, setPerformanceList] = useState([]);

  useEffect(() => {
    setCategoriesBaseLoader(true);
    if (tabValue === '0') {
      dispatch(
        DashboardService({ SelectedYear: new Date(categorySelectedDate).getFullYear() }, (res) => {
          setCategoriesBaseLoader(false);
          if (res.status) {
            setCurrentYearMonthBaseData(res?.data?.monthBase || []);
          }
        })
      );
    }

    if (tabValue === '1') {
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

    if (tabValue === '2') {
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

    if (tabValue === '3') {
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
          // setCategoriesBaseLoader(false);
          if (res.status) {
            setDownloadFlag(false);
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
    setExpandedRowKeys(
      (prev) =>
        expanded
          ? [...prev, record.key] // Add to list
          : prev.filter((key) => key !== record.key) // Remove from list
    );
  };

  return (
    <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
      <Card>
        <CardHeader
          title="Analytics"
          sx={{ mb: 2 }}
          action={
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="contained"
                color="success"
                startIcon={<i className="fa-solid fa-download" />}
                onClick={MonthlyReportDownload}
              >
                Download
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

        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginX: 2 }} />

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
            <Tab
              value="0"
              label={<CustomTabLabel selectValue={tabValue} label="All" value="0" />}
            />
            <Tab
              value="1"
              label={<CustomTabLabel selectValue={tabValue} label="Categories" value="1" />}
            />
            <Tab
              value="2"
              label={<CustomTabLabel selectValue={tabValue} label="Sub Categories" value="2" />}
            />
            <Tab
              value="3"
              label={<CustomTabLabel selectValue={tabValue} label="Performance" value="3" />}
            />
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
              <>
                {currentYearMonthBaseList && currentYearMonthBaseList?.length > 0 ? (
                  <Table
                    dataSource={currentYearMonthBaseList}
                    columns={columns2}
                    pagination={false}
                  />
                ) : (
                  <DataNotFound />
                )}
              </>
            )}

            {tabValue === '1' && (
              <>
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
              </>
            )}

            {tabValue === '2' && (
              <>
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
              </>
            )}
            {tabValue === '3' && (
              <>
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
              </>
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
