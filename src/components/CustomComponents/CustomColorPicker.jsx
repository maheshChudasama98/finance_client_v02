import reactCSS from 'reactcss';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormHelperText from '@mui/material/FormHelperText';

import { ErrorMessage } from 'formik';

import { TwitterPicker } from 'react-color';

import { CustomAvatar } from './CustomAvatar';

export const CustomColorPicker = ({
    field,
    formik,
    handleColor,
    required,
    ...props
}) => {

    const [color, setColor] = useState(formik?.values[field] || "#ccc");
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    const styles = reactCSS({
        default: {
            color: {
                width: '45px',
                height: '20px',
                borderRadius: '2px',
                background: color,
            },
            swatch: {
                marginRight: '10px',
                padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
            },
            popover: {
                position: 'absolute',
                zIndex: '1300',
            },
            cover: {
                position: 'relative',
                top: '7px',
                right: '20px',
                bottom: '0px',
                left: '0px',
            },
        },
    });

    const colors = [
        '#B80000', '#EB144C', '#DB3E00', '#FF6900', '#FCB900', '#008B02',
        '#006B76', '#1273DE', '#0693E3', '#004DCF', '#5300EB', '#9900EF',
        '#7BDCB5', '#00D084', '#8ED1FC', '#ABB8C3', '#F78DA7', '#EB9694',
        '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3',
        '#D4C4FB', '#D4C4FC', '#D4C4FD', '#FEF3BD',];

    const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleClose = () => {
        setDisplayColorPicker(false);
    };

    const handleChangeColor = (newColor) => {

        handleClose();

        formik?.setFieldValue(field, newColor?.hex);

        handleColor(newColor.hex);
        setColor(newColor.hex);
    };
    return (
        <>
            {/* <div style={{ display: 'flex', alignItems: 'center' }}>

                <Box style={styles.swatch} onClick={handleClick}>
                    <Box style={styles.color} />
                </Box>

                <Typography variant="bold" color={formik?.errors[field] ? "error" : ""}>
                    Select color
                </Typography>

            </div> */}

            {/* <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', margin: 0, padding: 0 }}>

                <Box style={styles.swatch} onClick={handleClick}>
                    <Box style={styles.color} />
                </Box>

                <Typography variant="bold" color={formik?.errors[field] ? "error" : ""}>
                    Select color
                </Typography>

            </Box> */}

            <Box
                sx={{
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >

                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ margin: 0, padding: 0 }}
                >
                    <CustomAvatar
                  
                        bgColor={formik?.errors[field] ? "#FF5630" : formik?.values[field] || "#777"}
                    />
                </IconButton>

                <Typography
                    variant="bold"
                    color={formik?.errors[field] ? "error" : ""}
                    sx={{ mx: 1 }}
                >
                    Select Color
                    {
                        required &&
                        <Typography
                            variant="bold"
                            sx={{ display: "inline", ml: 0.5 }}
                            color="error"
                        >
                            *
                        </Typography>
                    }
                </Typography>
            </Box>
            <ErrorMessage name={field}>
                {(msg) => <FormHelperText error>{msg}</FormHelperText>}
            </ErrorMessage>

            {displayColorPicker ? (

                <div style={styles.popover}>
                    <div style={styles.cover} >
                        <div style={{
                            position: "fixed",
                            // filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))', 
                        }} >
                            <TwitterPicker
                                styles={{ zIndex: 10000, }}
                                colors={colors}
                                color={color}
                                onChangeComplete={handleChangeColor} />
                        </div>
                    </div>
                </div>

            ) : null}
        </>
    );
};

CustomColorPicker.propTypes = {
    field: PropTypes.string,
    formik: PropTypes.object,
    handleColor: PropTypes.func,
    required: PropTypes.bool,
};

