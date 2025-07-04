import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export function AnimatedChart({ title, subheader, height, chart, ...other }) {
  const { labels, colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: '16%',
      },
    },
    fill: {
      type: series.map((i) => i.fill),
    },
    labels,
    xaxis: {
      labels: {},
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return `${value?.toLocaleString('en-IN') || value || '0'} `;
          }
          return value;
        },
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    animations: {
      enabled: false,
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={<Typography variant="h6">{title}</Typography>} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type="line"
          series={series}
          options={chartOptions}
          width="100%"
          height={height}
        />
      </Box>
    </Card>
  );
}

AnimatedChart.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  height: PropTypes.number,
  title: PropTypes.string,
};
