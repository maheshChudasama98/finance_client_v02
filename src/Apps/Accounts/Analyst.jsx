import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';

import { RecodeListService } from 'src/Services/AnalystData.Services';

import Loader from 'src/components/Loaders/Loader';
import { DataNotFound } from 'src/components/DataNotFound';
import {
  CustomFlowChart,
  CustomButtonGroup,
  CustomTransactions,
} from 'src/components/CustomComponents';

import PDFCreateComponent from './PDFCreate';

export default function Analyst({ AccountId }) {
  const dispatch = useDispatch();

  const [list, setList] = useState([]);
  const [graphList, setGraphList] = useState([]);
  const [loadingLoader, setLoadingLoader] = useState(false);
  const [duration, setDuration] = useState('Last_Thirty_Days');

  const [downloadFlag, setDownloadFlag] = useState(false);

  useEffect(() => {
    setLoadingLoader(true);
    dispatch(
      RecodeListService({ AccountId, Duration: duration }, (res) => {
        if (res.status) {
          setLoadingLoader(false);
          setList(res?.data?.list);
          setGraphList(res?.data?.graphList);
        }
      })
    );
  }, [AccountId, duration]);

  return (
    <Box>
      <Box sx={{ margin: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <CustomButtonGroup
          defaultValue={duration}
          onSelect={(value) => {
            setDuration(value);
          }}
        />
        <Button
          variant="contained"
          sx={{ ml: 1 }}
          color="success"
          onClick={() => setDownloadFlag(true)}
        >
          <i className="fa-solid fa-download" />
        </Button>
      </Box>

      {loadingLoader ? (
        <Box sx={{ display: 'flex', height: '50vh' }}>
          <Loader />
        </Box>
      ) : (
        <>
          {list && list?.length > 0 ? (
            <>
              <CardHeader title="Over View" sx={{ marginBottom: 2 }} />
              <CustomFlowChart graphList={graphList} />

              <CardHeader title="Transactions" sx={{ marginBottom: 2 }} />
              <CustomTransactions list={list} />
            </>
          ) : (
            <DataNotFound />
          )}
        </>
      )}
      {downloadFlag && <PDFCreateComponent list={list} setFlag={(value) => setDownloadFlag(value)} />}
    </Box>
  );
}

Analyst.propTypes = {};
