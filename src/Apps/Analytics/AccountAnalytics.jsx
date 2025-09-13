import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';
import ListItemButton from '@mui/material/ListItemButton';

import { formatToINR } from 'src/utils/format-number';

import { AccountsFetchListService } from 'src/Services/Meter.Services';

import { CustomAvatar } from 'src/components/CustomComponents';
import { AnimatedChart, AnimatedCounter } from 'src/components/Animated';

export default function AccountAnalytics() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [accountsList, setAccountsList] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
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
      generateAnalyticsData();
      calculateSummary();
    }
  }, [accountsList]);

  const generateAnalyticsData = () => {
    const totalBalance = accountsList.reduce((sum, acc) => sum + (acc?.CurrentAmount || 0), 0);
    const totalStartAmount = accountsList.reduce((sum, acc) => sum + (acc?.StartAmount || 0), 0);
    const activeAccounts = accountsList.filter((acc) => acc?.isActive);
    const inactiveAccounts = accountsList.filter((acc) => !acc?.isActive);
    const lowBalanceAccounts = accountsList.filter(
      (acc) => acc?.fn_account?.CurrentAmount < acc?.MinAmount
    );

    const accountTypes = {};
    accountsList.forEach((acc) => {
      const typeName = getAccountTypeName(acc?.TypeId);
      accountTypes[typeName] = (accountTypes[typeName] || 0) + 1;
    });

    const growthData = accountsList
      .map((acc) => ({
        name: acc?.AccountName,
        growth:
          acc?.StartAmount > 0
            ? (((acc?.CurrentAmount || 0) - (acc?.StartAmount || 0)) / (acc?.StartAmount || 1)) *
              100
            : 0,
        currentAmount: acc?.CurrentAmount,
        startAmount: acc?.StartAmount,
      }))
      .sort((a, b) => b.growth - a.growth);

    const utilizationData = accountsList.map((acc) => ({
      name: acc?.AccountName,
      utilization:
        (((acc?.CurrentAmount || 0) - (acc?.MinAmount || 0)) /
          ((acc?.MaxAmount || 0) - (acc?.MinAmount || 0))) *
        100,
      currentAmount: acc?.CurrentAmount,
      minAmount: acc?.MinAmount,
      maxAmount: acc?.MaxAmount,
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
      accountTypesValue: Object.values(accountTypes),
      accountTypesKey: Object.keys(accountTypes),
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

  const calculateSummary = () => {
    const activeAccounts = accountsList.filter((acc) => acc?.isActive);
    const totalBalance = accountsList.reduce(
      (sum, acc) => sum + (Number(acc?.CurrentAmount) || 0),
      0
    );
    const totalStartAmount = accountsList.reduce(
      (sum, acc) => sum + (Number(acc?.StartAmount) || 0),
      0
    );
    const lowBalanceAccounts = accountsList.filter(
      (acc) => Number(acc?.CurrentAmount) < Number(acc?.MinAmount)
    ).length;

    let totalGrowth = 0;
    let validAccounts = 0;

    accountsList.forEach((acc) => {
      if (Number(acc?.StartAmount) > 0) {
        totalGrowth +=
          ((Number(acc?.CurrentAmount) - Number(acc?.StartAmount)) / Number(acc?.StartAmount)) *
          100;
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
    const activeRatio =
      summaryData.totalAccounts > 0
        ? (summaryData.activeAccounts / summaryData.totalAccounts) * 100
        : 0;
    const lowBalanceRatio =
      summaryData.totalAccounts > 0
        ? (summaryData.lowBalanceAccounts / summaryData.totalAccounts) * 100
        : 0;
    const growthScore = Math.max(0, Math.min(100, summaryData.averageGrowth + 50)); // Normalize to 0-100

    return Math.round(activeRatio * 0.4 + growthScore * 0.4 + (100 - lowBalanceRatio) * 0.2);
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

  useEffect(() => {
    dispatch(
      AccountsFetchListService({}, (res) => {
        if (res?.status) {
          setAccountsList(res?.data?.list);
          calculateSummary();
        }
      })
    );
  }, []);

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Account List
                </Typography>
              }
              subheader="Click on an item to view detailed analytics"
            />
            <Divider sx={{ m: 2 }} />

            {accountsList?.map((item, index) => (
              <ListItem key={item.id || index} disablePadding>
                <ListItemButton
                  // selected={selectedItem?.id === item.id}
                  // onClick={() => onItemSelect(item)}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: 'primary.lighter',
                      '&:hover': {
                        bgcolor: 'primary.lighter',
                      },
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <CustomAvatar
                      width={45}
                      height={45}
                      iconSize={15}
                      icon={item?.Icon || ''}
                      bgColor={item?.Color || ''}
                    />
                    <Typography variant="light">
                      {item?.AccountName}
                      <Typography variant="registerTest" color="text.secondary">
                        {item?.CurrentAmount}
                      </Typography>
                    </Typography>
                  </Stack>
                </ListItemButton>
              </ListItem>
            ))}
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Card>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Account Analytics
                </Typography>
              }
              // subheader="Comprehensive analysis of all accounts"
            />
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mx: 2 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Overview" />
                <Tab label="Selected Account" />
              </Tabs>
            </Box>

            <Box>
              <CardHeader
                title={
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Account Summary
                  </Typography>
                }
                subheader={`${summaryData.totalAccounts} total accounts`}
              />

              <Box sx={{ p: 2 }}>
                {/* <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, bgcolor: 'success.lighter', borderRadius: 2, mb: 2 }}>
                      <Typography variant="h6" color="success.main" sx={{ mb: 1 }}>
                        Total Portfolio Value
                      </Typography>
                      <AnimatedCounter
                        value={analyticsData?.totalBalance}
                        format="currency"
                        variant="h4"
                        color="success.main"
                        duration={2000}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Net Growth: {formatToINR(analyticsData?.netGrowth)} (
                        {analyticsData?.growthPercentage?.toFixed(1)}%)
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
                            value={analyticsData?.activeAccounts}
                            format="number"
                            variant="h5"
                            color="success.main"
                            duration={1500}
                          />
                          <Typography variant="caption">Active</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <AnimatedCounter
                            value={analyticsData?.inactiveAccounts}
                            format="number"
                            variant="h5"
                            color="error.main"
                            duration={1500}
                          />
                          <Typography variant="caption">Inactive</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <AnimatedCounter
                            value={analyticsData?.lowBalanceAccounts}
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
                </Grid> */}

                <Grid container spacing={2}>
                  {/* Total Balance */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        bgcolor: 'success.lighter',
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 1 }}
                      >
                        Total Balance
                      </Typography>

                      <AnimatedCounter
                        value={summaryData?.totalBalance}
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
                    <Box
                      sx={{ textAlign: 'center', p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 1 }}
                      >
                        Active Accounts
                      </Typography>
                      <AnimatedCounter
                        value={summaryData?.activeAccounts}
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
                        value={
                          summaryData?.totalAccounts > 0
                            ? (summaryData.activeAccounts || 0 / summaryData.totalAccounts || 0) *
                              100
                            : 0
                        }
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
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        bgcolor: 'warning.lighter',
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 1 }}
                      >
                        Average Growth
                      </Typography>
                      <AnimatedCounter
                        value={summaryData?.averageGrowth}
                        format="decimal"
                        suffix="%"
                        variant="h6"
                        color="warning.main"
                        duration={1800}
                      />
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(Math.abs(summaryData?.averageGrowth), 100)}
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
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        bgcolor:
                          summaryData.lowBalanceAccounts > 0 ? 'error.lighter' : 'success.lighter',
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 1 }}
                      >
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
                        value={
                          summaryData.totalAccounts > 0
                            ? (summaryData.lowBalanceAccounts / summaryData.totalAccounts) * 100
                            : 0
                        }
                        sx={{
                          mt: 1,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor:
                            summaryData.lowBalanceAccounts > 0 ? 'error.main' : 'success.main',
                          opacity: 0.3,
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 2,
                            backgroundColor:
                              summaryData.lowBalanceAccounts > 0 ? 'error.main' : 'success.main',
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* Health Score */}
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
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
                        background: `linear-gradient(90deg, ${getHealthGradientColor(
                          healthScore
                        )} 0%, ${getHealthGradientColorLight(healthScore)} 100%)`,
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
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    {getHealthMessage(healthScore)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box>
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>

                  {/* Quick Stats */}
                  <Grid item xs={6}>
                    <Box
                      sx={{ textAlign: 'center', p: 1, border: 'solid 1px #EEE', borderRadius: 1 }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Total Start Amount
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatToINR(summaryData.totalStartAmount)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{ textAlign: 'center', p: 1, border: 'solid 1px #EEE', borderRadius: 1 }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Net Growth
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        {formatToINR(summaryData.totalBalance - summaryData.totalStartAmount)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ border: 'solid 1px #EEE', borderRadius: 1 }}>
                      <AnimatedChart
                        title="Account Type Distribution"
                        height={250}
                        animationDuration={2000}
                        chart={{
                          labels: analyticsData?.accountTypesKey || [],
                          series: [
                            {
                              name: 'Accounts',
                              type: 'bar',
                              data: analyticsData?.accountTypesValue || [],
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
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ border: 'solid 1px #EEE', borderRadius: 1 }}>
                      <AnimatedChart
                        title="Growth vs Utilization"
                        height={250}
                        animationDuration={2200}
                        chart={{
                          labels: analyticsData?.growthData?.slice(0, 5).map((item) => item.name),
                          series: [
                            {
                              name: 'Growth %',
                              type: 'bar',
                              fill: 'solid',
                              color: '#00A76F',
                              data: analyticsData?.growthData
                                ?.slice(0, 5)
                                .map((item) => item.growth),
                            },
                          ],
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ border: 'solid 1px #EEE', borderRadius: 1 }}>
                      <AnimatedChart
                        title="Account Growth Analysis"
                        height={300}
                        chart={{
                          labels: analyticsData?.growthData?.map((item) => item.name),
                          series: [
                            {
                              name: 'Current Amount',
                              type: 'column',
                              fill: 'solid',
                              color: '#00A76F',
                              data: analyticsData?.growthData?.map((item) => item.currentAmount),
                            },
                            {
                              name: 'Start Amount',
                              type: 'column',
                              fill: 'solid',
                              color: '#FF4842',
                              data: analyticsData?.growthData?.map((item) => item.startAmount),
                            },
                          ],
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ border: 'solid 1px #EEE', borderRadius: 1 }}>
                      <AnimatedChart
                        title="Account Utilization"
                        height={300}
                        animationDuration={2000}
                        chart={{
                          labels: analyticsData?.utilizationData?.map((item) => item.name),
                          series: [
                            {
                              name: 'Utilization %',
                              type: 'bar',
                              fill: 'solid',
                              color: '#00B8D9',
                              data: analyticsData?.utilizationData?.map((item) => item.utilization),
                            },
                          ],
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ p: 2 }}>
        {/* {activeTab === 0 && (
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
        )} */}

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
