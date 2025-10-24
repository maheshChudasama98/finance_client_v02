import React from 'react';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';

import { CustomMaintenance } from 'src/components/CustomComponents';

export default function Analytics() {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} md={12}>
        <Card>
          <CustomMaintenance />
        </Card>
      </Grid>
    </Grid>
  );
}
