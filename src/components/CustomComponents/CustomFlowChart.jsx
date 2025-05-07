import React from 'react';

import { fDate } from 'src/utils/format-time';
import { formatToINR } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';
import { DataNotFound } from 'src/components/DataNotFound';

export const CustomFlowChart = ({ list, graphList }) => {
  const labels = graphList?.length > 0 ? graphList?.map((item, key) => fDate(item?.Date)) : [];

  const series = [
    {
      name: '',
      color: '#00A76F',
      data: graphList?.length > 0 ? graphList?.map((item, key) => item?.Balance || 0) : [],
    },
  ];

  const absoluteMax = Math.max(...series.flatMap((s) => s.data.map((value) => Math.abs(value))));

  const chartOptions = useChart({
    chart: {
      // type: 'line',
      height: 350,
      zoom: { enabled: true },
    },
    stroke: {
      width: 2,
    },
    markers: {
      size: 1,
      discrete: series.flatMap((s) =>
        s.data.map((value, index) => ({
          seriesIndex: 0,
          dataPointIndex: index,
          fillColor: value < 0 ? '#FF4C4C' : '#2ECC71',
          strokeColor: '#FFFFFF',
          size: 4,
        }))
      ),
    },
    tooltip: {
      shared: false,
      y: {
        formatter: (value) => {
          const isNegative = value < 0;
          return `<div style="font-weight: bold; color: ${
            isNegative ? '#FF4C4C' : '#2ECC71'
          };">${formatToINR(value)} ${isNegative ? 'Out' : 'In'}</div>`;
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#2ECC71', '#FF4C4C'],
        opacityFrom: 0.6,
        opacityTo: 0.6,
      },
    },
    // dataLabels: {
    //   enabled: true,
    //   formatter: (value) => `${formatToINR(value)}`,
    //   style: { fontWeight: 'bold' },
    //   background: {
    //     enabled: true,
    //     foreColor: '#fff',
    //     borderRadius: 4,
    //     padding: 10,
    //   },
    //   offsetY: -8,
    // },
    yaxis: {
      min: -absoluteMax,
      max: absoluteMax,
      labels: { formatter: (value) => value.toLocaleString('en-IN'), },
    },
    xaxis: {
      categories: labels,
      labels: {
        show: false,
      },
    },
  });

  return (
    <>
      {graphList && graphList?.length > 0 ? (
        <Chart type="line" series={series} options={chartOptions} width="100%" height={345} />
      ) : (
        <DataNotFound />
      )}
    </>
  );
};
