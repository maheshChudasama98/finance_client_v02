import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { ImgUrl } from 'src/constance';
import { UserModifyService } from 'src/Services/User.Services';
import { RoleListService } from 'src/Services/org/Org.Services';

import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { ImagePicker, TextFieldForm, AutoCompleteSelectMenu } from 'src/components/inputs';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

export default function Index({ backAction, editObject }) {
  const dispatch = useDispatch();
  const [imgUrl, setImgUrl] = useState(null);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [rolesList, setRolesList] = useState([]);

  const ActionSubmit = (values) => {
    // setFormSubmitLoader(true);
    // dispatch(
    //   UserRegistrationService(values, (Response) => {
    //     setFormSubmitLoader(false);
    //     backAction();
    //   })
    // );
    // setFormSubmitLoader(false);

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

  useEffect(() => {
    dispatch(
      RoleListService({}, (res) => {
        if (res?.status) {
          setRolesList(res?.data?.list);
        }
      })
    );
  }, []);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ImgPath: editObject?.ImgPath ? `${ImgUrl || ''}${editObject.ImgPath}` : '' || '',
        FirstName: editObject?.FirstName || '',
        LastName: editObject?.LastName || '',
        UserEmail: editObject?.Email || '',
        UserNumber: editObject?.Mobile || '',
        Language: editObject?.Language || 'EN',
        RoleId: editObject?.RoleId || '',
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
            <Grid
              container
              spacing={2}
              sx={{
                paddingY: 2,
                // paddingX: 2,
              }}
            >
              <Grid item xs={12} md={12}>
                <ImagePicker
                  //   defaultIcon="fa-solid fa-sitemap"
                  formik={props}
                  label="Profile Image"
                  field="ImgPath"
                  heightWidth={250}
                  imageReturn={(e) => {
                    setFieldValue('ImgPath', e);
                    setImgUrl(e);
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextFieldForm formik={props} label="First Name" field="FirstName" />
              </Grid>

              <Grid xs={12} md={6}>
                <TextFieldForm formik={props} label="Last Name" field="LastName" />
              </Grid>
              <Grid xs={12} md={6}>
                <TextFieldForm formik={props} label="Email" field="UserEmail" />
              </Grid>

              <Grid xs={12} md={6}>
                <TextFieldForm
                  required={false}
                  formik={props}
                  type="number"
                  label="Mobile Number"
                  field="UserNumber"
                />
              </Grid>

              <Grid xs={12} md={6}>
                <AutoCompleteSelectMenu
                  formik={props}
                  label="Role"
                  field="RoleId"
                  menuList={rolesList}
                  valueKey="RoleId"
                  labelKey="RoleName"
                />
              </Grid>

              <Grid xs={12}>
                <Box sx={{ float: 'right', display: 'flex' }}>
                  {dirty && (
                    <Button
                      variant="outlined"
                      sx={{ marginX: 1 }}
                      // disabled={!dirty}
                      onClick={() => {
                        resetForm();
                      }}
                      color="CancelButton"
                    >
                      {' '}
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
