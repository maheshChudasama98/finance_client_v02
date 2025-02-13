import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { ContractorID } from 'src/constance';
import { FetchFeederListService } from 'src/Services/General.Services';
import { FetchNoticeService, RemoveNoticeController } from 'src/Services/Notice.Services';

import Loader from 'src/components/Loaders/Loader';
import { ModalDialog } from 'src/components/model/index';
import { DataNotFound } from 'src/components/DataNotFound';

import NoticeList from './NoticeList';
import FormDetails from './NoticesForm';

export default function Index() {
    const dispatch = useDispatch();
    const [displayFlag, setDisplayFlag] = useState(false);
    const [loadingLoader, setLoadingLoader] = React.useState(false);
    const ReduxUserRole = useSelector(state => state.auth.userRole);
    const [noticesList, setNoticesList] = useState([]);
    const [feederList, setFeederList] = useState([]);

    const [editObject, setEditObject] = useState({});
    const [deleteObject, setDeleteObject] = useState({});

    const [open, setOpen] = useState(false);

    const showDisplayAction = () => {
        setDisplayFlag(!displayFlag);
        setEditObject({});
    }

    useEffect(() => {
        dispatch(FetchFeederListService((res) => {
            setFeederList(res);
        }))
    }, [])

    useEffect(() => {
        if (!displayFlag) {
            const payLoad = { Page: 1, PageSize: 30, }
            setLoadingLoader(true);
            dispatch(FetchNoticeService(payLoad, (res) => {
                setNoticesList(res);
                setLoadingLoader(false);
            }))
        }
    }, [displayFlag]);


    const DeleteAction = () => {

        dispatch(RemoveNoticeController({ NoticeId: deleteObject?.Notice_Id, }, () => {
            setOpen(false);
            const payLoad = {
                Page: 1,
                PageSize: 30,
            }
            dispatch(FetchNoticeService(payLoad, (res) => {
                setNoticesList(res);
            }))
        }))

    }




    return (

        <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
            <Card>
                <CardHeader
                    title="Notices"
                    subheader="User can check feeder details"
                    action={
                        ReduxUserRole !== ContractorID &&
                        <Button
                            onClick={showDisplayAction}
                            variant="contained"
                            color="success"
                            startIcon={!displayFlag ? <AddIcon /> : <ArrowBackIcon />} >
                            {!displayFlag ? "Add New" : "Back"}
                        </Button>
                    }
                />

                <Box sx={{
                    borderRadius: 1.3,
                    paddingY: 2,
                    paddingX: 2,
                }}>
                    {
                        displayFlag ?
                            <FormDetails
                                noteList
                                feederList={feederList}
                                backAction={showDisplayAction}
                                editObject={editObject} /> :
                            <>
                                {
                                    loadingLoader ?
                                        <Box sx={{ display: "flex", height: "50vh" }}>
                                            <Loader />
                                        </Box> :

                                        <Box sx={{
                                            marginTop: 1.5,
                                            overflow: 'auto',
                                        }}>

                                            {
                                                noticesList && noticesList?.length > 0 ?
                                                    <Box sx={{
                                                        minWidth: '1000px',
                                                        flexWrap: 'wrap'
                                                    }}>

                                                        <NoticeList isHeader />
                                                        {noticesList?.map((item, key) =>
                                                        (
                                                            <NoticeList
                                                                key={key}
                                                                item={item}
                                                                arrayList={noticesList}
                                                                feederList={feederList}
                                                                editAction={(value) => {
                                                                    setEditObject(value);
                                                                    setDisplayFlag(!displayFlag);
                                                                }}
                                                                deleteAction={(value) => {
                                                                    setOpen(true);
                                                                    setDeleteObject(value);
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                    :
                                                    <DataNotFound />}

                                        </Box>
                                }
                            </>
                    }
                </Box>
            </Card >

            <ModalDialog
                title="Delete"
                open={open}
                handleClose={() => { setOpen(false); setDeleteObject({}) }}>
                <Box sx={{ minWidth: { xs: 200, md: 500, } }}>

                    <Typography variant='h5' fontWeight={100} >Are you sure want to delete?</Typography>

                    <Box sx={{ mt: 2, textAlign: "end" }}>
                        <Button onClick={DeleteAction} variant="contained" color="error">
                            Delete
                        </Button>
                        <Button sx={{ marginX: 1 }} onClick={() => { setOpen(false); setDeleteObject({}) }} variant="outlined" color="CancelButton">
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </ModalDialog >
        </Box >

    )
}

Index.propTypes = {
};
