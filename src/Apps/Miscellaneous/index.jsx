import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
// import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { sweetAlertQuestion } from 'src/utils/sweet-alerts';

import { ContractorID } from 'src/constance';
import { tabsColors } from 'src/theme/palette';
import { StatusModifyService, RemoveMiscellaneousService, FetchMiscellaneousListService, } from 'src/Services/Miscellaneous.Services';

import Loader from 'src/components/Loaders/Loader';
import { ModalDialog } from 'src/components/model/index';
import { DataNotFound } from 'src/components/DataNotFound';

import FormDetails from './Form';
import MeterGrid from './MeterGrid';
import MeterList from './MeterList';

const LableComponet = ({
    lable,
    value,
    record,
    selectValue,
    color,
    colorActive,
    bgColor,
    bgColorActive }) => (
    <Box sx={{ display: "flex", placeItems: "center" }}>
        <Typography variant='body2' >{lable}</Typography>
        <Box
            sx={{
                borderRadius: 0.7,
                color: selectValue === value ? colorActive : color,
                backgroundColor: selectValue === value ? bgColorActive : bgColor,
                paddingY: 0.2,
                paddingX: 0.8,
                marginLeft: 1
            }}>
            <Typography variant='body2' fontSize={14} fontWeight={600} >{record}</Typography>
        </Box>
    </Box>
)
LableComponet.propTypes = {
    lable: PropTypes.string,
    value: PropTypes.number,
    record: PropTypes.number,
    selectValue: PropTypes.string,
    color: PropTypes.string,
    colorActive: PropTypes.string,
    bgColor: PropTypes.string,
    bgColorActive: PropTypes.string
};

