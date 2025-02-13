import React from 'react';
// import { useSelector } from 'react-redux';

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from '@mui/material/Stack';
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

// import { StaffID, JuniorEngineerID, } from 'src/constance';

import SvgColor from 'src/components/svg-color';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { CustomAvatar, CustomTooltip } from 'src/components/CustomComponents';

import { message, Dropdown } from 'antd';


const ProjectItem = ({ item, isHeader, meterList, editAction, deleteAction, statusChangeAction, statusChangeButtonLoader }) => {
    const [expanded, setExpanded] = React.useState(false);
    const [numberCopy, setNumberCopy] = React.useState(false);
    // const ReduxUserRole = useSelector(state => state.auth.userRole);
    const [messageApi, contextHolder] = message.useMessage();

    const handleClick = (event) => {
        event.stopPropagation();
        if (meterList) {
            if (meterList.find((product) => product?.Meter_Id === item?.Meter_Id))
                setExpanded(!expanded);
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
        color: (theme) => `${theme?.palette?.grey?.[700]}`,
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

    const copyTextToClipboard = (text) => {
        console.log('Text copied to clipboard!');
        // Check if the Clipboard API is available
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    messageApi.open({
                        type: 'success',
                        content: 'Number Copied!',
                    });
                    setNumberCopy(true);
                    console.log('Text copied to clipboard!');
                })
                .catch((err) => {
                    messageApi.open({
                        type: 'error',
                        content: 'Number not Copied!',
                    });
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

    const StatusCheck = (status) => {
        switch (status) {
            case "NEW_CONSUMER":
                return <Chip color="info" label="New Consumer" size='small' />;
            case "LOAD_EXTENSION":
                return <Chip color="warning" label="Load Extension" size='small' />;
            case "SOLAR_METER":
                return <Chip color='success' label="Solar Meter" size='small' />

            default:
                break;
        }
    }
    return (
        <Box sx={{
            border: (!isHeader && !expanded) ? 1 : (theme) => `solid 1px ${theme?.palette?.grey?.[400]}`,
            borderColor: (!isHeader && !expanded) ? (theme) => `${theme?.palette?.grey?.[300]}` : (theme) => theme.palette.primary?.main
            ,
            borderRadius: 1,
            my: (!isHeader && expanded) ? 1.5 : 1.5,
        }}>
            {contextHolder}
            <Accordion expanded={expanded}
                sx={{
                    // border: (!isHeader && expanded) ? 1 : "",
                    // borderColor: (theme) => `${theme?.palette?.grey?.[400]}`,
                    // py: (!isHeader && expanded) ? 1 : "",
                    // borderRadius: (!isHeader && expanded) ? 3 : "",
                }}>
                <AccordionSummary
                    // expandIcon={isHeader ? " " : (expanded && <RemoveIcon onClick={handleClick} />) || <AddIcon onClick={handleClick} />}
                    sx={{
                        // px: 3,
                        flexDirection: 'row-reverse',
                        '& .MuiAccordionSummary-content': {
                            // alignItems: 'center',

                            '&.Mui-expanded': {
                                margin: '12px 0',
                            }
                        },
                        pointerEvents: 'none',
                        // // pointerEvents: 'none', // Disable pointer events
                        // cursor: 'default', 

                        ...buttonStyle
                    }}>


                    <Box sx={{ width: "100%", }}>
                        <Grid container spacing={2} sx={{ alignItems: "center" }} >
                            <Grid xs={4} >
                                {
                                    statusChangeButtonLoader ?
                                        <ButtonLoader /> :
                                        <>
                                            {
                                                item?.Status ?
                                                    <Chip
                                                        size='small'
                                                        color="error"
                                                        sx={{ pointerEvents: "auto" }}
                                                        onClick={() => statusChangeAction(item, !item?.Status)}
                                                        label="Pending" />
                                                    : <Chip
                                                        size='small'
                                                        color="success"
                                                        sx={{ pointerEvents: "auto" }}
                                                        onClick={() => statusChangeAction(item, !item?.Status)}
                                                        label="Done" />
                                            }
                                        </>
                                }

                            </Grid>

                            <Grid xs={7} >
                                <Typography variant="normal" fontWeight={700} >{item?.Action} </Typography>
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
                                    pointerEvents: "auto"
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
                                        pointerEvents: "auto"
                                    }} />}
                            </Grid>

                            <Grid xs={10.5}>

                                <Typography variant="normal" fontWeight={700} color="text.secondary">Consumer Information </Typography>

                                <Typography variant="light" fontWeight={500} >
                                    {item?.Consumer_Number || ''}
                                </Typography>

                                <Typography variant="light" fontWeight={500}>
                                    {fText(item?.Consumer_FullName)}
                                </Typography>

                            </Grid>

                            <Grid xs={1.5} sx={{ display: "block", textAlign: "end", pointerEvents: "auto" }} >

                                <Dropdown
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

                                    <MoreVertIcon fontSize="small" />

                                </Dropdown>

                            </Grid>

                            <Grid xs={8}>
                                <Typography variant="normal" fontWeight={700} color="text.secondary" > Consumer Number </Typography>
                                <Typography
                                    variant="light"
                                    fontWeight={500}
                                    display="flex"
                                    sx={{ alignItems: "center", }}>

                                    {fMobileNumber(item?.Consumer_NumberPrimary)}

                                    <CustomTooltip label={numberCopy ? "Copied!" : "Copy Number"} Placement="top">
                                        <Box
                                            tabIndex={0}
                                            onClick={() => copyTextToClipboard(item?.Consumer_NumberPrimary)}
                                            sx={{ cursor: 'pointer', mx: 1, pointerEvents: "auto" }}>
                                            <SvgColor src="/assets/icons/general/copy.svg" sx={{ width: 20, height: 20, }} />
                                        </Box>
                                    </CustomTooltip>
                                </Typography>
                            </Grid>

                            <Grid xs={4}>
                                {StatusCheck(item?.Meter_Type)}
                            </Grid>

                            <Grid xs={8}>
                                <Typography variant="normal" fontWeight={700} color="text.secondary">
                                    Village
                                </Typography>

                                <Typography variant="light" fontWeight={500}>
                                    {fText(item?.Village?.Village_EnName)}
                                </Typography>
                            </Grid>

                            <Grid xs={4}>
                                <Typography variant="normal" fontWeight={700} color="text.secondary">
                                    Create Date
                                </Typography>

                                <Typography variant="light" fontWeight={500}>
                                    {fDate(item?.createdAt)}
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
                            {
                                item?.Consumer_Number &&
                                <Grid xs={12} sm={6} lg={3} xl={3} >
                                    <Typography variant="normal" fontWeight={700} color="text.secondary">
                                        Consumer Number
                                    </Typography>
                                    <Typography variant="light" fontWeight={500}>
                                        {item?.Consumer_Number}
                                    </Typography>
                                </Grid>
                            }


                            <Grid xs={12} sm={6} lg={3} xl={3}>
                                <Typography variant="normal" fontWeight={700} color="text.secondary">
                                    Consumer Name
                                </Typography>
                                <Typography variant="light" fontWeight={500}>
                                    {fText(item?.Consumer_FullName)}
                                </Typography>
                            </Grid>

                            <Grid xs={12} sm={6} lg={3} xl={3}>
                                <Typography variant="normal" fontWeight={700} color="text.secondary">Primary Number </Typography>

                                <Typography
                                    variant="light"
                                    fontWeight={500}
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
                                    <Typography variant="normal" fontWeight={700} color="text.secondary">Secondary Number </Typography>

                                    <Typography
                                        variant="light"
                                        fontWeight={500}
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
                            Details
                        </Typography>
                        <Grid container spacing={2} >

                            {
                                item?.Contracted_Load &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >

                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Contracted Load
                                    </Typography>

                                    <Typography variant="normal" >
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
                                    <Typography variant="normal" >
                                        {fText(item?.Village?.Village_EnName)}
                                    </Typography>
                                </Grid>
                            }


                            {
                                item?.Tariff &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Tariff
                                    </Typography>
                                    <Typography variant="normal" >
                                        {fText(item?.Tariff)}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Type_Connection &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Type Connection
                                    </Typography>
                                    <Typography variant="normal" >
                                        {fText(item?.Type_Connection)}
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
                                    <Typography variant="normal" noWrap fontWeight={500}>
                                        {fText(`${item?.User?.User_FirstName}  ${item?.User?.User_LastName} `)}
                                        <Typography variant="light" color="text.secondary" fontWeight={100} sx={{ display: "flex" }}>
                                            {item?.User?.User_Email}
                                        </Typography>
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>

                </AccordionDetails>
            </Accordion>
        </Box >
    );
};
export default ProjectItem;
