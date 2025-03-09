import { useDispatch } from 'react-redux';
import { useState, useEffect, } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { TransactionActions } from 'src/constance';
import { TransactionModifyService, TransactionFetchDataService, } from 'src/Services/Transaction.Services';

import { ModalDialog } from 'src/components/model';
import { CustomAvatar } from 'src/components/CustomComponents';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { TextFieldForm, DatePickerCustom, AutoCompleteSelectMenu, } from 'src/components/inputs';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

import dayjs from 'dayjs';

// ----------------------------------------------------------------------

export default function TransactionsPopover() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);

  const [accountList, setAccountList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [labelsList, setLabelsList] = useState([]);
  const [partyList, setPartyList] = useState([]);

  useEffect(() => {

    dispatch(TransactionFetchDataService(res => {
      setAccountList(res?.accountList || []);
      setCategoriesList(res?.categoriesList || []);
      setLabelsList(res?.labelsList || []);
      setPartyList(res?.partyList || []);
    }));

  }, [show])

  return (
    <>
      <Button
        type="submit"
        variant="outlined"
        color="success"
        onClick={() => setShow(true)}
      >
        Record
      </Button >

      <ModalDialog
        title="Record Details"
        open={show}
        maxWidth='lg'
        handleClose={() => { setShow(false); }}
      >
        <Box sx={{ minWidth: { xs: 250, md: 1000, } }}>

          <Formik
            enableReinitialize

            initialValues={{
              Action: "Out",
              Date: null,
              Amount: null,
              AccountId: null,
              CategoryId: null,
              SubCategoryId: null,
              TransferToAccountId: null,
              PartyId: null,
              Description: null,
              Tags: null
            }}

            validationSchema={Yup.object().shape({
              Action: Yup.string().required("Action is required."),
              Date: Yup.string().required("Date is required."),
              Amount: Yup.string().required("Amount is required."),
              AccountId: Yup.string().required("Account is required."),
              CategoryId: Yup.number()
                .when('Action', {
                  is: (value) => value === 'In' || value === 'Out',
                  then: (schema) => schema.required('Category is required.'),
                  otherwise: (schema) => schema.nullable(),
                }),
              SubCategoryId: Yup.number()
                .when('Action', {
                  is: (value) => value === 'In' || value === 'Out',
                  then: (schema) => schema.required('Sub Category is required.'),
                  otherwise: (schema) => schema.nullable(),
                }),
              TransferToAccountId: Yup.number()
                .when('Action', {
                  is: (value) => value === 'Investment' || value === 'Transfer',
                  then: (schema) => schema.required('Transfer is required'),
                  otherwise: (schema) => schema.nullable(),
                }),
              PartyId: Yup.number()
                .when('Action', {
                  is: (value) => value === 'Credit' || value === 'Debit',
                  then: (schema) => schema.required('Party is required'),
                  otherwise: (schema) => schema.nullable(),
                }),
            })}

            onSubmit={(values) => {
              setFormSubmitLoader(true);
              if (
                values?.Action === "In" ||
                values?.Action === "Out"
              ) {
                delete values.TransferToAccountId;
                delete values.PartyId;

              } else if (
                values?.Action === "Transfer" ||
                values?.Action === "Investment" ||
                values?.Action === "Credit" ||
                values?.Action === "Debit"
              ) {
                delete values.SubCategoryId;
                delete values.CategoryId;
                delete values.Tags;
              };

              dispatch(TransactionModifyService(values, (res) => {
                setFormSubmitLoader(false);

                setShow(false);
                if (res?.status) {
                  setShow(false);
                };
              }));

            }}
          >
            {(props) => {
              const { setFieldValue, handleSubmit, values, dirty, resetForm } = props
              return (<Form noValidate >
                <Grid
                  container
                  spacing={2}
                  sx={{
                    paddingY: 2,
                    paddingX: 2,
                  }}
                >
                  <Grid item xs={12} >
                    <AutoCompleteSelectMenu
                      formik={props}
                      label="Action"
                      field="Action"
                      menuList={TransactionActions}
                      valueKey='key'
                      labelKey='value'
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <DatePickerCustom
                      required={false}
                      formik={props}
                      label='Date'
                      field='Date'
                      defaultValue={values.Date}
                      callBackAction={(event) => { setFieldValue("Date", dayjs(event)) }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextFieldForm
                      type="number"
                      formik={props}
                      field="Amount"
                      label="Amount"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <AutoCompleteSelectMenu
                      formik={props}
                      label={(values?.Action === "Transfer" || values?.Action === "Investment") ? "From" : "Account"}
                      field="AccountId"
                      menuList={accountList}
                      valueKey='AccountId'
                      labelKey='AccountName'
                      renderOption={(vars, option) => {
                        const { key, ...optionProps } = vars;
                        return (
                          <Box
                            key={key}
                            {...optionProps}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between !important',
                              alignItems: 'center !important',
                            }}
                          >
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center !important',
                            }}>
                              <CustomAvatar
                                width={45} height={45} iconSize={15}
                                icon={option?.Icon || ""}
                                bgColor={option?.Color || ""}

                              />
                              <Typography variant="normal" sx={{ mx: 2 }} >
                                {option?.AccountName || ''}
                              </Typography>
                            </Box>
                            <span>{option?.CurrentAmount}</span>
                          </Box>
                        );
                      }}
                      startUnitType={
                        values?.AccountId ?
                          <CustomAvatar
                          width={45} height={45} iconSize={15}
                            icon={accountList?.find(item => item?.AccountId === props.values.AccountId)?.Icon || ""}
                            bgColor={accountList?.find(item => item?.AccountId === props.values.AccountId)?.Color || ""}
                          /> :
                          ""
                      }
                      unitType={`₹ ${accountList?.find(item => item?.AccountId === props.values.AccountId)?.CurrentAmount || '0.00'}`}
                    />
                  </Grid>

                  {
                    (values?.Action === "In" || values?.Action === "Out") &&
                    <>
                      <Grid item xs={12} md={6}>
                        <AutoCompleteSelectMenu
                          required={false}
                          formik={props}
                          label="Labels"
                          field="Tags"
                          menuList={labelsList}
                          valueKey='LabelId'
                          labelKey='LabelName'
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <AutoCompleteSelectMenu
                          formik={props}
                          label="Category"
                          field="CategoryId"
                          menuList={categoriesList}
                          valueKey='CategoryId'
                          labelKey='CategoryName'
                          renderOption={(vars, option) => {
                            const { key, ...optionProps } = vars;
                            return (
                              <Box
                                key={key}
                                {...optionProps}
                                sx={{
                                  p: 2,
                                  display: 'flex',
                                  alignItems: 'center !important',
                                }}
                              >
                                <CustomAvatar
                                 width={45} height={45} iconSize={15}
                                  icon={option?.Icon || ""}
                                  bgColor={option?.Color || ""}
                                />
                                <Typography variant="normal" sx={{ mx: 2 }} >
                                  {option?.CategoryName || ''}
                                </Typography>

                              </Box>
                            );
                          }}
                          startUnitType={
                            values?.CategoryId ?
                              <CustomAvatar
                                width={45} height={45} iconSize={15}
                                icon={categoriesList?.find(item => item.CategoryId === values.CategoryId)?.Icon || ""}
                                bgColor={categoriesList?.find(item => item.CategoryId === values.CategoryId)?.Color || ""}
                              /> :
                              ""
                          }
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <AutoCompleteSelectMenu
                          formik={props}
                          label="Sub Category"
                          field="SubCategoryId"
                          menuList={categoriesList?.find(item => item.CategoryId === values.CategoryId)?.SubCategories || []}
                          valueKey='SubCategoryId'
                          labelKey='SubCategoriesName'
                          renderOption={(vars, option) => {
                            const { key, ...optionProps } = vars;
                            return (
                              <Box
                                key={key}
                                {...optionProps}
                                sx={{
                                  display: 'flex',
                                  // justifyContent: 'space-between !important',
                                  alignItems: 'center !important',
                                }}
                              >

                                <CustomAvatar
                                  width={45} height={45} iconSize={15}
                                  icon={option?.Icon || ""}
                                  bgColor={categoriesList?.find(item => item.CategoryId === values.CategoryId)?.Color || ""}
                                />
                                <Typography variant="normal" sx={{ mx: 2 }} >
                                  {option?.SubCategoriesName || ''}
                                </Typography>

                              </Box>
                            );
                          }}
                          startUnitType={
                            values?.SubCategoryId ?
                              <CustomAvatar
                                width={45} height={45} iconSize={15}
                                bgColor={categoriesList?.find(item => item.CategoryId === values.CategoryId)?.Color || ""}
                              /> :
                              ""
                          }
                        />
                      </Grid>


                    </>
                  }
                  {
                    (values?.Action === "Transfer" || values?.Action === "Investment") &&
                    <Grid item xs={12} md={6}>
                      <AutoCompleteSelectMenu
                        formik={props}
                        label="To"
                        field="TransferToAccountId"
                        menuList={accountList}
                        valueKey='AccountId'
                        labelKey='AccountName'
                        renderOption={(vars, option) => {
                          const { key, ...optionProps } = vars;
                          return (
                            <Box
                              key={key}
                              {...optionProps}
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between !important',
                                alignItems: 'center !important',
                              }}
                            >
                              <span>{option?.AccountName}</span>
                              <span>{option?.CurrentAmount}</span>
                            </Box>
                          );
                        }}
                        unitType={`₹ ${accountList?.find(item => item?.AccountId === props.values.AccountId)?.CurrentAmount || '0.00'}`}
                      />
                    </Grid>
                  }

                  {
                    (values?.Action === "Credit" || values?.Action === "Debit") &&
                    <Grid item xs={12} md={6}>
                      <AutoCompleteSelectMenu
                        formik={props}
                        label="Party"
                        field="PartyId"
                        menuList={partyList}
                        valueKey='PartyId'
                        labelKey='FullName'
                        renderOption={(vars, option) => {
                          const { key, ...optionProps } = vars;
                          return (
                            <Box
                              key={key}
                              {...optionProps}
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between !important',
                                alignItems: 'center !important',
                              }}
                            >
                              <span>{option?.FullName}</span>
                              <span>{option?.CurrentAmount}</span>
                            </Box>
                          );
                        }}
                        unitType={`₹ ${partyList?.find(item => item?.PartyId === props.values.PartyId)?.CurrentAmount || '0.00'}`}
                      />
                    </Grid>
                  }

                  <Grid xs={12} >
                    <Box sx={{ float: "right", display: "flex" }}>
                      {
                        dirty &&
                        <Button
                          variant="outlined"
                          sx={{ marginX: 1 }}
                          onClick={() => { resetForm(); }}
                          color="CancelButton"
                        >
                          Cancel
                        </Button>
                      }

                      {
                        !formSubmitLoader ?
                          <Button
                            variant="contained"
                            type='submit'
                            disabled={!dirty}
                            onClick={handleSubmit}
                            color="success"
                          >
                            Save
                          </Button>
                          :
                          <ButtonLoader />
                      }
                    </Box>
                  </Grid>


                </Grid>
              </Form>)
            }}
          </Formik>
        </Box>
      </ModalDialog >

    </>
  );
}
