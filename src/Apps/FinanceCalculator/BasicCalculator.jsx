import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

// ----------------------------------------------------------------------

export default function BasicCalculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([]);

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearDisplay = () => {
    setDisplay('0');
    setWaitingForOperand(false);
  };

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(`${display}.`);
    }
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
      addToHistory(`${currentValue} ${operation} ${inputValue} = ${newValue}`);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operationType) => {
    switch (operationType) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '%':
        return (firstValue * secondValue) / 100;
      default:
        return secondValue;
    }
  };

  const addToHistory = (calculation) => {
    setHistory((prevHistory) => [calculation, ...prevHistory.slice(0, 9)]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleEquals = () => {
    if (!previousValue || !operation) return;

    const inputValue = parseFloat(display);
    const newValue = calculate(previousValue, inputValue, operation);

    setDisplay(String(newValue));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
    addToHistory(`${previousValue} ${operation} ${inputValue} = ${newValue}`);
  };

  const handlePercentage = () => {
    const currentValue = parseFloat(display);
    const newValue = currentValue / 100;
    setDisplay(String(newValue));
    addToHistory(`${currentValue}% = ${newValue}`);
  };

  const handlePlusMinus = () => {
    const currentValue = parseFloat(display);
    const newValue = -currentValue;
    setDisplay(String(newValue));
  };

  const handleSquareRoot = () => {
    const currentValue = parseFloat(display);
    if (currentValue >= 0) {
      const newValue = Math.sqrt(currentValue);
      setDisplay(String(newValue));
      addToHistory(`√${currentValue} = ${newValue}`);
    }
  };

  const handleSquare = () => {
    const currentValue = parseFloat(display);
    const newValue = currentValue ** 2;
    setDisplay(String(newValue));
    addToHistory(`${currentValue}² = ${newValue}`);
  };

  const handleReciprocal = () => {
    const currentValue = parseFloat(display);
    if (currentValue !== 0) {
      const newValue = 1 / currentValue;
      setDisplay(String(newValue));
      addToHistory(`1/${currentValue} = ${newValue}`);
    }
  };

  const CalculatorButton = ({ children, onClick, color, variant = 'outlined', fullWidth = true }) => (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      fullWidth
      sx={{
        minWidth: fullWidth ? '100%' : '60px',
        height: '60px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        textTransform: 'none',
      }}
    >
      {children}
    </Button>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Basic Calculator
          </Typography>

          {/* Display */}
          <TextField
            fullWidth
            value={display}
            variant="outlined"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                fontSize: '2rem',
                fontWeight: 'bold',
                textAlign: 'right',
                height: '80px',
              },
            }}
            InputProps={{
              readOnly: true,
            }}
          />

          {/* Calculator Buttons */}
          <Grid container spacing={1}>
            {/* First Row */}
            <Grid item xs={3}>
              <CalculatorButton onClick={clearAll} color="error" variant="contained">
                AC
              </CalculatorButton>
            </Grid>
            <Grid item xs={3}>
              <CalculatorButton onClick={clearDisplay} color="warning" variant="contained">
                C
              </CalculatorButton>
            </Grid>
            <Grid item xs={3}>
              <CalculatorButton onClick={handlePlusMinus} variant="outlined">
                ±
              </CalculatorButton>
            </Grid>
            <Grid item xs={3}>
              <CalculatorButton onClick={() => performOperation('÷')} color="primary" variant="contained">
                ÷
              </CalculatorButton>
            </Grid>

            {/* Second Row */}
            <Grid item xs={3}>
              <CalculatorButton onClick={() => inputDigit(7)} variant="outlined">
                7
              </CalculatorButton>
            </Grid>
            <Grid item xs={3}>
              <CalculatorButton onClick={() => inputDigit(8)} variant="outlined">
                8
              </CalculatorButton>
            </Grid>
            <Grid item xs={3}>
              <CalculatorButton onClick={() => inputDigit(9)} variant="outlined">
                9
              </CalculatorButton>
            </Grid>
            <Grid item xs={3}>
              <CalculatorButton onClick={() => performOperation('×')} color="primary" variant="contained">
                ×
              </CalculatorButton>
            </Grid>

            {/* Third Row */}
            <Grid item xs={3}>
              <CalculatorButton onClick={() => inputDigit(4)} variant="outlined">
                4
              </CalculatorButton>
            </Grid>
            <Grid item xs={3}>
              <CalculatorButton onClick={() => inputDigit(5)} variant="outlined">
                5
              </CalculatorButton>
            </Grid>
            <Grid item xs={3}>
              <CalculatorButton onClick={() => inputDigit(6)} variant="outlined">
                6
              </CalculatorButton>
            </Grid>
            <Grid item xs={3}>
              <CalculatorButton onClick={() => performOperation('-')} color="primary" variant="contained">
                -
              </CalculatorButton>
            </Grid>

            {/* Fourth Row */}
            <Grid item xs={3}>
              <CalculatorButton onClick={() => inputDigit(1)} variant="outlined">
                1
              </CalculatorButton>
            </Grid>
            <Grid item xs={3}>
              <CalculatorButton onClick={() => inputDigit(2)} variant="outlined">
                2
              </CalculatorButton>
            </Grid>
            <Grid item xs={3}>
              <CalculatorButton onClick={() => inputDigit(3)} variant="outlined">
                3
              </CalculatorButton>
            </Grid>
            <Grid item xs={3}>
              <CalculatorButton onClick={() => performOperation('+')} color="primary" variant="contained">
                +
              </CalculatorButton>
            </Grid>

            {/* Fifth Row */}
            <Grid item xs={3}>
              <CalculatorButton onClick={() => inputDigit(0)} variant="outlined">
                0
              </CalculatorButton>
            </Grid>
            <Grid item xs={3}>
              <CalculatorButton onClick={inputDecimal} variant="outlined">
                .
              </CalculatorButton>
            </Grid>
            <Grid item xs={6}>
              <CalculatorButton onClick={handleEquals} color="success" variant="contained" fullWidth>
                =
              </CalculatorButton>
            </Grid>
          </Grid>

          {/* Scientific Functions */}
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Scientific Functions
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <CalculatorButton onClick={handleSquare} variant="outlined">
                x²
              </CalculatorButton>
            </Grid>
            <Grid item xs={3}>
              <CalculatorButton onClick={handleSquareRoot} variant="outlined">
                √
              </CalculatorButton>
            </Grid>
            <Grid item xs={3}>
              <CalculatorButton onClick={handleReciprocal} variant="outlined">
                1/x
              </CalculatorButton>
            </Grid>
            <Grid item xs={3}>
              <CalculatorButton onClick={handlePercentage} variant="outlined">
                %
              </CalculatorButton>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ p: 3, height: 'fit-content' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              History
            </Typography>
            <Button size="small" onClick={clearHistory} color="error">
              Clear
            </Button>
          </Box>

          <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
            {history.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                <Typography>No calculations yet</Typography>
              </Box>
            ) : (
              <List dense>
                {history.map((item, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={item}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontSize: '0.9rem',
                          fontFamily: 'monospace',
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Card>
      </Grid>
    </Grid>
  );
} 