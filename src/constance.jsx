export const apiURL = "http://localhost:9005"
// export const apiURL = "http://147.79.68.222:9002"
export const ImgUrl = `http://${apiURL}/url`;

export const DevelopMood = true;
export const AdminEmail = "mahesh.chudasama098@gmail.ocm";
export const ProjectName = "New";

// Time Format 
export const DateFormat = "DD/MM/YYYY";
export const DateAndTimeFormat = "DD/MM/YYYY - HH:mm A";
export const TimeFormat = "HH:mm";
export const MonthFormat = "MMM";

export const StaffID = 1;
export const ContractorID = 2;
export const JuniorEngineerID = 3;
export const SuperAdminID = 4;
export const JE = 5;
export const VisitorID = 6;

export const SUCCESS_CODE = 200;
export const ERROR_CODE = 500;
export const SERVER_ERROR_CODE = 501;
export const BAD_REQUEST_CODE = 400;
export const TOKEN_NOT_VALID_CODE = 401;
export const TOKEN_NOT_PROVIDED_CODE = 402;


export const AccountTypes = [
    { key: 1, value: "Cash" },
    { key: 2, value: "Saving" },
    { key: 3, value: "Fund" }
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
