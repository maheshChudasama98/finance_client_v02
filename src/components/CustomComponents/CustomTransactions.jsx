import React from 'react';

import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { formatToINR } from 'src/utils/format-number';

import { DataNotFound } from 'src/components/DataNotFound';

import { Table } from 'antd';

export const CustomTransactions = ({ list }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'Date',
      key: 'Date',
      width: '20%',
    },
    {
      title: 'Details',
      dataIndex: 'Details',
      key: 'Details',
      // width: '60%',
    },
    {
      title: 'Debits',
      dataIndex: 'Debits',
      key: 'Debits',
      align: 'right',
      width: '10%',
    },
    {
      title: 'Credits',
      dataIndex: 'Credits',
      key: 'Credits',
      align: 'right',
      width: '10%',
    },
    {
      title: 'Balance',
      dataIndex: 'Balance',
      key: 'Balance',
      align: 'right',
      width: '10%',
    },
  ];

  const tableSetData = list?.map((item, index) => ({
    key: item?.AccountId,
    value: item,
    Date: <Typography variant="light">{fDate(item?.Date)}</Typography>,
    Details: (
      <Typography variant="light" className="">
        {item?.Details}
      </Typography>
    ),
    Debits: item?.AccountAmount < 0 && (
      <Typography variant="light" sx={{ color: 'red' }}>
        {formatToINR(item?.AccountAmount) || '-'}
      </Typography>
    ),
    Credits: item?.AccountAmount > 0 && (
      <Typography sx={{ color: 'green' }} variant="light">
        {formatToINR(item?.AccountAmount) || '-'}
      </Typography>
    ),
    Balance: <Typography variant="light">{formatToINR(item?.Balance) || '-'}</Typography>,
  }));

  return (
    <>
      {list && list?.length > 0 ? (
        <Table columns={columns} dataSource={tableSetData} pagination={false} />
      ) : (
        <DataNotFound />
      )}
    </>
  );
};
