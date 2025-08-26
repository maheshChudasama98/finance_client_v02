import React, { useEffect } from 'react';

import moment from 'moment';

import FileSaver from 'file-saver';

import { pdf, Page, Font, Document, StyleSheet } from '@react-pdf/renderer';

import HeaderPDF from './HeaderPDF';
import FooterPDF from './FooterPDF';

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
});

const PagePDF = ({ title, ChildComponent, setFlag }) => {
  useEffect(() => {
    const generatePDF = async () => {
      const blob = await pdf(
        <Document>
          <Page size="A4" style={styles.page}>
            <HeaderPDF subHeader={title} />
            <ChildComponent />
            <FooterPDF title={title} />
          </Page>
        </Document>
      ).toBlob();

      const fileName = `${title}${moment().format('MMMM_YYYY')}`;
      FileSaver.saveAs(blob, `${fileName}.pdf`);
      setFlag(false);
    };
    generatePDF();
  }, []);

  return null;
};

export default PagePDF;
