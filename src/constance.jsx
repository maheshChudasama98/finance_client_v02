export const apiURL = __API_URL__;
export const cryptoSecureKey = __CRYPTO_SECURE_KEY__;

export const ImgUrl = `${apiURL}/public/`;

export const DevelopMood = true;
export const LogoDefaultPath = 'Logos/logo2.png';
export const AdminEmail = 'mahesh.chudasama098@gmail.ocm';

// Time Format
export const BackEndSendFormat = 'YYYY-MM-DD';
export const DateFormat = 'DD/MM/YYYY';
export const DateAndTimeFormat = 'DD/MM/YYYY - HH:mm A';
export const TimeFormat = 'HH:mm';
export const MonthFormat = 'MMM';

export const SUCCESS_CODE = 200;
export const ERROR_CODE = 500;
export const SERVER_ERROR_CODE = 501;
export const BAD_REQUEST_CODE = 400;
export const TOKEN_NOT_VALID_CODE = 401;
export const TOKEN_NOT_PROVIDED_CODE = 402;

export const AccountTypes = [
  { key: 1, value: 'Cash' },
  { key: 2, value: 'Saving Account' },
  { key: 3, value: 'Investments' },
  { key: 4, value: 'Fixed Fund' },
  { key: 5, value: 'Credit Cards' },
  { key: 6, value: 'Emergency Fund' },
];

export const LoanTypes = [
  { key: 'personal_loan', value: 'Personal Loan' },
  { key: 'home_loan', value: 'Home Loan' },
  { key: 'car_loan', value: 'Car Loan' },
  { key: 'education_loan', value: 'Education Loan' },
  { key: 'business_loan', value: 'Business Loan' },
  { key: 'gold_loan', value: 'Gold Loan' },
  { key: 'mortgage_loan', value: 'Mortgage Loan' },
  { key: 'payday_loan', value: 'Payday Loan' },
];

export const LoanStatus = [
  { key: 'Pending', value: 'Pending' },
  { key: 'Ongoing', value: 'Ongoing' },
  { key: 'Completed', value: 'Completed' },
  { key: 'Overdue', value: 'Overdue' },
];

export const LoanRepaymentFrequency = [
  { key: 'Monthly', value: 'Monthly' },
  { key: 'Weekly', value: 'Weekly' },
  { key: 'Yearly', value: 'Yearly' },
];

export const TransactionActions = [
  { key: 'In', value: 'Income', textColor: '#3A8F2A' },
  { key: 'Out', value: 'Expend', textColor: '#D92D20' },
  { key: 'From', value: 'Transfer', textColor: '#FFB703' },

  { key: 'Investment', value: 'Investment', textColor: '#8E44AD' },
  { key: 'Installment', value: 'EMI', textColor: '#6D28D9' },

  { key: 'Credit', value: 'Credit', textColor: '#0F766E' },
  { key: 'Debit', value: 'Debit', textColor: '#1D4ED8' },

  { key: 'Refund', value: 'Refund Received', textColor: '#15803D' },
  { key: 'Return', value: 'Return Paid', textColor: '#B91C1C' },

  { key: 'Payer', value: 'Paid for Someone', textColor: '#C2410C' },
  { key: 'Buyer', value: 'Paid by Someone', textColor: '#2563EB' },
];

