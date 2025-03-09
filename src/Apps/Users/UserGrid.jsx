import React from 'react';

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from "@mui/material/Typography";
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { fDate } from 'src/utils/format-time';
import { fText, } from 'src/utils/format-text';

import { StaffID, ContractorID, SuperAdminID, JuniorEngineerID, } from 'src/constance';

import SvgColor from 'src/components/svg-color';
import { CustomAvatar, } from 'src/components/CustomComponents';

import { Dropdown } from 'antd';


const ProjectItem = ({ item, editAction, deleteAction, }) => {

    const RoleAs = (status) => {
        switch (status) {
            case StaffID:
                return <Chip
                    size="small"
                    sx={{
                        color: "#fff",
                        backgroundColor: (theme) => `${theme?.palette?.Staff}`
                    }} label="Staff" />;
            case ContractorID:
                return <Chip
                    size="small"
                    sx={{
                        color: "#fff",
                        backgroundColor: (theme) => `${theme?.palette?.Contractor}`
                    }} label="Contractor" />;
            case JuniorEngineerID:
                return <Chip
                    size="small"
                    sx={{
                        color: "#fff",
                        backgroundColor: (theme) => `${theme?.palette?.JuniorEngineer}`
                    }} label="Junior Engineer" />
            case SuperAdminID:
                return <Chip
                    size="small"
                    sx={{
                        color: "#fff",
                        backgroundColor: (theme) => `${theme?.palette?.SuperAdmin}`
                    }} label="SuperAdmin" />
            default:
                break
        }
    }
    return (
        <Card sx={{
            border: (theme) => `solid 1px ${theme?.palette?.grey?.[400]}`,
            borderColor: (theme) => `${theme?.palette?.grey?.[200]}`,
            borderRadius: 1,
            my: 1,
        }}>
            <Box sx={{ width: "100%", px: 1, py: 1.5 }}>
                <Grid container spacing={1.5} sx={{}} >
                    <Grid xs={10.5}>
                        <Stack direction="row" alignItems="center" spacing={2} >
                            <CustomAvatar

                                displayName={item?.User_Avatar}
                                width={45} height={45} iconSize={15}
                              />

                            <Typography variant="big">
                                {fText(`${item?.User_FirstName} ${item?.User_LastName}`)}
                                <Typography variant="light" color="text.secondary"
                                    sx={{
                                        whiteSpace: 'nowrap',        // Prevent line break
                                        overflow: 'hidden',          // Hide overflowing text
                                        textOverflow: 'ellipsis',
                                        maxWidth: '200px',
                                    }}>
                                    {fText(`${item?.User_Email}`)}
                                </Typography>
                                {/* {
                                    item?.User_EmploymentNumber &&
                                    <Typography variant="light" color="text.secondary">
                                        # {item?.User_EmploymentNumber}
                                    </Typography>
                                } */}
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid xs={1.5} sx={{ display: "none", textAlign: "end", pointerEvents: "auto" }} >

                        <Dropdown
                            trigger={['click']}
                            menu={{
                                items: [{
                                    label: (
                                        <Typography variant="body1" fontSize={16} onClick={() => editAction(item)} >
                                            <Box display="flex" alignItems="center" >
                                                <SvgColor src="/assets/icons/general/pen.svg" sx={{ width: 25, height: 25, mr: 2 }} />
                                                Edit
                                            </Box>
                                        </Typography>
                                    ),
                                },
                                {
                                    label: (
                                        <Typography variant="body1" fontSize={16} color="error" onClick={() => { deleteAction(item) }}>
                                            <Box display="flex" alignItems="center" justifyContent="center">
                                                <SvgColor src="/assets/icons/general/trash.svg" sx={{ width: 25, height: 25, mr: 2 }} />
                                                Delete
                                            </Box>
                                        </Typography>
                                    ),
                                }],
                            }}
                            placement="bottomRight"

                        >

                            <MoreVertIcon fontSize="small" />

                        </Dropdown>

                    </Grid>


                    <Grid xs={6} sx={{ pl: 2 }}>
                        <Typography variant="normal" fontWeight={700} color="text.secondary">Employment Number </Typography>
                    </Grid>
                    <Grid xs={6}>
                        <Typography variant="light" fontWeight={500}># {item?.User_EmploymentNumber}</Typography>
                    </Grid>

                    <Grid xs={6} sx={{ pl: 2 }}>
                        <Typography variant="normal" fontWeight={700} color="text.secondary">Registration Date</Typography>
                    </Grid>
                    <Grid xs={6} >
                        <Typography variant="light" fontWeight={500}> {fDate(item?.createdAt)} </Typography>
                    </Grid>

                    <Grid xs={6} sx={{ pl: 2 }}>
                        <Typography variant="normal" fontWeight={700} color="text.secondary">Role</Typography>
                    </Grid>
                    <Grid xs={6}>
                        {RoleAs(item?.UserType_Id)}
                    </Grid>



                </Grid>
            </Box>
        </Card >
    );
};
export default ProjectItem;
