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

import {
  CategoryActionService,
  SubCategoryActionService,
  CategoriesFetchListService,
} from 'src/Services/Meter.Services';

import SvgColor from 'src/components/svg-color';
import Loader from 'src/components/Loaders/Loader';
import { DataNotFound } from 'src/components/DataNotFound';
import {
  CustomAvatar,
  CustomTooltip,
  CustomCheckbox,
  CustomSearchInput,
} from 'src/components/CustomComponents';

import { Table, Dropdown } from 'antd';

import Form from './Form';
import SubForm from './SubForm';

export default function Index() {
  const dispatch = useDispatch();

  const [apiFlag, setApiFlag] = useState(false);
  const [displayFlag, setDisplayFlag] = useState(false);
  const [loadingLoader, setLoadingLoader] = useState(false);
  const [loadingSwitch, setLoadingSwitch] = useState({});
  const [subLoadingSwitch, setSubLoadingSwitch] = useState({});
  const [accountsList, setAccountsList] = useState([]);
  const [editObject, setEditObject] = useState({});
  const [subEditObject, setSubEditObject] = useState({});
  const [formaModal, setFormaModal] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const [loadingSearchLoader, setLoadingSearchLoader] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [childExpandedRowKeys, setChildExpandedRowKeys] = useState({});

  const StatusChange = (action, value, id) => {
    setLoadingSwitch((prev) => ({ ...prev, [id]: true, action }));
    dispatch(
      CategoryActionService({ [action]: value, CategoryId: id }, () => {
        setApiFlag(!apiFlag);
      })
    );
  };

  const SubStatusChange = (action, value, id) => {
    setSubLoadingSwitch((prev) => ({ ...prev, [id]: true, action }));
    dispatch(
      SubCategoryActionService({ [action]: value, SubCategoryId: id }, () => {
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
        CategoriesFetchListService(payLoad, (res) => {
          if (res?.status) {
            setLoadingLoader(false);
            setAccountsList(res?.data?.list);
          }
        })
      );
    }
  }, [displayFlag]);

  useEffect(() => {
    if (!displayFlag) {
      setLoadingSearchLoader(true);
      const payLoad = {
        SearchKey: searchValue,
      };
      dispatch(
        CategoriesFetchListService(payLoad, (res) => {
          if (res?.status) {
            setLoadingSearchLoader(false);
            setAccountsList(res?.data?.list);
            setLoadingSwitch({});
            setSubLoadingSwitch({});
          }
        })
      );
    }
  }, [searchValue, apiFlag]);

  // const columns = [
  //   { Header: '#', keyLabel: 'Index', xs: 0.5 },
  //   { Header: 'Category', keyLabel: 'CategoryName', xs: 5 },
  //   { Header: 'Income', keyLabel: 'In', xs: 2.5 },
  //   { Header: 'Expense', keyLabel: 'Out', xs: 2.5 },
  //   // { Header: 'Used', keyLabel: 'Used', xs: 1 },
  //   { Header: 'Active', keyLabel: 'Active', xs: 1 },
  //   { Header: 'Action', keyLabel: 'Action', xs: 0.5 },
  // ];

  // const subColumns = [
  //   { Header: 'Sub Category', keyLabel: 'SubCategoriesName', xs: 5.5 },
  //   // { Header: 'Used', keyLabel: 'Used', xs: 1 },
  //   { Header: 'Income', keyLabel: 'In', xs: 2.5 },
  //   { Header: 'Expense', keyLabel: 'Out', xs: 2.5 },
  //   { Header: 'Active', keyLabel: 'Active', xs: 1 },
  //   { Header: 'Action', keyLabel: 'Action', xs: 0.5 },
  // ];

  const titleAction = (display) => {
    if (display) {
      return 'Categories';
    }
    if (editObject?.AccountId) {
      return 'Edit Category';
    }
    return 'New Category';
  };

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'CategoryName',
      key: 'CategoryName',
    },
    {
      title: 'Income',
      dataIndex: 'Income',
      key: 'Income',
      align: 'right',
      width: '15%',
    },
    {
      title: 'Expense',
      dataIndex: 'Expense',
      key: 'Expense',
      align: 'right',
      width: '15%',
    },
    {
      title: 'Active',
      dataIndex: 'Active',
      key: 'Active',
      align: 'right',
      width: '10%',
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      align: 'right',
      width: '10%',
    },
  ];

  const subColumns = [
    {
      title: 'Sub Category',
      dataIndex: 'SubCategoriesName',
      key: 'SubCategoriesName',
    },
    {
      title: 'Income',
      dataIndex: 'Income',
      key: 'Income',
      align: 'right',
      width: '15%',
    },
    {
      title: 'Expense',
      dataIndex: 'Expense',
      key: 'Expense',
      align: 'right',
      width: '15%',
    },
    {
      title: 'Active',
      dataIndex: 'Active',
      key: 'Active',
      align: 'right',
      width: '10%',
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      align: 'right',
      width: '10%',
    },
  ];

  const tableSetData = accountsList.map((item, index) => ({
    item,
    key: index,
    CategoryName: (
      <Stack direction="row" alignItems="center" spacing={2}>
        <CustomTooltip label={item.Description || ''} Placement="right">
          <CustomAvatar
            width={45}
            height={45}
            iconSize={15}
            icon={item?.Icon || ''}
            bgColor={item?.Color || ''}
          />
        </CustomTooltip>
        <Typography variant="light">
          {item?.CategoryName}
          <Typography
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', fontSize: 12 }}
          >
            {fDate(item?.createdAt)}
          </Typography>
        </Typography>
      </Stack>
    ),
    Income: (
      <Typography variant="light">
        {item?.TransactionSummary?.TotalInCome
          ? formatToINR(item?.TransactionSummary?.TotalInCome)
          : '' || ''}
      </Typography>
    ),
    Expense: (
      <Typography variant="light">
        {item?.TransactionSummary?.TotalExpense
          ? formatToINR(item?.TransactionSummary?.TotalExpense)
          : '' || ''}
      </Typography>
    ),
    Used: (
      <CustomCheckbox
        checked={item?.isUsing}
        loading={loadingSwitch[item?.CategoryId] && loadingSwitch?.action === 'isUsing'}
        onClick={(e) => {
          StatusChange('isUsing', !item?.isUsing, item?.CategoryId);
          e.stopPropagation();
        }}
      />
    ),
    Active: (
      <CustomCheckbox
        checked={item?.isActive}
        loading={loadingSwitch[item?.CategoryId] && loadingSwitch?.action === 'isActive'}
        onClick={(e) => {
          StatusChange('isActive', !item?.isActive, item?.CategoryId);
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
                          StatusChange('isDeleted', true, item?.CategoryId);
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
    child:
      item?.SubCategories?.length > 0
        ? item?.SubCategories?.map((subItem, i) => ({
            i,
            item: subItem,
            SubCategoriesName: (
              <Stack direction="row" alignItems="center" spacing={2}>
                <CustomTooltip label={subItem.Description || ''} Placement="right">
                  <CustomAvatar
                    width={{ xs: 35, md: 35, lg: 38 }}
                    height={{ xs: 35, md: 35, lg: 38 }}
                    iconSize={14}
                    icon={subItem?.Icon || ''}
                    bgColor={item?.Color || ''}
                  />
                </CustomTooltip>
                <Typography variant="light">
                  {subItem?.SubCategoriesName}
                  <Typography
                    variant="light"
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    {fDate(subItem?.createdAt)}
                  </Typography>
                </Typography>
              </Stack>
            ),
            Income: (
              <Typography variant="light">
                {subItem?.TotalInCome ? formatToINR(subItem?.TotalInCome) : '' || ''}
              </Typography>
            ),
            Expense: (
              <Typography variant="light">
                {subItem?.TotalExpense ? formatToINR(subItem?.TotalExpense) : '' || ''}
              </Typography>
            ),
            // Used: (
            //   <CustomCheckbox
            //     checked={subItem?.isUsing}
            //     loading={
            //       subLoadingSwitch[subItem?.SubCategoryId] && subLoadingSwitch?.action === 'isUsing'
            //     }
            //     onClick={(e) => {
            //       SubStatusChange('isUsing', !subItem?.isUsing, subItem?.SubCategoryId);
            //       e.stopPropagation();
            //     }}
            //   />
            // ),
            Active: (
              <CustomCheckbox
                checked={subItem?.isActive}
                loading={
                  subLoadingSwitch[subItem?.SubCategoryId] &&
                  subLoadingSwitch?.action === 'isActive'
                }
                onClick={(e) => {
                  SubStatusChange('isActive', !subItem?.isActive, subItem?.SubCategoryId);
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
                          variant="light"
                          onClick={() => {
                            setSubEditObject(subItem);
                            setFormaModal((prev) => ({ ...prev, [item?.CategoryId]: true }));
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
                                  SubStatusChange('isDeleted', true, subItem?.SubCategoryId);
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
          }))
        : [],
  }));

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
                      // minWidth: '1000px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Table
                      className="custom-ant-table"
                      columns={columns}
                      dataSource={tableSetData}
                      expandable={{
                        expandedRowRender: (record) => (
                          <Box sx={{ backgroundColor: '#eee', padding: 2 }}>
                            <Card>
                              <Form
                                backAction={showDisplayAction}
                                editObject={record?.item}
                                apiCallAction={() => {
                                  setApiFlag(!apiFlag);
                                }}
                              />
                              <Table
                                className="custom-ant-table"
                                columns={subColumns}
                                dataSource={record.child}
                                pagination={false}
                                expandable={{
                                  expandedRowKeys: childExpandedRowKeys[record.key] || [],
                                  onExpand: (expanded, subRecord) => {
                                    setChildExpandedRowKeys((prev) => {
                                      const updatedKeys = { ...prev };
                                      if (expanded) {
                                        updatedKeys[record.key] = [
                                          ...(updatedKeys[record.key] || []),
                                          subRecord.i,
                                        ];
                                      } else {
                                        updatedKeys[record.key] = (
                                          updatedKeys[record.key] || []
                                        ).filter((key) => key !== subRecord.i);
                                      }
                                      return updatedKeys;
                                    });
                                  },
                                }}
                                onRow={(subItem) => ({
                                  onClick: () => {
                                    setSubEditObject(subItem.item);
                                    setFormaModal((prev) => ({
                                      ...prev,
                                      [record?.item?.CategoryId]: true,
                                    }));
                                  },
                                })}
                              />
                              <Box
                                sx={{
                                  border: (theme) => `dashed 1px ${theme?.palette?.grey?.[400]}`,
                                  p: 2,
                                  m: 2,
                                  borderRadius: 1.5,
                                }}
                              >
                                {formaModal[record?.item?.CategoryId] ? (
                                  <SubForm
                                    backAction={() => {
                                      setApiFlag(!apiFlag);
                                      setFormaModal((prev) => ({
                                        ...prev,
                                        [record?.item?.CategoryId]: false,
                                      }));
                                    }}
                                    editObject={subEditObject}
                                    CategoryId={record?.item?.CategoryId}
                                    Color={record?.item?.Color}
                                  />
                                ) : (
                                  <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                    <Button
                                      onClick={() => {
                                        setSubEditObject({});
                                        setFormaModal((prev) => ({
                                          ...prev,
                                          [record?.item?.CategoryId]: true,
                                        }));
                                      }}
                                      variant="contained"
                                      color="success"
                                    >
                                      Add Sub Category
                                    </Button>
                                  </Box>
                                )}
                              </Box>
                            </Card>
                          </Box>
                        ),
                        rowExpandable: (record) => true,
                        expandIcon: () => null,
                        indentSize: 0,
                        expandIconColumnIndex: -1,
                      }}
                      expandedRowKeys={expandedRowKeys}
                      onExpand={(expanded, record) => {
                        setExpandedRowKeys((prev) =>
                          expanded ? [...prev, record.key] : prev.filter((key) => key !== record.key)
                        );
                      }}
                      onRow={(record) => ({
                        onClick: () => {
                          if (expandedRowKeys.includes(record.key)) {
                            setExpandedRowKeys((prev) => prev.filter((key) => key !== record.key));
                          } else {
                            setExpandedRowKeys((prev) => [...prev, record.key]);
                          }
                        },
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
