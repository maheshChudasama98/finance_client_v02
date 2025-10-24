import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';

// ----------------------------------------------------------------------

export default function InvestmentCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [investmentPeriod, setInvestmentPeriod] = useState(10);
  const [compoundingFrequency, setCompoundingFrequency] = useState('monthly');
  const [results, setResults] = useState(null);

  const calculateInvestment = () => {
    const principal = parseFloat(initialInvestment);
    const monthlyCont = parseFloat(monthlyContribution);
    const annualRate = parseFloat(annualReturn) / 100;
    const years = parseFloat(investmentPeriod);

    let frequency;
    switch (compoundingFrequency) {
      case 'monthly':
        frequency = 12;
        break;
      case 'quarterly':
        frequency = 4;
        break;
      case 'yearly':
        frequency = 1;
        break;
      default:
        frequency = 12;
    }

    const ratePerPeriod = annualRate / frequency;
    const totalPeriods = years * frequency;
    const monthlyRate = annualRate / 12;

    // Calculate future value with regular contributions
    const futureValue = principal * (1 + ratePerPeriod) ** totalPeriods +
      monthlyCont * (((1 + monthlyRate) ** totalPeriods - 1) / monthlyRate);

    const totalContributions = principal + (monthlyCont * years * 12);
    const totalInterest = futureValue - totalContributions;

    setResults({
      futureValue: futureValue.toFixed(2),
      totalContributions: totalContributions.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      years,
    });
  };

  const handleCalculate = () => {
    calculateInvestment();
  };

  const handleReset = () => {
    setInitialInvestment(10000);
    setMonthlyContribution(500);
    setAnnualReturn(7);
    setInvestmentPeriod(10);
    setCompoundingFrequency('monthly');
    setResults(null);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Investment Details
          </Typography>

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Initial Investment"
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />

            <TextField
              fullWidth
              label="Monthly Contribution"
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />

            <TextField
              fullWidth
              label="Annual Return Rate (%)"
              type="number"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(e.target.value)}
              InputProps={{
                endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
              }}
            />

            <Box>
              <Typography gutterBottom>Investment Period (Years)</Typography>
              <Slider
                value={investmentPeriod}
                onChange={(e, newValue) => setInvestmentPeriod(newValue)}
                min={1}
                max={50}
                marks
                valueLabelDisplay="auto"
              />
              <Typography variant="body2" color="text.secondary">
                {investmentPeriod} years
              </Typography>
            </Box>

            <FormControl fullWidth>
              <InputLabel>Compounding Frequency</InputLabel>
              <Select
                value={compoundingFrequency}
                label="Compounding Frequency"
                onChange={(e) => setCompoundingFrequency(e.target.value)}
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>

            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleCalculate}
                color="primary"
              >
                Calculate
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleReset}
                color="secondary"
              >
                Reset
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Investment Results
          </Typography>

          {results ? (
            <Stack spacing={2}>
              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Future Value
                </Typography>
                <Typography variant="h5" color="success.main">
                  ${results.futureValue}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Contributions
                </Typography>
                <Typography variant="h5" color="primary.main">
                  ${results.totalContributions}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Interest Earned
                </Typography>
                <Typography variant="h5" color="warning.main">
                  ${results.totalInterest}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Investment Period
                </Typography>
                <Typography variant="h5">
                  {results.years} years
                </Typography>
              </Box>
            </Stack>
          ) : (
            <Box
              sx={{
                p: 3,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              <Typography>Enter investment details and click Calculate to see results</Typography>
            </Box>
          )}
        </Card>
      </Grid>
    </Grid>
  );
} 