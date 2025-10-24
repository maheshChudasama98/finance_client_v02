import React, { useRef, useState, useEffect } from 'react';

import { fDate } from 'src/utils/format-time';

import PagePDF from 'src/components/PDF/PagePDF';
import Chart, { useChart } from 'src/components/chart';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';

import moment from 'moment';

import { Text, View, Font, Image, StyleSheet } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      fontWeight: 'light',
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 'bold',
    },
  ],
});

const styles = StyleSheet.create({
  // page: {
  //   flexDirection: 'column',
  //   padding: '20px',
  //   fontFamily: 'Roboto',
  //   fontWeight: 'normal',
  //   fontSize: 12,
  //   paddingBottom: 65,
  // },
  // header: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   marginBottom: 20,
  //   paddingBottom: 15,
  //   borderBottom: '2 solid #5BC43A',
  // },
  // footer: {
  //   paddingTop: 15,
  //   borderTop: '1 solid #eee',
  //   position: 'absolute',
  //   bottom: 20,
  //   left: 20,
  //   right: 20,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   fontSize: 10,
  // },
  // headerText: {
  //   fontSize: '24px',
  //   fontFamily: 'Roboto',
  //   fontWeight: 'bold',
  //   color: '#5BC43A',
  // },
  // subHeaderText: {
  //   fontSize: 16,
  //   color: '#666',
  //   marginTop: 5,
  // },
  // logo: {
  //   height: '60px',
  //   width: 'auto',
  // },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    paddingBottom: 5,
    borderBottom: '1 solid #DDD',
  },
  boldText: {
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    margin: '2px 0px',
  },
  normalText: {
    fontSize: 10,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    margin: '2px 0px',
  },
  lightText: {
    fontSize: 9,
    fontFamily: 'Roboto',
    fontWeight: 'light',
    margin: '2px 0px',
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    margin: '3px 0',
    padding: '5px 0',
  },
  br: {
    borderBottom: '1 solid #eee',
    margin: '8px 0',
  },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  summaryItem: {
    alignItems: 'center',
    width: '30%',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5BC43A',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: '8px 0',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    padding: '6px 0',
    borderBottom: '1 solid #eee',
  },
  tableCell: {
    fontSize: 9,
    padding: '2px 4px',
  },
  positiveAmount: {
    color: '#00A76F',
    fontWeight: 'bold',
  },
  negativeAmount: {
    color: '#FF4842',
    fontWeight: 'bold',
  },
  balanceOverviewContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  balanceChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    marginTop: 10,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: '1 solid #ddd',
  },
  balanceBar: {
    flex: 1,
    marginHorizontal: 2,
    backgroundColor: '#5BC43A',
    borderRadius: 2,
    minHeight: 10,
  },
  balanceBarNegative: {
    backgroundColor: '#FF4842',
  },
  balanceBarNeutral: {
    backgroundColor: '#666',
  },
  balanceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  balanceLabel: {
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
    width: '12%',
  },
  balanceLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 8,
    marginRight: 5,
    borderRadius: 1,
  },
  legendText: {
    fontSize: 9,
    color: '#666',
  },
});

const numberformat = (number) => {
  const num = Number(number || 0);
  return `${num.toLocaleString('en-IN') || 0}`;
};

