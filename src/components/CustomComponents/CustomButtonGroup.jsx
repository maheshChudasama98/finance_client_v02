import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { ButtonGroupDurationList } from 'src/constance';

export const CustomButtonGroup = ({ onSelect, defaultValue }) => {
  const [selected, setSelected] = useState(defaultValue || 'Last_Thirty_Days');
  const [anchorEl, setAnchorEl] = useState(null);

  const visibleButtons = ButtonGroupDurationList.slice(0, 3);
  const dropdownItems = ButtonGroupDurationList.slice(3);

  const handleSelect = (option) => {
    setSelected(option);
    onSelect?.(option);
    setAnchorEl(null);
  };

  return (
    <>
      <ButtonGroup variant="outlined" size="small">
        {visibleButtons.map(({ Key, Value }) => (
          <Button
            key={Value}
            variant={selected === Value ? 'contained' : 'outlined'}
            onClick={() => handleSelect(Value)}
            sx={{
              px: { xs: 1, md: 1.2 },
              fontSize: { xs: 10, md: 11 },
              fontWeight: selected === Value ? 800 : 500,
            }}
          >
            {Key}
          </Button>
        ))}

        {dropdownItems.length > 0 && (
          <Button
            onClick={(e) => setAnchorEl(e.currentTarget)}
            endIcon={<ArrowDropDownIcon />}
            sx={{
              px: { xs: 1, md: 1.2 },
              fontSize: { xs: 10, md: 11 },
              fontWeight: dropdownItems.some((item) => item.Value === selected) ? 800 : 500,
            }}
            variant={
              dropdownItems.some((item) => item.Value === selected) ? 'contained' : 'outlined'
            }
          >
            More
          </Button>
        )}
      </ButtonGroup>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {dropdownItems.map(({ Key, Value }) => (
          <MenuItem
            key={Value}
            selected={selected === Value}
            onClick={() => handleSelect(Value)}
            sx={{ width: 60, alignItems: 'center', justifyContent: 'center' }}
          >
            {Key}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

CustomButtonGroup.propTypes = {
  defaultValue: PropTypes.string,
  onSelect: PropTypes.func,
};
