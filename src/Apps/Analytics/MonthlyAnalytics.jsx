import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Fade from '@mui/material/Fade';
import { useTheme } from '@mui/system';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { useAmountVisibility } from 'src/hooks/use-amount-visibility';

import { formatToINR } from 'src/utils/format-number';

import { MonthList } from 'src/constance';
import { MonthlyDataService } from 'src/Services/AnalystData.Services';

import { CustomSelect } from 'src/components/CustomComponents';

export default function EnhancedAnalytics() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { isAmountVisible } = useAmountVisibility();

  const startYear = 2021;
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();

  const yearsArray = Array.from({ length: currentYear - startYear + 1 }, (_, i) => ({
    key: startYear + i,
    value: startYear + i,
  }));

  const [selectYear, setSelectYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(MonthList[currentMonthIndex].Key);
  const [actionSummary, setActionSummary] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const [dailySummary, setDailySummary] = useState([]);

  useEffect(() => {
    if (!selectYear || !selectedMonth) return;

    const monthIndex = MonthList.findIndex((m) => m.Key === selectedMonth);
    if (monthIndex === -1) return;
    const selectedDate = new Date(selectYear, monthIndex, 1);

    dispatch(
      MonthlyDataService(
        {
          SelectedDate: selectedDate,
        },
        (res) => {
          if (res.status) {
            setActionSummary(res?.data?.overView);
            setMonthlyData(res?.data);
            setDailySummary(res?.data?.dailySummary);
          }
        }
      )
    );
  }, [selectYear, selectedMonth]);

  const handleCardExpand = (cardId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  // Helper functions for data processing
  const safeDivide = (numerator, denominator, defaultValue = 0) => {
    const num = Number(numerator) || 0;
    const den = Number(denominator) || 0;
    return den === 0 ? defaultValue : num / den;
  };

  const safeMultiply = (value, multiplier, defaultValue = 0) => {
    const val = Number(value) || 0;
    return val * multiplier;
  };

  // Helper functions for status determination
  const getSavingsRateStatus = (rate) => {
    if (rate >= 50) return 'Excellent';
    if (rate >= 30) return 'Perfect';
    if (rate >= 10) return 'Good';
    return 'Low';
  };

  const getSavingsRateColor = (rate) => {
    if (rate >= 30) return 'success.main';
    if (rate >= 10) return 'warning.main';
    return 'error.main';
  };

  const getSavingsRateChipColor = (rate) => {
    if (rate >= 30) return 'success';
    if (rate >= 10) return 'warning';
    return 'error';
  };

  const getExpenseRatioStatus = (ratio) => {
    if (ratio <= 20) return 'Perfect';
    if (ratio <= 30) return 'On Track';
    if (ratio <= 50) return 'Over Budget';
    return 'Critical';
  };

  const getExpenseRatioLabel = (ratio) => {
    if (ratio <= 20) return 'Perfect';
    if (ratio <= 30) return 'Good';
    if (ratio <= 50) return 'Too Much';
    return 'Critical';
  };

  const getExpenseRatioColor = (ratio) => {
    if (ratio <= 30) return 'success.main';
    return 'error.main';
  };

  const getExpenseRatioChipColor = (ratio) => {
    if (ratio <= 30) return 'success';
    return 'error';
  };

  const getInvestmentRatioStatus = (ratio) => {
    if (ratio >= 50) return 'Excellent';
    if (ratio >= 30) return 'Perfect';
    if (ratio >= 10) return 'Good';
    return 'Low';
  };

  const getInvestmentRatioColor = (ratio) => {
    if (ratio >= 30) return 'success.main';
    if (ratio >= 10) return 'warning.main';
    return 'error.main';
  };

  const getInvestmentRatioChipColor = (ratio) => {
    if (ratio >= 30) return 'success';
    if (ratio >= 10) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Monthly Financial Analytics{' '}
              <Chip
                // label="Analytics"
                label={`${
                  actionSummary?.monthName || MonthList.find((m) => m.Key === selectedMonth)?.Value
                } - ${selectYear}`}
                color="primary"
                variant="outlined"
              />
            </Typography>
          }
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <CustomSelect
                valueKey="Key"
                labelKey="Value"
                sx={{ width: 120 }}
                menuList={MonthList}
                defaultValue={selectedMonth}
                callBackAction={(value) => setSelectedMonth(value)}
              />
              <CustomSelect
                valueKey="key"
                labelKey="value"
                sx={{ width: 120 }}
                menuList={yearsArray}
                defaultValue={selectYear}
                callBackAction={(value) => setSelectYear(value)}
              />
            </Box>
          }
        />

        <Grid container spacing={3} sx={{ mt: 3, px: 2 }}>
          {/* Total Income Card */}
          <Grid item xs={6} sm={6} md={3}>
            <Card
              sx={{
                p: 3,
                textAlign: 'center',
                border: `solid 1px ${theme.palette.border?.success}`,
                background: `${theme.palette.gradients?.success}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => handleCardExpand('income')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                {/* <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} /> */}
                <Typography variant="h4" color="success.main" gutterBottom>
                  {formatToINR(actionSummary?.totalIn, isAmountVisible)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Income
              </Typography>
              <Chip
                label={`${(
                  (Number(actionSummary?.totalIn || 0) / Number(actionSummary?.totalIn || 1)) *
                    100 || 0
                ).toFixed(1)}% income rate`}
                color="success"
                size="small"
                sx={{ mt: 1 }}
              />

              <Collapse in={expandedCards.income}>
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Daily Average:{' '}
                    {formatToINR(safeDivide(actionSummary?.totalIn, 30), isAmountVisible)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Transactions: {monthlyData?.statistics?.incomeTransactions || 0}
                  </Typography>
                </Box>
              </Collapse>
            </Card>
          </Grid>

          {/* Total Expense Card */}
          <Grid item xs={6} sm={6} md={3}>
            <Card
              sx={{
                p: 3,
                textAlign: 'center',
                border: `solid 1px ${theme.palette.border?.error}`,
                background: `${theme.palette.gradients?.error}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => handleCardExpand('expense')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <Typography variant="h4" color="error.main" gutterBottom>
                  {formatToINR(actionSummary?.totalExpense, isAmountVisible)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Expense
              </Typography>
              <Chip
                label={`${(
                  (Number(actionSummary?.totalExpense || 0) / Number(actionSummary?.totalIn || 0)) *
                    100 || 0
                ).toFixed(1)}% of income`}
                color="error"
                size="small"
                sx={{ mt: 1 }}
              />

              <Collapse in={expandedCards.expense}>
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Daily Average:{' '}
                    {formatToINR(safeDivide(actionSummary?.totalExpense, 30), isAmountVisible)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Transactions: {monthlyData?.statistics?.expenseTransactions || 0}
                  </Typography>
                </Box>
              </Collapse>
            </Card>
          </Grid>

          {/* Net Savings Card */}
          <Grid item xs={6} sm={6} md={3}>
            <Card
              sx={{
                p: 3,
                textAlign: 'center',
                border: `solid 1px ${theme.palette.border?.warning}`,
                background: `${theme.palette.gradients?.warning}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => handleCardExpand('savings')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <Typography variant="h4" color="warning.main" gutterBottom>
                  {formatToINR(actionSummary?.netSavings, isAmountVisible)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Net Savings
              </Typography>
              <Chip
                label={actionSummary?.netSavings >= 0 ? 'Positive' : 'Negative'}
                color="warning"
                size="small"
                sx={{ mt: 1 }}
              />

              <Collapse in={expandedCards.savings}>
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Savings Rate: {monthlyData?.analytics?.savingsRate?.toFixed(1)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Target:{' '}
                    {formatToINR(safeMultiply(actionSummary?.totalIn, 0.2), isAmountVisible)}
                  </Typography>
                </Box>
              </Collapse>
            </Card>
          </Grid>

          {/* Total Investment Card */}
          <Grid item xs={6} sm={6} md={3}>
            <Card
              sx={{
                p: 3,
                textAlign: 'center',
                border: `solid 1px ${theme.palette.border?.info}`,
                background: `${theme.palette.gradients?.info}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => handleCardExpand('investment')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <Typography variant="h4" color="info.main" gutterBottom>
                  {formatToINR(actionSummary?.totalInvestment, isAmountVisible)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Investment
              </Typography>
              <Chip
                label={`${(
                  (Number(actionSummary?.totalInvestment || 0) /
                    Number(actionSummary?.totalIn || 1)) *
                  100
                ).toFixed(0)}% of income`}
                color="info"
                size="small"
                sx={{ mt: 1 }}
              />

              <Collapse in={expandedCards.investment}>
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Investment Rate: {monthlyData?.analytics?.investmentRatio?.toFixed(1)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Transactions: {monthlyData?.statistics?.investmentTransactions || 0}
                  </Typography>
                </Box>
              </Collapse>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ px: 2, mt: 2, pb: 2 }}>
          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={2}>
                  <Card sx={{ border: 'none', p: 2 }}>
                    <Box sx={{ textAlign: 'center', width: '100%', mb: 2 }}>
                      <Typography variant="h6" color="error.main" gutterBottom>
                        {formatToINR(actionSummary?.totalNetExpense, isAmountVisible)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Net Expense
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Daily Avg:{' '}
                        {formatToINR(
                          safeDivide(actionSummary?.totalNetExpense, 30),
                          isAmountVisible
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        % of Income:{' '}
                        {(
                          safeDivide(actionSummary?.totalNetExpense, actionSummary?.totalIn) * 100
                        ).toFixed(1)}
                        %
                      </Typography>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={6} sm={4} md={2}>
                  <Card sx={{ border: 'none', p: 2 }}>
                    <Box sx={{ textAlign: 'center', width: '100%', mb: 2 }}>
                      <Typography variant="h6" color="error.main" gutterBottom>
                        {formatToINR(actionSummary?.totalInstallment, isAmountVisible)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Installment
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Monthly Avg: {formatToINR(actionSummary?.totalInstallment, isAmountVisible)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        % of Income:{' '}
                        {(
                          safeDivide(actionSummary?.totalInstallment, actionSummary?.totalIn) * 100
                        ).toFixed(1)}
                        %
                      </Typography>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={6} sm={4} md={2}>
                  <Card sx={{ border: 'none', p: 2 }}>
                    <Box sx={{ textAlign: 'center', width: '100%', mb: 2 }}>
                      <Typography variant="h6" color="error.main" gutterBottom>
                        {formatToINR(actionSummary?.totalReturn, isAmountVisible)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Return Paid
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Monthly Avg: {formatToINR(actionSummary?.totalReturn, isAmountVisible)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        % of Income:{' '}
                        {(
                          safeDivide(actionSummary?.totalReturn, actionSummary?.totalIn) * 100
                        ).toFixed(1)}
                        %
                      </Typography>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={6} sm={4} md={2}>
                  <Card sx={{ border: 'none', p: 2 }}>
                    <Box sx={{ textAlign: 'center', width: '100%', mb: 2 }}>
                      <Typography variant="h6" color="info.main" gutterBottom>
                        {formatToINR(actionSummary?.totalRefund, isAmountVisible)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Refund Received
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Monthly Avg: {formatToINR(actionSummary?.totalRefund, isAmountVisible)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        % of Income:{' '}
                        {(
                          safeDivide(actionSummary?.totalRefund, actionSummary?.totalIn) * 100
                        ).toFixed(1)}
                        %
                      </Typography>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={6} sm={4} md={2}>
                  <Card sx={{ border: 'none', p: 2 }}>
                    <Box sx={{ textAlign: 'center', width: '100%', mb: 2 }}>
                      <Typography variant="h6" color="info.main" gutterBottom>
                        {formatToINR(actionSummary?.totalDebit, isAmountVisible)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Debit
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Daily Avg:{' '}
                        {formatToINR(safeDivide(actionSummary?.totalDebit, 30), isAmountVisible)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        % of Income:{' '}
                        {(
                          safeDivide(actionSummary?.totalDebit, actionSummary?.totalIn) * 100
                        ).toFixed(1)}
                        %
                      </Typography>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={6} sm={4} md={2}>
                  <Card sx={{ border: 'none', p: 2 }}>
                    <Box sx={{ textAlign: 'center', width: '100%', mb: 2 }}>
                      <Typography variant="h6" color="info.main" gutterBottom>
                        {formatToINR(actionSummary?.totalCredit, isAmountVisible)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Credit
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Daily Avg:{' '}
                        {formatToINR(safeDivide(actionSummary?.totalCredit, 30), isAmountVisible)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        % of Income:{' '}
                        {(
                          safeDivide(actionSummary?.totalCredit, actionSummary?.totalIn) * 100
                        ).toFixed(1)}
                        %
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={3}>
                  <Card sx={{ border: 'none', p: 2 }}>
                    <Box sx={{ textAlign: 'center', width: '100%', mb: 2 }}>
                      <Typography
                        variant="h4"
                        color={getSavingsRateColor(monthlyData?.analytics?.savingsRate)}
                      >
                        {monthlyData?.analytics?.savingsRate?.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Savings Rate
                      </Typography>
                      <Chip
                        label={getSavingsRateStatus(monthlyData?.analytics?.savingsRate)}
                        color={getSavingsRateChipColor(monthlyData?.analytics?.savingsRate)}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Divider />
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Target: 30% or higher
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Current: {monthlyData?.analytics?.savingsRate?.toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Status: {getSavingsRateStatus(monthlyData?.analytics?.savingsRate)}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={6} sm={4} md={3}>
                  <Card sx={{ border: 'none', p: 2 }}>
                    <Box sx={{ textAlign: 'center', width: '100%', mb: 2 }}>
                      <Typography
                        variant="h4"
                        color={getExpenseRatioColor(monthlyData?.analytics?.expenseRatio)}
                      >
                        {monthlyData?.analytics?.expenseRatio?.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expense Ratio
                      </Typography>
                      <Chip
                        label={getExpenseRatioLabel(monthlyData?.analytics?.expenseRatio)}
                        color={getExpenseRatioChipColor(monthlyData?.analytics?.expenseRatio)}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Divider />
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Target: 30% or lower
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Current: {monthlyData?.analytics?.expenseRatio?.toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Status: {getExpenseRatioStatus(monthlyData?.analytics?.expenseRatio)}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={6} sm={4} md={3}>
                  <Card sx={{ border: 'none', p: 2 }}>
                    <Box sx={{ textAlign: 'center', width: '100%', mb: 2 }}>
                      <Typography
                        variant="h4"
                        color={getInvestmentRatioColor(monthlyData?.analytics?.investmentRatio)}
                      >
                        {monthlyData?.analytics?.investmentRatio?.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Investment Ratio
                      </Typography>
                      <Chip
                        label={getInvestmentRatioStatus(monthlyData?.analytics?.investmentRatio)}
                        color={getInvestmentRatioChipColor(monthlyData?.analytics?.investmentRatio)}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Divider />
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Target: 30% or higher
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Current: {monthlyData?.analytics?.investmentRatio?.toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Status: {getInvestmentRatioStatus(monthlyData?.analytics?.investmentRatio)}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={6} sm={4} md={3}>
                  <Card sx={{ border: 'none', p: 2 }}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 3,
                        border: '2px solid',
                        borderColor: monthlyData?.analytics?.financialHealth?.isHealthy
                          ? 'success.main'
                          : 'warning.main',
                        borderRadius: 2,
                      }}
                    >
                      <Chip
                        label={
                          monthlyData?.analytics?.financialHealth?.isHealthy
                            ? 'Healthy'
                            : 'Needs Attention'
                        }
                        color={
                          monthlyData?.analytics?.financialHealth?.isHealthy ? 'success' : 'warning'
                        }
                        size="large"
                        sx={{ mb: 2 }}
                      />
                      <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
                        Financial Health
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        Overall Score: {monthlyData?.analytics?.financialHealth?.score || 'N/A'}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12}>
            {monthlyData?.analytics?.financialHealth?.recommendations?.length > 0 && (
              <Fade in>
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    Personalized Recommendations
                  </Typography>
                  <Grid container spacing={2}>
                    {monthlyData.analytics.financialHealth.recommendations.map((rec, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Chip
                          label={rec}
                          color="info"
                          variant="outlined"
                          sx={{
                            width: '100%',
                            height: 'auto',
                            py: 2,
                            '& .MuiChip-label': {
                              whiteSpace: 'normal',
                              textAlign: 'center',
                            },
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Fade>
            )}
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
