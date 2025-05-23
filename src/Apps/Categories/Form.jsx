import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { CategoryModifyService } from 'src/Services/Meter.Services';

import { TextFieldForm } from 'src/components/inputs';
import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { CustomIconPicker, CustomColorPicker } from 'src/components/CustomComponents';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

export default function Index({ backAction, editObject, deleteAction }) {
  const dispatch = useDispatch();

  const [formSubmitLoader, setFormSubmitLoader] = useState(false);

  const ActionSubmit = (values) => {
    setFormSubmitLoader(true);
    if (editObject?.CategoryId) {
      values.CategoryId = editObject?.CategoryId;
    }
    dispatch(
      CategoryModifyService(values, (res) => {
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
        CategoryName: editObject?.CategoryName || '',
        Icon: editObject?.Icon || '',
        Color: editObject?.Color || '',
        Description: editObject?.Description || '',
      }}
      validationSchema={Yup.object().shape({
        CategoryName: Yup.string().trim().required('Category is required.'),
        Color: Yup.string().trim().required('Color is required.'),
        Icon: Yup.string().required('Icon is required.'),
        Description: Yup.string().trim().nullable(),
      })}
      onSubmit={ActionSubmit}
    >
      {(props) => {
        const { handleSubmit, dirty, resetForm, values } = props;
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
              <Grid item xs={12} md={6}>
                <CustomColorPicker required formik={props} label="Color" field="Color" />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomIconPicker
                  required
                  formik={props}
                  label="Icon"
                  field="Icon"
                  color={values?.Color}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextFieldForm formik={props} label="Category" field="CategoryName" />
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
                  {editObject?.CategoryId && (
                    <Button
                      variant="contained"
                      sx={{ marginX: 1 }}
                      onClick={() => {
                        deleteAction(editObject);
                      }}
                      color="error"
                    >
                      Deleted
                    </Button>
                  )}
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

              {/* <Grid xs={12}>
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
              </Grid> */}
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
}
