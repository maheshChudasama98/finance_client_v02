import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import IconArray from './IconArray';

export default function AccountMenu({ color = "primary", defaultValue, callBack, iconWidth = 40 }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIcon, setSelectedIcon] = useState(defaultValue);
    const open = Boolean(anchorEl);
    const IconArray = [];

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleSelectIcon = (item) => {
        setSelectedIcon(item?.icon)
        setAnchorEl(null)
        callBack(item.value)
    };

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', margin: 0, padding: 0 }}>
                <Tooltip title="select icon">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ margin: 0, padding: 0 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: iconWidth, height: iconWidth, background: color, }}  >
                            {selectedIcon ?
                                <FontAwesomeIcon
                                    icon={selectedIcon || ''}
                                    background={color}
                                /> :
                                <FontAwesomeIcon
                                    icon={faQuestion || ''}
                                    background={color}
                                />
                            }
                        </Avatar>
                    </IconButton>
                </Tooltip>
                <h5 style={{ margin: '0px 10px', padding: '0', fontSize: '18px', display: 'inline' }}>
                    Select Icon
                </h5>
            </Box>
            <Menu

                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'auto',
                        maxHeight: '200px', // Set max height for the menu
                        maxWidth: '300px', // Set max width for the menu
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        padding: '10px', // Add padding for spacing
                        position: 'relative',

                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 1,
                            left: 15,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 50,
                        },
                    },
                }}
                anchorOrigin={{ horizontal: '', vertical: 'bottom' }}
            >
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                    {
                        IconArray && IconArray.map((item, key) => (
                            <IconButton
                                key={key}
                                disableRipple
                                disableFocusRipple
                                disableTouchRipple
                                sx={{
                                    background: "#ffff",
                                }}
                                onClick={() => handleSelectIcon(item)}
                            >
                                <FontAwesomeIcon icon={item?.icon} color={color} />
                            </IconButton>
                        ))
                    }
                </Box>
            </Menu>
        </>
    );
}