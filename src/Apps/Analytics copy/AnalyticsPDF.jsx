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
  insightBox: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 5,
  },
  insightItem: {
    flexDirection: 'row',
    margin: '2px 0',
  },
  insightLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    width: '40%',
  },
  insightValue: {
    fontSize: 9,
    width: '60%',
  },
  pageBreak: {
    pageBreakBefore: 'always',
  },
});

const AnalyticsPDF = ({ 
  currentYearMonthBaseData,
  categoriesList,
  subCategoriesList,
  performanceList,
  accountOverview,
  selectedYear,
  setFlag 
}) => {
  const { SelectBranch } = useSelector((state) => state?.master?.BranchesList || {});
  const { SelectOrg } = useSelector((state) => state?.master?.OrgsList || {});

  // Calculate summary statistics
  const summaryStats = {
    totalIncome: currentYearMonthBaseData.reduce((sum, item) => sum + (Number(item.totalIn) || 0), 0),
    totalExpense: currentYearMonthBaseData.reduce((sum, item) => sum + (Number(item.totalOut) || 0), 0),
    totalInvestment: currentYearMonthBaseData.reduce((sum, item) => sum + (Number(item.totalInvestment) || 0), 0),
    totalCredit: currentYearMonthBaseData.reduce((sum, item) => sum + (Number(item.totalCredit) || 0), 0),
    totalDebit: currentYearMonthBaseData.reduce((sum, item) => sum + (Number(item.totalDebit) || 0), 0),
    netSavings: currentYearMonthBaseData.reduce((sum, item) => sum + (Number(item.totalIn) || 0) - (Number(item.totalOut) || 0), 0),
    savingsRate: currentYearMonthBaseData.reduce((sum, item) => sum + (Number(item.totalIn) || 0), 0) > 0
      ? (currentYearMonthBaseData.reduce((sum, item) => sum + (Number(item.totalIn) || 0) - (Number(item.totalOut) || 0), 0) /
         currentYearMonthBaseData.reduce((sum, item) => sum + (Number(item.totalIn) || 0), 0)) * 100
      : 0,
  };

  // Helper function to get savings rate message
  const getSavingsRateMessage = (rate) => {
    if (rate >= 20) return 'Excellent';
    if (rate >= 10) return 'Good';
    return 'Needs Improvement';
  };

  useEffect(() => {
    const generatePDF = async () => {
      const blob = await pdf(
        <Document>
          <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header} fixed>
              {SelectBranch?.ImgPath && 
               SelectBranch?.ImgPath.trim() !== '' && 
               /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(SelectBranch?.ImgPath) ? (
                <Image style={styles.logo} src={`${ImgUrl}${SelectBranch?.ImgPath}`} />
              ) : (
                <View style={styles.logo} />
              )}
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.headerText}>{SelectOrg?.OrgName}</Text>
                <Text style={styles.subHeaderText}>
                  Financial Analytics Report - {moment(selectedYear).format('YYYY')}
                </Text>
              </View>
            </View>

            {/* Organization Details */}
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.boldText}>{SelectBranch?.BranchName}</Text>
              <Text style={styles.normalText}>{SelectBranch?.Address}</Text>
              <Text style={styles.normalText}>{SelectBranch?.City}</Text>
              <Text style={styles.normalText}>{SelectBranch?.Phone}</Text>
            </View>

            {/* Executive Summary */}
            <Text style={styles.sectionTitle}>Executive Summary</Text>
            <View style={styles.summaryBox}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {summaryStats.totalIncome}
                </Text>
                <Text style={styles.summaryLabel}>Total Income</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {summaryStats.totalExpense}
                </Text>
                <Text style={styles.summaryLabel}>Total Expense</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {summaryStats.netSavings}
                </Text>
                <Text style={styles.summaryLabel}>Net Savings</Text>
              </View>
            </View>

            {/* Additional Summary */}
            <View style={styles.row}>
              <View style={{ width: '50%' }}>
                <Text style={styles.boldText}>Investment Amount</Text>
                <Text style={styles.normalText}>
                  {summaryStats.totalInvestment}
                </Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={styles.boldText}>Savings Rate</Text>
                <Text style={styles.normalText}>
                  {summaryStats.savingsRate.toFixed(1)}%
                </Text>
              </View>
            </View>

            {/* Key Insights */}
            <Text style={styles.sectionTitle}>Key Insights</Text>
            <View style={styles.insightBox}>
              <View style={styles.insightItem}>
                <Text style={styles.insightLabel}>Income to Expense Ratio:</Text>
                <Text style={styles.insightValue}>
                  {summaryStats.totalExpense > 0 ? (summaryStats.totalIncome / summaryStats.totalExpense).toFixed(2) : 'N/A'}
                </Text>
              </View>
              <View style={styles.insightItem}>
                <Text style={styles.insightLabel}>Investment Percentage:</Text>
                <Text style={styles.insightValue}>
                  {summaryStats.totalIncome > 0 ? ((summaryStats.totalInvestment / summaryStats.totalIncome) * 100).toFixed(1) : 0}%
                </Text>
              </View>
              <View style={styles.insightItem}>
                <Text style={styles.insightLabel}>Average Monthly Income:</Text>
                <Text style={styles.insightValue}>
                  {currentYearMonthBaseData.length > 0 ? summaryStats.totalIncome / currentYearMonthBaseData.length : 0}
                </Text>
              </View>
              <View style={styles.insightItem}>
                <Text style={styles.insightLabel}>Average Monthly Expense:</Text>
                <Text style={styles.insightValue}>
                  {currentYearMonthBaseData.length > 0 ? summaryStats.totalExpense / currentYearMonthBaseData.length : 0}
                </Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer} fixed>
              <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
              <Text>Analytics Report - {fDate(moment())}</Text>
              <Text>{SelectOrg?.OrgName}</Text>
            </View>
          </Page>

          {/* Second Page - Monthly Breakdown */}
          <Page size="A4" style={styles.page}>
            <Text style={styles.sectionTitle}>Monthly Breakdown</Text>
            
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold' }]}>Month</Text>
              <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold' }]}>Income</Text>
              <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold' }]}>Expense</Text>
              <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold' }]}>Investment</Text>
              <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold' }]}>Credit</Text>
              <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold' }]}>Debit</Text>
              <Text style={[styles.tableCell, { width: '10%', fontWeight: 'bold' }]}>Net</Text>
            </View>

            {/* Table Rows */}
            {currentYearMonthBaseData && currentYearMonthBaseData.length > 0 && 
              currentYearMonthBaseData.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '15%' }]}>{item.monthName}</Text>
                  <Text style={[styles.tableCell, { width: '15%' }]}>
                    {item.totalIn || 0}
                  </Text>
                  <Text style={[styles.tableCell, { width: '15%' }]}>
                    {item.totalOut || 0}
                  </Text>
                  <Text style={[styles.tableCell, { width: '15%' }]}>
                    {item.totalInvestment || 0}
                  </Text>
                  <Text style={[styles.tableCell, { width: '15%' }]}>
                    {item.totalCredit || 0}
                  </Text>
                  <Text style={[styles.tableCell, { width: '15%' }]}>
                    {item.totalDebit || 0}
                  </Text>
                  <Text style={[
                    styles.tableCell, 
                    { width: '10%' },
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
            {categoriesList && categoriesList.length > 0 && (
              <>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCell, { width: '70%', fontWeight: 'bold' }]}>Category</Text>
                  <Text style={[styles.tableCell, { width: '30%', fontWeight: 'bold' }]}>Amount</Text>
                </View>
                {categoriesList.slice(0, 15).map((item, index) => (
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

            {/* Performance Analysis */}
            {performanceList && performanceList.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Performance Analysis</Text>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCell, { width: '30%', fontWeight: 'bold' }]}>Duration</Text>
                  <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold' }]}>Income</Text>
                  <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold' }]}>Expense</Text>
                  <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold' }]}>Investment</Text>
                  <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold' }]}>Credit</Text>
                  <Text style={[styles.tableCell, { width: '10%', fontWeight: 'bold' }]}>Debit</Text>
                </View>
                {performanceList.slice(0, 10).map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: '30%' }]}>{item.duration}</Text>
                    <Text style={[styles.tableCell, { width: '15%' }]}>
                      {item.totalIn || 0}
                    </Text>
                    <Text style={[styles.tableCell, { width: '15%' }]}>
                      {item.totalOut || 0}
                    </Text>
                    <Text style={[styles.tableCell, { width: '15%' }]}>
                      {item.totalInvestment || 0}
                    </Text>
                    <Text style={[styles.tableCell, { width: '15%' }]}>
                      {item.totalCredit || 0}
                    </Text>
                    <Text style={[styles.tableCell, { width: '10%' }]}>
                      {item.totalDebit || 0}
                    </Text>
                  </View>
                ))}
              </>
            )}

            {/* Footer */}
            <View style={styles.footer} fixed>
              <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
              <Text>Analytics Report - {fDate(moment())}</Text>
              <Text>{SelectOrg?.OrgName}</Text>
            </View>
          </Page>

          {/* Third Page - Account Overview */}
          {accountOverview && accountOverview.accountSummary && accountOverview.accountSummary.length > 0 && (
            <Page size="A4" style={styles.page}>
              <Text style={styles.sectionTitle}>Account Overview</Text>
              
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, { width: '30%', fontWeight: 'bold' }]}>Account</Text>
                <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold' }]}>Balance</Text>
                <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold' }]}>Income</Text>
                <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold' }]}>Expense</Text>
                <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold' }]}>Investment</Text>
                <Text style={[styles.tableCell, { width: '10%', fontWeight: 'bold' }]}>Net</Text>
              </View>

              {accountOverview.accountSummary.map((account, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '30%' }]}>
                    {account.AccountName || 'Unknown Account'}
                  </Text>
                  <Text style={[styles.tableCell, { width: '15%' }]}>
                    {account.Balance || 0}
                  </Text>
                  <Text style={[styles.tableCell, { width: '15%' }]}>
                    {account.totalIn || 0}
                  </Text>
                  <Text style={[styles.tableCell, { width: '15%' }]}>
                    {account.totalOut || 0}
                  </Text>
                  <Text style={[styles.tableCell, { width: '15%' }]}>
                    {account.totalInvestment || 0}
                  </Text>
                  <Text style={[
                    styles.tableCell, 
                    { width: '10%' },
                    (account.totalIn || 0) - (account.totalOut || 0) >= 0 
                      ? styles.positiveAmount 
                      : styles.negativeAmount
                  ]}>
                    {(account.totalIn || 0) - (account.totalOut || 0)}
                  </Text>
                </View>
              ))}

              {/* Financial Recommendations */}
              <Text style={styles.sectionTitle}>Financial Recommendations</Text>
              <View style={{ marginTop: 10 }}>
                <Text style={styles.normalText}>
                  • Savings Rate: {summaryStats.savingsRate.toFixed(1)}% - {getSavingsRateMessage(summaryStats.savingsRate)}
                </Text>
                <Text style={styles.normalText}>
                  • Investment Allocation: {summaryStats.totalIncome > 0 ? ((summaryStats.totalInvestment / summaryStats.totalIncome) * 100).toFixed(1) : 0}% of income
                </Text>
                <Text style={styles.normalText}>
                  • Expense Management: {summaryStats.totalExpense > summaryStats.totalIncome ? 'Consider reducing expenses' : 'Expenses are well managed'}
                </Text>
                <Text style={styles.normalText}>
                  • Report generated on: {fDate(moment())}
                </Text>
              </View>

              {/* Footer */}
              <View style={styles.footer} fixed>
                <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
                <Text>Analytics Report - {fDate(moment())}</Text>
                <Text>{SelectOrg?.OrgName}</Text>
              </View>
            </Page>
          )}
        </Document>
      ).toBlob();

      const fileName = `Analytics_Report_${moment(selectedYear).format('YYYY')}`;
      FileSaver.saveAs(blob, `${fileName}.pdf`);
      setFlag(false);
    };

    generatePDF();
  }, []);

  return null; // This component doesn't render anything visible
};

export default AnalyticsPDF; 