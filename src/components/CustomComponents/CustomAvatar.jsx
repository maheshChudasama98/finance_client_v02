import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { ImgUrl } from 'src/constance';
import { success } from 'src/theme/palette';

export const CustomAvatar = ({
  open,
  error,
  icon,
  imgDefault = true,
  displayName,
  iconSize = 20,
  bgColor = success.main,
  photoURL,
  handleOpen,
  width = { xs: 40, md: 45, lg: 56 }, // default width
  height = { xs: 40, md: 45, lg: 56 }, // default height
  borderDashed = false,
  ...props
}) => {
  // Calculate the size for IconButton and Avatar
  const buttonSize = { width, height };

  const avatarSize = {
    width: {
      xs: Math.floor(width.xs * 0.9),
      md: Math.floor(width.md * 0.9),
      lg: Math.floor(width.lg * 0.9),
    }, // 90% of button size
    height: {
      xs: Math.floor(height.xs * 0.9),
      md: Math.floor(height.md * 0.9),
      lg: Math.floor(height.lg * 0.9),
    }, // 90% of button size
  };

  if (imgDefault) {
    photoURL = ImgUrl + photoURL || '';
  }

  return (
    <IconButton
      onClick={handleOpen}
      sx={{
        ...buttonSize,
        background: (theme) => (borderDashed !== true ? alpha(theme.palette.grey[900], 0.08) : ''),
        border: (theme) => (borderDashed === true ? `dashed 1px ${theme.palette.grey[400]}` : ''),
        ...(open && {
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
        }),
        ...(error && {
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.error.light} 0%, ${theme.palette.error.main} 100%)`,
        }),
      }}
    >
      <Avatar
        src={photoURL}
        alt={displayName}
        sx={{
          ...avatarSize,
          border: (theme) => `solid 2px ${theme.palette.background.default}`,
          background: (theme) =>
            borderDashed !== true ? alpha(bgColor || theme.palette.primary.main, 0.8) : '',
        }}
        {...props}
      >
        {!icon && displayName && (
          <Typography variant="light">{displayName?.toUpperCase()}</Typography>
        )}
        {icon && <i className={icon} style={{ fontSize: iconSize }} />}
      </Avatar>
    </IconButton>
  );
};

CustomAvatar.propTypes = {
  displayName: PropTypes.string,
  bgColor: PropTypes.string,
  icon: PropTypes.string,
  photoURL: PropTypes.string,
  handleOpen: PropTypes.func,
  open: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};
