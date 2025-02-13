// import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useState, useEffect, } from 'react';
// import Radio from '@mui/material/Radio';
// import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { ModifyMiscellaneousService } from 'src/Services/Miscellaneous.Services';
import { FillterConsumerService, FetchAplicationListAPI, } from 'src/Services/General.Services';

import { SingleSelect } from 'src/components/filters/index';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { TextFieldForm, AutoCompleteSelectMenu } from 'src/components/inputs';

import { Form, Formik, } from 'formik'

import * as Yup from 'yup';

export default function Index({ backAction, editObject }) {
    const dispatch = useDispatch();
    const [feederData, setFeederData] = useState([]);
    const [villageData, setVillageData] = useState([]);
    const [filterByNumber, setFilterByNumber] = useState(null);
    const [consumerList, setConsumerList] = useState([]);
    const [selectedConsumer, setSelectedConsumer] = useState({});
    const [selectFeeder, setSelectFeeder] = useState({});
    const [formSubmitLoader, setFormSubmitLoader] = useState(false);
    const [editDetails, setEditDetails] = useState(editObject);

    useEffect(() => {
        dispatch(FetchAplicationListAPI((Response) => {
            setFeederData(Response?.FeederData)
            setVillageData(Response?.VillageData)
            // setSubstationData(Response?.SubstationData)
        }))
    }, [])

    useEffect(() => {
        const payload = {
            search: filterByNumber
        }
        if (filterByNumber != null && filterByNumber !== "" && filterByNumber !== undefined) {
            dispatch(FillterConsumerService(payload, (Response) => {
                setConsumerList(Response);
            }))
        } else {
            setConsumerList([]);
        }
    }, [filterByNumber])


    const filterHead = (values) => {
        setFormSubmitLoader(true);
        if (editDetails?.Miscellaneous_Id) {
            values.MiscellaneousId = editDetails?.Miscellaneous_Id
        }
        dispatch(ModifyMiscellaneousService(values, (Response) => {
            setFormSubmitLoader(false);
            backAction();
        }));
    }

    const selectedConsumerAtion = (value) => {
        const temp = consumerList.find(item => item?.Consumer_Id === value);
        setEditDetails({});
        if (temp) {
            setSelectedConsumer(temp);
            setSelectFeeder(feederData?.find(item => item?.Feeder_Id === temp?.Feeder_Id));
            // setSelectedUnit();
        } else {
            setSelectFeeder({});
            setSelectedConsumer({});
        }

    }

    const actionArray = [
        { value: "Meter change" },
        { value: "Service cable change" },
        { value: "Meter + Service cable change" },
        { value: "MMB change" },
        { value: "Meter place  change" },
    ]

    return (
        <Formik
            enableReinitialize
            initialValues={{
                ConsumerNumber: editDetails?.Consumer_Number || selectedConsumer?.Consumer_Number || "",
                ConsumerFullName: editDetails?.Consumer_FullName || selectedConsumer?.Consumer_FullName || "",
                VillageId: editDetails?.Village_Id || selectedConsumer?.Village_Id || "",
                ContractedLoad: editDetails?.Contracted_Load || selectedConsumer?.Contracted_Load || "",
                LoadUnity: editDetails?.Load_Unity || selectFeeder?.Unity || "KW",
                ConsumerNumberPrimary: editDetails?.Consumer_NumberPrimary || "",
                ConsumerNumberSecondary: editDetails?.Consumer_NumberSecondary || "",
                TypeConnection: editDetails?.Type_Connection || "1PHASE",
                Tariff: editDetails?.Tariff || "",
                Action: editDetails?.Action || "",

            }}
            validationSchema={
                Yup.object().shape({
                    ConsumerNumber: Yup.string()
                        .matches(/^\d{11}$/, 'Consumer number must be exactly 11 digits')
                        .nullable()
                        .test('consumerNumberRequired', 'Either Consumer number or Consumer name is required', (value, context) => {
                            const { ConsumerFullName } = context.parent; // Access the sibling field
                            return Boolean(value || ConsumerFullName); // Simplified to directly return the boolean
                        }),
                    ConsumerFullName: Yup.string()
                        .nullable()
                        .test('consumerNameRequired', 'Either Consumer number or Consumer name is required', (value, context) => {
                            const { ConsumerNumber } = context.parent; // Access the sibling field
                            return Boolean(value || ConsumerNumber); // Simplified to directly return the boolean
                        }),
                    ConsumerNumberPrimary: Yup.string()
                        .length(10, "Must be exactly 10 digits.")
                        .matches(/^[0-9]+$/, "Must be a valid number.")
                        .required("Consumer Mobile Number is required."),
                    ConsumerNumberSecondary: Yup.string()
                        .length(10, "Must be exactly 10 digits.")
                        .matches(/^[0-9]+$/, "Must be a valid number.")
                        .nullable(),
                    VillageId: Yup.string().required("Village name is required."),
                    Tariff: Yup.string().required("Tariff is required."),
                    Action: Yup.string().required("Action is required."),
                    TypeConnection: Yup.string().required("Type is required."),
                })
            }
            onSubmit={filterHead} >

            {(props) => {

                const { setFieldValue, handleSubmit, values, dirty, resetForm } = props
                return (
                    <Form >
                        <Grid container spacing={2} >
                            <Grid xs={12} md={4}>
                                <SingleSelect
                                    label="Search"
                                    menuList={consumerList}
                                    valueKey='Consumer_Id'
                                    labelKey='Consumer_Number'
                                    callBackAction={selectedConsumerAtion}
                                    onInputChange={(value) => {
                                        if (value.length >= 3) {
                                            setTimeout(() => {
                                                setFilterByNumber(value)
                                            }, 500);
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid xs={8} />


                            <Grid item xs={12} md={6}>
                                <TextFieldForm
                                    type="number"
                                    formik={props}
                                    label='Consumer Number'
                                    field='ConsumerNumber'
                                />
                            </Grid>

                            <Grid xs={12} md={6}>
                                <TextFieldForm
                                    formik={props}
                                    label='Consumer Name'
                                    field='ConsumerFullName'
                                />
                            </Grid>

                            <Grid xs={12} md={6} >
                                <AutoCompleteSelectMenu
                                    // required={false}
                                    formik={props}
                                    label="Village Name"
                                    field="VillageId"
                                    menuList={villageData}
                                    valueKey='Village_Id'
                                    labelKey='Village_EnName'
                                />
                            </Grid>

                            <Grid xs={12} md={6}>
                                <TextFieldForm
                                    type="number"
                                    required={false}
                                    formik={props}
                                    label='Contracted Load'
                                    field='ContractedLoad'
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Select
                                                    value={values.LoadUnity}
                                                    onChange={(e) => {
                                                        setFieldValue("LoadUnity", e.target.value);
                                                    }}
                                                    variant="standard"
                                                    disableUnderline
                                                    sx={{ backgroundColor: "#FFFF" }}>

                                                    <MenuItem value="KW">KW</MenuItem>
                                                    <MenuItem value="HP">HP</MenuItem>
                                                </Select>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid xs={12} md={6} >
                                <TextFieldForm
                                    formik={props}
                                    label='Tariff'
                                    field='Tariff'
                                />

                            </Grid>

                            <Grid xs={12} md={6} >
                                <AutoCompleteSelectMenu
                                    formik={props}
                                    label="Action"
                                    field="Action"
                                    menuList={actionArray}
                                    valueKey='value'
                                    labelKey='value'
                                />
                            </Grid>

                            <Grid xs={12} md={6}   >
                                <TextFieldForm
                                    formik={props}
                                    type='number'
                                    label='Consumer Mobile Number 1 '
                                    field='ConsumerNumberPrimary'
                                    InputProps={{
                                        startAdornment:
                                            values?.ConsumerNumberPrimary ?
                                                (<InputAdornment position="start">+91</InputAdornment>) : '',
                                    }}
                                />
                            </Grid>

                            <Grid xs={12} md={6}   >
                                <TextFieldForm
                                    required={false}
                                    type='number'
                                    formik={props}
                                    label='Consumer Mobile Number 2'
                                    field='ConsumerNumberSecondary'
                                    InputProps={{
                                        startAdornment: values?.ConsumerNumberSecondary ? (<InputAdornment position="start">+91</InputAdornment>) : '',
                                    }}
                                />
                            </Grid>

                            <Grid xs={12} md={12}  >
                                <FormControl required>
                                    <FormLabel >Type Connection</FormLabel>
                                    <RadioGroup value={values?.TypeConnection} onChange={(e) => { setFieldValue("TypeConnection", e.target.value) }}   >
                                        <FormControlLabel value="1 PHASE" control={<Radio size="small" />} label="1 Phase" size="small" />
                                        <FormControlLabel value="3 PHASE" control={<Radio size="small" />} label="3 Phase" />
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
                                            onClick={() => { resetForm(); setSelectFeeder({}); setSelectedConsumer({}); }}
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