import { useState, } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { EMAIL_REGEX } from 'src/constance';
import { PartyModifyService } from 'src/Services/Meter.Services';

import { TextFieldForm, } from 'src/components/inputs';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';

import { Form, Formik, } from 'formik';

import * as Yup from 'yup';

export default function Index({ backAction, editObject }) {

    const dispatch = useDispatch();

    const [formSubmitLoader, setFormSubmitLoader] = useState(false);

    const ActionSubmit = (values) => {
        setFormSubmitLoader(true);
        if (editObject?.PartyId) {
            values.PartyId = editObject?.PartyId;
        };
        dispatch(PartyModifyService(values, (res) => {
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
                PartyFirstName: editObject?.PartyFirstName || "",
                PartyLastName: editObject?.PartyLastName || "",
                StartAmount: editObject?.StartAmount || "",
                MinAmount: editObject?.MinAmount || "",
                MaxAmount: editObject?.MaxAmount || "",
                Phone: editObject?.Phone || "",
                Email: editObject?.Email || "",
                City: editObject?.City || "",
                State: editObject?.State || "",
                Address: editObject?.Address || "",
                Description: editObject?.Description || "",
            }}
            validationSchema={
                Yup.object().shape({
                    PartyFirstName: Yup.string().trim().required("First name is required."),
                    PartyLastName: Yup.string().trim().required("Last name is required."),
                    StartAmount: Yup.number().nullable(),
                    MinAmount: Yup.number().nullable(),
                    MaxAmount: Yup.number().nullable(),
                    Phone: Yup.string().length(10, "Must be exactly 10 digits.").matches(/^[0-9]+$/, "Must be a valid number.").nullable(),
                    Email: Yup.string().matches(EMAIL_REGEX, "Email validation.").nullable(),
                    City: Yup.string().trim().nullable(),
                    State: Yup.string().trim().nullable(),
                    Address: Yup.string().trim().nullable(),
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
                                    label='First Name'
                                    field='PartyFirstName'
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextFieldForm
                                    formik={props}
                                    label='Last Name'
                                    field='PartyLastName'
                                />
                            </Grid>

                            {/* <Grid xs={12} md={6} >
                                <AutoCompleteSelectMenu
                                    formik={props}
                                    label="Account type"
                                    field="TypeId"
                                    menuList={AccountTypes}
                                    valueKey='key'
                                    labelKey='value'
                                />
                            </Grid> */}

                            <Grid item xs={12} md={6}>
                                <TextFieldForm
                                    required={false}
                                    type="number"
                                    formik={props}
                                    label='Start Amount'
                                    field='StartAmount'
                                    disabled={editObject?.PartyId}
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <TextFieldForm
                                    required={false}
                                    type="number"
                                    formik={props}
                                    label='Min Amount'
                                    field='MinAmount'
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <TextFieldForm
                                    required={false}
                                    type="number"
                                    formik={props}
                                    label='Max Amount'
                                    field='MaxAmount'
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextFieldForm
                                    required={false}
                                    type="number"
                                    formik={props}
                                    label='Phone'
                                    field='Phone'
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextFieldForm
                                    required={false}
                                    formik={props}
                                    label='Email'
                                    field='Email'
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextFieldForm
                                    required={false}
                                    formik={props}
                                    label='City'
                                    field='City'
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextFieldForm
                                    required={false}
                                    formik={props}
                                    label='State'
                                    field='State'
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextFieldForm
                                    required={false}
                                    formik={props}
                                    label='Address'
                                    field='Address'
                                    multiline
                                    rows={3}
                                    maxRows={3}
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