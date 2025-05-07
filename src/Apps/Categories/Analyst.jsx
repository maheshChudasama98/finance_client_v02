import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { AnalystService } from 'src/Services/AnalystData.Services';

import Scrollbar from 'src/components/scrollbar';
import { CustomFlowChart, CustomTransactions } from 'src/components/CustomComponents';

export default function Analyst({ CategoryId }) {
  const dispatch = useDispatch();

  const [list, setList] = useState([]);
  const [graphList, setGraphList] = useState([]);

  useEffect(() => {
    dispatch(
      AnalystService({ CategoryId }, (res) => {
        if (res.status) {
          setList(res?.data?.list);
          setGraphList(res?.data?.graphList);
        }
      })
    );
  }, [CategoryId]);

  return (
    <Box>
      <Box sx={{ marginY: 2 }}>
        <CardHeader title="Over View" sx={{ marginBottom: 2 }} />
        <CustomFlowChart graphList={graphList} />
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <CardHeader title="Transactions" sx={{ marginBottom: 2 }} />
        <Scrollbar
          sx={{
            maxHeight: 500,
          }}
        >
          <CustomTransactions list={list} />
        </Scrollbar>
      </Box>
    </Box>
  );
}

Analyst.propTypes = {};
