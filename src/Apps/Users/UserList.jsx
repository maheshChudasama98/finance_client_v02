import React from 'react';

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from "@mui/material/Typography";

import { fDate } from 'src/utils/format-time';
import { fText } from 'src/utils/format-text';

import { StaffID, ContractorID, SuperAdminID, JuniorEngineerID, } from 'src/constance';

import { CustomAvatar } from 'src/components/CustomComponents';

const ProjectItem = ({ item, isHeader, index }) => {

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
    }

    return (
        <Box sx={{
            py: isHeader ? 1.5 : 0.8,
            borderBottom: isHeader ? '' : (theme) => `dashed 1px ${theme?.palette?.grey?.[400]}`,
            backgroundColor: isHeader ? (theme) => `${theme?.palette?.grey?.[200]}` : ''
        }}>
            <Box sx={{ mx: 2 }}>
                {
                    isHeader ?
                        <Grid container spacing={2} sx={{ alignItems: 'center' }} >
                            <Grid xs={0.6} >
                                <Typography variant="tableHead" color="text.secondary" >#</Typography>
                            </Grid>
                            <Grid xs={4} >
                                <Typography variant="tableHead" color="text.secondary">User Information</Typography>
                            </Grid>

                            <Grid xs={3} >
                                <Typography variant="tableHead" color="text.secondary">Employment Number</Typography>
                            </Grid>
                            <Grid xs={2} >
                                <Typography variant="tableHead" color="text.secondary">User Role</Typography>
                            </Grid>
                            <Grid xs={1.6} >
                                <Typography variant="tableHead" color="text.secondary" >Registration Date</Typography>
                            </Grid>
                        </Grid>
                        :
                        <Grid container spacing={2} sx={{ alignItems: 'center' }} >
                            <Grid xs={0.6}>
                                <Typography variant="normal">
                                    {index + 1}
                                </Typography>
                            </Grid>
                            <Grid xs={4}>
                                <Stack direction="row" alignItems="center" spacing={2} >
                                    <CustomAvatar displayName={item?.User_Avatar} width={45} height={45} iconSize={15} />
                                    <Typography variant="normal">
                                        {fText(`${item?.User_FirstName} ${item?.User_LastName}`)}
                                        <Typography variant="light" color="text.secondary">
                                            {fText(`${item?.User_Email}`)}
                                        </Typography>
                                    </Typography>
                                </Stack>
                            </Grid>

                            <Grid xs={3}>
                                <Typography variant="normal" >
                                    # {item?.User_EmploymentNumber}
                                </Typography>
                            </Grid>

                            <Grid xs={2}>{StatusCheck(item?.UserType_Id)}</Grid>

                            <Grid xs={2}>
                                <Typography variant="normal" >
                                    {fDate(item?.createdAt)}
                                </Typography>
                            </Grid>
                        </Grid>
                }
            </Box>
        </Box>
    );
};
export default ProjectItem;
