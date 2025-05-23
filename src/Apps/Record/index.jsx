import { useDispatch } from 'react-redux';
import React, { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Badge from '@mui/material/Badge';
import Popper from '@mui/material/Popper';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CardHeader from '@mui/material/CardHeader';
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
    return true; // For numbers, booleans, etc.
  };

  const count = Object.values(FilterBy).filter(hasValue).length;

  const filterHeader = (field, value) => {
    setFilterBy((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  return (
    <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
      <Card>
        <CardHeader
          title={titleAction(!displayFlag)}
          sx={{ marginBottom: 2 }}
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
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginX: 2 }} />

        {displayFlag ? (
          <Form
            backAction={showDisplayAction}
            editObject={editObject}
            deleteAction={deleteAction}
          />
        ) : (
          <Box
            sx={{
              borderRadius: 1.3,
              alignItems: 'baseline',
            }}
          >
            <Box
              sx={{
                marginX: 2,
                marginY: 2,
                display: { xs: 'block', md: 'flex' },
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <CustomSearchInput callBack={setSearchValue} />
              <Box />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',

                  marginY: { xs: 2, md: 0 },
                }}
              >
                <Box
                  sx={{
                    marginY: { xs: 2, md: 0 },
                  }}
                >
                  <CustomButtonGroup
                    defaultValue={Duration}
                    onSelect={(value) => {
                      setDuration(value);
                    }}
                  />
                </Box>

                <Badge badgeContent={count > 0 ? count : null} color="error">
                  <Button
                    ref={anchorRef}
                    size="small"
                    color="success"
                    variant="outlined"
                    onClick={handleToggle}
                    sx={{ ml: 1 }}
                    startIcon={<i className="fa-solid fa-filter" style={{ fontSize: 14 }} />}
                  >
                    Filter
                  </Button>
                </Badge>
              </Box>
              <Popper open={open} anchorEl={anchorRef.current} placement="bottom-end">
                <ClickAwayListener onClickAway={handleClickAway}>
                  <Box
                    sx={{
                      width: { xs: '80%', md: 800 },
                      borderRadius: 2,
                      boxShadow: shadows()[10],
                      backgroundColor: (theme) => theme?.palette?.success?.contrastText,
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
            </Box>

            {loadingLoader ? (
              <Box sx={{ display: 'flex', height: '50vh' }}>
                <Loader />
              </Box>
            ) : (
              <Box
                sx={{
                  marginTop: 1.5,
                }}
              >
                {/* <Box sx={{ my: 2, paddingX: { xs: 0, sm: 2 } }}></Box> */}

                {arrayObject && arrayObject?.length > 0 ? (
                  <Box sx={{ paddingX: { xs: 0, sm: 0 } }}>
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
                  <DataNotFound />
                )}
              </Box>
            )}
          </Box>
        )}
      </Card>
    </Box>
  );
}

Index.propTypes = {};
