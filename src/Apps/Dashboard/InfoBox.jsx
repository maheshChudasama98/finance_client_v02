import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from "@mui/material/Typography";
import CardHeader from '@mui/material/CardHeader';

import SvgColor from 'src/components/svg-color';

import { Skeleton } from 'antd';


export default function InfoBox({ title = "", amount = "0", previousValue = 0, loader }) {
    return (
        <Card>
            {
                !loader ?
                    <>
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
                                    {amount?.toLocaleString('en-IN') || amount || "0"}
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
                                    backgroundColor: previousValue >= 0 ? "success.lighter" : "error.lighter"
                                }}
                                >
                                    <SvgColor
                                        sx={{
                                            width: 20,
                                            height: 20,
                                            color: previousValue >= 0 ? "success.dark" : "error.dark"
                                        }}
                                        src="/assets/icons/general/ic_arrow_up.svg"
                                    />
                                    &nbsp;

                                    <b>{previousValue >= 0 ? "+" : "-"}{previousValue} %</b>
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
                        </Box >
                    </>
                    :
                    <Box sx={{ px: 2, py: 1 }}>
                        <Skeleton
                            active
                            paragraph={{
                                rows: 2,
                            }}
                        />
                    </Box>
            }
        </Card >
    )
};

InfoBox.propTypes = {
    title: PropTypes.string,
    amount: PropTypes.string,
    previousValue: PropTypes.number,
    loader: PropTypes.bool,
};