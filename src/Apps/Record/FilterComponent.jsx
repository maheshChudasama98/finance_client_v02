// import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Unstable_Grid2';

import { TransactionActions } from 'src/constance';
// import { TransactionFetchDataService } from 'src/Services/Transaction.Services';

import { TextFieldForm, DatePickerCustom, AutoCompleteSelectMultiple } from 'src/components/inputs';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

import dayjs from 'dayjs';

export default function FilterComponent({ backAction, defaultValue, dataList }) {
  // const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);
  const [accountList, setAccountList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [labelsList, setLabelsList] = useState([]);
  const [partyList, setPartyList] = useState([]);
  const [subCategoriesList, setSubCategoriesList] = useState([]);

  useEffect(() => {
    // setLoader(true);
    // dispatch(
    // TransactionFetchDataService((res) => {
    setAccountList(dataList?.accountList || []);
    setCategoriesList(dataList?.categoriesList || []);
    setLabelsList(dataList?.labelsList || []);
    setPartyList(dataList?.partyList || []);
    setSubCategoriesList(dataList?.subCategoriesList || []);
    setLoader(false);
    // })
    // );
  }, []);

  if (loader)
    return (
      <Grid
        container
        spacing={1}
        sx={{
          paddingY: 2,
          paddingX: 2,
        }}
      >
        <Grid item xs={12} md={6}>
          <Skeleton animation="" sx={{ fontSize: 40 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Skeleton animation="" sx={{ fontSize: 40 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Skeleton animation="" sx={{ fontSize: 40 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Skeleton animation="" sx={{ fontSize: 40 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Skeleton animation="" sx={{ fontSize: 40 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Skeleton animation="" sx={{ fontSize: 40 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Skeleton animation="" sx={{ fontSize: 40 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Skeleton animation="" sx={{ fontSize: 40 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Skeleton animation="" sx={{ fontSize: 40 }} />
        </Grid>

        <Grid xs={12}>
          <Box sx={{ float: 'right', display: 'flex' }}>
            <Button variant="outlined" sx={{ marginRight: 1 }} color="darker">
              Clear
            </Button>

            <Button variant="contained" type="submit" color="success">
              Apply
            </Button>
          </Box>
        </Grid>
      </Grid>
    );

  return (
    <Formik
      enableReinitialize
      initialValues={{
        Actions: defaultValue?.Actions,
        Amount: defaultValue?.Amount || null,
        AccountsIds: defaultValue?.AccountsIds || null,
        CategoryIds: defaultValue?.CategoryIds || null,
        Tags: defaultValue?.Tags || null,
        SubCategoryIds: defaultValue?.SubCategoryIds || null,
        PartyIds: defaultValue?.PartyIds || null,
        StartDate: defaultValue?.StartDate ? dayjs(defaultValue?.StartDate) : null,
        EndDate: defaultValue?.EndDate ? dayjs(defaultValue?.EndDate) : null,
      }}
      validationSchema={Yup.object().shape({})}
      onSubmit={(values) => {
        // console.log(values.StartDate?.format('YYYY-MM-DD') , "values.StartDatevalues.StartDatevalues.StartDate");

        // values.StartDate = values.StartDate ? dayjs(values.StartDate)?.format('YYYY-MM-DD') : null;
        // values.EndDate = values.EndDate ? dayjs(values.EndDate)?.format('YYYY-MM-DD') : null;

        backAction(values);
      }}
    >
      {(props) => {
        const { setFieldValue, handleSubmit, values, dirty } = props;
        return (
          <Form noValidate>
            <Grid
              container
              spacing={1}
              sx={{
                paddingY: 2,
                paddingX: 2,
              }}
            >
              <Grid item xs={12} md={6}>
                <AutoCompleteSelectMultiple
                  required={false}
                  formik={props}
                  label="Action"
                  field="Actions"
                  menuList={TransactionActions}
                  valueKey="key"
                  labelKey="value"
                  limitTags={1}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <AutoCompleteSelectMultiple
                  required={false}
                  formik={props}
                  label="Account"
                  field="AccountsIds"
                  menuList={accountList}
                  valueKey="AccountId"
                  labelKey="AccountName"
                  limitTags={1}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <AutoCompleteSelectMultiple
                  required={false}
                  formik={props}
                  label="Party"
                  field="PartyIds"
                  menuList={partyList}
                  valueKey="PartyId"
                  labelKey="FullName"
                  limitTags={1}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <AutoCompleteSelectMultiple
                  required={false}
                  formik={props}
                  label="Labels"
                  field="Tags"
                  menuList={labelsList}
                  valueKey="LabelId"
                  labelKey="LabelName"
                  limitTags={1}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <AutoCompleteSelectMultiple
                  required={false}
                  formik={props}
                  label="Category"
                  field="CategoryIds"
                  menuList={categoriesList}
                  valueKey="CategoryId"
                  labelKey="CategoryName"
                  limitTags={2}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <AutoCompleteSelectMultiple
                  required={false}
                  formik={props}
                  label="Sub Category"
                  field="SubCategoryIds"
                  menuList={subCategoriesList}
                  valueKey="SubCategoryId"
                  labelKey="SubCategoriesName"
                  limitTags={1}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePickerCustom
                  required={false}
                  formik={props}
                  label="Start Date"
                  field="StartDate"
                  defaultValue={values.Date}
                  callBackAction={(event) => {
                    setFieldValue('StartDate', dayjs(event));
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePickerCustom
                  required={false}
                  formik={props}
                  label="End Date"
                  field="EndDate"
                  defaultValue={values.Date}
                  callBackAction={(event) => {
                    setFieldValue('EndDate', dayjs(event));
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextFieldForm
                  required={false}
                  type="number"
                  formik={props}
                  field="Amount"
                  label="Amount"
                />
              </Grid>

              <Grid xs={12}>
                <Box sx={{ float: 'right', display: 'flex' }}>
                  <Button
                    variant="outlined"
                    sx={{ marginRight: 1 }}
                    onClick={() => {
                      // resetForm();
                      backAction({});
                    }}
                    color="darker"
                  >
                    Clear
                  </Button>

                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!dirty}
                    onClick={handleSubmit}
                    color="primary"
                  >
                    Apply
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
}
