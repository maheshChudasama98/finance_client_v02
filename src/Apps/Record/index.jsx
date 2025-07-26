import { useDispatch } from 'react-redux';
import React, { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Badge from '@mui/material/Badge';
import Popper from '@mui/material/Popper';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { shadows } from 'src/theme/shadows';
import {
  TransactionFetchListService,
  TransactionRemoveController,
} from 'src/Services/Transaction.Services';

import Loader from 'src/components/Loaders/Loader';
import { DataNotFound } from 'src/components/DataNotFound';
import { CustomSearchInput, CustomButtonGroup } from 'src/components/CustomComponents';

import Form from './Form';
import RecordPDF from './RecordPDF';
import RecordList from './RecordList';
import FilterComponent from './FilterComponent';

export default function Index() {
  const dispatch = useDispatch();

  const [displayFlag, setDisplayFlag] = useState(false);
  const [loadingLoader, setLoadingLoader] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [transactionList, setTransactionList] = useState([]);
  const [editObject, setEditObject] = useState({});
  const [arrayObject, setArrayObject] = useState([]);
  const [FilterBy, setFilterBy] = useState({});
  const [Duration, setDuration] = useState('Last_Thirty_Days');
  const [downloadFlag, setDownloadFlag] = useState(false);

  const showDisplayAction = () => {
    setDisplayFlag(!displayFlag);
    setEditObject({});
  };

  useEffect(() => {
    if (!displayFlag) {
      const payLoad = {
        SearchKey: searchValue,
        FilterBy,
        Duration,
      };
      setLoadingLoader(true);
      dispatch(
        TransactionFetchListService(payLoad, (res) => {
          if (res?.status) {
            setLoadingLoader(false);
            setTransactionList(res?.data?.list);
          }
        })
      );
    }
  }, [displayFlag, FilterBy, Duration]);

  useEffect(() => {
    const payLoad = {
      SearchKey: searchValue,
      FilterBy,
      Duration,
    };
    dispatch(
      TransactionFetchListService(payLoad, (res) => {
        if (res?.status) {
          setTransactionList(res?.data?.list);
          // setLoadingSwitch({});
        }
      })
    );
  }, [searchValue]);

  const titleAction = (display) => {
    if (display) {
      return 'Transaction List';
    }
    if (editObject?.TransactionId) {
      return 'Edit Transaction';
    }
    return 'New Transaction';
  };

  useEffect(() => {
    const groupedByDate = transactionList.reduce((acc, item) => {
      let dateGroup = acc.find((group) => group.date === item.Date);

      if (!dateGroup) {
        dateGroup = { date: item.Date, totalIn: 0, totalOut: 0, dayTotal: 0, records: [] };
        acc.push(dateGroup);
      }

      const amount = parseFloat(item.Amount);
      if (item.Action === 'In') {
        dateGroup.totalIn += amount;
      } else if (item.Action === 'Out') {
        dateGroup.totalOut += amount;
      }

      dateGroup.dayTotal = dateGroup.totalIn - dateGroup.totalOut;
      dateGroup.records.push(item);
      return acc;
    }, []);

    setArrayObject(groupedByDate);
  }, [transactionList]);

  const deleteAction = (record) => {
    dispatch(
      TransactionRemoveController(record?.TransactionId, (res) => {
        if (res?.status) {
          const payLoad = {
            SearchKey: searchValue,
            Duration,
          };
          setDisplayFlag(false);
          setLoadingLoader(true);
          dispatch(
            TransactionFetchListService(payLoad, (resp) => {
              if (resp?.status) {
                setLoadingLoader(false);
                setTransactionList(resp?.data?.list);
              }
            })
          );
        }
      })
    );
  };

  const editAction = (record) => {
    setEditObject(record);
    setDisplayFlag(true);
  };

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const hasValue = (value) => {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  };

  const count = Object.values(FilterBy).filter(hasValue).length;

  const filterHeader = (field, value) => {
    setFilterBy((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Calculate summary totals
  const summaryTotals = arrayObject.reduce(
    (acc, item) => {
      acc.totalIn += item.totalIn;
      acc.totalOut += item.totalOut;
      acc.netTotal += item.dayTotal;
      return acc;
    },
    { totalIn: 0, totalOut: 0, netTotal: 0 }
  );

  return (
    <Box sx={{ paddingX: { xs: 1, sm: 2 } }}>
      <Card sx={{ borderRadius: 2, boxShadow: "none" }}>
        <CardHeader
          title={
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {titleAction(!displayFlag)}
            </Typography>
          }
          sx={{ 
            marginBottom: 1,
            paddingX: { xs: 2, sm: 3 },
            paddingY: 2
          }}
          action={
            <Button
              onClick={showDisplayAction}
              variant="contained"
              color="success"
              startIcon={!displayFlag ? <AddIcon /> : <ArrowBackIcon />}
            >
              {!displayFlag ? 'Add New' : 'Back'}
            </Button>
          }
        />

        {displayFlag ? (
          <Form
            backAction={showDisplayAction}
            editObject={editObject}
            deleteAction={deleteAction}
          />
        ) : (
          <Box>
            {/* Summary Cards */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                gap: 2,
                paddingX: { xs: 2, sm: 3 },
                paddingY: 2,
                // backgroundColor: (theme) => theme.palette.grey[50],
                borderBottom: 1,
                borderColor: 'divider'
              }}
            >
              <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#e8f5e8' }}>
                <Typography variant="body2" color="text.secondary">
                  Total In
                </Typography>
                <Typography variant="h6" color="success.main" sx={{ fontWeight: 700 }}>
                  ₹{summaryTotals.totalIn.toLocaleString()}
                </Typography>
              </Card>
              
              <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#ffeaea' }}>
                <Typography variant="body2" color="text.secondary">
                  Total Out
                </Typography>
                <Typography variant="h6" color="error.main" sx={{ fontWeight: 700 }}>
                  ₹{summaryTotals.totalOut.toLocaleString()}
                </Typography>
              </Card>
              
              <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#f0f8ff' }}>
                <Typography variant="body2" color="text.secondary">
                  Net Total
                </Typography>
                <Typography 
                  variant="h6" 
                  color={summaryTotals.netTotal >= 0 ? 'success.main' : 'error.main'} 
                  sx={{ fontWeight: 700 }}
                >
                  ₹{summaryTotals.netTotal.toLocaleString()}
                </Typography>
              </Card>
            </Box>

            {/* Search and Filter Section */}
            <Box
              sx={{
                paddingX: { xs: 2, sm: 3 },
                paddingY: 2,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                alignItems: { xs: 'stretch', md: 'center' },
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <CustomSearchInput callBack={setSearchValue} />
              </Box>
              
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1,
                  alignItems: { xs: 'stretch', sm: 'center' }
                }}
              >
                <CustomButtonGroup
                  defaultValue={Duration}
                  onSelect={(value) => {
                    setDuration(value);
                  }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<i className="fa-solid fa-download" style={{ fontSize: 14 }} />}
                  onClick={() => setDownloadFlag(true)}
                  disabled={loadingLoader || arrayObject.length === 0}
                >
                  Download PDF
                </Button>

                <Badge badgeContent={count > 0 ? count : null} color="error">
                  <Button
                    ref={anchorRef}
                    size="small"
                    color="success"
                    variant="outlined"
                    onClick={handleToggle}
                    // sx={{ ml: 1 }}
                    startIcon={<i className="fa-solid fa-filter" style={{ fontSize: 14 }} />}
                  >
                    Filter
                  </Button>
                </Badge>
              </Box>
            </Box>

            <Popper open={open} anchorEl={anchorRef.current} placement="bottom-end">
              <ClickAwayListener onClickAway={handleClickAway}>
                <Box
                  sx={{
                    width: { xs: '90vw', sm: 600, md: 800 },
                    maxWidth: '90vw',
                    borderRadius: 2,
                    boxShadow: shadows()[10],
                    backgroundColor: (theme) => theme?.palette?.success?.contrastText,
                    zIndex: 1300
                  }}
                >
                  <FilterComponent
                    defaultValue={FilterBy}
                    backAction={(e) => {
                      setFilterBy(e);
                      handleClickAway();
                    }}
                  />
                </Box>
              </ClickAwayListener>
            </Popper>

            {/* Content Area */}
            {loadingLoader ? (
              <Box sx={{ display: 'flex', height: '50vh', alignItems: 'center', justifyContent: 'center' }}>
                <Loader />
              </Box>
            ) : (
              <Box sx={{ paddingX: { xs: 1, sm: 2 } }}>
                {arrayObject && arrayObject?.length > 0 ? (
                  <Box>
                    {arrayObject?.map((item, index) => (
                      <RecordList
                        key={index}
                        item={item}
                        index={index}
                        deleteAction={deleteAction}
                        editAction={editAction}
                        filterHeader={filterHeader}
                      />
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ py: 8 }}>
                    <DataNotFound />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}

        {/* PDF Download Component */}
        {downloadFlag && (
          <RecordPDF
            transactionList={transactionList}
            FilterBy={FilterBy}
            Duration={Duration}
            searchValue={searchValue}
            setFlag={setDownloadFlag}
          />
        )}
      </Card>
    </Box>
  );
}

Index.propTypes = {};
