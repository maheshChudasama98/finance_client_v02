import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
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
import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { CustomTable, CustomSearchInput } from 'src/components/CustomComponents';

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
    { Header: '#', keyLabel: 'Index', xs: 0.5 },
    { Header: 'Label', keyLabel: 'Label', xs: 2 },
    { Header: 'Color', keyLabel: 'Color', xs: 2 },
    { Header: '', keyLabel: '', xs: 5 },
    { Header: 'Used', keyLabel: 'Used', xs: 1 },
    { Header: 'Active', keyLabel: 'Active', xs: 1 },
    { Header: 'Action', keyLabel: 'Action', xs: 0.5 },
  ];

  const tableSetData = accountsList.map((item, index) => ({
    Index: <Typography variant="normal">{index + 1 || ''}</Typography>,
    Label: <Typography variant="normal">{item?.LabelName || ''}</Typography>,
    Color: <Typography variant="normal">{item?.StartAmount || '-'}</Typography>,
    Used:
      loadingSwitch[item?.LabelId] && loadingSwitch?.action === 'isUsing' ? (
        <ButtonLoader />
      ) : (
        <Switch
          checked={item?.isUsing}
          onClick={() => StatusChange('isUsing', !item?.isUsing, item?.LabelId)}
        />
      ),
    Active:
      loadingSwitch[item?.LabelId] && loadingSwitch?.action === 'isActive' ? (
        <ButtonLoader />
      ) : (
        <Switch
          checked={item?.isActive}
          onClick={() => StatusChange('isActive', !item?.isActive, item?.LabelId)}
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

  const titleAction = (display) => {
    if (display) {
      return 'Parties';
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
