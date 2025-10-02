import React from 'react';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

export default function Analytics() {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} md={12}>
        <Card>
          <Typography variant="h6" sx={{ fontWeight: 700, m: 2 }}>
            Coming Soon
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );
}
