import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';

import { SettingGetService, SettingModifyService } from 'src/Services/User.Services';
import { CurrencyList, DateFormatList, TimeDurationList, SettingDurationList } from 'src/constance';

import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { CheckboxForm, TextFieldForm, AutoCompleteSelectMenu } from 'src/components/inputs';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

export default function Index() {
  const dispatch = useDispatch();
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [editObject, setEditObject] = useState({});
  const [apiFlag, setApiFlag] = useState(true);

  const ActionSubmit = (values, flag = true) => {
    if (flag) {
      setFormSubmitLoader(true);
    }

    localStorage.setItem('DefaultTimeFrame', values?.DefaultTimeFrame);
    localStorage.setItem('DefaultDuration', values?.DefaultDuration);
    localStorage.setItem('DefaultDateFormat', values?.DefaultDateFormat);
    localStorage.setItem('DefaultCurrency', values?.DefaultCurrency);
    localStorage.setItem('AmountHide', values?.AmountHide ? 1 : 0);

    dispatch(
      SettingModifyService(values, (res) => {
        setFormSubmitLoader(false);
        if (res?.status) {
          setApiFlag(!apiFlag);
        }
      })
    );
  };

  const handleDefaultSubmit = () => {
    const defaultValues = {
      DefaultTimeFrame: 'MONTH',
      DefaultDuration: 'Last_Thirty_Days',
      DefaultDateFormat: 'DD/MM/YYYY',
      DefaultCurrency: 'INR',
      AmountHide: true,
    };
    ActionSubmit(defaultValues, false);
  };

  useEffect(() => {
    dispatch(
      SettingGetService((res) => {
        if (res?.status) {
          setEditObject(res.data);
        }
      })
    );
  }, [apiFlag]);

  return (
    <Box sx={{ paddingX: { xs: 0, sm: 2 } }}>
      <Card>
        <CardHeader title="Setting" sx={{ marginBottom: 2 }} />
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginX: 2 }} />
        <Formik
          enableReinitialize
          initialValues={{
            DefaultTimeFrame: editObject?.DefaultTimeFrame || 'MONTH',
            DefaultDuration: editObject?.DefaultDuration || 'Last_Thirty_Days',
            DefaultDateFormat: editObject?.DefaultDateFormat || 'DD/MM/YYYY',
            DefaultCurrency: editObject?.DefaultCurrency || 'INR',
            AmountHide: editObject?.AmountHide === 0 ? false : true || true,
          }}
          validationSchema={Yup.object().shape({
            DefaultTimeFrame: Yup.string().required('Default Time Frame required.'),
            DefaultDuration: Yup.string().required('Default Duration is required.'),
            DefaultDateFormat: Yup.string().required('Default Date Format is required.'),
            DefaultCurrency: Yup.string().required('Default Currency is required.'),
            AmountHide: Yup.bool().required('Amount Hide is required.'),
          })}
          onSubmit={ActionSubmit}
        >
          {(props) => {
            const { handleSubmit, dirty, resetForm, values } = props;
            return (
              <Form>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    paddingY: 2,
                    paddingX: 2,
                  }}
                >
                  <Grid xs={12}>
                    <Box sx={{ float: 'right', display: 'flex' }}>
                      {(values.AmountHide !== true ||
                        values.DefaultCurrency !== 'INR' ||
                        values.DefaultTimeFrame !== 'MONTH' ||
                        values.DefaultDuration !== 'Last_Thirty_Days' ||
                        values.DefaultDateFormat !== 'DD/MM/YYYY') && (
                        <Button
                          variant="contained"
                          sx={{ marginX: 1 }}
                          onClick={handleDefaultSubmit}
                          color="info"
                        >
                          Reset to Default
                        </Button>
                      )}
                    </Box>
                  </Grid>

                  <Grid xs={12} md={4}>
                    <AutoCompleteSelectMenu
                      formik={props}
                      label="Time Frame"
                      field="DefaultTimeFrame"
                      menuList={TimeDurationList}
                      valueKey="Key"
                      labelKey="Value"
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <AutoCompleteSelectMenu
                      formik={props}
                      label="Duration"
                      field="DefaultDuration"
                      menuList={SettingDurationList}
                      valueKey="Value"
                      labelKey="Key"
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <AutoCompleteSelectMenu
                      formik={props}
                      label="Date Format"
                      field="DefaultDateFormat"
                      menuList={DateFormatList}
                      valueKey="Key"
                      labelKey="Value"
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <AutoCompleteSelectMenu
                      formik={props}
                      label="Currency"
                      field="DefaultCurrency"
                      menuList={CurrencyList}
                      valueKey="Value"
                      labelKey="Key"
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <CheckboxForm formik={props} label="Amount Hide" field="AmountHide" />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <TextFieldForm
                      required={false}
                      formik={props}
                      label="Description"
                      field="Description"
                      multiline
                      rows={3}
                      maxRows={3}
                    />
                  </Grid>

                  <Grid xs={12}>
                    <Box sx={{ float: 'right', display: 'flex' }}>
                      {dirty && (
                        <Button
                          variant="outlined"
                          sx={{ marginX: 1 }}
                          onClick={() => {
                            resetForm();
                          }}
                          color="CancelButton"
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
                        >
                          Save
                        </Button>
                      ) : (
                        <ButtonLoader />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Card>
    </Box>
  );
}

Index.propTypes = {};
