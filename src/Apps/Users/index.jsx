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
import { FetchUserListController } from 'src/Services/User.Services';

import Loader from 'src/components/Loaders/Loader';
import { ModalDialog } from 'src/components/model/index';
import { DataNotFound } from 'src/components/DataNotFound';

import UserList from './UserList';
import UserGrid from './UserGrid';
import FormDetails from './UserForm';

export default function Index() {
    const dispatch = useDispatch();
    const ReduxUserRole = useSelector(state => state.auth.userRole);
    const [displayFlag, setDisplayFlag] = useState(false);
    const [userList, setUserList] = useState([]);
    const [editObject, setEditObject] = useState({});
    const [open, setOpen] = useState(false);
    const [loadingLoader, setLoadingLoader] = React.useState(false);


    const showDisplayAction = () => {
        setDisplayFlag(!displayFlag);
        setEditObject({});
    }

    const FetchUserList = () => {
        setLoadingLoader(true);
        dispatch(FetchUserListController((res) => {
            setLoadingLoader(false);
            setUserList(res);
        }))
    };

    useEffect(() => {
        if (!displayFlag) {
            FetchUserList();
        }
    }, [displayFlag])

    const DeleteAction = () => {
    }

    return (

        <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
            <Card>
                <CardHeader
                    title="Users"
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
                                                userList && userList?.length > 0 ?
                                                    <>
                                                        <Box sx={{
                                                            display: { xs: "none", md: "block", },
                                                            minWidth: '1000px',
                                                            flexWrap: 'wrap'
                                                        }}>
                                                            {
                                                                userList && userList?.length > 0 &&
                                                                <Box sx={{ minWidth: '1000px' }}>
                                                                    <UserList isHeader />
                                                                    {userList?.map((item, key) =>
                                                                    (
                                                                        <UserList
                                                                            key={key}
                                                                            item={item}
                                                                            index={key}
                                                                            editAction={(value) => {
                                                                                setEditObject(value);
                                                                                setDisplayFlag(!displayFlag);
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </Box>
                                                            }
                                                        </Box>
                                                        <Box sx={{
                                                            display: { xs: "block", md: "none", },
                                                            flexWrap: 'wrap'
                                                        }}>

                                                            {userList?.map((item, key) =>
                                                            (
                                                                <UserGrid
                                                                    key={key}
                                                                    item={item}
                                                                    index={key}
                                                                    editAction={(value) => {
                                                                        setEditObject(value);
                                                                        setDisplayFlag(!displayFlag);
                                                                    }}
                                                                />
                                                            ))}
                                                        </Box>

                                                    </> :
                                                    <DataNotFound />
                                            }
                                        </Box>
                                }
                            </>
                    }
                </Box>


            </Card >

            <ModalDialog
                title="Delete"
                open={open}
                handleClose={() => { setOpen(false); }}>
                <Box sx={{ minWidth: 500 }}>
                    <Typography variant='big' >Are you sure want to delete?</Typography>

                    <Box sx={{
                        mt: 2,
                        textAlign: "end",
                        justifyContent: "center",
                        display: "flex"
                    }}>
                        <Button onClick={DeleteAction} variant="contained" color="error">
                            Delete
                        </Button>
                        <Button sx={{ marginX: 1 }} onClick={() => { setOpen(false); }} variant="outlined" color="CancelButton">
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