import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { fDate } from 'src/utils/format-time';
import { sweetAlertQuestion } from 'src/utils/sweet-alerts';
import { fText, fMobileNumber } from 'src/utils/format-text';

import { ContractorID } from 'src/constance';
import { tabsColors } from 'src/theme/palette';
import { GetComplaintsService, RemoveComplaintsService, StatusChangeComplaintsService } from 'src/Services/General.Services';

import SvgColor from 'src/components/svg-color';
import Loader from 'src/components/Loaders/Loader';
import { ModalDialog } from 'src/components/model/index';
import { DataNotFound } from 'src/components/DataNotFound';
import { CustomTable, CustomTooltip, CustomLabelComponent, } from 'src/components/CustomComponents';

import Filters from './Filters';
import Download from './Download';
import FormDetails from './ComplaintForm';
import ComplaintsList from './ComplaintsList';

export default function Index() {

    const dispatch = useDispatch();
    const [displayFlag, setDisplayFlag] = useState(false);
    const [tabValue, setTabValue] = useState("Pending");
    const [filterValue, setFilterValue] = useState("All");
    const [statusChangeButtonLoader, setStatusChangeButtonLoader] = React.useState(false);
    const [loadingLoader, setLoadingLoader] = React.useState(false);

    const ReduxUserRole = useSelector(state => state.auth.userRole);

    const [complaintList, setComplaintList] = useState([]);
    const [countObject, setCountObject] = useState({ completedCount: 0, totalCount: 0, pendingCount: 0, inProgressCount: 0 });
    const [editObject, setEditObject] = useState({});
    const [deleteObject, setDeleteObject] = useState({});

    const [open, setOpen] = useState(false);

    const showDisplayAction = () => {
        setDisplayFlag(!displayFlag);
        setEditObject({});
    };

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        if (!displayFlag) {
            const payLoad = {
                Page: 1,
                PageSize: 30,
                Status: tabValue,
                Filter: { "feeder": filterValue }
            }
            setCountObject({ completedCount: 0, totalCount: 0, pendingCount: 0, inProgressCount: 0 });

            setLoadingLoader(true);
            dispatch(GetComplaintsService(payLoad, (res) => {
                setComplaintList(res?.list);
                setCountObject(res?.count);
                setLoadingLoader(false);
            }))
        }
    }, [displayFlag, tabValue, filterValue]);

    const DeleteAction = () => {

        dispatch(RemoveComplaintsService({ ComplaintId: deleteObject?.Complaint_Id, }, () => {
            setOpen(false);
            const payLoad = {
                Page: 1,
                PageSize: 30,
                Status: tabValue
            }
            dispatch(GetComplaintsService(payLoad, (res) => {
                setComplaintList(res?.list);
                setCountObject(res?.count);
            }))
        }))
    };

    const StatusChange = (item, Status) => {
        setStatusChangeButtonLoader((prev) => ({ ...prev, [item?.Complaint_Id]: true }));
        dispatch(StatusChangeComplaintsService({ ComplaintId: item?.Complaint_Id, Status }, () => {
            setOpen(false);
            const payLoad = {
                Page: 1,
                PageSize: 30,
                Status: tabValue
            }
            dispatch(GetComplaintsService(payLoad, (res) => {
                setComplaintList(res?.list);
                setCountObject(res?.count);
                setStatusChangeButtonLoader((prev) => ({ ...prev, [item?.Complaint_Id]: false }));
            }))
        }))
    };

    const columns = [
        { Header: 'Consumer Number', keyLabel: "Consumer_Number", xs: 2, },
        { Header: 'Consumer Name', keyLabel: "Consumer_FullName", xs: 2, },
        { Header: 'Feeder', keyLabel: "Feeder_Name", xs: 3 },
        { Header: 'Capacity (KVA)', keyLabel: "Transformer_Capacity", xs: 1.5 },
        { Header: 'Village', keyLabel: "Village_EnName", xs: 1.5 },
        { Header: 'Status', keyLabel: "Village_EnName", xs: 1.5 },
        { Header: 'Action', keyLabel: "Village_EnName", xs: 0.5 },
    ];

    const tableSetData = complaintList.map((item, index) => ({
        Consumer_Number: <>
            <Typography variant="normal" >
                {item?.Consumer_Number || ''}
            </Typography>
            <Typography variant="light" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                <SvgColor src="/assets/icons/general/calendar.svg" sx={{ width: 18, height: 18, mr: 0.5 }} />
                {fDate(item?.createdAt)}
            </Typography>
        </>,
        Consumer_FullName: <>
            <Typography variant="normal">
                {fText(item?.Consumer_FullName)}
            </Typography>

            <Typography variant="light" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                {fMobileNumber(item?.Consumer_NumberPrimary)}

                <CustomTooltip
                    // label={numberCopy ? "Copied!" : "Copy Number"}
                    Placement="top">
                    <IconButton
                        sx={{ pointerEvents: "auto" }}
                        size="small"
                        color='success'
                    // onClick={() => copyTextToClipboard(item?.Consumer_NumberPrimary)}
                    // onBlur={() => setNumberCopy(false)}
                    >
                        <SvgColor src="/assets/icons/general/copy.svg" sx={{ width: 20, height: 20, }} />
                    </IconButton>
                </CustomTooltip>
            </Typography>
        </>,
        Feeder_Name: <>
            <Typography variant="normal">
                {fText(item?.Feeder?.Feeder_Name)} <Typography variant="small" > ({item?.Feeder?.Feeder_Type})</Typography>
            </Typography>

            <Typography variant="light" color="text.secondary" >
                {fText(item?.Feeder?.Substation_Name)}
            </Typography>
        </>,
        Transformer_Capacity: <Typography variant="normal">
            {item?.Transformer_Capacity || "-"}
        </Typography>,
        Village_EnName: <Typography variant="normal" >
            {fText(item?.Village?.Village_EnName)}
        </Typography>
        // Village_EnName: <Typography variant="normal" >
        //     {fText(item?.Village?.Village_EnName)}
        // </Typography>
    }));


    return (

        <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
            <Card>
                <CardHeader
                    title="Applications"
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

                {displayFlag ?
                    <FormDetails backAction={showDisplayAction} editObject={editObject} />
                    :
                    <Box sx={{
                        borderRadius: 1.3,
                    }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginX: 2 }}>
                            <Tabs
                                variant="scrollable"
                                scrollButtons="auto"
                                disableRipple
                                value={tabValue}
                                onChange={handleChange}>
                                <Tab
                                    label={
                                        <CustomLabelComponent
                                            selectValue={tabValue}
                                            color={tabsColors.all}
                                            colorActive={tabsColors.allActive}
                                            bgColor={tabsColors.allBg}
                                            bgColorActive={tabsColors.allBgActive}
                                            label="All"
                                            value="All"
                                            record={countObject?.totalCount} />}
                                    value="All" />

                                <Tab
                                    label={
                                        <CustomLabelComponent
                                            selectValue={tabValue}
                                            color={tabsColors.cancelled}
                                            colorActive={tabsColors.cancelledActive}
                                            bgColor={tabsColors.cancelledBg}
                                            bgColorActive={tabsColors.cancelledBgActive}
                                            label="Pending"
                                            value="Pending"
                                            record={countObject?.pendingCount || 0} />}
                                    value="Pending" />

                                <Tab
                                    label={<CustomLabelComponent
                                        selectValue={tabValue}
                                        color={tabsColors.panding}
                                        colorActive={tabsColors.pandingActive}
                                        bgColor={tabsColors.pandingBg}
                                        bgColorActive={tabsColors.pandingBgActive}
                                        label="Store Pending"
                                        value="Store Pending"
                                        record={countObject?.inProgressCount || 0} />}
                                    value="Store Pending" />

                                <Tab
                                    label={<CustomLabelComponent
                                        selectValue={tabValue}
                                        color={tabsColors.completed}
                                        colorActive={tabsColors.completedActive}
                                        bgColor={tabsColors.completedBg}
                                        bgColorActive={tabsColors.completedBgActive}
                                        label="Completed"
                                        value="Completed"
                                        record={countObject?.completedCount} />}
                                    value="Completed" />
                            </Tabs>
                        </Box>

                        <Box sx={{
                            marginX: 2,
                            marginTop: 1.5,
                            display: "flex",
                            justifyContent: "space-between"
                        }}>
                            <Box />
                            <Box>
                                <Filters value={filterValue} FilterAction={(value) => setFilterValue(value)} />
                                <Download />
                            </Box>
                        </Box>

                        {
                            loadingLoader ?
                                <Box sx={{ display: "flex", height: "50vh" }}>
                                    <Loader />
                                </Box> :
                                <Box sx={{
                                    marginTop: 1.5,
                                    overflow: 'auto'
                                }}>

                                    {
                                        complaintList && complaintList?.length > 0 ?
                                            <>
                                                <Box sx={{
                                                    marginX: 2,
                                                    display: { xs: "none", md: "block", },
                                                    minWidth: '1000px',
                                                    flexWrap: 'wrap'
                                                }}>

                                                    <ComplaintsList isHeader />

                                                    {complaintList?.map((item, key) =>
                                                    (
                                                        <ComplaintsList
                                                            key={key}
                                                            item={item}
                                                            complaintList={complaintList}
                                                            statusChangeButtonLoader={statusChangeButtonLoader[item?.Complaint_Id]}
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

                                                    <CustomTable
                                                        columns={columns}
                                                        data={tableSetData}
                                                    />
                                                </Box>

                                                {/* <Box sx={{
                                                    display: { xs: "block", md: "none", },
                                                    flexWrap: 'wrap'
                                                }}>

                                                    <CustomTable
                                                        columns={columns}
                                                        data={tableSetData}
                                                    />
                                                    {complaintList?.map((item, key) =>
                                                    (
                                                        <ComplaintsGrid
                                                            key={key}
                                                            item={item}
                                                            complaintList={complaintList}
                                                            statusChangeButtonLoader={statusChangeButtonLoader[item?.Complaint_Id]}
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
                                                </Box> */}
                                            </> :
                                            <DataNotFound />}

                                </Box>
                        }
                    </Box>

                }

            </Card >

            <ModalDialog
                title="Delete"
                open={open}
                handleClose={() => { setOpen(false); setDeleteObject({}) }}>
                <Box sx={{
                    minWidth: { xs: 250, md: 500, },
                }}>

                    <Typography variant='normal' sx={{ alignItems: "center" }}>Are you sure want to delete ?</Typography>

                    <Box sx={{
                        mt: 2,
                        textAlign: "end",
                        justifyContent: "center",
                        display: "flex"
                    }}>
                        <Button
                            onClick={DeleteAction}
                            variant="contained"
                            color="error"
                            size="small" >
                            Delete
                        </Button>

                        <Button
                            sx={{ marginX: 1 }}
                            size="small"
                            onClick={() => { setOpen(false); setDeleteObject({}) }}
                            variant="outlined"
                            color="CancelButton">
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
