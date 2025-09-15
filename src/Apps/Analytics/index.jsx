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

import { MonthList } from 'src/constance';

import { DateRangePicker } from 'src/components/inputs';
import { CustomSelect } from 'src/components/CustomComponents';

// Import our custom components
import AccountAnalytics from './AccountAnalytics';

export default function Index() {
  const [categorySelectedDate, setCategorySelectedDate] = useState(new Date());
  const [tabValue, setTabValue] = useState(1);
  const [duration, setDuration] = useState('JAN');

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
      {/* Header Card */}
      <Card>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h5">Financial Analytics</Typography>
              <Chip
                label={`${new Date(categorySelectedDate).getFullYear()}`}
                color="primary"
                variant="outlined"
              />
            </Stack>
          }
          sx={{ mb: 2 }}
          action={
            <DateRangePicker
              disableFuture
              label=""
              openTo="year"
              format="YYYY"
              views={['year']}
              value={categorySelectedDate}
              onChange={(event) => {
                setCategorySelectedDate(event);
              }}
              sx={{ width: 150 }}
            />
          }
        />

        <Divider sx={{ mx: 2 }} />

        <Box
          sx={{
            display: { xs: 'flex' },
            justifyContent: 'space-between',
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
            <Tab value={1} label="Accounts" />
            <Tab value={2} label="Parties" />
            <Tab value={3} label="Categories" />
            <Tab value={4} label="Sub Categories" />
            <Tab value={5} label="Labels" />
          </Tabs>

          <Box>
            <CustomSelect
              valueKey="Key"
              labelKey="Value"
              size="small"
              sx={{ width: 120, placeItems: 'end', mt: 2 }}
              menuList={MonthList}
              defaultValue={duration}
              callBackAction={(value) => setDuration(value)}
            />
          </Box>
        </Box>
      </Card>

      <Box sx={{ mt: 2 }}>{tabValue === 1 && <AccountAnalytics />}</Box>

      {/* Main Content */}
      {/* <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
       
        <AnalyticsSidebar
          title={`All ${getTabTitle()}`}
          icon={getTabIcon(tabValue)}
          items={currentData}
          selectedItem={selectedItem}
          onItemSelect={handleItemSelect}
          showTrends
        />

       
        <Box sx={{ flex: 1 }}>
          <AnalyticsOverview data={currentData} title={getTabTitle()} />

          <AnalyticsCharts
            data={currentData}
            title={getTabTitle()}
            monthlyTrends={analyticsData.monthlyTrends || []}
            selectedItem={selectedItem}
          />

          <ItemDetails
            selectedItem={selectedItem}
            tabTitle={getTabTitle()}
            monthlyTrends={analyticsData.monthlyTrends || []}
            getTabIcon={() => getTabIcon(tabValue)}
          />
        </Box>
      </Box> */}
    </Box>
  );
}

Index.propTypes = {};
