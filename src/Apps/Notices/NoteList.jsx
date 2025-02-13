import React, { useEffect } from 'react';

import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from "@mui/material/Typography";

import { DateAndTimeFormat } from 'src/constance';

import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { DateAndTime, AutoCompleteSelectMenu, } from 'src/components/inputs';

import { Form, Formik, } from 'formik'

import * as Yup from 'yup';

import dayjs from 'dayjs';

import moment from 'moment';


const NoteList = ({
    index,
    item,
    isHeader,
    feederList,
    NoteArrayAction,
    NoteEditAction,
    NoteDeleteAction,
    editLoader,
    deleteLoader }) => {

    const [editFlag, setEditFlag] = React.useState(false);

    let buttonStyle = {
        '.MuiAccordionSummary-expandIconWrapper': {
            color: 'text.secondary',
            height: 23,
            width: 22,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            // mr: 1,

        },
        py: 1.5,
        // py: 1,
        color: (theme) => `${theme?.palette?.grey?.[600]}`,
        backgroundColor: (theme) => `${theme?.palette?.grey?.[200]}`,
        // borderRadius:"15px 15px 0px 0px"

    }

    if (!isHeader) {
        buttonStyle = {
            my: 1,
            '.MuiAccordionSummary-expandIconWrapper': {
                borderRadius: 1,
                border: 1,
                color: 'text.secondary',
                borderColor: 'divider',
                transform: 'none',
                height: 23,
                width: 22,
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1,
                '&.Mui-expanded': {
                    transform: 'none',
                    color: 'primary.main',
                    borderColor: 'primary.main',
                },

                '& svg': {
                    fontSize: '1.25rem',
                }
            }
        }
    }

    const temp = feederList?.find(feeder => feeder?.Feeder_Id === item?.Feeder_Id);



    useEffect(() => {
        setEditFlag(false);
    }, [item])
    return (
        <Box sx={{ ...buttonStyle, px: 2 }}>
            {
                isHeader ?
                    <Grid container spacing={2} sx={{ alignItems: 'center' }} >
                        <Grid xs={0.5} >
                            <Typography variant="body1" fontSize={15} fontWeight={600}>  </Typography>
                        </Grid>
                        <Grid xs={3} >
                            <Typography variant="body1" fontSize={15} fontWeight={600}>Feeder Name</Typography>
                        </Grid>

                        <Grid xs={3} >
                            <Typography variant="body2" fontSize={15} fontWeight={600}>Start Date</Typography>
                        </Grid>

                        <Grid xs={3}>
                            <Typography variant="body2" fontSize={15} fontWeight={600}>End Date</Typography>
                        </Grid>

                        <Grid xs={2.5}>
                            <Typography variant="body2" fontSize={15} fontWeight={600}>Action</Typography>
                        </Grid>
                    </Grid>
                    :
                    <Box sx={{ py: 2 }}>
                        {
                            !editFlag ?
                                <Grid container spacing={2} sx={{ alignItems: 'center' }} >
                                    <Grid xs={0.5} md={0.5}  >
                                        <Typography variant="body1" fontSize={14} fontWeight={600}> {index + 1} </Typography>
                                    </Grid>
                                    <Grid xs={3} md={3} >
                                        <Typography variant="body1" fontSize={14} fontWeight={600}>
                                            {temp?.Feeder_Name} ({temp?.Feeder_Type})
                                        </Typography>
                                    </Grid>

                                    <Grid xs={3} md={3}  >
                                        <Typography variant="body2" fontSize={14} fontWeight={600} sx={{ display: "flex" }}>
                                            {moment(item?.Power_Off).format(DateAndTimeFormat)}
                                        </Typography>
                                    </Grid>

                                    <Grid xs={3} md={3} >
                                        <Typography variant="body2" fontSize={14} fontWeight={600} sx={{ display: "flex" }}>
                                            {moment(item?.Power_On).format(DateAndTimeFormat)}
                                        </Typography>
                                    </Grid>

                                    <Grid xs={2.5} md={2.5} >
                                        <Box sx={{ display: "flex" }}>

                                            <Button variant="contained" size='small' onClick={() => { setEditFlag(!editFlag); }} sx={{ mx: 1 }} color="success">Edit</Button>

                                            {
                                                !deleteLoader ?

                                                    <Button
                                                        variant="contained"
                                                        size='small'
                                                        color="error"
                                                        sx={{ mx: 1 }}
                                                        onClick={() => {
                                                            if (!item?.Note_Id) {
                                                                NoteArrayAction("REMOVE", {}, index);
                                                            } else {
                                                                NoteDeleteAction(item?.Note_Id);
                                                            }
                                                        }}
                                                    > Delete</Button>
                                                    : <ButtonLoader />
                                            }
                                            {/* <Button variant="contained" size='small' color="error"
                                            onClick={() => {
                                                if (!item?.Note_Id) {
                                                    NoteArrayAction("REMOVE", {}, index);
                                                } else {
                                                    NoteDeleteAction(item?.Note_Id);
                                                }
                                            }}>Delete</Button> */}
                                        </Box>
                                    </Grid>

                                </Grid>
                                :
                                <Formik
                                    enableReinitialize
                                    initialValues={{
                                        Feeder_Id: item?.Feeder_Id || null,
                                        Power_Off: dayjs(item?.Power_Off) || null,
                                        Power_On: dayjs(item?.Power_On) || null,
                                        FeederType: item?.FeederType || null,
                                    }}
                                    validationSchema={
                                        Yup.object().shape({
                                            Feeder_Id: Yup.string().required('Feeder is required.'),
                                            Power_Off: Yup.string().required('OFF date and time is required.'),
                                            Power_On: Yup.string().required('ON date and time is required.')
                                        })
                                    }
                                    onSubmit={(values) => {
                                        if (!item?.Note_Id) {
                                            values.Power_Off = dayjs(values.Power_Off).format('YYYY-MM-DD HH:mm:ss');
                                            values.Power_On = dayjs(values.Power_On).format('YYYY-MM-DD HH:mm:ss');
                                            NoteArrayAction("UPDATE", values, index);
                                            setEditFlag(!editFlag);
                                        } else {

                                            values.Notice_Id = item?.Notice_Id
                                            values.Note_Id = item?.Note_Id
                                            NoteEditAction(values)

                                        }
                                    }}>

                                    {(props) => {

                                        const { setFieldValue, values, submitForm } = props
                                        return (
                                            <Form noValidate >
                                                <Grid container spacing={2} sx={{ alignItems: 'center' }} >
                                                    <Grid xs={0.5} md={0.5}  >
                                                        <Typography variant="body1" fontSize={14} fontWeight={600}> {index + 1} </Typography>
                                                    </Grid>

                                                    <Grid xs={12} md={3} >

                                                        <AutoCompleteSelectMenu
                                                            formik={props}
                                                            label="Feeder Name"
                                                            field="Feeder_Id"
                                                            menuList={feederList}
                                                            valueKey='Feeder_Id'
                                                            labelKey='Feeder_Name'
                                                            unitType={values?.FeederType}
                                                            callBackAction={(value) => {
                                                                const feederTemp = feederList?.find(feeder => feeder?.Feeder_Id === value);
                                                                setFieldValue("FeederType", feederTemp?.Feeder_Type);
                                                            }}
                                                        />
                                                    </Grid>

                                                    <Grid xs={12} md={3} >
                                                        <DateAndTime
                                                            pickerType="datetime"
                                                            required={false}
                                                            formik={props}
                                                            disableFuture={false}
                                                            disablePast
                                                            label='Start'
                                                            field='Power_Off'
                                                            defaultValue={values.Power_Off}
                                                            maxDateTime={dayjs(values?.Power_On)}
                                                            callBackAction={(event) => { setFieldValue("Power_Off", dayjs(event)) }}
                                                        />
                                                    </Grid>

                                                    <Grid xs={12} md={3}>
                                                        <DateAndTime
                                                            pickerType="datetime"
                                                            required={false}
                                                            formik={props}
                                                            label='End'
                                                            field='Power_On'
                                                            defaultValue={values.Power_On}
                                                            disableFuture={false}
                                                            disablePast
                                                            minDateTime={dayjs(values?.Power_Off)}
                                                            callBackAction={(event) => { setFieldValue("Power_On", dayjs(event)) }}
                                                        />
                                                    </Grid>

                                                    <Grid xs={12} md={2.5} >
                                                        <Box sx={{ display: "flex" }}>

                                                            {
                                                                !editLoader ?
                                                                    <Button variant="contained" size='small' onClick={submitForm} sx={{ mx: 1 }} color="success">Save</Button>
                                                                    : <Box sx={{ mx: 1 }}><ButtonLoader /></Box>
                                                            }
                                                            {
                                                                !deleteLoader ?
                                                                    <Button variant="contained" size='small' color="error" sx={{ mx: 1 }}
                                                                        onClick={() => {
                                                                            if (!item?.Note_Id) {
                                                                                NoteArrayAction("REMOVE", {}, index);
                                                                            } else {
                                                                                NoteDeleteAction(item?.Note_Id);
                                                                            }
                                                                        }} > Delete</Button>
                                                                    : <ButtonLoader />
                                                            }
                                                        </Box>
                                                    </Grid>

                                                </Grid>

                                            </Form>
                                        )
                                    }}
                                </Formik>
                        }

                    </Box>
            }

        </Box >
    );
};
export default NoteList;
