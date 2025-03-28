import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

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
    <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
      <Box sx={{ width: 1, maxWidth: 1100 }}>
        <Formik
          enableReinitialize
          initialValues={{
            ImgPath: 'http://localhost:8200/public/users/c0b6e03f-c122-4335-abba-1f3c9ba3f4f1/1abf0c41-125c-47a3-8b33-7f36e80edfe6.jpeg',
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
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ p: 2 }}>
                      <ImagePicker
                        formik={props}
                        label="Profile Image"
                        field="ImgPath"
                        heightWidth={250}
                        imageReturn={(e) => {
                          setFieldValue('ImgPath', e);
                          setImgUrl(e);
                        }}
                      />
                    
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Card sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextFieldForm formik={props} label="First Name" field="FirstName" />
                        </Grid>

                        <Grid xs={12} md={6}>
                          <TextFieldForm formik={props} label="Last Name" field="LastName" />
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextFieldForm disabled formik={props} label="Email" field="UserEmail" />
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
                            disabled
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
                                Update Profile
                              </Button>
                            ) : (
                              <ButtonLoader />
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Stack>
  );
}
