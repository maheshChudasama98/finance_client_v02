import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { fDate } from 'src/utils/format-time';
import { formatToINR } from 'src/utils/format-number';
import { sweetAlertQuestion } from 'src/utils/sweet-alerts';

import { AccountTypes } from 'src/constance';
import { AccountActionService, AccountsFetchListService } from 'src/Services/Meter.Services';

import SvgColor from 'src/components/svg-color';
import Loader from 'src/components/Loaders/Loader';
import { DataNotFound } from 'src/components/DataNotFound';
import {
  CustomAvatar,
  // CustomSelect,
  CustomCheckbox,
  CustomSearchInput,
} from 'src/components/CustomComponents';

import { Table, Dropdown } from 'antd';

import Form from './Form';
import Transactions from './Transactions';
import CustomDataFlow from './CustomDataFlow';

export default function Index() {
  const filterValue = 'All';
  const dispatch = useDispatch();

  const [apiFlag, setApiFlag] = useState(false);
  const [displayFlag, setDisplayFlag] = useState(false);
  const [loadingLoader, setLoadingLoader] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [loadingSwitch, setLoadingSwitch] = useState({});
  const [accountsList, setAccountsList] = useState([]);
  const [editObject, setEditObject] = useState({});
  const [loadingSearchLoader, setLoadingSearchLoader] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  const StatusChange = (action, value, id) => {
    setLoadingSwitch((prev) => ({ ...prev, [id]: true, action }));
    dispatch(
      AccountActionService({ [action]: value, AccountId: id }, () => {
        setApiFlag(!apiFlag);
      })
    );
  };

  const showDisplayAction = () => {
    setDisplayFlag(!displayFlag);
    setEditObject({});
    setSelectedAccountId(null);
  };

  useEffect(() => {
    if (!displayFlag) {
      const payLoad = {
        SearchKey: searchValue,
      };
      setLoadingLoader(true);
      dispatch(
        AccountsFetchListService(payLoad, (res) => {
          if (res?.status) {
            setLoadingLoader(false);
            setAccountsList(res?.data?.list);
          }
        })
      );
    }
  }, [displayFlag, filterValue]);

  useEffect(() => {
    if (!displayFlag) {
      setLoadingSearchLoader(true);
      const payLoad = {
        SearchKey: searchValue,
      };
      dispatch(
        AccountsFetchListService(payLoad, (res) => {
          setLoadingSearchLoader(false);
          if (res?.status) {
            setAccountsList(res?.data?.list);
            setLoadingSwitch({});
          }
        })
      );
    }
  }, [searchValue, apiFlag]);

  const columns = [
    {
      title: 'Account Name',
      dataIndex: 'AccountName',
      key: 'AccountName',
      width: '20%',
    },
    {
      title: 'Account Type',
      dataIndex: 'AccountType',
      key: 'AccountType',
      width: '30%',
    },
    {
      title: 'Current Amount',
      dataIndex: 'CurrentAmount',
      key: 'CurrentAmount',
      align: 'right',
      width: '15%',
    },
    {
      title: 'Start Amount',
      dataIndex: 'StartAmount',
      key: 'StartAmount',
      align: 'right',
      width: '15%',
    },
    {
      title: 'Active',
      dataIndex: 'Active',
      key: 'Active',
      align: 'center',
      width: '10%',
    },
    // {
    //   title: 'Action',
    //   dataIndex: 'DeleteAction',
    //   key: 'DeleteAction',
    //   align: 'right',
    //   width: '10%',
    // },
  ];

  const tableSetData = accountsList.map((item, index) => ({
    key: item?.AccountId,
    value: item,
    Index: <Typography variant="light">{index + 1 || ''}</Typography>,
    AccountName: (
      <Stack direction="row" alignItems="center" spacing={2}>
        <CustomAvatar
          width={45}
          height={45}
          iconSize={15}
          icon={item?.Icon || ''}
          bgColor={item?.Color || ''}
        />
        <Typography variant="light">
          {item?.AccountName}
          <Typography variant="registerTest" color="text.secondary">
            {fDate(item?.createdAt)}
          </Typography>
        </Typography>
      </Stack>
    ),
    AccountType: (
      <Typography variant="light" className="custom-truncateRight">
        {item?.TypeId ? AccountTypes?.find((e) => e?.key === item?.TypeId)?.value : ''}
      </Typography>
    ),
    StartAmount: <Typography variant="light">{formatToINR(item?.StartAmount) || '-'}</Typography>,
    CurrentAmount: (
      <Typography
        variant="light"
        sx={{
          color: item?.CurrentAmount < item?.MinAmount ? 'red' : '',
        }}
      >
        {formatToINR(item?.CurrentAmount) || '-'}
      </Typography>
    ),
    MinAmount: <Typography variant="light">{formatToINR(item?.MinAmount) || '-'}</Typography>,
    MaxAmount: <Typography variant="light">{formatToINR(item?.MaxAmount) || '-'}</Typography>,
    Used: (
      <Box>
        <CustomCheckbox
          loading={loadingSwitch[item?.AccountId] && loadingSwitch?.action === 'isUsing'}
          checked={item?.isUsing}
          onClick={(e) => {
            StatusChange('isUsing', !item?.isUsing, item?.AccountId);
            e.stopPropagation();
          }}
        />
      </Box>
    ),
    Active: (
      <Box>
        <CustomCheckbox
          loading={loadingSwitch[item?.AccountId] && loadingSwitch?.action === 'isActive'}
          checked={item?.isActive}
          onClick={(e) => {
            StatusChange('isActive', !item?.isActive, item?.AccountId);
            e.stopPropagation();
          }}
        />
      </Box>
    ),
    Action: (
      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            {
              label: (
                <Typography
                  variant="light"
                  onClick={() => {
                    setDisplayFlag(true);
                    setEditObject(item);
                    setSelectedAccountId(item?.AccountId); // Set AccountId dynamically
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <SvgColor
                      src="/assets/icons/general/pen.svg"
                      sx={{ width: 25, height: 25, mr: 2 }}
                    />
                    Edit
                  </Box>
                </Typography>
              ),
            },
            {
              label: (
                <Typography
                  variant="light"
                  color="error"
                  onClick={() => {
                    sweetAlertQuestion()
                      .then((result) => {
                        if (result === 'Yes') {
                          StatusChange('isDeleted', true, item?.AccountId);
                        }
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <SvgColor
                      src="/assets/icons/general/trash.svg"
                      sx={{ width: 25, height: 25, mr: 2 }}
                    />
                    Delete
                  </Box>
                </Typography>
              ),
            },
          ],
        }}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
      >
        <IconButton size="small" sx={{ pointerEvents: 'auto' }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Dropdown>
    ),
    DeleteAction: (
      <Typography
        variant="light"
        color="error"
        onClick={() => {
          sweetAlertQuestion()
            .then((result) => {
              if (result === 'Yes') {
                StatusChange('isDeleted', true, item?.AccountId);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <SvgColor src="/assets/icons/general/trash.svg" sx={{ width: 20, height: 20 }} />
        </Box>
      </Typography>
    ),
  }));

  const titleAction = (display) => {
    if (display) {
      return 'Accounts';
    }
    if (editObject?.AccountId) {
      return 'Edit Account';
    }
    return 'New Account';
  };

  const selectItemAction = (key) => {
    const account = accountsList?.find((e) => e?.AccountId === key);
    setDisplayFlag(true);
    setSelectedAccountId(key);
    setEditObject(account);
    // setHeaderTitles([
    //   { title: 'Account Name', value: accounts?.AccountName },
    //   {
    //     title: 'Account Type',
    //     value: accounts?.TypeId
    //       ? AccountTypes?.find((e) => e?.key === accounts?.TypeId)?.value
    //       : '',
    //   },
    //   { title: 'Current Amount', value: formatToINR(accounts?.CurrentAmount) },
    //   { title: 'Start Amount', value: formatToINR(accounts?.StartAmount) },
    // ]);
  };

  return (
    <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
      <Card>
        <CardHeader
          title={<>{titleAction(!displayFlag)}</>}
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
          <Box sx={{ borderRadius: 1.3 }}>
            {loadingLoader ? (
              <Box sx={{ display: 'flex', height: '50vh' }}>
                <Loader />
              </Box>
            ) : (
              <Box
                sx={{
                  overflow: 'auto',
                }}
              >
                <Box sx={{ m: 2 }}>
                  <CustomSearchInput
                    loading={loadingSearchLoader}
                    searchValue={searchValue}
                    callBack={setSearchValue}
                  />
                </Box>

                {accountsList && accountsList?.length > 0 ? (
                  <Table
                    className="custom-ant-table"
                    columns={columns}
                    dataSource={tableSetData}
                    pagination={false}
                    onRow={(record) => ({
                      onClick: () => {
                        selectItemAction(record.key);
                      },
                    })}
                  />
                ) : (
                  <DataNotFound />
                )}
              </Box>
            )}
          </Box>
        )}
      </Card>
      {selectedAccountId && (
        <Box sx={{ paddingY: 2 }}>
          <CustomDataFlow selectedAccountId={selectedAccountId} />
        </Box>
      )}
      {selectedAccountId && (
        <Card>
          <Transactions selectedAccountId={selectedAccountId} />
        </Card>
      )}
    </Box>
  );
}

Index.propTypes = {};
