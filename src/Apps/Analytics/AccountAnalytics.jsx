import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { formatToINR } from 'src/utils/format-number';

import { AnimatedChart, AnimatedCounter } from 'src/components/Animated';

export default function AccountAnalytics({ accountsList = [] }) {
  const [activeTab, setActiveTab] = useState(0);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    if (accountsList.length > 0) {
      generateAnalyticsData();
    }
  }, [accountsList]);

  const generateAnalyticsData = () => {
    const totalBalance = accountsList.reduce(
      (sum, acc) => sum + (acc?.fn_account?.CurrentAmount || 0),
      0
    );
    const totalStartAmount = accountsList.reduce(
      (sum, acc) => sum + (acc?.fn_account?.StartAmount || 0),
      0
    );
    const activeAccounts = accountsList.filter((acc) => acc?.fn_account?.isActive);
    const inactiveAccounts = accountsList.filter((acc) => !acc?.fn_account?.isActive);
    const lowBalanceAccounts = accountsList.filter(
      (acc) => acc?.fn_account?.CurrentAmount < acc?.fn_account?.MinAmount
    );

    const accountTypes = {};
    accountsList.forEach((acc) => {
      const typeName = getAccountTypeName(acc?.fn_account?.TypeId);
      accountTypes[typeName] = (accountTypes[typeName] || 0) + 1;
    });

    const growthData = accountsList
      .map((acc) => ({
        name: acc?.fn_account?.AccountName,
        growth:
          acc?.fn_account?.StartAmount > 0
            ? (((acc?.fn_account?.CurrentAmount || 0) - (acc?.fn_account?.StartAmount || 0)) /
                (acc?.fn_account?.StartAmount || 1)) *
              100
            : 0,
        currentAmount: acc?.fn_account?.CurrentAmount,
        startAmount: acc?.fn_account?.StartAmount,
      }))
      .sort((a, b) => b.growth - a.growth);

    const utilizationData = accountsList.map((acc) => ({
      name: acc.fn_account?.AccountName,
      utilization:
        (((acc?.fn_account?.CurrentAmount || 0) - (acc?.fn_account?.MinAmount || 0)) /
          ((acc?.fn_account?.MaxAmount || 0) - (acc?.fn_account?.MinAmount || 0))) *
        100,
      currentAmount: acc?.fn_account?.CurrentAmount,
      minAmount: acc?.fn_account?.MinAmount,
      maxAmount: acc?.fn_account?.MaxAmount,
    }));

    const monthlyTrends = [
      { month: 'Jan', totalBalance: 1800000, activeAccounts: 3 },
      { month: 'Feb', totalBalance: 1950000, activeAccounts: 3 },
      { month: 'Mar', totalBalance: 2100000, activeAccounts: 4 },
      { month: 'Apr', totalBalance: 2050000, activeAccounts: 4 },
      { month: 'May', totalBalance: 2200000, activeAccounts: 4 },
      { month: 'Jun', totalBalance: 2350000, activeAccounts: 4 },
    ];

    setAnalyticsData({
      totalBalance,
      totalStartAmount,
      activeAccounts: activeAccounts.length,
      inactiveAccounts: inactiveAccounts.length,
      lowBalanceAccounts: lowBalanceAccounts.length,
      accountTypes,
      growthData,
      utilizationData,
      monthlyTrends,
      netGrowth: totalBalance - totalStartAmount,
      growthPercentage:
        totalStartAmount > 0 ? ((totalBalance - totalStartAmount) / totalStartAmount) * 100 : 0,
    });
  };

  const getAccountTypeName = (typeId) => {
    const types = {
      1: 'Cash',
      2: 'Saving Account',
      3: 'Investments',
      4: 'Fixed Fund',
      5: 'Credit Cards',
      6: 'Emergency Fund',
    };
    return types[typeId] || 'Other';
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!analyticsData) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Loading analytics...</Typography>
      </Card>
    );
  }

  return (
    <>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Account Analytics
          </Typography>
        }
        subheader="Comprehensive analysis of all accounts"
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" />
          <Tab label="Growth Analysis" />
          <Tab label="Utilization" />
          {/* <Tab label="Trends" /> */}
        </Tabs>
      </Box>

      <Box sx={{ p: 2 }}>
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, bgcolor: 'success.lighter', borderRadius: 2, mb: 2 }}>
                <Typography variant="h6" color="success.main" sx={{ mb: 1 }}>
                  Total Portfolio Value
                </Typography>
                <AnimatedCounter
                  value={analyticsData.totalBalance}
                  format="currency"
                  variant="h4"
                  color="success.main"
                  duration={2000}
                />
                <Typography variant="caption" color="text.secondary">
                  Net Growth: {formatToINR(analyticsData.netGrowth)} (
                  {analyticsData.growthPercentage.toFixed(1)}%)
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, bgcolor: 'info.lighter', borderRadius: 2, mb: 2 }}>
                <Typography variant="h6" color="info.main" sx={{ mb: 1 }}>
                  Account Status
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <AnimatedCounter
                      value={analyticsData.activeAccounts}
                      format="number"
                      variant="h5"
                      color="success.main"
                      duration={1500}
                    />
                    <Typography variant="caption">Active</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <AnimatedCounter
                      value={analyticsData.inactiveAccounts}
                      format="number"
                      variant="h5"
                      color="error.main"
                      duration={1500}
                    />
                    <Typography variant="caption">Inactive</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <AnimatedCounter
                      value={analyticsData.lowBalanceAccounts}
                      format="number"
                      variant="h5"
                      color="warning.main"
                      duration={1500}
                    />
                    <Typography variant="caption">Low Balance</Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <AnimatedChart
                title="Account Type Distribution"
                height={250}
                animationDuration={2000}
                chart={{
                  labels: Object.keys(analyticsData.accountTypes),
                  series: [
                    {
                      name: 'Accounts',
                      type: 'pie',
                      data: Object.values(analyticsData.accountTypes),
                    },
                  ],
                  options: {
                    colors: ['#00A76F', '#FF4842', '#00B8D9', '#FFA726'],
                    plotOptions: {
                      pie: {
                        donut: {
                          size: '60%',
                        },
                      },
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <AnimatedChart
                title="Growth vs Utilization"
                height={250}
                animationDuration={2200}
                chart={{
                  labels: analyticsData.growthData.slice(0, 5).map((item) => item.name),
                  series: [
                    {
                      name: 'Growth %',
                      type: 'bar',
                      fill: 'solid',
                      color: '#00A76F',
                      data: analyticsData.growthData.slice(0, 5).map((item) => item.growth),
                    },
                  ],
                }}
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <AnimatedChart
                title="Account Growth Analysis"
                height={300}
                chart={{
                  labels: analyticsData.growthData.map((item) => item.name),
                  series: [
                    {
                      name: 'Current Amount',
                      type: 'column',
                      fill: 'solid',
                      color: '#00A76F',
                      data: analyticsData.growthData.map((item) => item.currentAmount),
                    },
                    {
                      name: 'Start Amount',
                      type: 'column',
                      fill: 'solid',
                      color: '#FF4842',
                      data: analyticsData.growthData.map((item) => item.startAmount),
                    },
                  ],
                }}
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <AnimatedChart
                title="Account Utilization"
                height={300}
                animationDuration={2000}
                chart={{
                  labels: analyticsData.utilizationData.map((item) => item.name),
                  series: [
                    {
                      name: 'Utilization %',
                      type: 'bar',
                      fill: 'solid',
                      color: '#00B8D9',
                      data: analyticsData.utilizationData.map((item) => item.utilization),
                    },
                  ],
                }}
              />
            </Grid>
          </Grid>
        )}

        {/* {activeTab === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <AnimatedChart
                title="Monthly Portfolio Trends"
                height={300}
                animationDuration={2500}
                chart={{
                  labels: analyticsData.monthlyTrends.map((item) => item.month),
                  series: [
                    {
                      name: 'Total Balance',
                      type: 'area',
                      fill: 'gradient',
                      color: '#00A76F',
                      data: analyticsData.monthlyTrends.map((item) => item.totalBalance),
                    },
                  ],
                }}
              />
            </Grid>
          </Grid>
        )} */}
      </Box>
    </>
  );
}

AccountAnalytics.propTypes = {
  accountsList: PropTypes.array,
};
