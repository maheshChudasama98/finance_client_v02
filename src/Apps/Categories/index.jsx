import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import MenuItem from '@mui/material/MenuItem';
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
  CustomSelect,
  CustomTooltip,
  CustomTabLabel,
  CustomCheckbox,
  CustomSearchInput,
} from 'src/components/CustomComponents';

import { Table, Dropdown } from 'antd';

import Form from './Form';
import AnalystComponent from './Analyst';
import SubCategoriesForm from './SubForm';
import PerformanceComponent from './Performance';

export default function Index() {
  const dispatch = useDispatch();

  const [apiFlag, setApiFlag] = useState(false);
  const [displayFlag, setDisplayFlag] = useState(false);
  const [loadingLoader, setLoadingLoader] = useState(false);

  const [editObject, setEditObject] = useState({});
  const [recodeList, setRecodesList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [loadingSwitch, setLoadingSwitch] = useState({});
  const [subLoadingSwitch, setSubLoadingSwitch] = useState({});
  const [loadingSearchLoader, setLoadingSearchLoader] = useState(false);

  const [tabValue, setTabValue] = useState('2');
  const [subEditObject, setSubEditObject] = useState({});
  const [customSubCategory, setCustomSubCategory] = useState([]);
  const [subDisplayFlag, setSubDisplayFlag] = useState(false);

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
            setRecodesList(res?.data?.list);
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
            setRecodesList(res?.data?.list);
            setLoadingSwitch({});
            setSubLoadingSwitch({});
          }
        })
      );
    }
  }, [searchValue, apiFlag]);

  const titleAction = (display) => {
    if (display) {
      return 'Categories';
    }
    if (editObject?.CategoryId) {
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
    // {
    //   title: 'Action',
    //   dataIndex: 'Action',
    //   key: 'Action',
    //   align: 'right',
    //   width: '10%',
    // },
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
    // {
    //   title: 'Active',
    //   dataIndex: 'Active',
    //   key: 'Active',
    //   align: 'right',
    //   width: '10%',
    // },
  ];

  const tableSetData = recodeList.map((item, index) => ({
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
                            // setSubEditObject(subItem);
                            // setFormaModal((prev) => ({ ...prev, [item?.CategoryId]: true }));
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

  const deleteAction = (item) => {
    sweetAlertQuestion()
      .then((result) => {
        if (result === 'Yes') {
          StatusChange('isDeleted', true, item?.CategoryId);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const showDisplayAction = () => {
    setDisplayFlag(!displayFlag);
    setEditObject({});
    setTabValue('2');
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setSubDisplayFlag(false);
  };

  const selectItemAction = (item) => {
    const key = item?.CategoryId ? item?.CategoryId : item;

    const details = recodeList?.find((e) => e?.CategoryId === key);

    setCustomSubCategory(
      details?.SubCategories?.length > 0
        ? details?.SubCategories?.map((subItem, i) => ({
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
                    bgColor={details?.Color || ''}
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
            // Action: (
            //   <Dropdown
            //     trigger={['click']}
            //     menu={{
            //       items: [
            //         {
            //           label: (
            //             <Typography
            //               variant="light"
            //               onClick={() => {
            //                 setSubEditObject(subItem);
            //                 // setFormaModal((prev) => ({ ...prev, [item?.CategoryId]: true }));
            //               }}
            //             >
            //               <Box display="flex" alignItems="center">
            //                 <SvgColor
            //                   src="/assets/icons/general/pen.svg"
            //                   sx={{ width: 25, height: 25, mr: 2 }}
            //                 />
            //                 Edit
            //               </Box>
            //             </Typography>
            //           ),
            //         },
            //         {
            //           label: (
            //             <Typography
            //               variant="light"
            //               color="error"
            //               onClick={() => {
            //                 sweetAlertQuestion()
            //                   .then((result) => {
            //                     if (result === 'Yes') {
            //                       SubStatusChange('isDeleted', true, subItem?.SubCategoryId);
            //                     }
            //                   })
            //                   .catch((error) => {
            //                     console.error(error);
            //                   });
            //               }}
            //             >
            //               <Box display="flex" alignItems="center" justifyContent="center">
            //                 <SvgColor
            //                   src="/assets/icons/general/trash.svg"
            //                   sx={{ width: 25, height: 25, mr: 2 }}
            //                 />
            //                 Delete
            //               </Box>
            //             </Typography>
            //           ),
            //         },
            //       ],
            //     }}
            //     placement="bottomRight"
            //     arrow={{ pointAtCenter: true }}
            //   >
            //     <IconButton size="small" sx={{ pointerEvents: 'auto' }}>
            //       <MoreVertIcon fontSize="small" />
            //     </IconButton>
            //   </Dropdown>
            // ),
          }))
        : []
    );

    setSubEditObject({});
    setDisplayFlag(true);
    setSubDisplayFlag(false);
    setEditObject(details);
  };

  const ListCustomList = recodeList.map((item) => (
    <MenuItem key={item?.CategoryId} value={item?.CategoryId}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar
          iconSize={8}
          width={{ xs: 25, md: 25, lg: 25 }}
          height={{ xs: 25, md: 25, lg: 25 }}
          icon={item?.Icon || ''}
          bgColor={item?.Color || ''}
        />
        <Typography variant="body2" sx={{ mx: 1 }}>
          {item?.CategoryName}
        </Typography>
      </Box>
    </MenuItem>
  ));

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
          <>
            {editObject.CategoryId && (
              <Box
                sx={{
                  margin: 2,
                  display: { sm: 'flex', xs: 'inline-block' },
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                  }}
                >
                  <Tabs
                    variant="scrollable"
                    scrollButtons="auto"
                    disableRipple
                    value={tabValue}
                    onChange={handleChange}
                  >
                    <Tab
                      value="1"
                      label={<CustomTabLabel selectValue={tabValue} label="Details" value="1" />}
                    />
                    <Tab
                      value="4"
                      label={
                        <CustomTabLabel selectValue={tabValue} label="Sub Categories" value="4" />
                      }
                    />
                    <Tab
                      value="2"
                      label={<CustomTabLabel selectValue={tabValue} label="Activity" value="2" />}
                    />
                    <Tab
                      value="3"
                      label={
                        <CustomTabLabel selectValue={tabValue} label="Performance" value="3" />
                      }
                    />
                  </Tabs>
                </Box>

                <Box sx={{ display: 'flex' }}>
                  <CustomSelect
                    size="small"
                    valueKey="CategoryId"
                    labelKey="CategoryName"
                    menuList={recodeList}
                    customMenuList={ListCustomList}
                    defaultValue={editObject?.CategoryId}
                    callBackAction={selectItemAction}
                    sx={{ width: { xs: 230, md: 230, lg: 230 } }}
                  />
                </Box>
              </Box>
            )}

            {(tabValue === '1' || !editObject.CategoryId) && (
              <Form
                backAction={showDisplayAction}
                editObject={editObject}
                deleteAction={deleteAction}
              />
            )}

            {tabValue === '2' && editObject.CategoryId && (
              <AnalystComponent CategoryId={editObject.CategoryId} />
            )}

            {tabValue === '3' && editObject.CategoryId && (
              <PerformanceComponent CategoryId={editObject.CategoryId} />
            )}

            {tabValue === '4' && editObject.CategoryId && (
              <>
                <Box
                  sx={{
                    margin: 2,
                    display: { sm: 'flex', xs: 'inline-block' },
                    justifyContent: 'end',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    onClick={() => {
                      setSubDisplayFlag(true);
                      setSubEditObject({});
                    }}
                    variant="contained"
                    color="success"
                  >
                    Add
                  </Button>
                </Box>
                {subDisplayFlag && (
                  <SubCategoriesForm
                    editObject={subEditObject}
                    Category={editObject}
                    CategoryId={editObject.CategoryId}
                    Color={editObject.Color}
                  />
                )}

                <Table
                  className="custom-ant-table"
                  columns={subColumns}
                  dataSource={customSubCategory}
                  pagination={false}
                  onRow={(subItem) => ({
                    onClick: () => {
                      setSubDisplayFlag(true);
                      setSubEditObject(subItem.item);
                    },
                  })}
                />
              </>
            )}
          </>
        ) : (
          <Box sx={{ borderRadius: 1.3 }}>
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
                <Box sx={{ m: 2 }}>
                  <CustomSearchInput
                    loading={loadingSearchLoader}
                    searchValue={searchValue}
                    callBack={setSearchValue}
                  />
                </Box>

                {recodeList && recodeList?.length > 0 ? (
                  <Table
                    className="custom-ant-table"
                    columns={columns}
                    dataSource={tableSetData}
                    pagination={false}
                    onRow={(record) => ({
                      onClick: () => {
                        selectItemAction(record?.item);
                      },
                    })}
                  />
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
