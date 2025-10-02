import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import LabelsAnalytics from './LabelsAnalytics';
import PartiesAnalytics from './PartiesAnalytics';
import AccountAnalytics from './AccountAnalytics';
import EnhancedAnalytics from './EnhancedAnalytics';
import CategoriesAnalytics from './CategoriesAnalytics';
import SubCategoriesAnalytics from './SubCategoriesAnalytics';

export default function Index() {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
      <Card>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h5">Financial</Typography>
              <Chip label="Analytics" color="primary" variant="outlined" />
            </Stack>
          }
          sx={{ mb: 2 }}
        />

        <Divider sx={{ mx: 2 }} />

        <Box
          sx={{
            px: 2,
            mb: 2,
          }}
        >
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            disableRipple
            value={tabValue}
            onChange={handleChange}
          >
            <Tab value={0} label="Enhanced Analytics" />
            <Tab value={1} label="Accounts" />
            <Tab value={2} label="Parties" />
            <Tab value={3} label="Categories" />
            <Tab value={4} label="Sub Categories" />
            <Tab value={5} label="Labels" />
          </Tabs>
        </Box>
      </Card>

      <Box sx={{ mt: 2 }}>
        {tabValue === 0 && <EnhancedAnalytics />}
        {tabValue === 1 && <AccountAnalytics />}
        {tabValue === 2 && <PartiesAnalytics />}
        {tabValue === 3 && <CategoriesAnalytics />}
        {tabValue === 4 && <SubCategoriesAnalytics />}
        {tabValue === 5 && <LabelsAnalytics />}
      </Box>
    </Box>
  );
}

Index.propTypes = {};
