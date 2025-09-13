import { useState, } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { SubCategoryModifyService } from 'src/Services/Meter.Services';

import { TextFieldForm, } from 'src/components/inputs';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { CustomIconPicker } from 'src/components/CustomComponents';

import { Form, Formik, } from 'formik';

import * as Yup from 'yup';

export default function SubForm({ backAction, editObject, CategoryId , Color }) {

    const dispatch = useDispatch();

    const [formSubmitLoader, setFormSubmitLoader] = useState(false);

    const ActionSubmit = (values) => {
        setFormSubmitLoader(true);
        values.CategoryId = CategoryId;
        if (editObject?.SubCategoryId) {
            values.SubCategoryId = editObject?.SubCategoryId;
        };
        dispatch(SubCategoryModifyService(values, (res) => {
            if (res?.status) { backAction(); };
            setFormSubmitLoader(false);
        }));

    };

    return (
        <Formik
            enableReinitialize
            initialValues={{
                SubCategoriesName: editObject?.SubCategoriesName || "",
                Icon: editObject?.Icon || "",
                // Color: editObject?.Color || "",
                Description: editObject?.Description || "",
            }}
            validationSchema={
                Yup.object().shape({
                    SubCategoriesName: Yup.string().trim().required("Category is required."),
                    // Color: Yup.string().trim().required("Color is required."),
                    Icon: Yup.string().required("Icon is required."),
                    Description: Yup.string().trim().nullable(),
                })
            }
            onSubmit={ActionSubmit}
        >
            {(props) => {
                const { handleSubmit, dirty, resetForm } = props
                return (
                    <Form >
                        <Grid
                            container
                            spacing={2}
                            sx={{
                                paddingY: 2,
                                paddingX: 2,
                            }}
                        >
                            <Grid item xs={12} md={6}>
                                <TextFieldForm
                                    formik={props}
                                    label='Category'
                                    field='SubCategoriesName'
                                />
                            </Grid>

                        
                            <Grid item xs={12} md={3}>
                                <CustomIconPicker
                                    required
                                    formik={props}
                                    label='Icon'
                                    field='Icon'
                                    color={Color}
                                />
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <TextFieldForm
                                    required={false}
                                    formik={props}
                                    label='Description'
                                    field='Description'
                                    multiline
                                    rows={3}
                                    maxRows={3}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <Box sx={{ float: "right", display: "flex" }}>
                                    {
                                        dirty &&
                                        <Button
                                            variant="outlined"
                                            sx={{ marginX: 1 }}
                                            // disabled={!dirty}
                                            onClick={() => { resetForm(); }}
                                            color="CancelButton"> Cancel </Button>
                                    }

                                    {
                                        !formSubmitLoader ?
                                            <Button variant="contained" type='submit' disabled={!dirty} onClick={handleSubmit} color="success">Save</Button>
                                            :
                                            <ButtonLoader />
                                    }
                                </Box>
                            </Grid>

                        </Grid>
                    </Form>
                )
            }}

        </Formik>
    );
};