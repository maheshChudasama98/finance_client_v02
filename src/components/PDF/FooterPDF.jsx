import React from 'react';
import { useSelector } from 'react-redux';

import { fDate } from 'src/utils/format-time';

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
});

const FooterPDF = ({ title }) => {
  const { SelectBranch } = useSelector((state) => state?.master?.BranchesList || {});
  return (
    <View style={styles.footer} fixed>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />

      <Text>
        {title || ''} {fDate(moment())}
      </Text>

      <Text>{SelectBranch?.BranchName}</Text>
    </View>
  );
};

export default FooterPDF;
