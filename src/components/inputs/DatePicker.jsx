import React from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { DateFormat } from 'src/constance';
// import from '@mui/x-date-pickers/LocalizationProvider';

export const DatePickerCustom = ({
  field,
  label,
  formik,
  defaultValue,
  callBackAction,
  size,
  fullWidth = true,
  textStyle,
  required = true,
  ...props
}) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      format={DateFormat}
      disableFuture
      label={label}
      views={['year', 'month', 'day']}
      defaultValue={defaultValue}
      slotProps={{
        textField: {
          size: size || '',
          required,
          fullWidth,
          error: Boolean(formik?.errors[field]) && formik?.touched[field],
          helperText:
            Boolean(formik?.errors[field]) && formik?.touched[field] ? formik?.errors[field] : '',
          sx: textStyle,
          InputLabelProps: {
            sx: {
              '& .MuiInputLabel-asterisk': {
                color: 'red', // Force red color for asterisk
                fontSize: 18,
              },
            },
          },
        },
      }}
      value={formik?.values[field]}
      onAccept={callBackAction}
      {...props}
    />
  </LocalizationProvider>
);
