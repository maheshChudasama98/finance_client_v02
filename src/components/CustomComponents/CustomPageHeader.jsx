import React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
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
          <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
            {dataArray?.length > 0 &&
              dataArray?.map((item, key) => (
                <Box key={key} sx={{ flex: 1 }}>
                  <Typography
                    sx={{}}
                    variant="body"
                    fontWeight={600}
                    fontSize={14}
                    color="text.secondary"
                  >
                    {item?.title || ''}
                  </Typography>

                  <Typography variant="h4">{item?.value || ''}</Typography>
                </Box>
              ))}
          </Stack>
        </Box>
      )}
    </>
  );
};

CustomPageHeader.propTypes = {};
