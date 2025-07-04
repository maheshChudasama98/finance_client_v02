import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { formatToINR } from 'src/utils/format-number';
import { sweetAlertQuestion } from 'src/utils/sweet-alerts';

import { BackEndSendFormat, TransactionActions } from 'src/constance';
import {
  TransactionModifyService,
  TransactionFetchDataService,
} from 'src/Services/Transaction.Services';

import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { CustomAvatar } from 'src/components/CustomComponents';
import {
  DateAndTime,
  TextFieldForm,
  AutoCompleteSelectMenu,
  AutoCompleteSelectMultiple,
} from 'src/components/inputs';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

import dayjs from 'dayjs';

export default function Index({ backAction, editObject, deleteAction }) {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);

  const [accountList, setAccountList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [labelsList, setLabelsList] = useState([]);
  const [partyList, setPartyList] = useState([]);

  useEffect(() => {
    dispatch(
      TransactionFetchDataService((res) => {
        setAccountList(
          res?.accountList?.filter(
            (item) => item?.isActive === 1 || editObject?.AccountId === item?.AccountId
          ) || []
        );

        setCategoriesList(
          res?.categoriesList?.filter(
            (item) => item?.isActive === 1 || editObject?.CategoryId === item?.CategoryId
          ) || []
        );

        setLabelsList(res?.labelsList || []);

        setPartyList(
          res?.partyList?.filter(
            (item) => item?.isActive === 1 || editObject?.PartyId === item?.PartyId
          ) || []
        );
        // setCategoriesList(res?.categoriesList || []);
        // setLabelsList(res?.labelsList || []);
        // setPartyList(res?.partyList || []);
      })
    );
  }, [show]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        Action: editObject?.Action || 'Out',
        DateDay: editObject?.Date ? dayjs(editObject?.Date) : null,
        Amount: editObject?.Amount || null,
        AccountId: editObject?.AccountId || null,
        CategoryId: editObject?.CategoryId || null,
        SubCategoryId: editObject?.SubCategoryId || null,
        TransferToAccountId: editObject?.TransferToAccountId || null,
        PartyId: editObject?.PartyId || null,
        Description: editObject?.Description || null,
        Tags: editObject?.Tags ? editObject.Tags.split(',').map(Number) : [] || null,
      }}
      validationSchema={Yup.object().shape({
        Action: Yup.string().required('Action is required.'),
        DateDay: Yup.string().required('Date is required.'),
        Amount: Yup.string().required('Amount is required.'),
        AccountId: Yup.string().required('Account is required.'),
        CategoryId: Yup.number().when('Action', {
          is: (value) => value === 'In' || value === 'Out',
          then: (schema) => schema.required('Category is required.'),
          otherwise: (schema) => schema.nullable(),
        }),
        SubCategoryId: Yup.number().when('Action', {
          is: (value) => value === 'In' || value === 'Out',
          then: (schema) => schema.required('Sub Category is required.'),
          otherwise: (schema) => schema.nullable(),
        }),
        TransferToAccountId: Yup.number().when('Action', {
          is: (value) => value === 'Investment' || value === 'From',
          then: (schema) => schema.required('Transfer is required'),
          otherwise: (schema) => schema.nullable(),
        }),
        PartyId: Yup.number().when('Action', {
          is: (value) => value === 'Credit' || value === 'Debit',
          then: (schema) => schema.required('Party is required'),
          otherwise: (schema) => schema.nullable(),
        }),
      })}
      onSubmit={(values) => {
        setFormSubmitLoader(true);
        if (values?.Action === 'In' || values?.Action === 'Out') {
          delete values.TransferToAccountId;
          delete values.PartyId;
        } else if (
          values?.Action === 'From' ||
          values?.Action === 'Investment' ||
          values?.Action === 'Refund' ||
          values?.Action === 'Return' ||
          values?.Action === 'Credit' ||
          values?.Action === 'Debit'
        ) {
          delete values.SubCategoryId;
          delete values.CategoryId;
        }

        if (values?.Action === 'From') {
          values.Action = 'Transfer';
        }

        if (editObject?.TransactionId) {
          values.TransactionId = editObject?.TransactionId;
        }

        values.Date = dayjs(values.DateDay).startOf('day').format(BackEndSendFormat);
        delete values.DateDay;
        dispatch(
          TransactionModifyService(values, (res) => {
            setFormSubmitLoader(false);

            setShow(false);
            if (res?.status) {
              setShow(false);
              backAction();
            }
          })
        );
      }}
    >
      {(props) => {
        const { setFieldValue, handleSubmit, values, dirty, resetForm } = props;
        return (
          <Form noValidate>
            <Grid
              container
              spacing={2}
              sx={{
                paddingY: 2,
                paddingX: 2,
              }}
            >
              <Grid item xs={12}>
                <AutoCompleteSelectMenu
                  formik={props}
                  label="Action"
                  field="Action"
                  menuList={TransactionActions}
                  valueKey="key"
                  labelKey="value"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DateAndTime
                  formik={props}
                  label="Date"
                  field="DateDay"
                  defaultValue={values.DateDay}
                  callBackAction={(event) => {
                    setFieldValue('DateDay', dayjs(event));
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextFieldForm type="number" formik={props} field="Amount" label="Amount" />
              </Grid>

              <Grid item xs={12} md={6}>
                <AutoCompleteSelectMenu
                  formik={props}
                  label={
                    values?.Action === 'From' ||
                    values?.Action === 'Investment' ||
                    values?.Action === 'Installment'
                      ? 'From'
                      : 'Account'
                  }
                  field="AccountId"
                  menuList={accountList}
                  valueKey="AccountId"
                  labelKey="AccountName"
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
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center !important',
                            // py: 0.5,
                          }}
                        >
                          <CustomAvatar
                            width={45}
                            height={45}
                            icon={option?.Icon || ''}
                            iconSize={15}
                            bgColor={option?.Color || ''}
                          />
                          <Typography variant="normal" sx={{ mx: 2 }}>
                            {option?.AccountName || ''}
                          </Typography>
                        </Box>
                        <Typography variant="light" sx={{}}>
                          {formatToINR(option?.CurrentAmount)}{' '}
                        </Typography>
                      </Box>
                    );
                  }}
                  startUnitType={
                    values?.AccountId ? (
                      <CustomAvatar
                        width={45}
                        height={45}
                        iconSize={15}
                        icon={
                          accountList?.find((item) => item?.AccountId === props.values.AccountId)
                            ?.Icon || ''
                        }
                        bgColor={
                          accountList?.find((item) => item?.AccountId === props.values.AccountId)
                            ?.Color || ''
                        }
                      />
                    ) : (
                      ''
                    )
                  }
                  unitType={formatToINR(
                    accountList?.find((item) => item?.AccountId === props.values.AccountId)
                      ?.CurrentAmount || '0'
                  )}
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
                />
              </Grid>

              {(values?.Action === 'In' ||
                values?.Action === 'Out' ||
                values?.Action === 'Installment' ||
                values?.Action === 'Payer' ||
                values?.Action === 'Buyer') && (
                <>
                  <Grid item xs={12} md={6}>
                    <AutoCompleteSelectMenu
                      formik={props}
                      label="Category"
                      field="CategoryId"
                      menuList={categoriesList}
                      valueKey="CategoryId"
                      labelKey="CategoryName"
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
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center !important',
                                // py: 0.5,
                              }}
                            >
                              <CustomAvatar
                                width={45}
                                height={45}
                                icon={option?.Icon || ''}
                                iconSize={15}
                                bgColor={option?.Color || ''}
                              />
                              <Typography variant="normal" sx={{ mx: 2 }}>
                                {option?.CategoryName || ''}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      }}
                      startUnitType={
                        values?.CategoryId ? (
                          <CustomAvatar
                            width={45}
                            height={45}
                            iconSize={15}
                            icon={
                              categoriesList?.find((item) => item.CategoryId === values.CategoryId)
                                ?.Icon || ''
                            }
                            bgColor={
                              categoriesList?.find((item) => item.CategoryId === values.CategoryId)
                                ?.Color || ''
                            }
                          />
                        ) : (
                          ''
                        )
                      }
                      callBackAction={(event) => {
                        setFieldValue('SubCategoryId', null);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <AutoCompleteSelectMenu
                      formik={props}
                      label="Sub Category"
                      field="SubCategoryId"
                      menuList={
                        categoriesList?.find((item) => item.CategoryId === values.CategoryId)
                          ?.SubCategories || []
                      }
                      valueKey="SubCategoryId"
                      labelKey="SubCategoriesName"
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
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center !important',
                                // py: 0.5,
                              }}
                            >
                              <CustomAvatar
                                width={45}
                                height={45}
                                icon={option?.Icon || ''}
                                iconSize={15}
                                bgColor={
                                  categoriesList?.find(
                                    (item) => item.CategoryId === values.CategoryId
                                  )?.Color || ''
                                }
                              />
                              <Typography variant="normal" sx={{ mx: 2 }}>
                                {option?.SubCategoriesName || ''}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      }}
                      startUnitType={
                        values?.SubCategoryId
                          ? (() => {
                              const selectedSubCategory = categoriesList
                                ?.find((item) => item.CategoryId === values.CategoryId)
                                ?.SubCategories?.find(
                                  (sub) => sub.SubCategoryId === values.SubCategoryId
                                );

                              return (
                                <CustomAvatar
                                  width={45}
                                  height={45}
                                  iconSize={15}
                                  bgColor={
                                    categoriesList?.find(
                                      (item) => item.CategoryId === values.CategoryId
                                    )?.Color || ''
                                  }
                                  icon={selectedSubCategory?.Icon || ''}
                                />
                              );
                            })()
                          : ''
                      }
                    />
                  </Grid>
                </>
              )}
              {(values?.Action === 'From' ||
                values?.Action === 'Investment' ||
                values?.Action === 'Installment') && (
                <Grid item xs={12} md={6}>
                  <AutoCompleteSelectMenu
                    formik={props}
                    label="To"
                    field="TransferToAccountId"
                    menuList={accountList?.filter((item) => item?.AccountId !== values?.AccountId)}
                    valueKey="AccountId"
                    labelKey="AccountName"
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
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center !important',
                              // py: 0.5,
                            }}
                          >
                            <CustomAvatar
                              width={45}
                              height={45}
                              icon={option?.Icon || ''}
                              iconSize={15}
                              bgColor={option?.Color || ''}
                            />
                            <Typography variant="normal" sx={{ mx: 2 }}>
                              {option?.AccountName || ''}
                            </Typography>
                          </Box>
                          <Typography variant="light" sx={{}}>
                            {formatToINR(option?.CurrentAmount)}{' '}
                          </Typography>
                        </Box>
                      );
                    }}
                    startUnitType={
                      values?.TransferToAccountId ? (
                        <CustomAvatar
                          width={45}
                          height={45}
                          iconSize={15}
                          icon={
                            accountList?.find(
                              (item) => item?.AccountId === props.values.TransferToAccountId
                            )?.Icon || ''
                          }
                          bgColor={
                            accountList?.find(
                              (item) => item?.AccountId === props.values.TransferToAccountId
                            )?.Color || ''
                          }
                        />
                      ) : (
                        ''
                      )
                    }
                    unitType={formatToINR(
                      accountList?.find(
                        (item) => item?.AccountId === props.values.TransferToAccountId
                      )?.CurrentAmount || '0'
                    )}
                  />
                </Grid>
              )}

              {(values?.Action === 'Credit' ||
                values?.Action === 'Debit' ||
                values?.Action === 'Refund' ||
                values?.Action === 'Return' ||
                values?.Action === 'Payer' ||
                values?.Action === 'Buyer') && (
                <Grid item xs={12} md={6}>
                  <AutoCompleteSelectMenu
                    formik={props}
                    label="Party"
                    field="PartyId"
                    menuList={partyList}
                    valueKey="PartyId"
                    labelKey="FullName"
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
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center !important',
                              // py: 0.5,
                            }}
                          >
                            <CustomAvatar
                              photoURL={option?.ImgPath || ''}
                              displayName={option?.PartyAvatar || ''}
                              width={45}
                              height={45}
                              icon={option?.Icon || ''}
                              bgColor={option?.Color || ''}
                            />
                            <Typography variant="normal" sx={{ mx: 2 }}>
                              {option?.FullName || ''}
                            </Typography>
                          </Box>
                          <Typography variant="light" sx={{}}>
                            {formatToINR(option?.CurrentAmount)}{' '}
                          </Typography>
                        </Box>
                      );
                    }}
                    startUnitType={
                      values?.PartyId ? (
                        <CustomAvatar
                          width={45}
                          height={45}
                          iconSize={15}
                          photoURL={
                            partyList?.find((item) => item?.PartyId === props.values.PartyId)
                              ?.ImgPath || ''
                          }
                          displayName={
                            partyList?.find((item) => item?.PartyId === props.values.PartyId)
                              ?.PartyAvatar || ''
                          }
                        />
                      ) : (
                        ''
                      )
                    }
                    unitType={formatToINR(
                      partyList?.find((item) => item?.PartyId === props.values.PartyId)
                        ?.CurrentAmount || '0'
                    )}
                  />
                </Grid>
              )}

              <Grid item xs={12} md={12}>
                <TextFieldForm
                  required={false}
                  formik={props}
                  label="Description"
                  field="Description"
                  multiline
                  rows={4}
                  maxRows={3}
                />
              </Grid>

              <Grid xs={12}>
                <Box sx={{ float: 'right', display: 'flex' }}>
                  {editObject?.TransactionId && (
                    <Button
                      color="error"
                      variant="contained"
                      sx={{ marginX: 1 }}
                      onClick={() => {
                        sweetAlertQuestion()
                          .then((result) => {
                            if (result === 'Yes') {
                              deleteAction(editObject);
                            }
                          })
                          .catch((error) => {
                            console.error(error);
                          });
                      }}
                    >
                      Delete
                    </Button>
                  )}

                  {dirty && (
                    <Button
                      variant="outlined"
                      sx={{ marginRight: 1 }}
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
  );
}
