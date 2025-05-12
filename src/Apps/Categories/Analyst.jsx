import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { RecodeListService } from 'src/Services/AnalystData.Services';

import Loader from 'src/components/Loaders/Loader';
import {
  CustomFlowChart,
  CustomButtonGroup,
  CustomTransactions,
} from 'src/components/CustomComponents';

export default function Analyst({ CategoryId }) {
  const dispatch = useDispatch();

  const [list, setList] = useState([]);
  const [graphList, setGraphList] = useState([]);
  const [loadingLoader, setLoadingLoader] = useState(false);
  const [duration, setDuration] = useState('Last_Thirty_Days');

  useEffect(() => {
    setLoadingLoader(true);
    dispatch(
      RecodeListService({ CategoryId, Duration: duration }, (res) => {
        if (res.status) {
          setLoadingLoader(false);
          setList(res?.data?.list);
          setGraphList(res?.data?.graphList);
        }
      })
    );
  }, [CategoryId, duration]);

  return (
    <Box>
      <Box sx={{ marginY: 2,marginX: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <CustomButtonGroup
          defaultValue={duration}
          onSelect={(value) => {
            setDuration(value);
          }}
        />
      </Box>

      <Box sx={{ marginY: 2 }}>
        <CardHeader title="Over View" sx={{ marginBottom: 2 }} />
        {loadingLoader ? (
          <Box sx={{ display: 'flex', height: '50vh' }}>
            <Loader />
          </Box>
        ) : (
          <CustomFlowChart graphList={graphList} />
        )}
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <CardHeader title="Transactions" sx={{ marginBottom: 2 }} />
        {loadingLoader ? (
          <Box sx={{ display: 'flex', height: '50vh' }}>
            <Loader />
          </Box>
        ) : (
          <CustomTransactions list={list} />
        )}
      </Box>
    </Box>
  );
}

Analyst.propTypes = {};
