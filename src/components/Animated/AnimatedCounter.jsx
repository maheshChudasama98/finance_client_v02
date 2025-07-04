import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { formatToINR } from 'src/utils/format-number';

export function AnimatedCounter({
  color = 'text.primary',
  duration = 1500,
  format = 'number',
  prefix = '',
  suffix = '',
  value = 0,
  variant = 'h3',
  ...other
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const targetValue = parseFloat(value) || 0;
    const startValue = 0;
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing function
      const easeOutCubic = 1 - (1 - progress) ** 3;
      const currentValue = startValue + (targetValue - startValue) * easeOutCubic;

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
      }
    };

    // Reset to 0 first, then animate
    setDisplayValue(0);
    const timer = setTimeout(() => {
      animate();
    }, 100);

    return () => clearTimeout(timer);
  }, [value, duration]);

  const formatValue = (val) => {
    if (format === 'currency') {
      return formatToINR(val);
    }
    if (format === 'number') {
      return new Intl.NumberFormat('en-IN').format(Math.round(val));
    }
    if (format === 'decimal') {
      return val.toFixed(2);
    }
    if (format === 'percentage') {
      return `${val.toFixed(1)}%`;
    }
    return val;
  };

  return (
    <Box {...other}>
      <Typography
        color={color}
        sx={{
          fontWeight: 600,
          ...other.sx,
        }}
        variant={variant}
      >
        {prefix}
        {formatValue(displayValue)}
        {suffix}
      </Typography>
    </Box>
  );
}

AnimatedCounter.propTypes = {
  color: PropTypes.string,
  duration: PropTypes.number,
  format: PropTypes.oneOf(['currency', 'decimal', 'number', 'percentage']),
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  variant: PropTypes.string,
};
