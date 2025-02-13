import React, { useEffect, } from "react";
import { useDispatch } from "react-redux";

import { fText } from "src/utils/format-text";
import { fDateTime } from "src/utils/format-time";

import { DateFormat, ProjectName } from "src/constance";
import { FetchNoteService } from "src/Services/Feeders.Services";

import ButtonLoader from "src/components/Loaders/ButtonLoader";

import moment from "moment";

import { saveAs } from 'file-saver';

import { pdf, Font, Page, Text, View, Image, Document, StyleSheet, } from "@react-pdf/renderer";


// Define font if needed
Font.register(
  {
    family: "Roboto",
    fonts: [
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
        fontWeight: "light",
      },
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
        fontWeight: "normal",
      },
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
        fontWeight: "bold",
      },
    ],
  },

);

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: "0px 20px",
    fontFamily: "Roboto",
    fontWeight: "normal",
    fontSize: 12,
    paddingBottom: 65,
    // border: "solid 1px red",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 5,
    // borderBottom: "1 solid #d30000",
    paddingBottom: 10,
  },
  footer: {
    paddingTop: 15,
    borderTop: "1 solid #eee",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
  },
  headerText: {
    marginTop: 10,
    fontSize: "20px",
    fontFamily: "Roboto",
    alignItems: "end",
    fontWeight: "bold",
  },
  subHeaderText: { fontSize: 16, float: "right" },
  logo: { height: "60px" },
  boldText: {
    margin: "2px 0px",
    fontSize: 12,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  normalText: {
    margin: "2px 0px",
    fontSize: 10,
    fontFamily: "Roboto",
    fontWeight: "normal",
  },
  lightText: {
    margin: "2px 0px",
    fontSize: 10,
    fontFamily: "Roboto",
    fontWeight: "light",
  },
  textTitle: {
    // margin: "2px 0px",
    fontSize: 12,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#999"
  },
  row: {
    flexDirection: "row",
    margin: "5px 0"
  },
  br: {
    borderBottom: "1 solid #eee",
    margin: "5px 0"
  },

  blueHeader: {
    fontSize: 12,
    // padding: 5,
    marginTop: "40px",
    marginBottom: "7px",
    color: "#000",
    textTransform: "uppercase",
    // backgroundColor: "#4f81bc",
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
});

const NoticePDF = ({ details, notice, noteArray }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      {/* PDF Header */}
      <View style={styles.header} fixed>

        <View style={{ alignItems: "flex-end" }}>
          <View style={{ marginBottom: 0 }}>
            <Text style={styles.boldText}>From</Text>
            <Text style={styles.normalText}>Kuvadva</Text>
            <Text style={styles.normalText}>National Highway, Kuvadava, Rajkot - 360023 </Text>
          </View>
        </View>

        <Image
          style={styles.logo}
          src={`/org/${details?.orgId}/logo/${details?.orgImg}`}
        />
      </View>

      <View style={styles.content}>

        <View style={{ marginBottom: 15 }}>
          <Text style={styles.boldText}>
            Feeder List
          </Text>
        </View>

        <View style={styles.row}>
          <View style={{ width: "10%" }}>
            <Text style={{ ...styles.boldText, paddingLeft: 5 }}>#</Text>
          </View>
          <View style={{ width: "30%", }}>
            <Text style={styles.boldText}>
              Feeder name
            </Text>
          </View>

          <View style={{ width: "30%", }}>
            <Text style={styles.boldText}>
              Start Date time
            </Text>
          </View>
          <View style={{ width: "30%" }}>
            <Text style={styles.boldText}>
              End Date time
            </Text>
          </View>
        </View>

        <View style={styles.br} />

        {
          noteArray && noteArray.length > 0 && noteArray.map((note, index) => (
            <>

              <View style={styles.row}>
                <View style={{ width: "10%" }}>
                  <Text style={{ ...styles.normalText, paddingLeft: 5 }}>{index + 1}</Text>
                </View>
                <View style={{ width: "30%" }}>
                  <Text style={styles.normalText}>
                    {fText(note?.Feeder?.Feeder_Name)} {`(${note?.Feeder?.Feeder_Type})`}
                  </Text>
                </View>

                <View style={{ width: "30%" }}>
                  <Text style={styles.normalText}>
                    {fDateTime(note?.Power_Off)}
                  </Text>
                </View>
                <View style={{ width: "30%" }}>
                  <Text style={styles.normalText}>
                    {fDateTime(note?.Power_On)}
                  </Text>
                </View>

              </View>
              <View style={styles.br} />
            </>
          ))
        }

        <View style={{ marginTop: 15 }}>
          <Text style={styles.boldText}>Note :</Text>
        </View>
        <Text style={styles.normalText}>{notice?.Notice_Desc}</Text>
        <View break />

      </View>


      <View style={styles.footer} fixed>
        <Text
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />

        <Text>
          {moment().format(DateFormat)}{" "}
        </Text>

        <Text>{ProjectName}</Text>
      </View>

    </Page >
  </Document >
);


const PDFGenerate = ({ setFlag, notice }) => {
  const dispatch = useDispatch();

  useEffect(() => {

    // async (cb) => {
    //   const blob = await pdf(<MyDocument />).toBlob();
    //   saveAs(blob, `${tempObject?.prShortName}_StatusReport_${tempObject?.prStatusDate}.pdf`);
    //   await setFlag(false);
    // }

    dispatch(FetchNoteService({ Notice_Id: notice?.Notice_Id },
      async (cb) => {
        const blob = await pdf(<NoticePDF
          notice={notice}
          noteArray={cb} />).toBlob();
        saveAs(blob, `Report_${moment().format(DateFormat)}.pdf`);
        await setFlag();
      }
    ));

  }, []);



  return (
    <div>

      <ButtonLoader />

      {/* <PDFViewer style={{ width: '100%', height: 'calc(150vh - 100px)' }}>
        <NoticePDF
          details={{

          }}
          notice={notice}
          noteArray={noteArray}
        />
      </PDFViewer> */}
    </div >
  );
};

export default PDFGenerate;
