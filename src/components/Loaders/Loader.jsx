import React from 'react'
// import 'app/styles/loader.css'

import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles';

const Loader = () => {
    const theme = useTheme();
    const PRIMARY_LIGHT = theme.palette.primary.main;
    return (
        <Box sx={{ textAlign: 'center', p: 3, m: 'auto' }}>
            <div className="spinner" >
                <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
                <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
                <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
                <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
                <div className="dot" style={{ '--dot-color': PRIMARY_LIGHT }} />
            </div>
        </Box>)
}
export default Loader
