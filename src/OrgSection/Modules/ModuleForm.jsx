import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { green } from 'src/theme/palette';
import { ModuleModifyService } from 'src/Services/org/Org.Services';

import ButtonLoader from 'src/components/Loaders/ButtonLoader';
import { CustomIconPicker } from 'src/components/CustomComponents';
import { TextFieldForm, AutoCompleteSelectMenu } from 'src/components/inputs';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

export default function Index({ backAction, editObject, modulesList }) {
  const dispatch = useDispatch();

  const [formSubmitLoader, setFormSubmitLoader] = useState(false);

  const ActionSubmit = (values) => {
    setFormSubmitLoader(true);
    if (editObject?.ModulesId) {
      values.ModulesId = editObject?.ModulesId;
    }
    dispatch(
      ModuleModifyService(values, (res) => {
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
        ModulesName: editObject?.ModulesName || '',
        ParentNoteId: editObject?.ParentNoteId || '',
        Description: editObject?.Description || '',
        Icon: editObject?.Icon || '',
        Router: editObject?.Router || '',
      }}
      validationSchema={Yup.object().shape({
        ModulesName: Yup.string().trim().required('Module name is required.'),
        Description: Yup.string().trim().nullable(),
        Icon: Yup.string().required('Icon is required.'),
        Router: Yup.string().required('Router is required.'),
      })}
      onSubmit={ActionSubmit}
    >
      {(props) => {
        const { handleSubmit, dirty, resetForm  ,} = props;
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
                <TextFieldForm formik={props} label="Module Name" field="ModulesName" />
              </Grid>

              <Grid xs={12} md={6}>
                <AutoCompleteSelectMenu
                  required={false}
                  formik={props}
                  label="Parent Note"
                  field="ParentNoteId"
                  menuList={modulesList}
                  valueKey="ModulesId"
                  labelKey="ModulesName"
                />
              </Grid>

              <Grid xs={12} md={6}>
                  <TextFieldForm formik={props} label="Router" field="Router" />
              </Grid>

              <Grid xs={12} md={6}>
                 <CustomIconPicker formik={props} required label="Icon" field="Icon" color={green[100]} />
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
