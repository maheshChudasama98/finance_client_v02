import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { PASSWORD_REGEX } from 'src/constance';
import { ResetPasswordService } from 'src/Services/Auth.Services';

import { TextFieldForm } from 'src/components/inputs';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

export default function AccountPopover() {
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.auth?.userDetails);
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
      <Card sx={{ mx: 20, my: 10, p: 5, width: 1, maxWidth: 520 }}>
        <Typography variant="h4" align="center" sx={{ mt: 2, mb: 5 }}>
          Change Password
        </Typography>

        <Formik
          enableReinitialize
          initialValues={{
            OldPassword: null,
            Password: null,
            ConfirmPassword: null,
          }}
          validationSchema={Yup.object().shape({
            OldPassword: Yup.string().required('Current password is required.'),
            Password: Yup.string()
              .matches(
                PASSWORD_REGEX,
                'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
              )
              .required('Password is required'),
            ConfirmPassword: Yup.string()
              .oneOf([Yup.ref('Password')], 'Passwords must match')
              .required('Confirm password is required.'),
          })}
          onSubmit={(values) => {
            values.UserEmail = UserDetails.UserEmail;
            values.UserPassword = values.ConfirmPassword;
            dispatch(ResetPasswordService(values, (res) => {}));
          }}
        >
          {(props) => (
            <Form noValidate autoComplete="off">
              <Stack spacing={3} alignItems="center" justifyContent="center">
                <TextFieldForm
                  formik={props}
                  field="OldPassword"
                  label="Current Password"
                  required
                  autoComplete="current-password"
                  name="current-random"
                  id="current-random"
                />
                <TextFieldForm
                  formik={props}
                  field="Password"
                  label="New Password"
                  type="password"
                  required
                  autoComplete="new-password"
                  name="new-random"
                  id="new-random"
                />
                <TextFieldForm
                  formik={props}
                  field="ConfirmPassword"
                  label="Confirm Password"
                  type="password"
                  required
                  autoComplete="confirm-password"
                  name="confirm-password"
                  id="confirm-password"
                />

                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="success"
                  onClick={props.handleSubmit}
                >
                  Change Password
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Card>
    </Stack>
  );
}
