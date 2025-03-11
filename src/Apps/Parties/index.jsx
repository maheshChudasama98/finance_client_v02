import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';

import { fDate } from 'src/utils/format-time';
import { formatToINR } from 'src/utils/format-number';
import { sweetAlertQuestion } from 'src/utils/sweet-alerts';

import { PartyActionService, PartiesFetchListService } from 'src/Services/Meter.Services';

import SvgColor from 'src/components/svg-color';
import Loader from 'src/components/Loaders/Loader';
import { DataNotFound } from 'src/components/DataNotFound';
import {
  CustomTable,
  CustomAvatar,
  CustomSearchInput,
  CustomCheckbox,
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
    { Header: '#', keyLabel: 'Index', xs: 0.5 },
    { Header: 'Party name', keyLabel: 'FullName', xs: 3 },
    {
      Header: 'Start Amount',
      keyLabel: 'StartAmount',
      xs: 2,
      className: 'custom-text-align-end',
    },
    {
      Header: 'Current Amount',
      keyLabel: 'CurrentAmount',
      xs: 2,
      className: 'custom-text-align-end',
    },
    { Header: 'Min Amount', keyLabel: 'MinAmount', xs: 1.5, className: 'custom-text-align-end' },
    { Header: 'Max Amount', keyLabel: 'MaxAmount', xs: 1.5, className: 'custom-text-align-end' },
    { Header: 'Used', keyLabel: 'Used', xs: 0.5 },
    { Header: 'Active', keyLabel: 'Active', xs: 0.5 },
    { Header: 'Action', keyLabel: 'Action', xs: 0.5 },
  ];

  const tableSetData = accountsList.map((item, index) => ({
    Index: <Typography variant="normal">{index + 1 || ''}</Typography>,

    FullName: (
      <Stack direction="row" alignItems="center" spacing={2}>
        <CustomAvatar displayName={item?.PartyAvatar} width={45} height={45} iconSize={15} />
        <Typography variant="normal">
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

    StartAmount: (
      <Typography variant="normal" className="custom-text-align-end">
        {formatToINR(item?.StartAmount) || '-'}
      </Typography>
    ),
    CurrentAmount: (
      <Typography variant="normal" className="custom-text-align-end">
        {formatToINR(item?.CurrentAmount) || '-'}
      </Typography>
    ),

    MinAmount: (
      <Typography variant="normal" className="custom-text-align-end">
        {formatToINR(item?.MinAmount) || '-'}
      </Typography>
    ),
    MaxAmount: (
      <Typography variant="normal" className="custom-text-align-end">
        {formatToINR(item?.MaxAmount) || '-'}
      </Typography>
    ),
    Used: (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%', // optional, if you need to control the vertical space
        }}
      >
        <CustomCheckbox
          loading={
            loadingSwitch[item?.PartyId] && loadingSwitch?.action === 'isUsing' 
          }
          checked={item?.isUsing}
          onClick={(e) => {
            StatusChange('isUsing', !item?.isUsing, item?.PartyId);
            e.stopPropagation();
          }}
        />
      </Box>
    ),
    Active: (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CustomCheckbox
          loading={
            loadingSwitch[item?.PartyId] && loadingSwitch?.action === 'isActive'
          }
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
    child: (
      <Grid
        container
        spacing={2}
        sx={{
          alignItems: 'center',
          mx: 1.5,
        }}
      >
        <Grid xs={12} sm={6}>
          <Typography variant="h5">Email</Typography>
          <Typography variant="tableHead" color="">
            {item?.Email}
          </Typography>
        </Grid>
        <Grid xs={12} sm={6}>
          <Typography variant="h5">Phone</Typography>
          <Typography variant="tableHead" color="">
            {item?.Phone}
          </Typography>
        </Grid>
        <Grid xs={12}>
          <Typography variant="h5">Address</Typography>
          <Typography variant="tableHead" color="">
            {item?.Address}
          </Typography>
          <Typography variant="tableHead" color="">
            {item?.City} {item?.State}
          </Typography>
        </Grid>
      </Grid>
    ),
  }));

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
                      marginX: 2,
                      minWidth: '1000px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <CustomTable expanded columns={columns} data={tableSetData} />
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
