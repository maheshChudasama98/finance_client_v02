import React from 'react';
import Table from 'antd/lib/table';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useAmountVisibility } from 'src/hooks/use-amount-visibility';

import { fDate } from 'src/utils/format-time';
import { lightenColor } from 'src/utils/utils';
import { formatToINR } from 'src/utils/format-number';

import { TransactionActions } from 'src/constance';

import { DataNotFound } from 'src/components/DataNotFound';

import { CustomTooltip } from './CustomTooltip';

const columns = [
  {
    title: 'Date',
    dataIndex: 'Date',
    key: 'Date',
    width: 200,
  },

  {
    title: 'Account',
    dataIndex: 'AccountName',
    key: 'AccountName',
    width: 200,
  },
  {
    title: 'Action',
    dataIndex: 'Action',
    key: 'Action',
    width: 200,
  },
  {
    title: 'Details',
    dataIndex: 'Details',
    key: 'Details',
    // width: ,
  },
  {
    title: 'Amount',
    dataIndex: 'Amount',
    key: 'Amount',
    width: 200,
    align: 'right',
  },
];

export const CustomPerformance = ({ list }) => {
  const { isAmountVisible } = useAmountVisibility();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const ChipFun = (status) => {
    const Action = TransactionActions?.find((i) => status === i.key);
    const styes = {
      fontSize: { xs: 10, sm: 11 },
      height: 20,
      borderRadius: 0.5,
      fontWeight: 700,
    };

    return (
      <Chip
        size="small"
        sx={{
          color: Action?.textColor ? Action?.textColor : '#000',
          backgroundColor: !isMobile
            ? lightenColor(Action?.textColor ? Action?.textColor : '#FFF', 0.85)
            : 'transparent',
          '&:hover': {
            backgroundColor: !isMobile
              ? lightenColor(Action?.textColor ? Action?.textColor : '#FFF', 0.5)
              : null,
          },
          ...styes,
        }}
        label={Action?.value || status}
      />
    );
  };

  const tableSetData = list?.map((item, index) => ({
    value: item,
    key: item?.AccountId,
    Date: <Typography variant="light">{fDate(item?.Date)}</Typography>,
    Action: ChipFun(item?.Action),
    AccountName: (
      <Chip
        size="small"
        sx={{
          color: item?.AccountColor || '#1b925e',
          backgroundColor: lightenColor(item?.AccountColor || '#00A76F', 0.92),
          fontSize: { xs: 10, sm: 11 },
          height: 20,
          borderRadius: 0.5,
          fontWeight: 700,
        }}
        label={item?.AccountName || ''}
      />
    ),
    Details: (
      <Typography variant="body2" fontSize={13}>
        <CustomTooltip Placement="right" label={item?.Description}>
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
    Amount: (
      <Typography variant="light">{formatToINR(item?.Amount, isAmountVisible) || '-'}</Typography>
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
              {/* Compact Header */}
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
                  }}
                >
                  {formatToINR(item?.Amount, isAmountVisible)}
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.7rem' }}>
                    {item?.AccountName || '-'}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ flex: 'flex' }}>
                    <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                      {' '}
                      {item?.Details || '-'}
                    </Typography>
                  </Box>

                  <Box sx={{}}>
                    <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.7rem' }}>
                      {ChipFun(item.Action)}
                    </Typography>
                  </Box>
                </Box>

                {item?.Description && (
                  <Box sx={{ mt: 0.5, p: 0.5, backgroundColor: 'grey.50', borderRadius: 0.5 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: '0.6rem', pl: 1 }}
                    >
                      {item?.Description}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (list && list?.length > 0) {
    return isMobile ? (
      <MobileTransactionsGrid />
    ) : (
      <Table
        pagination={false}
        columns={columns}
        dataSource={tableSetData}
        scroll={{ x: 'max-content' }}
      />
    );
  }

  return <DataNotFound />;
};
