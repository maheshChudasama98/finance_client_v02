import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';

import { ImgUrl, EMAIL_REGEX } from 'src/constance';
import { BranchModifyService } from 'src/Services/org/Org.Services';

import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { GoogleAddress } from 'src/components/CustomComponents';
import { ImagePicker, TextFieldForm } from 'src/components/inputs';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

export default function Index({ backAction, editObject }) {
  const dispatch = useDispatch();

  const [imgUrl, setImgUrl] = useState(null);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);

  const ActionSubmit = (values) => {
    setFormSubmitLoader(true);
    const formData = new FormData();
    if (imgUrl) {
      formData.append('ImgPath', imgUrl);
    }
    formData.append('BranchName', values.BranchName);
    formData.append('Description', values.Description);
    formData.append('Address', values.Address);
    formData.append('City', values.City);
    formData.append('State', values.State);
    formData.append('Phone', values.Phone);
    formData.append('Email', values.Email);
    formData.append('GstNumber', values.GstNumber);

    if (editObject?.BranchId) {
      formData.append('BranchId', editObject?.BranchId);
    }
    dispatch(
      BranchModifyService(formData, (res) => {
        setFormSubmitLoader(false);
        if (res?.status) {
          backAction();
        }
      })
    );
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ImgPath: editObject?.ImgPath ? `${ImgUrl || ''}${editObject.ImgPath}` : '' || '',
        BranchName: editObject?.BranchName || '',
        Description: editObject?.Description || '',
        Address: editObject?.Address || '',
        City: editObject?.City || '',
        State: editObject?.State || '',
        GstNumber: editObject?.GstNumber || '',
        Phone: editObject?.Phone || '',
        Email: editObject?.Email || '',
      }}
      validationSchema={Yup.object().shape({
        ImgPath: Yup.string().required('Image is required.'),
        BranchName: Yup.string().trim().required('Organization name is required.'),
        Description: Yup.string().trim().nullable(),
        Address: Yup.string().trim().nullable(),
        City: Yup.string().trim().nullable(),
        State: Yup.string().trim().nullable(),
        GstNumber: Yup.string().trim().nullable(),
        Email: Yup.string().matches(EMAIL_REGEX, 'Please enter a valid email').nullable(),
      })}
      onSubmit={ActionSubmit}
    >
      {(props) => {
        const { handleSubmit, dirty, resetForm, setFieldValue } = props;
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
              <Grid item xs={12} md={12}>
                <ImagePicker
                  defaultIcon="fa-solid fa-sitemap"
                  formik={props}
                  label="Branch image"
                  field="ImgPath"
                  heightWidth={250}
                  imageReturn={(e) => {
                    setFieldValue('ImgPath', e);
                    setImgUrl(e);
                  }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <TextFieldForm formik={props} label="Branch Name" field="BranchName" />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextFieldForm required={false} formik={props} label="Email" field="Email" />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextFieldForm required={false} formik={props} label="Phone" field="Phone" />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextFieldForm
                  required={false}
                  formik={props}
                  label="Gst Number"
                  field="GstNumber"
                />
              </Grid>

              <Grid item xs={12} md={6} />

              <Grid item xs={12}>
                <Divider sx={{ my: 3 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <GoogleAddress
                  callBackAction={(e) => {
                    setFieldValue('Address', e?.address || '');
                    setFieldValue('State', e?.state || '');
                    setFieldValue('City', e?.city || '');
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} />
              <Grid item xs={12} md={6}>
                <TextFieldForm required={false} formik={props} label="City" field="City" />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextFieldForm required={false} formik={props} label="State" field="State" />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextFieldForm
                  required={false}
                  formik={props}
                  label="Address"
                  field="Address"
                  multiline
                  rows={3}
                  maxRows={3}
                />
              </Grid>

              <Grid item xs={12} md={6}>
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
                      disabled={!dirty}
                      onClick={() => {
                        resetForm();
                        setImgUrl(null);
                      }}
                      color="CancelButton"
                    >
                      Cancel{' '}
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
