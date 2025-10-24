import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';

import { formatToINR } from 'src/utils/format-number';

import AnimatedCounter from './AnimatedCounter';

export default function AccountSummaryWidget({ accountsList = [] }) {
  const [summaryData, setSummaryData] = useState({
    totalAccounts: 0,
    activeAccounts: 0,
    totalBalance: 0,
    totalStartAmount: 0,
    averageGrowth: 0,
    lowBalanceAccounts: 0,
  });

  useEffect(() => {
    if (accountsList.length > 0) {
      calculateSummary();
    }
  }, [accountsList]);

  const calculateSummary = () => {
    const activeAccounts = accountsList.filter(acc => acc?.fn_account?.isActive);
    const totalBalance = accountsList.reduce((sum, acc) => sum + (Number(acc?.fn_account?.CurrentAmount) || 0), 0);
    const totalStartAmount = accountsList.reduce((sum, acc) => sum + (Number(acc?.fn_account?.StartAmount) || 0), 0);
    const lowBalanceAccounts = accountsList.filter(acc => Number(acc?.fn_account?.CurrentAmount) < Number(acc?.fn_account?.MinAmount)).length;

    let totalGrowth = 0;
    let validAccounts = 0;
    
    accountsList.forEach(acc => {
      if (Number(acc?.fn_account?.StartAmount) > 0) {
        totalGrowth += ((Number(acc?.fn_account?.CurrentAmount) - Number(acc?.fn_account?.StartAmount)) / Number(acc?.fn_account?.StartAmount)) * 100;
        validAccounts += 1;
      }
    });
    
    const averageGrowth = validAccounts > 0 ? totalGrowth / validAccounts : 0;

    setSummaryData({
      totalAccounts: accountsList.length,
      activeAccounts: activeAccounts.length,
      totalBalance,
      totalStartAmount,
      averageGrowth,
      lowBalanceAccounts,
    });
  };

  const getHealthScore = () => {
    const activeRatio = summaryData.totalAccounts > 0 ? (summaryData.activeAccounts / summaryData.totalAccounts) * 100 : 0;
    const lowBalanceRatio = summaryData.totalAccounts > 0 ? (summaryData.lowBalanceAccounts / summaryData.totalAccounts) * 100 : 0;
    const growthScore = Math.max(0, Math.min(100, summaryData.averageGrowth + 50)); // Normalize to 0-100
    
    return Math.round((activeRatio * 0.4) + (growthScore * 0.4) + ((100 - lowBalanceRatio) * 0.2));
  };

  const healthScore = getHealthScore();

  const getHealthColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getHealthGradientColor = (score) => {
    if (score >= 80) return '#00A76F';
    if (score >= 60) return '#FFA726';
    return '#FF4842';
  };

  const getHealthGradientColorLight = (score) => {
    if (score >= 80) return '#00A76F80';
    if (score >= 60) return '#FFA72680';
    return '#FF484280';
  };

  const getHealthGlowColor = (score) => {
    if (score >= 80) return '#00A76F40';
    if (score >= 60) return '#FFA72640';
    return '#FF484240';
  };

  const getHealthGlowColorLight = (score) => {
    if (score >= 80) return '#00A76F80';
    if (score >= 60) return '#FFA72680';
    return '#FF484280';
  };

  const getHealthMessage = (score) => {
    if (score >= 80) return 'Excellent account health';
    if (score >= 60) return 'Good account health';
    return 'Needs attention';
  };

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Account Summary
          </Typography>
        }
        subheader={`${summaryData.totalAccounts} total accounts`}
      />
      
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {/* Total Balance */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.lighter', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Total Balance
              </Typography>
              <AnimatedCounter
                value={summaryData.totalBalance}
                format="currency"
                variant="h6"
                color="success.main"
                duration={2000}
              />
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  mt: 1,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: 'success.main',
                  opacity: 0.3,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 2,
                    backgroundColor: 'success.main',
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Active Accounts */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.lighter', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Active Accounts
              </Typography>
              <AnimatedCounter
                value={summaryData.activeAccounts}
                format="number"
                variant="h6"
                color="info.main"
                duration={1500}
              />
              {/* <Typography variant="caption" color="text.secondary">
                of {summaryData.totalAccounts}
              </Typography> */}
              <LinearProgress
                variant="determinate"
                value={summaryData.totalAccounts > 0 ? (summaryData.activeAccounts / summaryData.totalAccounts) * 100 : 0}
                sx={{
                  mt: 1,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: 'info.main',
                  opacity: 0.3,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 2,
                    backgroundColor: 'info.main',
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Average Growth */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.lighter', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Average Growth
              </Typography>
              <AnimatedCounter
                value={summaryData.averageGrowth}
                format="decimal"
                suffix="%"
                variant="h6"
                color="warning.main"
                duration={1800}
              />
              <LinearProgress
                variant="determinate"
                value={Math.min(Math.abs(summaryData.averageGrowth), 100)}
                sx={{
                  mt: 1,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: 'warning.main',
                  opacity: 0.3,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 2,
                    backgroundColor: 'warning.main',
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Low Balance Alerts */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: summaryData.lowBalanceAccounts > 0 ? 'error.lighter' : 'success.lighter', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Low Balance Alerts
              </Typography>
              <AnimatedCounter
                value={summaryData.lowBalanceAccounts}
                format="number"
                variant="h6"
                color={summaryData.lowBalanceAccounts > 0 ? 'error.main' : 'success.main'}
                duration={1200}
              />
              {/* <Typography variant="caption" color="text.secondary">
                accounts need attention
              </Typography> */}
              <LinearProgress
                variant="determinate"
                value={summaryData.totalAccounts > 0 ? (summaryData.lowBalanceAccounts / summaryData.totalAccounts) * 100 : 0}
                sx={{
                  mt: 1,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: summaryData.lowBalanceAccounts > 0 ? 'error.main' : 'success.main',
                  opacity: 0.3,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 2,
                    backgroundColor: summaryData.lowBalanceAccounts > 0 ? 'error.main' : 'success.main',
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Health Score */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              Overall Account Health
            </Typography>
            <Chip
              label={`${healthScore}/100`}
              size="small"
              color={getHealthColor(healthScore)}
              variant="filled"
            />
          </Stack>
                        <LinearProgress
                variant="determinate"
                value={healthScore}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'grey.300',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${getHealthGradientColor(healthScore)} 0%, ${getHealthGradientColorLight(healthScore)} 100%)`,
                    animation: 'healthGlow 2s ease-in-out infinite alternate',
                    '@keyframes healthGlow': {
                      '0%': {
                        boxShadow: `0 0 5px ${getHealthGlowColor(healthScore)}`,
                      },
                      '100%': {
                        boxShadow: `0 0 15px ${getHealthGlowColorLight(healthScore)}`,
                      },
                    },
                  },
                }}
              />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {getHealthMessage(healthScore)}
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Total Start Amount
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatToINR(summaryData.totalStartAmount)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Net Growth
              </Typography>
              <Typography variant="body2" fontWeight={600} color="success.main">
                {formatToINR(summaryData.totalBalance - summaryData.totalStartAmount)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}

AccountSummaryWidget.propTypes = {
  accountsList: PropTypes.array,
}; 