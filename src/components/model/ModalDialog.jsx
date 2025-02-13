import * as React from 'react';

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Dialog from '@mui/material/Dialog';
import Typography from "@mui/material/Typography";
import CloseIcon from '@mui/icons-material/Close';
import CardHeader from "@mui/material/CardHeader";
import IconButton from '@mui/material/IconButton';
import CardContent from "@mui/material/CardContent";

export const ModalDialog = ({ open, handleClose, children, title, ...props }) => (
    <Dialog
        open={open}
        onClose={handleClose}
        {...props}>
        <Card>
            <CardHeader
                title={
                    <Box sx={{
                        justifyContent: 'space-between',
                        display: "flex",
                        m: 1.5, padding: 0
                    }}>
                        <Typography variant='h5' sx={{ margin: 0, padding: 0 }} >{title}</Typography>

                        <IconButton aria-label="close" size='small' sx={{}} onClick={handleClose}>
                            <CloseIcon fontSize='small' />
                        </IconButton>

                    </Box >
                }
                sx={{
                    margin: 0, padding: 0,
                    // borderBottom: "1px solid #ebebeb"
                    borderBottom: (theme) => `solid 1px ${theme?.palette?.grey[300]}`
                }}
            />
            <CardContent sx={{ minWidth: 0, }} >
                {children}
            </CardContent>

        </Card>
    </Dialog>
)
