import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';

export function TextFieldForm({ formik, field, label, ...props }) {
  return (
    <TextField
      required
      fullWidth
      id={label}
      label={label}
      InputLabelProps={{
        shrink:
          formik.values[field] !== undefined &&
          formik.values[field] !== null &&
          formik.values[field] !== '',
      }}
      name={field}
      value={formik.values[field]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={Boolean(formik.errors[field]) && formik.touched[field]}
      helperText={
        Boolean(formik.errors[field]) && formik.touched[field] ? formik.errors[field] : ''
      }
      sx={{
        '& .MuiInputLabel-asterisk': {
          color: 'red',
          fontSize: 18,
        },
      }}
      {...props}
    />
  );
}

TextFieldForm.propTypes = {
  formik: PropTypes.object,
  field: PropTypes.string,
  label: PropTypes.string,
};
