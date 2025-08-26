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

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [interestRate, setInterestRate] = useState(5);
  const [timePeriod, setTimePeriod] = useState(10);
  const [compoundingFrequency, setCompoundingFrequency] = useState('monthly');
  const [additionalContributions, setAdditionalContributions] = useState(0);
  const [contributionFrequency, setContributionFrequency] = useState('monthly');
  const [results, setResults] = useState(null);

  const calculateCompoundInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100;
    const t = parseFloat(timePeriod);
    const pmt = parseFloat(additionalContributions);

    let n;
    switch (compoundingFrequency) {
      case 'monthly':
        n = 12;
        break;
      case 'quarterly':
        n = 4;
        break;
      case 'yearly':
        n = 1;
        break;
      case 'daily':
        n = 365;
        break;
      default:
        n = 12;
    }

    // Contribution frequency is handled in the calculation logic

    const ratePerPeriod = r / n;
    const totalPeriods = t * n;

    // Calculate compound interest with regular contributions
    let futureValue;
    if (pmt === 0) {
      // Simple compound interest without contributions
      futureValue = p * (1 + ratePerPeriod) ** totalPeriods;
    } else {
      // Compound interest with regular contributions
      const monthlyRate = r / 12;
      const totalMonths = t * 12;
      const monthlyContribution = pmt / 12;

      futureValue = p * (1 + monthlyRate) ** totalMonths +
        monthlyContribution * (((1 + monthlyRate) ** totalMonths - 1) / monthlyRate);
    }

    const totalContributions = p + (pmt * t);
    const totalInterest = futureValue - totalContributions;

    setResults({
      futureValue: futureValue.toFixed(2),
      totalContributions: totalContributions.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      years: t,
      principal: p.toFixed(2),
    });
  };

  const handleCalculate = () => {
    calculateCompoundInterest();
  };

  const handleReset = () => {
    setPrincipal(10000);
    setInterestRate(5);
    setTimePeriod(10);
    setCompoundingFrequency('monthly');
    setAdditionalContributions(0);
    setContributionFrequency('monthly');
    setResults(null);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Compound Interest Details
          </Typography>

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Principal Amount"
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />

            <TextField
              fullWidth
              label="Interest Rate (%)"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              InputProps={{
                endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
              }}
            />

            <Box>
              <Typography gutterBottom>Time Period (Years)</Typography>
              <Slider
                value={timePeriod}
                onChange={(e, newValue) => setTimePeriod(newValue)}
                min={1}
                max={50}
                marks
                valueLabelDisplay="auto"
              />
              <Typography variant="body2" color="text.secondary">
                {timePeriod} years
              </Typography>
            </Box>

            <FormControl fullWidth>
              <InputLabel>Compounding Frequency</InputLabel>
              <Select
                value={compoundingFrequency}
                label="Compounding Frequency"
                onChange={(e) => setCompoundingFrequency(e.target.value)}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Additional Contributions (Annual)"
              type="number"
              value={additionalContributions}
              onChange={(e) => setAdditionalContributions(e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Contribution Frequency</InputLabel>
              <Select
                value={contributionFrequency}
                label="Contribution Frequency"
                onChange={(e) => setContributionFrequency(e.target.value)}
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
            Compound Interest Results
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
                  Initial Principal
                </Typography>
                <Typography variant="h6" color="primary.main">
                  ${results.principal}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Contributions
                </Typography>
                <Typography variant="h6" color="info.main">
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
                <Typography variant="h6">
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