import { useDispatch } from 'react-redux';
import { useState, useEffect, } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import InputAdornment from '@mui/material/InputAdornment';

import { ModifyMeterService } from 'src/Services/Meter.Services';
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
    const [typeToggle, setTypeToggle] = useState(editObject?.Meter_Type || "NEW_CONSUMER");

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
        if (editDetails?.Meter_Id) {
            values.MeterId = editDetails?.Meter_Id
        }
        values.MeterType = typeToggle;

        dispatch(ModifyMeterService(values, (Response) => {
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

    const meterCapacity = [
        { key: "100/5", value: "100/5" },
        { key: "200/5", value: "200/5" },
        { key: "10-60", value: "10-60" },
        { key: "5-30", value: "5-30" },
    ]
    const solarMeterCapacity = [
        { key: "BIDI 100/5", value: "BIDI 100/5" },
        { key: "BIDI 200/5", value: "BIDI 200/5" },
        { key: "BIDI 10-60", value: "BIDI 10-60" },
        { key: "BIDI 5-30", value: "BIDI 5-30" },
    ]

    return (
        <>
            <Box sx={{ my: 2 }}>
                <Button
                    variant={typeToggle === "NEW_CONSUMER" ? "contained" : "outlined"}
                    color="success"
                    size='small'
                    onClick={() => setTypeToggle("NEW_CONSUMER")}
                    disabled={editDetails?.Meter_Id}
                >
                    New Consumer
                </Button>
                <Button
                    variant={typeToggle === "LOAD_EXTENSION" ? "contained" : "outlined"}
                    color="success"
                    size='small'
                    onClick={() => setTypeToggle("LOAD_EXTENSION")}
                    disabled={editDetails?.Meter_Id}
                    sx={{ mx: 1 }}
                >
                    Load Extension
                </Button>
                <Button
                    size='small'
                    variant={typeToggle === "SOLAR_METER" ? "contained" : "outlined"}
                    color="success"
                    onClick={() => setTypeToggle("SOLAR_METER")}
                    disabled={editDetails?.Meter_Id}
                >
                    Solar Meter
                </Button>
            </Box>
            {
                typeToggle === "NEW_CONSUMER" &&
                <Formik
                    enableReinitialize
                    initialValues={{
                        SerialNumber: editDetails?.Serial_Number || "",
                        ConsumerFullName: editDetails?.Consumer_FullName || "",
                        ContractedLoad: editDetails?.Contracted_Load || "",
                        LoadUnity: editDetails?.Load_Unity || "KW",
                        MeterCapacity: editDetails?.Meter_Capacity || '',
                        VillageId: editDetails?.Village_Id || "",
                        ConsumerNumberPrimary: editDetails?.Consumer_NumberPrimary || "",
                        ConsumerNumberSecondary: editDetails?.Consumer_NumberSecondary || "",
                    }}
                    validationSchema={
                        Yup.object().shape({
                            SerialNumber: Yup.string()
                                .required("Feeder Name is required."),
                            ConsumerFullName: Yup.string()
                                .required("Consumer full name is required."),
                            ContractedLoad: Yup.string()
                                .required("Contracted Load is required."),
                            MeterCapacity: Yup.string()
                                .required("Meter Capacity is required."),
                            VillageId: Yup.string()
                                .required("Village Name is required."),
                            ConsumerNumberPrimary: Yup.string()
                                .length(10, "Must be exactly 10 digits.")
                                .matches(/^[0-9]+$/, "Must be a valid number.")
                                .required("Consumer Mobile Number is required."),
                            ConsumerNumberSecondary: Yup.string()
                                .length(10, "Must be exactly 10 digits.")
                                .matches(/^[0-9]+$/, "Must be a valid number.")
                                .nullable(),
                        })
                    }
                    onSubmit={filterHead} >

                    {(props) => {

                        const { setFieldValue, handleSubmit, values, dirty, resetForm } = props
                        return (
                            <Form >
                                <Grid container spacing={2} >


                                    <Grid xs={12} md={6}>
                                        <TextFieldForm
                                            formik={props}
                                            label='Serial Number'
                                            field='SerialNumber'
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
                                            formik={props}
                                            label='  Load'
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
                                            formik={props}
                                            label="Meter Capacity"
                                            field="MeterCapacity"
                                            menuList={meterCapacity}
                                            valueKey='key'
                                            labelKey='value'
                                        />
                                    </Grid>


                                    <Grid xs={12} md={6} >
                                        <AutoCompleteSelectMenu
                                            formik={props}
                                            label="Village Name"
                                            field="VillageId"
                                            menuList={villageData}
                                            valueKey='Village_Id'
                                            labelKey='Village_EnName'
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
                                    <Grid xs={12} md={6} >
                                        <TextFieldForm
                                            required={false}
                                            formik={props}
                                            type='number'
                                            label='Consumer Mobile Number'
                                            field='ConsumerNumberSecondary'
                                            InputProps={{
                                                startAdornment: values?.ConsumerNumberSecondary ? (<InputAdornment position="start">+91</InputAdornment>) : '',
                                            }}
                                        />
                                    </Grid>

                                    <Grid xs={12} >
                                        <Box sx={{ float: "right", display: "flex" }}>
                                            {
                                                dirty &&
                                                <Button
                                                    variant="outlined"
                                                    sx={{ marginX: 1 }}
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
            }

            {
                typeToggle === "LOAD_EXTENSION" &&
                <Formik
                    enableReinitialize
                    initialValues={{
                        ConsumerNumber: editDetails?.Consumer_Number || selectedConsumer?.Consumer_Number || "",
                        ConsumerFullName: editDetails?.Consumer_FullName || selectedConsumer?.Consumer_FullName || "",
                        ContractedLoadOld: editDetails?.Contracted_Load_Old || selectedConsumer?.Contracted_Load || "",
                        ContractedLoad: editDetails?.Contracted_Load || '',
                        LoadUnityOld: editDetails?.Load_Unity_Old || selectFeeder?.Unity || "KW",
                        LoadUnity: editDetails?.Load_Unity || "KW",
                        MeterCapacity: editDetails?.Meter_Capacity || '',
                        MeterCapacityOld: editDetails?.Meter_Capacity_Old || '',
                        VillageId: editDetails?.Village_Id || "",
                        ConsumerNumberPrimary: editDetails?.Consumer_NumberPrimary || "",
                        ConsumerNumberSecondary: editDetails?.Consumer_NumberSecondary || "",
                    }}
                    validationSchema={
                        Yup.object().shape({
                            ConsumerNumber: Yup.string()
                                .matches(/^\d{11}$/, 'Consumer number must be exactly 11 digits')
                                .required("Consumer number is required."),
                            ConsumerFullName: Yup.string()
                                .required("Consumer full name  is required."),
                            VillageId: Yup.string()
                                .required("Village Name is required."),
                            ContractedLoad: Yup.string()
                                .required("Contracted Load is required."),
                            ContractedLoadOld: Yup.string()
                                .required("Contracted Load old is required."),
                            MeterCapacity: Yup.string()
                                .required("Meter Capacity is required."),
                            MeterCapacityOld: Yup.string()
                                .required("Meter Capacity old is required."),
                            ConsumerNumberPrimary: Yup.string()
                                .length(10, "Must be exactly 10 digits.")
                                .matches(/^[0-9]+$/, "Must be a valid number.")
                                .required("Consumer Mobile Number is required."),
                            ConsumerNumberSecondary: Yup.string()
                                .length(10, "Must be exactly 10 digits.")
                                .matches(/^[0-9]+$/, "Must be a valid number.")
                                .nullable(),
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
                                            callBackAction={selectedConsumerAction}
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

                                    <Grid xs={12} md={6}>
                                        <TextFieldForm
                                            type="number"
                                            formik={props}
                                            label='Contracted Load Old'
                                            field='ContractedLoadOld'
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Select
                                                            value={values.LoadUnityOld}
                                                            onChange={(e) => {
                                                                setFieldValue("LoadUnityOld", e.target.value);
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

                                    <Grid xs={12} md={6}>
                                        <TextFieldForm
                                            type="number"
                                            formik={props}
                                            label='Contracted Load New'
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
                                            formik={props}
                                            label="Meter Capacity Old"
                                            field="MeterCapacityOld"
                                            menuList={meterCapacity}
                                            valueKey='key'
                                            labelKey='value'
                                        />
                                    </Grid>

                                    <Grid xs={12} md={6} >
                                        <AutoCompleteSelectMenu
                                            formik={props}
                                            label="Meter Capacity New"
                                            field="MeterCapacity"
                                            menuList={meterCapacity}
                                            valueKey='key'
                                            labelKey='value'
                                        />
                                    </Grid>


                                    <Grid xs={12} md={6} >
                                        <AutoCompleteSelectMenu
                                            required={false}
                                            formik={props}
                                            label="Village Name"
                                            field="VillageId"
                                            menuList={villageData}
                                            valueKey='Village_Id'
                                            labelKey='Village_EnName'
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
                                    <Grid xs={12} md={6} >
                                        <TextFieldForm
                                            required={false}
                                            formik={props}
                                            type='number'
                                            label='Consumer Mobile Number'
                                            field='ConsumerNumberSecondary'
                                            InputProps={{
                                                startAdornment: values?.ConsumerNumberSecondary ? (<InputAdornment position="start">+91</InputAdornment>) : '',
                                            }}
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
            }
            {
                typeToggle === "SOLAR_METER" &&
                <Formik
                    enableReinitialize
                    initialValues={{
                        ConsumerNumber: editDetails?.Consumer_Number || selectedConsumer?.Consumer_Number || "",
                        ConsumerFullName: editDetails?.Consumer_FullName || selectedConsumer?.Consumer_FullName || "",
                        ContractedLoadOld: editDetails?.Contracted_Load_Old || selectedConsumer?.Contracted_Load || "",
                        ContractedLoad: editDetails?.Contracted_Load || '',
                        LoadUnityOld: editDetails?.Load_Unity_Old || selectFeeder?.Unity || "KW",
                        LoadUnity: editDetails?.Load_Unity || "KW",
                        MeterCapacity: editDetails?.Meter_Capacity || '',
                        MeterCapacityOld: editDetails?.Meter_Capacity_Old || '',
                        VillageId: editDetails?.Village_Id || "",
                        ConsumerNumberPrimary: editDetails?.Consumer_NumberPrimary || "",
                        ConsumerNumberSecondary: editDetails?.Consumer_NumberSecondary || "",
                    }}
                    validationSchema={
                        Yup.object().shape({
                            ConsumerNumber: Yup.string()
                                .matches(/^\d{11}$/, 'Consumer number must be exactly 11 digits')
                                .required("Consumer number is required."),
                            ConsumerFullName: Yup.string()
                                .required("Consumer full name  is required."),
                            VillageId: Yup.string()
                                .required("Village Name is required."),
                            ContractedLoad: Yup.string()
                                .required("Contracted Load is required."),
                            ContractedLoadOld: Yup.string()
                                .required("Contracted Load old is required."),
                            MeterCapacity: Yup.string()
                                .required("Meter Capacity is required."),
                            MeterCapacityOld: Yup.string()
                                .required("Meter Capacity old is required."),
                            ConsumerNumberPrimary: Yup.string()
                                .length(10, "Must be exactly 10 digits.")
                                .matches(/^[0-9]+$/, "Must be a valid number.")
                                .required("Consumer Mobile Number is required."),
                            ConsumerNumberSecondary: Yup.string()
                                .length(10, "Must be exactly 10 digits.")
                                .matches(/^[0-9]+$/, "Must be a valid number.")
                                .nullable(),
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
                                            callBackAction={selectedConsumerAction}
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

                                    <Grid xs={12} md={6}>
                                        <TextFieldForm
                                            type="number"
                                            formik={props}
                                            label='Contracted Load Old'
                                            field='ContractedLoadOld'
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Select
                                                            value={values.LoadUnityOld}
                                                            onChange={(e) => {
                                                                setFieldValue("LoadUnityOld", e.target.value);
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

                                    <Grid xs={12} md={6}>
                                        <TextFieldForm
                                            type="number"
                                            formik={props}
                                            label='Contracted Load New'
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
                                            formik={props}
                                            label="Meter Capacity Old"
                                            field="MeterCapacityOld"
                                            menuList={meterCapacity}
                                            valueKey='key'
                                            labelKey='value'
                                        />
                                    </Grid>

                                    <Grid xs={12} md={6} >
                                        <AutoCompleteSelectMenu
                                            formik={props}
                                            label="Meter Capacity New"
                                            field="MeterCapacity"
                                            menuList={solarMeterCapacity}
                                            valueKey='key'
                                            labelKey='value'
                                        />
                                    </Grid>


                                    <Grid xs={12} md={6} >
                                        <AutoCompleteSelectMenu
                                            required={false}
                                            formik={props}
                                            label="Village Name"
                                            field="VillageId"
                                            menuList={villageData}
                                            valueKey='Village_Id'
                                            labelKey='Village_EnName'
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
                                    <Grid xs={12} md={6} >
                                        <TextFieldForm
                                            required={false}
                                            formik={props}
                                            type='number'
                                            label='Consumer Mobile Number'
                                            field='ConsumerNumberSecondary'
                                            InputProps={{
                                                startAdornment: values?.ConsumerNumberSecondary ? (<InputAdornment position="start">+91</InputAdornment>) : '',
                                            }}
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
            }
        </>
    )
}