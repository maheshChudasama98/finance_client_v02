import React from 'react';

import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { lightenColor } from 'src/utils/utils';
import { formatToINR } from 'src/utils/format-number';

import { TransactionActions } from 'src/constance';

import { DataNotFound } from 'src/components/DataNotFound';

import { Table } from 'antd';

import { CustomTooltip } from './CustomTooltip';

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
    title: 'Account',
    dataIndex: 'AccountName',
    key: 'AccountName',
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
    const Action = TransactionActions?.find((i) => status === i.key);

    return (
      <Chip
        size="small"
        sx={{
          ...styes,
          color: Action?.textColor ? Action?.textColor : '#000',
          backgroundColor: lightenColor(Action?.textColor ? Action?.textColor : '#FFF', 0.92),
        }}
        label={Action?.value}
      />
    );
    // switch (status) {
    //   case 'In':
    //     return (
    //       <Chip
    //         size="small"
    //         sx={{
    //           ...styes,
    //           color: '#1b925e',
    //           backgroundColor: bg ? '#dbf6e5' : '#FFF',
    //         }}
    //         label="Income"
    //       />
    //     );
    //   case 'Out':
    //     return (
    //       <Chip
    //         size="small"
    //         sx={{
    //           ...styes,
    //           color: '#ff5630',
    //           backgroundColor: bg ? '#ffe4de' : '#FFF',
    //         }}
    //         label="Expense"
    //       />
    //     );

    //   case 'From':
    //     return (
    //       <Chip
    //         size="small"
    //         sx={{
    //           ...styes,
    //           color: '#ba7308',
    //           backgroundColor: bg ? '#fff1d6' : '#FFF',
    //         }}
    //         label="Transfer"
    //       />
    //     );
    //   case 'Investment':
    //     return (
    //       <Chip
    //         size="small"
    //         sx={{
    //           ...styes,
    //           color: '#1877F2',
    //           backgroundColor: bg ? '#D0ECFE' : '#FFF',
    //         }}
    //         label="Investment"
    //       />
    //     );
    //   case 'To':
    //     return (
    //       <Chip
    //         size="small"
    //         sx={{
    //           ...styes,
    //           color: '#ba7308',
    //           backgroundColor: bg ? '#fff1d6' : '#FFF',
    //         }}
    //         label="Transfer"
    //       />
    //     );

    //   case 'Debit':
    //     return (
    //       <Chip
    //         size="small"
    //         sx={{
    //           ...styes,
    //           color: '#00B8D9',
    //           backgroundColor: bg ? '#CAFDF5' : '#FFF',
    //         }}
    //         label="Debit"
    //       />
    //     );

    //   case 'Credit':
    //     return (
    //       <Chip
    //         size="small"
    //         sx={{
    //           ...styes,
    //           color: '#5119b7',
    //           backgroundColor: bg ? '#eddeff' : '#FFF',
    //         }}
    //         label="Credit"
    //       />
    //     );
    //   default:
    //     break;
    // }
  };

  const tableSetData = list?.map((item, index) => ({
    key: item?.AccountId,
    value: item,
    Date: <Typography variant="light">{fDate(item?.Date)}</Typography>,
    Details: (
      <CustomTooltip label={item?.Description}>
        <Typography variant="light" className="">
          {item?.Details}
        </Typography>
      </CustomTooltip>
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
    AccountName: (
      <Chip
        size="small"
        sx={{
          fontSize: { xs: 11, md: 12 },
          borderRadius: 1,
          fontWeight: 700,
          color: item?.AccountColor || '#1b925e',
          backgroundColor: lightenColor(item?.AccountColor || '#00A76F', 0.92),
        }}
        label={item?.AccountName || ''}
      />
    ),
    Details: (
      <Typography variant="body2" fontSize={13} >
        <CustomTooltip  Placement="right" label={item?.Description}>
          {item?.Details}
          {item?.Description && (
            <i
              className="fa-solid fa-info custom-info-icon-css"
              style={{ fontSize: 6, margin: '0px 8px', padding: '3px 5px' }}
            />
          )}
        </CustomTooltip>
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
