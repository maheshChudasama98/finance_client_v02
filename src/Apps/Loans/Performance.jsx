import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { formatToINR } from 'src/utils/format-number';

import { TimeDurationList } from 'src/constance';
import { PerformanceService } from 'src/Services/AnalystData.Services';

import Loader from 'src/components/Loaders/Loader';
import { DataNotFound } from 'src/components/DataNotFound';
import { CustomSelect, CustomTransactions } from 'src/components/CustomComponents';

import { Table } from 'antd';

const columns = [
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

export default function Performance({ AccountId }) {
  const dispatch = useDispatch();

  const [list, setList] = useState([]);
  const [loadingLoader, setLoadingLoader] = useState(false);
  const [duration, setDuration] = useState('MONTH');
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  useEffect(() => {
    setLoadingLoader(true);
    dispatch(
      PerformanceService({ AccountId, Duration: duration }, (res) => {
        if (res.status) {
          setLoadingLoader(false);
          setList(res?.data?.list);
          setExpandedRowKeys([]);
        }
      })
    );
  }, [AccountId, duration]);

  const tableSetData = list?.map((item, index) => ({
    key: index,
    value: item,
    child: <CustomTransactions list={item.child} flag />,
    duration: <Typography variant="body1" fontSize={15} fontWeight={700}>{item?.duration}</Typography>,
    totalIn: <Typography variant="light" >{formatToINR(item?.totalIn) || '-'}</Typography>,
    totalOut: <Typography variant="light" >{formatToINR(item?.totalOut) || '-'}</Typography>,
    totalDebit: <Typography variant="light" >{formatToINR(item?.totalDebit) || '-'}</Typography>,
    totalCredit: <Typography variant="light" >{formatToINR(item?.totalCredit) || '-'}</Typography>,
    totalInvestment: (
      <Typography variant="light">{formatToINR(item?.totalInvestment) || '-'}</Typography>
    ),
  }));
  const handleExpand = (expanded, record) => {
    setExpandedRowKeys(
      (prev) =>
        expanded
          ? [...prev, record.key] // Add to list
          : prev.filter((key) => key !== record.key) // Remove from list
    );
  };

  return (
    <Box>
      
      <Box sx={{ placeSelf: 'end', mb: 2, mx: 2, display: 'flex' }}>
        <CustomSelect
          valueKey="Key"
          labelKey="Value"
          size="small"
          sx={{ width: 120, placeItems: 'end' }}
          menuList={TimeDurationList}
          defaultValue={duration}
          callBackAction={(value) => setDuration(value)}
        />
      </Box>

      {loadingLoader ? (
        <Box sx={{ display: 'flex', height: '50vh' }}>
          <Loader />
        </Box>
      ) : (
        <>
          {list && list?.length > 0 ? (
            <Table
              columns={columns}
              dataSource={tableSetData}
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
    </Box>
  );
}

Performance.propTypes = {};
