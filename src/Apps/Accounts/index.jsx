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
  CustomTable,
  CustomAvatar,
  CustomCheckbox,
  CustomSearchInput,
} from 'src/components/CustomComponents';

import { Dropdown } from 'antd';

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
      AccountActionService({ [action]: value, AccountId: id }, () => {
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
    { Header: '#', keyLabel: 'Index', xs: 0.5 },
    { Header: 'Account Name', keyLabel: 'AccountName', xs: 2 },
    { Header: 'Account Type', keyLabel: 'AccountType', xs: 1.5 },
    {
      Header: 'Start Amount',
      keyLabel: 'StartAmount',
      xs: 1.5,
      className: 'custom-text-align-end',
    },
    {
      Header: 'Current Amount',
      keyLabel: 'CurrentAmount',
      xs: 1.5,
      className: 'custom-text-align-end',
    },
    { Header: 'Min Amount', keyLabel: 'MinAmount', xs: 1.5, className: 'custom-text-align-end' },
    { Header: 'Max Amount', keyLabel: 'MaxAmount', xs: 1.5, className: 'custom-text-align-end' },
    { Header: 'Used', keyLabel: 'Used', xs: 0.8 },
    { Header: 'Active', keyLabel: 'Active', xs: 0.7 },
    { Header: 'Action', keyLabel: 'Action', xs: 0.5 },
  ];

  const tableSetData = accountsList.map((item, index) => ({
    Index: <Typography variant="light">{index + 1 || ''}</Typography>,

    AccountName: (
      <Stack direction="row" alignItems="center" spacing={2}>
        <CustomAvatar
          width={45}
          height={45}
          iconSize={15}
          displayName="AC"
          icon={item?.Icon || ''}
          bgColor={item?.Color || ''}
        />
        <Typography variant="light">
          {item?.AccountName}
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
    AccountType: (
      <Typography variant="light" className="custom-truncateRight">
        {item?.TypeId ? AccountTypes?.find((e) => e?.key === item?.TypeId)?.value : ''}
      </Typography>
    ),
    StartAmount: (
      <Typography variant="light" className="custom-text-align-end custom-truncateRight">
        {formatToINR(item?.StartAmount) || '-'}
      </Typography>
    ),

    CurrentAmount: (
      <Typography variant="light" className="custom-text-align-end custom-truncateRight">
        {formatToINR(item?.CurrentAmount) || '-'}
      </Typography>
    ),

    MinAmount: (
      <Typography variant="light" className="custom-text-align-end custom-truncateRight">
        {formatToINR(item?.MinAmount) || '-'}
      </Typography>
    ),
    MaxAmount: (
      <Typography variant="light" className="custom-text-align-end custom-truncateRight ">
        {formatToINR(item?.MaxAmount) || '-'}
      </Typography>
    ),

    Used: (
      <Box
        // sx={{
        //   display: 'flex',
        //   justifyContent: 'center',
        //   alignItems: 'center',
        //   height: '100%',
        // }}
      >
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
      <Box
        // sx={{
        //   display: 'flex',
        //   justifyContent: 'center',
        //   alignItems: 'center',
        //   height: '100%',
        // }}
      >
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
                      marginX: 2,
                      minWidth: '1000px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <CustomTable columns={columns} data={tableSetData} />
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
