import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DynamicMaintenanceIllustration } from '../Illustrations';

export const CustomMaintenance = () => (
  <Box
    sx={{
      height: '50vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }}
  >
    <DynamicMaintenanceIllustration
      sx={{
        height: 260,
        mb: 5,
      }}
    />

    <Typography variant="h5" sx={{ fontWeight: 600 }}>
      Under Maintenance
    </Typography>
  </Box>
);