export default function Index() {
    const dispatch = useDispatch();
    const [displayFlag, setDisplayFlag] = useState(false);
    const [tabValue, setTabValue] = useState("Pending");
    const [statusChangeButtonLoader, setStatusChangeButtonLoader] = React.useState(false);
    const [loadingLoader, setLoadingLoader] = React.useState(false);
    const ReduxUserRole = useSelector(state => state.auth.userRole);

    const [meterList, setMeterList] = useState([]);
    const [countObject, setCountObject] = useState({ totalCount: 0, pending: 0, completed: 0, });
    const [editObject, setEditObject] = useState({});
    const [deleteObject, setDeleteObject] = useState({});

    const [open, setOpen] = useState(false);

    const showDisplayAction = () => {
        setDisplayFlag(!displayFlag);
        setEditObject({});
    }

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        if (!displayFlag) {
            const payLoad = {
                Page: 1,
                PageSize: 30,
                Type: tabValue,
                // Filter: { "feeder": filterValue }
            }
            setCountObject({ totalCount: 0, pending: 0, completed: 0, });

            setLoadingLoader(true);
            dispatch(FetchMiscellaneousListService(payLoad, (res) => {
                setMeterList(res?.list);
                setCountObject(res?.count);
                setLoadingLoader(false);
            }))
        }
    }, [displayFlag, tabValue,]);

    const DeleteAction = () => {

        dispatch(RemoveMiscellaneousService({ MiscellaneousId: deleteObject?.Miscellaneous_Id, }, () => {
            setOpen(false);
            const payLoad = {
                Page: 1,
                PageSize: 30,
                Type: tabValue
            }
            dispatch(FetchMiscellaneousListService(payLoad, (res) => {
                setMeterList(res?.list);
                setCountObject(res?.count);
            }))
        }))
    }

    const StatusChange = (item, Status) => {
        setStatusChangeButtonLoader((prev) => ({ ...prev, [item?.Miscellaneous_Id]: true }));
        dispatch(StatusModifyService({ MiscellaneousId: item?.Miscellaneous_Id, Status }, () => {
            setOpen(false);
            const payLoad = {
                Page: 1,
                PageSize: 30,
                Type: tabValue
            }
            dispatch(FetchMiscellaneousListService(payLoad, (res) => {
                setMeterList(res?.list);
                setCountObject(res?.count);
                setStatusChangeButtonLoader((prev) => ({ ...prev, [item?.Miscellaneous_Id]: false }));
            }))
        }))
    }

    return (

        <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
            <Card>
                <CardHeader
                    title="Miscellaneous"
                    action={
                        ReduxUserRole !== ContractorID &&
                        <Button
                            onClick={showDisplayAction}
                            variant="contained"
                            color="success"
                            startIcon={!displayFlag ? <AddIcon /> : <ArrowBackIcon />} >
                            {
                                !displayFlag ?
                                    "Add New" : "Back"
                            }
                        </Button>
                    }
                />

                <Box sx={{
                    borderRadius: 1.3,
                    paddingY: 2,
                    paddingX: 2,
                }}>
                    {
                        displayFlag ?
                            <FormDetails backAction={showDisplayAction} editObject={editObject} /> :
                            <>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        disableRipple
                                        value={tabValue}
                                        onChange={handleChange}>

                                        <Tab label={<LableComponet
                                            selectValue={tabValue}
                                            color={tabsColors.all}
                                            colorActive={tabsColors.allActive}
                                            bgColor={tabsColors.allBg}
                                            bgColorActive={tabsColors.allBgActive}
                                            lable="All"
                                            value="All"
                                            record={countObject?.totalCount} />}
                                            value="All" />

                                        <Tab label={<LableComponet
                                            selectValue={tabValue}
                                            color={tabsColors.cancelled}
                                            colorActive={tabsColors.cancelledActive}
                                            bgColor={tabsColors.cancelledBg}
                                            bgColorActive={tabsColors.cancelledBgActive}
                                            lable="Pending"
                                            value="Pending"
                                            record={countObject?.pending || 0} />}
                                            value="Pending" />

                                        <Tab label={<LableComponet
                                            selectValue={tabValue}
                                            color={tabsColors.completed}
                                            colorActive={tabsColors.completedActive}
                                            bgColor={tabsColors.completedBg}
                                            bgColorActive={tabsColors.completedBgActive}
                                            lable="Completed"
                                            value="Completed"
                                            record={countObject?.completed || 0} />}
                                            value="Completed" />
                                    </Tabs>
                                </Box>

                                {
                                    loadingLoader ?
                                        <Box sx={{ display: "flex", height: "50vh" }}>
                                            <Loader />
                                        </Box> :
                                        <Box sx={{ overflow: 'auto', }}>
                                            {
                                                meterList && meterList?.length > 0 ?
                                                    <>
                                                        <Box sx={{
                                                            display: { xs: "none", md: "block", },
                                                            minWidth: '1000px',
                                                            flexWrap: 'wrap'
                                                        }}>

                                                            <MeterList isHeader />
                                                            {meterList?.map((item, key) =>
                                                            (
                                                                <MeterList
                                                                    key={key}
                                                                    item={item}
                                                                    meterList={meterList}
                                                                    statusChangeButtonLoader={statusChangeButtonLoader[item?.Miscellaneous_Id]}
                                                                    editAction={(value) => {
                                                                        setEditObject(value);
                                                                        setDisplayFlag(!displayFlag);
                                                                    }}
                                                                    deleteAction={(value) => {
                                                                        setOpen(true);
                                                                        setDeleteObject(value);
                                                                    }}
                                                                    statusChangeAction={(value, status) => {
                                                                        sweetAlertQuestion().then((result) => {
                                                                            if (result === 'Yes') {
                                                                                StatusChange(value, status);
                                                                            }
                                                                        }).catch((error) => {
                                                                            console.error(error);
                                                                        });
                                                                    }} />
                                                            ))}
                                                        </Box>
                                                        <Box sx={{
                                                            display: { xs: "block", md: "none", },
                                                            // minWidth: '1000px',
                                                            flexWrap: 'wrap'
                                                        }}>

                                                            {meterList?.map((item, key) =>
                                                            (
                                                                <MeterGrid
                                                                    key={key}
                                                                    item={item}
                                                                    meterList={meterList}
                                                                    statusChangeButtonLoader={statusChangeButtonLoader[item?.Miscellaneous_Id]}
                                                                    editAction={(value) => {
                                                                        setEditObject(value);
                                                                        setDisplayFlag(!displayFlag);
                                                                    }}
                                                                    deleteAction={(value) => {
                                                                        setOpen(true);
                                                                        setDeleteObject(value);
                                                                    }}
                                                                    statusChangeAction={(value, status) => {
                                                                        sweetAlertQuestion().then((result) => {
                                                                            if (result === 'Yes') {
                                                                                StatusChange(value, status);
                                                                            }
                                                                        }).catch((error) => {
                                                                            console.error(error);
                                                                        });
                                                                    }} />
                                                            ))}
                                                        </Box>
                                                    </> :
                                                    <DataNotFound />}
                                        </Box>
                                }
                            </>
                    }
                </Box>


            </Card >
            <ModalDialog
                title="Delete"
                open={open}
                handleClose={() => { setOpen(false); setDeleteObject({}) }}>
                <Box sx={{ minWidth: { xs: 200, md: 500, } }}>

                    <Typography variant='h5' fontWeight={100} >Are you sure want to delete?</Typography>

                    <Box sx={{ mt: 2, textAlign: "end" }}>
                        <Button onClick={DeleteAction} variant="contained" color="error">
                            Delete
                        </Button>
                        <Button sx={{ marginX: 1 }} onClick={() => { setOpen(false); setDeleteObject({}) }} variant="outlined" color="CancelButton">
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </ModalDialog >
        </Box >

    )
}

Index.propTypes = {
};
