import * as React from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import dayjs from 'dayjs';

export const DateRangePicker = ({
  label,
  onChange,
  value,
  maxDate,
  minDate = dayjs('2000-01-01'),
  fullWidth = false,
  ...props
}) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      slotProps={{
        textField: {
          fullWidth,
          size: 'small',
        },
      }}
      {...props}
    />
  </LocalizationProvider>
);
