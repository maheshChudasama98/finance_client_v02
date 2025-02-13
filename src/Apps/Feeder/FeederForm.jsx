// import PropTypes from 'prop-types';
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

import { ModifyFeederService } from 'src/Services/Feeders.Services';

import { TextFieldForm } from 'src/components/inputs';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';

import { Form, Formik, } from 'formik'

import * as Yup from 'yup';

export default function Index({ backAction, editObject }) {
    const dispatch = useDispatch();

    const [formSubmitLoader, setFormSubmitLoader] = useState(false);

    return (
        <Formik
            enableReinitialize
            initialValues={{
                Feeder_Name: editObject?.Feeder_Name || "",
                Feeder_GjName: editObject?.Feeder_GjName || "",
                Feeder_Type: editObject?.Feeder_Type || "",
                Substation_Name: editObject?.Substation_Name || "",
                Unity: editObject?.Unity || "HP",
            }}
            validationSchema={
                Yup.object().shape({
                    Feeder_Name: Yup.string().required("Feeder Name is required."),
                    Feeder_GjName: Yup.string().required("Feeder gujrati name is required."),
                    Feeder_Type: Yup.string().required("Feeder Type is required."),
                    Substation_Name: Yup.string().required("Substation Name is required."),
                    Unity: Yup.string().required("Unity is required."),
                })
            }
            onSubmit={(values) => {
                setFormSubmitLoader(true);
                if (editObject?.Feeder_Id) {
                    values.Feeder_Id = editObject?.Feeder_Id
                }
                dispatch(ModifyFeederService(values, (Response) => {
                    setFormSubmitLoader(false);
                    backAction();
                }));
            }}>

            {(props) => {

                const { setFieldValue, handleSubmit, values, dirty, resetForm } = props
                return (
                    <Form >
                        <Grid container spacing={2} >

                            <Grid item xs={12} md={6}>
                                <TextFieldForm
                                    formik={props}
                                    label='Feeder Name'
                                    field='Feeder_Name'
                                />
                            </Grid>

                            <Grid xs={12} md={6}>
                                <TextFieldForm
                                    formik={props}
                                    label='Feeder Gujrati Name'
                                    field='Feeder_GjName'
                                />
                            </Grid>
                            <Grid xs={12} md={6}>
                                <TextFieldForm
                                    formik={props}
                                    label='Feeder Type'
                                    field='Feeder_Type'
                                />
                            </Grid>
                            <Grid xs={12} md={6}>
                                <TextFieldForm
                                    formik={props}
                                    label='Substation Name'
                                    field='Substation_Name'
                                />
                            </Grid>


                            <Grid xs={12} md={12}  >
                                <FormControl sx={{ marginBottom: 1 }}>
                                    <FormLabel >Unity</FormLabel>
                                    <RadioGroup value={values?.Unity} onChange={(e) => { setFieldValue("Unity", e.target.value) }}   >
                                        <FormControlLabel value="HP" control={<Radio size="small" />} label="HP" size="small" />
                                        <FormControlLabel value="KW" control={<Radio size="small" />} label="KW" size="small" />
                                    </RadioGroup>
                                </FormControl>
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

        </Formik >
    )
}
