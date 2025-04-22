export const apiURL = __API_URL__;
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

export const TransactionActions = [
  { key: 'In', value: 'Income' },
  { key: 'Out', value: 'Expend' },
  { key: 'From', value: 'Transfer' },
  { key: 'Investment', value: 'Investment' },
  { key: 'Credit', value: 'Credit' },
  { key: 'Debit', value: 'Debit' },
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

export const SettingDurationList = [
  { Key: 'Last 7 Days', Value: 'Last_Seven_Days' },
  { Key: 'Last 30 Days', Value: 'Last_Thirty_Days' },
  { Key: 'This Week', Value: 'This_Week' },
  { Key: 'This Month', Value: 'This_Month' },
  { Key: 'Last 6 Months', Value: 'Last_Six_Months' },
  { Key: 'This Year', Value: 'This_Year' },
  { Key: 'Last 5 Years', Value: 'Last_Five_Years' },
];

export const DateFormatList = [
  { Key: 'DD/MM/YYYY', Value: 'DD/MM/YYYY' },
  { Key: 'MM/DD/YYYY', Value: 'MM/DD/YYYY' },
  { Key: 'YYYY/MM/DD', Value: 'YYYY/MM/DD' },
  { Key: 'DD-MM-YYYY', Value: 'DD-MM-YYYY' },
  { Key: 'MM-DD-YYYY', Value: 'MM-DD-YYYY' },
  { Key: 'YYYY-MM-DD', Value: 'YYYY-MM-DD' },
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
  // { Key: 'British Pound (GBP)', Value: 'GBP' },
  { Key: 'Indian Rupee (INR)', Value: 'INR' },
  // { Key: 'Japanese Yen (JPY)', Value: 'JPY' },
  // { Key: 'Swiss Franc (CHF)', Value: 'CHF' },
  // { Key: 'Canadian Dollar (CAD)', Value: 'CAD' },
  // { Key: 'Australian Dollar (AUD)', Value: 'AUD' },
  // { Key: 'Chinese Yuan (CNY)', Value: 'CNY' },
  // { Key: 'Singapore Dollar (SGD)', Value: 'SGD' },
  // { Key: 'UAE Dirham (AED)', Value: 'AED' },
  // { Key: 'Russian Ruble (RUB)', Value: 'RUB' },
];
