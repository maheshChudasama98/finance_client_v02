import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';

export function CheckboxForm({ formik, field, label, required = false, ...props }) {
  const error = Boolean(formik.errors[field]) && formik.touched[field];

  return (
    <FormControl required={required} error={error}>
      <FormControlLabel
        control={
          <Checkbox
            name={field}
            checked={formik.values[field]}
            onChange={(e) => {
              formik.setFieldValue(field, e.target.checked);
            }}
            onBlur={formik.handleBlur}
            color="success"
            {...props}
          />
        }
        label={label}
      />
      {error && <FormHelperText>{formik.errors[field]}</FormHelperText>}
    </FormControl>
  );
}

CheckboxForm.propTypes = {
  formik: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
};
