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

import { fDate } from 'src/utils/format-time';
import { sweetAlertQuestion } from 'src/utils/sweet-alerts';

import {
  ModuleListService,
  ModuleActiveService,
  ModuleRemoveService,
} from 'src/Services/org/Org.Services';

import SvgColor from 'src/components/svg-color';
import Loader from 'src/components/Loaders/Loader';
import { DataNotFound } from 'src/components/DataNotFound';
import { CustomTable, CustomCheckbox, CustomSearchInput } from 'src/components/CustomComponents';

import { Dropdown } from 'antd';

import Form from './ModuleForm';

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

  const StatusChange = (id) => {
    setLoadingSwitch((prev) => ({ ...prev, [id]: true }));
    dispatch(
      ModuleActiveService(id, () => {
        setApiFlag(!apiFlag);
      })
    );
  };

  const DeleteAction = (id) => {
    dispatch(
      ModuleRemoveService(id, () => {
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
        ModuleListService(payLoad, (res) => {
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
        ModuleListService(payLoad, (res) => {
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
    { Header: 'Module', keyLabel: 'ModulesName', xs: 3.3 },
    { Header: 'Description', keyLabel: 'Description', xs: 3.3 },
    { Header: 'Registration', keyLabel: 'CreateAt', xs: 3.3 },
    { Header: 'Active', keyLabel: 'Active', xs: 1 },
    { Header: 'Action', keyLabel: 'Action', xs: 0.5 },
  ];

  const tableSetData = list.map((item, index) => ({
    Index: <Typography variant="light">{index + 1 || ''}</Typography>,

    ModulesName: (
      <Typography variant="light" className="">
        {item?.ModulesName || ''}
      </Typography>
    ),
    Description: (
      <Typography variant="light" className="">
        {item?.Description || ''}
      </Typography>
    ),
    CreateAt: (
      <Typography variant="light" className="">
        {fDate(item?.createdAt)}
      </Typography>
    ),
    Active: (
      <CustomCheckbox
        loading={loadingSwitch[item?.ModulesId]}
        checked={item?.isActive}
        onClick={(e) => {
          StatusChange(item?.ModulesId);
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
                          DeleteAction(item?.ModulesId);
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
      return 'Modules';
    }
    if (editObject?.ModulesId) {
      return 'Edit Module';
    }
    return 'New Module';
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
          <Form backAction={showDisplayAction} editObject={editObject} modulesList={list} />
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
