import React from 'react';

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

import SvgColor from 'src/components/svg-color';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { CustomAvatar, CustomTooltip } from 'src/components/CustomComponents';

import { message, Dropdown, } from 'antd';

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
    }


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

    const StatusCheck = (status) => {
        switch (status) {
            case "NEW_CONSUMER":
                return <Chip color="info" label="New Consumer" />;
            case "LOAD_EXTENSION":
                return <Chip color="warning" label="Load Extension" />;
            case "SOLAR_METER":
                return <Chip color='success' label="Solar Meter" />
            default:
                break;
        }
    }

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
                        // px: 3,
                        flexDirection: 'row-reverse',
                        '& .MuiAccordionSummary-content': {
                            alignItems: 'center',

                            '&.Mui-expanded': {
                                margin: '12px 0',
                            }
                        },
                        // pointerEvents: isHeader ? 'none' : 'auto',
                        pointerEvents: 'none',
                        ...buttonStyle
                    }}>
                    {
                        isHeader ?

                            <Box sx={{ width: "100%", mx: 1 }}>
                                <Grid container spacing={2} sx={{ alignItems: 'center' }} >
                                    <Grid xs={2.5} >
                                        <Typography variant="tableHead">Consumer Information</Typography>
                                    </Grid>

                                    <Grid xs={2.5}>
                                        <Typography variant="tableHead">Consumer number</Typography>
                                    </Grid>

                                    <Grid xs={2}>
                                        <Typography variant="tableHead">Village</Typography>
                                    </Grid>

                                    <Grid xs={2}>
                                        <Typography variant="tableHead">Type</Typography>
                                    </Grid>

                                    <Grid xs={1.5}>
                                        <Typography variant="tableHead">Create Date</Typography>
                                    </Grid>

                                    <Grid xs={1}>
                                        <Typography variant="tableHead">Status</Typography>
                                    </Grid>

                                    <Grid xs={0.5}>
                                        <Typography variant="tableHead">Action</Typography>
                                    </Grid>
                                </Grid>

                            </Box> :

                            <Box sx={{ width: "100%", mx: 1, }}>
                                <Grid container spacing={2} sx={{ alignItems: 'center' }} >
                                    <Grid xs={2.5} sx={{ alignItems: 'center' }}>
                                        {
                                            item?.Consumer_Number &&
                                            <Typography variant="normal" >
                                                {item?.Consumer_Number || ''}
                                            </Typography>
                                        }
                                        <Typography variant="normal" >
                                            {fText(item?.Consumer_FullName)}
                                        </Typography>

                                    </Grid>

                                    <Grid xs={2.5}>

                                        <Typography variant="normal" sx={{ display: "flex", alignItems: "center" }}>
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
                                            {fText(item?.Village?.Village_EnName)}
                                        </Typography>
                                    </Grid>

                                    <Grid xs={2}>
                                        {StatusCheck(item?.Meter_Type)}
                                    </Grid>

                                    <Grid xs={1.5}>
                                        <Typography variant="normal" >
                                            {fDate(item?.createdAt)}
                                        </Typography>
                                    </Grid>

                                    <Grid xs={1}>
                                        {
                                            statusChangeButtonLoader ?
                                                <ButtonLoader /> :
                                                <>
                                                    {
                                                        item?.Status ?
                                                            <Chip
                                                                color="error"
                                                                sx={{ pointerEvents: "auto" }}
                                                                onClick={() => statusChangeAction(item, !item?.Status)}
                                                                label="Pending" />
                                                            : <Chip
                                                                color="success"
                                                                sx={{ pointerEvents: "auto" }}
                                                                onClick={() => statusChangeAction(item, !item?.Status)}
                                                                label="Done" />
                                                    }
                                                </>
                                        }

                                    </Grid>

                                    <Grid xs={0.5} lg={0.5}>
                                        <Dropdown
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
                        <Typography variant="big" sx={{ position: "absolute", top: -16, left: 15, backgroundColor: "#fff", px: 1 }}>Consumer Information </Typography>

                        <Grid container spacing={2} >
                            {
                                item?.Consumer_Number &&
                                <Grid xs={3} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Consumer Number
                                    </Typography>
                                    <Typography variant="normal" >
                                        {item?.Consumer_Number || ''}
                                    </Typography>
                                </Grid>
                            }
                            {
                                item?.Consumer_FullName &&
                                <Grid xs={3} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Consumer Name
                                    </Typography>
                                    <Typography variant="normal" >
                                        {fText(item?.Consumer_FullName)}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Consumer_NumberPrimary &&
                                <Grid xs={3} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Primary Number
                                    </Typography>
                                    <Typography variant="normal" >
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
                            }

                            {
                                item?.Consumer_NumberSecondary &&
                                <Grid xs={12} sm={6} lg={3} xl={3}>
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Secondary Number
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
                            Connection Details
                        </Typography>

                        <Grid container spacing={2} >
                            {
                                item?.Contracted_Load_Old &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    {
                                        item?.Meter_Type === "SOLAR_METER" ?
                                            <Typography variant="light" fontWeight={600} color="text.secondary">
                                                Contracted Load
                                            </Typography>
                                            :

                                            <Typography variant="light" fontWeight={600} color="text.secondary">
                                                Contracted Load Old
                                            </Typography>

                                    }

                                    <Typography variant="normal" >
                                        {item?.Contracted_Load_Old} {item?.Load_Unity_Old}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Contracted_Load &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    {
                                        item?.Meter_Type === "SOLAR_METER" ?
                                            <Typography variant="light" fontWeight={600} color="text.secondary">
                                                Solar Load
                                            </Typography>
                                            :

                                            <Typography variant="light" fontWeight={600} color="text.secondary">
                                                Contracted Load New
                                            </Typography>

                                    }
                                    <Typography variant="normal" >
                                        {item?.Contracted_Load} {item?.Load_Unity}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Meter_Capacity_Old &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Meter Capacity Old
                                    </Typography>
                                    <Typography variant="normal" >
                                        {item?.Meter_Capacity_Old}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Meter_Capacity &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Meter Capacity New
                                    </Typography>
                                    <Typography variant="normal" >
                                        {item?.Meter_Capacity}
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
                                item?.Feeder?.Feeder_Name &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Feeder Name
                                    </Typography>
                                    <Typography variant="normal" >
                                        {fText(item?.Feeder?.Feeder_Name)}
                                        <Typography variant="light" fontWeight={100}>
                                            {" "}({item?.Feeder?.Feeder_Type})
                                        </Typography>
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
                                    <Typography variant="normal" >
                                        {item?.Number_Of_Connection}
                                    </Typography>
                                </Grid>
                            }

                            {
                                item?.Transformer_Capacity &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Capacity
                                    </Typography>
                                    <Typography variant="light" fontWeight={500}>
                                        {item?.Transformer_Capacity}
                                        <Typography variant="normal" >
                                            {" "}({item?.Transformer_Capacity && "KVA"})
                                        </Typography>
                                    </Typography>

                                </Grid>
                            }

                            {
                                item?.Transformer_Make &&
                                <Grid xs={12} sm={6} md={4} lg={3} xl={2.4} >
                                    <Typography variant="light" fontWeight={600} color="text.secondary">
                                        Transformer Make
                                    </Typography>
                                    <Typography variant="normal" >
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
                                    <Typography variant="normal" >
                                        {item?.Serial_Number}
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
