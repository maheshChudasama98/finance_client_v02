import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/system';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import ListItem from '@mui/material/ListItem';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Unstable_Grid2';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import SpeedIcon from '@mui/icons-material/Speed';
import LinearProgress from '@mui/material/LinearProgress';
import ListItemButton from '@mui/material/ListItemButton';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TableContainer from '@mui/material/TableContainer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

import { useAmountVisibility } from 'src/hooks/use-amount-visibility';

import { fDate } from 'src/utils/format-time';
import { formatToINR } from 'src/utils/format-number';

import { MonthList, TransactionActions } from 'src/constance';
import { AccountsFetchListService } from 'src/Services/Meter.Services';
import { TransactionFetchListService } from 'src/Services/Transaction.Services';

import Loader from 'src/components/Loaders/Loader';
import { AnimatedChart, AnimatedCounter } from 'src/components/Animated';
import { CustomAvatar, CustomSelect } from 'src/components/CustomComponents';


const calculateHealthScore = (account) => {
  const balance = Number(account?.CurrentAmount) || 0;
  const startAmount = Number(account?.StartAmount) || 0;
  const minAmount = Number(account?.MinAmount) || 0;
  const maxAmount = Number(account?.MaxAmount) || 0;
  const isActive = account?.isActive;

  let score = 0;

  if (balance > startAmount) score += 40;
  else if (balance > minAmount) score += 20;
  else score += 0;

  if (maxAmount > 0) {
    const utilization = (balance / maxAmount) * 100;
    if (utilization < 50) score += 30;
    else if (utilization < 80) score += 20;
    else score += 10;
  } else score += 30;

  if (isActive) score += 20;
  else score += 0;

  if (startAmount > 0) {
    const growth = ((balance - startAmount) / startAmount) * 100;
    if (growth > 10) score += 10;
    else if (growth > 0) score += 5;
    else score += 0;
  } else score += 10;

  return Math.min(100, Math.max(0, score));
};

