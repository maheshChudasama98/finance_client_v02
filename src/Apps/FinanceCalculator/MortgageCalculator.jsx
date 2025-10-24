import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [loanAmount, setLoanAmount] = useState(240000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(3000);
  const [homeInsurance, setHomeInsurance] = useState(1200);
  const [pmi, setPmi] = useState(0);
  const [results, setResults] = useState(null);

  const calculateMortgage = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100;
    const term = parseFloat(loanTerm);
    const monthlyRate = rate / 12;
    const numberOfPayments = term * 12;

    if (monthlyRate === 0) {
      const monthlyPayment = principal / numberOfPayments;
      const totalPayment = principal;
      const totalInterest = 0;

      setResults({
        monthlyPayment: monthlyPayment.toFixed(2),
        totalPayment: totalPayment.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        numberOfPayments,
        propertyTaxMonthly: (parseFloat(propertyTax) / 12).toFixed(2),
        insuranceMonthly: (parseFloat(homeInsurance) / 12).toFixed(2),
        pmiMonthly: (parseFloat(pmi) / 12).toFixed(2),
        totalMonthlyPayment: (monthlyPayment + parseFloat(propertyTax) / 12 + parseFloat(homeInsurance) / 12 + parseFloat(pmi) / 12).toFixed(2),
      });
      return;
    }

    const monthlyPayment = principal * (monthlyRate * (1 + monthlyRate) ** numberOfPayments) / ((1 + monthlyRate) ** numberOfPayments - 1);
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    const propertyTaxMonthly = parseFloat(propertyTax) / 12;
    const insuranceMonthly = parseFloat(homeInsurance) / 12;
    const pmiMonthly = parseFloat(pmi) / 12;
    const totalMonthlyPayment = monthlyPayment + propertyTaxMonthly + insuranceMonthly + pmiMonthly;

    setResults({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      numberOfPayments,
      propertyTaxMonthly: propertyTaxMonthly.toFixed(2),
      insuranceMonthly: insuranceMonthly.toFixed(2),
      pmiMonthly: pmiMonthly.toFixed(2),
      totalMonthlyPayment: totalMonthlyPayment.toFixed(2),
    });
  };

  const handleCalculate = () => {
    calculateMortgage();
  };

  const handleReset = () => {
    setHomePrice(300000);
    setDownPayment(60000);
    setLoanAmount(240000);
    setInterestRate(4.5);
    setLoanTerm(30);
    setPropertyTax(3000);
    setHomeInsurance(1200);
    setPmi(0);
    setResults(null);
  };

  const handleHomePriceChange = (value) => {
    setHomePrice(value);
    const newLoanAmount = value - parseFloat(downPayment);
    setLoanAmount(Math.max(0, newLoanAmount));
  };

  const handleDownPaymentChange = (value) => {
    setDownPayment(value);
    const newLoanAmount = parseFloat(homePrice) - value;
    setLoanAmount(Math.max(0, newLoanAmount));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Mortgage Details
          </Typography>

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Home Price"
              type="number"
              value={homePrice}
              onChange={(e) => handleHomePriceChange(e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />

            <TextField
              fullWidth
              label="Down Payment"
              type="number"
              value={downPayment}
              onChange={(e) => handleDownPaymentChange(e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />

            <TextField
              fullWidth
              label="Loan Amount"
              type="number"
              value={loanAmount}
              disabled
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
                min={15}
                max={30}
                marks
                valueLabelDisplay="auto"
              />
              <Typography variant="body2" color="text.secondary">
                {loanTerm} years
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Annual Property Tax"
              type="number"
              value={propertyTax}
              onChange={(e) => setPropertyTax(e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />

            <TextField
              fullWidth
              label="Annual Home Insurance"
              type="number"
              value={homeInsurance}
              onChange={(e) => setHomeInsurance(e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />

            <TextField
              fullWidth
              label="Annual PMI (if applicable)"
              type="number"
              value={pmi}
              onChange={(e) => setPmi(e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />

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
            Mortgage Results
          </Typography>

          {results ? (
            <Stack spacing={2}>
              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Principal & Interest
                </Typography>
                <Typography variant="h5" color="primary.main">
                  ${results.monthlyPayment}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Property Tax (Monthly)
                </Typography>
                <Typography variant="h6" color="info.main">
                  ${results.propertyTaxMonthly}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Insurance (Monthly)
                </Typography>
                <Typography variant="h6" color="info.main">
                  ${results.insuranceMonthly}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  PMI (Monthly)
                </Typography>
                <Typography variant="h6" color="info.main">
                  ${results.pmiMonthly}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Monthly Payment
                </Typography>
                <Typography variant="h5" color="success.main">
                  ${results.totalMonthlyPayment}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Interest Paid
                </Typography>
                <Typography variant="h6" color="warning.main">
                  ${results.totalInterest}
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
              <Typography>Enter mortgage details and click Calculate to see results</Typography>
            </Box>
          )}
        </Card>
      </Grid>
    </Grid>
  );
} 