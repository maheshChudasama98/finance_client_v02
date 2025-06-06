import React from 'react';

import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { formatToINR } from 'src/utils/format-number';

import { DataNotFound } from 'src/components/DataNotFound';

import { Table } from 'antd';

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

const columns2 = [
  {
    title: 'Date',
    dataIndex: 'Date',
    key: 'Date',
    width: '10%',
  },
  {
    title: 'Action',
    dataIndex: 'Action',
    key: 'Action',
    width: '10%',
  },
  {
    title: 'Details',
    dataIndex: 'Details',
    key: 'Details',
  },
  {
    title: 'Amount',
    dataIndex: 'Amount',
    key: 'Amount',
    align: 'right',
    width: '10%',
  },
];

const styes = {
  fontSize: { xs: 11, md: 12 },
  borderRadius: 1,
  fontWeight: 700,
};

export const CustomTransactions = ({ list, flag }) => {
  const ChipFun = (status, bg = true) => {
    switch (status) {
      case 'In':
        return (
          <Chip
            size="small"
            sx={{
              ...styes,
              color: '#1b925e',
              backgroundColor: bg ? '#dbf6e5' : '#FFF',
            }}
            label="Income"
          />
        );
      case 'Out':
        return (
          <Chip
            size="small"
            sx={{
              ...styes,
              color: '#ff5630',
              backgroundColor: bg ? '#ffe4de' : '#FFF',
            }}
            label="Expense"
          />
        );

      case 'From':
        return (
          <Chip
            size="small"
            sx={{
              ...styes,
              color: '#ba7308',
              backgroundColor: bg ? '#fff1d6' : '#FFF',
            }}
            label="Transfer"
          />
        );
      case 'Investment':
        return (
          <Chip
            size="small"
            sx={{
              ...styes,
              color: '#1877F2',
              backgroundColor: bg ? '#D0ECFE' : '#FFF',
            }}
            label="Investment"
          />
        );
      case 'To':
        return (
          <Chip
            size="small"
            sx={{
              ...styes,
              color: '#ba7308',
              backgroundColor: bg ? '#fff1d6' : '#FFF',
            }}
            label="Transfer"
          />
        );

      case 'Debit':
        return (
          <Chip
            size="small"
            sx={{
              ...styes,
              color: '#00B8D9',
              backgroundColor: bg ? '#CAFDF5' : '#FFF',
            }}
            label="Debit"
          />
        );

      case 'Credit':
        return (
          <Chip
            size="small"
            sx={{
              ...styes,
              color: '#5119b7',
              backgroundColor: bg ? '#eddeff' : '#FFF',
            }}
            label="Credit"
          />
        );
      default:
        break;
    }
  };

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

  const tableSetData2 = list?.map((item, index) => ({
    value: item,
    key: item?.AccountId,
    Date: <Typography variant="light">{fDate(item?.Date)}</Typography>,
    Action: ChipFun(item?.Action),
    Details: (
      <Typography variant="light" className="">
        {item?.Details}
      </Typography>
    ),
    Amount: <Typography variant="light">{formatToINR(item?.Amount) || '-'}</Typography>,
  }));

  return (
    <>
      {list && list?.length > 0 ? (
        <Table
          columns={flag ? columns2 : columns}
          dataSource={flag ? tableSetData2 : tableSetData}
          pagination={false}
          // scroll={{ x: 'max-content', y: 100 * 5 }}
        />
      ) : (
        <DataNotFound />
      )}
    </>
  );
};
