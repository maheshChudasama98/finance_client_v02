import { useState, } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

import { UserRegistrationService, } from 'src/Services/User.Services';
import { StaffID, VisitorID, ContractorID, JuniorEngineerID, } from 'src/constance';

import { TextFieldForm, } from 'src/components/inputs';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';

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
                UserFirstName: editDetails?.UserFirstName || "",
                UserLastName: editDetails?.UserLastName || "",
                UserEmail: editDetails?.UserEmail || "",
                UserEmploymentNumber: editDetails?.UserEmploymentNumber || "",
                UserPassword: editDetails?.UserPassword || "",
                UserTypeId: editDetails?.UserTypeId || StaffID,
            }}
            validationSchema={
                Yup.object().shape({
                    UserFirstName: Yup.string().required("First Name is required."),
                    UserLastName: Yup.string().required("Last Name is required."),
                    UserEmail: Yup.string().required("Email is required."),
                    UserTypeId: Yup.string().required("Email is required."),
                    UserEmploymentNumber: Yup.string()
                        .matches(/^[0-9]+$/, "Must be a valid number.")
                        .required("Consumber Mobile Number is required."),
                    UserPassword: Yup.string()
                        .required('Password is required')
                        .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])(?=\S+$).{8,}$/, "Passwords should have at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and 1 valid special character. Avoid spaces."),
                })
            }
            onSubmit={filterHead}
        >
            {(props) => {
                const { setFieldValue, handleSubmit, values, dirty, resetForm } = props
                return (
                    <Form >
                        <Grid container spacing={2} >
                            <Grid item xs={12} md={6}>
                                <TextFieldForm
                                    formik={props}
                                    label='First Name'
                                    field='UserFirstName' />
                            </Grid>

                            <Grid xs={12} md={6}>
                                <TextFieldForm
                                    formik={props}
                                    label='Last Name'
                                    field='UserLastName' />
                            </Grid>
                            <Grid xs={12} md={6}>
                                <TextFieldForm
                                    formik={props}
                                    label='Email'
                                    field='UserEmail' />
                            </Grid>

                            <Grid xs={12} md={6}   >
                                <TextFieldForm
                                    formik={props}
                                    type='number'
                                    label='Employment Number'
                                    field='UserEmploymentNumber' />
                            </Grid>

                            <Grid xs={12} md={6} >
                                <TextFieldForm
                                    formik={props}
                                    label='Password'
                                    field='UserPassword' />
                            </Grid>

                            <Grid xs={12} md={12}  >
                                <FormControl sx={{ marginBottom: 1 }}>
                                    <FormLabel>Role *</FormLabel>
                                    <RadioGroup
                                        value={values?.UserTypeId}
                                        onChange={(e) => {
                                            setFieldValue("UserTypeId", e.target.value)
                                        }}
                                    >
                                        <FormControlLabel
                                            value={StaffID}
                                            control={<Radio size="small" />}
                                            label="Staff"
                                            size="small" />
                                        <FormControlLabel
                                            value={ContractorID}
                                            control={<Radio size="small" />}
                                            label="Contractor" />
                                        <FormControlLabel
                                            value={JuniorEngineerID}
                                            control={<Radio size="small" />}
                                            label="Junior Engineer" />
                                        <FormControlLabel
                                            value={VisitorID}
                                            control={<Radio size="small" />}
                                            label="Visitor" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            <Grid xs={12} >
                                <Box sx={{ float: "right", display: "flex" }}>
                                    <Button
                                        variant="outlined"
                                        sx={{ marginX: 1 }}
                                        onClick={() => { resetForm(); }}
                                        color="CancelButton"
                                    >
                                        Cancel
                                    </Button>

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
