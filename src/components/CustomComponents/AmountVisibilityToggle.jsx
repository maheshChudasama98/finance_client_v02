import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useAmountVisibility } from 'src/hooks/use-amount-visibility';

import Iconify from 'src/components/iconify';

export default function AmountVisibilityToggle({ sx, ...other }) {
  const { isAmountVisible, toggleVisibility } = useAmountVisibility();

  return (
    <Tooltip color='primary' title={isAmountVisible ? 'Hide Amounts' : 'Show Amounts'}>
      <IconButton
        onClick={toggleVisibility}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          '&:hover': {
            background: (theme) => alpha(theme.palette.primary.main, 0.08),
          },
          ...sx,
        }}
        {...other}
      >
        <Iconify
          icon={!isAmountVisible ? 'eva:eye-off-fill' : 'eva:eye-fill'}
          sx={{
            color: !isAmountVisible ? 'text.secondary' : 'primary.main',
          }}
        />
      </IconButton>
    </Tooltip>
  );
} 