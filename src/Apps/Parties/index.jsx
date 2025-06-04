import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
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

import { PartyActionService, PartiesFetchListService } from 'src/Services/Meter.Services';

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
  const [getList, setGetList] = useState([]);
  const [editObject, setEditObject] = useState({});
  const [loadingSearchLoader, setLoadingSearchLoader] = useState(false);
  const [tabValue, setTabValue] = useState('2');

  useEffect(() => {
    if (!displayFlag) {
      setLoadingSearchLoader(true);
      const payLoad = {
        SearchKey: searchValue,
      };
      setLoadingLoader(true);
      dispatch(
        PartiesFetchListService(payLoad, (res) => {
          setLoadingSearchLoader(false);
          if (res?.status) {
            setLoadingLoader(false);
            setGetList(res?.data?.list);
          }
        })
      );
    }
  }, [displayFlag]);

  useEffect(() => {
    if (!displayFlag) {
      const payLoad = {
        SearchKey: searchValue,
      };
      dispatch(
        PartiesFetchListService(payLoad, (res) => {
          if (res?.status) {
            setGetList(res?.data?.list);
            setLoadingSwitch({});
          }
        })
      );
    }
  }, [searchValue, apiFlag]);

  const columns = [
    {
      title: 'Party name',
      dataIndex: 'FullName',
      key: 'FullName',
      width: '50%',
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

  const tableSetData = getList.map((item, index) => ({
    key: item.PartyId,
    value: item,
    Index: <Typography variant="light">{index + 1 || ''}</Typography>,
    FullName: (
      <Stack direction="row" alignItems="center" spacing={2}>
        <CustomAvatar displayName={item?.PartyAvatar} width={45} height={45} iconSize={15} />
        <Typography variant="light">
          {item?.FullName}
          <Typography variant="registerTest" color="text.secondary">
            {fDate(item?.createdAt)}
          </Typography>
        </Typography>
      </Stack>
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
          loading={loadingSwitch[item?.PartyId] && loadingSwitch?.action === 'isUsing'}
          checked={item?.isUsing}
          onClick={(e) => {
            StatusChange('isUsing', !item?.isUsing, item?.PartyId);
            e.stopPropagation();
          }}
        />
      </Box>
    ),
    Active: (
      <Box>
        <CustomCheckbox
          loading={loadingSwitch[item?.PartyId] && loadingSwitch?.action === 'isActive'}
          checked={item?.isActive}
          onClick={(e) => {
            StatusChange('isActive', !item?.isActive, item?.PartyId);
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
                  onClick={(e) => {
                    e.stopPropagation();
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
                  onClick={(e) => {
                    e.stopPropagation();

                    sweetAlertQuestion()
                      .then((result) => {
                        if (result === 'Yes') {
                          StatusChange('isDeleted', true, item?.PartyId);
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
                StatusChange('isDeleted', true, item?.PartyId);
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
      return 'Parties';
    }
    if (editObject?.PartyId) {
      return 'Edit Party';
    }
    return 'New Party';
  };

  const StatusChange = (action, value, id) => {
    setLoadingSwitch((prev) => ({ ...prev, [id]: true, action }));
    dispatch(
      PartyActionService({ [action]: value, PartyId: id }, () => {
        setApiFlag(!apiFlag);
      })
    );
  };

  const showDisplayAction = () => {
    setDisplayFlag(!displayFlag);
    setEditObject({});
    setTabValue('2');
  };

  const selectItemAction = (key) => {
    const data = getList?.find((e) => e?.PartyId === key);
    setDisplayFlag(true);
    setEditObject(data);
  };

  const deleteAction = (item) => {
    sweetAlertQuestion()
      .then((result) => {
        if (result === 'Yes') {
          StatusChange('isDeleted', true, item?.PartyId);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
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
          <>
            {editObject.PartyId && (
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
                      value="0"
                      label={<CustomTabLabel selectValue={tabValue} label="Party list" value="0" />}
                    />
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
                    valueKey="PartyId"
                    labelKey="FullName"
                    size="small"
                    menuList={getList}
                    defaultValue={editObject?.PartyId}
                    callBackAction={selectItemAction}
                    sx={{ width: { xs: 230, md: 230, lg: 230 } }}
                  />
                </Box>
              </Box>
            )}

            {tabValue === '0' && editObject.PartyId && (
              <Table
                className="custom-ant-table"
                columns={columns}
                dataSource={tableSetData}
                pagination={false}
                rowKey={(record) => record.PartyId}
                onRow={(record) => ({
                  onClick: () => {
                    selectItemAction(record.key);
                    handleChange(null, '2');
                  },
                })}
              />
            )}
            {(tabValue === '1' || !editObject.PartyId) && (
              <Form
                backAction={showDisplayAction}
                editObject={editObject}
                deleteAction={deleteAction}
              />
            )}

            {tabValue === '2' && editObject.PartyId && (
              <AnalystComponent PartyId={editObject.PartyId} />
            )}

            {tabValue === '3' && editObject.PartyId && (
              <PerformanceComponent PartyId={editObject.PartyId} />
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

                {getList && getList?.length > 0 ? (
                  <Table
                    className="custom-ant-table"
                    columns={columns}
                    dataSource={tableSetData}
                    pagination={false}
                    rowKey={(record) => record.PartyId}
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
