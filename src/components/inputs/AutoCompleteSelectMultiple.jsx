import React from 'react'
import PropTypes from 'prop-types'

import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import InputAdornment from '@mui/material/InputAdornment'

import { shadows } from 'src/theme/shadows'

import { Empty } from 'antd';


export const AutoCompleteSelectMultiple = ({ formik, label, field, menuList, valueKey, labelKey, required = true, unitType, callBackAction, ...props }) => {

    const handleChange = (e, value) => {
        const selectedValues = value.map((item) => item[valueKey]); // Store selected values as an array
        formik.setFieldValue(field, selectedValues);

        if (typeof callBackAction === 'function') {
            callBackAction(selectedValues);
        }
    };

    return (
        <Autocomplete
            multiple
            fullWidth
            id={field}
            name={field}
            options={menuList}
            getOptionLabel={(option) => option?.[labelKey] || " "}
            value={menuList.filter((option) => formik.values[field]?.includes(option[valueKey])) || []}
            onChange={handleChange}
            renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                    <Chip
                        key={option[valueKey]}
                        label={option[labelKey]}
                        {...getTagProps({ index })}
                    />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    required={required}
                    onBlur={formik.handleBlur}
                    error={formik.touched[field] && Boolean(formik.errors[field])}
                    helperText={formik.touched[field] && formik.errors[field] ? formik.errors[field] : ""}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {params.InputProps.endAdornment}
                                {unitType && (
                                    <InputAdornment position="end">
                                        {unitType}
                                    </InputAdornment>
                                )}
                            </>
                        ),
                    }}
                />
            )}
            sx={{
                '& .MuiInputLabel-asterisk': {
                    color: 'red', fontSize: 18,
                },
            }}
            componentsProps={{
                popper: {
                    sx: {
                        '& .MuiAutocomplete-paper': {
                            boxShadow: shadows()[10],
                        },
                    },
                },
            }}
            noOptionsText={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Not Data Found!" />}
            disableClearable={false} // Allow clearing selection
            {...props}
        />
    )
}

AutoCompleteSelectMultiple.propTypes = {
    formik: PropTypes.object,
    label: PropTypes.string,
    field: PropTypes.string,
    menuList: PropTypes.array,
    valueKey: PropTypes.string,
    labelKey: PropTypes.string,
    required: PropTypes.bool,
    unitType: PropTypes.string,
    callBackAction: PropTypes.func,
}
