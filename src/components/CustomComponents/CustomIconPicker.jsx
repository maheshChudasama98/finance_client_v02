import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';

import { ErrorMessage } from 'formik';

import { CustomAvatar } from './CustomAvatar';

export const CustomIconPicker = ({
    field,
    formik,
    color,
    required,
    handleColor,
    ...props
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleSelectIcon = (item) => {
        setAnchorEl(null);
        formik?.setFieldValue(field, item);
    };

    const iconClasses = [
        "fa-solid fa-check",
        "fa-solid fa-home",
        "fa-solid fa-cog",
        "fa-brands fa-github",
        "fa-brands fa-facebook",
        "fa-brands fa-twitter",
        "fa-brands fa-instagram",
        "fa-brands fa-linkedin",
        "fa-solid fa-search",
        "fa-solid fa-lock",
        "fa-solid fa-unlock",
        "fa-solid fa-bell",
        "fa-solid fa-house",
        "fa-solid fa-user",
        "fa-solid fa-image",
        "fa-solid fa-phone",
        "fa-solid fa-envelope",
        "fa-solid fa-star",
        "fa-solid fa-location-dot",
        "fa-solid fa-music",
        "fa-solid fa-heart",
        "fa-solid fa-circle-xmark",
        "fa-solid fa-truck-fast",
        "fa-solid fa-camera-retro",
        "fa-solid fa-comment",
        "fa-solid fa-face-smile",
        "fa-solid fa-shield-halved",
        "fa-solid fa-cart-shopping",
        "fa-solid fa-circle-info",
        "fa-solid fa-car",
        "fa-solid fa-mug-hot",
        "fa-solid fa-umbrella",
        "fa-solid fa-gift",
        "fa-solid fa-gear",
        "fa-solid fa-book",
        "fa-solid fa-thumbs-up",
        "fa-solid fa-thumbs-down",
        "fa-solid fa-truck",
        "fa-solid fa-city",
        "fa-solid fa-ticket",
        "fa-solid fa-tree",
        "fa-solid fa-paint-roller",
        "fa-solid fa-person",
        "fa-solid fa-person-dress",
        "fa-solid fa-bath",
        "fa-solid fa-landmark",
        "fa-solid fa-chart-simple",
        "fa-solid fa-shirt",
        "fa-solid fa-business-time",
        "fa-solid fa-stethoscope",
        "fa-solid fa-hand-holding-heart",
        "fa-solid fa-mountain-sun",
        "fa-solid fa-credit-card",
        "fa-solid fa-address-card",
        "fa-solid fa-laptop",
        "fa-solid fa-desktop",
        "fa-solid fa-icons",
        "fa-solid fa-brain",
        "fa-solid fa-hotel",
        "fa-solid fa-wallet",
        "fa-solid fa-train",
        "fa-solid fa-microchip",
        "fa-solid fa-hammer",
        "fa-solid fa-route",
        "fa-solid fa-puzzle-piece",
        "fa-solid fa-volleyball",
        "fa-solid fa-utensils",
        "fa-solid fa-user-graduate",
        "fa-solid fa-tooth",
        "fa-solid fa-taxi",
        "fa-solid fa-suitcase-rolling",
        "fa-solid fa-shield-heart",
        "fa-solid fa-pizza-slice",
        "fa-solid fa-pills",
        "fa-solid fa-paw",
        "fa-solid fa-masks-theater",
        "fa-solid fa-map-location-dot",
        "fa-solid fa-infinity",
        "fa-solid fa-infinity",
        "fa-solid fa-fire-flame-curved",
        "fa-solid fa-egg",
        "fa-solid fa-chess-queen",
        "fa-solid fa-chess-king",
        "fa-solid fa-chess",
        "fa-solid fa-chess-bishop",
        "fa-solid fa-charging-station",
        "fa-solid fa-champagne-glasses",
        "fa-solid fa-burger",
        "fa-solid fa-bus",
        "fa-solid fa-broom-ball",
        "fa-solid fa-box",
        "fa-solid fa-bottle-water",
        "fa-solid fa-bell-concierge",
        "fa-solid fa-bed",
        "fa-solid fa-apple-whole",
    ];

    return (
        <>
            <Box
                sx={{
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >

                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ margin: 0, padding: 0 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <CustomAvatar
                        icon={formik?.errors[field] ? "fa-solid fa-exclamation" : formik?.values[field] || "fa-solid fa-exclamation"}
                        bgColor={formik?.errors[field] ? "#FF5630" : color || "#777"}
                    />
                </IconButton>

                <Typography
                    variant="bold"
                    color={formik?.errors[field] ? "error" : ""}
                    sx={{ mx: 1 }}
                >
                    Select Icon
                    {
                        required &&
                        <Typography
                            variant="bold"
                            sx={{ display: "inline", ml: 0.5 }}
                            color="error"
                        >
                            *
                        </Typography>
                    }
                </Typography>
            </Box>

            <ErrorMessage name={field}>
                {(msg) => <FormHelperText error>{msg}</FormHelperText>}
            </ErrorMessage>

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
                        maxHeight: '300px',
                        maxWidth: '300px',
                        filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.32))',
                        padding: '10px',
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
                        iconClasses && iconClasses.map((item, key) => (
                            <IconButton
                                key={key}
                                disableRipple
                                disableFocusRipple
                                disableTouchRipple
                                sx={{ background: "#FFF", }}
                                onClick={() => handleSelectIcon(item)}
                            >
                                <i
                                    className={item}
                                    style={{ color: color || "#777" }}
                                />
                            </IconButton>
                        ))
                    }
                </Box>
            </Menu>
        </>
    );
};

CustomIconPicker.propTypes = {
    field: PropTypes.string,
    color: PropTypes.string,
    formik: PropTypes.object,
    handleColor: PropTypes.func,
    required: PropTypes.bool,
};

