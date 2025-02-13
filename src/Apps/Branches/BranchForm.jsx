import { useState, } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { UserRegistrationService, } from 'src/Services/User.Services';

import { TextFieldForm, } from 'src/components/inputs';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { GoogleAddress } from 'src/components/CustomComponents';

import { Form, Formik, } from 'formik'

import * as Yup from 'yup';

export default function Index({ backAction, editDetails }) {
    const dispatch = useDispatch();
    const [formSubmitLoader, setFormSubmitLoader] = useState(false);

    const filterHead = (values) => {
        setFormSubmitLoader(true);
        dispatch(UserRegistrationService(values, (Response) => {
            setFormSubmitLoader(false);
            backAction();
        }));
        setFormSubmitLoader(false);
    }

    return (
        <Formik
            enableReinitialize
            initialValues={{
                BranchName: editDetails?.BranchName || null,
                Address: editDetails?.Address || null,
                City: editDetails?.City || null,
                zipCode: editDetails?.zipCode || null,
                Latitude: editDetails?.Latitude || null,
                Longitude: editDetails?.Longitude || null,
            }}
            validationSchema={
                Yup.object().shape({
                    BranchName: Yup.string().required("Branch Name is required."),
                    City: Yup.string().required("City is required."),
                    zipCode: Yup.string().required("zip code is required."),
                })
            }
            onSubmit={filterHead}
        >
            {(props) => {
                const { handleSubmit, dirty, resetForm, setFieldValue } = props
                return (

                    <Form >
                        <Grid container spacing={2} >
                            <Grid item xs={12} md={12}>
                                <TextFieldForm
                                    formik={props}
                                    label='Branch Name'
                                    field='BranchName' />
                            </Grid>

                            <Grid item xs={12} >
                                <GoogleAddress
                                    callBackAction={(data) => {
                                        setFieldValue("zipCode", data?.pinCode);
                                        setFieldValue("City", data?.city);
                                        setFieldValue("Address", data?.address);
                                        setFieldValue("Latitude", data?.latitude);
                                        setFieldValue("Longitude", data?.longitude);
                                    }} />
                            </Grid>

                            <Grid xs={12} md={6}>
                                <TextFieldForm
                                    formik={props}
                                    label='City'
                                    field='City' />
                            </Grid>

                            <Grid xs={12} md={6}>
                                <TextFieldForm
                                    formik={props}
                                    label='Pin Code'
                                    field='zipCode' />
                            </Grid>

                            <Grid item xs={12} >
                                <TextFieldForm
                                    required={false}
                                    formik={props}
                                    label='Address'
                                    field='Address'
                                    multiline
                                    rows={6}
                                    maxRows={6}
                                />
                            </Grid>


                            <Grid xs={12} >
                                <Box sx={{ float: "right", display: "flex" }}>
                                    {
                                        dirty &&
                                        <Button
                                            variant="outlined"
                                            sx={{ marginX: 1 }}
                                            onClick={() => { resetForm(); }}
                                            color="CancelButton"> Cancel </Button>
                                    }


                                    {
                                        !formSubmitLoader ?
                                            <Button
                                                variant="contained"
                                                type='submit'
                                                disabled={!dirty}
                                                onClick={handleSubmit}
                                                color="success">
                                                Save
                                            </Button>
                                            :
                                            <ButtonLoader />
                                    }
                                </Box>
                            </Grid>
                        </Grid>
                    </Form>
                )
            }}
        </Formik >
    )
}
