import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useAmountVisibility } from 'src/hooks/use-amount-visibility';

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
  CustomCheckbox,
  CustomSearchInput,
} from 'src/components/CustomComponents';

import { Table, Dropdown } from 'antd';

import Form from './Form';
import AnalystComponent from './Analyst';
import PerformanceComponent from './Performance';

export default function Index() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { isAmountVisible } = useAmountVisibility();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    StartAmount: (
      <Typography variant="light">
        {formatToINR(item?.StartAmount, isAmountVisible) || '-'}
      </Typography>
    ),
    CurrentAmount: (
      <Typography
        variant="light"
        sx={{
          color: item?.CurrentAmount < item?.MinAmount ? 'red' : '',
        }}
      >
        {formatToINR(item?.CurrentAmount, isAmountVisible) || '-'}
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

  const MobileGrid = () => (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {accountsList.map((item) => (
          <Grid item xs={12} sm={12} key={item?.AccountId}>
            <Box
              sx={{
                p: 2,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                backgroundColor: 'background.paper',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 2,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out',
                },
              }}
              onClick={() => selectItemAction(item?.AccountId)}
            >
              {/* Header Row: Icon/Name on left, Current Amount on right */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <CustomAvatar
                    width={48}
                    height={48}
                    iconSize={20}
                    icon={item?.Icon || ''}
                    bgColor={item?.Color || ''}
                  />
                  <Box sx={{ ml: 1, flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {item?.AccountName}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: '0.75rem' }}
                    >
                      {fDate(item?.createdAt)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ textAlign: 'right', ml: 2 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: item?.CurrentAmount < 0 ? 'error.main' : 'primary.main',
                    }}
                  >
                    {formatToINR(item?.CurrentAmount, isAmountVisible) || '-'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    Current Balance
                  </Typography>
                </Box>
              </Box>

              {/* Account Details Row */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5 }}
                  >
                    Start Amount
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {formatToINR(item?.StartAmount) || '-'}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, textAlign: 'right' }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5 }}
                  >
                    Account Type
                  </Typography>
                  <Chip
                    label={
                      item?.TypeId ? AccountTypes?.find((e) => e?.key === item?.TypeId)?.value : '-'
                    }
                    size="small"
                    sx={{
                      fontSize: 10,
                      height: 20,
                      borderRadius: 1,
                      color: 'white',
                      backgroundColor: 'success.main',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>

              {/* Additional Details Row */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: 'left' }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5 }}
                    >
                      Min Amount
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      {formatToINR(item?.MinAmount) || '-'}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1, textAlign: 'right' }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5 }}
                    >
                      Max Amount
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      {formatToINR(item?.MaxAmount) || '-'}
                    </Typography>
                  </Box>
                  {/* <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    Max Amount
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatToINR(item?.MaxAmount) || '-'}
                  </Typography> */}
                </Box>

                {item?.Description && (
                  <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'grey.50', borderRadius: 1 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5 }}
                    >
                      Description
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                      {item?.Description}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Bottom Row: Status and Actions */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pt: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomCheckbox
                    loading={loadingSwitch[item?.AccountId] && loadingSwitch?.action === 'isActive'}
                    checked={item?.isActive}
                    onClick={(e) => {
                      StatusChange('isActive', !item?.isActive, item?.AccountId);
                      e.stopPropagation();
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 1, fontSize: '0.75rem' }}
                  >
                    {item?.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDisplayFlag(true);
                      setEditObject(item);
                      setTabValue('1');
                    }}
                    sx={{
                      fontSize: '0.7rem',
                      px: 1.5,
                      py: 0.5,
                      minWidth: 'auto',
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
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
                    sx={{
                      fontSize: '0.7rem',
                      px: 1.5,
                      py: 0.5,
                      minWidth: 'auto',
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

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
              color="primary"
              size={isMobile ? 'small' : 'medium'}
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
                  mx: 2,
                  mt: 1,
                  display: { md: 'flex', xs: 'block' },
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    mt: { xs: 2, md: 0 },
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
                    sx={{ width: { xs: '100%', md: 230, lg: 230 } }}
                  />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    overflow: 'auto',
                  }}
                >
                  <Tabs
                    disableRipple
                    value={tabValue}
                    variant="scrollable"
                    scrollButtons="auto"
                    onChange={handleChange}
                  >
                    <Tab value="1" label="Details" />
                    <Tab value="2" label="Activity" />
                    <Tab value="3" label="Performance" />
                  </Tabs>
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

            {tabValue === '0' &&
              editObject.AccountId &&
              (isMobile ? (
                <MobileGrid />
              ) : (
                <Table
                  className="custom-ant-table"
                  columns={columns}
                  dataSource={tableSetData}
                  pagination={false}
                  onRow={(record) => ({
                    onClick: () => {
                      selectItemAction(record.key);
                      handleChange(null, '2');
                    },
                  })}
                />
              ))}
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
                  <>
                    {isMobile && <MobileGrid />}
                    {!isMobile && (
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
                    )}
                  </>
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
