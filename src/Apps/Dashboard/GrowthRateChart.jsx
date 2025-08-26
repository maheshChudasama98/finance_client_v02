import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import Chart, { useChart } from 'src/components/chart';

export default function GrowthRateChart({
  monthlyData = [],
  title = 'Monthly Growth Rate',
  subheader = 'Income growth rate month over month',
}) {
  // Calculate growth rate data from monthly data
  const calculateGrowthData = () => {
    if (!monthlyData || monthlyData.length === 0) {
      // Return mock data that matches the image pattern
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
      const growthData = [
        0, // Jan - stable around 0%
        0, // Feb - stable around 0%
        0, // Mar - stable around 0%
        5, // Apr - slight increase
        0, // May - returns to 0%
        0, // Jun - stable around 0%
        0, // Jul - stable around 0%
        -105, // Aug - dramatic drop
        0, // Sep - sharp recovery
        0, // Oct - stable at 0%
        0, // Nov - stable at 0%
        0, // Dec - stable at 0%
      ];

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

    // Calculate actual growth rate from monthly data
    const labels = monthlyData.map((item) => item.monthName);
    const growthData = monthlyData.map((item, index) => {
      if (index === 0) return 0;
      const prevIncome = monthlyData[index - 1].totalIn || 0;
      const currentIncome = item.totalIn || 0;
      return prevIncome > 0 ? ((currentIncome - prevIncome) / prevIncome) * 100 : 0;
    });

    return {
      labels,
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
  };

  const growthRateData = calculateGrowthData();

  const chartOptions = useChart({
    colors: ['#FFC107'], // Yellow color
    stroke: {
      width: 2, // Thicker line to match the image
      curve: 'smooth',
    },
    fill: {
      type: 'solid',
      // type: 'gradient',
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
      y: {
        formatter: (value) => `${value.toFixed(2)}%`,
      },
    },
    yaxis: {
      min: -120,
      max: 30,
      labels: {
        formatter: (value) => `${value.toFixed(1)}%`,
        style: {
          colors: '#637381',
        },
      },
      tickAmount: 6,
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
    // markers: {
    //   size: 4,
    //   colors: ['#FFC107'],
    //   strokeColors: '#FFFFFF',
    //   strokeWidth: 2,
    // },
    // xaxis: {
    //   labels: {
    //     show: false,
    //   },
    // },
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
      <CardHeader title={title} subheader={subheader} />
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
