// import PropTypes from 'prop-types';
// import { useDispatch } from 'react-redux';
// import { useState, } from 'react';

// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Grid from '@mui/material/Unstable_Grid2';

// import { shadows } from 'src/theme/shadows';
// import { FillterConsumerService, FetchAplicationListAPI, ApplicationModifyService, } from 'src/Services/General.Services';

// import { SingleSelect } from 'src/components/filters/index';
// import ButtonLoader from 'src/components/Loaders/ButtonLoader';
// import { AutoCompleteSelectMenu, TextFieldForm, } from 'src/components/inputs';
// import { Form, Formik, } from 'formik';

// import * as Yup from 'yup';
// import { AccountTypes } from 'src/constance';

// import dayjs from 'dayjs';

export default function Index({ backAction, editObject }) {

    // const dispatch = useDispatch();

    // const [formSubmitLoader, setFormSubmitLoader] = useState(false);



    return (
        <>
            {/* <Formik
                enableReinitialize
                initialValues={{
                    CategoryName: editObject?.CategoryName || "",
                    Icon: editObject?.Icon || "",
                    Color: editObject?.Color || "",
                    Description: editObject?.Description || "",
                }}
                validationSchema={
                    Yup.object().shape({
                        CategoryName: Yup.string().trim().required("Category name is required."),
                        Color: Yup.string().required("Color is required."),
                        Icon: Yup.string().required("Icon is required."),
                    })
                }
            >
                {(props) => {
                    const { setFieldValue, handleSubmit, values, dirty, resetForm } = props
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
                                <Grid item xs={12} md={12}>
                                    <TextFieldForm
                                        formik={props}
                                        label='Category Name'
                                        field='CategoryName'
                                    />
                                </Grid>


                                <Grid item xs={12}>
                                    <TextFieldForm
                                        required={false}
                                        formik={props}
                                        label='Other'
                                        field='Reason'
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

            <Formik
                enableReinitialize
                initialValues={{
                    SubCategoriesName: editObject?.CategoryName || "",
                    Icon: editObject?.Icon || "",
                    Description: editObject?.Description || "",
                }}
                validationSchema={
                    Yup.object().shape({
                        SubCategoriesName: Yup.string().trim().required("Category name is required."),
                        Icon: Yup.string().required("Icon is required."),
                    })
                }
            >
                {(props) => {
                    const { setFieldValue, handleSubmit, values, dirty, resetForm } = props
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
                                <Grid item xs={12} md={12}>
                                    <TextFieldForm
                                        formik={props}
                                        label='Sub Category Name'
                                        field='SubCategoriesName'
                                    />
                                </Grid>

                                <Grid item xs={12}>
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

            <Formik
                enableReinitialize
                initialValues={{
                    LabelName: editObject?.LabelName || "",
                    Icon: editObject?.Icon || "",
                    Description: editObject?.Description || "",
                }}
                validationSchema={
                    Yup.object().shape({
                        LabelName: Yup.string().trim().required("Label name is required."),
                        Icon: Yup.string().required("Icon is required."),
                    })
                }
            >
                {(props) => {
                    const { setFieldValue, handleSubmit, values, dirty, resetForm } = props
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
                                <Grid item xs={12} md={12}>
                                    <TextFieldForm
                                        formik={props}
                                        label='Label Name'
                                        field='LabelName'
                                    />
                                </Grid>


                                <Grid item xs={12}>
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

            <Formik
                enableReinitialize
                initialValues={{
                    AccountName: editObject?.AccountName || "",
                    StartAmount: editObject?.StartAmount || "",
                    MinAmount: editObject?.MinAmount || "",
                    TypeId: editObject?.TypeId || "",
                    Icon: editObject?.Icon || "",
                    Description: editObject?.Description || "",
                }}
                validationSchema={
                    Yup.object().shape({
                        AccountName: Yup.string().trim().required("Account name is required."),
                        StartAmount: Yup.number().nullable(),
                        MinAmount: Yup.number().nullable(),
                        TypeId: Yup.number().required("Account type  is required."),
                        Icon: Yup.string().required("Icon is required."),
                        Description: Yup.string().trim().nullable(),
                    })
                }
            >
                {(props) => {
                    const { setFieldValue, handleSubmit, values, dirty, resetForm } = props
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
                                <Grid item xs={12} md={12}>
                                    <TextFieldForm
                                        formik={props}
                                        label='Account Name'
                                        field='AccountName'
                                    />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <TextFieldForm
                                        type="number"
                                        formik={props}
                                        label='Start Amount'
                                        field='StartAmount'
                                    />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <TextFieldForm
                                        type="number"
                                        formik={props}
                                        label='Amount limit'
                                        field='MinAmount'
                                    />
                                </Grid>


                                <Grid xs={12} md={6} >
                                    <AutoCompleteSelectMenu
                                        formik={props}
                                        label="Account type"
                                        field="TypeId"
                                        menuList={AccountTypes}
                                        valueKey='value'
                                        labelKey='key'
                                    />
                                </Grid>

                                <Grid item xs={12}>
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

            <Formik
                enableReinitialize
                initialValues={{
                    PartyFirstName: editObject?.PartyFirstName || "",
                    PartyLastName: editObject?.PartyLastName || "",
                    StartAmount: editObject?.StartAmount || "",
                    MinAmount: editObject?.MinAmount || "",
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
                        Phone: Yup.number().nullable(),
                        Email: Yup.string().nullable(),
                        TypeId: Yup.number().required("Account type  is required."),
                        Icon: Yup.string().required("Icon is required."),
                        Address: Yup.string().trim().nullable(),
                        Description: Yup.string().trim().nullable(),
                    })
                }
            >
                {(props) => {
                    const { setFieldValue, handleSubmit, values, dirty, resetForm } = props
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
                                <Grid item xs={12} md={12}>
                                    <TextFieldForm
                                        formik={props}
                                        label='Account Name'
                                        field='AccountName'
                                    />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <TextFieldForm
                                        type="number"
                                        formik={props}
                                        label='Start Amount'
                                        field='StartAmount'
                                    />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <TextFieldForm
                                        type="number"
                                        formik={props}
                                        label='Amount limit'
                                        field='MinAmount'
                                    />
                                </Grid>


                                <Grid xs={12} md={6} >
                                    <AutoCompleteSelectMenu
                                        formik={props}
                                        label="Account type"
                                        field="TypeId"
                                        menuList={AccountTypes}
                                        valueKey='value'
                                        labelKey='key'
                                    />
                                </Grid>

                                <Grid item xs={12}>
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

            </Formik> */}
        </>
    );
};