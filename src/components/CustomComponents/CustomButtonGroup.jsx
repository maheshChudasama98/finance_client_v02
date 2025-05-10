import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import { ButtonGroupDurationList } from 'src/constance';

export const CustomButtonGroup = ({ onSelect, defaultValue }) => {
  const [selected, setSelected] = useState(defaultValue || 'Last_Thirty_Days');

  const handleSelect = (option) => {
    setSelected(option);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <ButtonGroup variant="outlined" color="success" size="small">
      {ButtonGroupDurationList.map(({ Key, Value }) => (
        <Button
          key={Value}
          variant={selected === Value ? 'contained' : 'outlined'}
          onClick={() => handleSelect(Value)}
          color="success"
        >
          {Key}
        </Button>
      ))}
    </ButtonGroup>
  );
};

CustomButtonGroup.propTypes = {
  defaultValue: PropTypes.string,
  onSelect: PropTypes.func,
};
