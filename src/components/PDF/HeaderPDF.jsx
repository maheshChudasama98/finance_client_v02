import React from 'react';

import { ImgUrl } from 'src/constance';

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: '2 solid #5BC43A',
  },
  headerText: {
    fontSize: '20px',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#5BC43A',
  },
  subHeaderText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  logo: {
    height: '40px',
    width: 'auto',
  },
});

const HeaderPDF = ({ subHeader, SelectBranch }) => (
  <View style={styles.header} fixed>
    <Image style={styles.logo} src={`${ImgUrl}${SelectBranch?.ImgPath}`} />
    <View style={{ alignItems: 'flex-end' }}>
      <Text style={styles.headerText}>{SelectBranch?.BranchName}</Text>
      <Text style={styles.subHeaderText}>{subHeader || ''}</Text>
    </View>
  </View>
);

export default HeaderPDF;
