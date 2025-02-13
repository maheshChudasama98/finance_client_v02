import React from 'react';
import { useSelector } from 'react-redux';

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from '@mui/material/Stack';
import AddIcon from "@mui/icons-material/Add";
import Grid from '@mui/material/Unstable_Grid2';
import Accordion from "@mui/material/Accordion";
import IconButton from '@mui/material/IconButton';
import Typography from "@mui/material/Typography";
import RemoveIcon from "@mui/icons-material/Remove";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import { fDate } from 'src/utils/format-time';
import { fText, fMobileNumber, } from 'src/utils/format-text';

import { StaffID, VisitorID, JuniorEngineerID, } from 'src/constance';

import SvgColor from 'src/components/svg-color';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { CustomAvatar, CustomTooltip } from 'src/components/CustomComponents';

import { message, Dropdown } from 'antd';

const ProjectItem = ({ item, isHeader, complaintList, editAction, deleteAction, statusChangeAction, statusChangeButtonLoader }) => {
    const [expanded, setExpanded] = React.useState(false);
    const [numberCopy, setNumberCopy] = React.useState(false);
    const ReduxUserRole = useSelector(state => state.auth.userRole);
    const [messageApi, contextHolder] = message.useMessage();

    const handleClick = (event) => {
        event.stopPropagation();
        if (complaintList) {
            if (complaintList.find((product) => product?.Complaint_Id === item?.Complaint_Id))
                setExpanded(!expanded);
        }
    };

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
    };

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
                alignItems: 'center',
                justifyContent: 'center',
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
    };

    const StatusCheck = (status) => {
        switch (status) {
            case "Pending":
                return <Chip color="error" label="Pending" sx={{ pointerEvents: "auto" }} />;
            case "Inprogress":
                return <Chip color="warning" label="Store Pending" sx={{ pointerEvents: "auto" }} />;
            case "Completed":
                return <Chip color='success' label="Completed" sx={{ pointerEvents: "auto" }} />

            default:
                break;
        }
    };

    let flagAction = false
    if (ReduxUserRole === StaffID) {
        if (item?.Complaint_Status === "Pending") {
            flagAction = true;
        }
    } else if (ReduxUserRole === JuniorEngineerID) {

        flagAction = true;
    };

    let stateMenu = [];

    if (item?.Complaint_Status === "Pending") {
        stateMenu = [
            {
                label: (
                    <Typography variant="normal" onClick={() => statusChangeAction(item, "Inprogress")} >
                        <Box display="flex" alignItems="center" >
                            <SvgColor src="/assets/icons/general/history3.svg" sx={{ width: 25, height: 25, mr: 2 }} />
                            Store pending
                        </Box>
                    </Typography>
                ),
            },
            {
                label: (
                    <Typography variant="normal" color="green" onClick={() => { statusChangeAction(item, "Completed    ") }}>
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
                    <Typography variant="normal" color="" onClick={() => statusChangeAction(item, "Pending")} >
                        <Box display="flex" alignItems="center" >
                            <SvgColor src="/assets/icons/general/danger-circle.svg" sx={{ width: 25, height: 25, mr: 2 }} />
                            Pending
                        </Box>
                    </Typography>
                ),
            },
            {
                label: (
                    <Typography variant="normal" color="green" onClick={() => { statusChangeAction(item, "Completed") }}>
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
                    <Typography variant="normal" onClick={() => statusChangeAction(item, "Pending")} >
                        <Box display="flex" alignItems="center" >
                            <SvgColor src="/assets/icons/general/danger-circle.svg" sx={{ width: 25, height: 25, mr: 2 }} />
                            Pending
                        </Box>
                    </Typography>
                ),
            },
            {
                label: (
                    <Typography variant="normal" onClick={() => statusChangeAction(item, "Inprogress")} >
                        <Box display="flex" alignItems="center" >
                            <SvgColor src="/assets/icons/general/history3.svg" sx={{ width: 25, height: 25, mr: 2 }} />
                            Store pending
                        </Box>
                    </Typography>
                ),
            },

        ]
    };

    const copyTextToClipboard = (text) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    setNumberCopy(true);
                    messageApi.open({
                        type: 'success',
                        content: 'Number Copied!',
                    });
                })
                .catch((err) => {
                    messageApi.open({
                        type: 'error',
                        content: 'Number Copied!',
                    });
                });
        } else {

            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    };

    return (
        <Box sx={{
            borderBottom: (!isHeader && !expanded) ? (theme) => `dashed 1px ${theme?.palette?.grey?.[400]}` : "",
            my: (!isHeader && expanded) ? 1.5 : "",
        }}>
            {contextHolder}
            <Accordion expanded={expanded}
                sx={{
                    border: (!isHeader && expanded) ? 1 : "",
                    borderColor: (theme) => `${theme?.palette?.grey?.[400]}`,
                    py: (!isHeader && expanded) ? 1 : "",
                    borderRadius: (!isHeader && expanded) ? 3 : "",
                }}>
                <AccordionSummary
                    expandIcon={isHeader ? " " :
                        (expanded &&
                            <RemoveIcon sx={{ pointerEvents: "auto" }} onClick={handleClick} />)
                        || <AddIcon sx={{ pointerEvents: "auto" }} onClick={handleClick} />}
                    sx={{
                        flexDirection: 'row-reverse',
                        '& .MuiAccordionSummary-content': {
                            alignItems: 'center',

                            '&.Mui-expanded': {
                                margin: '12px 0',
                            }
                        },
                        pointerEvents: 'none',
                        ...buttonStyle
                    }}>
                    {
                        isHeader ?

                            <Box sx={{ width: "100%", m: 0, p: 0, mx: 1, }}>
                                <Grid container spacing={2} sx={{ alignItems: 'center' }} >
                                    <Grid xs={2} lg={2}>
                                        <Typography variant="tableHead"> Consumer Number </Typography>
                                    </Grid>

                                    <Grid xs={3.5} lg={3}>
                                        <Typography variant="tableHead">Consumer Name</Typography>
                                    </Grid>

                                    <Grid xs={2}>
                                        <Typography variant="tableHead">Feeder</Typography>
                                    </Grid>

                                    <Grid xs={1.5}>
                                        <Typography variant="tableHead">Capacity <span style={{ fontSize: 16 }}>(KVA)</span> </Typography>
                                    </Grid>

                                    <Grid xs={1.5}>
                                        <Typography variant="tableHead">Village</Typography>
                                    </Grid>
                                    <Grid xs={1.5}>
                                        <Typography variant="tableHead">Status</Typography>
                                    </Grid>

                                    <Grid xs={0.5}>
                                        <Typography variant="tableHead">Action</Typography>
                                    </Grid>
                                </Grid>

                            </Box> :

                            <Box sx={{ width: "100%", mx: 1, }}>
                                <Grid container spacing={2} sx={{ alignItems: 'center' }} >
                                    <Grid xs={2}>
                                        <Typography variant="normal" >
                                            {item?.Consumer_Number || ''}
                                        </Typography>
                                        <Typography variant="light" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                                            <SvgColor src="/assets/icons/general/calendar.svg" sx={{ width: 18, height: 18, mr: 0.5 }} />
                                            {fDate(item?.createdAt)}
                                        </Typography>
                                    </Grid>

                                    <Grid xs={3}>
                                        <Typography variant="normal">
                                            {fText(item?.Consumer_FullName)}
                                        </Typography>

                                        <Typography variant="light" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                                            {fMobileNumber(item?.Consumer_NumberPrimary)}

                                            <CustomTooltip label={numberCopy ? "Copied!" : "Copy Number"} Placement="top">
                                                <IconButton
                                                    sx={{ pointerEvents: "auto" }}
                                                    size="small"
                                                    color='success'
                                                    onClick={() => copyTextToClipboard(item?.Consumer_NumberPrimary)}
                                                    onBlur={() => setNumberCopy(false)} >
                                                    <SvgColor src="/assets/icons/general/copy.svg" sx={{ width: 20, height: 20, }} />
                                                </IconButton>
                                            </CustomTooltip>
                                        </Typography>
                                    </Grid>

                                    <Grid xs={2}>
                                        <Typography variant="normal">
                                            {fText(item?.Feeder?.Feeder_Name)} <Typography variant="small" > ({item?.Feeder?.Feeder_Type})</Typography>
                                        </Typography>

                                        <Typography variant="light" color="text.secondary" >
                                            {fText(item?.Feeder?.Substation_Name)}
                                        </Typography>
                                    </Grid>

                                    <Grid xs={1.5}>
                                        <Typography variant="normal">
                                            {item?.Transformer_Capacity || "-"}
                                        </Typography>
                                    </Grid>

                                    <Grid xs={1.5} lg={1.5}>
                                        <Typography variant="normal" >
                                            {fText(item?.Village?.Village_EnName)}
                                        </Typography>
                                    </Grid>

                                    <Grid xs={1.5} lg={1.5}>

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

                                                                trigger={['click']}
                                                                menu={{
                                                                    items: stateMenu,
                                                                }}
                                                                placement="bottomRight"
                                                                arrow={{
                                                                    pointAtCenter: true,
                                                                }}
                                                            >
                                                                {StatusCheck(item?.Complaint_Status)}
                                                            </Dropdown>

                                                    }
                                                </>
                                        }

                                    </Grid>
                                    <Grid xs={0.5} lg={0.5}>

                                        {
                                            flagAction && <Dropdown
                                                trigger={['click']}
                                                menu={{
                                                    items: [{
                                                        label: (
                                                            <Typography variant="normal" onClick={() => editAction(item)} >
                                                                <Box display="flex" alignItems="center" >
                                                                    <SvgColor src="/assets/icons/general/pen.svg" sx={{ width: 25, height: 25, mr: 2 }} />
                                                                    Edit
                                                                </Box>
                                                            </Typography>
                                                        ),
                                                    },
                                                    {
                                                        label: (
                                                            <Typography variant="normal" color="error" onClick={() => { deleteAction(item) }}>
                                                                <Box display="flex" alignItems="center" justifyContent="center">
                                                                    <SvgColor src="/assets/icons/general/trash.svg" sx={{ width: 25, height: 25, mr: 2 }} />
                                                                    Delete
                                                                </Box>
                                                            </Typography>
                                                        ),
                                                    }],
                                                }}
                                                placement="bottomRight"
                                                arrow={{
                                                    pointAtCenter: true,
                                                }}>
                                                <IconButton size="small" sx={{ pointerEvents: "auto" }} >
                                                    <MoreVertIcon fontSize="small" />
                                                </IconButton>
                                            </Dropdown>
                                        }
                                    </Grid>
                                </Grid>
                            </Box>
                    }

                </AccordionSummary >
                <AccordionDetails >

                    <Box sx={{
                        pt: 3,
                        pb: 2,
                        px: 2,
                        mt: 2,
                        mb: 4,
                        borderRadius: 2,
                        border: !isHeader ? (theme) => `dashed 1px ${theme?.palette?.grey?.[500]}` : "",
                        position: "relative"
                    }}>
                        <Typography variant="big" sx={{ position: "absolute", top: -16, left: 15, backgroundColor: "#fff", px: 1 }}>Consumer Details </Typography>

                        <Grid container spacing={2} >
                            <Grid xs={12} sm={6} lg={3} xl={3} >
                                <Typography variant="light" fontWeight={600} color="text.secondary">
                                    Consumer Number
                                </Typography>
                                <Typography variant="normal"  >
                                    {item?.Consumer_Number || ''}
                                </Typography>
                            </Grid>

                            <Grid xs={12} sm={6} lg={3} xl={3}>
                                <Typography variant="light" fontWeight={600} color="text.secondary">
                                    Consumer Name
                                </Typography>
                                <Typography variant="normal" >
                                    {fText(item?.Consumer_FullName)}
                                </Typography>
                            </Grid>

                            <Grid xs={12} sm={6} lg={3} xl={3}>

                                <Typography variant="light" fontWeight={600} color="text.secondary">Mobile Number </Typography>

                                <Typography variant="normal" sx={{ display: "flex", alignItems: "center" }}>
                                    {fMobileNumber(item?.Consumer_NumberPrimary)}
                                    <CustomTooltip label={numberCopy ? "Copied!" : "Copy Number"} Placement="top">
                                        <IconButton
                                            size="small"
                                            color='success'
                                            onClick={() => copyTextToClipboard(item?.Consumer_NumberPrimary)}
                                            onBlur={() => setNumberCopy(false)} >
                                            <SvgColor src="/assets/icons/general/copy.svg" sx={{ width: 20, height: 20, }} />
                                        </IconButton>
                                    </CustomTooltip>
                                </Typography>

                            </Grid>

                            {
                                item?.Consumer_NumberSecondary &&
                                <Grid xs={12} sm={6} lg={3} xl={3}>

                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Mobile Number
                                    </Typography>

                                    <Typography variant="normal" sx={{ display: "flex", alignItems: "center" }}>
                                        {fMobileNumber(item?.Consumer_NumberSecondary)}
                                        <CustomTooltip label={numberCopy ? "Copied!" : "Copy Number"} Placement="top">
                                            <IconButton
                                                size="small"
                                                color='success'
                                                onClick={() => copyTextToClipboard(item?.Consumer_NumberSecondary)}
                                                onBlur={() => setNumberCopy(false)} >
                                                <SvgColor src="/assets/icons/general/copy.svg" sx={{ width: 20, height: 20, }} />
                                            </IconButton>
                                        </CustomTooltip>
                                    </Typography>

                                </Grid>
                            }
                        </Grid>

                    </Box>

                    <Box sx={{
                        py: 3,
                        px: 2,
                        mt: 2,
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
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Contracted Load
                                    </Typography>
                                    <Typography variant="normal">
                                        {item?.Contracted_Load} {item?.Load_Unity}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Village?.Village_EnName &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Village Name
                                    </Typography>
                                    <Typography variant="normal">
                                        {fText(item?.Village?.Village_EnName)}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Feeder?.Feeder_Name &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Feeder Name
                                    </Typography>
                                    <Typography variant="normal">
                                        {fText(item?.Feeder?.Feeder_Name)} ({item?.Feeder?.Feeder_Type})
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Feeder?.Substation_Name &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Substation Name
                                    </Typography>
                                    <Typography variant="normal">
                                        {fText(item?.Feeder?.Substation_Name)}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Number_Of_Connection &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Number Of Connection
                                    </Typography>
                                    <Typography variant="normal">
                                        {item?.Number_Of_Connection}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Transformer_Capacity &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Transformer Capacity
                                    </Typography>
                                    <Typography variant="normal">
                                        {item?.Transformer_Capacity} KVA
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Transformer_Make &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Transformer Make
                                    </Typography>
                                    <Typography variant="normal">
                                        {item?.Transformer_Make}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Serial_Number &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Serial Number
                                    </Typography>
                                    <Typography variant="normal">
                                        {item?.Serial_Number}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Job_Number &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Job Number
                                    </Typography>
                                    <Typography variant="normal">
                                        {item?.Job_Number}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.DispatchNumber_Date &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Dispatch Number
                                    </Typography>
                                    <Typography variant="normal">
                                        {fDate(item?.DispatchNumber_Date)}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Oil_Level &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Oil Level
                                    </Typography>
                                    <Typography variant="normal">
                                        {item?.Oil_Level}  {item?.Oli_Level_Unity}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Oli_Sortage &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Oil Sortage
                                    </Typography>
                                    <Typography variant="normal">
                                        {item?.Oli_Sortage}  {item?.Oli_Sortage_Unity}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.MeterMd &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Meter MD
                                    </Typography>
                                    <Typography variant="normal">
                                        {item?.MeterMd}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Reason &&
                                <Grid xs={12} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">Reason</Typography>
                                    <Typography variant="normal">
                                        {item?.Reason}
                                    </Typography>
                                </Grid>
                            }
                        </Grid>
                    </Box>

                    <Box sx={{
                        py: 3,
                        px: 2,
                        borderRadius: 2,
                        border: !isHeader ? (theme) => `dashed 1px ${theme?.palette?.grey?.[500]}` : "",
                        position: "relative"
                    }}>
                        <Typography variant="big" sx={{ position: "absolute", top: -16, left: 15, backgroundColor: "#fff", px: 1 }}>
                            Check By
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={1}>
                            <CustomAvatar displayName={item?.User?.User_Avatar} />

                            <Box>
                                <Typography variant="normal">
                                    {fText(`${item?.User?.User_FirstName}  ${item?.User?.User_LastName} `)}
                                </Typography>
                                <Typography variant="light" fontWeight={600} color="text.secondary">
                                    {item?.User?.User_Email}
                                </Typography>
                            </Box>

                        </Stack>


                    </Box>

                </AccordionDetails>
            </Accordion >
        </Box >
    );
};
export default ProjectItem;