const calculateRiskLevel = (account) => {
  const balance = Number(account?.CurrentAmount) || 0;
  const minAmount = Number(account?.MinAmount) || 0;
  const maxAmount = Number(account?.MaxAmount) || 0;

  if (balance < minAmount) return 'High';
  if (maxAmount > 0 && balance / maxAmount > 0.9) return 'High';
  if (maxAmount > 0 && balance / maxAmount > 0.7) return 'Medium';
  return 'Low';
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

// New function to analyze transaction data
const analyzeTransactions = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return {
      totalTransactions: 0,
      totalIncome: 0,
      totalExpense: 0,
      netFlow: 0,
      averageTransaction: 0,
      monthlyBreakdown: [],
      categoryBreakdown: {},
      actionBreakdown: {},
      recentTransactions: [],
      topCategories: [],
      transactionTrends: [],
      monthlyIncome: [],
      monthlyExpense: [],
      dailySpending: [],
      weeklySpending: [],
      transactionFrequency: 0,
      largestTransaction: null,
      smallestTransaction: null,
    };
  }

  const totalTransactions = transactions.length;
  let totalIncome = 0;
  let totalExpense = 0;
  const categoryBreakdown = {};
  const actionBreakdown = {};
  const monthlyBreakdown = {};
  const dailySpending = {};
  const weeklySpending = {};
  let largestTransaction = null;
  let smallestTransaction = null;

  transactions.forEach((transaction) => {
    // const amount = parseFloat(transaction.Amount) || 0;
    const accountAmount = parseFloat(transaction.AccountAmount) || 0;
    const date = new Date(transaction.Date);
    const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayOfMonth = date.getDate();

    // Categorize by action
    if (accountAmount > 0) {
      totalIncome += accountAmount;
    } else {
      totalExpense += Math.abs(accountAmount);
    }

    // Category breakdown
    const categoryName = transaction.CategoryDetails?.CategoryName || 'Uncategorized';
    categoryBreakdown[categoryName] =
      (categoryBreakdown[categoryName] || 0) + Math.abs(accountAmount);

    // Action breakdown
    const actionName =
      TransactionActions.find((a) => a.key === transaction.Action)?.value || transaction.Action;
    actionBreakdown[actionName] = (actionBreakdown[actionName] || 0) + Math.abs(accountAmount);

    // Monthly breakdown
    monthlyBreakdown[month] = monthlyBreakdown[month] || { income: 0, expense: 0, count: 0 };
    if (accountAmount > 0) {
      monthlyBreakdown[month].income += accountAmount;
    } else {
      monthlyBreakdown[month].expense += Math.abs(accountAmount);
    }
    monthlyBreakdown[month].count += 1;

    // Daily spending
    dailySpending[dayOfMonth] = (dailySpending[dayOfMonth] || 0) + Math.abs(accountAmount);

    // Weekly spending
    weeklySpending[dayOfWeek] = (weeklySpending[dayOfWeek] || 0) + Math.abs(accountAmount);

    // Track largest and smallest transactions
    if (
      !largestTransaction ||
      Math.abs(accountAmount) > Math.abs(largestTransaction.AccountAmount)
    ) {
      largestTransaction = transaction;
    }
    if (
      !smallestTransaction ||
      Math.abs(accountAmount) < Math.abs(smallestTransaction.AccountAmount)
    ) {
      smallestTransaction = transaction;
    }
  });

  const netFlow = totalIncome - totalExpense;
  const averageTransaction =
    totalTransactions > 0 ? (totalIncome + totalExpense) / totalTransactions : 0;

  // Convert monthly breakdown to array
  const monthlyBreakdownArray = Object.entries(monthlyBreakdown)
    .map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
      netFlow: data.income - data.expense,
      count: data.count,
    }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));

  // Top categories
  const topCategories = Object.entries(categoryBreakdown)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Recent transactions (last 10)
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.Date) - new Date(a.Date))
    .slice(0, 10);

  // Monthly income and expense arrays for charts
  const monthlyIncome = monthlyBreakdownArray.map((item) => item.income);
  const monthlyExpense = monthlyBreakdownArray.map((item) => item.expense);

  // Transaction trends (monthly transaction count)
  const transactionTrends = monthlyBreakdownArray.map((item) => item.count);

  // Calculate transaction frequency (transactions per day)
  const dateRange =
    transactions.length > 1
      ? (new Date(transactions[0].Date) - new Date(transactions[transactions.length - 1].Date)) /
        (1000 * 60 * 60 * 24)
      : 1;
  const transactionFrequency = totalTransactions / Math.max(dateRange, 1);

  return {
    totalTransactions,
    totalIncome,
    totalExpense,
    netFlow,
    averageTransaction,
    monthlyBreakdown: monthlyBreakdownArray,
    categoryBreakdown,
    actionBreakdown,
    recentTransactions,
    topCategories,
    transactionTrends,
    monthlyIncome,
    monthlyExpense,
    dailySpending: Object.entries(dailySpending).map(([day, amount]) => ({
      day,
      amount,
    })),
    weeklySpending: Object.entries(weeklySpending).map(([day, amount]) => ({ day, amount })),
    transactionFrequency,
    largestTransaction,
    smallestTransaction,
  };
};

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

const riskColorMap = {
  Low: 'success',
  Medium: 'warning',
  High: 'error',
};

