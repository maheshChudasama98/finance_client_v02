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
import { sweetAlertQuestion } from 'src/utils/sweet-alerts';

import {
  BranchListService,
  BranchActiveService,
  BranchRemoveService,
} from 'src/Services/org/Org.Services';

import SvgColor from 'src/components/svg-color';
import Loader from 'src/components/Loaders/Loader';
import { DataNotFound } from 'src/components/DataNotFound';
import { CustomAvatar, CustomCheckbox, CustomSearchInput } from 'src/components/CustomComponents';

import { Table, Dropdown } from 'antd';

import Form from './BranchForm';

export default function Index() {
  const filterValue = 'All';
  const dispatch = useDispatch();

  const [apiFlag, setApiFlag] = useState(false);
  const [displayFlag, setDisplayFlag] = useState(false);
  const [loadingLoader, setLoadingLoader] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [loadingSwitch, setLoadingSwitch] = useState({});
  const [list, setList] = useState([]);
  const [editObject, setEditObject] = useState({});
  const [loadingSearchLoader, setLoadingSearchLoader] = useState(false);

  const StatusChange = (action, value, id) => {
    setLoadingSwitch((prev) => ({ ...prev, [id]: true, action }));
    dispatch(
      BranchActiveService(id, () => {
        setApiFlag(!apiFlag);
      })
    );
  };

  const DeleteAction = (id) => {
    dispatch(
      BranchRemoveService(id, () => {
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
      setLoadingLoader(true);
      dispatch(
        BranchListService(payLoad, (res) => {
          if (res?.status) {
            setLoadingLoader(false);
            setList(res?.data?.list);
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
        BranchListService(payLoad, (res) => {
          setLoadingSearchLoader(false);
          if (res?.status) {
            setList(res?.data?.list);
            setLoadingSwitch({});
          }
        })
      );
    }
  }, [searchValue, apiFlag]);

  const columns = [
    { Header: '#', keyLabel: 'Index', xs: 0.5 },
    { Header: 'Branch Name', keyLabel: 'BranchName', xs: 2.5 },
    { Header: 'Org Name', keyLabel: 'OrgName', xs: 2.5 },
    { Header: 'Registration', keyLabel: 'CreateAt', xs: 2.5 },
    { Header: 'Branch Users', keyLabel: 'TotalUser', xs: 2.5 },
    { Header: 'Active', keyLabel: 'Active', xs: 1 },
    { Header: '', keyLabel: 'Action', xs: 0.5 },
  ];

  const subColumns = [
    { Header: 'User Name', keyLabel: 'BranchName', xs: 6 },
    { Header: 'Registration', keyLabel: 'CreateAt', xs: 6 },
  ];

  const tableSetData = list.map((item, index) => ({
    Index: <Typography variant="light">{index + 1 || ''}</Typography>,
    BranchName: (
      <Stack direction="row" alignItems="center" spacing={2}>
        <CustomAvatar
          width={45}
          height={45}
          iconSize={15}
          icon={'fa-solid fa-sitemap' || ''}
          bgColor="#05a972"
          photoURL={item?.ImgPath || ''}
        />
        <Typography variant="light">{item?.BranchName}</Typography>
      </Stack>
    ),
    OrgName: (
      <Typography variant="light" className="">
        {item?.OrgName || ''}
      </Typography>
    ),
    TotalUser: (
      <Typography variant="light" className="">
        {item?.TotalUser || ''}
      </Typography>
    ),
    CreateAt: (
      <Typography variant="light" className="">
        {fDate(item?.createdAt)}
      </Typography>
    ),
    Active: (
      <CustomCheckbox
        loading={loadingSwitch[item?.BranchId] && loadingSwitch?.action === 'isActive'}
        checked={item?.isActive}
        onClick={(e) => {
          StatusChange('isActive', !item?.isActive, item?.BranchId);
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
                          DeleteAction(item?.BranchId);
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
    child: (
      <>
        <Table
          pagination={false}
          columns={subColumns.map((col) => ({
            title: col.Header,
            dataIndex: col.keyLabel,
            key: col.keyLabel,
            width: col.xs * 100, // Adjust width based on xs value
          }))}
          dataSource={
            item?.UserList?.length > 0
              ? item?.UserList?.map((subItem, i) => ({
                  BranchName: (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <CustomAvatar
                        width={45}
                        height={45}
                        iconSize={15}
                        bgColor="#05a972"
                        photoURL={subItem?.ImgPath || ''}
                        displayName={subItem?.AvatarName || ''}
                      />
                      <Typography variant="light">{subItem?.FullName}</Typography>
                    </Stack>
                  ),
                  CreateAt: (
                    <Typography variant="light" sx={{ display: 'flex', alignItems: 'center' }}>
                      {fDate(subItem?.createdAt)}
                    </Typography>
                  ),
                }))
              : []
          }
          rowKey={(record) => record.BranchName}
        />
        {!item?.UserList?.length > 0 && <DataNotFound />}
      </>
    ),
  }));

  const titleAction = (display) => {
    if (display) {
      return 'Branches';
    }
    if (editObject?.BranchId) {
      return 'Edit Branch';
    }
    return 'New Branch';
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
                {list && list?.length > 0 ? (
                  <Box
                    sx={{
                      // marginX: 2,
                      minWidth: '1000px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Table
                      columns={columns.map((col) => ({
                        title: col.Header,
                        dataIndex: col.keyLabel,
                        key: col.keyLabel,
                        width: col.xs * 100, // Adjust width based on xs value
                      }))}
                      pagination={false}
                      dataSource={tableSetData}
                      expandable={{
                        expandedRowRender: (record) => record.child,
                      }}
                      rowKey={(record) => record.Index}
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
