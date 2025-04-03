import PropTypes from 'prop-types';
import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

export const CustomSearchInput = ({
  placeholder = 'Search...',
  callBack,
  loading = false,
  debounceTimeout = 300,
  ...props
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  const handleSearch = (event) => {
    const value = event?.target?.value;
    setSearchValue(value);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      if (callBack) {
        callBack(value); // Trigger the callback after typing stops
      }
    }, debounceTimeout);

    setDebounceTimer(timer);
  };

  const handleClear = () => {
    setSearchValue('');
    if (callBack) {
      callBack(''); // Trigger the callback when input is cleared
    }
  };

  const button = () => {
    if (loading) {
      return <CircularProgress size={20} color='success' />;
    }
    if (searchValue) {
      return (
        <IconButton onClick={handleClear} size="small">
          <ClearIcon color="error" fontSize="10" />
        </IconButton>
      );
    }
  };

  return (
    <TextField
      fullWidth
      id="search"
      name="search"
      hiddenLabel
      placeholder={placeholder}
      value={searchValue}
      onChange={handleSearch}
      InputProps={{
        startAdornment: (
          <InputAdornment>
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: <InputAdornment position="end">{button()}</InputAdornment>,
      }}
      size="small"
      sx={{ width: 300 }}
      {...props}
    />
  );
};

CustomSearchInput.propTypes = {
  placeholder: PropTypes.string,
  callBack: PropTypes.func,
  loading: PropTypes.bool,
  debounceTimeout: PropTypes.number,
};
