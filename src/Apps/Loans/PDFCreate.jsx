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
    padding: '0px 20px',
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    fontSize: 12,
    paddingBottom: 65,
    // border: "solid 1px red",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
    // borderBottom: "1 solid #d30000",
    paddingBottom: 10,
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
    marginTop: 10,
    fontSize: '20px',
    fontFamily: 'Roboto',
    alignItems: 'end',
    fontWeight: 'bold',
  },
  subHeaderText: { fontSize: 16, float: 'right' },
  logo: { height: '60px' },
  boldText: {
    margin: '2px 0px',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  normalText: {
    margin: '2px 0px',
    fontSize: 8,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
  },
  lightText: {
    margin: '2px 0px',
    fontSize: 8,
    fontFamily: 'Roboto',
    fontWeight: 'light',
  },

  textTitle: {
    // margin: "2px 0px",
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#999',
  },

  row: { flexDirection: 'row', margin: '1px 0' },
  br: { borderBottom: '1 solid #eee', margin: '5px 0' },

  blueHeader: {
    fontSize: 12,
    // padding: 5,
    marginTop: '40px',
    marginBottom: '7px',
    color: '#000',
    textTransform: 'uppercase',
    // backgroundColor: "#4f81bc",
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
});

// const ApplicationReport = ({ details }) => {
//   console.log();

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* PDF Header */}
//         <View style={styles.header} fixed>
//           <View style={{ alignItems: 'flex-end' }}>
//             <View style={{ marginBottom: 0 }}>
//               <Text style={styles.boldText}>Invoice from</Text>
//               <Text style={styles.normalText}>Lucian Obrien</Text>
//               <Text style={styles.normalText}>
//                 1147 Rohan Drive Suite 819 - Burlington, VT / 82021
//               </Text>
//               <Text style={styles.normalText}>+91 416-555-0198</Text>
//             </View>
//           </View>

//           <Image style={styles.logo} src={`/org/${details?.orgId}/logo/${details?.orgImg}`} />
//         </View>

//         <View style={styles.content}>
//           <View style={styles?.blueHeader}>
//             <Text>Consumer Details </Text>
//           </View>

//           <View style={styles?.row}>
//             <View style={{ width: '25%' }}>
//               <Text style={styles?.textTitle}>Consumer Number</Text>
//               <Text style={styles?.normalText}>{details?.Consumer_Number}</Text>
//             </View>

//             <View style={{ width: '35%' }}>
//               <Text style={styles?.textTitle}>Consumer Name</Text>
//               <Text style={styles?.normalText}>{details?.Consumer_FullName}</Text>
//             </View>

//             <View style={{ width: '20%' }}>
//               <Text style={styles?.textTitle}>Mobile Number</Text>
//               <Text style={styles?.normalText}>{details?.Consumer_NumberPrimary}</Text>
//             </View>

//             <View style={{ width: '20%' }}>
//               <Text style={styles?.textTitle}>Mobile Number</Text>
//               <Text style={styles?.normalText}>{details?.Consumer_NumberSecondary}</Text>
//             </View>
//           </View>

//           {/* TC details */}
//           <View style={styles?.blueHeader}>
//             <Text> TC-Details </Text>
//           </View>

//           <View style={styles?.row}>
//             <View style={{ width: '33%' }}>
//               <Text style={styles?.textTitle}>Contracted Load</Text>
//               <Text style={styles?.normalText}> {details?.Consumer_Number}</Text>
//             </View>

//             <View style={{ width: '33%' }}>
//               <Text style={styles?.textTitle}>Village Name</Text>
//               <Text style={styles?.normalText}> {details?.Consumer_FullName}</Text>
//             </View>

//             <View style={{ width: '33%' }}>
//               <Text style={styles?.textTitle}>Feeder Name</Text>
//               <Text style={styles?.normalText}> {details?.Consumer_NumberPrimary}</Text>
//             </View>
//           </View>

//           <View style={styles?.row}>
//             <View style={{ width: '33%' }}>
//               <Text style={styles?.textTitle}>Substation Name</Text>
//               <Text style={styles?.normalText}> {details?.Consumer_Number}</Text>
//             </View>

//             <View style={{ width: '33%' }}>
//               <Text style={styles?.textTitle}>Number Of Connection</Text>
//               <Text style={styles?.normalText}> {details?.Consumer_FullName}</Text>
//             </View>

//             <View style={{ width: '33%' }}>
//               <Text style={styles?.textTitle}>Transformer Capacity</Text>
//               <Text style={styles?.normalText}> {details?.Consumer_NumberPrimary}</Text>
//             </View>
//           </View>

