import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import SvgColor from 'src/components/svg-color';

import { Skeleton } from 'antd';

import AnimatedCounter from './AnimatedCounter';

export default function InfoBox({
  amount = '0',
  flag = true,
  loader,
  previousValue = 0,
  title = '',
}) {
  const isPositive = flag ? previousValue >= 0 : previousValue <= 0;
  const percentageColor = isPositive ? 'success.main' : 'error.main';
  const percentageBgColor = isPositive ? 'success.lighter' : 'error.lighter';

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
      }}
    >
      {!loader ? (
        <CardContent sx={{ p: 3 }}>
          {/* Title */}
          <Typography
            color="text.secondary"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: 0.5,
              mb: 2,
              textTransform: 'uppercase',
            }}
            variant="body2"
          >
            {title}
          </Typography>

          {/* Amount */}
          <Box sx={{ mb: 2 }}>
            <AnimatedCounter
              duration={1500}
              format="currency"
              sx={{
                color: 'text.primary',
                fontWeight: 700,
                lineHeight: 1.2,
              }}
              value={amount}
              variant="h4"
            />
          </Box>

          {/* Percentage Change */}
          <Stack direction="row" spacing={1}>
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: percentageBgColor,
                borderRadius: 1,
                color: percentageColor,
                display: 'flex',
                px: 1,
                py: 0.5,
              }}
            >
              <SvgColor
                src={
                  isPositive
                    ? '/assets/icons/general/ic_arrow_up.svg'
                    : '/assets/icons/general/ic_arrow_down.svg'
                }
                sx={{
                  height: 16,
                  mr: 0.5,
                  width: 16,
                }}
              />
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
                variant="caption"
              >
                {isPositive ? '+' : ''}
                {Math.abs(previousValue).toFixed(1)}%
              </Typography>
            </Box>

            <Typography
              color="text.secondary"
              sx={{ fontSize: '0.75rem' }}
              variant="caption"
            >
              vs last month
            </Typography>
          </Stack>
        </CardContent>
      ) : (
        <CardContent sx={{ p: 3 }}>
          <Skeleton
            active
            paragraph={{
              rows: 2,
            }}
          />
        </CardContent>
      )}
    </Card>
  );
}

InfoBox.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  flag: PropTypes.bool,
  loader: PropTypes.bool,
  previousValue: PropTypes.number,
  title: PropTypes.string,
};
