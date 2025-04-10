import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Unstable_Grid2';
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
import { CustomAvatar, CustomCheckbox, CustomSearchInput } from 'src/components/CustomComponents';

import { Table, Dropdown } from 'antd';

import Form from './Form';

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
  };

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
            setAccountsList(res?.data?.list);
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
        PartiesFetchListService(payLoad, (res) => {
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
      title: '#',
      dataIndex: 'Index',
      key: 'Index',
      width: 50,
      render: (_, __, index) => <Typography variant="light">{index + 1 || ''}</Typography>,
    },
    {
      title: 'Party name',
      dataIndex: 'FullName',
      key: 'FullName',
      render: (_, item) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <CustomAvatar displayName={item?.PartyAvatar} width={45} height={45} iconSize={15} />
          <Typography variant="Brijesh">
            {item?.FullName}
            <Typography
              variant="light"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <SvgColor
                src="/assets/icons/general/calendar.svg"
                sx={{ width: 18, height: 18, mr: 0.5 }}
              />
              {fDate(item?.createdAt)}
            </Typography>
          </Typography>
        </Stack>
      ),
    },
    {
      title: 'Current Amount',
      dataIndex: 'CurrentAmount',
      key: 'CurrentAmount',
      align: 'right',
      render: (value) => (
        <Typography variant="light" className="custom-text-align-end">
          {formatToINR(value) || '-'}
        </Typography>
      ),
    },
    {
      title: 'Start Amount',
      dataIndex: 'StartAmount',
      key: 'StartAmount',
      align: 'right',
      render: (value) => (
        <Typography variant="light" className="custom-text-align-end">
          {formatToINR(value) || '-'}
        </Typography>
      ),
    },
    {
      title: 'Min Amount',
      dataIndex: 'MinAmount',
      key: 'MinAmount',
      align: 'right',
      render: (value) => (
        <Typography variant="light" className="custom-text-align-end">
          {formatToINR(value) || '-'}
        </Typography>
      ),
    },
    {
      title: 'Max Amount',
      dataIndex: 'MaxAmount',
      key: 'MaxAmount',
      align: 'right',
      render: (value) => (
        <Typography variant="light" className="custom-text-align-end">
          {formatToINR(value) || '-'}
        </Typography>
      ),
    },
    // {
    //   title: 'Used',
    //   dataIndex: 'Used',
    //   key: 'Used',
    //   render: (_, item) => (
    //     <CustomCheckbox
    //       loading={loadingSwitch[item?.PartyId] && loadingSwitch?.action === 'isUsing'}
    //       checked={item?.isUsing}
    //       onClick={(e) => {
    //         StatusChange('isUsing', !item?.isUsing, item?.PartyId);
    //         e.stopPropagation();
    //       }}
    //     />
    //   ),
    // },
    {
      title: 'Active',
      dataIndex: 'Active',
      key: 'Active',
      align: 'center',
      render: (_, item) => (
        <CustomCheckbox
          loading={loadingSwitch[item?.PartyId] && loadingSwitch?.action === 'isActive'}
          checked={item?.isActive}
          onClick={(e) => {
            StatusChange('isActive', !item?.isActive, item?.PartyId);
            e.stopPropagation();
          }}
        />
      ),
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      align: 'center',
      render: (_, item) => (
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
    },
  ];

  const titleAction = (display) => {
    if (display) {
      return 'Parties';
    }
    if (editObject?.AccountId) {
      return 'Edit Party';
    }
    return 'New Party';
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
              <CustomSearchInput
                loading={loadingSearchLoader}
                searchValue={searchValue}
                callBack={setSearchValue}
              />
            </Box>

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
                {accountsList && accountsList?.length > 0 ? (
                  <Box
                    sx={{
                      // marginX: 2,
                      minWidth: '1000px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Table
                      pagination={false}
                      columns={columns}
                      dataSource={accountsList}
                      rowKey={(record) => record.PartyId}
                      expandable={{
                        expandedRowRender: (item) => (
                          <Grid container spacing={2} sx={{ alignItems: 'center', mx: 1.5 }}>
                            <Grid xs={12} sm={6}>
                              <Typography variant="big">Email</Typography>
                              <Typography variant="light">{item?.Email}</Typography>
                            </Grid>
                            <Grid xs={12} sm={6}>
                              <Typography variant="big">Phone</Typography>
                              <Typography variant="light">{item?.Phone}</Typography>
                            </Grid>
                            <Grid xs={12}>
                              <Typography variant="big">Address</Typography>
                              <Typography variant="light">{item?.Address}</Typography>
                              <Typography variant="light">
                                {item?.City} {item?.State}
                              </Typography>
                            </Grid>
                          </Grid>
                        ),
                      }}
                    />
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
