import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { fDate } from 'src/utils/format-time';

import { ImgUrl } from 'src/constance';

import moment from 'moment';

import FileSaver from 'file-saver';

import {
  pdf,
  Page,
  Text,
  View,
  Font,
  Image,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';

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
    margin: '8px 0' 
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

const MonthlyOverviewPDF = ({ 
  currentYearData, 
  lastYearData, 
  currentMonth, 
  lastMonth, 
  currentYearMonthData, 
  topCategories,
  selectedYear,
  setFlag 
}) => {
  const { SelectBranch } = useSelector((state) => state?.master?.BranchesList || {});
  const { SelectOrg } = useSelector((state) => state?.master?.OrgsList || {});

  useEffect(() => {
    const generatePDF = async () => {
      const blob = await pdf(
        <Document>
          <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header} fixed>
              <Image style={styles.logo} src={`${ImgUrl}${SelectBranch?.ImgPath}`} />
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.headerText}>{SelectOrg?.OrgName}</Text>
                <Text style={styles.subHeaderText}>
                  Monthly Overview - {moment(selectedYear).format('MMMM YYYY')}
                </Text>
              </View>
            </View>

            {/* Organization Details */}
            {/* <View style={{ marginBottom: 20 }}>
              <Text style={styles.boldText}>{SelectBranch?.BranchName}</Text>
              <Text style={styles.normalText}>{SelectBranch?.Address}</Text>
              <Text style={styles.normalText}>{SelectBranch?.City}</Text>
              <Text style={styles.normalText}>{SelectBranch?.Phone}</Text>
            </View> */}

            {/* Executive Summary */}
            <Text style={styles.sectionTitle}>Executive Summary</Text>
            <View style={styles.summaryBox}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {currentYearData?.totalIn || 0}
                </Text>
                <Text style={styles.summaryLabel}>Total Income (YTD)</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {currentYearData?.totalOut || 0}
                </Text>
                <Text style={styles.summaryLabel}>Total Expense (YTD)</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {(currentYearData?.totalIn || 0) - (currentYearData?.totalOut || 0)}
                </Text>
                <Text style={styles.summaryLabel}>Net Savings (YTD)</Text>
              </View>
            </View>

            {/* Current Month vs Last Month */}
            <Text style={styles.sectionTitle}>Current Month vs Last Month</Text>
            <View style={styles.row}>
              <View style={{ width: '50%' }}>
                <Text style={styles.boldText}>Current Month ({moment().format('MMMM YYYY')})</Text>
                <Text style={styles.normalText}>
                  Income: {currentMonth?.totalIn || 0}
                </Text>
                <Text style={styles.normalText}>
                  Expense: {currentMonth?.totalOut || 0}
                </Text>
                <Text style={styles.normalText}>
                  Investment: {currentMonth?.totalInvestment || 0}
                </Text>
                <Text style={styles.normalText}>
                  Net: {(currentMonth?.totalIn || 0) - (currentMonth?.totalOut || 0)}
                </Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={styles.boldText}>Last Month ({moment().subtract(1, 'month').format('MMMM YYYY')})</Text>
                <Text style={styles.normalText}>
                  Income: {lastMonth?.totalIn || 0}
                </Text>
                <Text style={styles.normalText}>
                  Expense: {lastMonth?.totalOut || 0}
                </Text>
                <Text style={styles.normalText}>
                  Investment: {lastMonth?.totalInvestment || 0}
                </Text>
                <Text style={styles.normalText}>
                  Net: {(lastMonth?.totalIn || 0) - (lastMonth?.totalOut || 0)}
                </Text>
              </View>
            </View>

            {/* Year-over-Year Comparison */}
            <Text style={styles.sectionTitle}>Year-over-Year Comparison</Text>
            <View style={styles.row}>
              <View style={{ width: '50%' }}>
                <Text style={styles.boldText}>Current Year ({moment(selectedYear).format('YYYY')})</Text>
                <Text style={styles.normalText}>
                  Income: {currentYearData?.totalIn || 0}
                </Text>
                <Text style={styles.normalText}>
                  Expense: {currentYearData?.totalOut || 0}
                </Text>
                <Text style={styles.normalText}>
                  Investment: {currentYearData?.totalInvestment || 0}
                </Text>
                <Text style={styles.normalText}>
                  Net: {(currentYearData?.totalIn || 0) - (currentYearData?.totalOut || 0)}
                </Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={styles.boldText}>Last Year ({moment(selectedYear).subtract(1, 'year').format('YYYY')})</Text>
                <Text style={styles.normalText}>
                  Income: {lastYearData?.totalIn || 0}
                </Text>
                <Text style={styles.normalText}>
                  Expense: {lastYearData?.totalOut || 0}
                </Text>
                <Text style={styles.normalText}>
                  Investment: {lastYearData?.totalInvestment || 0}
                </Text>
                <Text style={styles.normalText}>
                  Net: {(lastYearData?.totalIn || 0) - (lastYearData?.totalOut || 0)}
                </Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer} fixed>
              <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
              <Text>Monthly Overview Report - {fDate(moment())}</Text>
              <Text>{SelectOrg?.OrgName}</Text>
            </View>
          </Page>

          {/* Second Page - Monthly Breakdown */}
          <Page size="A4" style={styles.page}>
            <Text style={styles.sectionTitle}>Monthly Breakdown ({moment(selectedYear).format('YYYY')})</Text>
            
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>Month</Text>
              <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>Income</Text>
              <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>Expense</Text>
              <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>Investment</Text>
              <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>Net</Text>
            </View>

            {/* Table Rows */}
            {currentYearMonthData && currentYearMonthData.length > 0 && 
              currentYearMonthData.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '20%' }]}>{item.monthName}</Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>
                    {item.totalIn || 0}
                  </Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>
                    {item.totalOut || 0}
                  </Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>
                    {item.totalInvestment || 0}
                  </Text>
                  <Text style={[
                    styles.tableCell, 
                    { width: '20%' },
                    (item.totalIn || 0) - (item.totalOut || 0) >= 0 
                      ? styles.positiveAmount 
                      : styles.negativeAmount
                  ]}>
                    {(item.totalIn || 0) - (item.totalOut || 0)}
                  </Text>
                </View>
              ))
            }

            {/* Top Categories */}
            <Text style={[styles.sectionTitle, styles.pageBreak]}>Top Expense Categories</Text>
            {topCategories && topCategories.length > 0 && (
              <>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCell, { width: '70%', fontWeight: 'bold' }]}>Category</Text>
                  <Text style={[styles.tableCell, { width: '30%', fontWeight: 'bold' }]}>Amount</Text>
                </View>
                {topCategories.slice(0, 10).map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: '70%' }]}>
                      {item.CategoryName || 'Uncategorized'}
                    </Text>
                    <Text style={[styles.tableCell, { width: '30%' }]}>
                      {item.totalOut || 0}
                    </Text>
                  </View>
                ))}
              </>
            )}
            
            <View break />

            {/* Key Insights */}
            <Text style={styles.sectionTitle}>Key Insights</Text>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.normalText}>
                • Total income for {moment(selectedYear).format('YYYY')}: {currentYearData?.totalIn || 0}
              </Text>
              <Text style={styles.normalText}>
                • Total expenses for {moment(selectedYear).format('YYYY')}: {currentYearData?.totalOut || 0}
              </Text>
              <Text style={styles.normalText}>
                • Savings rate: {currentYearData?.totalIn > 0 
                  ? (((currentYearData?.totalIn || 0) - (currentYearData?.totalOut || 0)) / (currentYearData?.totalIn || 1) * 100).toFixed(1)
                  : 0}%
              </Text>
              <Text style={styles.normalText}>
                • Total investments: {currentYearData?.totalInvestment || 0}
              </Text>
              <Text style={styles.normalText}>
                • Report generated on: {fDate(moment())}
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer} fixed>
              <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
              <Text>Monthly Overview Report - {fDate(moment())}</Text>
              <Text>{SelectOrg?.OrgName}</Text>
            </View>
          </Page>
        </Document>
      ).toBlob();

      const fileName = `Monthly_Overview_${moment(selectedYear).format('MMMM_YYYY')}`;
      FileSaver.saveAs(blob, `${fileName}.pdf`);
      setFlag(false);
    };

    generatePDF();
  }, []);

  return null; // This component doesn't render anything visible
};

export default MonthlyOverviewPDF; 