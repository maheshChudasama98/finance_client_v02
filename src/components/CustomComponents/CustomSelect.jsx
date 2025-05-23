import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

export const CustomSelect = ({
  defaultValue,
  label,
  field,
  menuList,
  valueKey,
  labelKey,
  required = true,
  callBackAction,
  customMenuList,
  ...props
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || '');

  useEffect(() => {
    setSelectedValue(defaultValue || '');
  }, [defaultValue]);

  const handleChange = (event) => {
    const selectedId = event.target.value;
    setSelectedValue(selectedId);

    if (typeof callBackAction === 'function') {
      callBackAction(selectedId);
    }
  };

  return (
    <FormControl fullWidth>
      <Select value={selectedValue} onChange={handleChange} displayEmpty {...props}>
        {customMenuList && customMenuList.length > 0
          ? customMenuList
          : menuList?.map((item) => (
              <MenuItem key={item[valueKey]} value={item[valueKey]}>
                {item[labelKey]}
              </MenuItem>
            ))}
      </Select>
    </FormControl>
  );
};

CustomSelect.propTypes = {
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  field: PropTypes.string,
  customMenuList: PropTypes.array,
  menuList: PropTypes.array.isRequired,
  valueKey: PropTypes.string.isRequired,
  labelKey: PropTypes.string.isRequired,
  required: PropTypes.bool,
  callBackAction: PropTypes.func,
};
