import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { AccountService } from 'src/Services/AnalystData.Services';

import OverView from './OverView';

const CustomDataFlow = ({selectedAccountId}) => {
  const dispatch = useDispatch();
  const [cashFlowData, setCashFlowData] = useState([]);

  useEffect(() => {
    dispatch(
      AccountService(
        {
          AccountId: selectedAccountId,
        },
        (res) => {
          if (res.status) {
            setCashFlowData(res?.data?.graphList);
          }
        }
      )
    );
  }, [selectedAccountId]);

  return (
    <OverView
      title={
        <Box
          sx={{
            justifyContent: 'space-between',
            display: 'flex',
          }}
        >
          <Typography variant="big">Cash Flow</Typography>
        </Box>
      }
      chart={{
        labels: cashFlowData?.length > 0 ? cashFlowData?.map((item, key) => item?.Date) : [],
        series: [
          {
            name: 'Saving Account',
            // type: 'line',
            // color: '#00A76F',
            data:
              cashFlowData?.length > 0 ? cashFlowData?.map((item, key) => item?.Count || 0) : [],
          },
        ],
      }}
    />
  );
};

export default CustomDataFlow;
