import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { formatToINR } from 'src/utils/format-number';

import { AccountService } from 'src/Services/AnalystData.Services';

import Loader from 'src/components/Loaders/Loader';
import { DataNotFound } from 'src/components/DataNotFound';

import { Table } from 'antd';

export const CustomTransactions = ({ selectedAccountId, selectedPartyId }) => {
  const dispatch = useDispatch();

  const [list, setList] = useState([]);
  const [loadingLoader, setLoadingLoader] = useState(false);

  useEffect(() => {
    setLoadingLoader(true);
    dispatch(
      AccountService(
        {
          AccountId: selectedAccountId,
          PartyId: selectedPartyId,
        },
        (res) => {
          setLoadingLoader(false);
          if (res.status) {
            setList(res?.data?.list);
          }
        }
      )
    );
  }, [selectedAccountId]);

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
      width: '60%',
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
  ];

  const tableSetData = list?.map((item, index) => ({
    key: item?.AccountId,
    value: item,
    Index: <Typography variant="light">{index + 1 || ''}</Typography>,
    Date: <Typography variant="light">{fDate(item?.Date)}</Typography>,
    Details: (
      <Typography variant="light" className="">
        {item?.Details}
      </Typography>
    ),
    StartAmount: (
      <Typography variant="light" className="custom-text-align-end custom-truncateRight">
        {formatToINR(item?.StartAmount) || '-'}
      </Typography>
    ),
    Debits: item?.AccountAmount < 0 && (
      <Typography
        variant="light"
        sx={{
          color: 'red',
        }}
      >
        {formatToINR(item?.AccountAmount) || '-'}
      </Typography>
    ),
    Credits: item?.AccountAmount > 0 && (
      <Typography
        sx={{
          color: 'green',
        }}
        variant="light"
      >
        {formatToINR(item?.AccountAmount) || '-'}
      </Typography>
    ),
  }));

  return (
    <>
      {loadingLoader ? (
        <Box sx={{ display: 'flex', height: '50vh' }}>
          <Loader />
        </Box>
      ) : (
        <>
          {list && list?.length > 0 ? (
            <Table columns={columns} dataSource={tableSetData} pagination={false} />
          ) : (
            <DataNotFound />
          )}
        </>
      )}
    </>
  );
};
