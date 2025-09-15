import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Unstable_Grid2';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import SpeedIcon from '@mui/icons-material/Speed';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartIcon from '@mui/icons-material/BarChart';
import LinearProgress from '@mui/material/LinearProgress';
import ListItemButton from '@mui/material/ListItemButton';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TableContainer from '@mui/material/TableContainer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { formatToINR } from 'src/utils/format-number';
import { MonthList, TimeDurationList } from 'src/constance';

import { AccountsFetchListService } from 'src/Services/Meter.Services';
import { CustomSelect } from 'src/components/CustomComponents';
import { CustomAvatar } from 'src/components/CustomComponents';
import { AnimatedChart, AnimatedCounter } from 'src/components/Animated';

export default function AccountAnalytics() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountsList, setAccountsList] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState('JAN');
  const [timeFrame, setTimeFrame] = useState('MONTH');
  const [loading, setLoading] = useState(false);
  
  const [summaryData, setSummaryData] = useState({
    totalAccounts: 0,
    activeAccounts: 0,
    totalBalance: 0,
    totalStartAmount: 0,
    averageGrowth: 0,
    lowBalanceAccounts: 0,
  });

  // Generate comprehensive time-based data
  const generateTimeBasedData = () => {
    const currentYear = selectedYear.getFullYear();
    const monthIndex = MonthList.findIndex(month => month.Key === selectedMonth);
    
    // Generate detailed monthly trends
    const monthlyTrends = MonthList.map((month, index) => {
      const baseIncome = Math.floor(Math.random() * 200000) + 100000;
      const baseExpense = Math.floor(Math.random() * 150000) + 80000;
      const baseBalance = baseIncome - baseExpense;
      
      return {
        month: month.Value,
        income: baseIncome,
        expense: baseExpense,
        balance: baseBalance,
        transactions: Math.floor(Math.random() * 100) + 20,
        accountGrowth: accountsList.map(acc => {
          const growth = Math.floor(Math.random() * 50) - 10;
          const balance = Math.floor(Math.random() * 500000) + 10000;
          const transactions = Math.floor(Math.random() * 50) + 5;
          const income = Math.floor(Math.random() * 50000) + 10000;
          const expense = Math.floor(Math.random() * 30000) + 5000;
          
          return {
            accountId: acc.id,
            accountName: acc.AccountName,
            growth: growth,
            balance: balance,
            transactions: transactions,
            income: income,
            expense: expense,
            netFlow: income - expense,
            utilization: Math.floor(Math.random() * 100),
            healthScore: Math.floor(Math.random() * 40) + 60,
            riskLevel: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low'
          };
        })
      };
    });

    // Generate detailed weekly trends
    const weeklyTrends = Array.from({ length: 4 }, (_, i) => {
      const baseIncome = Math.floor(Math.random() * 50000) + 25000;
      const baseExpense = Math.floor(Math.random() * 40000) + 20000;
      const baseBalance = baseIncome - baseExpense;
      
      return {
        week: `Week ${i + 1}`,
        income: baseIncome,
        expense: baseExpense,
        balance: baseBalance,
        transactions: Math.floor(Math.random() * 25) + 5,
        accountGrowth: accountsList.map(acc => {
          const growth = Math.floor(Math.random() * 20) - 5;
          const balance = Math.floor(Math.random() * 100000) + 5000;
          const transactions = Math.floor(Math.random() * 15) + 2;
          const income = Math.floor(Math.random() * 15000) + 3000;
          const expense = Math.floor(Math.random() * 10000) + 2000;
          
          return {
            accountId: acc.id,
            accountName: acc.AccountName,
            growth: growth,
            balance: balance,
            transactions: transactions,
            income: income,
            expense: expense,
            netFlow: income - expense,
            utilization: Math.floor(Math.random() * 100),
            healthScore: Math.floor(Math.random() * 40) + 60,
            riskLevel: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low'
          };
        })
      };
    });

    return {
      monthlyTrends,
      weeklyTrends,
      currentTrends: timeFrame === 'WEEK' ? weeklyTrends : monthlyTrends
    };
  };

  useEffect(() => {
    if (accountsList.length > 0) {
      generateAnalyticsData();
      calculateSummary();
    }
  }, [accountsList, selectedYear, selectedMonth, timeFrame]);

  const generateAnalyticsData = () => {
    const totalBalance = accountsList.reduce((sum, acc) => sum + (acc?.CurrentAmount || 0), 0);
    const totalStartAmount = accountsList.reduce((sum, acc) => sum + (acc?.StartAmount || 0), 0);
    const activeAccounts = accountsList.filter((acc) => acc?.isActive);
    const inactiveAccounts = accountsList.filter((acc) => !acc?.isActive);
    const lowBalanceAccounts = accountsList.filter(
      (acc) => acc?.CurrentAmount < acc?.MinAmount
    );

    const accountTypes = {};
    accountsList.forEach((acc) => {
      const typeName = getAccountTypeName(acc?.TypeId);
      accountTypes[typeName] = (accountTypes[typeName] || 0) + 1;
    });

    const growthData = accountsList
      .map((acc) => {
        const growth = acc?.StartAmount > 0
          ? (((acc?.CurrentAmount || 0) - (acc?.StartAmount || 0)) / (acc?.StartAmount || 1)) * 100
          : 0;
        return {
          name: acc?.AccountName,
          growth: growth,
          currentAmount: acc?.CurrentAmount,
          startAmount: acc?.StartAmount,
          netGrowth: (acc?.CurrentAmount || 0) - (acc?.StartAmount || 0),
          growthRate: growth,
          utilization: acc?.MaxAmount > 0 ? ((acc?.CurrentAmount || 0) / acc?.MaxAmount) * 100 : 0,
          healthScore: calculateHealthScore(acc),
          riskLevel: calculateRiskLevel(acc),
          monthlyAverage: Math.floor(Math.random() * 15000) + 5000,
          yearlyProjection: Math.floor(Math.random() * 200000) + 50000,
          volatility: Math.floor(Math.random() * 30) + 5,
          efficiency: Math.floor(Math.random() * 40) + 60
        };
      })
      .sort((a, b) => b.growth - a.growth);

    const utilizationData = accountsList.map((acc) => ({
      name: acc.AccountName,
      utilization: acc?.MaxAmount > 0 
        ? (((acc?.CurrentAmount || 0) - (acc?.MinAmount || 0)) / ((acc?.MaxAmount || 0) - (acc?.MinAmount || 0))) * 100
        : 0,
      currentAmount: acc?.CurrentAmount,
      minAmount: acc?.MinAmount,
      maxAmount: acc?.MaxAmount,
      availableSpace: (acc?.MaxAmount || 0) - (acc?.CurrentAmount || 0),
      utilizationRatio: acc?.MaxAmount > 0 ? (acc?.CurrentAmount || 0) / acc?.MaxAmount : 0
    }));

    const timeBasedData = generateTimeBasedData();

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
      monthlyTrends: timeBasedData.monthlyTrends,
      weeklyTrends: timeBasedData.weeklyTrends,
      currentTrends: timeBasedData.currentTrends,
      netGrowth: totalBalance - totalStartAmount,
      growthPercentage: totalStartAmount > 0 ? ((totalBalance - totalStartAmount) / totalStartAmount) * 100 : 0,
    });
  };

  const calculateHealthScore = (account) => {
    const balance = account?.CurrentAmount || 0;
    const startAmount = account?.StartAmount || 0;
    const minAmount = account?.MinAmount || 0;
    const maxAmount = account?.MaxAmount || 0;
    const isActive = account?.isActive;
    
    let score = 0;
    
    // Balance health (40%)
    if (balance > startAmount) score += 40;
    else if (balance > minAmount) score += 20;
    else score += 0;
    
    // Utilization health (30%)
    if (maxAmount > 0) {
      const utilization = (balance / maxAmount) * 100;
      if (utilization < 50) score += 30;
      else if (utilization < 80) score += 20;
      else score += 10;
    } else score += 30;
    
    // Activity health (20%)
    if (isActive) score += 20;
    else score += 0;
    
    // Growth health (10%)
    if (startAmount > 0) {
      const growth = ((balance - startAmount) / startAmount) * 100;
      if (growth > 10) score += 10;
      else if (growth > 0) score += 5;
      else score += 0;
    } else score += 10;
    
    return Math.min(100, Math.max(0, score));
  };

  const calculateRiskLevel = (account) => {
    const balance = account?.CurrentAmount || 0;
    const minAmount = account?.MinAmount || 0;
    const maxAmount = account?.MaxAmount || 0;
    
    if (balance < minAmount) return 'High';
    if (maxAmount > 0 && (balance / maxAmount) > 0.9) return 'High';
    if (maxAmount > 0 && (balance / maxAmount) > 0.7) return 'Medium';
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    setActiveTab(1);
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
    const growthScore = Math.max(0, Math.min(100, summaryData.averageGrowth + 50));

    return Math.round(activeRatio * 0.4 + growthScore * 0.4 + (100 - lowBalanceRatio) * 0.2);
  };

  const healthScore = getHealthScore();

  const getHealthColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  useEffect(() => {
    setLoading(true);
    dispatch(
      AccountsFetchListService({}, (res) => {
        if (res?.status) {
          setAccountsList(res?.data?.list);
          calculateSummary();
        }
        setLoading(false);
      })
    );
  }, []);

  // Overview Tab Component
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
              menuList={TimeDurationList}
              defaultValue={timeFrame}
              callBackAction={(value) => setTimeFrame(value)}
            />
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
        {/* Key Performance Indicators */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'success.lighter' }}>
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
            <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'info.lighter' }}>
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
                {summaryData?.totalAccounts > 0 ? 
                  Math.round((summaryData.activeAccounts / summaryData.totalAccounts) * 100) : 0}% of total
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.lighter' }}>
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
            <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'error.lighter' }}>
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
        </Grid>

        {/* Detailed Analytics Charts */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <AnimatedChart
              title="Account Type Distribution"
              height={350}
              chart={{
                labels: analyticsData?.accountTypesKey || [],
                series: [{
                  name: 'Accounts',
                  type: 'pie',
                  data: analyticsData?.accountTypesValue || [],
                }],
                options: {
                  colors: ['#00A76F', '#FF4842', '#00B8D9', '#FFA726', '#8E44AD', '#2ECC71'],
                  plotOptions: {
                    pie: {
                      donut: {
                        size: '60%',
                      },
                    },
                  },
                  dataLabels: {
                    enabled: true,
                    formatter: (val) => `${val}%`,
                  },
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <AnimatedChart
              title={`${timeFrame === 'WEEK' ? 'Weekly' : 'Monthly'} Performance Trends`}
              height={350}
              chart={{
                labels: analyticsData?.currentTrends?.map(item => 
                  timeFrame === 'WEEK' ? item.week : item.month
                ) || [],
                series: [
                  {
                    name: 'Income',
                    type: 'area',
                    fill: 'gradient',
                    color: '#00A76F',
                    data: analyticsData?.currentTrends?.map(item => item.income) || [],
                  },
                  {
                    name: 'Expense',
                    type: 'area',
                    fill: 'gradient',
                    color: '#FF4842',
                    data: analyticsData?.currentTrends?.map(item => item.expense) || [],
                  },
                  {
                    name: 'Net Flow',
                    type: 'line',
                    color: '#00B8D9',
                    data: analyticsData?.currentTrends?.map(item => item.balance) || [],
                  },
                ],
              }}
            />
          </Grid>
        </Grid>

        {/* Account Performance Analysis */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <AnimatedChart
              title="Account Growth Analysis"
              height={400}
              chart={{
                labels: analyticsData?.growthData?.map(item => item.name) || [],
                series: [
                  {
                    name: 'Current Amount',
                    type: 'column',
                    fill: 'solid',
                    color: '#00A76F',
                    data: analyticsData?.growthData?.map(item => item.currentAmount) || [],
                  },
                  {
                    name: 'Start Amount',
                    type: 'column',
                    fill: 'solid',
                    color: '#FF4842',
                    data: analyticsData?.growthData?.map(item => item.startAmount) || [],
                  },
                ],
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <AnimatedChart
              title="Account Health Score"
              height={400}
              chart={{
                labels: analyticsData?.growthData?.map(item => item.name) || [],
                series: [{
                  name: 'Health Score',
                  type: 'radialBar',
                  data: analyticsData?.growthData?.map(item => item.healthScore) || [],
                }],
                options: {
                  colors: ['#00A76F', '#FFA726', '#FF4842'],
                  plotOptions: {
                    radialBar: {
                      dataLabels: {
                        name: {
                          fontSize: '12px',
                        },
                        value: {
                          fontSize: '16px',
                          formatter: (val) => `${val}%`,
                        },
                      },
                    },
                  },
                },
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
                  {/* <TableCell align="right">Current Balance</TableCell> */}
                  <TableCell align="right">Growth %</TableCell>
                  <TableCell align="right">Health Score</TableCell>
                  <TableCell align="right">Risk Level</TableCell>
                  <TableCell align="right">Utilization</TableCell>
                  {/* <TableCell align="right">Monthly Avg</TableCell> */}
                  <TableCell align="right">Volatility</TableCell>
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
                            bgcolor: account.healthScore >= 80 ? '#00A76F' : 
                                    account.healthScore >= 60 ? '#FFA726' : '#FF4842'
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {account.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    {/* <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatToINR(account.currentAmount)}
                      </Typography>
                    </TableCell> */}
                    <TableCell align="right">
                      <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
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
                              backgroundColor: account.healthScore >= 80 ? '#00A76F' : 
                                            account.healthScore >= 60 ? '#FFA726' : '#FF4842',
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
                        color={account.riskLevel === 'Low' ? 'success' : 
                               account.riskLevel === 'Medium' ? 'warning' : 'error'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {account.utilization.toFixed(1)}%
                      </Typography>
                    </TableCell>
                    {/* <TableCell align="right">
                      <Typography variant="body2">
                        {formatToINR(account.monthlyAverage)}
                      </Typography>
                    </TableCell> */}
                    <TableCell align="right">
                      <Typography variant="body2">
                        {account.volatility}%
                      </Typography>
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

  // Selected Account Tab Component
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

    const accountGrowth = analyticsData?.currentTrends?.find(trend => 
      trend.accountGrowth?.some(acc => acc.accountId === selectedAccount.id)
    )?.accountGrowth?.find(acc => acc.accountId === selectedAccount.id) || {};

    const accountDetails = analyticsData?.growthData?.find(acc => 
      acc.name === selectedAccount.AccountName
    ) || {};

    return (
      <Box>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={2}>
              <CustomAvatar
                width={60}
                height={60}
                iconSize={24}
                icon={selectedAccount?.Icon || 'account_balance'}
                bgColor={selectedAccount?.Color || '#00A76F'}
              />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {selectedAccount?.AccountName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getAccountTypeName(selectedAccount?.TypeId)} • Account ID: {selectedAccount?.id}
                </Typography>
              </Box>
            </Stack>
          }
          subheader={`Last updated: ${new Date().toLocaleDateString()}`}
          action={
            <Stack direction="row" spacing={2} alignItems="center">
              <CustomSelect
                valueKey="Key"
                labelKey="Value"
                size="small"
                sx={{ width: 120 }}
                menuList={TimeDurationList}
                defaultValue={timeFrame}
                callBackAction={(value) => setTimeFrame(value)}
              />
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
          {/* Account Key Metrics */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.lighter' }}>
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
                  Available funds
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'success.lighter' }}>
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
                  Since start
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'info.lighter' }}>
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
                  Account health
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.lighter' }}>
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
                  Capacity used
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Additional Metrics */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <ReceiptIcon sx={{ fontSize: 24, color: 'text.secondary', mb: 1 }} />
                <Typography variant="h6" color="text.primary">
                  {accountGrowth.transactions || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Transactions
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <TimelineIcon sx={{ fontSize: 24, color: 'text.secondary', mb: 1 }} />
                <Typography variant="h6" color="text.primary">
                  {formatToINR(accountDetails.monthlyAverage || 0)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Monthly Average
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <CalendarTodayIcon sx={{ fontSize: 24, color: 'text.secondary', mb: 1 }} />
                <Typography variant="h6" color="text.primary">
                  {formatToINR(accountDetails.yearlyProjection || 0)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Yearly Projection
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <BarChartIcon sx={{ fontSize: 24, color: 'text.secondary', mb: 1 }} />
                <Typography variant="h6" color="text.primary">
                  {accountDetails.volatility || 0}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Volatility
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Performance Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <AnimatedChart
                title={`${selectedAccount?.AccountName} Performance Over Time`}
                height={400}
                chart={{
                  labels: analyticsData?.currentTrends?.map(item => 
                    timeFrame === 'WEEK' ? item.week : item.month
                  ) || [],
                  series: [
                    {
                      name: 'Balance',
                      type: 'line',
                      fill: 'gradient',
                      color: selectedAccount?.Color || '#00A76F',
                      data: analyticsData?.currentTrends?.map(() => 
                        Math.floor(Math.random() * 100000) + 10000
                      ) || [],
                    },
                    {
                      name: 'Growth %',
                      type: 'line',
                      color: '#FF4842',
                      data: analyticsData?.currentTrends?.map(() => 
                        Math.floor(Math.random() * 50) - 10
                      ) || [],
                    },
                    {
                      name: 'Health Score',
                      type: 'line',
                      color: '#00B8D9',
                      data: analyticsData?.currentTrends?.map(() => 
                        Math.floor(Math.random() * 40) + 60
                      ) || [],
                    },
                  ],
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <AnimatedChart
                title="Account Health Breakdown"
                height={400}
                chart={{
                  labels: ['Balance Health', 'Utilization', 'Activity', 'Growth'],
                  series: [{
                    name: 'Health Score',
                    type: 'radialBar',
                    data: [
                      Math.floor(Math.random() * 40) + 60,
                      Math.floor(Math.random() * 40) + 60,
                      Math.floor(Math.random() * 40) + 60,
                      Math.floor(Math.random() * 40) + 60,
                    ],
                  }],
                  options: {
                    colors: ['#00A76F', '#FFA726', '#FF4842', '#00B8D9'],
                    plotOptions: {
                      radialBar: {
                        dataLabels: {
                          name: {
                            fontSize: '12px',
                          },
                          value: {
                            fontSize: '16px',
                            formatter: (val) => `${val}%`,
                          },
                        },
                      },
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
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

          {accountsList?.map((item, index) => (
            <ListItem key={item.id || index} disablePadding>
              <ListItemButton
                selected={selectedAccount?.id === item.id}
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
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item?.AccountName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatToINR(item?.CurrentAmount)}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    {item?.isActive && (
                      <Chip
                        label="Active"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                    <Badge
                      color={item?.CurrentAmount < item?.MinAmount ? 'error' : 'success'}
                      variant="dot"
                    />
                  </Stack>
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
