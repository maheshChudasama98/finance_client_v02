import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';

import { useAmountVisibility } from 'src/hooks/use-amount-visibility';

import { formatToINR } from 'src/utils/format-number';

export default function FormattedAmount({
  value,
  variant = 'body1',
  color = 'text.primary',
  sx,
  ...other
}) {
  const { isAmountVisible } = useAmountVisibility();

  return (
    <Typography
      variant={variant}
      color={color}
      sx={sx}
      {...other}
    >
      {formatToINR(value, isAmountVisible)}
    </Typography>
  );
}

FormattedAmount.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  variant: PropTypes.string,
  color: PropTypes.string,
  sx: PropTypes.object,
}; 