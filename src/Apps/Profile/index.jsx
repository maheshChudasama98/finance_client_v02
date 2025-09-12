import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { ImgUrl } from 'src/constance';
import { RoleListService } from 'src/Services/org/Org.Services';
import {
  UserModifyService,
  SettingGetService,
  SettingModifyService,
} from 'src/Services/User.Services';

import Iconify from 'src/components/iconify';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { ImagePicker, TextFieldForm, AutoCompleteSelectMenu } from 'src/components/inputs';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Profile Stats Component
function ProfileStats({ userDetails }) {
  const stats = [
    {
      label: 'Account Status',
      value: userDetails?.IsActive ? 'Active' : 'Inactive',
      color: userDetails?.IsActive ? 'success' : 'error',
      icon: 'eva:checkmark-circle-2-fill',
    },
    {
      label: 'Member Since',
      value: userDetails?.CreatedAt ? new Date(userDetails.CreatedAt).toLocaleDateString() : 'N/A',
      color: 'info',
      icon: 'eva:calendar-fill',
    },
    {
      label: 'Last Login',
      value: userDetails?.LastLogin ? new Date(userDetails.LastLogin).toLocaleDateString() : 'N/A',
      color: 'warning',
      icon: 'eva:clock-fill',
    },
    {
      label: 'Role',
      value: userDetails?.RoleName || 'User',
      color: 'primary',
      icon: 'eva:person-fill',
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <Iconify icon={stat.icon} width={24} height={24} color={`${stat.color}.main`} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {stat.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stat.label}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

// Activity Timeline Component
function ActivityTimeline({ activities = [] }) {
  const defaultActivities = [
    { action: 'Profile Updated', time: '2 hours ago', type: 'update' },
    { action: 'Password Changed', time: '1 week ago', type: 'security' },
    { action: 'Login from New Device', time: '2 weeks ago', type: 'login' },
    { action: 'Account Created', time: '1 month ago', type: 'create' },
  ];

  const activitiesToShow = activities.length > 0 ? activities : defaultActivities;

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Iconify icon="eva:activity-fill" width={20} height={20} sx={{ mr: 1 }} />
        Recent Activity
      </Typography>
      <Stack spacing={2}>
        {activitiesToShow.map((activity, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1,
              borderRadius: 1,
              bgcolor: 'grey.50',
            }}
          >
            <Box
              sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mr: 2 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {activity.action}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {activity.time}
              </Typography>
            </Box>
            <Chip label={activity.type} size="small" color="primary" variant="outlined" />
          </Box>
        ))}
      </Stack>
    </Card>
  );
}

