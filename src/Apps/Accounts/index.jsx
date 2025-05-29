import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import MenuItem from '@mui/material/MenuItem';
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
  CustomSelect,
  CustomTabLabel,
  CustomCheckbox,
  CustomSearchInput,
} from 'src/components/CustomComponents';

import { Table, Dropdown } from 'antd';

import Form from './Form';
import AnalystComponent from './Analyst';
import PerformanceComponent from './Performance';

export default function Index() {
  const dispatch = useDispatch();

  const [apiFlag, setApiFlag] = useState(false);
  const [displayFlag, setDisplayFlag] = useState(false);
  const [loadingLoader, setLoadingLoader] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [loadingSwitch, setLoadingSwitch] = useState({});
  const [accountsList, setAccountsList] = useState([]);
  const [editObject, setEditObject] = useState({});
  const [loadingSearchLoader, setLoadingSearchLoader] = useState(false);

  const [tabValue, setTabValue] = useState('2');

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
  }, [displayFlag]);

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
    setEditObject(account);
  };

  const deleteAction = (item) => {
    sweetAlertQuestion()
      .then((result) => {
        if (result === 'Yes') {
          StatusChange('isDeleted', true, item?.AccountId);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
    setTabValue('2');
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const ListCustomList = accountsList.map((item) => (
    <MenuItem key={item?.AccountId} value={item?.AccountId}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar
          iconSize={10}
          icon={item?.Icon || ''}
          width={{ xs: 25, md: 25, lg: 25 }}
          height={{ xs: 25, md: 25, lg: 25 }}
          bgColor={item?.Color || ''}
        />
        <Typography variant="body2" sx={{ mx: 1 }}>
          {item?.AccountName}
        </Typography>
      </Box>
    </MenuItem>
  ));

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
          <>
            {editObject.AccountId && (
              <Box
                sx={{
                  margin: 2,
                  display: { sm: 'flex', xs: 'inline-block' },
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                  }}
                >
                  <Tabs
                    variant="scrollable"
                    scrollButtons="auto"
                    disableRipple
                    value={tabValue}
                    onChange={handleChange}
                  >
                    <Tab
                      value="1"
                      label={<CustomTabLabel selectValue={tabValue} label="Details" value="1" />}
                    />
                    <Tab
                      value="2"
                      label={<CustomTabLabel selectValue={tabValue} label="Activity" value="2" />}
                    />
                    <Tab
                      value="3"
                      label={
                        <CustomTabLabel selectValue={tabValue} label="Performance" value="3" />
                      }
                    />
                  </Tabs>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                  }}
                >
                  <CustomSelect
                    valueKey="AccountId"
                    labelKey="AccountName"
                    size="small"
                    menuList={accountsList}
                    defaultValue={editObject?.AccountId}
                    callBackAction={selectItemAction}
                    customMenuList={ListCustomList}
                    sx={{ width: { xs: 230, md: 230, lg: 230 } }}
                  />
                </Box>
              </Box>
            )}

            {(tabValue === '1' || !editObject.AccountId) && (
              <Form
                backAction={showDisplayAction}
                editObject={editObject}
                deleteAction={deleteAction}
              />
            )}

            {tabValue === '2' && editObject.AccountId && (
              <AnalystComponent AccountId={editObject.AccountId} />
            )}

            {tabValue === '3' && editObject.AccountId && (
              <PerformanceComponent AccountId={editObject.AccountId} />
            )}
          </>
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
    </Box>
  );
}

Index.propTypes = {};
