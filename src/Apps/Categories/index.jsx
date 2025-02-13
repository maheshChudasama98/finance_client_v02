import { useDispatch, } from 'react-redux';
import React, { useState, useEffect } from 'react'

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InputAdornment from '@mui/material/InputAdornment';
// import CircularProgress from '@mui/material/CircularProgress';

import { fDate } from 'src/utils/format-time';
import { sweetAlertQuestion } from 'src/utils/sweet-alerts';

import { CategoryActionService, SubCategoryActionService, CategoriesFetchListService, } from 'src/Services/Meter.Services';

import SvgColor from 'src/components/svg-color';
import Loader from 'src/components/Loaders/Loader';
import { DataNotFound } from 'src/components/DataNotFound';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { CustomTable, CustomAvatar } from 'src/components/CustomComponents';

import { Dropdown } from 'antd';

import Form from './Form';
import SubForm from './SubForm';

export default function Index() {
    const filterValue = "All";
    const dispatch = useDispatch();

    const [apiFlag, setApiFlag] = useState(false);
    const [displayFlag, setDisplayFlag] = useState(false);
    const [loadingLoader, setLoadingLoader] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [loadingSwitch, setLoadingSwitch] = useState({});
    const [subLoadingSwitch, setSubLoadingSwitch] = useState({});
    const [accountsList, setAccountsList] = useState([]);
    const [editObject, setEditObject] = useState({});
    const [subEditObject, setSubEditObject] = useState({});

    const [formaModal, setFormaModal] = useState({});

    const handleSearchKey = (e) => { setSearchValue(e.target.value); };
    const handleClear = () => { setSearchValue(''); };

    const StatusChange = (action, value, id) => {
        setLoadingSwitch((prev) => ({ ...prev, [id]: true, action }));
        dispatch(CategoryActionService({ [action]: value, CategoryId: id }, () => {
            setApiFlag(!apiFlag);
        }));
    };

    const SubStatusChange = (action, value, id) => {
        setSubLoadingSwitch((prev) => ({ ...prev, [id]: true, action }));
        dispatch(SubCategoryActionService({ [action]: value, SubCategoryId: id }, () => {
            setApiFlag(!apiFlag);
        }));
    };

    const showDisplayAction = () => {
        setDisplayFlag(!displayFlag);
        setEditObject({});
    };

    useEffect(() => {
        if (!displayFlag) {
            const payLoad = {
                SearchKey: searchValue
            }
            setLoadingLoader(true);
            dispatch(CategoriesFetchListService(payLoad, (res) => {
                if (res?.status) {
                    setLoadingLoader(false);
                    setAccountsList(res?.data?.list)
                };
            }));
        };
    }, [displayFlag, filterValue,]);


    useEffect(() => {
        if (!displayFlag) {
            const payLoad = {
                SearchKey: searchValue
            };
            dispatch(CategoriesFetchListService(payLoad, (res) => {
                if (res?.status) {
                    setAccountsList(res?.data?.list);
                    setLoadingSwitch({});
                    setSubLoadingSwitch({});
                };
            }));
        };
    }, [searchValue, apiFlag]);

    const columns = [
        { Header: '#', keyLabel: "Index", xs: 0.5, },
        { Header: 'Category', keyLabel: "CategoryName", xs: 9, },
        { Header: 'Used', keyLabel: "Used", xs: 1 },
        { Header: 'Active', keyLabel: "Active", xs: 1 },
        { Header: 'Action', keyLabel: "Action", xs: 0.5 },
    ];

    const subColumns = [
        { Header: 'Sub Category', keyLabel: "SubCategoriesName", xs: 9.5, },
        { Header: 'Used', keyLabel: "Used", xs: 1 },
        { Header: 'Active', keyLabel: "Active", xs: 1 },
        { Header: 'Action', keyLabel: "Action", xs: 0.5 },
    ];

    const tableSetData = accountsList.map((item, index) => ({
        Index: <Typography variant="normal" >{index + 1 || ''}</Typography>,
        CategoryName:
            <Stack direction="row" alignItems="center" spacing={2} >
                <CustomAvatar
                    icon={item?.Icon || ""}
                    bgColor={item?.Color || ""}
                />
                <Typography variant="normal" >
                    {item?.CategoryName}
                    <Typography variant="light" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                        <SvgColor src="/assets/icons/general/calendar.svg" sx={{ width: 18, height: 18, mr: 0.5 }} />
                        {fDate(item?.createdAt)}
                    </Typography>
                </Typography>
            </Stack>,
        StartAmount: <Typography variant="normal">{item?.StartAmount || "-"}</Typography>,
        CurrentAmount: <Typography variant="normal">{item?.CurrentAmount || "-"}</Typography>,
        MinAmount: <Typography variant="normal">{item?.MinAmount || "-"}</Typography>,
        Used: (loadingSwitch[item?.CategoryId] && loadingSwitch?.action === "isUsing") ? <ButtonLoader />
            : <Switch
                sx={{ pointerEvents: "auto" }}
                checked={item?.isUsing}
                onClick={() => StatusChange('isUsing', !item?.isUsing, item?.CategoryId)}
            />,
        Active: (loadingSwitch[item?.CategoryId] && loadingSwitch?.action === "isActive") ? <ButtonLoader />
            : <Switch
                sx={{ pointerEvents: "auto" }}
                checked={item?.isActive}
                onClick={() => StatusChange('isActive', !item?.isActive, item?.CategoryId)}
            />,
        Action: <Dropdown
            trigger={['click']}
            menu={{
                items: [
                    {
                        label: (
                            <Typography variant="normal" onClick={() => { setDisplayFlag(true); setEditObject(item); }} >
                                <Box display="flex" alignItems="center" >
                                    <SvgColor src="/assets/icons/general/pen.svg" sx={{ width: 25, height: 25, mr: 2 }} />
                                    Edit
                                </Box>
                            </Typography>
                        ),
                    },
                    {
                        label: (
                            <Typography variant="normal" color="error" onClick={() => {
                                sweetAlertQuestion().then((result) => {
                                    if (result === 'Yes') {
                                        StatusChange('isDeleted', true, item?.CategoryId)
                                    }
                                }).catch((error) => {
                                    console.error(error);
                                });
                            }} >
                                <Box display="flex" alignItems="center" justifyContent="center">
                                    <SvgColor src="/assets/icons/general/trash.svg" sx={{ width: 25, height: 25, mr: 2 }} />
                                    Delete
                                </Box>
                            </Typography >
                        ),
                    }
                ],
            }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true, }}
        >
            <IconButton size="small" sx={{ pointerEvents: "auto" }} >
                <MoreVertIcon fontSize="small" />
            </IconButton>
        </Dropdown>,
        child:
            <>
                <CustomTable
                    columns={subColumns}
                    data={item?.SubCategories?.length > 0 ?
                        item?.SubCategories?.map((subItem, i) => (
                            {
                                SubCategoriesName:
                                    <Stack direction="row" alignItems="center" spacing={2} >
                                        <CustomAvatar
                                            icon={subItem?.Icon || ""}
                                            bgColor={item?.Color || ""}
                                        />
                                        <Typography variant="normal" >
                                            {subItem?.SubCategoriesName}
                                            <Typography variant="light" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                                                <SvgColor src="/assets/icons/general/calendar.svg" sx={{ width: 18, height: 18, mr: 0.5 }} />
                                                {fDate(subItem?.createdAt)}
                                            </Typography>
                                        </Typography>
                                    </Stack>
                                ,
                                CreateAt:
                                    <Typography variant="light" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                                        <SvgColor src="/assets/icons/general/calendar.svg" sx={{ width: 18, height: 18, mr: 0.5 }} />
                                        {fDate(subItem?.createdAt)}
                                    </Typography>,
                                Used: (subLoadingSwitch[subItem?.SubCategoryId] && subLoadingSwitch?.action === "isUsing") ? <ButtonLoader />
                                    : <Switch
                                        sx={{ pointerEvents: "auto" }}
                                        checked={subItem?.isUsing}
                                        onClick={() => SubStatusChange('isUsing', !subItem?.isUsing, subItem?.SubCategoryId)}
                                    />,
                                Active: (subLoadingSwitch[subItem?.SubCategoryId] && subLoadingSwitch?.action === "isActive") ? <ButtonLoader />
                                    : <Switch
                                        sx={{ pointerEvents: "auto" }}
                                        checked={subItem?.isActive}
                                        onClick={() => SubStatusChange('isActive', !subItem?.isActive, subItem?.SubCategoryId)}
                                    />,
                                Action: <Dropdown
                                    trigger={['click']}
                                    menu={{
                                        items: [
                                            {
                                                label: (
                                                    <Typography variant="normal" onClick={() => {
                                                        setSubEditObject(subItem);
                                                        setFormaModal((prev) => ({ ...prev, [item?.CategoryId]: true }));
                                                        // setDisplayFlag(true); setEditObject(item);
                                                    }} >
                                                        <Box
                                                            display="flex"
                                                            alignItems="center" >
                                                            <SvgColor
                                                                src="/assets/icons/general/pen.svg"
                                                                sx={{ width: 25, height: 25, mr: 2 }} />
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
                                                            sweetAlertQuestion().then((result) => {
                                                                if (result === 'Yes') {
                                                                    SubStatusChange('isDeleted', true, subItem?.SubCategoryId)
                                                                }
                                                            }).catch((error) => {
                                                                console.error(error);
                                                            });
                                                        }} >
                                                        <Box
                                                            display="flex"
                                                            alignItems="center"
                                                            justifyContent="center">
                                                            <SvgColor
                                                                src="/assets/icons/general/trash.svg"
                                                                sx={{ width: 25, height: 25, mr: 2 }} />
                                                            Delete
                                                        </Box>
                                                    </Typography >
                                                ),
                                            }
                                        ],
                                    }}
                                    placement="bottomRight"
                                    arrow={{ pointAtCenter: true, }}
                                >
                                    <IconButton size="small" sx={{ pointerEvents: "auto" }} >
                                        <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                </Dropdown>,
                            }))
                        : []}
                />

                <Box sx={{
                    border: (theme) => `dashed 1px ${theme?.palette?.grey?.[400]}`,
                    p: 2,
                    my: 2,
                    borderRadius: 1.5
                }}>
                    {
                        formaModal[item?.CategoryId] ?
                            <SubForm
                                backAction={() => {
                                    setApiFlag(!apiFlag);
                                    setFormaModal((prev) => ({ ...prev, [item?.CategoryId]: false }));
                                }}
                                editObject={subEditObject}
                                CategoryId={item?.CategoryId}
                                Color={item?.Color} />
                            :
                            <Box sx={{ display: "flex", justifyContent: "end" }}>
                                <Button
                                    onClick={() => {
                                        setSubEditObject({});
                                        setFormaModal((prev) => ({ ...prev, [item?.CategoryId]: true }));
                                    }}
                                    variant="contained" color="success">Add</Button>
                            </Box>
                    }




                </Box>
            </>

    }));

    const titleAction = (display) => {
        if (display) {
            return "Categories";
        };
        if (editObject?.AccountId) {
            return "Edit Category";
        };
        return "New Category";
    };

    return (

        <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
            <Card>
                <CardHeader
                    title={titleAction(!displayFlag)}
                    sx={{ marginBottom: 2, }}
                    action={
                        <Button
                            onClick={showDisplayAction}
                            variant="contained"
                            color="success"
                            startIcon={!displayFlag ? <AddIcon /> : <ArrowBackIcon />} >
                            {!displayFlag ? "Add New" : "Back"}
                        </Button>
                    }
                />
                <Box sx={{ borderBottom: 1, borderColor: 'divider', marginX: 2 }} />

                {displayFlag ?
                    <Form backAction={showDisplayAction} editObject={editObject} />
                    :
                    <Box sx={{
                        borderRadius: 1.3,
                    }}>
                        <Box sx={{
                            marginX: 2, marginY: 2, display: "flex",
                            justifyContent: "space-between"
                        }}>

                            <Box />
                            <TextField
                                size="small"
                                label="Search"
                                name="Search"
                                value={searchValue}
                                onChange={handleSearchKey}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {searchValue && (
                                                <IconButton onClick={handleClear} edge="end" size='small'>
                                                    <AddIcon fontSize="inherit" />
                                                </IconButton>
                                            )}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        {
                            loadingLoader ?
                                <Box sx={{ display: "flex", height: "50vh" }}>
                                    <Loader />
                                </Box> :
                                <Box sx={{
                                    overflow: 'auto'
                                }}>

                                    {
                                        accountsList && accountsList?.length > 0 ?

                                            <Box sx={{
                                                marginX: 2,
                                                minWidth: '1000px',
                                                flexWrap: 'wrap'
                                            }}>
                                                <CustomTable
                                                    expanded
                                                    columns={columns}
                                                    data={tableSetData}
                                                />
                                            </Box>
                                            :
                                            <DataNotFound />}

                                </Box>
                        }
                    </Box>

                }

            </Card>
        </Box >

    )
}

Index.propTypes = {
};
