import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

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

export default function Performance({ PartyId }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [list, setList] = useState([]);
  const [loadingLoader, setLoadingLoader] = useState(false);
  const [duration, setDuration] = useState('MONTH');
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  useEffect(() => {
    setLoadingLoader(true);
    dispatch(
      PerformanceService({ PartyId, Duration: duration }, (res) => {
        if (res.status) {
          setLoadingLoader(false);
          setList(res?.data?.list);
          setExpandedRowKeys([]);
        }
      })
    );
  }, [PartyId, duration]);

  const tableSetData = list?.map((item, index) => ({
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
  const handleExpand = (expanded, record) => {
    setExpandedRowKeys(
      (prev) =>
        expanded
          ? [...prev, record.key] // Add to list
          : prev.filter((key) => key !== record.key) // Remove from list
    );
  };

  const MobilePerformanceAccordion = () => (
    <Box sx={{ p: 1 }}>
      {list?.map((item, index) => (
        <Accordion
          key={index}
          sx={{
            mb: 1,
            '&:before': { display: 'none' },
            boxShadow: 'none',
            border: '1px solid ',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: 'background.paper',
              '& .MuiAccordionSummary-content': {
                margin: 0,
              },
              borderRadius: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                pr: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {item?.duration}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.6rem', display: 'block' }}
                  >
                    Income
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                    {formatToINR(item?.totalIn) || '-'}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.6rem', display: 'block' }}
                  >
                    Expense
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                    {formatToINR(item?.totalOut) || '-'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails sx={{ background: 'background.neutral' }}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                color="text.primary"
                sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}
              >
                Financial Summary
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.7rem', display: 'block' }}
                  >
                    Credit
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                    {formatToINR(item?.totalCredit) || '-'}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.7rem', display: 'block' }}
                  >
                    Debit
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                    {formatToINR(item?.totalDebit) || '-'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {item?.child && (
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}
                >
                  Sub-transactions
                </Typography>
                <Box sx={{ maxHeight: '500px', overflow: 'auto' }}>
                  <CustomTransactions list={item.child} flag />
                </Box>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  return (
    <Box>
      <Box
        sx={{
          placeSelf: 'end',
          m: { xs: 1, sm: 2 },
          mx: { xs: 1, sm: 2 },
          display: 'flex',
          justifyContent: { xs: 'center', sm: 'flex-end' },
        }}
      >
        <CustomSelect
          valueKey="Key"
          labelKey="Value"
          size="small"
          sx={{
            width: { xs: '100%', sm: 120 },
            placeItems: 'end',
          }}
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
            <>
              {isMobile && <MobilePerformanceAccordion />}
              {!isMobile && (
                <Box sx={{ overflow: 'auto' }}>
                  <Table
                    columns={columns}
                    dataSource={tableSetData}
                    pagination={false}
                    expandable={{
                      expandedRowKeys,
                      onExpand: handleExpand,
                      expandedRowRender: (record) => record.child,
                    }}
                    scroll={{ x: 'max-content' }}
                    className="custom-ant-table"
                  />
                </Box>
              )}
            </>
          ) : (
            <DataNotFound />
          )}
        </>
      )}
    </Box>
  );
}

Performance.propTypes = {};
