import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { formatToINR } from 'src/utils/format-number';

import {
  DashboardService,
  TopCategoriesService,
  TopSubCategoriesService,
} from 'src/Services/AnalystData.Services';

import Scrollbar from 'src/components/scrollbar';
import Loader from 'src/components/Loaders/Loader';
import { DateRangePicker } from 'src/components/inputs';
import { DataNotFound } from 'src/components/DataNotFound';
import { CustomAvatar } from 'src/components/CustomComponents';

import { Table } from 'antd';

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

export default function Index() {
  const dispatch = useDispatch();

  const [categoriesList, setCategoriesList] = useState([]);
  const [subCategoriesList, setSubCategoriesList] = useState([]);
  const [categorySelectedDate, setCategorySelectedDate] = useState(new Date());
  const [categoriesBaseLoader, setCategoriesBaseLoader] = useState(false);
  // const [currentYearBaseData, setCurrentYearBaseData] = useState({});
  // const [lastYearBaseData, setLastYearBaseData] = useState({});
  const [currentYearMonthBaseData, setCurrentYearMonthBaseData] = useState([]);
  // const [lastMonth, setLastMonth] = useState([]);
  // const [currentMonth, setCurrentMonth] = useState([]);

  useEffect(() => {
    setCategoriesBaseLoader(true);
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

    // setCurrentYearBaseLoader(true);

    dispatch(
      DashboardService({ SelectedYear: new Date(categorySelectedDate).getFullYear()}, (res) => {
        // setCurrentYearBaseLoader(false);
        if (res.status) {
          // setCurrentYearBaseData(res?.data?.currentYear || {});
          // setLastYearBaseData(res?.data?.lastYear || {});
          setCurrentYearMonthBaseData(res?.data?.monthBase || []);
          // setLastMonth(res?.data?.lastMonthData || []);
          // setCurrentMonth(res?.data?.currentMonth || []);
        }
        // setCurrentYearBaseLoader(false);
      })
    );
  }, [categorySelectedDate]);

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

  return (
    <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
      <Box sx={{ justifyContent: 'space-between', display: 'flex', mb: 2 }}>
        <Typography variant="h4" sx={{ ml: 2 }} color="text.secondary">
          Analytics
        </Typography>
      </Box>

      <CardHeader
        action={
          <DateRangePicker
            disableFuture
            label="Month"
            openTo="year"
            format="MMM-YYYY"
            views={['year', 'month']}
            value={categorySelectedDate}
            onChange={(event) => {
              setCategorySelectedDate(event);
            }}
          />
        }
        sx={{ mb: 2 }}
      />

      {categoriesBaseLoader ? (
        <Box sx={{ display: 'flex', height: '50vh' }}>
          <Loader />
        </Box>
      ) : (
        <Grid container spacing={2} sx={{}}>
          <Grid item xs={12} md={12}>
            <Card>
              <CardHeader title="Category" sx={{ mb: 2 }} />
              <Scrollbar
                sx={{
                  height: 400,
                  '& .simplebar-content': {
                    height: 400,
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
          <Grid item xs={12} md={12}>
            <Card>
              <CardHeader title="Sub Category" sx={{mb:2}} />
              <Scrollbar
                sx={{
                  height: 400,
                  '& .simplebar-content': {
                    height: 400,
                    display: 'flex',
                    flexDirection: 'column',
                  },
                }}
              >
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
              </Scrollbar>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader title="All " sx={{ mb: 2 }} />
              {currentYearMonthBaseList && currentYearMonthBaseList.length > 0 ? (
                <Table
                  dataSource={currentYearMonthBaseList}
                  columns={columns2}
                  pagination={false}
                />
              ) : (
                <DataNotFound />
              )}
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

Index.propTypes = {};
