
// export const apiURL = "http://localhost:8100"
export const apiURL = "http://www.smartsdn.in:8181"
export const ImgUrl = `${apiURL}/public/`;

export const DevelopMood = true;
export const AdminEmail = "mahesh.chudasama098@gmail.ocm";
export const ProjectName = "FV2";

// Time Format 
export const DateFormat = "DD/MM/YYYY";
export const DateAndTimeFormat = "DD/MM/YYYY - HH:mm A";
export const TimeFormat = "HH:mm";
export const MonthFormat = "MMM";

export const SUCCESS_CODE = 200;
export const ERROR_CODE = 500;
export const SERVER_ERROR_CODE = 501;
export const BAD_REQUEST_CODE = 400;
export const TOKEN_NOT_VALID_CODE = 401;
export const TOKEN_NOT_PROVIDED_CODE = 402;


export const AccountTypes = [
    { key: 1, value: "Cash" },
    { key: 2, value: "Saving Account" },
    { key: 3, value: "Investments" },
    { key: 4, value: "Fixed Fund" },
    { key: 5, value: "Credit Cards" },
    { key: 6, value: "Emergency Fund" },
];

export const TransactionActions = [
    { key: "In", value: "Income" },
    { key: "Out", value: "Expend" },
    { key: "Transfer", value: "Transfer" },
    { key: "Investment", value: "Investment" },
    { key: "Credit", value: "Credit" },
    { key: "Debit", value: "Debit" },
];

// Weather Api 
export const WEATHER_API_KEY = '5d519472e191015e1b7549761c7015ec';
export const OPEN_WEATHER_API = 'https://api.openweathermap.org/data/2.5';
export const DAILY_FORECAST_API_URL = `${OPEN_WEATHER_API}/forecast/daily`; // Seven days api
export const WEATHER_API_URL = `${OPEN_WEATHER_API}/weather`; // Single day WEATHER api
export const FORECAST_API_URL = `${OPEN_WEATHER_API}/forecast`; // Forecast api

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])(?=\S+$).{8,}$/;
// export const URL_REGEX = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
export const NAME_REGEX = /^[A-Za-z0-9]+([ \-'][A-Za-z0-9]+)*$/


export const TimeDurationList = [
    { Key: "DATE", Value: "Daily" },
    { Key: "WEEK", Value: "Weekly" },
    { Key: "MONTH", Value: "Monthly" },
    { Key: "YEAR", Value: "Yearly" },
];

export const DurationList = [
    { Key: "Last Seven Days", Value: "Last_Seven_Days" },
    { Key: "Last Thirty Days", Value: "Last_Thirty_Days" },
    { Key: "This Week", Value: "This_Week" },
    { Key: "Last Week", Value: "Last_Week" },
    { Key: "This Month", Value: "This_Month" },
    { Key: "Last Month", Value: "Last_Month" },
    { Key: "Last Six Month", Value: "Six_Month" },
    { Key: "This Year", Value: "This_Year" },
    { Key: "Last Year", Value: "Last_Year" },
    { Key: "Last Five Year", Value: "Last_Five_Year" },
];