import React from 'react';
// import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Empty } from 'antd';

import { DynamicDataNotFoundIllustration } from '../Illustrations';

export const DataNotFound = () => (
  <Box sx={{ textAlign: 'center', p: 3, m: 'auto', py: 10 }}>
    <Empty
      // image={Empty.PRESENTED_IMAGE_DEFAULT}
      image={
        <DynamicDataNotFoundIllustration
          sx={{
            mx: 'auto',
            height: 260,
            my: { xs: 5, sm: 10 },
          }}
        />
      }
      // image="/assets/DataNotFound/not_found.svg"
      description={
        <Typography variant="light" color="text.primary">
          No Data Found!
        </Typography>
      }
    />
    {/* <img alt='Not Found' src="/assets/DataNotFound/not_found.svg" width="250px" style={{ verticalAlign: 'middle' }} /> */}
    {/* <Typography variant="h5" color="text.secondary" mt={2}>No data available</Typography> */}
  </Box>
);

DataNotFound.propTypes = {};
