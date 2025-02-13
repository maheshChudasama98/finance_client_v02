import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { FetchNoteService, ModifyNoteService, RemoveNoteService, NoticeModifyService, } from 'src/Services/Notice.Services';

import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { DateAndTime, TextFieldForm, DatePickerCustom, AutoCompleteSelectMenu, } from 'src/components/inputs';

import { Form, Formik, } from 'formik'

import * as Yup from 'yup';

import dayjs from 'dayjs'

import NoteList from './NoteList';


export default function NoticesForm({ feederList, editObject, backAction, noteList }) {
    const dispatch = useDispatch();
    // const [noticeData, setNoticeData] = useState(editObject);
    const [formSubmitLoader, setFormSubmitLoader] = useState(false);
    const [noteArray, setNoteArray] = useState(editObject?.Notes || []);
    const [newAddFlag, setNewAddFlag] = useState(false);

    const [noteSaveLoader, setNoteSaveLoader] = useState(false);
    const [noteEditLoader, setNoteEditLoader] = useState(false);
    const [noteDeleteLoader, setNoteDeleteLoader] = useState(false);

    const NoticeFormSubmit = (values) => {

        setFormSubmitLoader(true);
        values.NoteArray = noteArray

        if (editObject?.Notice_Id) { values.NoticeId = editObject?.Notice_Id }

        dispatch(NoticeModifyService(values, (Response) => {
            setFormSubmitLoader(false);
            backAction()
        }));
    }

    const NoteArrayAction = (type, object, index) => {
        switch (type) {
            case "ADD": setNoteArray((prev) => [...prev, object]);
                break;
            case "UPDATE": setNoteArray((prev) => prev.map((note, i) => (i === index ? object : note)));
                break;
            case "REMOVE": setNoteArray((prev) => prev.filter((_, i) => i !== index));
                break;
            default:
                break;
        }
    }

    const FetchNoteList = () => {
        dispatch(FetchNoteService({ Notice_Id: editObject?.Notice_Id }, (res) => {
            setNoteArray(res);
            setNoteSaveLoader(false);
            setNewAddFlag(false);
            setNoteEditLoader(false);
            setNoteDeleteLoader(false);
        }));
    }
    const NoteEditAction = (values) => {
        setNoteEditLoader((prev) => ({ ...prev, [values?.Note_Id]: true }));
        dispatch(ModifyNoteService(values, (res) => {
            FetchNoteList();
        }))
    }
    const NoteDeleteAction = (noteId) => {
        setNoteDeleteLoader((prev) => ({ ...prev, [noteId]: true }));
        dispatch(RemoveNoteService({ Note_Id: noteId }, (Response) => {
            FetchNoteList();
        }));
    }

    return (
        <>
            {noteList &&
                <Formik
                    enableReinitialize
                    initialValues={{
                        NoticeName: editObject?.Notice_Name || "",
                        NoticeDesc: editObject?.Notice_Desc || "",
                        StartDate: editObject?.Start_Date ? dayjs(editObject?.Start_Date) : null,
                        EndDate: editObject?.End_Date ? dayjs(editObject?.End_Date) : null,
                    }}
                    validationSchema={
                        Yup.object().shape({
                            NoticeName: Yup.string().required("Name is required."),
                            NoticeDesc: Yup.string().required("Description is required."),
                            StartDate: Yup.string().required("Start Date is required."),
                            EndDate: Yup.string().required("End Date is required."),
                        })
                    } onSubmit={NoticeFormSubmit} >

                    {(props) => {
                        const { setFieldValue, handleSubmit, values, dirty, resetForm } = props
                        return (
                            <Form >
                                <Grid container spacing={2} >

                                    <Grid item xs={12} >
                                        <TextFieldForm
                                            formik={props}
                                            label='Name'
                                            field='NoticeName'
                                        />
                                    </Grid>

                                    <Grid xs={12} md={6}   >
                                        <DatePickerCustom
                                            required={false}
                                            formik={props}
                                            label='Start Date'
                                            field='StartDate'
                                            disablePast
                                            disableFuture={false}
                                            maxDate={dayjs(values?.EndDate)}
                                            defaultValue={values.StartDate}
                                            callBackAction={(event) => { setFieldValue("StartDate", dayjs(event)) }}
                                        />
                                    </Grid>

                                    <Grid xs={12} md={6}   >
                                        <DatePickerCustom
                                            required={false}
                                            formik={props}
                                            label='End Date'
                                            field='EndDate'
                                            disablePast
                                            disableFuture={false}
                                            minDate={dayjs(values?.EndDate)}
                                            defaultValue={values.EndDate}
                                            callBackAction={(event) => { setFieldValue("EndDate", dayjs(event)) }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} >
                                        <TextFieldForm
                                            formik={props}
                                            label='Description'
                                            field='NoticeDesc'
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
            }


            <Box>

                <Typography variant="h6" sx={{ mb: 2, px: 1 }}> Feeder Details </Typography>

                {noteArray && noteArray?.length > 0 && <NoteList isHeader />}

                {
                    noteArray && noteArray?.length > 0 && noteArray?.map((item, index) => (
                        <NoteList
                            key={index}
                            index={index}
                            item={item}
                            feederList={feederList}
                            NoteArrayAction={NoteArrayAction}
                            NoteEditAction={NoteEditAction}
                            NoteDeleteAction={NoteDeleteAction}
                            editLoader={noteEditLoader[item?.Note_Id]}
                            deleteLoader={noteDeleteLoader[item?.Note_Id]}
                        />)
                    )
                }

                <Box
                    sx={{
                        border: (theme) => `dashed 1px ${theme?.palette?.grey?.[400]}`,
                        py: 2,
                        px: 1.5,
                        mt: 2,
                        borderRadius: 1.5,
                        alignItems: 'center',
                    }}>

                    {
                        newAddFlag ?

                            <Formik
                                enableReinitialize
                                initialValues={{
                                    Feeder_Id: null,
                                    Power_Off: null,
                                    Power_On: null,
                                    FeederType: null,
                                }}
                                validationSchema={
                                    Yup.object().shape({
                                        Feeder_Id: Yup.string().required('Feeder is required.'),
                                        Power_Off: Yup.string().required('OFF date and time is required.'),
                                        Power_On: Yup.string().required('ON date and time is required.')

                                    })
                                }
                                onSubmit={(values) => {
                                    setNoteSaveLoader(true);
                                    if (!editObject?.Notice_Id) {
                                        values.Power_Off = dayjs(values.Power_Off).format('YYYY-MM-DD HH:mm:ss');
                                        values.Power_On = dayjs(values.Power_On).format('YYYY-MM-DD HH:mm:ss');
                                        NoteArrayAction("ADD", values);
                                        setNewAddFlag(!newAddFlag);
                                        setNoteSaveLoader(false);
                                    } else {
                                        values.Notice_Id = editObject?.Notice_Id
                                        dispatch(ModifyNoteService(values, (res) => {
                                            FetchNoteList();
                                            setNoteSaveLoader(false);
                                        }))
                                    }
                                }}>

                                {(props) => {

                                    const { setFieldValue, values, resetForm, dirty } = props
                                    return (
                                        <Form noValidate >
                                            <Grid container spacing={2} sx={{ alignItems: 'center' }} >

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
                                                            const temp = feederList?.find(feeder => feeder?.Feeder_Id === value);
                                                            setFieldValue("FeederType", temp?.Feeder_Type);
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid xs={12} md={3} >
                                                    <DateAndTime
                                                        pickerType="datetime"
                                                        required={false}
                                                        formik={props}
                                                        label='Start'
                                                        field='Power_Off'
                                                        defaultValue={values.Power_Off}
                                                        disablePast
                                                        disableFuture={false}
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

                                                <Grid xs={12} md={3}>
                                                    <Box sx={{ float: "right", display: "flex" }}>

                                                        {
                                                            !noteSaveLoader ?
                                                                <Button
                                                                    variant="contained"
                                                                    type='submit'
                                                                    color="success"
                                                                >
                                                                    Save
                                                                </Button> :
                                                                <ButtonLoader />
                                                        }


                                                        {
                                                            dirty &&
                                                            <Button
                                                                variant="outlined"
                                                                sx={{ ml: 1 }}
                                                                disabled={!dirty}
                                                                onClick={() => { resetForm(); }}
                                                                color="CancelButton"> Cancel </Button>
                                                        }
                                                    </Box>
                                                </Grid>
                                            </Grid>

                                        </Form>
                                    )
                                }}
                            </Formik>
                            :
                            <Box sx={{
                                display: "flex",
                                alignItems: 'center',
                                justifyContent: "space-between"
                            }}>
                                <Typography variant="body" fontSize={16}> Add new feeder here </Typography>
                                <Button variant="contained" type='button' onClick={() => setNewAddFlag(!newAddFlag)} color="success">Add</Button>
                            </Box>
                    }

                </Box>



            </Box>
        </>
    )
}