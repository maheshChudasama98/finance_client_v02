
import React from 'react'

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from "@mui/material/Typography";
import CardHeader from '@mui/material/CardHeader';

import { TimeDurationList } from 'src/constance';

import SvgColor from 'src/components/svg-color';
import { CustomSelect } from 'src/components/CustomComponents';

import AppCurrentVisits from './app-current-visits';
import AppWebsiteVisits from './app-website-visits';
import AppConversionRates from './app-conversion-rates';
import { topTen, singleData, AccountFlowData, dataFollIncrement, } from './data';

export default function Index() {

    const InfoBox = ({ title = "Total", amount = "10,000 " }) => {
        console.log(title, amount);
        return (
            <Card>
                <CardHeader
                    sx={{ pt: 1.5 }}
                    title={
                        <Typography
                            variant="body"
                            fontWeight={600}
                            fontSize={12}
                            color="text.secondary"
                        >
                            {title}
                        </Typography>
                    }
                    subheader={
                        <Typography
                            variant="h3"
                        >
                            {amount}
                        </Typography>
                    }
                />
                <Box sx={{ px: 3, pb: 2, }}>
                    <Typography
                        variant="light"
                        sx={{
                            display: "flex",
                            textAlign: "center",
                            alignItems: "center",
                        }}>

                        <Box sx={{
                            px: 0.4,
                            py: 0.2,
                            pr: 0.6,
                            borderRadius: 0.9,
                            display: "flex",
                            textAlign: "center",
                            alignItems: "center",
                            backgroundColor: "warning.lighter",
                        }}
                        >
                            <SvgColor
                                sx={{
                                    width: 19,
                                    height: 19,
                                    color: "warning.dark"
                                }}
                                src="/assets/icons/general/ic_arrow_down.svg"
                            />
                            &nbsp;
                            <b>+2.6%</b>
                        </Box>  &nbsp; &nbsp;

                        <Typography
                            variant="light"
                            color="text.secondary"
                            sx={{
                                display: "flex",
                                textAlign: "center",
                                alignItems: "center"
                            }}
                        >
                            Than last year
                        </Typography>

                    </Typography>
                </Box>
            </Card>
        )
    };

    return (

        <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>

            <Box sx={{}}>

                <Box sx={{ justifyContent: "space-between", display: "flex", }}>

                    <Typography variant="h4" sx={{ ml: 2 }} color="text.secondary">
                        Hi, Welcome back 👋
                    </Typography>

                    <CustomSelect
                        label=''
                        field=''
                        valueKey='key'
                        labelKey='value'
                        size="small"
                        sx={{ width: 150 }}
                        defaultValue={{ key: "2024", value: 2024 }}
                        menuList={
                            [
                                { key: "2024", value: 2024 },
                                { key: "2025", value: 2025 },
                                { key: "2026", value: 2026 },
                            ]}
                    />
                </Box>

                <Grid container spacing={2} >

                    <Grid item xs={12} md={3}>
                        <InfoBox title='Total Income' amount='18,765' />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <InfoBox title='Total Expense' amount='4,876' />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <InfoBox title='Total Investment' amount='678' />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <InfoBox title='Total Saving' />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <AppCurrentVisits
                            title="Top 5 Categories "
                            type='radialBar'
                            chart={{
                                series: topTen?.map((item, key) => ({ label: item?.CategoryName, value: item?.totalIn, }))
                            }}
                        />
                    </Grid>


                    <Grid item xs={12} md={9}>
                        <AppWebsiteVisits
                            title="Website Visits"
                            subheader={
                                <Box sx={{ justifyContent: "space-between", display: "flex" }}>
                                    (+43%) than last year
                                    <CustomSelect
                                        label=''
                                        field=''
                                        valueKey='key'
                                        labelKey='value'
                                        size="small"
                                        sx={{ width: 120 }}
                                        menuList={TimeDurationList}
                                    />
                                </Box>
                            }
                            chart={{
                                labels: dataFollIncrement?.map((item, key) => item?.duration),
                                series: [
                                    {
                                        name: 'Team A',
                                        type: 'column',
                                        fill: 'solid',
                                        color: "#00A76F",
                                        data: dataFollIncrement?.map((item, key) => item?.totalIn),
                                    },

                                ],
                            }}
                        />
                    </Grid>





                    <Grid item xs={12} md={6}>
                        <AppWebsiteVisits
                            title="Website Visits"
                            subheader={
                                <Box sx={{ justifyContent: "space-between", display: "flex", }}>
                                    (+43%) than last year
                                    <CustomSelect
                                        label=''
                                        field=''
                                        valueKey='key'
                                        labelKey='value'
                                        size="small"
                                        sx={{ width: 120, }}
                                        menuList={TimeDurationList}
                                    />
                                </Box>
                            }
                            chart={{
                                labels: AccountFlowData?.map((item, key) => item?.Date),
                                series: [
                                    {
                                        name: 'In',
                                        type: 'line',
                                        fill: 'solid',
                                        color: "green",
                                        data: AccountFlowData?.map((item, key) => item?.Count),
                                    },
                                    // {
                                    //     name: 'Out',
                                    //     type: 'area',
                                    //     fill: 'gradient',
                                    //     data: AccountFlowData?.map((item, key) => item?.totalOut),
                                    // }
                                ],
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <AppWebsiteVisits
                            title="Website Visits"
                            subheader={
                                <Box sx={{ justifyContent: "space-between", display: "flex", }}>
                                    (+43%) than last year
                                    <CustomSelect
                                        label=''
                                        field=''
                                        valueKey='key'
                                        labelKey='value'
                                        size="small"
                                        sx={{ width: 120, }}
                                        menuList={TimeDurationList}
                                    />
                                </Box>
                            }
                            chart={{
                                labels: singleData?.map((item, key) => item?.duration),
                                series: [
                                    {
                                        name: 'In',
                                        type: 'line',
                                        fill: 'solid',
                                        color: "green",
                                        data: singleData?.map((item, key) => item?.totalIn),
                                    },
                                    {
                                        name: 'Out',
                                        type: 'area',
                                        fill: 'gradient',
                                        data: singleData?.map((item, key) => item?.totalOut),
                                    }
                                ],
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <AppWebsiteVisits
                            title="Website Visits"
                            subheader={
                                <Box sx={{ justifyContent: "space-between", display: "flex", }}>
                                    (+43%) than last year
                                    <CustomSelect
                                        label=''
                                        field=''
                                        valueKey='key'
                                        labelKey='value'
                                        size="small"
                                        sx={{ width: 120, }}
                                        menuList={TimeDurationList}
                                    />
                                </Box>
                            }
                            chart={{
                                labels: dataFollIncrement?.map((item, key) => item?.duration),
                                series: [
                                    {
                                        name: 'Team A',
                                        type: 'line',
                                        fill: 'solid',
                                        data: dataFollIncrement?.map((item, key) => item?.totalIn),
                                    },
                                    {
                                        name: 'Team B',
                                        type: 'area',
                                        fill: 'gradient',
                                        data: dataFollIncrement?.map((item, key) => item?.totalOut),
                                    }
                                ],
                            }}
                        />
                    </Grid>



                    <Grid item xs={12} md={6}>
                        <AppCurrentVisits
                            title="Current Visits"
                            type='radialBar'
                            chart={{
                                series: [
                                    { label: 'America', value: 10, },
                                    { label: 'Asia', value: 30 },
                                    { label: 'Europe', value: 40 },
                                    { label: 'Africa', value: 20 },
                                ],
                            }}
                        />
                    </Grid>


                    <Grid item xs={12} md={3}>
                        <AppCurrentVisits
                            title="Current Visits"
                            type='radialBar'
                            chart={{
                                series: [
                                    { label: 'America', value: 10, },
                                    { label: 'Asia', value: 30 },
                                    { label: 'Europe', value: 60 },
                                    { label: 'Africa', value: 20 },
                                    { label: 'Africa', value: 20 },
                                ],
                            }}
                        />
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <AppConversionRates
                            title="Conversion Rates"
                            subheader="(+43%) than last year"
                            chart={{
                                series: topTen?.map((item, key) => ({ label: item?.CategoryName, value: item?.totalIn, })),
                            }}
                        />

                    </Grid>


                    <Grid item xs={12} md={6}>
                        <AppWebsiteVisits
                            title="Website Visits"
                            subheader={
                                <Box sx={{ justifyContent: "space-between", display: "flex" }}>
                                    (+43%) than last year
                                    <CustomSelect
                                        label=''
                                        field=''
                                        valueKey='key'
                                        labelKey='value'
                                        size="small"
                                        sx={{ width: 120 }}
                                        menuList={TimeDurationList}
                                    />
                                </Box>
                            }
                            chart={{
                                labels: dataFollIncrement?.map((item, key) => item?.duration),
                                series: [
                                    {
                                        name: 'Team A',
                                        type: 'column',
                                        fill: 'solid',
                                        color: "#00A76F",
                                        data: dataFollIncrement?.map((item, key) => item?.totalIn),
                                    },
                                    {
                                        name: 'Team B',
                                        type: 'column',
                                        fill: 'solid',
                                        color: "#FFAB00",
                                        data: dataFollIncrement?.map((item, key) => item?.totalOut),
                                    },
                                    {
                                        name: 'Team C',
                                        type: 'column',
                                        fill: 'solid',
                                        color: "#00B8D9",
                                        data: dataFollIncrement?.map((item, key) => item?.totalOut),
                                    }
                                ],
                            }}
                        />

                    </Grid>

                </Grid>
            </Box>
        </Box>

    );
};

Index.propTypes = {
};