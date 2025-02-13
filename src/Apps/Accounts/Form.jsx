import { useState, } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { AccountTypes } from 'src/constance';
import { AccountModifyService } from 'src/Services/Meter.Services';

import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { TextFieldForm, AutoCompleteSelectMenu, } from 'src/components/inputs';
import { CustomIconPicker, CustomColorPicker, } from 'src/components/CustomComponents';

import { Form, Formik, } from 'formik';

import * as Yup from 'yup';

export default function Index({ backAction, editObject }) {

    const dispatch = useDispatch();

    const [formSubmitLoader, setFormSubmitLoader] = useState(false);

    const ActionSubmit = (values) => {
        setFormSubmitLoader(true);
        if (editObject?.AccountId) {
            values.AccountId = editObject?.AccountId;
        };
        dispatch(AccountModifyService(values, (res) => {
            setFormSubmitLoader(false);
            if (res?.status) {
                backAction();
            };

        }));

    };

    return (
        <Formik
            enableReinitialize
            initialValues={{
                AccountName: editObject?.AccountName || "",
                StartAmount: editObject?.StartAmount || "",
                MinAmount: editObject?.MinAmount || "",
                TypeId: editObject?.TypeId || "",
                Icon: editObject?.Icon || "",
                Color: editObject?.Color || "",
                Description: editObject?.Description || "",
            }}
            validationSchema={
                Yup.object().shape({
                    AccountName: Yup.string().trim().required("Account name is required."),
                    StartAmount: Yup.number().nullable(),
                    MinAmount: Yup.number().nullable(),
                    TypeId: Yup.number().required("Account type  is required."),
                    // Icon: Yup.string().required("Icon is required."),
                    Description: Yup.string().trim().nullable(),
                })
            }
            onSubmit={ActionSubmit}
        >
            {(props) => {
                const { handleSubmit, dirty, resetForm, values } = props
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
                                    label='Account Name'
                                    field='AccountName'
                                />
                            </Grid>
                            <Grid xs={12} md={6} >
                                <AutoCompleteSelectMenu
                                    formik={props}
                                    label="Account type"
                                    field="TypeId"
                                    menuList={AccountTypes}
                                    valueKey='key'
                                    labelKey='value'
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextFieldForm
                                    required={false}
                                    type="number"
                                    formik={props}
                                    label='Start Amount'
                                    field='StartAmount'
                                    disabled={editObject?.AccountId}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextFieldForm
                                    required={false}
                                    type="number"
                                    formik={props}
                                    label='Amount limit'
                                    field='MinAmount'
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
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

                            <Grid item xs={12} md={3}>
                                <CustomColorPicker
                                    formik={props}
                                    label='Color'
                                    field='Color'
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <CustomIconPicker
                                    formik={props}
                                    label='Icon'
                                    field='Icon'
                                    color={values?.Color}
                                />
                            </Grid>




                            <Grid xs={12} >
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