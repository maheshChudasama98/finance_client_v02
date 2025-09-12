import React from 'react';

import { fDate } from 'src/utils/format-time';

import PagePDF from 'src/components/PDF/PagePDF';

import moment from 'moment';

import { Text, View, Font, StyleSheet } from '@react-pdf/renderer';

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
  page: {
    flexDirection: 'column',
    padding: '20px',
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    fontSize: 12,
    paddingBottom: 65,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '2 solid #5BC43A',
  },
  footer: {
    paddingTop: 15,
    borderTop: '1 solid #eee',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
  },
  headerText: {
    fontSize: '24px',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#5BC43A',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  logo: {
    height: '60px',
    width: 'auto',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: '1 solid #ddd',
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
  pageBreak: {
    pageBreakBefore: 'always',
  },
});

const numberformat = (number) => {
  const num = Number(number || 0);
  return num.toLocaleString('en-IN') || 0;
};

const MonthlyOverviewPDF = ({
  currentYearData,
  lastYearData,
  currentMonth,
  lastMonth,
  currentYearMonthData,
  topCategories,
  selectedYear,
  setFlag,
}) => (
  <PagePDF
    title="Year Overview"
    setFlag={setFlag}
    ChildComponent={() => (
      <>
        {/* Executive Summary */}
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{numberformat(currentYearData?.totalIn) || 0}</Text>
            <Text style={styles.summaryLabel}>Total Income</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{numberformat(currentYearData?.totalOut) || 0}</Text>
            <Text style={styles.summaryLabel}>Total Expense</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {numberformat((currentYearData?.totalIn || 0) - (currentYearData?.totalOut || 0))}
            </Text>
            <Text style={styles.summaryLabel}>Net Savings </Text>
          </View>
        </View>

        {/* Current Month vs Last Month */}
        <Text style={styles.sectionTitle}>Current Month vs Last Month</Text>
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
              {numberformat((currentYearData?.totalIn || 0) - (currentYearData?.totalOut || 0))}
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
              Net: {numberformat((lastYearData?.totalIn || 0) - (lastYearData?.totalOut || 0))}
            </Text>
          </View>
        </View>

        <View break />

        <Text style={styles.sectionTitle}>
          Monthly Breakdown ({moment(selectedYear).format('YYYY')})
        </Text>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>Month</Text>
          <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>Income</Text>
          <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>Expense</Text>
          <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>Investment</Text>
          <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>Net</Text>
        </View>

        {/* Table Rows */}
        {currentYearMonthData &&
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
          ))}


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
);

export default MonthlyOverviewPDF;