export default function Index({ backAction, editObject }) {
  const dispatch = useDispatch();
  const [imgUrl, setImgUrl] = useState(null);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [rolesList, setRolesList] = useState([]);
  const [settings, setSettings] = useState({});
  const [settingsLoading, setSettingsLoading] = useState(false);

  const { userDetails = {} } = useSelector((state) => state?.auth);

  // Fetch roles and settings on component mount
  useEffect(() => {
    dispatch(
      RoleListService((res) => {
        if (res?.status) {
          setRolesList(res?.data || []);
        }
      })
    );

    dispatch(
      SettingGetService((res) => {
        if (res?.status) {
          setSettings(res?.data || {});
        }
        setSettingsLoading(false);
      })
    );
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const ActionSubmit = (values) => {
    setFormSubmitLoader(true);
    const formData = new FormData();
    if (imgUrl) {
      formData.append('ImgPath', imgUrl);
    }
    formData.append('FirstName', values.FirstName);
    formData.append('LastName', values.LastName);
    formData.append('UserEmail', values.UserEmail);
    formData.append('UserNumber', values.UserNumber);
    formData.append('Language', values.Language);
    formData.append('RoleId', values.RoleId);

    if (editObject?.UserId) {
      formData.append('EditUserId', editObject?.UserId);
    }

    dispatch(
      UserModifyService(formData, (res) => {
        setFormSubmitLoader(false);
        if (res?.status) {
          backAction();
        }
      })
    );
  };

  const SettingsSubmit = (values) => {
    setSettingsLoading(true);
    dispatch(
      SettingModifyService(values, (res) => {
        setSettingsLoading(false);
        if (res?.status) {
          // Handle success
        }
      })
    );
  };

  return (
    <Box sx={{ width: 1, maxWidth: 1200, mx: 'auto' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Profile Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your personal information, preferences, and account settings
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:arrow-back-fill" />}
            onClick={backAction}
            sx={{ minWidth: 120 }}
          >
            Back
          </Button>
        </Stack>

        {/* Profile Stats */}
        <ProfileStats userDetails={userDetails} />
      </Box>

      {/* Main Content with Tabs */}
      <Card sx={{ overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab
            label="Personal Information"
            icon={<Iconify icon="eva:person-fill" />}
            iconPosition="start"
          />
          <Tab
            label="Account Settings"
            icon={<Iconify icon="eva:settings-2-fill" />}
            iconPosition="start"
          />
          <Tab
            label="Preferences"
            icon={<Iconify icon="eva:options-2-fill" />}
            iconPosition="start"
          />
          <Tab label="Activity" icon={<Iconify icon="eva:activity-fill" />} iconPosition="start" />
        </Tabs>

        {/* Personal Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Formik
            enableReinitialize
            initialValues={{
              ImgPath: userDetails?.ImgPath ? `${ImgUrl || ''}${userDetails.ImgPath}` : '' || '',
              FirstName: userDetails?.FirstName || '',
              LastName: userDetails?.LastName || '',
              UserEmail: userDetails?.Email || '',
              UserNumber: userDetails?.Mobile || '',
              Language: userDetails?.Language || 'EN',
              RoleId: userDetails?.RoleId || '',
            }}
            validationSchema={Yup.object().shape({
              FirstName: Yup.string().required('First Name is required.'),
              LastName: Yup.string().required('Last Name is required.'),
              UserEmail: Yup.string().required('Email is required.'),
              UserNumber: Yup.string()
                .matches(/^[0-9]+$/, 'Must be a valid number.')
                .nullable(),
              RoleId: Yup.number().required('Role is required.'),
            })}
            onSubmit={ActionSubmit}
          >
            {(props) => {
              const { handleSubmit, setFieldValue, dirty, resetForm } = props;
              return (
                <Form>
                  <Grid container spacing={3}>
                    {/* Profile Image Section */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ p: 3, textAlign: 'center', height: 'fit-content' }}>
                        <ImagePicker
                          formik={props}
                          label="Profile Image"
                          field="ImgPath"
                          heightWidth={200}
                          imageReturn={(e) => {
                            setFieldValue('ImgPath', e);
                            setImgUrl(e);
                          }}
                        />

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                          Allowed *.jpeg, *.jpg, *.png max size of 1 Mb
                        </Typography>

                        <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                          {userDetails?.FirstName} {userDetails?.LastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {userDetails?.Email}
                        </Typography>
                      </Card>
                    </Grid>

                    {/* Form Fields Section */}
                    <Grid item xs={12} md={8}>
                      <Card sx={{ p: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                        >
                          <Iconify icon="eva:edit-fill" width={20} height={20} sx={{ mr: 1 }} />
                          Personal Details
                        </Typography>

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextFieldForm formik={props} label="First Name" field="FirstName" />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextFieldForm formik={props} label="Last Name" field="LastName" />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextFieldForm
                              disabled
                              formik={props}
                              label="Email"
                              field="UserEmail"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextFieldForm
                              disabled
                              required={false}
                              formik={props}
                              type="number"
                              label="Mobile Number"
                              field="UserNumber"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <AutoCompleteSelectMenu
                              formik={props}
                              field="Language"
                              label="Language"
                              menuList={[
                                { key: 'EN', value: 'English' },
                                { key: 'ES', value: 'Spanish' },
                                { key: 'FR', value: 'French' },
                                { key: 'DE', value: 'German' },
                              ]}
                              valueKey="key"
                              labelKey="value"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <AutoCompleteSelectMenu
                              formik={props}
                              field="RoleId"
                              label="Role"
                              menuList={rolesList}
                              valueKey="key"
                              labelKey="value"
                            />
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                          {dirty && (
                            <Button
                              variant="outlined"
                              onClick={() => resetForm()}
                              color="error"
                              startIcon={<Iconify icon="eva:close-fill" />}
                            >
                              Cancel
                            </Button>
                          )}
                          {!formSubmitLoader ? (
                            <Button
                              variant="contained"
                              type="submit"
                              disabled={!dirty}
                              onClick={handleSubmit}
                              color="success"
                              startIcon={<Iconify icon="eva:checkmark-fill" />}
                            >
                              Update Profile
                            </Button>
                          ) : (
                            <ButtonLoader />
                          )}
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        </TabPanel>

        {/* Account Settings Tab */}
        <TabPanel value={tabValue} index={1}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Iconify icon="eva:settings-2-fill" width={20} height={20} sx={{ mr: 1 }} />
              Account Settings
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, border: 1, borderColor: 'grey.300' }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Security Settings
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={<Iconify icon="eva:lock-fill" />}
                      fullWidth
                    >
                      Change Password
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Iconify icon="eva:shield-fill" />}
                      fullWidth
                    >
                      Two-Factor Authentication
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Iconify icon="eva:key-fill" />}
                      fullWidth
                    >
                      API Keys
                    </Button>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, border: 1, borderColor: 'grey.300' }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Privacy Settings
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={<Iconify icon="eva:eye-fill" />}
                      fullWidth
                    >
                      Privacy Controls
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Iconify icon="eva:download-fill" />}
                      fullWidth
                    >
                      Download Data
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Iconify icon="eva:trash-2-fill" />}
                      fullWidth
                      color="error"
                    >
                      Delete Account
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Card>
        </TabPanel>

        {/* Preferences Tab */}
        <TabPanel value={tabValue} index={2}>
          <Formik
            enableReinitialize
            initialValues={{
              DefaultTimeFrame: settings?.DefaultTimeFrame || 'MONTH',
              DefaultDuration: settings?.DefaultDuration || 'Last_Thirty_Days',
              DefaultDateFormat: settings?.DefaultDateFormat || 'DD/MM/YYYY',
              DefaultCurrency: settings?.DefaultCurrency || 'INR',
              AmountHide: settings?.AmountHide || false,
            }}
            onSubmit={SettingsSubmit}
          >
            {(props) => (
              <Form>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <Iconify icon="eva:options-2-fill" width={20} height={20} sx={{ mr: 1 }} />
                    User Preferences
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <AutoCompleteSelectMenu
                        formik={props}
                        field="DefaultTimeFrame"
                        label="Default Time Frame"
                        menuList={[
                          { key: 'DATE', value: 'Daily' },
                          { key: 'WEEK', value: 'Weekly' },
                          { key: 'MONTH', value: 'Monthly' },
                          { key: 'YEAR', value: 'Yearly' },
                        ]}
                        valueKey="key"
                        labelKey="value"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <AutoCompleteSelectMenu
                        formik={props}
                        field="DefaultDuration"
                        label="Default Duration"
                        menuList={[
                          { key: 'Last_Seven_Days', value: 'Last 7 Days' },
                          { key: 'Last_Thirty_Days', value: 'Last 30 Days' },
                          { key: 'Six_Month', value: 'Last 6 Months' },
                          { key: 'This_Year', value: 'This Year' },
                          { key: 'Last_Five_Year', value: 'Last 5 Years' },
                          { key: 'All', value: 'All' },
                        ]}
                        valueKey="key"
                        labelKey="value"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <AutoCompleteSelectMenu
                        formik={props}
                        field="DefaultDateFormat"
                        label="Date Format"
                        menuList={[
                          { key: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
                          { key: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
                          { key: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
                          { key: 'DD-MM-YYYY', value: 'DD-MM-YYYY' },
                        ]}
                        valueKey="key"
                        labelKey="value"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <AutoCompleteSelectMenu
                        formik={props}
                        field="DefaultCurrency"
                        label="Default Currency"
                        menuList={[
                          { key: 'USD', value: 'US Dollar (USD)' },
                          { key: 'EUR', value: 'Euro (EUR)' },
                          { key: 'INR', value: 'Indian Rupee (INR)' },
                          { key: 'GBP', value: 'British Pound (GBP)' },
                        ]}
                        valueKey="key"
                        labelKey="value"
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    {!settingsLoading ? (
                      <Button
                        variant="contained"
                        type="submit"
                        startIcon={<Iconify icon="eva:save-fill" />}
                      >
                        Save Preferences
                      </Button>
                    ) : (
                      <ButtonLoader />
                    )}
                  </Box>
                </Card>
              </Form>
            )}
          </Formik>
        </TabPanel>

        {/* Activity Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <ActivityTimeline />
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Iconify icon="eva:pie-chart-fill" width={20} height={20} sx={{ mr: 1 }} />
                  Account Overview
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Profile Completion
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={85}
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      85% Complete
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Account Health
                    </Typography>
                    <Chip label="Excellent" color="success" size="small" />
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
    </Box>
  );
}
