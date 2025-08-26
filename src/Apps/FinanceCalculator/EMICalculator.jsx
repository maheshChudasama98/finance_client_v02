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

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(8);
  const [loanTerm, setLoanTerm] = useState(60);
  const [processingFee, setProcessingFee] = useState(0);
  const [results, setResults] = useState(null);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100;
    const term = parseFloat(loanTerm);
    const processingFeeAmount = parseFloat(processingFee);

    const monthlyRate = rate / 12;
    const numberOfPayments = term;

    if (monthlyRate === 0) {
      const emi = principal / numberOfPayments;
      const totalPayment = principal;
      const totalInterest = 0;

      setResults({
        emi: emi.toFixed(2),
        totalPayment: totalPayment.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        numberOfPayments,
        processingFee: processingFeeAmount.toFixed(2),
        totalAmountWithFees: (totalPayment + processingFeeAmount).toFixed(2),
      });
      return;
    }

    const emi = principal * (monthlyRate * (1 + monthlyRate) ** numberOfPayments) / ((1 + monthlyRate) ** numberOfPayments - 1);
    const totalPayment = emi * numberOfPayments;
    const totalInterest = totalPayment - principal;

    setResults({
      emi: emi.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      numberOfPayments,
      processingFee: processingFeeAmount.toFixed(2),
      totalAmountWithFees: (totalPayment + processingFeeAmount).toFixed(2),
    });
  };

  const handleCalculate = () => {
    calculateEMI();
  };

  const handleReset = () => {
    setLoanAmount(100000);
    setInterestRate(8);
    setLoanTerm(60);
    setProcessingFee(0);
    setResults(null);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            EMI Details
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
              <Typography gutterBottom>Loan Term (Months)</Typography>
              <Slider
                value={loanTerm}
                onChange={(e, newValue) => setLoanTerm(newValue)}
                min={12}
                max={360}
                marks
                valueLabelDisplay="auto"
              />
              <Typography variant="body2" color="text.secondary">
                {loanTerm} months ({Math.round(loanTerm / 12)} years)
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Processing Fee"
              type="number"
              value={processingFee}
              onChange={(e) => setProcessingFee(e.target.value)}
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
                Calculate EMI
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
            EMI Results
          </Typography>

          {results ? (
            <Stack spacing={2}>
              <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Monthly EMI
                </Typography>
                <Typography variant="h5" color="success.main">
                  ${results.emi}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Payment
                </Typography>
                <Typography variant="h6" color="primary.main">
                  ${results.totalPayment}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Interest
                </Typography>
                <Typography variant="h6" color="warning.main">
                  ${results.totalInterest}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Number of Payments
                </Typography>
                <Typography variant="h6">
                  {results.numberOfPayments} months
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Processing Fee
                </Typography>
                <Typography variant="h6" color="info.main">
                  ${results.processingFee}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Amount (Including Fees)
                </Typography>
                <Typography variant="h5" color="warning.main">
                  ${results.totalAmountWithFees}
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
              <Typography>Enter loan details and click Calculate EMI to see results</Typography>
            </Box>
          )}
        </Card>
      </Grid>
    </Grid>
  );
} 