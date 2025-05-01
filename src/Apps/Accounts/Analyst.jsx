import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { AnalystService } from 'src/Services/AnalystData.Services';

import Scrollbar from 'src/components/scrollbar';
import { CustomFlowChart, CustomTransactions } from 'src/components/CustomComponents';

export default function Analyst({ AccountId }) {
  const dispatch = useDispatch();

  const [list, setList] = useState([]);
  const [graphList, setGraphList] = useState([]);

  useEffect(() => {
    dispatch(
      AnalystService({ AccountId }, (res) => {
        if (res.status) {
          setList(res?.data?.list);
          setGraphList(res?.data?.graphList);
        }
      })
    );
  }, [AccountId]);

  return (
    <Box>
      <Card sx={{ marginY: 2 }}>
        <CardHeader title="Over View" sx={{ marginBottom: 2 }} />
        <CustomFlowChart graphList={graphList} />
      </Card>

      <Card>
        <CardHeader title="Transactions" sx={{ marginBottom: 2 }} />
        <Scrollbar
          sx={{
            maxHeight: 500,
            '& .simplebar-content': {
              maxHeight: 500,
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <CustomTransactions list={list} />
        </Scrollbar>
      </Card>
    </Box>
  );
}

Analyst.propTypes = {};
