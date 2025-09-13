import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { fDate } from 'src/utils/format-time';
import { sweetAlertQuestion } from 'src/utils/sweet-alerts';

import { LabelActionService, LabelsFetchListService } from 'src/Services/Meter.Services';

import Loader from 'src/components/Loaders/Loader';
import { DataNotFound } from 'src/components/DataNotFound';
import { CustomCheckbox, CustomSearchInput } from 'src/components/CustomComponents';

import { Table } from 'antd';

import Form from './Form';

export default function Index() {
  const filterValue = 'All';
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      LabelActionService({ [action]: value, LabelId: id }, () => {
        setApiFlag(!apiFlag);
        setDisplayFlag(false);
      })
    );
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
      setLoadingSearchLoader(true);
      setLoadingLoader(true);
      dispatch(
        LabelsFetchListService(payLoad, (res) => {
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
        LabelsFetchListService(payLoad, (res) => {
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
      title: 'Label',
      dataIndex: 'Label',
      key: 'Label',
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      align: 'right',
      width: '15%',
    },
  ];

  const tableSetData = accountsList.map((item, index) => ({
    item,
    key: item?.LabelId,
    Index: index + 1 || '',
    Label: (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1rem' }}>
            {item?.LabelName || '-'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            {fDate(item?.createdAt)}
          </Typography>
        </Box>
      </Box>
    ),
    Used: (
      <CustomCheckbox
        checked={item?.isUsing}
        loading={loadingSwitch[item?.LabelId] && loadingSwitch?.action === 'isUsing'}
        onClick={(e) => {
          StatusChange('isUsing', !item?.isUsing, item?.LabelId);
          e.stopPropagation();
        }}
      />
    ),
    Active: (
      <CustomCheckbox
        checked={item?.isActive}
        loading={loadingSwitch[item?.LabelId] && loadingSwitch?.action === 'isActive'}
        onClick={(e) => {
          StatusChange('isActive', !item?.isActive, item?.LabelId);
          e.stopPropagation();
        }}
      />
    ),
    Action: (
      <Box sx={{ display: 'inline-flex', gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            setDisplayFlag(true);
            setEditObject(item);
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
                  StatusChange('isDeleted', true, item?.LabelId);
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
    ),
  }));

  const handleRowClick = (record) => {
    setDisplayFlag(true);
    setEditObject(record?.item);
  };

  const titleAction = (display) => {
    if (display) {
      return 'Labels';
    }
    if (editObject?.LabelId) {
      return 'Edit Label';
    }
    return 'New Label';
  };
  const DeletedAction = (item) => {
    sweetAlertQuestion()
      .then((result) => {
        if (result === 'Yes') {
          StatusChange('isDeleted', true, item?.LabelId);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const MobileGrid = () => (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {accountsList.map((item) => (
          <Grid item xs={12} sm={12} key={item?.LabelId}>
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
                  boxShadow: 1,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out',
                },
              }}
              onClick={() => {
                setDisplayFlag(true);
                setEditObject(item);
              }}
            >
              {/* Header Row: Label Name and Status */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                    {item?.LabelName || '-'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    {fDate(item?.createdAt)}
                  </Typography>
                </Box>
              </Box>

              {/* Financial Summary Row */}
              {/* <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5 }}
                  >
                    Income
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: 'success.main', fontSize: '0.8rem' }}
                  >
                    ₹{item?.In || '0'}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, textAlign: 'right' }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5 }}
                  >
                    Expense
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: 'error.main', fontSize: '0.8rem' }}
                  >
                    ₹{item?.Out || '0'}
                  </Typography>
                </Box>
              </Box> */}

              {/* Usage Status Row */}
              {/* <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5 }}
                  >
                    Usage Status
                  </Typography>
                  <CustomCheckbox
                    loading={loadingSwitch[item?.LabelId] && loadingSwitch?.action === 'isUsing'}
                    checked={item?.isUsing}
                    onClick={(e) => {
                      StatusChange('isUsing', !item?.isUsing, item?.LabelId);
                      e.stopPropagation();
                    }}
                  />
                </Box>

                <Box sx={{ flex: 1, textAlign: 'right' }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5 }}
                  >
                    Status
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.7rem',
                      color: item?.isActive ? 'success.main' : 'error.main',
                      fontWeight: 600,
                    }}
                  >
                    {item?.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                </Box>
              </Box> */}

              {/* Bottom Row: Actions */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pt: 1.5,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomCheckbox
                    loading={loadingSwitch[item?.LabelId] && loadingSwitch?.action === 'isActive'}
                    checked={item?.isActive}
                    onClick={(e) => {
                      StatusChange('isActive', !item?.isActive, item?.LabelId);
                      e.stopPropagation();
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDisplayFlag(true);
                      setEditObject(item);
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
                            StatusChange('isDeleted', true, item?.LabelId);
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
          sx={{
            marginBottom: 2,
            // paddingX: { xs: 2, sm: 3 },
            // paddingY: 2,
          }}
          action={
            <Button
              onClick={showDisplayAction}
              variant="contained"
              color="success"
              size={isMobile ? 'small' : 'medium'}
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
            deletedAction={DeletedAction}
          />
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
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: { xs: 2, sm: 0 },
              }}
            >
              <CustomSearchInput
                loading={loadingSearchLoader}
                searchValue={searchValue}
                callBack={setSearchValue}
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  minWidth: { xs: '100%', sm: 300 },
                }}
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
                  <>
                    {isMobile && <MobileGrid />}
                    {!isMobile && (
                      <Box
                        sx={{
                          flexWrap: 'wrap',
                        }}
                      >
                        <Table
                          className="custom-ant-table"
                          columns={columns}
                          dataSource={tableSetData}
                          onRow={(record) => ({
                            onClick: () => {
                              handleRowClick(record);
                            },
                          })}
                          pagination={false}
                        />
                      </Box>
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
