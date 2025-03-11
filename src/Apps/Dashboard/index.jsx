
import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from "@mui/material/Typography";

import { calculatePercentageChange } from 'src/utils/utils';

import { DurationList, TimeDurationList } from 'src/constance';
import { AccountService, DataFollService, FinanceYearService, } from 'src/Services/AnalystData.Services';

import { CustomSelect } from 'src/components/CustomComponents';

import InfoBox from "./InfoBox";
import OverView from './OverView';
import { topTen } from '../Consumer/data';
import AppCurrentVisits from './app-current-visits';


export default function Index() {
    const dispatch = useDispatch();
    const [currentYearBaseLoader, setCurrentYearBaseLoader] = useState(true);
    const [currentYearBaseData, setCurrentYearBaseData] = useState({});
    const [lastYearBaseData, setLastYearBaseData] = useState({});
    const [currentYearMonthBaseData, setCurrentYearMonthBaseData] = useState([]);

    const [dataFlowTimeDuration, setDataFlowTimeDuration] = useState("Daily");
    const [dataFlowIncrement, setDataFlowIncrement] = useState([]);

    const [cashFlowData, setCashFlowData] = useState([]);
    const [cashFlowDuration, setCashFlowDuration] = useState("Last_Thirty_Days");

    useEffect(() => {
        setCurrentYearBaseLoader(true);
        dispatch(FinanceYearService({}, res => {
            setCurrentYearBaseLoader(false);
            if (res.status) {
                setCurrentYearBaseData(res?.data?.currentYear || {});
                setLastYearBaseData(res?.data?.lastYear || {});
                setCurrentYearMonthBaseData(res?.data?.monthBase || []);
            };
        }));
    }, []);

    useEffect(() => {
        dispatch(DataFollService({ TimeDuration: dataFlowTimeDuration, }, res => {
            if (res.status) {
                setDataFlowIncrement(res?.data?.increment);
                // setDataFlowList(res?.data?.list);
            };
        }));
    }, [dataFlowTimeDuration]);

    useEffect(() => {
        dispatch(AccountService({
            Duration: cashFlowDuration,
            // AccountId: 1,
        }, res => {
            if (res.status) {
                setCashFlowData(res?.data?.graphList)
            };
        }));
    }, [cashFlowDuration]);

    return (
        <Box
            sx={{
                paddingX: { xs: 0, sm: 2 },
            }}
        >
            <Box
                sx={{
                    justifyContent: "space-between",
                    display: "flex",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{ ml: 2 }}
                    color="text.secondary"
                >
                    Hi, Welcome back 👋
                </Typography>
            </Box>

            <Box
                sx={{
                    marginTop: 3,
                }}
            >
                <Grid container spacing={2} >
                    <Grid item xs={12} md={3}>
                        <InfoBox
                            title='Total Income'
                            amount={currentYearBaseData?.totalIn || 0}
                            previousValue={calculatePercentageChange(currentYearBaseData?.totalIn, lastYearBaseData?.totalIn) || 0}
                            loader={currentYearBaseLoader}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <InfoBox
                            title='Total Expense'
                            amount={currentYearBaseData?.totalOut || 0}
                            previousValue={calculatePercentageChange(currentYearBaseData?.totalOut, lastYearBaseData?.totalOut) || 0}
                            loader={currentYearBaseLoader}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <InfoBox
                            title='Total Investment'
                            amount={currentYearBaseData?.totalInvestment || 0}
                            previousValue={calculatePercentageChange(currentYearBaseData?.totalInvestment, lastYearBaseData?.totalInvestment) || 0}
                            loader={currentYearBaseLoader}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <InfoBox
                            title='Total Credit'
                            amount={currentYearBaseData?.totalDebit || 0}
                            previousValue={calculatePercentageChange(currentYearBaseData?.totalDebit, lastYearBaseData?.totalDebit) || 0}
                            loader={currentYearBaseLoader}
                        />
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <OverView
                            title="Over View"
                            chart={{
                                labels: currentYearMonthBaseData?.length > 0 ? currentYearMonthBaseData?.map((item, key) => item?.monthName) : [],
                                series: [
                                    {
                                        name: 'Income',
                                        type: 'column',
                                        fill: 'solid',
                                        color: "#00A76F",
                                        data: currentYearMonthBaseData?.length > 0 ? currentYearMonthBaseData?.map((item, key) => item?.totalIn || 0) : [],
                                    },
                                    {
                                        name: 'Expense',
                                        type: 'column',
                                        fill: 'solid',
                                        data: currentYearMonthBaseData?.length > 0 ? currentYearMonthBaseData?.map((item, key) => item?.totalOut || 0) : [],
                                    },
                                    {
                                        name: 'Investment',
                                        type: 'column',
                                        fill: 'solid',
                                        data: currentYearMonthBaseData?.length > 0 ? currentYearMonthBaseData?.map((item, key) => item?.totalInvestment || 0) : [],
                                    },
                                ],
                            }}
                        />
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
                        <OverView
                            title={
                                <Box
                                    sx={{
                                        justifyContent: "space-between",
                                        display: "flex",
                                    }}
                                >
                                    Data Flow
                                    <CustomSelect
                                        valueKey='Key'
                                        labelKey='Value'
                                        size="small"
                                        sx={{ width: 120, }}
                                        menuList={TimeDurationList}
                                        defaultValue={dataFlowTimeDuration}
                                        callBackAction={(value) => setDataFlowTimeDuration(value)}
                                    />
                                </Box>
                            }
                            chart={{
                                labels: dataFlowIncrement?.length > 0 ? dataFlowIncrement?.map((item, key) => item?.duration) : [],
                                series: [
                                    {
                                        name: 'Income',
                                        type: 'area',
                                        fill: 'gradient',
                                        color: "#00A76F",
                                        data: dataFlowIncrement?.length > 0 ? dataFlowIncrement?.map((item, key) => item?.totalIn || 0) : [],
                                    },
                                    {
                                        name: 'Expense',
                                        type: 'area',
                                        fill: 'gradient',
                                        data: dataFlowIncrement?.length > 0 ? dataFlowIncrement?.map((item, key) => item?.totalOut || 0) : [],
                                    },
                                ],
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <OverView
                            title={
                                <Box
                                    sx={{
                                        justifyContent: "space-between",
                                        display: "flex",
                                    }}
                                >
                                    Data Flow
                                    <CustomSelect
                                        valueKey='Value'
                                        labelKey='Key'
                                        size="small"
                                        sx={{ width: 200, }}
                                        menuList={DurationList}
                                        defaultValue={cashFlowDuration}
                                        callBackAction={(value) => setCashFlowDuration(value)}
                                    />
                                </Box>
                            }
                            chart={{
                                labels: cashFlowData?.length > 0 ? cashFlowData?.map((item, key) => item?.Date) : [],
                                series: [
                                    {
                                        name: 'Income',
                                        type: 'line',
                                        color: "#00A76F",
                                        data: cashFlowData?.length > 0 ? cashFlowData?.map((item, key) => item?.Count || 0) : [],
                                    },
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