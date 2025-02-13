import React from 'react';

import Box from "@mui/material/Box";
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from "@mui/material/Typography";
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { fText } from 'src/utils/format-text';
import { fDate } from 'src/utils/format-time';

import SvgColor from 'src/components/svg-color';

import { Dropdown } from 'antd';

const VillageList = ({ item, isHeader, editAction, deleteAction, index }) => (
    <Box sx={{
        py: isHeader ? 1.5 : 0.8,
        borderBottom: isHeader ? '' : (theme) => `dashed 1px ${theme?.palette?.grey?.[400]}`,
        backgroundColor: isHeader ? (theme) => `${theme?.palette?.grey?.[200]}` : ''
    }}>
        <Box sx={{ mx: 2, }}>
            {
                isHeader ?
                    <Grid container spacing={2} sx={{ alignItems: 'center' }} >
                        <Grid xs={0.6} >
                            <Typography variant="tableHead" color="text.secondary" >#</Typography>
                        </Grid>

                        <Grid xs={4} >
                            <Typography variant="tableHead" color="text.secondary" > Village English Name</Typography>
                        </Grid>

                        <Grid xs={4} >
                            <Typography variant="tableHead" color="text.secondary" >Village Gujarati Name</Typography>
                        </Grid>

                        <Grid xs={2.4}>
                            <Typography variant="tableHead" color="text.secondary" >Create Date</Typography>
                        </Grid>

                        <Grid xs={1}>
                            <Typography variant="tableHead" color="text.secondary"  >Action</Typography>
                        </Grid>
                    </Grid>
                    :
                    <Grid container spacing={2} sx={{ alignItems: 'center' }} >
                        <Grid xs={0.6} >
                            <Typography variant="normal">
                                {index + 1}
                            </Typography>
                        </Grid>

                        <Grid xs={4} >
                            <Typography variant="normal">
                                {fText(item?.Village_EnName)}
                            </Typography>
                        </Grid>

                        <Grid xs={4}>
                            <Typography variant="normal">
                                {fText(item?.Village_GjName)}
                            </Typography>
                        </Grid>

                        <Grid xs={2.4}>
                            <Typography variant="normal">
                                {fDate(item?.createdAt)}
                            </Typography>
                        </Grid>

                        <Grid xs={1}>
                            <Dropdown
                                trigger={['click']}
                                menu={{
                                    items: [{
                                        label: (
                                            <Typography variant="normal" onClick={() => editAction(item)} >
                                                <Box display="flex" alignItems="center" >
                                                    <SvgColor src="/assets/icons/general/pen.svg" sx={{ width: 25, height: 25, mr: 2 }} />
                                                    Edit
                                                </Box>
                                            </Typography>
                                        ),
                                    },
                                    {
                                        label: (
                                            <Typography variant="normal" color="error" onClick={() => { deleteAction(item) }}>
                                                <Box display="flex" alignItems="center" justifyContent="center">
                                                    <SvgColor src="/assets/icons/general/trash.svg" sx={{ width: 25, height: 25, mr: 2 }} />
                                                    Delete
                                                </Box>
                                            </Typography>
                                        ),
                                    }],
                                }}
                                placement="bottomRight"
                                arrow={{
                                    // pointAtCenter: true,
                                }}>
                                <IconButton size="small" >
                                    <MoreVertIcon fontSize="small" />
                                </IconButton>
                            </Dropdown>
                        </Grid>
                    </Grid>
            }
        </Box>
    </Box >
);
export default VillageList;
