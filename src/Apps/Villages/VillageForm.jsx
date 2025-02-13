import { useState, } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { ModifyVillageService } from 'src/Services/Villages.Services';

import { TextFieldForm, } from 'src/components/inputs';
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
                Village_EnName: editObject?.Village_EnName || "",
                Village_GjName: editObject?.Village_GjName || "",
            }}
            validationSchema={
                Yup.object().shape({
                    Village_EnName: Yup.string().required("Village english name  is required."),
                    Village_GjName: Yup.string().required("Village gujarati name is required."),
                })
            }
            onSubmit={(values) => {
                setFormSubmitLoader(true);
                if (editObject?.Village_Id) {
                    values.Village_Id = editObject?.Village_Id
                }
                dispatch(ModifyVillageService(values, () => {
                    setFormSubmitLoader(false);
                    backAction();
                }));
            }}>

            {(props) => {

                const { handleSubmit, dirty, resetForm } = props
                return (
                    <Form >
                        <Grid container spacing={2} >

                            <Grid item xs={12} md={6}>
                                <TextFieldForm
                                    formik={props}
                                    label='Village English Name'
                                    field='Village_EnName'
                                />
                            </Grid>

                            <Grid xs={12} md={6}>
                                <TextFieldForm
                                    formik={props}
                                    label='Village Gujarati Name'
                                    field='Village_GjName'
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
                                            color="CancelButton"
                                        >
                                            Cancel
                                        </Button>
                                    }

                                    {
                                        !formSubmitLoader ?
                                            <Button
                                                variant="contained"
                                                type='submit'
                                                disabled={!dirty}
                                                onClick={handleSubmit}
                                                color="success"
                                            >
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
