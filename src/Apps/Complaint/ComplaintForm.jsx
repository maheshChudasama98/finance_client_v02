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

import { shadows } from 'src/theme/shadows';
import { FillterConsumerService, FetchAplicationListAPI, ApplicationModifyService, } from 'src/Services/General.Services';

import { SingleSelect } from 'src/components/filters/index';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { TextFieldForm, DatePickerCustom, AutoCompleteSelectMenu } from 'src/components/inputs';

import { Form, Formik, } from 'formik'

import * as Yup from 'yup';

import dayjs from 'dayjs'

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
    const transformerCapacity = [
        { key: 5, value: 5 },
        { key: 10, value: 10 },
        { key: 16, value: 16 },
        { key: 25, value: 25 },
        { key: 63, value: 63 },
        { key: 100, value: 100 },
        { key: 200, value: 200 },
    ]


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
        if (editDetails?.Complaint_Id) {
            values.ComplaintId = editDetails?.Complaint_Id
        }
        dispatch(ApplicationModifyService(values, (Response) => {
            setFormSubmitLoader(false);
            backAction();
        }));
    }

    const selectedConsumerAction = (value) => {
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

    const reasonArray = [
        { key: "Low voltage", value: "Low voltage" },
        { key: "High voltage", value: "High voltage" },
        { key: "Bushing broken", value: "Bushing broken" },
        { key: "One phase power off", value: "One phase power off" },
        { key: "Two phase power off", value: "Two phase power off" },
        { key: "Do blasting", value: "Do blasting" },
        { key: "Oli leakage", value: "Oli leakage" },
        { key: "Charging fail", value: "Charging fail" },
    ]

    return (
        <Formik
            enableReinitialize
            initialValues={{
                ConsumerNumber: editDetails?.Consumer_Number || selectedConsumer?.Consumer_Number || "",
                ConsumerFullName: editDetails?.Consumer_FullName || selectedConsumer?.Consumer_FullName || "",
                ContractedLoad: editDetails?.Contracted_Load || selectedConsumer?.Contracted_Load || "",
                LoadUnity: editDetails?.Load_Unity || selectFeeder?.Unity || "KW",
                VaillageId: editDetails?.Village_Id || selectedConsumer?.Village_Id || "",
                FeederType: editDetails?.Feeder?.Feeder_Type || selectFeeder?.Feeder_Type || "",
                FeederId: editDetails?.Feeder_Id || selectedConsumer?.Feeder_Id || "",
                SubstationName: editDetails?.Feeder?.Substation_Name || selectFeeder?.Substation_Name || "",
                NumberOfConnection: editDetails?.Number_Of_Connection || "",
                ConsumerNumberPrimary: editDetails?.Consumer_NumberPrimary || selectedConsumer?.Consumer_NumberPrimary || "",
                ConsumerNumberSencodery: editDetails?.Consumer_NumberSecondary || selectedConsumer?.Consumer_NumberSecondary || "",
                TransformerCapacity: editDetails?.Transformer_Capacity || "",
                TransformerMake: editDetails?.Transformer_Make || "",
                SerialNumber: editDetails?.Serial_Number || "",
                JobNumber: editDetails?.Job_Number || "",
                DispatchNumber: dayjs(editDetails?.DispatchNumber_Date) || null,
                OliLevel: editDetails?.Oil_Level || "",
                OliLevelUnity: editDetails?.Oli_Level_Unity || "LTR",
                OliSortage: editDetails?.Oli_Sortage || "",
                OliSortageUnity: editDetails?.Oli_Sortage_Unity || "LTR",
                MeterMd: editDetails?.MeterMd || "",
                SortageReason: editDetails?.Sortage_Reason || "",
                Reason: editDetails?.Reason || "",
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
                    FeederId: Yup.string().required("Feeder Name is required."),
                    ConsumerNumberPrimary: Yup.string()
                        .length(10, "Must be exactly 10 digits.")
                        .matches(/^[0-9]+$/, "Must be a valid number.")
                        .required("Consumber Mobile Number is required."),
                    ConsumerNumberSencodery: Yup.string()
                        .length(10, "Must be exactly 10 digits.")
                        .matches(/^[0-9]+$/, "Must be a valid number.")
                        .nullable(),
                    OliLevel: Yup.number()
                        .required('Oli Level is required.')
                        .when('OliLevelUnity', {
                            is: (value) => value === 'PR',
                            then: (schema) => schema.min(1, 'Oli Level must be at least 1').max(100, 'Oli Level must be at most 100'),
                            otherwise: (schema) => schema.min(1, 'Oli Level must be at least 1'),
                        }),
                    OliSortage: Yup.number()
                        .required('Oli Sortage is required.')
                        .when('OliSortageUnity', {
                            is: (value) => value === 'PR',
                            then: (schema) => schema.min(1, 'Oli Sortage must be at least 1').max(100, 'Oli Sortage must be at most 100'),
                            otherwise: (schema) => schema.min(1, 'Oli Sortage must be at least 1'),
                        }),
                    NumberOfConnection: Yup.string()
                        .matches(/^[1-9]\d*$/, 'NumberOf Connection must start with 1 and only contain digits 1-9')
                        .nullable(),
                    TransformerCapacity: Yup.string()
                        .matches(/^[1-9]\d*$/, 'Transformer Capacity must start with 1 and only contain digits 1-9')
                        // .required('Transformer Capacity is required.')
                        .nullable(),
                })
            }
            onSubmit={filterHead} >

            {(props) => {

                const { setFieldValue, handleSubmit, values, dirty, resetForm } = props
                return (
                    <Form >
                        <Grid container spacing={2}
                            sx={{
                                // borderRadius: 1.3,
                                paddingY: 2,
                                paddingX: 2,
                            }} >
                            <Grid xs={12} md={4}>
                                <SingleSelect
                                    label="Search"
                                    menuList={consumerList}
                                    valueKey='Consumer_Id'
                                    labelKey='Consumer_Number'
                                    callBackAction={selectedConsumerAction}
                                    onInputChange={(value) => {
                                        if (value.length >= 3) {
                                            setTimeout(() => {
                                                setFilterByNumber(value)
                                            }, 500);
                                        }
                                    }}
                                    componentsProps={{
                                        popper: {
                                            sx: {
                                                '& .MuiAutocomplete-paper': {
                                                    boxShadow: shadows()[10],
                                                },
                                            },
                                        },
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
                                <AutoCompleteSelectMenu
                                    required={false}
                                    formik={props}
                                    label="Village Name"
                                    field="VaillageId"
                                    menuList={villageData}
                                    valueKey='Village_Id'
                                    labelKey='Village_EnName'
                                />
                            </Grid>



                            <Grid xs={12} md={6} >
                                <AutoCompleteSelectMenu
                                    formik={props}
                                    label="Feeder Name"
                                    field="FeederId"
                                    menuList={feederData}
                                    valueKey='Feeder_Id'
                                    labelKey='Feeder_Name'
                                    unitType={values?.FeederType}
                                    callBackAction={(value) => {
                                        const temp = feederData?.find(item => item?.Feeder_Id === value);
                                        setFieldValue("FeederType", temp?.Feeder_Type);
                                        setFieldValue("SubstationName", temp?.Substation_Name);
                                        setFieldValue("LoadUnity", temp?.Unity);
                                    }}
                                />

                            </Grid>

                            <Grid xs={12} md={6}   >
                                <TextFieldForm
                                    disabled
                                    formik={props}
                                    label='Substation Name'
                                    field='SubstationName'
                                />
                            </Grid>

                            <Grid xs={12} md={6}   >
                                <TextFieldForm
                                    formik={props}
                                    type='number'
                                    label='Consumer Mobile Number'
                                    field='ConsumerNumberPrimary'
                                    InputProps={{
                                        startAdornment: values?.ConsumerNumberPrimary ? (<InputAdornment position="start">+91</InputAdornment>) : '',
                                    }}
                                />
                            </Grid>

                            <Grid xs={12} md={6}   >
                                <TextFieldForm
                                    required={false}
                                    type='number'
                                    formik={props}
                                    label='Consumer Mobile Number'
                                    field='ConsumerNumberSencodery'
                                    InputProps={{
                                        startAdornment: values?.ConsumerNumberSencodery ? (<InputAdornment position="start">+91</InputAdornment>) : '',
                                    }}
                                />
                            </Grid>
                            <Grid xs={12} md={6}   >
                                <TextFieldForm
                                    required={false}
                                    type='number'
                                    formik={props}
                                    label='Number Of Connection'
                                    field='NumberOfConnection'
                                />
                            </Grid>

                            <Grid xs={12} md={6} >
                                <AutoCompleteSelectMenu
                                    formik={props}
                                    label="Transformer Capacity"
                                    field="TransformerCapacity"
                                    menuList={transformerCapacity}
                                    valueKey='value'
                                    labelKey='key'
                                    unitType='KVA'
                                />
                            </Grid>

                            <Grid xs={12} md={6}>
                                <TextFieldForm
                                    // type='number'
                                    required={false}
                                    formik={props}
                                    label='Transformer Make'
                                    field='TransformerMake'

                                />
                            </Grid>

                            <Grid xs={12} md={6}>
                                <TextFieldForm
                                    required={false}
                                    formik={props}
                                    label='Serial Number'
                                    field='SerialNumber'
                                />
                            </Grid>
                            <Grid xs={12} md={6}>
                                <TextFieldForm
                                    required={false}
                                    formik={props}
                                    label='Job Number'
                                    field='JobNumber'
                                />
                            </Grid>

                            <Grid xs={12} md={6}   >
                                <DatePickerCustom
                                    required={false}
                                    formik={props}
                                    label='Dispatch Number'
                                    field='DispatchNumber'
                                    defaultValue={values.DispatchNumber}
                                    callBackAction={(event) => { setFieldValue("DispatchNumber", dayjs(event)) }}
                                />
                            </Grid>


                            <Grid xs={12} md={6}   >
                                <TextFieldForm
                                    type='number'
                                    // required={false}
                                    formik={props}
                                    label='Oil Level'
                                    field='OliLevel'
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Select
                                                    value={values.OliLevelUnity}
                                                    onChange={(e) => setFieldValue("OliLevelUnity", e.target.value)}
                                                    variant="standard"
                                                    disableUnderline
                                                    sx={{ backgroundColor: "#FFFF" }}
                                                >
                                                    <MenuItem value="LTR">LTR</MenuItem>
                                                    <MenuItem value="PR">%</MenuItem>
                                                </Select>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid xs={12} md={6}   >
                                <TextFieldForm
                                    type='number'
                                    // required={false}
                                    formik={props}
                                    label='Oil Sortage'
                                    field='OliSortage'
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Select
                                                    value={values.OliSortageUnity}
                                                    onChange={(e) => setFieldValue("OliSortageUnity", e.target.value)}
                                                    variant="standard"
                                                    disableUnderline
                                                    sx={{ backgroundColor: "#FFFF" }}
                                                >
                                                    <MenuItem value="LTR">LTR</MenuItem>
                                                    <MenuItem value="PR">%</MenuItem>
                                                </Select>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* <Grid xs={12} md={6}   >
                                <TextFieldForm
                                    required={false}
                                    formik={props}
                                    label='Oli Sortage Reason'
                                    field='SortageReason'
                                />
                            </Grid> */}

                            <Grid xs={12} md={6}   >
                                <TextFieldForm
                                    required={false}
                                    formik={props}
                                    label='Meter MD'
                                    field='MeterMd'
                                />
                            </Grid>

                            <Grid xs={12} md={12}  >
                                <FormControl sx={{ marginBottom: 1 }}>
                                    <FormLabel >Reason</FormLabel>
                                    <RadioGroup value={values?.Reason} onChange={(e) => { setFieldValue("Reason", e.target.value) }}   >
                                        {
                                            reasonArray?.map((item, key) => (
                                                <FormControlLabel
                                                    key={key}
                                                    value={item?.value}
                                                    control={<Radio size="small" />}
                                                    label={item?.key}
                                                    size="small" />
                                            ))
                                        }
                                        <FormControlLabel
                                            value=""
                                            control={<Radio size="small" />}
                                            label="Other"
                                            size="small" />
                                    </RadioGroup>
                                </FormControl>

                                {
                                    !reasonArray?.find(item => item?.value === values?.Reason) &&
                                    <TextFieldForm
                                        required={false}
                                        formik={props}
                                        label='Other'
                                        field='Reason'
                                        multiline
                                        rows={3}
                                        maxRows={3}
                                    />
                                }

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
    );
}