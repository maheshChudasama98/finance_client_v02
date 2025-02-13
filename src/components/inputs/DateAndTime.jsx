import React from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, TimePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { DateFormat, TimeFormat, DateAndTimeFormat, } from 'src/constance';

export const DateAndTime = ({
    field,
    label,
    formik,
    defaultValue,
    callBackAction,
    size,
    fullWidth = true,
    textStyle,
    pickerType = 'date',
    ...props
}) => {
    const getPickerComponent = () => {
        switch (pickerType) {
            case 'time':
                return TimePicker;
            case 'datetime':
                return DateTimePicker;
            case 'date':
            default:
                return DatePicker;
        }
    };

    const PickerComponent = getPickerComponent();
    let Component = TimeFormat
    if (pickerType === 'time') {
        Component = TimeFormat
    } else {

        Component = pickerType === 'datetime' ? DateAndTimeFormat : DateFormat
    }
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <PickerComponent
                label={label}
                defaultValue={defaultValue}
                value={formik?.values[field]}
                onChange={(newValue) => formik.setFieldValue(field, newValue)}
                onAccept={callBackAction}
                disableFuture
                format={Component}
            slotProps={{
                textField: {
                    size: size || '',
                    required: true,
                    fullWidth,
                    error: Boolean(formik?.errors[field]) && formik?.touched[field],
                    helperText: Boolean(formik?.errors[field]) && formik?.touched[field] ? formik?.errors[field] : '',
                    sx: textStyle,
                    InputLabelProps: {
                        sx: {
                            '& .MuiInputLabel-asterisk': {
                                color: 'red',
                                fontSize: 18,
                            },
                        },
                    },
                },
            }}
            {...props}
            />
        </LocalizationProvider>
    );
};
