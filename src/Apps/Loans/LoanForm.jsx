import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { LongsModifyService } from 'src/Services/Meter.Services';
import { LoanTypes, LoanStatus, LoanRepaymentFrequency } from 'src/constance';

import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { DateAndTime, TextFieldForm, AutoCompleteSelectMenu } from 'src/components/inputs';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

export default function LoanForm({ backAction, editObject, deleteAction }) {
  const dispatch = useDispatch();
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);

  const handleSubmit = (values) => {
    setFormSubmitLoader(true);

    dispatch(
      LongsModifyService(values, (res) => {
        setFormSubmitLoader(false);
        if (res?.status) {
          backAction();
        }
      })
    );
  };

  const handleDelete = () => {
    if (deleteAction && editObject) {
      deleteAction(editObject);
    }
  };

  const handleReset = (resetForm) => {
    resetForm();
  };

  const initialValues = {
    LoanName: editObject?.LoanName || '',
    LoanType: editObject?.LoanType || 'personal_loan',
    LenderName: editObject?.LenderName || '',
    LoanAmount: editObject?.LoanAmount || 0,
    PreAmount: editObject?.PreAmount || 0,
    InterestRate: editObject?.InterestRate || 0,
    EmiAmount: editObject?.EmiAmount || 0,
    StartDate: editObject?.StartDate || null,
    EndDate: editObject?.EndDate || null,
    DueDate: editObject?.DueDate || 1,
    AccountId: editObject?.AccountId || '',
    Status: editObject?.Status || 'Ongoing',
    RepaymentFrequency: editObject?.RepaymentFrequency || 'Monthly',
    Description: editObject?.Description || '',
  };

  const validationSchema = Yup.object().shape({
    LoanName: Yup.string().trim().required('Loan name is required.'),
    LoanType: Yup.string().trim().required('Loan type is required.'),
    LenderName: Yup.string().trim().optional(),
    LoanAmount: Yup.number()
      .min(1, 'Loan amount must be greater than 0')
      .required('Loan amount is required.'),
    PreAmount: Yup.number().min(0, 'Pre-amount cannot be negative').optional(),
    InterestRate: Yup.number()
      .min(0, 'Interest rate cannot be negative')
      .max(100, 'Interest rate cannot exceed 100%')
      .required('Interest rate is required.'),
    EmiAmount: Yup.number()
      .min(0, 'EMI amount cannot be negative')
      .required('EMI amount is required.'),
    StartDate: Yup.string().required('Start date is required.'),
    EndDate: Yup.string().required('End date is required.'),
    DueDate: Yup.string().required('Due date is required.'),
    AccountId: Yup.number().nullable(),
    Status: Yup.string().required('Status is required.'),
    RepaymentFrequency: Yup.string().required('Repayment frequency is required.'),
    Description: Yup.string().trim().nullable(),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formikProps) => {
        const { dirty, resetForm, values } = formikProps;

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
              {/* Basic Loan Information */}
              <Grid item xs={12}>
                <Box sx={{ mb: 0, mx: 0.5 }}>
                  <h4 style={{ margin: 0 }}>Basic Information</h4>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextFieldForm formik={formikProps} label="Loan name" field="LoanName" required />
              </Grid>

              <Grid item xs={12} md={4}>
                <AutoCompleteSelectMenu
                  formik={formikProps}
                  label="Loan Type"
                  field="LoanType"
                  menuList={LoanTypes}
                  valueKey="key"
                  labelKey="value"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextFieldForm
                  required={false}
                  formik={formikProps}
                  label="Lender name"
                  field="LenderName"
                />
              </Grid>

              {/* Financial Details */}
              <Grid item xs={12}>
                <Box sx={{ mt: 0, mx: 0.5 }}>
                  <h4 style={{ margin: 0 }}>Financial Details</h4>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextFieldForm
                  required
                  type="number"
                  formik={formikProps}
                  label="Loan Amount"
                  field="LoanAmount"
                  disabled={editObject?.LoanId}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextFieldForm
                  required={false}
                  type="number"
                  formik={formikProps}
                  label="Pre-Amount"
                  field="PreAmount"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextFieldForm
                  type="number"
                  formik={formikProps}
                  label="Interest Rate (%)"
                  field="InterestRate"
                  disabled={editObject?.LoanId}
                  required
                  InputProps={{
                    endAdornment: '%',
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextFieldForm
                  required
                  type="number"
                  formik={formikProps}
                  label="EMI Amount"
                  field="EmiAmount"
                  disabled={editObject?.LoanId}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <AutoCompleteSelectMenu
                  formik={formikProps}
                  menuList={LoanStatus}
                  label="Status"
                  field="Status"
                  valueKey="key"
                  labelKey="value"
                  required
                />
              </Grid>

              {/* Dates and Timeline */}
              <Grid item xs={12}>
                <Box sx={{ mb: 0, mx: 0.5 }}>
                  <h4 style={{ margin: 0 }}>Timeline</h4>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <DateAndTime
                  required
                  label="Start Date"
                  field="StartDate"
                  formik={formikProps}
                  disableFuture={false}
                  defaultValue={values.StartDate}
                  callBackAction={() => {}}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <DateAndTime
                  required
                  label="End Date"
                  field="EndDate"
                  formik={formikProps}
                  disableFuture={false}
                  defaultValue={values.EndDate}
                  callBackAction={() => {}}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <AutoCompleteSelectMenu
                  required
                  label="Repayment Frequency"
                  field="RepaymentFrequency"
                  formik={formikProps}
                  valueKey="key"
                  labelKey="value"
                  menuList={LoanRepaymentFrequency}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <AutoCompleteSelectMenu
                  formik={formikProps}
                  label="Due Date"
                  field="DueDate"
                  menuList={Array.from({ length: 30 }, (_, i) => ({ key: i + 1, value: i + 1 }))}
                  valueKey="key"
                  labelKey="value"
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <Box sx={{ mt: 1, mx: 0.5 }}>
                  <h4 style={{ margin: 0 }}>Additional Details</h4>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextFieldForm
                  formik={formikProps}
                  label="Description"
                  field="Description"
                  multiline
                  rows={4}
                  maxRows={6}
                />
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    gap: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 2,
                  }}
                >
                  {editObject?.AccountId && (
                    <Button
                      variant="contained"
                      onClick={handleDelete}
                      color="error"
                      disabled={formSubmitLoader}
                    >
                      Delete
                    </Button>
                  )}

                  {dirty && (
                    <Button
                      variant="outlined"
                      onClick={() => handleReset(resetForm)}
                      disabled={formSubmitLoader}
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
                      color="primary"
                    >
                      {editObject?.LoanId ? 'Update' : 'Save'}
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
  );
}

LoanForm.propTypes = {
  backAction: PropTypes.func.isRequired,
  editObject: PropTypes.shape({
    AccountId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    LoanId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    LoanName: PropTypes.string,
    LoanType: PropTypes.string,
    LenderName: PropTypes.string,
    LoanAmount: PropTypes.number,
    PreAmount: PropTypes.number,
    InterestRate: PropTypes.number,
    EmiAmount: PropTypes.number,
    MaxAmount: PropTypes.number,
    StartDate: PropTypes.string,
    EndDate: PropTypes.string,
    Status: PropTypes.string,
    RepaymentFrequency: PropTypes.string,
    Description: PropTypes.string,
  }),
  deleteAction: PropTypes.func,
};

LoanForm.defaultProps = {
  editObject: null,
  deleteAction: null,
};
