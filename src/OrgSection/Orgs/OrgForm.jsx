import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { ImgUrl } from 'src/constance'; 
import { OrgModifyService } from 'src/Services/org/Org.Services';

import ButtonLoader from 'src/components/Loaders/ButtonLoader';
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
    formData.append('OrgName', values.OrgName);
    formData.append('Description', values.Description);

    if (editObject?.OrgId) {
      formData.append('OrgId', editObject?.OrgId);
    }
    dispatch(
      OrgModifyService(formData, (res) => {
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
        OrgName: editObject?.OrgName || '',
        Description: editObject?.Description || '',
      }}
      validationSchema={Yup.object().shape({
        ImgPath: Yup.string().required('Image is required.'),
        OrgName: Yup.string().trim().required('Organization name is required.'),
        Description: Yup.string().trim().nullable(),
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
                  label="Organization image"
                  field="ImgPath"
                  heightWidth={250}
                  imageReturn={(e) => {
                    setFieldValue('ImgPath', e);
                    setImgUrl(e);
                  }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <TextFieldForm formik={props} label="Organization" field="OrgName" />
              </Grid>

              <Grid item xs={12} md={12}>
                <TextFieldForm
                  required={false}
                  formik={props}
                  label="Description"
                  field="Description"
                  multiline
                  rows={5}
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
