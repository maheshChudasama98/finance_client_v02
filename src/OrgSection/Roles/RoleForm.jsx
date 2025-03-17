import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { RoleModifyService } from 'src/Services/org/Org.Services';

import { TextFieldForm } from 'src/components/inputs';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

export default function Index({ backAction, editObject, modulesList }) {
  const dispatch = useDispatch();

  const [formSubmitLoader, setFormSubmitLoader] = useState(false);

  const ActionSubmit = (values) => {
    setFormSubmitLoader(true);
    if (editObject?.RoleId) {
      values.RoleId = editObject?.RoleId;
    }
    dispatch(
      RoleModifyService(values, (res) => {
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
        RoleName: editObject?.RoleName || '',
        Description: editObject?.Description || '',
      }}
      validationSchema={Yup.object().shape({
        RoleName: Yup.string().trim().required('Role name is required.'),
        Description: Yup.string().trim().nullable(),
      })}
      onSubmit={ActionSubmit}
    >
      {(props) => {
        const { handleSubmit, dirty, resetForm } = props;
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
                <TextFieldForm formik={props} label="Role" field="RoleName" />
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
