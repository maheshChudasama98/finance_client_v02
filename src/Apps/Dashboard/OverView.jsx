import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useAmountVisibility } from 'src/hooks/use-amount-visibility';

import { formatToINR } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function OverView({ chart, height, subheader, title, ...other }) {
  const { isAmountVisible } = useAmountVisibility();

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
    stroke: {
      width: [2, 2, 2, 2],
    },
    labels,
    xaxis: {
      labels: {
        style: {
          colors: '#637381',
          fontSize: '12px',
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            // return `${value?.toLocaleString('en-IN') || value || '0'} `;
            return formatToINR(value || 0, isAmountVisible);
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
    grid: {
      strokeDashArray: 3,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      markers: {
        radius: 4,
      },
    },
    ...options,
  });

  return (
    <Card
      {...other}
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 3,
        },
        ...other.sx,
      }}
    >
      <CardContent sx={{ p: 3, pb: 1 }}>
        {title && (
          <Box sx={{ mb: 2 }}>
            {typeof title === 'string' ? (
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {title}
              </Typography>
            ) : (
              title
            )}
            {subheader && (
              <Typography variant="body2" color="text.secondary">
                {subheader}
              </Typography>
            )}
          </Box>
        )}

        <Chart
          dir="ltr"
          type="line"
          series={series}
          options={chartOptions}
          width="100%"
          height={height}
        />
      </CardContent>
    </Card>
  );
}

OverView.propTypes = {
  chart: PropTypes.object,
  height: PropTypes.number,
  subheader: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};
