import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import EMICalculator from './EMICalculator';
import LoanCalculator from './LoanCalculator';
import BasicCalculator from './BasicCalculator';
import MortgageCalculator from './MortgageCalculator';
import InvestmentCalculator from './InvestmentCalculator';
import CompoundInterestCalculator from './CompoundInterestCalculator';

// ----------------------------------------------------------------------

const CALCULATOR_TABS = [
  {
    value: 'basic',
    label: 'Basic Calculator',
    icon: 'eva:calculator-fill',
  },
  {
    value: 'loan',
    label: 'Loan Calculator',
    icon: 'eva:credit-card-fill',
  },
  {
    value: 'investment',
    label: 'Investment Calculator',
    icon: 'eva:trending-up-fill',
  },
  {
    value: 'mortgage',
    label: 'Mortgage Calculator',
    icon: 'eva:home-fill',
  },
  {
    value: 'compound',
    label: 'Compound Interest',
    icon: 'eva:pie-chart-fill',
  },
  {
    value: 'emi',
    label: 'EMI Calculator',
    icon: 'eva:calendar-fill',
  },
];

// ----------------------------------------------------------------------

export default function FinanceCalculator() {
  const [currentTab, setCurrentTab] = useState('basic');

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const renderCalculator = () => {
    switch (currentTab) {
      case 'basic':
        return <BasicCalculator />;
      case 'loan':
        return <LoanCalculator />;
      case 'investment':
        return <InvestmentCalculator />;
      case 'mortgage':
        return <MortgageCalculator />;
      case 'compound':
        return <CompoundInterestCalculator />;
      case 'emi':
        return <EMICalculator />;
      default:
        return <BasicCalculator />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Finance Calculator
      </Typography>

      <Card sx={{ p: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 2,
            bgcolor: 'background.neutral',
            borderRadius: 1,
            mb: 3,
          }}
        >
          {CALCULATOR_TABS.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
              icon={<Iconify icon={tab.icon} />}
              iconPosition="start"
            />
          ))}
        </Tabs>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            {renderCalculator()}
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
} 