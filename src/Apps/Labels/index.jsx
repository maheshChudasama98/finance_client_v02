import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { sweetAlertQuestion } from 'src/utils/sweet-alerts';

import { LabelActionService, LabelsFetchListService } from 'src/Services/Meter.Services';

import SvgColor from 'src/components/svg-color';
import Loader from 'src/components/Loaders/Loader';
import { DataNotFound } from 'src/components/DataNotFound';
import { CustomCheckbox, CustomSearchInput } from 'src/components/CustomComponents';

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
      LabelActionService({ [action]: value, LabelId: id }, () => {
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
      title: '#',
      dataIndex: 'Index',
      key: 'Index',
      width: '80px',
      render: (text) => <Typography variant="">{text}</Typography>,
    },
    {
      title: 'Label',
      dataIndex: 'Label',
      key: 'Label',
      render: (text) => <Typography variant=" ">{text}</Typography>,
    },
    // {
    //   title: 'Used',
    //   dataIndex: 'Used',
    //   key: 'Used',
    // },
      {
        title: 'Active',
        dataIndex: 'Active',
        key: 'Active',
        width: '100px',
        align: 'center',
      },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      width: '100px',
    },
  ];

  const tableSetData = accountsList.map((item, index) => ({
    key: item?.LabelId,
    Index: index + 1 || '',
    Label: item?.LabelName || '',
    Color: item?.StartAmount || '-',
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
      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            {
              label: (
                <Typography
                  variant=""
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
                  variant=""
                  color="error"
                  onClick={() => {
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
  }));

  const handleRowClick = (record) => {
    console.log('Row clicked:', record);
  };

  const titleAction = (display) => {
    if (display) {
      return 'Labels';
    }
    if (editObject?.AccountId) {
      return 'Edit Label';
    }
    return 'New Label';
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
                      columns={columns}
                      dataSource={tableSetData}
                      onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                      })}
                      pagination={false}
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
