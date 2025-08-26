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

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(10000);
  const [interestRate, setInterestRate] = useState(5);
  const [loanTerm, setLoanTerm] = useState(12);
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [results, setResults] = useState(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100;
    const term = parseFloat(loanTerm);
    
    let frequency;
    switch (paymentFrequency) {
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

    const monthlyRate = rate / frequency;
    const numberOfPayments = term * frequency;

    if (monthlyRate === 0) {
      const monthlyPayment = principal / numberOfPayments;
      const totalPayment = principal;
      const totalInterest = 0;

      setResults({
        monthlyPayment: monthlyPayment.toFixed(2),
        totalPayment: totalPayment.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        numberOfPayments,
      });
      return;
    }

    const monthlyPayment = principal * (monthlyRate * (1 + monthlyRate) ** numberOfPayments) / ((1 + monthlyRate) ** numberOfPayments - 1);
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    setResults({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      numberOfPayments,
    });
  };

  const handleCalculate = () => {
    calculateLoan();
  };

  const handleReset = () => {
    setLoanAmount(10000);
    setInterestRate(5);
    setLoanTerm(12);
    setPaymentFrequency('monthly');
    setResults(null);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Loan Details
          </Typography>

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Loan Amount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
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
              <Typography gutterBottom>Loan Term (Years)</Typography>
              <Slider
                value={loanTerm}
                onChange={(e, newValue) => setLoanTerm(newValue)}
                min={1}
                max={30}
                marks
                valueLabelDisplay="auto"
              />
              <Typography variant="body2" color="text.secondary">
                {loanTerm} years
              </Typography>
            </Box>

            <FormControl fullWidth>
              <InputLabel>Payment Frequency</InputLabel>
              <Select
                value={paymentFrequency}
                label="Payment Frequency"
                onChange={(e) => setPaymentFrequency(e.target.value)}
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
            Results
          </Typography>

          {results ? (
            <Stack spacing={2}>
              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Monthly Payment
                </Typography>
                <Typography variant="h5" color="primary.main">
                  ${results.monthlyPayment}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Payment
                </Typography>
                <Typography variant="h5" color="success.main">
                  ${results.totalPayment}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Interest
                </Typography>
                <Typography variant="h5" color="warning.main">
                  ${results.totalInterest}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Number of Payments
                </Typography>
                <Typography variant="h5">
                  {results.numberOfPayments}
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
              <Typography>Enter loan details and click Calculate to see results</Typography>
            </Box>
          )}
        </Card>
      </Grid>
    </Grid>
  );
} 