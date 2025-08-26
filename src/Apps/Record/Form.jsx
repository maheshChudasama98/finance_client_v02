import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import List from '@mui/material/List';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { formatToINR } from 'src/utils/format-number';
import { sweetAlertQuestion } from 'src/utils/sweet-alerts';

import { BackEndSendFormat, TransactionActions } from 'src/constance';
import {
  TransactionModifyService,
  TransactionFetchDataService,
} from 'src/Services/Transaction.Services';

import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { CustomAvatar } from 'src/components/CustomComponents';
import {
  DateAndTime,
  TextFieldForm,
  AutoCompleteSelectMenu,
  AutoCompleteSelectMultiple,
} from 'src/components/inputs';

import { Row, Col } from 'antd';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

import dayjs from 'dayjs';

const CalculatorModal = ({ onClose, onCalculate }) => {
  const [display, setDisplay] = useState('0');
  const [calculationDisplay, setCalculationDisplay] = useState('');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const clearAll = () => {
    setDisplay('0');
    setCalculationDisplay('');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearDisplay = () => {
    setDisplay('0');
    setCalculationDisplay('');
    setWaitingForOperand(false);
  };

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      if (calculationDisplay.includes('=')) {
        setCalculationDisplay(String(digit));
      } else {
        setCalculationDisplay(`${calculationDisplay} ${digit}`);
      }
      setWaitingForOperand(false);
    } else {
      const newDisplay = display === '0' ? String(digit) : display + digit;
      setDisplay(newDisplay);

      if (calculationDisplay === '' || calculationDisplay.endsWith(' ')) {
        setCalculationDisplay(newDisplay);
      } else {
        const parts = calculationDisplay.split(' ');
        if (parts.length > 0) {
          const lastPart = parts[parts.length - 1];
          if (!Number.isNaN(parseFloat(lastPart)) || lastPart === '') {
            parts[parts.length - 1] = newDisplay;
            setCalculationDisplay(parts.join(' '));
          } else {
            setCalculationDisplay(`${calculationDisplay} ${newDisplay}`);
          }
        }
      }
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      if (calculationDisplay.includes('=')) {
        setCalculationDisplay('0.');
      } else {
        setCalculationDisplay(`${calculationDisplay} 0.`);
      }
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      const newDisplay = `${display}.`;
      setDisplay(newDisplay);

      if (calculationDisplay === '' || calculationDisplay.endsWith(' ')) {
        setCalculationDisplay(newDisplay);
      } else {
        const parts = calculationDisplay.split(' ');
        if (parts.length > 0) {
          const lastPart = parts[parts.length - 1];
          if (!Number.isNaN(parseFloat(lastPart)) || lastPart === '') {
            parts[parts.length - 1] = newDisplay;
            setCalculationDisplay(parts.join(' '));
          } else {
            setCalculationDisplay(`${calculationDisplay} ${newDisplay}`);
          }
        }
      }
    }
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setCalculationDisplay(`${display} ${nextOperation}`);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(newValue);
      setCalculationDisplay(`${String(newValue)} ${nextOperation}`);
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
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    if (!previousValue || !operation) return;

    const inputValue = parseFloat(display);
    const newValue = calculate(previousValue, inputValue, operation);
    const calculation = `${previousValue} ${operation} ${inputValue} = ${newValue}`;

    setDisplay(String(newValue));
    setCalculationDisplay(calculation);

    setHistory((prev) => [calculation, ...prev.slice(0, 9)]);

    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const calculateTotal = () => {
    let total = 0;
    history.forEach((item) => {
      const result = item.split('=')[1]?.trim();
      if (result && !Number.isNaN(parseFloat(result))) {
        total += parseFloat(result);
      }
    });
    return total;
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event) => {
      const { key } = event;

      if (key >= '0' && key <= '9') {
        inputDigit(parseInt(key, 10));
      } else if (key === '.') {
        inputDecimal();
      } else if (key === '+') {
        performOperation('+');
      } else if (key === '-') {
        performOperation('-');
      } else if (key === '*') {
        performOperation('×');
      } else if (key === '/') {
        performOperation('÷');
      } else if (key === 'Enter' || key === '=') {
        handleEquals();
      } else if (key === 'Escape') {
        clearAll();
      } else if (key === 'Backspace') {
        clearDisplay();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [display, calculationDisplay, previousValue, operation, waitingForOperand]);

  const CalculatorButton = ({
    children,
    onClick,
    color,
    variant = 'outlined',
    fullWidth = false,
  }) => (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      fullWidth
      sx={{
        // minWidth: fullWidth ? '100%' : '50px',
        // height: '50px',
        fontSize: '1rem',
        // fontWeight: 'bold',
        // textTransform: 'none',
      }}
    >
      {children}
    </Button>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ minHeight: 'auto' }}
        >
          <Tab value={0} label="Calculator" />
          <Tab value={1} label="History" />
        </Tabs>

        <Button onClick={onClose} size="small">
          Close
        </Button>
      </Box>

      {activeTab === 0 ? (
        <>
          <TextField
            fullWidth
            value={calculationDisplay || display}
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'right',
                height: '60px',
              },
            }}
            InputProps={{
              readOnly: true,
            }}
          />
          <Box sx={{}}>
            <Row gutter={[10, 10]}>
              {/* First Row */}

              <Col span={6}>
                <CalculatorButton onClick={clearAll} color="error" variant="contained">
                  AC
                </CalculatorButton>
              </Col>
              <Col span={6}>
                <CalculatorButton onClick={clearDisplay} color="warning" variant="contained">
                  C
                </CalculatorButton>
              </Col>
              <Col span={6}>
                <CalculatorButton
                  onClick={() => {
                    const total = calculateTotal();
                    setDisplay(String(total));
                    setCalculationDisplay(`Total: ${total}`);
                  }}
                  color="info"
                  variant="contained"
                >
                  Total
                </CalculatorButton>
              </Col>
              <Col span={6}>
                <CalculatorButton
                  onClick={() => performOperation('÷')}
                  color="primary"
                  variant="contained"
                >
                  ÷
                </CalculatorButton>
              </Col>

              {/* Second Row */}

              <Col span={6}>
                <CalculatorButton onClick={() => inputDigit(7)} variant="outlined">
                  7
                </CalculatorButton>
              </Col>
              <Col span={6}>
                <CalculatorButton onClick={() => inputDigit(8)} variant="outlined">
                  8
                </CalculatorButton>
              </Col>
              <Col span={6}>
                <CalculatorButton onClick={() => inputDigit(9)} variant="outlined">
                  9
                </CalculatorButton>
              </Col>

              <Col span={6}>
                <CalculatorButton
                  onClick={() => performOperation('×')}
                  color="primary"
                  variant="contained"
                >
                  ×
                </CalculatorButton>
              </Col>

              {/* Third Row */}

              <Col span={6}>
                <CalculatorButton onClick={() => inputDigit(4)} variant="outlined">
                  4
                </CalculatorButton>
              </Col>
              <Col span={6}>
                <CalculatorButton onClick={() => inputDigit(5)} variant="outlined">
                  5
                </CalculatorButton>
              </Col>
              <Col span={6}>
                <CalculatorButton onClick={() => inputDigit(6)} variant="outlined">
                  6
                </CalculatorButton>
              </Col>

              <Col span={6}>
                <CalculatorButton
                  onClick={() => performOperation('-')}
                  color="primary"
                  variant="contained"
                >
                  -
                </CalculatorButton>
              </Col>

              {/* Fourth Row */}
              <Col span={6}>
                <CalculatorButton onClick={() => inputDigit(1)} variant="outlined">
                  1
                </CalculatorButton>
              </Col>
              <Col span={6}>
                <CalculatorButton onClick={() => inputDigit(2)} variant="outlined">
                  2
                </CalculatorButton>
              </Col>
              <Col span={6}>
                <CalculatorButton onClick={() => inputDigit(3)} variant="outlined">
                  3
                </CalculatorButton>
              </Col>

              <Col span={6}>
                <CalculatorButton
                  onClick={() => performOperation('+')}
                  color="primary"
                  variant="contained"
                >
                  +
                </CalculatorButton>
              </Col>

              {/* Fifth Row */}

              <Col span={6}>
                <CalculatorButton
                  onClick={() => onCalculate(parseFloat(display))}
                  color="success"
                  variant="contained"
                  fullWidth
                >
                  Use
                </CalculatorButton>
              </Col>

              <Col span={6}>
                <CalculatorButton onClick={() => inputDigit(0)} variant="outlined">
                  0
                </CalculatorButton>
              </Col>

              <Col span={6}>
                <CalculatorButton onClick={inputDecimal} variant="outlined">
                  .
                </CalculatorButton>
              </Col>
              <Col span={6}>
                <CalculatorButton onClick={handleEquals} color="success" variant="contained">
                  =
                </CalculatorButton>
              </Col>
            </Row>
          </Box>
        </>
      ) : (
        <Box sx={{ height: '310px', overflow: 'auto' }}>
          {history.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No calculations in history
              </Typography>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography variant="h6">Calculation History</Typography>
                <Button onClick={clearHistory} size="small" color="error">
                  Clear History
                </Button>
              </Box>
              {history.length > 0 && (
                <Box sx={{ mb: 1, py: 1, px: 2, bgcolor: 'primary.main', borderRadius: 1 }}>
                  <Typography variant="h6" color="primary.contrastText">
                    Total: {calculateTotal()}
                  </Typography>
                </Box>
              )}
              <List>
                {history.map((item, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={item}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontFamily: 'monospace',
                          fontSize: '0.9rem',
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default function Index({ backAction, editObject, deleteAction }) {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  const [accountList, setAccountList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [labelsList, setLabelsList] = useState([]);
  const [partyList, setPartyList] = useState([]);

  useEffect(() => {
    dispatch(
      TransactionFetchDataService((res) => {
        setAccountList(
          res?.accountList?.filter(
            (item) => item?.isActive === 1 || editObject?.AccountId === item?.AccountId
          ) || []
        );

        setCategoriesList(
          res?.categoriesList?.filter(
            (item) => item?.isActive === 1 || editObject?.CategoryId === item?.CategoryId
          ) || []
        );

        setLabelsList(res?.labelsList || []);

        setPartyList(
          res?.partyList?.filter(
            (item) => item?.isActive === 1 || editObject?.PartyId === item?.PartyId
          ) || []
        );
        // setCategoriesList(res?.categoriesList || []);
        // setLabelsList(res?.labelsList || []);
        // setPartyList(res?.partyList || []);
      })
    );
  }, [show]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        Action: editObject?.Action || 'Out',
        DateDay: editObject?.Date ? dayjs(editObject?.Date) : null,
        Amount: editObject?.Amount || null,
        AccountId: editObject?.AccountId || null,
        CategoryId: editObject?.CategoryId || null,
        SubCategoryId: editObject?.SubCategoryId || null,
        TransferToAccountId: editObject?.TransferToAccountId || null,
        PartyId: editObject?.PartyId || null,
        Description: editObject?.Description || null,
        Tags: editObject?.Tags ? editObject.Tags.split(',').map(Number) : [] || null,
      }}
      validationSchema={Yup.object().shape({
        Action: Yup.string().required('Action is required.'),
        DateDay: Yup.string().required('Date is required.'),
        Amount: Yup.string().required('Amount is required.'),
        AccountId: Yup.string().required('Account is required.'),
        CategoryId: Yup.number().when('Action', {
          is: (value) => value === 'In' || value === 'Out',
          then: (schema) => schema.required('Category is required.'),
          otherwise: (schema) => schema.nullable(),
        }),
        SubCategoryId: Yup.number().when('Action', {
          is: (value) => value === 'In' || value === 'Out',
          then: (schema) => schema.required('Sub Category is required.'),
          otherwise: (schema) => schema.nullable(),
        }),
        TransferToAccountId: Yup.number().when('Action', {
          is: (value) => value === 'Investment' || value === 'From',
          then: (schema) => schema.required('Transfer is required'),
          otherwise: (schema) => schema.nullable(),
        }),
        PartyId: Yup.number().when('Action', {
          is: (value) => value === 'Credit' || value === 'Debit',
          then: (schema) => schema.required('Party is required'),
          otherwise: (schema) => schema.nullable(),
        }),
      })}
      onSubmit={(values) => {
        setFormSubmitLoader(true);
        if (values?.Action === 'In' || values?.Action === 'Out') {
          delete values.TransferToAccountId;
          delete values.PartyId;
        } else if (
          values?.Action === 'From' ||
          values?.Action === 'Investment' ||
          values?.Action === 'Refund' ||
          values?.Action === 'Return' ||
          values?.Action === 'Credit' ||
          values?.Action === 'Debit'
        ) {
          delete values.SubCategoryId;
          delete values.CategoryId;
        }

        if (values?.Action === 'From') {
          values.Action = 'Transfer';
        }

        if (editObject?.TransactionId) {
          values.TransactionId = editObject?.TransactionId;
        }

        values.Date = dayjs(values.DateDay).startOf('day').format(BackEndSendFormat);
        delete values.DateDay;
        dispatch(
          TransactionModifyService(values, (res) => {
            setFormSubmitLoader(false);

            setShow(false);
            if (res?.status) {
              setShow(false);
              backAction();
            }
          })
        );
      }}
    >
      {(props) => {
        const { setFieldValue, handleSubmit, values, dirty, resetForm } = props;
        return (
          <>
            <Form noValidate>
              <Grid
                container
                spacing={2}
                sx={{
                  paddingY: 2,
                  paddingX: 2,
                }}
              >
                <Grid item xs={12}>
                  <AutoCompleteSelectMenu
                    formik={props}
                    label="Action"
                    field="Action"
                    menuList={TransactionActions}
                    valueKey="key"
                    labelKey="value"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DateAndTime
                    formik={props}
                    label="Date"
                    field="DateDay"
                    defaultValue={values.DateDay}
                    callBackAction={(event) => {
                      setFieldValue('DateDay', dayjs(event));
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextFieldForm
                    type="number"
                    formik={props}
                    field="Amount"
                    label="Amount"
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setCalculatorOpen(true)}
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'primary.dark',
                            },
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                          >
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              d="M7 .222c1.128 0 2.256.042 3.42.127a2.67 2.67 0 0 1 2.466 2.513a71 71 0 0 1 0 8.276a2.67 2.67 0 0 1-2.466 2.513a46 46 0 0 1-6.84 0a2.67 2.67 0 0 1-2.466-2.513a71 71 0 0 1-.006-8.168l.006-.108A2.67 2.67 0 0 1 3.581.35A47 47 0 0 1 7 .222m-.82 1.507q.933-.017 1.864.005c.746.018 1.498.055 2.266.111a1.17 1.17 0 0 1 1.078 1.104c.04.686.07 1.754.09 2.628H2.521a94 94 0 0 1 .084-2.524l.006-.104A1.17 1.17 0 0 1 3.69 1.845c.845-.062 1.67-.1 2.49-.116m1.15 1.92a.75.75 0 0 1 .75-.75h1.373a.75.75 0 0 1 0 1.5H8.08a.75.75 0 0 1-.75-.75m-4.1 7.292c0-.345.28-.625.625-.625h.328a.625.625 0 1 1 0 1.25h-.328a.625.625 0 0 1-.625-.625m3.603-.625a.625.625 0 1 0 0 1.25h.328a.625.625 0 0 0 0-1.25zm2.398.625c0-.345.28-.625.625-.625h.328a.625.625 0 0 1 0 1.25h-.328a.625.625 0 0 1-.625-.625M3.855 7.558a.625.625 0 0 0 0 1.25h.328a.625.625 0 1 0 0-1.25zm2.353.625c0-.345.28-.625.625-.625h.328a.625.625 0 1 1 0 1.25h-.328a.625.625 0 0 1-.625-.625m3.648-.625a.625.625 0 1 0 0 1.25h.328a.625.625 0 0 0 0-1.25z"
                            />
                          </svg>
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <AutoCompleteSelectMenu
                    formik={props}
                    label={
                      values?.Action === 'From' ||
                      values?.Action === 'Investment' ||
                      values?.Action === 'Installment'
                        ? 'From'
                        : 'Account'
                    }
                    field="AccountId"
                    menuList={accountList}
                    valueKey="AccountId"
                    labelKey="AccountName"
                    renderOption={(vars, option) => {
                      const { key, ...optionProps } = vars;
                      return (
                        <Box
                          key={key}
                          {...optionProps}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between !important',
                            alignItems: 'center !important',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center !important',
                              // py: 0.5,
                            }}
                          >
                            <CustomAvatar
                              width={45}
                              height={45}
                              icon={option?.Icon || ''}
                              iconSize={15}
                              bgColor={option?.Color || ''}
                            />
                            <Typography variant="normal" sx={{ mx: 2 }}>
                              {option?.AccountName || ''}
                            </Typography>
                          </Box>
                          <Typography variant="light" sx={{}}>
                            {formatToINR(option?.CurrentAmount)}{' '}
                          </Typography>
                        </Box>
                      );
                    }}
                    startUnitType={
                      values?.AccountId ? (
                        <CustomAvatar
                          width={45}
                          height={45}
                          iconSize={15}
                          icon={
                            accountList?.find((item) => item?.AccountId === props.values.AccountId)
                              ?.Icon || ''
                          }
                          bgColor={
                            accountList?.find((item) => item?.AccountId === props.values.AccountId)
                              ?.Color || ''
                          }
                        />
                      ) : (
                        ''
                      )
                    }
                    unitType={formatToINR(
                      accountList?.find((item) => item?.AccountId === props.values.AccountId)
                        ?.CurrentAmount || '0'
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <AutoCompleteSelectMultiple
                    required={false}
                    formik={props}
                    label="Labels"
                    field="Tags"
                    menuList={labelsList}
                    valueKey="LabelId"
                    labelKey="LabelName"
                  />
                </Grid>

                {(values?.Action === 'In' ||
                  values?.Action === 'Out' ||
                  values?.Action === 'Installment' ||
                  values?.Action === 'Payer' ||
                  values?.Action === 'Buyer') && (
                  <>
                    <Grid item xs={12} md={6}>
                      <AutoCompleteSelectMenu
                        formik={props}
                        label="Category"
                        field="CategoryId"
                        menuList={categoriesList}
                        valueKey="CategoryId"
                        labelKey="CategoryName"
                        renderOption={(vars, option) => {
                          const { key, ...optionProps } = vars;
                          return (
                            <Box
                              key={key}
                              {...optionProps}
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between !important',
                                alignItems: 'center !important',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center !important',
                                  // py: 0.5,
                                }}
                              >
                                <CustomAvatar
                                  width={45}
                                  height={45}
                                  icon={option?.Icon || ''}
                                  iconSize={15}
                                  bgColor={option?.Color || ''}
                                />
                                <Typography variant="normal" sx={{ mx: 2 }}>
                                  {option?.CategoryName || ''}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        }}
                        startUnitType={
                          values?.CategoryId ? (
                            <CustomAvatar
                              width={45}
                              height={45}
                              iconSize={15}
                              icon={
                                categoriesList?.find(
                                  (item) => item.CategoryId === values.CategoryId
                                )?.Icon || ''
                              }
                              bgColor={
                                categoriesList?.find(
                                  (item) => item.CategoryId === values.CategoryId
                                )?.Color || ''
                              }
                            />
                          ) : (
                            ''
                          )
                        }
                        callBackAction={(event) => {
                          setFieldValue('SubCategoryId', null);
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <AutoCompleteSelectMenu
                        formik={props}
                        label="Sub Category"
                        field="SubCategoryId"
                        menuList={
                          categoriesList?.find((item) => item.CategoryId === values.CategoryId)
                            ?.SubCategories || []
                        }
                        valueKey="SubCategoryId"
                        labelKey="SubCategoriesName"
                        renderOption={(vars, option) => {
                          const { key, ...optionProps } = vars;
                          return (
                            <Box
                              key={key}
                              {...optionProps}
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between !important',
                                alignItems: 'center !important',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center !important',
                                  // py: 0.5,
                                }}
                              >
                                <CustomAvatar
                                  width={45}
                                  height={45}
                                  icon={option?.Icon || ''}
                                  iconSize={15}
                                  bgColor={
                                    categoriesList?.find(
                                      (item) => item.CategoryId === values.CategoryId
                                    )?.Color || ''
                                  }
                                />
                                <Typography variant="normal" sx={{ mx: 2 }}>
                                  {option?.SubCategoriesName || ''}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        }}
                        startUnitType={
                          values?.SubCategoryId
                            ? (() => {
                                const selectedSubCategory = categoriesList
                                  ?.find((item) => item.CategoryId === values.CategoryId)
                                  ?.SubCategories?.find(
                                    (sub) => sub.SubCategoryId === values.SubCategoryId
                                  );

                                return (
                                  <CustomAvatar
                                    width={45}
                                    height={45}
                                    iconSize={15}
                                    bgColor={
                                      categoriesList?.find(
                                        (item) => item.CategoryId === values.CategoryId
                                      )?.Color || ''
                                    }
                                    icon={selectedSubCategory?.Icon || ''}
                                  />
                                );
                              })()
                            : ''
                        }
                      />
                    </Grid>
                  </>
                )}
                {(values?.Action === 'From' ||
                  values?.Action === 'Investment' ||
                  values?.Action === 'Installment') && (
                  <Grid item xs={12} md={6}>
                    <AutoCompleteSelectMenu
                      formik={props}
                      label="To"
                      field="TransferToAccountId"
                      menuList={accountList?.filter(
                        (item) => item?.AccountId !== values?.AccountId
                      )}
                      valueKey="AccountId"
                      labelKey="AccountName"
                      renderOption={(vars, option) => {
                        const { key, ...optionProps } = vars;
                        return (
                          <Box
                            key={key}
                            {...optionProps}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between !important',
                              alignItems: 'center !important',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center !important',
                                // py: 0.5,
                              }}
                            >
                              <CustomAvatar
                                width={45}
                                height={45}
                                icon={option?.Icon || ''}
                                iconSize={15}
                                bgColor={option?.Color || ''}
                              />
                              <Typography variant="normal" sx={{ mx: 2 }}>
                                {option?.AccountName || ''}
                              </Typography>
                            </Box>
                            <Typography variant="light" sx={{}}>
                              {formatToINR(option?.CurrentAmount)}{' '}
                            </Typography>
                          </Box>
                        );
                      }}
                      startUnitType={
                        values?.TransferToAccountId ? (
                          <CustomAvatar
                            width={45}
                            height={45}
                            iconSize={15}
                            icon={
                              accountList?.find(
                                (item) => item?.AccountId === props.values.TransferToAccountId
                              )?.Icon || ''
                            }
                            bgColor={
                              accountList?.find(
                                (item) => item?.AccountId === props.values.TransferToAccountId
                              )?.Color || ''
                            }
                          />
                        ) : (
                          ''
                        )
                      }
                      unitType={formatToINR(
                        accountList?.find(
                          (item) => item?.AccountId === props.values.TransferToAccountId
                        )?.CurrentAmount || '0'
                      )}
                    />
                  </Grid>
                )}

                {(values?.Action === 'Credit' ||
                  values?.Action === 'Debit' ||
                  values?.Action === 'Refund' ||
                  values?.Action === 'Return' ||
                  values?.Action === 'Payer' ||
                  values?.Action === 'Buyer') && (
                  <Grid item xs={12} md={6}>
                    <AutoCompleteSelectMenu
                      formik={props}
                      label="Party"
                      field="PartyId"
                      menuList={partyList}
                      valueKey="PartyId"
                      labelKey="FullName"
                      renderOption={(vars, option) => {
                        const { key, ...optionProps } = vars;
                        return (
                          <Box
                            key={key}
                            {...optionProps}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between !important',
                              alignItems: 'center !important',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center !important',
                                // py: 0.5,
                              }}
                            >
                              <CustomAvatar
                                photoURL={option?.ImgPath || ''}
                                displayName={option?.PartyAvatar || ''}
                                width={45}
                                height={45}
                                icon={option?.Icon || ''}
                                bgColor={option?.Color || ''}
                              />
                              <Typography variant="normal" sx={{ mx: 2 }}>
                                {option?.FullName || ''}
                              </Typography>
                            </Box>
                            <Typography variant="light" sx={{}}>
                              {formatToINR(option?.CurrentAmount)}{' '}
                            </Typography>
                          </Box>
                        );
                      }}
                      startUnitType={
                        values?.PartyId ? (
                          <CustomAvatar
                            width={45}
                            height={45}
                            iconSize={15}
                            photoURL={
                              partyList?.find((item) => item?.PartyId === props.values.PartyId)
                                ?.ImgPath || ''
                            }
                            displayName={
                              partyList?.find((item) => item?.PartyId === props.values.PartyId)
                                ?.PartyAvatar || ''
                            }
                          />
                        ) : (
                          ''
                        )
                      }
                      unitType={formatToINR(
                        partyList?.find((item) => item?.PartyId === props.values.PartyId)
                          ?.CurrentAmount || '0'
                      )}
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={12}>
                  <TextFieldForm
                    required={false}
                    formik={props}
                    label="Description"
                    field="Description"
                    multiline
                    rows={4}
                    maxRows={3}
                  />
                </Grid>

                <Grid xs={12}>
                  <Box sx={{ float: 'right', display: 'flex' }}>
                    {editObject?.TransactionId && (
                      <Button
                        color="error"
                        variant="contained"
                        sx={{ marginX: 1 }}
                        onClick={() => {
                          sweetAlertQuestion()
                            .then((result) => {
                              if (result === 'Yes') {
                                deleteAction(editObject);
                              }
                            })
                            .catch((error) => {
                              console.error(error);
                            });
                        }}
                      >
                        Delete
                      </Button>
                    )}

                    {dirty && (
                      <Button
                        variant="outlined"
                        sx={{ marginRight: 1 }}
                        onClick={() => {
                          resetForm();
                        }}
                        color="CancelButton"
                      >
                        Cancel
                      </Button>
                    )}

                    {!formSubmitLoader ? (
                      <Button
                        variant="contained"
                        type="submit"
                        disabled={!dirty}
                        onClick={handleSubmit}
                        color="success"
                      >
                        Save
                      </Button>
                    ) : (
                      <ButtonLoader />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Form>

            {/* Calculator Modal */}
            <Modal
              open={calculatorOpen}
              onClose={() => setCalculatorOpen(false)}
              aria-labelledby="calculator-modal"
              aria-describedby="calculator-modal-description"
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <CalculatorModal
                  onClose={() => setCalculatorOpen(false)}
                  onCalculate={(amount) => {
                    setFieldValue('Amount', amount);
                    setCalculatorOpen(false);
                  }}
                />
              </Box>
            </Modal>
          </>
        );
      }}
    </Formik>
  );
}
