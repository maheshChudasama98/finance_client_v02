import React from 'react';
// import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Empty } from 'antd';

export const DataNotFound = () => (
    <Box sx={{ textAlign: 'center', p: 3, m: 'auto' , py: 10}}>
        <Empty image={Empty.PRESENTED_IMAGE_DEFAULT}
        //   image="/assets/DataNotFound/not_found.svg"
          description={
            <Typography variant="light">No Data Found!</Typography>
          }
        />
        {/* <img alt='Not Found' src="/assets/DataNotFound/not_found.svg" width="250px" style={{ verticalAlign: 'middle' }} /> */}
        {/* <Typography variant="h5" color="text.secondary" mt={2}>No data available</Typography> */}
    </Box>

);

DataNotFound.propTypes = {

}


