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
        // ✅ Status and Actions  
        "fa-solid fa-check",
        "fa-solid fa-xmark",
        "fa-solid fa-circle-info",
        "fa-solid fa-bell",
        "fa-solid fa-lock",
        "fa-solid fa-unlock",
        "fa-solid fa-shield-halved",
        "fa-solid fa-eye",
        "fa-solid fa-eye-slash",
        "fa-solid fa-heart",
        "fa-solid fa-thumbs-up",
        "fa-solid fa-thumbs-down",
        "fa-solid fa-exclamation",
        "fa-solid fa-question",
        "fa-solid fa-exclamation-triangle",
        "fa-solid fa-clipboard-check",
        "fa-solid fa-flag",
      
        // 💰 Finance and Money  
        "fa-solid fa-wallet",
        "fa-solid fa-piggy-bank",
        "fa-solid fa-credit-card",
        "fa-solid fa-money-bill",
        "fa-solid fa-coins",
        "fa-solid fa-hand-holding-dollar",
        "fa-solid fa-sack-dollar",
        "fa-solid fa-chart-line",
        "fa-solid fa-chart-pie",
        "fa-solid fa-file-invoice",
        "fa-solid fa-file-invoice-dollar",
        "fa-solid fa-calculator",
        "fa-solid fa-money-check",
        "fa-solid fa-building-columns", // Bank  
        "fa-solid fa-receipt",
        "fa-solid fa-dollar-sign",
        "fa-solid fa-bitcoin-sign",
        "fa-solid fa-euro-sign",
        "fa-solid fa-yen-sign",
        "fa-solid fa-rupee-sign",
        "fa-solid fa-percent",
        "fa-solid fa-balance-scale",
        "fa-solid fa-cash-register",
      
        // 🏠 Home and Building  
        "fa-solid fa-house",
        "fa-solid fa-building",
        "fa-solid fa-city",
        "fa-solid fa-tree",
        "fa-solid fa-landmark",
        "fa-solid fa-hotel",
        "fa-solid fa-bed",
        "fa-solid fa-door-open",
        "fa-solid fa-chair",
        "fa-solid fa-bath",
        "fa-solid fa-lightbulb",
        "fa-solid fa-couch",
      
        // 🚗 Travel and Transport  
        "fa-solid fa-plane",
        "fa-solid fa-train",
        "fa-solid fa-taxi",
        "fa-solid fa-car",
        "fa-solid fa-bus",
        "fa-solid fa-route",
        "fa-solid fa-mountain-sun",
        "fa-solid fa-map-location-dot",
        "fa-solid fa-ship",
        "fa-solid fa-motorcycle",
        "fa-solid fa-helicopter",
        "fa-solid fa-compass",
        "fa-solid fa-anchor",
        "fa-solid fa-rocket",
        "fa-solid fa-truck",
        "fa-solid fa-bicycle",
      
        // 🍔 Food and Drink  
        "fa-solid fa-utensils",
        "fa-solid fa-pizza-slice",
        "fa-solid fa-burger",
        "fa-solid fa-mug-hot",
        "fa-solid fa-champagne-glasses",
        "fa-solid fa-apple-whole",
        "fa-solid fa-ice-cream",
        "fa-solid fa-coffee",
        "fa-solid fa-glass-whiskey",
        "fa-solid fa-lemon",
        "fa-solid fa-wine-glass",
        "fa-solid fa-beer-mug-empty",
        "fa-solid fa-bowl-food",
      
        // 🏆 Sports and Games  
        "fa-solid fa-volleyball",
        "fa-solid fa-chess",
        "fa-solid fa-chess-king",
        "fa-solid fa-chess-queen",
        "fa-solid fa-chess-bishop",
        "fa-solid fa-broom-ball",
        "fa-solid fa-football",
        "fa-solid fa-basketball",
        "fa-solid fa-table-tennis-paddle-ball",
        "fa-solid fa-dice",
        "fa-solid fa-baseball-bat-ball",
        "fa-solid fa-hockey-puck",
        "fa-solid fa-skiing",
        "fa-solid fa-bowling-ball",
      
        // 👨‍⚕️ Health and Medical  
        "fa-solid fa-stethoscope",
        "fa-solid fa-hand-holding-heart",
        "fa-solid fa-pills",
        "fa-solid fa-tooth",
        "fa-solid fa-heartbeat",
        "fa-solid fa-hospital",
        "fa-solid fa-user-nurse",
        "fa-solid fa-syringe",
        "fa-solid fa-ambulance",
        "fa-solid fa-band-aid",
        "fa-solid fa-lungs",
        "fa-solid fa-virus",
        "fa-solid fa-prescription-bottle",
        "fa-solid fa-thermometer",
        "fa-solid fa-dna",
      
        // 💼 Business and Work  
        "fa-solid fa-briefcase",
        "fa-solid fa-wallet",
        "fa-solid fa-business-time",
        "fa-solid fa-credit-card",
        "fa-solid fa-address-card",
        "fa-solid fa-file-invoice",
        "fa-solid fa-chart-pie",
        "fa-solid fa-chart-line",
        "fa-solid fa-laptop",
        "fa-solid fa-desktop",
        "fa-solid fa-globe",
        "fa-solid fa-calendar",
        "fa-solid fa-folder",
        "fa-solid fa-file",
        "fa-solid fa-balance-scale",
      
        // 🖥️ Technology  
        "fa-solid fa-laptop",
        "fa-solid fa-desktop",
        "fa-solid fa-microchip",
        "fa-solid fa-hammer",
        "fa-solid fa-charging-station",
        "fa-solid fa-satellite",
        "fa-solid fa-wifi",
        "fa-solid fa-signal",
        "fa-solid fa-cloud",
        "fa-solid fa-server",
        "fa-solid fa-robot",
        "fa-solid fa-database",
        "fa-solid fa-battery-full",
        "fa-solid fa-bolt",
      
        // 🎭 Entertainment  
        "fa-solid fa-masks-theater",
        "fa-solid fa-music",
        "fa-solid fa-camera-retro",
        "fa-solid fa-film",
        "fa-solid fa-fire-flame-curved",
        "fa-solid fa-headphones",
        "fa-solid fa-ticket",
        "fa-solid fa-tv",
        "fa-solid fa-video",
        "fa-solid fa-photo-film",
        "fa-solid fa-gamepad",
        "fa-solid fa-guitar",
      
        // 📞 Communication  
        "fa-solid fa-phone",
        "fa-solid fa-envelope",
        "fa-solid fa-comment",
        "fa-solid fa-user",
        "fa-solid fa-address-book",
        "fa-solid fa-at",
        "fa-solid fa-fax",
        "fa-solid fa-paper-plane",
        "fa-solid fa-rss",
        "fa-solid fa-sms",
      
        // 🌍 Nature and Animals  
        "fa-solid fa-tree",
        "fa-solid fa-mountain",
        "fa-solid fa-paw",
        "fa-solid fa-umbrella",
        "fa-solid fa-water",
        "fa-solid fa-sun",
        "fa-solid fa-moon",
        "fa-solid fa-wind",
        "fa-solid fa-snowflake",
        "fa-solid fa-leaf",
        "fa-solid fa-fire",
      
        // 🔧 Tools and Settings  
        "fa-solid fa-cog",
        "fa-solid fa-gear",
        "fa-solid fa-wrench",
        "fa-solid fa-paint-roller",
        "fa-solid fa-toolbox",
        "fa-solid fa-screwdriver",
        "fa-solid fa-plug",
        "fa-solid fa-key",
        "fa-solid fa-lock",
        "fa-solid fa-unlock",
        "fa-solid fa-cogs",
        "fa-solid fa-shield-halved",
      
        // 🚨 Security  
        "fa-solid fa-shield-halved",
        "fa-solid fa-shield-heart",
        "fa-solid fa-lock",
        "fa-solid fa-unlock",
        "fa-solid fa-user-secret",
        "fa-solid fa-fingerprint",
        "fa-solid fa-key",
      
        // 🚀 Miscellaneous  
        "fa-solid fa-infinity",
        "fa-solid fa-egg",
        "fa-solid fa-puzzle-piece",
        "fa-solid fa-route",
        "fa-solid fa-smile",
        "fa-solid fa-magic",
        "fa-solid fa-magnet",
        "fa-solid fa-trophy",
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