const BalanceOverviewGraph = ({ chart }) => {
  const { labels, colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    labels,
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
    xaxis: {
      labels: {
        style: {
          colors: '#637381',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
      },
    },
    grid: {
      borderColor: '#f1f1f1',
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
    <Chart
      dir="ltr"
      type="line"
      series={series}
      options={chartOptions}
      width="100%"
      height="100%"
    />
  );
};

const YearlyOverviewPDF = ({
  setFlag,
  selectedYear,
  currentYearData,
  lastYearData,
  currentMonth,
  lastMonth,
  currentYearMonthBaseData,
  currentYearMonthData,
  topCategories,
}) => {
  const GraphComponentList = [
    {
      id: 1,
      width: 800,
      height: 300,
      graphName: 'imageGraph',
      graph: (
        <BalanceOverviewGraph
          chart={{
            labels:
              currentYearMonthBaseData?.length > 0
                ? currentYearMonthBaseData?.map((item, key) => item?.monthName)
                : [],
            series: [
              {
                name: 'Income',
                type: 'column',
                fill: 'solid',
                color: '#00A76F',
                data:
                  currentYearMonthBaseData?.length > 0
                    ? currentYearMonthBaseData?.map((item, key) => item?.totalIn || 0)
                    : [],
              },
              {
                name: 'Expense',
                type: 'column',
                fill: 'solid',
                color: '#FFAb00',
                data:
                  currentYearMonthBaseData?.length > 0
                    ? currentYearMonthBaseData?.map((item, key) => item?.totalOut || 0)
                    : [],
              },
            ],
            options: {
              stroke: {
                width: [1],
              },
            },
          }}
        />
      ),
    },
  ];

  const [details, setDetails] = useState({});
  const [loader, setLoader] = useState(true);

  const graphGetImage = (e, item) => {
    setDetails((event) => ({ ...event, [item?.graphName]: e }));
  };

  useEffect(() => {
    if (Object.keys(details || {}).length === GraphComponentList.length) {
      // All graph images are ready
      setLoader(false);
    }
  }, [details]);
  return (
    <div>
      {GraphComponentList.map((item, key) => (
        <GraphComponentImage
          graphComponent={item?.graph}
          graphName={item.graphName}
          width={item?.width}
          height={item?.height}
          cb={(e) => {
            graphGetImage(e, item);
          }}
        />
      ))}

      {loader && <ButtonLoader />}

      {!loader && (
        <PagePDF
          title="Year Overview"
          setFlag={setFlag}
          ChildComponent={() => (
            <>
              {/* Executive Summary */}
              <Text style={styles.sectionTitle}>Executive Summary</Text>
              <View style={styles.summaryBox}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>
                    {numberformat(currentYearData?.totalIn) || 0}
                  </Text>
                  <Text style={styles.summaryLabel}>Total Income</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={{ ...styles.summaryValue }}>
                    {numberformat(currentYearData?.totalOut) || 0}
                  </Text>
                  <Text style={styles.summaryLabel}>Total Expense</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={{ ...styles.summaryValue }}>
                    {numberformat(
                      (currentYearData?.totalIn || 0) - (currentYearData?.totalOut || 0)
                    )}
                  </Text>
                  <Text style={styles.summaryLabel}>Net Savings</Text>
                </View>
              </View>

              {/* Year-over-Year Comparison */}
              <Text style={styles.sectionTitle}>Year-over-Year Comparison</Text>
              <View style={styles.row}>
                <View style={{ width: '50%' }}>
                  <Text style={styles.boldText}>
                    Current Year ({moment(selectedYear).format('YYYY')})
                  </Text>
                  <Text style={styles.normalText}>
                    Income: {numberformat(currentYearData?.totalIn) || 0}
                  </Text>
                  <Text style={styles.normalText}>
                    Expense: {numberformat(currentYearData?.totalOut) || 0}
                  </Text>
                  <Text style={styles.normalText}>
                    Investment: {numberformat(currentYearData?.totalInvestment) || 0}
                  </Text>
                  <Text style={styles.normalText}>
                    Net:{' '}
                    {numberformat(
                      (currentYearData?.totalIn || 0) - (currentYearData?.totalOut || 0)
                    )}
                  </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={styles.boldText}>
                    Last Year ({moment(selectedYear).subtract(1, 'year').format('YYYY')})
                  </Text>
                  <Text style={styles.normalText}>
                    Income: {numberformat(lastYearData?.totalIn) || 0}
                  </Text>
                  <Text style={styles.normalText}>
                    Expense: {numberformat(lastYearData?.totalOut) || 0}
                  </Text>
                  <Text style={styles.normalText}>
                    Investment: {numberformat(lastYearData?.totalInvestment) || 0}
                  </Text>
                  <Text style={styles.normalText}>
                    Net:{' '}
                    {numberformat((lastYearData?.totalIn || 0) - (lastYearData?.totalOut || 0))}
                  </Text>
                </View>
              </View>

              <Image
                style={{
                  width: '100%',
                  height: 200,
                  margin: '0px auto',
                }}
                src={`${details?.imageGraph}`}
              />

              {/* Current Month vs Last Month */}
              {/* <Text style={styles.sectionTitle}>Current Month vs Last Month</Text>
        <View style={styles.row}>
          <View style={{ width: '50%' }}>
            <Text style={styles.boldText}>Current Month ({moment().format('MMMM YYYY')})</Text>
            <Text style={styles.normalText}>
              Income: {numberformat(currentMonth?.totalIn) || 0}
            </Text>
            <Text style={styles.normalText}>
              Expense: {numberformat(currentMonth?.totalOut) || 0}
            </Text>
            <Text style={styles.normalText}>
              Investment: {numberformat(currentMonth?.totalInvestment) || 0}
            </Text>
            <Text style={styles.normalText}>
              Net: {numberformat((currentMonth?.totalIn || 0) - (currentMonth?.totalOut || 0))}
            </Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={styles.boldText}>
              Last Month ({moment().subtract(1, 'month').format('MMMM YYYY')})
            </Text>
            <Text style={styles.normalText}>Income: {numberformat(lastMonth?.totalIn) || 0}</Text>
            <Text style={styles.normalText}>Expense: {numberformat(lastMonth?.totalOut) || 0}</Text>
            <Text style={styles.normalText}>
              Investment: {numberformat(lastMonth?.totalInvestment) || 0}
            </Text>
            <Text style={styles.normalText}>
              Net: {numberformat((lastMonth?.totalIn || 0) - (lastMonth?.totalOut || 0))}
            </Text>
          </View>
        </View> */}

              <View break />

              <Text style={styles.sectionTitle}>
                Monthly Breakdown ({moment(selectedYear).format('YYYY')})
              </Text>

              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>Month</Text>
                <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>Income</Text>
                <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>
                  Expense
                </Text>
                <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>
                  Investment
                </Text>
                <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>Net</Text>
              </View>

              {/* Table Rows */}
              {/* {currentYearMonthData &&
                currentYearMonthData.length > 0 &&
                currentYearMonthData.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: '20%' }]}>{item.monthName}</Text>
                    <Text style={[styles.tableCell, { width: '20%' }]}>
                      {numberformat(item.totalIn) || 0}
                    </Text>
                    <Text style={[styles.tableCell, { width: '20%' }]}>
                      {numberformat(item.totalOut) || 0}
                    </Text>
                    <Text style={[styles.tableCell, { width: '20%' }]}>
                      {numberformat(item.totalInvestment) || 0}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        { width: '20%' },
                        (item.totalIn || 0) - (item.totalOut || 0) >= 0
                          ? styles.positiveAmount
                          : styles.negativeAmount,
                      ]}
                    >
                      {numberformat((item.totalIn || 0) - (item.totalOut || 0))}
                    </Text>
                  </View>
                ))} */}

              {/* <View break /> */}

              {/* Key Insights */}
              <Text style={styles.sectionTitle}>Key Insights</Text>
              <View style={{ marginTop: 10 }}>
                <Text style={styles.normalText}>
                  • Total income for {moment(selectedYear).format('YYYY')}:{' '}
                  {numberformat(currentYearData?.totalIn) || 0}
                </Text>
                <Text style={styles.normalText}>
                  • Total expenses for {moment(selectedYear).format('YYYY')}:{' '}
                  {numberformat(currentYearData?.totalOut) || 0}
                </Text>
                <Text style={styles.normalText}>
                  • Savings rate:{' '}
                  {currentYearData?.totalIn > 0
                    ? (
                        (((currentYearData?.totalIn || 0) - (currentYearData?.totalOut || 0)) /
                          (currentYearData?.totalIn || 1)) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </Text>
                <Text style={styles.normalText}>
                  • Total investments: {numberformat(currentYearData?.totalInvestment) || 0}
                </Text>
                <Text style={styles.normalText}>• Report generated on: {fDate(moment())}</Text>
              </View>
            </>
          )}
        />
      )}
    </div>
  );
};

const GraphComponentImage = ({ graphComponent, width, height, cb, graphName }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    const renderChart = async () => {
      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const scaleFactor = 2;
        canvas.width = width * scaleFactor;
        canvas.height = height * scaleFactor;
        ctx.scale(scaleFactor, scaleFactor);
        const svg = chartRef?.current?.querySelector('svg');

        if (!svg) {
          throw new Error('SVG not found');
        }
        const svgString = new XMLSerializer().serializeToString(svg);
        const base64Data = btoa(unescape(encodeURIComponent(svgString)));
        // const imgSrc = `data:image/svg+xml;base64,${base64Data}`;
        const img = new window.Image();
        img.src = `data:image/svg+xml;base64,${base64Data}`;
        if (graphName === 'costBarChart') {
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
            const imgData = canvas.toDataURL('image/png');
            setImageUrl(imgData);
            cb(imgData);
          };
        } else {
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
            const imgData = canvas.toDataURL('image/png');
            setImageUrl(imgData);
            cb(imgData);
          };
        }
      } catch (error) {
        console.error('Error rendering chart:', error);
      }
    };
    const timeoutId = setTimeout(() => {
      renderChart();
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      {!imageUrl && (
        <div
          style={{
            display: '',
            opacity: 0,
            top: 0,
            zIndex: -5000,
            position: 'absolute',
            width,
            height,
          }}
          ref={chartRef}
        >
          {graphComponent}
        </div>
      )}
      <div style={{ display: 'none' }}>
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
    </>
  );
};

export default YearlyOverviewPDF;
