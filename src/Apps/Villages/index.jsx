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
import { RemoveVillageService, FetchVillageListService, } from 'src/Services/Villages.Services';

import Loader from 'src/components/Loaders/Loader';
import { ModalDialog } from 'src/components/model/index';
import { DataNotFound } from 'src/components/DataNotFound';

import FormDetails from './VillageForm';
import VillageList from './VillageList';

export default function Index() {
    const dispatch = useDispatch();
    const [displayFlag, setDisplayFlag] = useState(false);
    const [loadingLoader, setLoadingLoader] = React.useState(false);
    const [feederList, setFeederList] = useState([]);

    const ReduxUserRole = useSelector(state => state.auth.userRole);

    const [editObject, setEditObject] = useState({});
    const [deleteObject, setDeleteObject] = useState({});

    const [open, setOpen] = useState(false);

    const showDisplayAction = () => {
        setDisplayFlag(!displayFlag);
        setEditObject({});
    }

    useEffect(() => {
        if (!displayFlag) {
            const payLoad = {
                Page: 1,
                PageSize: 30,
            }

            setLoadingLoader(true);
            dispatch(FetchVillageListService(payLoad, (res) => {
                setFeederList(res);
                setLoadingLoader(false);
            }))
        }
    }, [displayFlag,]);

    const DeleteAction = () => {

        dispatch(RemoveVillageService({ Village_Id: deleteObject?.Village_Id, }, () => {
            setOpen(false);
            const payLoad = {
                Page: 1,
                PageSize: 30,
            }
            dispatch(FetchVillageListService(payLoad, (res) => {
                setFeederList(res);
            }))
        }))
    }

    return (

        <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
            <Card>
                <CardHeader
                    title="Villages"
                    // subheader=""
                    action={
                        ReduxUserRole !== ContractorID &&
                        <Button
                            onClick={showDisplayAction}
                            variant="contained"
                            color="success"
                            startIcon={!displayFlag ? <AddIcon /> : <ArrowBackIcon />} >
                            {
                                !displayFlag ? "Add New" : "Back"
                            }
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
                            <FormDetails backAction={showDisplayAction} editObject={editObject} /> :
                            <>

                                {
                                    loadingLoader ?
                                        <Box sx={{ display: "flex", height: "50vh" }}>
                                            <Loader />
                                        </Box> :
                                        <Box sx={{
                                            marginTop: 1.5,
                                            overflowY: 'hidden',  
                                            overflowX: 'auto',
                                        }}>


                                            {
                                                feederList && feederList?.length > 0 ?
                                                    <Box sx={{
                                                        // display: { xs: "none", md: "block", },
                                                        minWidth: '1000px',
                                                        flexWrap: 'wrap',
                                                    }}>

                                                        <VillageList isHeader />
                                                        {feederList?.map((item, key) =>
                                                        (
                                                            <VillageList
                                                                key={key}
                                                                index={key}
                                                                item={item}
                                                                feederList={feederList}
                                                                editAction={(value) => {
                                                                    setEditObject(value);
                                                                    setDisplayFlag(!displayFlag);
                                                                }}
                                                                deleteAction={(value) => {
                                                                    setOpen(true);
                                                                    setDeleteObject(value);
                                                                }} />
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
