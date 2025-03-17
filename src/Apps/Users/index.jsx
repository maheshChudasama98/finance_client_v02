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

import { FetchUserListController } from 'src/Services/User.Services';

import SvgColor from 'src/components/svg-color';
import Loader from 'src/components/Loaders/Loader';
import { ModalDialog } from 'src/components/model/index';
import { DataNotFound } from 'src/components/DataNotFound';
import { CustomTable, CustomAvatar, CustomCheckbox } from 'src/components/CustomComponents';

import { Dropdown } from 'antd';

import UserGrid from './UserGrid';
import FormDetails from './UserForm';

export default function Index() {
  const dispatch = useDispatch();
  const [displayFlag, setDisplayFlag] = useState(false);
  const [userList, setUserList] = useState([]);
  const [editObject, setEditObject] = useState({});
  const [open, setOpen] = useState(false);
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
    { Header: '#', keyLabel: 'Index', xs: 0.5 },
    { Header: 'User Name', keyLabel: 'UserInfo', xs: 4 },
    { Header: 'Role Name', keyLabel: 'RoleName', xs: 3 },
    { Header: 'Registration', keyLabel: 'CreateAt', xs: 3 },
    { Header: 'Active', keyLabel: 'Active', xs: 1 },
    { Header: 'Action', keyLabel: 'Action', xs: 0.5 },
  ];

  const tableSetData = userList?.map((item, index) => ({
    Index: <Typography variant="light">{index + 1 || ''}</Typography>,

    UserInfo: (
      <Stack direction="row" alignItems="center" spacing={2}>
        <CustomAvatar
          displayName={item?.AvatarName}
          //   width={60}
          //   height={60}
          iconSize={15}
          bgColor="#05a972"
          photoURL={item?.ImgPath || ''}
        />
        <Typography variant="normal">
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
          //   StatusChange(item?.UserId);
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
                  variant="normal"
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
                  variant="normal"
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
            paddingY: 2,
            paddingX: 2,
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
                    marginTop: 1.5,
                    overflowY: 'hidden',
                    overflowX: 'auto',
                  }}
                >
                  {userList && userList?.length > 0 ? (
                    <>
                      <Box
                        sx={{
                          display: { xs: 'none', md: 'block' },
                          minWidth: '1000px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <CustomTable columns={columns} data={tableSetData} />
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

      <ModalDialog
        title="Delete"
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
      >
        <Box sx={{ minWidth: 500 }}>
          <Typography variant="big">Are you sure want to delete?</Typography>

          <Box
            sx={{
              mt: 2,
              textAlign: 'end',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <Button onClick={DeleteAction} variant="contained" color="error">
              Delete
            </Button>
            <Button
              sx={{ marginX: 1 }}
              onClick={() => {
                setOpen(false);
              }}
              variant="outlined"
              color="CancelButton"
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Box>
  );
}

Index.propTypes = {};
