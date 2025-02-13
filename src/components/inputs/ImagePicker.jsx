import PropTypes from 'prop-types';
import React, { useRef } from 'react'

import FormHelperText from '@mui/material/FormHelperText';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

import { ErrorMessage } from 'formik';

import { CustomAvatar } from '../CustomComponents';

export function ImagePicker({ formik, field, label, heightWidth = 180, imageReturn, ...props }) {

    const fileInputRef = useRef(null);
    const IconHeightWidth = heightWidth / 1.5;

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div style={{ textAlign: "center" }}>
            <input
                type="file"
                ref={fileInputRef}
                id={field}
                name={field}
                accept="image/png, image/jpeg"
                style={{ display: 'none' }}
                onChange={(event) => {
                    if (imageReturn) imageReturn(event.target.files[0]);
                    formik.handleChange(event);
                    formik.setFieldValue(field, URL.createObjectURL(event.target.files[0]))
                }}
            />

            <CustomAvatar
                width={{ xs: IconHeightWidth, md: IconHeightWidth, lg: IconHeightWidth }}
                height={{ xs: IconHeightWidth, md: IconHeightWidth, lg: IconHeightWidth }}
                onClick={handleButtonClick}
                src={formik?.values[field]}
                icon={<CameraAltIcon />}
                displayName="select image"
            >
                <CameraAltIcon />
            </CustomAvatar>

            <ErrorMessage name={field}>
                {(msg) => <FormHelperText style={{ textAlign: "center" }} error>{msg}</FormHelperText>}
            </ErrorMessage>

        </div>
    )
}

ImagePicker.propTypes = {
    formik: PropTypes.object,
    field: PropTypes.string,
    label: PropTypes.string,
};



