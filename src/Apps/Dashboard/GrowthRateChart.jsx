import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import Chart, { useChart } from 'src/components/chart';
import { CustomSelect } from 'src/components/CustomComponents';

export default function GrowthRateChart({
  monthlyData = [],
  title = 'Monthly Growth Rate',
  subheader = 'Growth rate month over month',
}) {
  const [keyString, setKeyString] = useState('totalIn');
  const keyColor = [
    { key: 'totalIn', value: 'Income', textColor: '#FFB703' },
    { key: 'totalOut', value: 'Expend', textColor: '#ff1100ff' },
    { key: 'totalInvestment', value: 'Investment', textColor: '#00B8D9' },
  ];

  const calculateGrowthData = () => {
    if (!monthlyData || monthlyData.length === 0) {
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const growthData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      return {
        labels: months,
        series: [
          {
            name: 'Growth Rate (%)',
            type: 'line',
            fill: 'gradient',
            color: '#FFC107', // Yellow color to match the image
            data: growthData,
          },
        ],
      };
    }

    const labels = monthlyData.map((item) => item.monthName);

    const growthData = (() => {
      let baseline = null; // store first non-zero
      return monthlyData.map((item) => {
        const currentIncome = item?.[keyString] || 0;

        if (currentIncome <= 0) {
          return 0;
        }

        if (baseline === null) {
          baseline = currentIncome;
          return 100;
        }

        return ((currentIncome / baseline) * 100).toFixed(2);
      });
    })();

    const selected = keyColor.find((k) => k.key === keyString) || keyColor[0];
    return {
      labels,
      series: [
        {
          name: `${selected.value} Growth Rate (%)`,
          type: 'line',
          fill: 'gradient',
          color: selected.textColor,
          data: growthData,
        },
      ],
    };
  };

  const growthRateData = calculateGrowthData();

  const absoluteMax = Math.max(
    ...growthRateData.series.flatMap((s) => s.data.map((value) => Math.abs(value)))
  );

  const chartOptions = useChart({
    colors: ['#FFC107'], // Yellow color
    stroke: {
      width: 2, // Thicker line to match the image
      curve: 'smooth',
    },
    fill: {
      type: 'solid',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: ['#FFC107'],
        opacityFrom: 0.4,
        opacityTo: 0.1,
      },
    },
    tooltip: {
      y: { formatter: (value) => `${Number(value).toFixed(2)}%` },
    },
    yaxis: {
      min: -absoluteMax,
      max: absoluteMax,
      labels: {
        formatter: (value) => `${value.toFixed(1)}%`,
        style: {
          colors: '#637381',
        },
      },
    },
    xaxis: {
      categories: growthRateData.labels,
      labels: {
        style: {
          colors: '#637381',
        },
      },
    },
    grid: {
      borderColor: '#F4F6F8',
      strokeDashArray: 3,
    },
  });

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <CustomSelect
            callBackAction={(value) => setKeyString(value)}
            defaultValue={keyString}
            labelKey="value"
            valueKey="key"
            menuList={keyColor}
            size="small"
            sx={{ width: 120 }}
          />
        }
      />
      <Box sx={{ p: 2 }}>
        <Chart
          dir="ltr"
          type="line"
          series={growthRateData.series}
          options={chartOptions}
          width="100%"
          height={280}
        />
      </Box>
    </Card>
  );
}

GrowthRateChart.propTypes = {
  monthlyData: PropTypes.array,
  title: PropTypes.string,
  subheader: PropTypes.string,
};
