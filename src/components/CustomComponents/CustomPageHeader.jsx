import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

export const CustomPageHeader = ({ dataArray = [], ...props }) => {
  console.log();

  return (
    <>
      {dataArray?.length > 0 && (
        <Box
          sx={{
            mb: 2,
            backgroundColor: (theme) => `${theme?.palette?.grey?.[0]}`,
            padding: 2,
            borderRadius: '10px',
          }}
        >
          <Grid container spacing={2} sx={{}}>
            {dataArray?.length > 0 &&
              dataArray?.map((item, key) => (
                <Grid item xs={12} md={6} lg={3}>
                  <Box key={key} sx={{ flex: 1 }}>
                    <Typography
                      variant="body"
                      fontWeight={600}
                      fontSize={12}
                      color="text.secondary"
                    >
                      {item?.title || ''}
                    </Typography>

                    <Typography variant="h5">{item?.value || ''}</Typography>
                  </Box>
                </Grid>
              ))}
          </Grid>
        </Box>
      )}
    </>
  );
};

CustomPageHeader.propTypes = {};
