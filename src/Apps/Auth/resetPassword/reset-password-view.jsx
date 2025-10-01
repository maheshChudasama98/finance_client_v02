import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

import { useRouter } from 'src/routes/hooks';

import { OTPPasswordService, ForgotPasswordService } from 'src/Services/Auth.Services';

import { OTPFieldForm, TextFieldForm } from 'src/components/inputs';
import { CustomAuthBackend } from 'src/components/CustomComponents';

import { Alert } from 'antd';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

// ----------------------------------------------------------------------

export default function ResetPasswordView() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(true);
  const [confirmShowPassword, setConfirmShowPassword] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [userEmploymentNumber, setUserEmploymentNumber] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [flag, setFlag] = useState(true);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOTPLoading, setIsOTPLoading] = useState(false);
  const [isOTPSubmitting, setIsOTPSubmitting] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickConfirmShowPassword = () => setConfirmShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmitAction = async (values, { setSubmitting }) => {
    const payload = {
      UserEmail: values.UserEmail,
      UserEmploymentNumber: values.UserEmploymentNumber,
    };

    if (values.UserEmail) {
      setUserEmail(values.UserEmail);
    }

    if (values.UserEmploymentNumber) {
      setUserEmploymentNumber(values.UserEmploymentNumber);
    }

    setSuccessMsg(null);
    setErrorMsg(null);
    setIsLoading(true);
    setIsSubmitting(true);

    try {
      dispatch(
        ForgotPasswordService(payload, (response) => {
          setIsLoading(false);
          setIsSubmitting(false);
          setSubmitting(false);

          if (response?.status) {
            setSuccessMsg(response?.message || 'OTP sent successfully! Please check your email.');
            setErrorMsg(null);
            setFlag(false);
          } else {
            setErrorMsg(response?.message || 'Failed to send OTP. Please try again.');
            setSuccessMsg(null);
            setFlag(true);
          }
        })
      );
    } catch (error) {
      setIsLoading(false);
      setIsSubmitting(false);
      setSubmitting(false);
      setErrorMsg('Network error. Please check your connection and try again.');
      setSuccessMsg(null);
    }
  };

  const handleSubmitUpdateAction = async (values, { setSubmitting }) => {
    const payload = {
      OptNum: values.OptNum,
      UserPassword: values.UserPassword,
    };

    if (userEmail) {
      payload.UserEmail = userEmail;
    }

    if (userEmploymentNumber) {
      payload.UserEmploymentNumber = userEmploymentNumber;
    }

    setSuccessMsg(null);
    setErrorMsg(null);
    setIsOTPLoading(true);
    setIsOTPSubmitting(true);

    try {
      dispatch(
        OTPPasswordService(payload, (response) => {
          setIsOTPLoading(false);
          setIsOTPSubmitting(false);
          setSubmitting(false);

          if (response?.status) {
            setSuccessMsg(
              response?.message || 'Password updated successfully! Redirecting to login...'
            );
            setErrorMsg(null);

            router.push('/login');
          } else {
            setErrorMsg(
              response?.message || 'Invalid OTP or failed to update password. Please try again.'
            );
            setSuccessMsg(null);
          }
        })
      );
    } catch (error) {
      setIsOTPLoading(false);
      setIsOTPSubmitting(false);
      setSubmitting(false);
      setErrorMsg('Network error. Please check your connection and try again.');
      setSuccessMsg(null);
    }
  };

  return (
    <CustomAuthBackend
      titleString={flag ? 'Forgot your password?' : 'Verify OTP'}
      ChildComponent={
        <>
          {errorMsg && (
            <Box sx={{ mb: 2 }}>
              <Alert
                message={errorMsg}
                type="error"
                showIcon
                closable
                onClose={() => setErrorMsg(null)}
              />
            </Box>
          )}

          {successMsg && (
            <Box sx={{ mb: 2 }}>
              <Alert message={successMsg} type="success" showIcon />
            </Box>
          )}

          {flag && (
            <Formik
              enableReinitialize
              initialValues={{
                UserEmail: '',
              }}
              validationSchema={Yup.object().shape({
                UserEmail: Yup.string()
                  .email('Please enter a valid email address')
                  .matches(
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    'Please enter a valid email'
                  )
                  .required('Email is required'),
              })}
              onSubmit={handleSubmitAction}
            >
              {(props) => (
                <Form autoComplete="off" noValidate>
                  <Stack spacing={3}>
                    <TextFieldForm
                      formik={props}
                      label="Email"
                      field="UserEmail"
                      disabled={isLoading}
                    />
                    <Button
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isLoading || isSubmitting || !props.isValid}
                      startIcon={
                        isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
                      }
                      sx={{
                        minHeight: 48,
                        '&:disabled': {
                          backgroundColor: 'rgba(0, 0, 0, 0.12)',
                          color: 'rgba(0, 0, 0, 0.26)',
                        },
                      }}
                    >
                      {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          )}

          {!flag && (
            <Formik
              enableReinitialize
              initialValues={{
                OptNum: '',
                UserPassword: '',
                ConfirmPassword: '',
              }}
              validationSchema={Yup.object().shape({
                OptNum: Yup.string()
                  .matches(/^[0-9]+$/, 'Must be a valid number.')
                  .length(6, 'OTP must be exactly 6 digits')
                  .required('OTP is required'),
                UserPassword: Yup.string()
                  .required('Password is required')
                  .min(8, 'Password must be at least 8 characters')
                  .matches(
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])(?=\S+$).{8,}$/,
                    'Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and 1 special character'
                  ),
                ConfirmPassword: Yup.string()
                  .oneOf([Yup.ref('UserPassword')], 'Passwords must match')
                  .required('Confirm password is required.'),
              })}
              onSubmit={handleSubmitUpdateAction}
            >
              {(props) => (
                <Form autoComplete="off" noValidate>
                  <Stack spacing={3}>
                    <OTPFieldForm
                      type="number"
                      formik={props}
                      label="OTP Code"
                      field="OptNum"
                      disabled={isOTPLoading}
                      placeholder="Enter 6-digit OTP"
                    />

                    <TextFieldForm
                      formik={props}
                      label="New Password"
                      field="UserPassword"
                      type={!showPassword ? 'text' : 'password'}
                      disabled={isOTPLoading}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              disabled={isOTPLoading}
                            >
                              {showPassword ? (
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
                      label="Confirm Password"
                      field="ConfirmPassword"
                      type={!confirmShowPassword ? 'text' : 'password'}
                      disabled={isOTPLoading}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickConfirmShowPassword}
                              // onMouseDown={handleMouseDownPassword}
                              edge="end"
                              disabled={isOTPLoading}
                            >
                              {confirmShowPassword ? (
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
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isOTPLoading || isOTPSubmitting || !props.isValid}
                      startIcon={
                        isOTPSubmitting ? <CircularProgress size={20} color="inherit" /> : null
                      }
                      sx={{
                        minHeight: 48,
                        '&:disabled': {
                          backgroundColor: 'rgba(0, 0, 0, 0.12)',
                          color: 'rgba(0, 0, 0, 0.26)',
                        },
                      }}
                    >
                      {isOTPSubmitting ? 'Updating Password...' : 'Change Password'}
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          )}
        </>
      }
      endString={
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            opacity: isLoading || isOTPLoading ? 0.5 : 1,
          }}
        >
          <Link
            variant="subtitle2"
            underline="hover"
            onClick={() => !isLoading && !isOTPLoading && router.push('/login')}
            sx={{
              cursor: isLoading || isOTPLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading || isOTPLoading ? 0.5 : 1,
            }}
          >
            <i className="fa-solid fa-chevron-left fa-sm" /> Return to sign in
          </Link>
        </Typography>
      }
    />
  );
}
