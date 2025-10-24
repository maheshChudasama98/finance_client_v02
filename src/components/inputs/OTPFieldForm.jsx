import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';

import { ErrorMessage } from 'formik';

export function OTPFieldForm({ formik, field, length = 6 }) {
  const value = formik.values[field] || '';

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (/^[0-9]?$/.test(val)) {
      const newValue = value.padEnd(length, ' ').split('');
      newValue[index] = val;
      const joined = newValue.join('').trim();
      formik.setFieldValue(field, joined);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index]) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  return (
    <>
      <Box display="flex" gap={1}>
        {[...Array(length)].map((_, index) => (
          <TextField
            type="number"
            key={index}
            id={`otp-${index}`}
            name={`${field}-${index}`}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: 'center',
                fontSize: '1.25rem',
                width: '3rem',
              },
            }}
            value={value[index] || ''}
            error={Boolean(formik?.errors[field] && formik?.touched[field])} // ✅ red border
            onChange={(e) => {
              handleChange(e, index);
              const next = document.getElementById(`otp-${index + 1}`);
              if (e.target.value && next) next.focus();
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </Box>

      <ErrorMessage name={field}>
        {(msg) => (
          <FormHelperText style={{ textAlign: '' }} error>
            {msg}
          </FormHelperText>
        )}
      </ErrorMessage>
    </>
  );
}

OTPFieldForm.propTypes = {
  formik: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  length: PropTypes.number,
};
