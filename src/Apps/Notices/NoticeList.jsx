import React from 'react';
// import { useSelector } from 'react-redux';

import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import AddIcon from "@mui/icons-material/Add";
import Grid from '@mui/material/Unstable_Grid2';
import Accordion from "@mui/material/Accordion";
import IconButton from '@mui/material/IconButton';
import Typography from "@mui/material/Typography";
import RemoveIcon from "@mui/icons-material/Remove";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from '@mui/material/AccordionSummary';

import { fDate } from 'src/utils/format-time';

import SvgColor from 'src/components/svg-color';

import { Dropdown } from 'antd';

import NoticesForm from './NoticesForm';
import PDFGenerate from './PDFGenerate';


const NoticeList = ({ item, isHeader, arrayList, editAction, deleteAction, feederList, }) => {

    const [expanded, setExpanded] = React.useState(false);
    const [pdfLoader, setPdfLoader] = React.useState(false);

    const handleClick = (event) => {
        event.stopPropagation();
        if (arrayList) {
            if (arrayList.find((product) => product?.Notice_Id === item?.Notice_Id))
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
        py: 0.5,
        color: (theme) => `${theme?.palette?.grey?.[600]}`,
        backgroundColor: (theme) => `${theme?.palette?.grey?.[200]}`
    }
    if (!isHeader) {
        buttonStyle = {
            py: 1,
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

    return (
        <Box sx={{
            borderBottom: (!isHeader && !expanded) ? (theme) => `dashed 1px ${theme?.palette?.grey?.[400]}` : "",
            my: (!isHeader && expanded) ? 1.5 : "",
        }}>
            <Accordion expanded={expanded}
                sx={{
                    border: (!isHeader && expanded) ? 1 : "",
                    borderColor: (theme) => `${theme?.palette?.grey?.[400]}`,
                    py: (!isHeader && expanded) ? 1 : "",
                    borderRadius: (!isHeader && expanded) ? 3 : "",
                }}>
                <AccordionSummary
                    expandIcon={isHeader ? " " : (expanded && <RemoveIcon onClick={handleClick} />) || <AddIcon onClick={handleClick} />}
                    sx={{
                        flexDirection: 'row-reverse',
                        '& .MuiAccordionSummary-content': {
                            alignItems: 'center',

                            '&.Mui-expanded': {
                                margin: '12px 0',
                            }
                        },
                        ...buttonStyle
                    }}>
                    {
                        isHeader ?

                            <Box sx={{ width: "100%", mx: 2 }}>
                                <Grid container spacing={2} sx={{ alignItems: 'center' }} >
                                    <Grid xs={3} >
                                        <Typography variant="tableHead" color="text.secondary" > Notice Name </Typography>
                                    </Grid>

                                    <Grid xs={3} >
                                        <Typography variant="tableHead" color="text.secondary"  >Start Date</Typography>
                                    </Grid>

                                    <Grid xs={3}>
                                        <Typography variant="tableHead" color="text.secondary" >End Date</Typography>
                                    </Grid>

                                    <Grid xs={2}>
                                        <Typography variant="tableHead" color="text.secondary" >Active </Typography>
                                    </Grid>

                                    <Grid xs={1}>
                                        <Typography variant="tableHead" color="text.secondary" >Action</Typography>
                                    </Grid>
                                </Grid>

                            </Box> :

                            <Box sx={{ width: "100%", mx: 2 }}>
                                <Grid container spacing={2} sx={{ alignItems: 'center' }} >

                                    <Grid xs={3}>
                                        <Typography variant="normal" >
                                            {item?.Notice_Name}
                                        </Typography>
                                    </Grid>

                                    <Grid xs={3}>
                                        <Typography variant="normal">
                                            {fDate(item?.Start_Date)}
                                        </Typography>
                                    </Grid>

                                    <Grid xs={3}>
                                        <Typography variant="normal" >
                                            {fDate(item?.End_Date)}
                                        </Typography>
                                    </Grid>

                                    <Grid xs={2}>
                                        <Typography variant="normal">
                                            {
                                                pdfLoader ?
                                                    <PDFGenerate notice={item}  setFlag={() => setPdfLoader(false)} /> :
                                                    <Button variant="outlined" color='success' onClick={() => { setPdfLoader(true) }} >PDF</Button>
                                            }
                                        </Typography>
                                    </Grid>

                                    <Grid xs={1}>
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
                                            <IconButton aria-label="delete" size="small" >
                                                <MoreVertIcon fontSize="small" />
                                            </IconButton>
                                        </Dropdown>
                                    </Grid>


                                </Grid>
                            </Box>
                    }
                </AccordionSummary>

                <AccordionDetails >
                    {/* */}
                    <NoticesForm
                        feederList={feederList}
                        editObject={item}
                        editAction={editAction} />
                </AccordionDetails>

            </Accordion>
        </Box >
    );
};
export default NoticeList;
