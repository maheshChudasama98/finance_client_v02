import * as React from 'react';

import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

// ----------------------------------------------------------------------

export const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    '&:not(:last-child)': { borderBottom: 0, },
    '&::before': { display: 'none' },
}));

export const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '1.2rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    borderBottom: `1px dashed rgba(0, 0, 0, .125)`,
    flexDirection: 'row',
    justifyContent: 'space-between',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': { transform: 'rotate(90deg)', },
    '& .MuiAccordionSummary-content': { marginLeft: theme.spacing(1), },
}));

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    // backgroundColor :"#dfe3e8",
    borderBottom: `1px dashed rgba(0, 0, 0, .125)`,
}));