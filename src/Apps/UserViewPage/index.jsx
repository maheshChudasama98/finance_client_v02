import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, } from 'react'

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import { fText } from 'src/utils/format-text';
import {  fDateTime12hr } from 'src/utils/format-time';

import { FetchNoticeByUserService } from 'src/Services/Auth.Services';

import { Table } from 'antd';


const Index = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const branch = queryParams.get('branch');
    const [notice, setNotice] = useState([]);

    useEffect(() => {
        dispatch(FetchNoticeByUserService(branch, (res) => {

            const TempArray = res[0]?.Notes?.map((item, index) => (
                {
                    Index: index + 1,
                    PowerOff: fDateTime12hr(item?.Power_Off),
                    PowerOn: fDateTime12hr(item?.Power_On),
                    FeederName: item?.Feeder?.Feeder_Name,
                    FeederGjName: item?.Feeder?.Feeder_GjName,
                    Feeder_Type: item?.Feeder?.Feeder_Type
                }
            ));
            setNotice(TempArray);
        }))
    }, []);

    const columns = [
        // {
        //     title: <Typography variant="light" color="text.secondary">#</Typography>,
        //     render: (text) => <Typography variant="light" >{text}</Typography>,
        //     dataIndex: 'Index',

        // },
        {
            title: <Typography variant="light" color="text.secondary">Feeder Name</Typography>,
            render: (text) => <Typography variant="light" >{fText(text)}</Typography>,
            dataIndex: 'FeederName',
        },
        {
            title: <Typography variant="light" color="text.secondary">Start Date</Typography>,
            render: (text) => <Typography variant="light" >{text}</Typography>,
            dataIndex: 'PowerOff',
        },
        {
            title: <Typography variant="light" color="text.secondary">End Date</Typography>,
            render: (text) => <Typography variant="light" >{text}</Typography>,
            dataIndex: 'PowerOn',
        },
    ];


    const onChange = (pagination, filters, sorter, extra) => {
        console.log();
    };

    return (
        <div>
            {/* {
                notice && notice?.length > 0 && notice?.map((item, index) => (
                    <Box sx={{ mt: 1 }}>
                        <Container>
                            {
                                item?.Notes?.length > 0 && item?.Notes?.map((note, key) => {
                                    const offDate = getFormattedTimeInGujarati(note?.Power_Off);
                                    const onDate = getFormattedTimeInGujarati(note?.Power_On);
                                    return (
                                        <Grid container spacing={3} sx={{ alignItems: 'center' }} >
                                            <Grid xs={12} md={12} >
                                                <Typography variant="big" >
                                                    <Typography variant="span" >
                                                        {note?.Feeder?.Feeder_Name}
                                                    </Typography>
                                                    {` તારીખ ${offDate?.date} ના  ${offDate?.duration}   ${offDate?.time} થી ${onDate?.date} ના ${onDate?.duration} ${onDate?.time} સુધી બંધ રહેશે.`}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    )
                                })
                            }
                            <Typography variant="big" sx={{ mt: 2 }} >
                                <Typography variant='span' fontSize={20} color="error"> Note :- </Typography>
                                {item?.Notice_Desc}
                            </Typography>

                        </Container>
                    </Box>
                )
                )
            } */}
            <Card sx={{ margin: { xs: 0, sm: 2 } }}>
                <CardHeader
                    title="Kuvadva"
                    subheader="National Highway, Kuvadava, Rajkot - 360023"
                />
                <Box sx={{ margin: { xs: 0, sm: 2 } }}>
                    <Table
                        size='small'
                        pagination={false}
                        columns={columns}
                        dataSource={notice}
                        onChange={onChange} />
                </Box>
            </Card>


        </div>
    )
}

export default Index