// Weather Api
export const WEATHER_API_KEY = __WEATHER_API_KEY__;
export const OPEN_WEATHER_API = __OPEN_WEATHER_API__;
export const DAILY_FORECAST_API_URL = `${OPEN_WEATHER_API}/forecast/daily`; // Seven days api
export const WEATHER_API_URL = `${OPEN_WEATHER_API}/weather`; // Single day WEATHER api
export const FORECAST_API_URL = `${OPEN_WEATHER_API}/forecast`; // Forecast api

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PASSWORD_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])(?=\S+$).{8,}$/;
// export const URL_REGEX = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
export const NAME_REGEX = /^[A-Za-z0-9]+([ \-'][A-Za-z0-9]+)*$/;

export const TimeDurationList = [
  { Key: 'DATE', Value: 'Daily' },
  { Key: 'WEEK', Value: 'Weekly' },
  { Key: 'MONTH', Value: 'Monthly' },
  { Key: 'YEAR', Value: 'Yearly' },
];
export const MonthList = [
  { Key: 'JAN', Value: 'January' },
  { Key: 'FEB', Value: 'February' },
  { Key: 'MAR', Value: 'March' },
  { Key: 'APR', Value: 'April' },
  { Key: 'MAY', Value: 'May' },
  { Key: 'JUN', Value: 'June' },
  { Key: 'JUL', Value: 'July' },
  { Key: 'AUG', Value: 'August' },
  { Key: 'SEP', Value: 'September' },
  { Key: 'OCT', Value: 'October' },
  { Key: 'NOV', Value: 'November' },
  { Key: 'DEC', Value: 'December' },
];

export const SettingDurationList = [
  { Key: 'Last 7 Days', Value: 'Last_Seven_Days' },
  { Key: 'Last 30 Days', Value: 'Last_Thirty_Days' },
  { Key: 'This Month', Value: 'This_Month' },
  // { Key: 'All', Value: 'All' },
];

export const ButtonGroupDurationList = [
  { Key: '7D', Value: 'Last_Seven_Days' },
  { Key: '30D', Value: 'Last_Thirty_Days' },
  { Key: 'TW', Value: 'This_Week' },
  { Key: 'LW', Value: 'Last_Week' },
  { Key: 'TM', Value: 'This_Month' },
  { Key: 'LM', Value: 'Last_Month' },
  { Key: 'L6M', Value: 'Six_Month' },
  { Key: 'TY', Value: 'This_Year' },
  { Key: 'LY', Value: 'Last_Year' },
  { Key: 'L5Y', Value: 'Last_Five_Year' },
  { Key: 'All', Value: 'All' },
];

export const DateFormatList = [
  // Slash formats
  { Key: 'DD/MM/YYYY', Value: '01/12/2000' },
  { Key: 'MM/DD/YYYY', Value: '12/01/2000' },
  { Key: 'YYYY/MM/DD', Value: '2000/12/01' },

  // Dash formats
  { Key: 'DD-MM-YYYY', Value: '01-12-2000' },
  { Key: 'MM-DD-YYYY', Value: '12-01-2000' },
  { Key: 'YYYY-MM-DD', Value: '2000-12-01' },

  // Dot formats
  { Key: 'DD.MM.YYYY', Value: '01.12.2000' },
  { Key: 'MM.DD.YYYY', Value: '12.01.2000' },
  { Key: 'YYYY.MM.DD', Value: '2000.12.01' },

  // Space-separated
  { Key: 'DD MM YYYY', Value: '01 12 2000' },
  { Key: 'MM DD YYYY', Value: '12 01 2000' },
  { Key: 'YYYY MM DD', Value: '2000 12 01' },

  // Month as short name (MMM)
  { Key: 'DD-MMM-YYYY', Value: '01-Jun-2000' },
  { Key: 'MMM-DD-YYYY', Value: 'Jun-01-2000' },
  { Key: 'YYYY-MMM-DD', Value: '2000-Jun-01' },

  { Key: 'DD/MMM/YYYY', Value: '01/Jun/2000' },
  { Key: 'MMM/DD/YYYY', Value: 'Jun/01/2000' },
  { Key: 'YYYY/MMM/DD', Value: '2000/Jun/01' },

  // Month as full name (MMMM)
  { Key: 'DD-MMM-YYYY', Value: '01-Jun-2000' },
  { Key: 'MMM-DD-YYYY', Value: 'Jun-01-2000' },
  { Key: 'YYYY-MMM-DD', Value: '2000-Jun-01' },

  { Key: 'DD/MMM/YYYY', Value: '01/Jun/2000' },
  { Key: 'MMM/DD/YYYY', Value: 'Jun/01/2000' },
  { Key: 'YYYY/MMM/DD', Value: '2000/Jun/01' },

  // With year first + month name
  { Key: 'YYYY MMM DD', Value: '2000 Jun 01' },
  { Key: 'YYYY MMMM DD', Value: '2000 June 01' },
  { Key: 'DD MMM YYYY ', Value: '01 Jun 2000 ' },
];

export const DurationList = [
  { Key: 'Last 7 Days', Value: 'Last_Seven_Days' },
  { Key: 'Last 30 Days', Value: 'Last_Thirty_Days' },
  { Key: 'This Week', Value: 'This_Week' },
  { Key: 'Last Week', Value: 'Last_Week' },
  { Key: 'This Month', Value: 'This_Month' },
  { Key: 'Last Month', Value: 'Last_Month' },
  { Key: 'Last Six Month', Value: 'Six_Month' },
  { Key: 'This Year', Value: 'This_Year' },
  { Key: 'Last Year', Value: 'Last_Year' },
  { Key: 'Last Five Year', Value: 'Last_Five_Year' },
];

export const CurrencyList = [
  { Key: 'US Dollar (USD)', Value: 'USD' },
  { Key: 'Euro (EUR)', Value: 'EUR' },
  { Key: 'Indian Rupee (INR)', Value: 'INR' },
  { Key: 'British Pound (GBP)', Value: 'GBP' },
  { Key: 'Japanese Yen (JPY)', Value: 'JPY' },
  { Key: 'Swiss Franc (CHF)', Value: 'CHF' },
  { Key: 'Canadian Dollar (CAD)', Value: 'CAD' },
  { Key: 'Australian Dollar (AUD)', Value: 'AUD' },
  { Key: 'Chinese Yuan (CNY)', Value: 'CNY' },
  { Key: 'Singapore Dollar (SGD)', Value: 'SGD' },
  { Key: 'UAE Dirham (AED)', Value: 'AED' },
  { Key: 'Russian Ruble (RUB)', Value: 'RUB' },
];
