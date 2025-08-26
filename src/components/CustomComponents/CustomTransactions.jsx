import React from 'react';
import Table from 'antd/lib/table';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useAmountVisibility } from 'src/hooks/use-amount-visibility';

import { fDate } from 'src/utils/format-time';
import { formatToINR } from 'src/utils/format-number';

import { DataNotFound } from 'src/components/DataNotFound';

import { CustomTooltip } from './CustomTooltip';

const columns = [
  {
    title: 'Date',
    dataIndex: 'Date',
    key: 'Date',
    width: 120,
  },
  {
    title: 'Details',
    dataIndex: 'Details',
    key: 'Details',
    width: 200,
  },
  {
    title: 'Debits',
    dataIndex: 'Debits',
    key: 'Debits',
    width: 120,
    align: 'right',
  },
  {
    title: 'Credits',
    dataIndex: 'Credits',
    key: 'Credits',
    width: 120,
    align: 'right',
  },
  {
    title: 'Balance',
    dataIndex: 'Balance',
    key: 'Balance',
    width: 120,
    align: 'right',
  },
];

export const CustomTransactions = ({ list, flag }) => {
  const { isAmountVisible } = useAmountVisibility();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
        {formatToINR(item?.AccountAmount, isAmountVisible) || '-'}
      </Typography>
    ),
    Credits: item?.AccountAmount > 0 && (
      <Typography sx={{ color: 'green' }} variant="light">
        {formatToINR(item?.AccountAmount, isAmountVisible) || '-'}
      </Typography>
    ),
    Balance: (
      <Typography variant="light">{formatToINR(item?.Balance, isAmountVisible) || '-'}</Typography>
    ),
  }));

  const MobileTransactionsGrid = () => (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={1}>
        {list?.map((item, index) => (
          <Grid item xs={12} sm={12} key={item?.AccountId || index}>
            <Box
              sx={{
                p: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                backgroundColor: 'background.paper',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 1,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.7rem' }}
                >
                  {fDate(item?.Date)}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    color: item?.AccountAmount > 0 ? 'success.main' : 'error.main',
                  }}
                >
                  {(item?.AccountAmount > 0 ? '+' : '') +
                    formatToINR(item?.AccountAmount, isAmountVisible)}
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ flex: 'flex' }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: '0.6rem' }}
                    >
                      Details -
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                      {' '}
                      {item?.Details || '-'}
                    </Typography>
                  </Box>
                  {!flag && (
                    <Box sx={{}}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.6rem' }}
                      >
                        Balance{' '}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.7rem' }}>
                        {'  '}
                        {formatToINR(item?.Balance, isAmountVisible) || '-'}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (list && list?.length > 0) {
    return (
      <>
        {isMobile ? (
          <MobileTransactionsGrid />
        ) : (
          <Table
            columns={columns}
            dataSource={tableSetData}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        )}
      </>
    );
  }

  return <DataNotFound />;
};
