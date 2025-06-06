import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { LabelModifyService } from 'src/Services/Meter.Services';

import { TextFieldForm } from 'src/components/inputs';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

export default function Index({ backAction, editObject, deletedAction, apiCallAction }) {
  const dispatch = useDispatch();
  const PermissionList = useSelector((state) => state?.auth?.permissionList);
  const { CanWrite } = PermissionList?.find((item) => item.ModulesName === 'Labels') || {};

  const [formSubmitLoader, setFormSubmitLoader] = useState(false);

  const ActionSubmit = (values) => {
    setFormSubmitLoader(true);
    if (editObject?.LabelId) {
      values.LabelId = editObject?.LabelId;
    }
    dispatch(
      LabelModifyService(values, (res) => {
        setFormSubmitLoader(false);
        if (res?.status) {
          if (editObject?.LabelId && apiCallAction) {
            apiCallAction();
          } else {
            backAction();
          }
        }
      })
    );
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        LabelName: editObject?.LabelName || '',
        Description: editObject?.Description || '',
      }}
      validationSchema={Yup.object().shape({
        LabelName: Yup.string().trim().required('Label is required.'),
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
                <TextFieldForm
                  formik={props}
                  label="Label"
                  field="LabelName"
                  disabled={!CanWrite}
                />
              </Grid>

              <Grid item xs={12}>
                <TextFieldForm
                  required={false}
                  formik={props}
                  label="Description"
                  field="Description"
                  multiline
                  rows={3}
                  maxRows={3}
                  disabled={!CanWrite}
                />
              </Grid>

              <Grid xs={12}>
                <Box sx={{ float: 'right', display: 'flex' }}>
                  {editObject?.LabelId && (
                    <Button
                      variant="contained"
                      sx={{ marginX: 1 }}
                      onClick={() => {
                        deletedAction(editObject);
                      }}
                      color="error"
                    >
                      Deleted
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
