import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DateRangePicker } from 'src/components/inputs';

export default function Index() {
  const [graphStart, setGraphStart] = useState();
  console.log(graphStart);

  return (
    <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
      <Box sx={{ justifyContent: 'space-between', display: 'flex' }}>
        <Typography variant="h4" sx={{ ml: 2 }} color="text.secondary">
          Analytics
        </Typography>

        <DateRangePicker
          label="Select Year"
          disableFuture
          views={['year']}
          openTo="year"
          format="YYYY"
          onChange={(event) => {
            setGraphStart(new Date(event).toLocaleDateString('en-GB'));
          }}
        />
      </Box>
    </Box>
  );
}

Index.propTypes = {};
