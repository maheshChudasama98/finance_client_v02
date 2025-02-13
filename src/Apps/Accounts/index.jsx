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

import { AccountActionService, AccountsFetchListService } from 'src/Services/Meter.Services';

import SvgColor from 'src/components/svg-color';
import Loader from 'src/components/Loaders/Loader';
import { DataNotFound } from 'src/components/DataNotFound';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { CustomTable, CustomAvatar } from 'src/components/CustomComponents';

import { Dropdown } from 'antd';

import Form from './Form';

export default function Index() {
    const filterValue = "All";
    const dispatch = useDispatch();

    const [apiFlag, setApiFlag] = useState(false);
    const [displayFlag, setDisplayFlag] = useState(false);
    const [loadingLoader, setLoadingLoader] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [loadingSwitch, setLoadingSwitch] = useState({});
    const [accountsList, setAccountsList] = useState([]);
    const [editObject, setEditObject] = useState({});

    const handleSearchKey = (e) => { setSearchValue(e.target.value); };
    const handleClear = () => { setSearchValue(''); };

    const StatusChange = (action, value, id) => {
        setLoadingSwitch((prev) => ({ ...prev, [id]: true, action }));
        dispatch(AccountActionService({ [action]: value, AccountId: id }, () => {
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
            dispatch(AccountsFetchListService(payLoad, (res) => {
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
            dispatch(AccountsFetchListService(payLoad, (res) => {
                if (res?.status) {
                    setAccountsList(res?.data?.list);
                    setLoadingSwitch({});
                };
            }));
        };
    }, [searchValue, apiFlag]);

    const columns = [
        { Header: '#', keyLabel: "Index", xs: 0.5, },
        { Header: 'Account Name', keyLabel: "AccountName", xs: 3, },
        { Header: 'Account Type', keyLabel: "AccountType", xs: 1.5, },
        { Header: 'Start Amount', keyLabel: "StartAmount", xs: 1.5, },
        { Header: 'Current Amount', keyLabel: "CurrentAmount", xs: 1.5 },
        { Header: 'Min Amount', keyLabel: "MinAmount", xs: 1.5 },
        { Header: 'Used', keyLabel: "Used", xs: 1 },
        { Header: 'Active', keyLabel: "Active", xs: 1 },
        { Header: 'Action', keyLabel: "Action", xs: 0.5 },
    ];

    const tableSetData = accountsList.map((item, index) => ({
        Index:
            <Typography variant="normal" >
                {index + 1 || ''}
            </Typography>,

        AccountName:
            <Stack direction="row" alignItems="center" spacing={2} >
                <CustomAvatar
                    displayName="AC"
                    icon={item?.Icon || ""}
                    bgColor={item?.Color || ""}
                />
                <Typography variant="normal" >
                    {item?.AccountName}
                    <Typography variant="light" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                        <SvgColor src="/assets/icons/general/calendar.svg" sx={{ width: 18, height: 18, mr: 0.5 }} />
                        {fDate(item?.createdAt)}
                    </Typography>
                </Typography>
            </Stack>,
        AccountType: <Typography variant="normal">
            Cash
        </Typography>,
        StartAmount:
            <Typography variant="normal">
                {item?.StartAmount || "-"}
            </Typography>,

        CurrentAmount:
            <Typography variant="normal">
                {item?.CurrentAmount || "-"}
            </Typography>,

        MinAmount:
            <Typography variant="normal">
                {item?.MinAmount || "-"}
            </Typography>,
        Used: (loadingSwitch[item?.AccountId] && loadingSwitch?.action === "isUsing") ? (
            <ButtonLoader />
        ) : (
            <Switch
                checked={item?.isUsing}
                onClick={() => StatusChange('isUsing', !item?.isUsing, item?.AccountId)}
            />
        ),
        Active: (loadingSwitch[item?.AccountId] && loadingSwitch?.action === "isActive") ? (
            <ButtonLoader />
        ) : (
            <Switch
                checked={item?.isActive}
                onClick={() => StatusChange('isActive', !item?.isActive, item?.AccountId)}
            />
        ),
        Action:
            <Dropdown
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
                                            StatusChange('isDeleted', true, item?.AccountId)
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
            </Dropdown >

    }));

    const titleAction = (display) => {
        if (display) {
            return "Accounts";
        };
        if (editObject?.AccountId) {
            return "Edit Account";
        };
        return "New Account";
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
