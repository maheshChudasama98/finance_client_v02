import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from "@mui/material/Chip";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { fDate } from 'src/utils/format-time';
import { fText } from 'src/utils/format-text';

import { FetchUserListController } from 'src/Services/User.Services';
import { StaffID, ContractorID, SuperAdminID, JuniorEngineerID, } from 'src/constance';

import { ModalDialog } from 'src/components/model/index';
import { DataNotFound } from 'src/components/DataNotFound';
import { CustomTable, CustomAvatar } from 'src/components/CustomComponents';

import BranchForm from './BranchForm';


export default function Index() {
    const dispatch = useDispatch();
    const ReduxUserRole = useSelector(state => state.auth.userRole);
    const [displayFlag, setDisplayFlag] = useState(false);
    const [userList, setUserList] = useState([]);
    const [editObject, setEditObject] = useState({});
    const [open, setOpen] = useState(false);

    const showDisplayAction = () => {
        setDisplayFlag(!displayFlag);
        setEditObject({});
    }

    const FetchUserList = () => {
        dispatch(FetchUserListController((res) => {
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

    const StatusCheck = (status) => {
        switch (status) {
            case StaffID:
                return <Chip sx={{
                    color: "#fff",
                    backgroundColor: (theme) => `${theme?.palette?.Staff}`
                }} label="Staff" />;
            case ContractorID:
                return <Chip
                    sx={{
                        color: "#fff",
                        backgroundColor: (theme) => `${theme?.palette?.Contractor}`
                    }} label="Contractor" />;
            case JuniorEngineerID:
                return <Chip
                    sx={{
                        color: "#fff",
                        backgroundColor: (theme) => `${theme?.palette?.JuniorEngineer}`
                    }} label="Junior Engineer" />
            case SuperAdminID:
                return <Chip
                    sx={{
                        color: "#fff",
                        backgroundColor: (theme) => `${theme?.palette?.SuperAdmin}`
                    }} label="SuperAdmin" />
            default:
                break
        }
    };

    const columns = [
        { Header: '#', keyLabel: "index", xs: 0.6, },
        { Header: 'Branch Name', keyLabel: "User_Avatar", xs: 4, },
        { Header: 'Branch Address', keyLabel: "User_EmploymentNumber", xs: 3 },
        { Header: 'Registration Date', keyLabel: "createdAt", xs: 3 },
        { Header: 'Action', keyLabel: "action", xs: 1 },
    ];

    const tableSetData = userList.map((item, index) => ({
        index: <Typography variant="normal"> {index + 1}</Typography>,
        User_Avatar: <Stack direction="row" alignItems="center" spacing={2} >
            <CustomAvatar displayName={item?.User_Avatar} width={45} height={45} iconSize={15}/>
            <Typography variant="normal">
                {fText(`${item?.User_FirstName} ${item?.User_LastName}`)}
                <Typography variant="light" color="text.secondary">
                    {fText(`${item?.User_Email}`)}
                </Typography>
            </Typography>
        </Stack>,
        User_EmploymentNumber:
            <Typography variant="normal" >
                # {item?.User_EmploymentNumber}
            </Typography>,
        UserType_Id: StatusCheck(item?.UserType_Id),
        createdAt: <Typography variant="normal" > {fDate(item?.createdAt)}</Typography>,
        action: <Typography variant="normal" >-</Typography>,
        child: <Stack direction="row" alignItems="center" spacing={2} >
            <CustomAvatar displayName={item?.User_Avatar} width={45} height={45} iconSize={15}/>
            <Typography variant="normal">
                {fText(`${item?.User_FirstName} ${item?.User_LastName}`)}
                <Typography variant="light" color="text.secondary">
                    {fText(`${item?.User_Email}`)}
                </Typography>
            </Typography>
        </Stack>,
    }));

    return (

        <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
            <Card>

                <CardHeader
                    title="Branches"
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
                            <BranchForm backAction={showDisplayAction} editObject={editObject} /> :
                            <Box sx={{
                                marginTop: 1.5,
                                overflowY: 'hidden',
                                overflowX: 'auto',
                            }}>
                                {
                                    userList && userList?.length > 0 ?
                                        <Box sx={{ minWidth: '1040px' }}>
                                            <CustomTable
                                                expanded
                                                columns={columns}
                                                data={tableSetData}
                                            />
                                        </Box>
                                        : <DataNotFound />
                                }
                            </Box>
                    }
                </Box>


            </Card >

            <ModalDialog
                title="Delete"
                open={open}
                handleClose={() => { setOpen(false); }}>
                <Box sx={{ minWidth: 500, }}>

                    <Typography variant='h5' fontWeight={100} >Are you sure want to delete?</Typography>

                    <Box sx={{ mt: 2, textAlign: "end" }}>
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