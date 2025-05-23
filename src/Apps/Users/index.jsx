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

import { success } from 'src/theme/palette';
import { FetchUserListController } from 'src/Services/User.Services';

import SvgColor from 'src/components/svg-color';
import Loader from 'src/components/Loaders/Loader';
import { DataNotFound } from 'src/components/DataNotFound';
import { CustomAvatar, CustomCheckbox } from 'src/components/CustomComponents';

import { Table, Dropdown } from 'antd';

import UserGrid from './UserGrid';
import FormDetails from './UserForm';

export default function Index() {
  const dispatch = useDispatch();
  const [displayFlag, setDisplayFlag] = useState(false);
  const [userList, setUserList] = useState([]);
  const [editObject, setEditObject] = useState({});
  const [loadingLoader, setLoadingLoader] = React.useState(false);
  // const [loadingSwitch, setLoadingSwitch] = useState({});
  const loadingSwitch = {};

  const showDisplayAction = () => {
    setDisplayFlag(!displayFlag);
    setEditObject({});
  };

  const FetchUserList = () => {
    setLoadingLoader(true);
    dispatch(
      FetchUserListController((res) => {
        setLoadingLoader(false);
        setUserList(res?.data?.list);
      })
    );
  };

  useEffect(() => {
    if (!displayFlag) {
      FetchUserList();
    }
  }, [displayFlag]);

  const DeleteAction = () => {};

  const columns = [
    // { title: '#', dataIndex: 'Index', key: 'Index', width: '5%' },
    { title: 'User Name', dataIndex: 'UserInfo', key: 'UserInfo', width: '40%' },
    { title: 'Role Name', dataIndex: 'RoleName', key: 'RoleName', width: '30%' },
    { title: 'Registration', dataIndex: 'CreateAt', key: 'CreateAt', width: '20%' },
    { title: 'Active', dataIndex: 'Active', key: 'Active', width: '5%' },
    { title: 'Action', dataIndex: 'Action', key: 'Action', width: '5%' },
  ];

  const tableSetData = userList?.map((item, index) => ({
    key: index,
    Index: <Typography variant="light">{index + 1 || ''}</Typography>,
    UserInfo: (
      <Stack direction="row" alignItems="center" spacing={2}>
        <CustomAvatar
          displayName={item?.AvatarName}
          iconSize={15}
          width={45}
          height={45}
          bgColor={success?.main}
          photoURL={item?.ImgPath || ''}
        />
        <Typography variant="">
          {item?.FullName}
          <Typography
            variant="light"
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            {item?.Email}
          </Typography>
        </Typography>
      </Stack>
    ),
    RoleName: (
      <Typography variant="light" className="">
        {item?.RoleName || ''}
      </Typography>
    ),
    CreateAt: (
      <Typography variant="light" className="">
        {fDate(item?.createdAt)}
      </Typography>
    ),
    Active: (
      <CustomCheckbox
        loading={loadingSwitch[item?.UserId]}
        checked={item?.isActive}
        onClick={(e) => {
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
  }));

  return (
    <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
      <Card>
        <CardHeader
          title="Users"
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
        <Box
          sx={{
            borderRadius: 1.3,
            paddingTop: 2,
            paddingX: displayFlag ? 2 : 0,
          }}
        >
          {displayFlag ? (
            <FormDetails backAction={showDisplayAction} editObject={editObject} />
          ) : (
            <>
              {loadingLoader ? (
                <Box sx={{ display: 'flex', height: '50vh' }}>
                  <Loader />
                </Box>
              ) : (
                <Box
                  sx={{
                    overflowX: 'auto',
                  }}
                >
                  {userList && userList?.length > 0 ? (
                    <>
                      <Box
                        sx={{
                          display: { xs: 'none', md: 'block' },
                        }}
                      >
                        <Table
                          columns={columns}
                          dataSource={tableSetData}
                          pagination={false}
                          onRow={(record) => ({
                            onClick: () => {
                              // setSelectedAccountId(record.key); // Update selectedAccountId on row click
                            },
                          })}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: { xs: 'block', md: 'none' },
                          flexWrap: 'wrap',
                        }}
                      >
                        {userList?.map((item, key) => (
                          <UserGrid
                            key={key}
                            item={item}
                            index={key}
                            editAction={(value) => {
                              setEditObject(value);
                              setDisplayFlag(!displayFlag);
                            }}
                          />
                        ))}
                      </Box>
                    </>
                  ) : (
                    <DataNotFound />
                  )}
                </Box>
              )}
            </>
          )}
        </Box>
      </Card>
    </Box>
  );
}

Index.propTypes = {};
