import React from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';

import { formatToINR } from 'src/utils/format-number';

import { AccountTypes } from 'src/constance';

import { CustomAvatar } from 'src/components/CustomComponents';

import AnimatedCounter from './AnimatedCounter';

export default function AccountCards({ accounts }) {
  const getAccountTypeName = (typeId) =>
    AccountTypes?.find((e) => e?.key === typeId)?.value || 'Unknown';

  const calculateGrowth = (current, start) => {
    if (start === 0) return 0;
    return ((current - start) / start) * 100;
  };

  const getStatusColor = (account) => {
    if (!account.fn_account?.isActive) return 'error';
    if (account.fn_account?.CurrentAmount < account.fn_account?.MinAmount) return 'warning';
    return 'success';
  };

  const getUtilizationPercentage = (account) => {
    const range = (account?.fn_account?.MaxAmount || 0) - (account?.fn_account?.MinAmount || 0);
    if (range === 0) return 0;
    return (
      ((account?.fn_account?.CurrentAmount || 0 - (account?.fn_account?.MinAmount || 0)) / range) *
      100
    );
  };

  if (!accounts || accounts.length === 0) {
    return (
      <Card>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No accounts found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add some accounts to see them here
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
          Account Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {accounts?.length} active accounts
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {accounts?.map((account) => {
          const growth = calculateGrowth(
            account?.fn_account?.CurrentAmount,
            account?.fn_account?.StartAmount
          );
          const utilization = getUtilizationPercentage(account);
          const statusColor = getStatusColor(account);

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={account?.fn_account?.AccountId}>
                              <Card
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    cursor: 'pointer',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                <CardContent sx={{ p: 3 }}>
                  {/* Account Header */}
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <CustomAvatar
                      iconSize={15}
                      icon={account?.fn_account?.Icon}
                      bgColor={account?.fn_account?.Color}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                        {account?.fn_account?.AccountName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {getAccountTypeName(account?.fn_account?.TypeId)}
                      </Typography>
                    </Box>
                    <Chip
                      label={account?.fn_account?.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={account?.fn_account?.isActive ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </Stack>

                  {/* Current Amount */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Current Balance
                    </Typography>
                                         <AnimatedCounter
                       color={statusColor === 'warning' ? 'warning.main' : 'text.primary'}
                       duration={1500}
                       format="currency"
                       sx={{ fontWeight: 700 }}
                       value={account?.fn_account?.CurrentAmount}
                       variant="h6"
                     />
                  </Box>

                  {/* Growth Indicator */}
                  <Box sx={{ mb: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Growth
                      </Typography>
                      <Typography
                        variant="caption"
                        color={growth >= 0 ? 'success.main' : 'error.main'}
                        fontWeight={600}
                      >
                        {growth >= 0 ? '+' : ''}
                        {growth.toFixed(1)}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(Math.abs(growth), 100)}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 2,
                          backgroundColor: growth >= 0 ? 'success.main' : 'error.main',
                        },
                      }}
                    />
                  </Box>

                  {/* Utilization Bar */}
                  <Box sx={{ mb: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Utilization
                      </Typography>
                      <Typography variant="caption" fontWeight={600}>
                        {utilization.toFixed(0)}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={utilization}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          background: `linear-gradient(90deg, ${account?.fn_account?.Color} 0%, ${account?.fn_account?.Color}80 100%)`,
                        },
                      }}
                    />
                  </Box>

                  {/* Account Limits */}
                  <Box>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" color="text.secondary">
                        Min: {formatToINR(account?.fn_account?.MinAmount)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Max: {formatToINR(account?.fn_account?.MaxAmount)}
                      </Typography>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

AccountCards.propTypes = {
};
