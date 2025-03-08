import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CardHeader from '@mui/material/CardHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {
  TransactionFetchListService,
  TransactionRemoveController,
} from 'src/Services/Transaction.Services';

import Loader from 'src/components/Loaders/Loader';
import { DataNotFound } from 'src/components/DataNotFound';
import { CustomSearchInput } from 'src/components/CustomComponents';

import Form from './Form';
import RecordList from './RecordList';

export default function Index() {
  const filterValue = 'All';
  const dispatch = useDispatch();

  const apiFlag = false;
  
  const [displayFlag, setDisplayFlag] = useState(false);
  const [loadingLoader, setLoadingLoader] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [transactionList, setTransactionList] = useState([]);
  const [editObject, setEditObject] = useState({});
  const [arrayObject, setArrayObject] = useState([]);

  const handleSearchKey = (e) => {
    setSearchValue(e.target.value);
  };

  const showDisplayAction = () => {
    setDisplayFlag(!displayFlag);
    setEditObject({});
  };

  useEffect(() => {
    if (!displayFlag) {
      const payLoad = {
        SearchKey: searchValue,
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
  }, [displayFlag, filterValue]);

  useEffect(() => {
    if (!displayFlag) {
      const payLoad = {
        SearchKey: searchValue,
      };
      dispatch(
        TransactionFetchListService(payLoad, (res) => {
          if (res?.status) {
            setTransactionList(res?.data?.list);
            // setLoadingSwitch({});
          }
        })
      );
    }
  }, [searchValue, apiFlag]);

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
          };
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
          <Form backAction={showDisplayAction} editObject={editObject} />
        ) : (
          <Box
            sx={{
              borderRadius: 1.3,
            }}
          >
            <Box
              sx={{
                marginX: 2,
                marginY: 2,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box />
              <CustomSearchInput callBack={handleSearchKey} />
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
                  <Box sx={{ paddingX: { xs: 0, sm: 1 } }}>
                    {arrayObject?.map((item, index) => (
                      <RecordList
                        key={index}
                        item={item}
                        index={index}
                        deleteAction={deleteAction}
                        editAction={editAction}
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
