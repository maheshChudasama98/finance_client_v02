import React from 'react';
import { useSelector } from 'react-redux';

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import AddIcon from "@mui/icons-material/Add";
import Grid from '@mui/material/Unstable_Grid2';
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import RemoveIcon from "@mui/icons-material/Remove";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import { fDate } from 'src/utils/format-time';
import { fText, fMobileNumber, } from 'src/utils/format-text';

import { shadows } from 'src/theme/shadows';
import { StaffID, VisitorID, JuniorEngineerID, } from 'src/constance';

import SvgColor from 'src/components/svg-color';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { CustomAvatar, CustomTooltip } from 'src/components/CustomComponents';

import { App, Dropdown } from 'antd';


const ProjectItem = ({ item, isHeader, complaintList, editAction, deleteAction, statusChangeAction, statusChangeButtonLoader }) => {
    const [expanded, setExpanded] = React.useState(false);
    const [numberCopy, setNumberCopy] = React.useState(false);
    const ReduxUserRole = useSelector(state => state.auth.userRole);
    const { message } = App.useApp();

    const [open, setOpen] = React.useState(false);

    // const handleClickOpen = () => {
    //     setOpen(true);
    // };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = (event) => {
        event.stopPropagation();
        if (complaintList) {
            if (complaintList.find((product) => product?.Complaint_Id === item?.Complaint_Id)) {

                setExpanded(!expanded);
                // handleClickOpen(!expanded)
            }
        }
    }

    let buttonStyle = {
        '.MuiAccordionSummary-expandIconWrapper': {
            color: 'text.secondary',
            height: 23,
            width: 22,
            alignItems: 'center',
            justifyContent: 'center',
            mr: 1,

        },
        py: 1,
        color: (theme) => `${theme?.palette?.grey?.[600]}`,
        backgroundColor: (theme) => `${theme?.palette?.grey?.[200]}`
    }
    if (!isHeader) {
        buttonStyle = {
            '.MuiAccordionSummary-expandIconWrapper': {
                borderRadius: 1,
                border: 1,
                color: 'text.secondary',
                borderColor: 'divider',
                transform: 'none',
                height: 23,
                width: 22,
                // alignItems: 'center',
                // justifyContent: 'center',
                mr: 1,

                '&.Mui-expanded': {
                    transform: 'none',
                    color: 'primary.main',
                    borderColor: 'primary.main',
                },

                '& svg': {
                    fontSize: '1.25rem',
                }
            }
        }
    }

    const StatusCheck = (status) => {
        switch (status) {
            case "Pending":
                return <Chip color="error" label="Pending" size='small' />;
            case "Inprogress":
                return <Chip color="warning" label="Store Pending" size='small' />;
            case "Completed":
                return <Chip color='success' label="Completed" size='small' />

            default:
                break;
        }
    }

    let flagAction = false
    if (ReduxUserRole === StaffID) {
        if (item?.Complaint_Status === "Pending") {
            flagAction = true
        }
    } else if (ReduxUserRole === JuniorEngineerID) {

        flagAction = true
    }

    let stateMenu = []

    if (item?.Complaint_Status === "Pending") {
        stateMenu = [
            {
                label: (
                    <Typography variant="body1" fontSize={16} color="" onClick={() => statusChangeAction(item, "Inprogress")} >
                        <Box display="flex" alignItems="center" >
                            <SvgColor src="/assets/icons/general/history3.svg" sx={{ width: 25, height: 25, mr: 2 }} />
                            Store pending
                        </Box>
                    </Typography>
                ),
            },
            {
                label: (
                    <Typography variant="body1" fontSize={16} color="green" onClick={() => { statusChangeAction(item, "Completed    ") }}>
                        <Box display="flex" alignItems="center" >
                            <SvgColor src="/assets/icons/general/check-circle.svg" sx={{ width: 27, height: 27, mr: 2 }} />
                            Completed
                        </Box>
                    </Typography>
                ),
            }]
    } else if (item?.Complaint_Status === "Inprogress") {
        stateMenu = [
            {
                label: (
                    <Typography variant="body1" fontSize={16} color="" onClick={() => statusChangeAction(item, "Pending")} >
                        <Box display="flex" alignItems="center" >
                            <SvgColor src="/assets/icons/general/danger-circle.svg" sx={{ width: 25, height: 25, mr: 2 }} />
                            Pending
                        </Box>
                    </Typography>
                ),
            },
            {
                label: (
                    <Typography variant="body1" fontSize={16} color="green" onClick={() => { statusChangeAction(item, "Completed") }}>
                        <Box display="flex" alignItems="center" >
                            <SvgColor src="/assets/icons/general/check-circle.svg" sx={{ width: 27, height: 27, mr: 2 }} />
                            Completed
                        </Box>
                    </Typography>
                ),
            }]
    } else {
        stateMenu = [
            {
                label: (
                    <Typography variant="body1" fontSize={16} color="" onClick={() => statusChangeAction(item, "Pending")} >
                        <Box display="flex" alignItems="center" >
                            <SvgColor src="/assets/icons/general/danger-circle.svg" sx={{ width: 25, height: 25, mr: 2 }} />
                            Pending
                        </Box>
                    </Typography>
                ),
            },
            {
                label: (
                    <Typography variant="body1" fontSize={16} color="" onClick={() => statusChangeAction(item, "Inprogress")} >
                        <Box display="flex" alignItems="center" >
                            <SvgColor src="/assets/icons/general/history3.svg" sx={{ width: 25, height: 25, mr: 2 }} />
                            Store pending
                        </Box>
                    </Typography>
                ),
            },

        ]
    }

    const copyTextToClipboard = (text) => {
        // Check if the Clipboard API is available
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    message.success("Number Copied!");
                    setNumberCopy(true);
                    console.log('Text copied to clipboard!');
                })
                .catch((err) => {
                    message.error("Number not Copied!");

                    console.error('Failed to copy text: ', err);
                });
        } else {
            // Fallback for older browsers (execCommand)
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            console.log('Text copied to clipboard!');
        }
    };

    return (
        <Card sx={{
            border: (!isHeader && !expanded) ? 1 : (theme) => `solid 1px ${theme?.palette?.grey?.[400]}`,
            borderColor: (!isHeader && !expanded) ? (theme) => `${theme?.palette?.grey?.[300]}` : (theme) => theme.palette.primary?.main,
            borderRadius: 1.5,
            boxShadow: shadows()[9],
            marginX: 2,
            my: (!isHeader && expanded) ? 1.5 : 1.5,
        }}>
            <Accordion expanded={expanded}>
                <AccordionSummary
                    sx={{
                        flexDirection: 'row-reverse',
                        '& .MuiAccordionSummary-content': {
                            '&.Mui-expanded': {
                                margin: '12px 0',
                            }
                        },
                        // Set a height for the Box (adjust as needed)
                        ...buttonStyle

                    }}>


                    <Box sx={{ width: "100%", }}>
                        <Grid container spacing={2} sx={{}} >


                            <Grid xs={11} sx={{}}>

                                {
                                    statusChangeButtonLoader ?
                                        <ButtonLoader /> :
                                        <>
                                            {
                                                ReduxUserRole === StaffID || ReduxUserRole === VisitorID ?
                                                    <>
                                                        {StatusCheck(item?.Complaint_Status)}
                                                    </> :
                                                    <Dropdown
                                                        menu={{
                                                            items: stateMenu,
                                                        }}
                                                        placement="bottomLeft"
                                                    >
                                                        {StatusCheck(item?.Complaint_Status)}
                                                    </Dropdown>

                                            }
                                        </>
                                }


                            </Grid>

                            <Grid xs={1} sx={{ display: "block", textAlign: "end" }}>
                                {expanded ? <RemoveIcon onClick={handleClick} sx={{
                                    float: "right",
                                    borderRadius: 0.5,
                                    border: 1,
                                    color: 'text.secondary',
                                    borderColor: 'divider',
                                    transform: 'none',
                                    height: 18,
                                    width: 18,
                                }} /> : <AddIcon onClick={handleClick}
                                    sx={{
                                        float: "right",
                                        borderRadius: 0.5,
                                        border: 1,
                                        color: 'text.secondary',
                                        borderColor: 'divider',
                                        transform: 'none',
                                        height: 18,
                                        width: 18,
                                    }} />}
                            </Grid>



                            <Grid xs={10.5}>

                                <Typography variant="normal" fontWeight={600} color="text.secondary"> Consumer Information </Typography>

                                <Typography variant="light" fontWeight={400}  >
                                    {item?.Consumer_Number || ''}
                                </Typography>

                                <Typography variant="light" fontWeight={400} >
                                    {fText(item?.Consumer_FullName)}
                                </Typography>

                            </Grid>

                            <Grid xs={1.5} sx={{ display: "block", textAlign: "end" }} >

                                {
                                    flagAction && <Dropdown
                                        trigger={['click']}
                                        menu={{
                                            items: [{
                                                label: (
                                                    <Typography variant="body1" fontSize={16} onClick={() => editAction(item)} >
                                                        <Box display="flex" alignItems="center" >
                                                            <SvgColor src="/assets/icons/general/pen.svg" sx={{ width: 25, height: 25, mr: 2 }} />
                                                            Edit
                                                        </Box>
                                                    </Typography>
                                                ),
                                            },
                                            {
                                                label: (
                                                    <Typography variant="body1" fontSize={16} color="error" onClick={() => { deleteAction(item) }}>
                                                        <Box display="flex" alignItems="center" justifyContent="center">
                                                            <SvgColor src="/assets/icons/general/trash.svg" sx={{ width: 25, height: 25, mr: 2 }} />
                                                            Delete
                                                        </Box>
                                                    </Typography>
                                                ),
                                            }],
                                        }}
                                        placement="bottomRight"

                                    >
                                        {/* <IconButton aria-label="delete" size="small" > */}
                                        <MoreVertIcon fontSize="small" />
                                        {/* </IconButton> */}
                                    </Dropdown>
                                }
                            </Grid>

                            <Grid xs={12}>
                                <Typography variant="normal" fontWeight={600} color="text.secondary" > Consumer Number </Typography>
                                <Typography
                                    variant="light"
                                    fontWeight={400}
                                    display="flex"
                                    sx={{ alignItems: "center", }}>

                                    {fMobileNumber(item?.Consumer_NumberPrimary)}

                                    <CustomTooltip label={numberCopy ? "Copied!" : "Copy Number"} Placement="top">
                                        <Box
                                            tabIndex={0}
                                            onClick={() => copyTextToClipboard(item?.Consumer_NumberPrimary)}
                                            sx={{ cursor: 'pointer', mx: 1 }}>
                                            <SvgColor src="/assets/icons/general/copy.svg" sx={{ width: 20, height: 20, }} />
                                        </Box>
                                    </CustomTooltip>
                                </Typography>
                            </Grid>


                            <Grid xs={8}>
                                <Typography variant="normal" fontWeight={600} color="text.secondary">
                                    Feeder
                                </Typography>

                                <Typography variant="light" fontWeight={400} >
                                    {fText(item?.Feeder?.Feeder_Name)}
                                    <Typography variant="small" fontWeight={400}>
                                        {" "}({item?.Feeder?.Feeder_Type})
                                    </Typography>
                                </Typography>

                                <Typography variant="light" fontWeight={400}  >
                                    {fText(item?.Feeder?.Substation_Name)}
                                </Typography>
                            </Grid>

                            <Grid xs={4}>
                                <Typography variant="normal" fontWeight={600} color="text.secondary">
                                    Create Date
                                </Typography>

                                <Typography variant="light" fontWeight={400} >
                                    {fDate(item?.createdAt)}
                                </Typography>
                            </Grid>


                            <Grid xs={8}>
                                <Typography variant="normal" fontWeight={600} color="text.secondary">
                                    Village
                                </Typography>

                                <Typography variant="light" fontWeight={400} >
                                    {fText(item?.Village?.Village_EnName)}
                                </Typography>
                            </Grid>

                            <Grid xs={4}>
                                <Typography variant="normal" fontWeight={600} color="text.secondary">
                                    Capacity
                                </Typography>
                                <Typography variant="light" fontWeight={400} >
                                    {item?.Transformer_Capacity}
                                    <Typography variant="small" fontWeight={400}>
                                        {" "}({item?.Transformer_Capacity && "KVA"})
                                    </Typography>
                                </Typography>

                            </Grid>

                        </Grid>
                    </Box>
                </AccordionSummary>

                <AccordionDetails >
                    <Box sx={{
                        p: 3,
                        mt: 2,
                        mb: 4,
                        borderRadius: 2,
                        border: !isHeader ? (theme) => `dashed 1px ${theme?.palette?.grey?.[500]}` : "",
                        position: "relative"
                    }}>
                        <Typography variant="big" sx={{ position: "absolute", top: -16, left: 15, backgroundColor: "#fff", px: 1 }}>
                            Consumer Details
                        </Typography>

                        <Grid container spacing={2} >
                            <Grid xs={12} sm={6} lg={3} xl={3} >
                                <Typography variant="normal" fontWeight={600} color="text.secondary">
                                    Consumer Number
                                </Typography>
                                <Typography variant="light" fontWeight={400} >
                                    {item?.Consumer_Number}
                                </Typography>
                            </Grid>

                            <Grid xs={12} sm={6} lg={3} xl={3}>
                                <Typography variant="normal" fontWeight={600} color="text.secondary">
                                    Consumer Name
                                </Typography>
                                <Typography variant="light" fontWeight={400} >
                                    {fText(item?.Consumer_FullName)}
                                </Typography>
                            </Grid>

                            <Grid xs={12} sm={6} lg={3} xl={3}>
                                <Typography variant="normal" fontWeight={600} color="text.secondary">Primary Number </Typography>

                                <Typography
                                    variant="light"
                                    fontWeight={400}
                                    display="flex"
                                    sx={{ alignItems: "center", }}>

                                    {fMobileNumber(item?.Consumer_NumberPrimary)}

                                    <CustomTooltip label={numberCopy ? "Copied!" : "Copy Number"} Placement="top">
                                        <Box
                                            tabIndex={0}
                                            onClick={() => copyTextToClipboard(item?.Consumer_NumberPrimary)}
                                            sx={{ cursor: 'pointer', mx: 1 }}>
                                            <SvgColor src="/assets/icons/general/copy.svg" sx={{ width: 18, height: 18, }} />
                                        </Box>
                                    </CustomTooltip>
                                </Typography>
                            </Grid>

                            {
                                item?.Consumer_NumberSecondary &&

                                <Grid xs={12} sm={6} lg={3} xl={3}>
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">Secondary Number </Typography>

                                    <Typography
                                        variant="light"
                                        fontWeight={400}
                                        display="flex"
                                        sx={{ alignItems: "center", }}>

                                        {fMobileNumber(item?.Consumer_NumberSecondary)}

                                        <CustomTooltip label={numberCopy ? "Copied!" : "Copy Number"} Placement="top">
                                            <Box
                                                tabIndex={0}
                                                onClick={() => copyTextToClipboard(item?.Consumer_NumberSecondary)}
                                                sx={{ cursor: 'pointer', mx: 1 }}>
                                                <SvgColor src="/assets/icons/general/copy.svg" sx={{ width: 18, height: 18, }} />
                                            </Box>
                                        </CustomTooltip>
                                    </Typography>

                                </Grid>
                            }
                        </Grid>
                    </Box>

                    <Box sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 2,
                        border: !isHeader ? (theme) => `dashed 1px ${theme?.palette?.grey?.[500]}` : "",
                        position: "relative"
                    }}>
                        <Typography variant="big" sx={{ position: "absolute", top: -16, left: 15, backgroundColor: "#fff", px: 1 }}>
                            Transformer Details
                        </Typography>
                        <Grid container spacing={2} >
                            {
                                item?.Contracted_Load &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Contracted Load
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {item?.Contracted_Load} {item?.Load_Unity}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Village?.Village_EnName &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Village Name
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {fText(item?.Village?.Village_EnName)}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Feeder?.Feeder_Name &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Feeder Name
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {fText(item?.Feeder?.Feeder_Name)}
                                        <Typography variant="small" fontWeight={400}>
                                            {" "}({item?.Feeder?.Feeder_Type})
                                        </Typography>
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Feeder?.Substation_Name &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Substation Name
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {fText(item?.Feeder?.Substation_Name)}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Number_Of_Connection &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Number Of Connection
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {item?.Number_Of_Connection}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Transformer_Capacity &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Capacity
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {item?.Transformer_Capacity}
                                        <Typography variant="small" fontWeight={400}>
                                            {" "}({item?.Transformer_Capacity && "KVA"})
                                        </Typography>
                                    </Typography>

                                </Grid>
                            }

                            {
                                item?.Transformer_Make &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Transformer Make
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {item?.Transformer_Make}
                                    </Typography>
                                </Grid>
                            }


                            {
                                item?.Serial_Number &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Serial Number
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {item?.Serial_Number}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Job_Number &&

                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Job Number
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {item?.Job_Number}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.DispatchNumber_Date &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Dispatch Number
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {fDate(item?.DispatchNumber_Date)}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Oil_Level &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Oil Level
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {item?.Oil_Level}  {item?.Oli_Level_Unity}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Oli_Sortage &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Oil Sortage
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {item?.Oli_Sortage}  {item?.Oli_Sortage_Unity}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.MeterMd &&

                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Meter MD
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {item?.MeterMd}
                                    </Typography>
                                </Grid>
                            }
                            {
                                item?.Reason &&

                                <Grid xs={12} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Reason
                                    </Typography>
                                    <Typography variant="light" >
                                        {item?.Reason}
                                    </Typography>
                                </Grid>
                            }

                        </Grid>
                    </Box>


                    <Box sx={{
                        p: 3,
                        borderRadius: 2,
                        border: !isHeader ? (theme) => `dashed 1px ${theme?.palette?.grey?.[500]}` : "",
                        position: "relative"
                    }}>
                        <Typography variant="big" sx={{ position: "absolute", top: -16, left: 15, backgroundColor: "#fff", px: 1 }}>
                            Check By
                        </Typography>

                        <Grid container spacing={2} >
                            <Grid xs={12} >
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <CustomAvatar displayName={item?.User?.User_Avatar} />
                                    <Typography variant="normal" noWrap fontWeight={700}>
                                        {fText(`${item?.User?.User_FirstName}  ${item?.User?.User_LastName} `)}
                                        <Typography variant="light" color="text.secondary" fontWeight={400} sx={{ display: "flex" }}>
                                            {item?.User?.User_Email}
                                        </Typography>
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
            // TransitionComponent={Transition}
            >
                <Box sx={{ margin: 2 }}>
                    <Box sx={{
                        p: 3,
                        mt: 2,
                        mb: 4,
                        borderRadius: 2,
                        border: !isHeader ? (theme) => `dashed 1px ${theme?.palette?.grey?.[500]}` : "",
                        position: "relative"
                    }}>
                        <Typography variant="big" sx={{ position: "absolute", top: -16, left: 15, backgroundColor: "#fff", px: 1 }}>
                            Consumer Details
                        </Typography>

                        <Grid container spacing={2} >
                            <Grid xs={12} sm={6} lg={3} xl={3} >
                                <Typography variant="normal" fontWeight={600} color="text.secondary">
                                    Consumer Number
                                </Typography>
                                <Typography variant="light" fontWeight={400} >
                                    {item?.Consumer_Number}
                                </Typography>
                            </Grid>

                            <Grid xs={12} sm={6} lg={3} xl={3}>
                                <Typography variant="normal" fontWeight={600} color="text.secondary">
                                    Consumer Name
                                </Typography>
                                <Typography variant="light" fontWeight={400} >
                                    {fText(item?.Consumer_FullName)}
                                </Typography>
                            </Grid>

                            <Grid xs={6} sm={6} lg={3} xl={3}>
                                <Typography variant="normal" fontWeight={600} color="text.secondary">Primary Number </Typography>

                                <Typography
                                    variant="light"
                                    fontWeight={400}
                                    display="flex"
                                    sx={{ alignItems: "center", }}>

                                    {fMobileNumber(item?.Consumer_NumberPrimary)}

                                    <CustomTooltip label={numberCopy ? "Copied!" : "Copy Number"} Placement="top">
                                        <Box
                                            tabIndex={0}
                                            onClick={() => copyTextToClipboard(item?.Consumer_NumberPrimary)}
                                            sx={{ cursor: 'pointer', mx: 1 }}>
                                            <SvgColor src="/assets/icons/general/copy.svg" sx={{ width: 18, height: 18, }} />
                                        </Box>
                                    </CustomTooltip>
                                </Typography>
                            </Grid>

                            {
                                item?.Consumer_NumberSecondary &&

                                <Grid xs={6} sm={6} lg={3} xl={3}>
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">Secondary Number </Typography>

                                    <Typography
                                        variant="light"
                                        fontWeight={400}
                                        display="flex"
                                        sx={{ alignItems: "center", }}>

                                        {fMobileNumber(item?.Consumer_NumberSecondary)}

                                        <CustomTooltip label={numberCopy ? "Copied!" : "Copy Number"} Placement="top">
                                            <Box
                                                tabIndex={0}
                                                onClick={() => copyTextToClipboard(item?.Consumer_NumberSecondary)}
                                                sx={{ cursor: 'pointer', mx: 1 }}>
                                                <SvgColor src="/assets/icons/general/copy.svg" sx={{ width: 18, height: 18, }} />
                                            </Box>
                                        </CustomTooltip>
                                    </Typography>

                                </Grid>
                            }
                        </Grid>
                    </Box>

                    <Box sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 2,
                        border: !isHeader ? (theme) => `dashed 1px ${theme?.palette?.grey?.[500]}` : "",
                        position: "relative"
                    }}>
                        <Typography variant="big" sx={{ position: "absolute", top: -16, left: 15, backgroundColor: "#fff", px: 1 }}>
                            Transformer Details
                        </Typography>
                        <Grid container spacing={2} >
                            {
                                item?.Contracted_Load &&
                                <Grid xs={6} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Contracted Load
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {item?.Contracted_Load} {item?.Load_Unity}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Village?.Village_EnName &&
                                <Grid xs={6} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Village Name
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {fText(item?.Village?.Village_EnName)}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Feeder?.Feeder_Name &&
                                <Grid xs={6} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Feeder Name
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {fText(item?.Feeder?.Feeder_Name)}
                                        <Typography variant="small" fontWeight={400}>
                                            {" "}({item?.Feeder?.Feeder_Type})
                                        </Typography>
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Feeder?.Substation_Name &&
                                <Grid xs={6} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Substation Name
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {fText(item?.Feeder?.Substation_Name)}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Number_Of_Connection &&
                                <Grid xs={6} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Number Of Connection
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {item?.Number_Of_Connection}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Transformer_Capacity &&
                                <Grid xs={6} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Capacity
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {item?.Transformer_Capacity}
                                        <Typography variant="small" fontWeight={400}>
                                            {" "}({item?.Transformer_Capacity && "KVA"})
                                        </Typography>
                                    </Typography>

                                </Grid>
                            }

                            {
                                item?.Transformer_Make &&
                                <Grid xs={6} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Transformer Make
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {item?.Transformer_Make}
                                    </Typography>
                                </Grid>
                            }


                            {
                                item?.Serial_Number &&
                                <Grid xs={6} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Serial Number
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {item?.Serial_Number}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Job_Number &&

                                <Grid xs={6} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Job Number
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {item?.Job_Number}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.DispatchNumber_Date &&
                                <Grid xs={6} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Dispatch Number
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {fDate(item?.DispatchNumber_Date)}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Oil_Level &&
                                <Grid xs={6} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Oil Level
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {item?.Oil_Level}  {item?.Oli_Level_Unity}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Oli_Sortage &&
                                <Grid xs={6} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Oil Sortage
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {item?.Oli_Sortage}  {item?.Oli_Sortage_Unity}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.MeterMd &&

                                <Grid xs={6} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Meter MD
                                    </Typography>
                                    <Typography variant="light" fontWeight={400} >
                                        {item?.MeterMd}
                                    </Typography>
                                </Grid>
                            }
                            {
                                item?.Reason &&

                                <Grid xs={12} >
                                    <Typography variant="normal" fontWeight={600} color="text.secondary">
                                        Reason
                                    </Typography>
                                    <Typography variant="light" >
                                        {item?.Reason}
                                    </Typography>
                                </Grid>
                            }

                        </Grid>
                    </Box>


                    <Box sx={{
                        p: 3,
                        borderRadius: 2,
                        border: !isHeader ? (theme) => `dashed 1px ${theme?.palette?.grey?.[500]}` : "",
                        position: "relative"
                    }}>
                        <Typography variant="big" sx={{ position: "absolute", top: -16, left: 15, backgroundColor: "#fff", px: 1 }}>
                            Check By
                        </Typography>

                        <Grid container spacing={2} >
                            <Grid xs={12} >
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <CustomAvatar displayName={item?.User?.User_Avatar} />
                                    <Typography variant="normal" noWrap fontWeight={700}>
                                        {fText(`${item?.User?.User_FirstName}  ${item?.User?.User_LastName} `)}
                                        <Typography variant="light" color="text.secondary" fontWeight={400} sx={{ display: "flex" }}>
                                            {item?.User?.User_Email}
                                        </Typography>
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Dialog>
        </Card >
    );
};
export default ProjectItem;
