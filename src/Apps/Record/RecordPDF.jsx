import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { fDate } from 'src/utils/format-time';

import { ImgUrl } from 'src/constance';

import moment from 'moment';

import FileSaver from 'file-saver';

import { pdf, Page, Text, View, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';

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
    padding: '15px',
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    fontSize: 12,
    paddingBottom: 65,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
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
  filterBox: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 5,
  },
  filterItem: {
    flexDirection: 'row',
    margin: '2px 0',
  },
  filterLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    width: '30%',
  },
  filterValue: {
    fontSize: 9,
    width: '70%',
  },
  pageBreak: {
    pageBreakBefore: 'always',
  },
});

const RecordPDF = ({ transactionList, FilterBy, Duration, searchValue, setFlag }) => {
  const { SelectBranch } = useSelector((state) => state?.master?.BranchesList || {});
  const { SelectOrg } = useSelector((state) => state?.master?.OrgsList || {});

  // Calculate summary statistics
  const summaryStats = {
    totalTransactions: transactionList.length,
    totalIncome: transactionList.reduce(
      (sum, item) => sum + (item.AccountAmount > 0 ? parseFloat(item.Amount) : 0),
      0
    ),
    totalExpense: transactionList.reduce(
      (sum, item) => sum + (item.AccountAmount < 0 ? parseFloat(item.Amount) : 0),
      0
    ),
    totalInvestment: transactionList.reduce(
      (sum, item) => sum + (item.Action === 'Investment' ? parseFloat(item.Amount) : 0),
      0
    ),
    netAmount: transactionList.reduce((sum, item) => sum + parseFloat(item.AccountAmount), 0),
  };

  // Group transactions by date
  const groupedTransactions = transactionList.reduce((acc, item) => {
    const date = item.Date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

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
              </View>
            </View>

            {/* Organization Details */}
            {/* <View style={{ marginBottom: 20 }}>
              <Text style={styles.boldText}>{SelectBranch?.BranchName}</Text>
              <Text style={styles.normalText}>{SelectBranch?.Address}</Text>
              <Text style={styles.normalText}>{SelectBranch?.City}</Text>
              <Text style={styles.normalText}>{SelectBranch?.Phone}</Text>
            </View> */}

            {/* Report Summary */}
            <Text style={styles.sectionTitle}>Report Summary</Text>
            <View style={styles.summaryBox}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{summaryStats.totalTransactions}</Text>
                <Text style={styles.summaryLabel}>Total Transactions</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{summaryStats.totalIncome}</Text>
                <Text style={styles.summaryLabel}>Total Income</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{summaryStats.totalExpense}</Text>
                <Text style={styles.summaryLabel}>Total Expense</Text>
              </View>
            </View>

            {/* Additional Summary */}
            <View style={styles.row}>
              <View style={{ width: '50%' }}>
                <Text style={styles.boldText}>Investment Amount</Text>
                <Text style={styles.normalText}>{summaryStats.totalInvestment}</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={styles.boldText}>Net Amount</Text>
                <Text
                  style={[
                    styles.normalText,
                    summaryStats.netAmount >= 0 ? styles.positiveAmount : styles.negativeAmount,
                  ]}
                >
                  {summaryStats.netAmount}
                </Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer} fixed>
              <Text
                render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
              />
              <Text>Transaction Report - {fDate(moment())}</Text>
              <Text>{SelectOrg?.OrgName}</Text>
            </View>

            <Text style={styles.sectionTitle}>Transaction Details</Text>

            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { width: '15%', fontWeight: 'bold' }]}>Date</Text>
              <Text style={[styles.tableCell, { width: '20%', fontWeight: 'bold' }]}>Category</Text>
              <Text style={[styles.tableCell, { width: '18%', fontWeight: 'bold' }]}>Action</Text>
              <Text style={[styles.tableCell, { width: '18%', fontWeight: 'bold' }]}>Account</Text>
              <Text style={[styles.tableCell, { width: '18%', fontWeight: 'bold' }]}>Party</Text>
              <Text
                style={[styles.tableCell, { width: '18%', fontWeight: 'bold', textAlign: 'right' }]}
              >
                Amount
              </Text>
              {/* <Text style={[styles.tableCell, { width: '11%', fontWeight: 'bold' }]}>Balance</Text> */}
            </View>

            {/* Transaction Rows */}
            {Object.keys(groupedTransactions).map((date) => (
              <View key={date}>
                {/* Date Header */}
                <View style={[styles.tableRow, { backgroundColor: '#f0f0f0' }]}>
                  <Text
                    style={[styles.tableCell, { width: '100%', fontWeight: 'bold', fontSize: 10 }]}
                  >
                    {fDate(date)}
                  </Text>
                </View>

                {/* Transactions for this date */}
                {groupedTransactions[date].map((transaction, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: '15%' }]}>
                      {fDate(transaction.Date)}
                    </Text>
                    <Text style={[styles.tableCell, { width: '20%' }]}>
                      {transaction.CategoryDetails?.CategoryName || 'N/A'}
                    </Text>
                    <Text style={[styles.tableCell, { width: '18%' }]}>
                      {transaction.Action || 'N/A'}
                    </Text>
                    <Text style={[styles.tableCell, { width: '18%' }]}>
                      {transaction.AccountDetails?.AccountName || 'N/A'}
                    </Text>
                    <Text style={[styles.tableCell, { width: '18%' }]}>
                      {transaction.PartyDetails?.FullName || 'N/A'}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        { width: '18%', textAlign: 'right' },
                        transaction.AccountAmount > 0
                          ? styles.positiveAmount
                          : styles.negativeAmount,
                      ]}
                    >
                      {transaction.AccountAmount}
                    </Text>
                  </View>
                ))}
              </View>
            ))}

            <View break />
            {/* Transaction Analysis */}
            <Text style={[styles.sectionTitle, styles.pageBreak]}>Transaction Analysis</Text>

            {/* Action Distribution */}
            <Text style={styles.boldText}>Transaction Types</Text>
            {(() => {
              const actionCounts = transactionList.reduce((acc, item) => {
                acc[item.Action] = (acc[item.Action] || 0) + 1;
                return acc;
              }, {});

              return Object.entries(actionCounts).map(([action, count]) => (
                <View key={action} style={styles.row}>
                  <Text style={[styles.normalText, { width: '70%' }]}>{action}</Text>
                  <Text style={[styles.normalText, { width: '30%' }]}>{count} transactions</Text>
                </View>
              ));
            })()}

            {/* Account Distribution */}
            <Text style={[styles.boldText, { marginTop: 15 }]}>Account Distribution</Text>
            {(() => {
              const accountCounts = transactionList.reduce((acc, item) => {
                const accountName = item.AccountDetails?.AccountName || 'Unknown';
                acc[accountName] = (acc[accountName] || 0) + 1;
                return acc;
              }, {});

              return Object.entries(accountCounts)
                .slice(0, 10)
                .map(([account, count]) => (
                  <View key={account} style={styles.row}>
                    <Text style={[styles.normalText, { width: '70%' }]}>{account}</Text>
                    <Text style={[styles.normalText, { width: '30%' }]}>{count} transactions</Text>
                  </View>
                ));
            })()}

            {/* Key Insights */}
            <Text style={styles.sectionTitle}>Key Insights</Text>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.normalText}>
                • Total transactions in this period: {summaryStats.totalTransactions}
              </Text>
              <Text style={styles.normalText}>
                • Average transaction amount:{' '}
                {summaryStats.totalTransactions > 0
                  ? summaryStats.netAmount / summaryStats.totalTransactions
                  : 0}
              </Text>
              <Text style={styles.normalText}>
                • Income to expense ratio:{' '}
                {summaryStats.totalExpense > 0
                  ? (summaryStats.totalIncome / summaryStats.totalExpense).toFixed(2)
                  : 'N/A'}
              </Text>
              <Text style={styles.normalText}>
                • Investment percentage:{' '}
                {summaryStats.totalIncome > 0
                  ? ((summaryStats.totalInvestment / summaryStats.totalIncome) * 100).toFixed(1)
                  : 0}
                %
              </Text>
              <Text style={styles.normalText}>• Report generated on: {fDate(moment())}</Text>
            </View>

            {/* Footer */}
            <View style={styles.footer} fixed>
              <Text
                render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
              />
              <Text>Transaction Report - {fDate(moment())}</Text>
              <Text>{SelectOrg?.OrgName}</Text>
            </View>
          </Page>
        </Document>
      ).toBlob();

      const fileName = `Transaction_Report_${moment().format('MMMM_YYYY')}`;
      FileSaver.saveAs(blob, `${fileName}.pdf`);
      setFlag(false);
    };

    generatePDF();
  }, []);

  return null; // This component doesn't render anything visible
};

export default RecordPDF;
