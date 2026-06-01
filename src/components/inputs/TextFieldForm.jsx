import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

import { getIn } from 'formik'; // ✅ import this

export function TextFieldForm({
  formik,
  field,
  label,
  type = 'text',
  isAmount = false, // show ₹ icon
  isRight = false,
  ...props
}) {
  const value = getIn(formik?.values, field);
  const error = getIn(formik?.errors, field);
  const touched = getIn(formik?.touched, field);

  return (
    <TextField
      required
      fullWidth
      type={type}
      id={label}
      label={label}
      InputLabelProps={{
        shrink:
          formik.values[field] !== undefined &&
          formik.values[field] !== null &&
          formik.values[field] !== '',
      }}
      name={field}
      value={value || formik.values[field]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={Boolean(touched && error) || (Boolean(formik.errors[field]) && formik.touched[field])}
      helperText={error && touched ? error : formik.touched[field] && formik.errors[field]}
      // helperText={
      //   Boolean(formik.errors[field]) && formik.touched[field] ? formik.errors[field] : ''
      // }
      onFocus={(e) => {
        if (type === 'date' || type === 'datetime-local') {
          e.target.showPicker?.();
        }
      }}
      sx={{
        '& .MuiInputLabel-asterisk': {
          color: 'red',
          fontSize: 18,
        },
        '& input': {
          textAlign: isAmount || isRight ? 'right' : 'left',
        },
        '& .MuiInputBase-multiline': {
          p: 0,
          m: 0,
          // maxHeight: 0,
          // minHeight: 0,
        },
      }}
      InputProps={{
        startAdornment: isAmount && (
          <InputAdornment position="start">
            <CurrencyRupeeIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}

TextFieldForm.propTypes = {
  formik: PropTypes.object,
  field: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  isAmount: PropTypes.bool,
  isRight: PropTypes.bool,
};
