import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';

export const CustomAvatar = ({
    displayName,
    photoURL,
    handleOpen,
    open,
    width = { xs: 40, md: 45, lg: 56 },  // default width
    height = { xs: 40, md: 45, lg: 56 }, // default height
    icon,
    ...props
}) => {
    // Calculate the size for IconButton and Avatar
    const buttonSize = { width, height };

    const avatarSize = {
        width: { xs: Math.floor(width?.xs || 0 * 0.9), md: Math.floor(width?.md || 0 * 0.9), lg: Math.floor(width?.lg || 0 * 0.9) }, // 90% of button size
        height: { xs: Math.floor(height?.xs || 0 * 0.9), md: Math.floor(height?.md || 0 * 0.9), lg: Math.floor(height?.lg || 0 * 0.9) }, // 90% of button size
    };

    return (
        <IconButton
            onClick={handleOpen}
            sx={{
                ...buttonSize,
                background: (theme) => alpha(theme.palette.grey[900], 0.08),
                ...(open && {
                    background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                }),
            }}
        >
            <Avatar
                src={photoURL}
                alt={displayName}
                sx={{
                    ...avatarSize,
                    border: (theme) => `solid 2px ${theme.palette.background.default}`,
                    background: (theme) => alpha(theme.palette.primary.main, 0.80),
                }}
                {...props}
            >
                <Typography variant="light">
                    {displayName?.toUpperCase()}
                </Typography>
            </Avatar>
        </IconButton>
    );
};

CustomAvatar.propTypes = {
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
    handleOpen: PropTypes.func,
    open: PropTypes.bool,
    width: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.number,
    ]),
    height: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.number,
    ]),
};

