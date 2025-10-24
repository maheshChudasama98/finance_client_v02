import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

import { PASSWORD_REGEX } from 'src/constance';
import { ResetPasswordService } from 'src/Services/Auth.Services';

import { TextFieldForm } from 'src/components/inputs';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

export default function AccountPopover() {
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.auth?.userDetails);
  
  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password visibility handlers
  const handleClickShowOldPassword = () => setShowOldPassword((show) => !show);
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
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
            values.UserEmail = UserDetails.Email;
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
                  type={showOldPassword ? 'text' : 'password'}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle current password visibility"
                          onClick={handleClickShowOldPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showOldPassword ? (
                            <VisibilityOutlinedIcon fontSize="small" />
                          ) : (
                            <VisibilityOffOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextFieldForm
                  formik={props}
                  field="Password"
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle new password visibility"
                          onClick={handleClickShowNewPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showNewPassword ? (
                            <VisibilityOutlinedIcon fontSize="small" />
                          ) : (
                            <VisibilityOffOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextFieldForm
                  formik={props}
                  field="ConfirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOutlinedIcon fontSize="small" />
                          ) : (
                            <VisibilityOffOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
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