//           <View style={styles?.row}>
//             <View style={{ width: '33%' }}>
//               <Text style={styles?.textTitle}>Transformer Make</Text>
//               <Text style={styles?.normalText}> {details?.Consumer_Number}</Text>
//             </View>

//             <View style={{ width: '33%' }}>
//               <Text style={styles?.textTitle}>Serial Number</Text>
//               <Text style={styles?.normalText}> {details?.Consumer_FullName}</Text>
//             </View>

//             <View style={{ width: '33%' }}>
//               <Text style={styles?.textTitle}>Job Number</Text>
//               <Text style={styles?.normalText}> {details?.Consumer_NumberPrimary}</Text>
//             </View>
//           </View>

//           <View style={styles?.row}>
//             <View style={{ width: '33%' }}>
//               <Text style={styles?.textTitle}>Dispatch Number</Text>
//               <Text style={styles?.normalText}> {details?.Consumer_Number}</Text>
//             </View>

//             <View style={{ width: '33%' }}>
//               <Text style={styles?.textTitle}>Oil Level</Text>
//               <Text style={styles?.normalText}> {details?.Consumer_FullName}</Text>
//             </View>

//             <View style={{ width: '33%' }}>
//               <Text style={styles?.textTitle}>Oil Sortage</Text>
//               <Text style={styles?.normalText}> {details?.Consumer_NumberPrimary}</Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.footer} fixed>
//           <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
//           <Text> Status Reports {moment().format('YYYY-MM-DD')} </Text>
//           <Text>PMPeople</Text>
//         </View>
//       </Page>
//     </Document>
//   );
// };

const Pages = ({ details }) => {
  console.log();
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* PDF Header */}
        <View style={styles.header} fixed>
          <Image style={styles.logo} src={`${ImgUrl}${details?.SelectBranch?.ImgPath}`} />

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.headerText}>{details?.SelectOrg?.OrgName}</Text>
            <Text style={styles.subHeaderText}>Transactions</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.boldText}>{details?.SelectBranch?.BranchName}</Text>
            <Text style={styles.normalText}>{details?.SelectBranch?.Address}</Text>
            <Text style={styles.normalText}>{details?.SelectBranch?.City}</Text>
            <Text style={styles.normalText}>{details?.SelectBranch?.Phone}</Text>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={styles.boldText}>Transactions</Text>
          </View>

          {details?.list &&
            details?.list?.length > 0 &&
            details?.list?.map((item, index) => (
              <>
                <View style={styles.row}>
                  <View style={{ width: '15%' }}>
                    <Text style={{ ...styles.normalText, paddingLeft: 5 }}>
                      {fDate(item?.Date)}
                    </Text>
                  </View>
                  <View style={{ width: '50%' }}>
                    <Text style={styles.normalText}>{item?.Details}</Text>
                  </View>

                  <View style={{ width: '12%' }}>
                    <Text style={{ ...styles.normalText, textAlign: 'right' }}>
                      {item?.AccountAmount < 0 && item?.AccountAmount}
                    </Text>
                  </View>
                  <View style={{ width: '12%' }}>
                    <Text style={{ ...styles.normalText, textAlign: 'right' }}>
                      {item?.AccountAmount > 0 && item?.AccountAmount}
                    </Text>
                  </View>

                  <View style={{ width: '12%' }}>
                    <Text style={{ ...styles.normalText, textAlign: 'right' }}>
                      {item?.Balance}
                    </Text>
                  </View>
                </View>

                <View style={styles.br} />
              </>
            ))}
          <View break />
        </View>

        <View style={styles.footer} fixed>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />

          <Text>Transactions {fDate(moment())} </Text>

          <Text>{details?.SelectOrg?.OrgName}</Text>
        </View>
      </Page>
    </Document>
  );
};

const PDFGenerate = ({ list, setFlag }) => {
  const { SelectBranch } = useSelector((state) => state?.master?.BranchesList || {});
  const { SelectOrg } = useSelector((state) => state?.master?.OrgsList || {});

  useEffect(() => {
    const generatePDF = async () => {
      const blob = await pdf(<Pages details={{ SelectBranch, SelectOrg, list }} />).toBlob();

      const fileName = 'Transactions';
      FileSaver.saveAs(blob, `${fileName}.pdf`);
      setFlag(false);
    };

    generatePDF();
  }, []);

  // return (
  //   <div>
  //     <PDFViewer style={{ width: '100%', height: 'calc(150vh - 100px)' }}>
  //       <Pages
  //         details={{
  //           SelectBranch,
  //           SelectOrg,
  //           list,
  //         }}
  //       />
  //     </PDFViewer>
  //   </div>
  // );
};

export default PDFGenerate;