export default function AccountAnalytics() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { isAmountVisible } = useAmountVisibility();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountsList, setAccountsList] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('JAN');
  const [transactionAnalytics, setTransactionAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const [summaryData, setSummaryData] = useState({
    totalAccounts: 0,
    activeAccounts: 0,
    totalBalance: 0,
    totalStartAmount: 0,
    averageGrowth: 0,
    lowBalanceAccounts: 0,
  });

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

  const generateAnalyticsData = () => {
    const totalBalance = accountsList.reduce(
      (sum, acc) => sum + Number(acc?.CurrentAmount || 0),
      0
    );
    const totalStartAmount = accountsList.reduce(
      (sum, acc) => sum + Number(acc?.StartAmount || 0),
      0
    );
    const activeAccounts = accountsList.filter((acc) => acc?.isActive);
    const inactiveAccounts = accountsList.filter((acc) => !acc?.isActive);
    const lowBalanceAccounts = accountsList.filter(
      (acc) => Number(acc?.CurrentAmount) < Number(acc?.MinAmount)
    );

    const accountTypes = {};
    accountsList.forEach((acc) => {
      const typeName = getAccountTypeName(acc?.TypeId);
      accountTypes[typeName] = (accountTypes[typeName] || 0) + 1;
    });

    const growthData = accountsList
      .map((acc) => {
        const growth =
          Number(acc?.StartAmount) > 0
            ? ((Number(acc?.CurrentAmount || 0) - Number(acc?.StartAmount || 0)) /
                Number(acc?.StartAmount || 1)) *
              100
            : 0;
        return {
          name: acc?.AccountName,
          growth,
          currentAmount: Number(acc?.CurrentAmount),
          startAmount: Number(acc?.StartAmount),
          netGrowth: Number(acc?.CurrentAmount || 0) - Number(acc?.StartAmount || 0),
          growthRate: growth,
          utilization:
            Number(acc?.MaxAmount) > 0
              ? (Number(acc?.CurrentAmount || 0) / Number(acc?.MaxAmount)) * 100
              : 0,
          healthScore: calculateHealthScore(acc),
          riskLevel: calculateRiskLevel(acc),
          monthlyAverage: 0,
          yearlyProjection: 0,
          volatility: 0,
          efficiency: 0,
        };
      })
      .sort((a, b) => b.growth - a.growth);

    const utilizationData = accountsList.map((acc) => ({
      name: acc.AccountName,
      utilization:
        Number(acc?.MaxAmount) > 0
          ? ((Number(acc?.CurrentAmount || 0) - Number(acc?.MinAmount || 0)) /
              (Number(acc?.MaxAmount || 0) - Number(acc?.MinAmount || 0))) *
            100
          : 0,
      currentAmount: Number(acc?.CurrentAmount),
      minAmount: Number(acc?.MinAmount),
      maxAmount: Number(acc?.MaxAmount),
      availableSpace: Number(acc?.MaxAmount || 0) - Number(acc?.CurrentAmount || 0),
      utilizationRatio:
        Number(acc?.MaxAmount) > 0 ? Number(acc?.CurrentAmount || 0) / Number(acc?.MaxAmount) : 0,
    }));

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
      monthlyTrends: [],
      weeklyTrends: [],
      currentTrends: [],
      netGrowth: totalBalance - totalStartAmount,
      growthPercentage:
        totalStartAmount > 0 ? ((totalBalance - totalStartAmount) / totalStartAmount) * 100 : 0,
    });
  };

  // Fetch transactions for selected account
  const fetchAccountTransactions = (accountId) => {
    if (!accountId) return;

    setLoading(true);
    const payload = {
      FilterBy: { AccountsId: accountId, Action: 'to' },
      Duration: 'All',
    };

    dispatch(
      TransactionFetchListService(payload, (res) => {
        if (res?.status) {
          const analytics = analyzeTransactions(res?.data?.list || []);
          console.log(analytics, 'analytics analytics');

          setTransactionAnalytics(analytics);
        }
        setLoading(false);
      })
    );
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    setActiveTab(1);
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
    const growthScore = Math.max(0, Math.min(100, summaryData.averageGrowth + 50));

    return Math.round(activeRatio * 0.4 + growthScore * 0.4 + (100 - lowBalanceRatio) * 0.2);
  };
  const healthScore = getHealthScore();

  useEffect(() => {
    setLoadingList(true);
    dispatch(
      AccountsFetchListService({}, (res) => {
        if (res?.status) {
          setLoadingList(false);
          setAccountsList(res?.data?.list);
        }
      })
    );
  }, []);

  useEffect(() => {
    if (selectedAccount?.AccountId) {
      fetchAccountTransactions(selectedAccount.AccountId);
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (accountsList?.length > 0) {
      calculateSummary();
      generateAnalyticsData();
    }
  }, [accountsList]);

  const renderOverview = () => (
    <Box>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Comprehensive Account Overview
          </Typography>
        }
        subheader={`${summaryData.totalAccounts} total accounts • ${summaryData.activeAccounts} active • ${summaryData.lowBalanceAccounts} need attention`}
        action={
          <Stack direction="row" spacing={2} alignItems="center">
            <CustomSelect
              valueKey="Key"
              labelKey="Value"
              size="small"
              sx={{ width: 120 }}
              menuList={MonthList}
              defaultValue={selectedMonth}
              callBackAction={(value) => setSelectedMonth(value)}
            />
          </Stack>
        }
      />

      <Box sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                border: `solid 1px ${theme.palette.border?.success}`,
                background: `${theme.palette.gradients?.success}`,
              }}
            >
              <AttachMoneyIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
              <AnimatedCounter
                value={summaryData?.totalBalance}
                format="currency"
                variant="h5"
                color="success.main"
                duration={2000}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Total Portfolio Value
              </Typography>
              <Typography variant="caption" color="success.main">
                +{analyticsData?.growthPercentage?.toFixed(1)}% from start
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                border: `solid 1px ${theme.palette.border?.info}`,
                background: `${theme.palette.gradients?.info}`,
              }}
            >
              <SpeedIcon sx={{ fontSize: 32, color: 'info.main', mb: 1 }} />
              <AnimatedCounter
                value={summaryData?.activeAccounts}
                format="number"
                variant="h5"
                color="info.main"
                duration={1500}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Active Accounts
              </Typography>
              <Typography variant="caption" color="info.main">
                {summaryData?.totalAccounts > 0
                  ? Math.round((summaryData.activeAccounts / summaryData.totalAccounts) * 100)
                  : 0}
                % of total
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                border: `solid 1px ${theme.palette.border?.warning}`,
                background: `${theme.palette.gradients?.warning}`,
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
              <AnimatedCounter
                value={summaryData?.averageGrowth}
                format="decimal"
                suffix="%"
                variant="h5"
                color="warning.main"
                duration={1800}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Average Growth Rate
              </Typography>
              <Typography variant="caption" color="warning.main">
                Portfolio performance
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                border: `solid 1px ${theme.palette.border?.error}`,
                background: `${theme.palette.gradients?.error}`,
              }}
            >
              <AssessmentIcon sx={{ fontSize: 32, color: 'error.main', mb: 1 }} />
              <AnimatedCounter
                value={summaryData?.lowBalanceAccounts}
                format="number"
                variant="h5"
                color="error.main"
                duration={1500}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Low Balance Accounts
              </Typography>
              <Typography variant="caption" color="error.main">
                Need attention
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.tableHeader', borderRadius: 1 }}>
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
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {getHealthMessage(healthScore)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Detailed Analytics Charts */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
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
          </Grid>

          <Grid item xs={12} md={6}>
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
                    data: analyticsData?.growthData?.slice(0, 5).map((item) => item.growth),
                  },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
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
          </Grid>

          <Grid item xs={12} sm={12}>
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
          </Grid>
        </Grid>

        {/* Detailed Account Performance Table */}
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Detailed Account Performance
              </Typography>
            }
            subheader="Comprehensive analysis of all accounts"
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Account</TableCell>
                  <TableCell align="right">Growth %</TableCell>
                  <TableCell align="right">Health Score</TableCell>
                  <TableCell align="right">Risk Level</TableCell>
                  <TableCell align="right">Utilization</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analyticsData?.growthData?.map((account, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: getHealthGradientColor(account.healthScore),
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {account.name}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell align="right">
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        spacing={0.5}
                      >
                        {account.growth >= 0 ? (
                          <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        ) : (
                          <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                        )}
                        <Typography
                          variant="body2"
                          color={account.growth >= 0 ? 'success.main' : 'error.main'}
                          sx={{ fontWeight: 500 }}
                        >
                          {account.growth.toFixed(1)}%
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                      >
                        <LinearProgress
                          variant="determinate"
                          value={account.healthScore}
                          sx={{
                            width: 60,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              backgroundColor: getHealthGradientColor(account.healthScore),
                            },
                          }}
                        />
                        <Typography variant="caption" sx={{ ml: 1, fontWeight: 500 }}>
                          {account.healthScore}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={account.riskLevel}
                        size="small"
                        color={riskColorMap[account.riskLevel] || 'error'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">{account.utilization.toFixed(1)}%</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </Box>
  );

  const renderSelectedAccount = () => {
    if (!selectedAccount) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <ShowChartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No Account Selected
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select an account from the sidebar to view detailed analytics
          </Typography>
        </Box>
      );
    }

    const accountDetails =
      analyticsData?.growthData?.find((acc) => acc.name === selectedAccount.AccountName) || {};

    if (loading) {
      return (
        <Box sx={{ display: 'flex', height: '50vh' }}>
          <Loader />
        </Box>
      );
    }
    return (
      <Box>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={1}>
              <CustomAvatar
                width={{ xs: 40, md: 45, lg: 56 }}
                height={{ xs: 40, md: 45, lg: 56 }}
                iconSize={20}
                icon={selectedAccount?.Icon || 'account_balance'}
                bgColor={selectedAccount?.Color || '#00A76F'}
              />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedAccount?.AccountName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getAccountTypeName(selectedAccount?.TypeId)}
                </Typography>
              </Box>
            </Stack>
          }
          action={
            <CustomSelect
              valueKey="Key"
              labelKey="Value"
              size="small"
              sx={{ width: 120 }}
              menuList={MonthList}
              defaultValue={selectedMonth}
              callBackAction={(value) => setSelectedMonth(value)}
            />
          }
        />

        <Box sx={{ p: 2 }}>
          {/* Account Key Metrics */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 2,
                  textAlign: 'center',
                  border: `solid 1px ${theme.palette.border?.info}`,
                  background: `${theme.palette.gradients?.info}`,
                }}
              >
                <AttachMoneyIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <AnimatedCounter
                  value={selectedAccount?.CurrentAmount || 0}
                  format="currency"
                  variant="h5"
                  color="primary.main"
                  duration={1000}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Current Balance
                </Typography>
                <Typography variant="caption" color="primary.main">
                  Available Funds
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 2,
                  textAlign: 'center',
                  border: `solid 1px ${theme.palette.border?.success}`,
                  background: `${theme.palette.gradients?.success}`,
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                <AnimatedCounter
                  value={accountDetails.growth || 0}
                  format="decimal"
                  suffix="%"
                  variant="h5"
                  color="success.main"
                  duration={1000}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Growth Rate
                </Typography>
                <Typography variant="caption" color="success.main">
                  Since Start
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 2,
                  textAlign: 'center',
                  border: `solid 1px ${theme.palette.border?.warning}`,
                  background: `${theme.palette.gradients?.warning}`,
                }}
              >
                <SpeedIcon sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                <AnimatedCounter
                  value={accountDetails.utilization || 0}
                  format="decimal"
                  suffix="%"
                  variant="h5"
                  color="warning.main"
                  duration={1000}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Utilization
                </Typography>
                <Typography variant="caption" color="warning.main">
                  Capacity Used
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 2,
                  textAlign: 'center',
                  border: `solid 1px ${theme.palette.border?.secondary}`,
                  background: `${theme.palette.gradients?.secondary}`,
                }}
              >
                <AssessmentIcon sx={{ fontSize: 32, color: 'info.main', mb: 1 }} />
                <AnimatedCounter
                  value={accountDetails.healthScore || 0}
                  format="number"
                  suffix="%"
                  variant="h5"
                  color="info.main"
                  duration={1000}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Health Score
                </Typography>
                <Typography variant="caption" color="info.main">
                  Account Health
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {transactionAnalytics && (
            <>
              {/* Transaction Summary Cards */}
              {/* <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'success.lighter' }}>
                    <ReceiptIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                    <AnimatedCounter
                      value={transactionAnalytics.totalIncome}
                      format="currency"
                      variant="h5"
                      color="success.main"
                      duration={1000}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Total Income
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      All Time
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'error.lighter' }}>
                    <TrendingDownIcon sx={{ fontSize: 32, color: 'error.main', mb: 1 }} />
                    <AnimatedCounter
                      value={transactionAnalytics.totalExpense}
                      format="currency"
                      variant="h5"
                      color="error.main"
                      duration={1000}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Total Expense
                    </Typography>
                    <Typography variant="caption" color="error.main">
                      All Time
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: transactionAnalytics.netFlow >= 0 ? 'success.lighter' : 'error.lighter' }}>
                    <AccountBalanceWalletIcon sx={{ fontSize: 32, color: transactionAnalytics.netFlow >= 0 ? 'success.main' : 'error.main', mb: 1 }} />
                    <AnimatedCounter
                      value={transactionAnalytics.netFlow}
                      format="currency"
                      variant="h5"
                      color={transactionAnalytics.netFlow >= 0 ? 'success.main' : 'error.main'}
                      duration={1000}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Net Flow
                    </Typography>
                    <Typography variant="caption" color={transactionAnalytics.netFlow >= 0 ? 'success.main' : 'error.main'}>
                      {transactionAnalytics.netFlow >= 0 ? 'Positive' : 'Negative'}
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'info.lighter' }}>
                    <CalendarTodayIcon sx={{ fontSize: 32, color: 'info.main', mb: 1 }} />
                    <AnimatedCounter
                      value={transactionAnalytics.totalTransactions}
                      format="number"
                      variant="h5"
                      color="info.main"
                      duration={1000}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Total Transactions
                    </Typography>
                    <Typography variant="caption" color="info.main">
                      {transactionAnalytics.transactionFrequency.toFixed(1)} per day
                    </Typography>
                  </Card>
                </Grid>
              </Grid> */}

              {/* Transaction Charts */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <AnimatedChart
                    title="Monthly In vs Out"
                    height={300}
                    animationDuration={2000}
                    chart={{
                      labels: transactionAnalytics.monthlyBreakdown.map((item) => item.month),
                      series: [
                        {
                          name: 'In',
                          type: 'column',
                          fill: 'solid',
                          color: '#00A76F',
                          data: transactionAnalytics.monthlyIncome,
                        },
                        {
                          name: 'Out',
                          type: 'column',
                          fill: 'solid',
                          color: '#FF4842',
                          data: transactionAnalytics.monthlyExpense,
                        },
                      ],
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <AnimatedChart
                    title="Top Spending Categories"
                    height={300}
                    animationDuration={2000}
                    chart={{
                      labels: transactionAnalytics.topCategories.map((item) => item.name),
                      series: [
                        {
                          name: 'Amount',
                          type: 'bar',
                          fill: 'solid',
                          color: '#00B8D9',
                          data: transactionAnalytics.topCategories.map((item) => item.amount),
                        },
                      ],
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <AnimatedChart
                    title="Transaction Trends"
                    height={300}
                    animationDuration={2000}
                    chart={{
                      labels: transactionAnalytics.monthlyBreakdown.map((item) => item.month),
                      series: [
                        {
                          name: 'Transaction Count',
                          type: 'line',
                          fill: 'gradient',
                          color: '#8E44AD',
                          data: transactionAnalytics.transactionTrends,
                        },
                      ],
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <AnimatedChart
                    title="Weekly Spending Pattern"
                    height={300}
                    animationDuration={2000}
                    chart={{
                      labels: transactionAnalytics.weeklySpending.map((item) => item.day),
                      series: [
                        {
                          name: 'Amount',
                          type: 'bar',
                          fill: 'solid',
                          color: '#FFA726',
                          data: transactionAnalytics.weeklySpending.map((item) => item.amount),
                        },
                      ],
                    }}
                  />
                </Grid>
              </Grid>

              {/* Recent Transactions Table */}
              <Card sx={{ mb: 3 }}>
                <CardHeader
                  title={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Recent Transactions
                    </Typography>
                  }
                  subheader={`Last ${transactionAnalytics.recentTransactions.length} transactions`}
                />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactionAnalytics.recentTransactions.map((transaction, index) => {
                        const actionInfo = TransactionActions.find(
                          (a) => a.key === transaction.Action
                        );
                        const isPositive = parseFloat(transaction.AccountAmount) > 0;

                        return (
                          <TableRow key={transaction.TransactionId || index} hover>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {fDate(transaction.Date)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontWeight: 500 }}
                              >
                                {transaction.Description || 'No description'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {transaction.CategoryDetails?.CategoryName || 'Uncategorized'}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                color={isPositive ? 'success.main' : 'error.main'}
                                sx={{ fontWeight: 500 }}
                              >
                                {isPositive ? '+' : ''}
                                {formatToINR(transaction.AccountAmount, isAmountVisible)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={actionInfo?.value || transaction.Action}
                                size="small"
                                sx={{
                                  backgroundColor: actionInfo?.textColor || '#666',
                                  color: 'white',
                                  fontSize: '0.75rem',
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>

              {/* Transaction Statistics */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Transaction Statistics
                    </Typography>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Average Transaction:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatToINR(transactionAnalytics.averageTransaction, isAmountVisible)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Largest Transaction:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatToINR(
                            Math.abs(
                              parseFloat(
                                transactionAnalytics.largestTransaction?.AccountAmount || 0
                              )
                            ).toFixed(2),
                            isAmountVisible
                          )}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Smallest Transaction:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatToINR(
                            Math.abs(
                              parseFloat(
                                transactionAnalytics.smallestTransaction?.AccountAmount || 0
                              )
                            ).toFixed(2),
                            isAmountVisible
                          )}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Transaction Frequency:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {transactionAnalytics.transactionFrequency.toFixed(1)} per day
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Action Breakdown
                    </Typography>

                    <Grid container spacing={2}>
                      {Object.entries(transactionAnalytics.actionBreakdown).map(
                        ([action, amount]) => (
                          <Grid item xs={6} sm={4} key={action}>
                            <Box
                              sx={{
                                textAlign: 'center',
                                p: 1,
                                bgcolor: 'background.textbox',
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {action}
                              </Typography>
                              <Typography variant="h6" color="primary.main">
                                {formatToINR(amount.toFixed(2), isAmountVisible)}
                              </Typography>
                            </Box>
                          </Grid>
                        )
                      )}
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Box>
    );
  };

  return (
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

          {loadingList ? (
            <Grid container spacing={2} sx={{ py: 1 }}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Grid item xs={12} key={item}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2.5 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <>
              {accountsList?.map((item, index) => (
                <ListItem key={item.id || index} disablePadding>
                  <ListItemButton
                    onClick={() => handleAccountSelect(item)}
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
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {item?.AccountName}
                        </Typography>
                        <Typography variant="registerTest" color="text.secondary">
                          {formatToINR(item?.CurrentAmount, isAmountVisible)}
                        </Typography>
                      </Box>
                    </Stack>
                  </ListItemButton>
                </ListItem>
              ))}
            </>
          )}
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

          {activeTab === 0 && renderOverview()}
          {activeTab === 1 && renderSelectedAccount()}
        </Card>
      </Grid>
    </Grid>
  );
}
