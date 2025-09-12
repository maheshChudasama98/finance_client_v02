import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

import { useRouter } from 'src/routes/hooks';

import { SignupApiAction, InfoApiActionService } from 'src/Services/Auth.Services';

import { TextFieldForm } from 'src/components/inputs';
import { CustomAuthBackend } from 'src/components/CustomComponents';

import { Alert } from 'antd';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

// ----------------------------------------------------------------------

export default function SignupView() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmitAction = async (values, { setSubmitting }) => {
    const payload = {
      UserFirstName: values.UserFirstName,
      UserLastName: values.UserLastName,
      UserEmail: values.UserEmail,
      UserPassword: values.UserPassword,
    };

    // Reset messages and set loading states
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);
    setIsSubmitting(true);

    try {
      dispatch(
        SignupApiAction(payload, (response) => {
          setIsLoading(false);
          setIsSubmitting(false);
          setSubmitting(false);

          if (response?.status) {
            setErrorMsg(null);
            setSuccessMsg('Account created successfully! Redirecting to dashboard...');

            setTimeout(() => {
              dispatch(
                InfoApiActionService((res) => {
                  router.push('/dashboard');
                })
              );
            }, 1500);
          } else {
            setErrorMsg(response?.message || 'An error occurred during signup. Please try again.');
            setSuccessMsg(null);
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

  return (
    <CustomAuthBackend
      titleString="Get started absolutely free"
      height={{ xs: '50%', md: '100%' }}
      ChildComponent={
        <Formik
          enableReinitialize
          initialValues={{
            UserFirstName: '',
            UserLastName: '',
            UserEmail: '',
            UserPassword: '',
          }}
          validationSchema={Yup.object().shape({
            UserFirstName: Yup.string()
              .min(2, 'First name must be at least 2 characters')
              .required('First name is required'),
            UserLastName: Yup.string()
              .min(2, 'Last name must be at least 2 characters')
              .required('Last name is required'),
            UserEmail: Yup.string()
              .email('Please enter a valid email address')
              .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                'Please enter a valid email'
              )
              .required('Email is required'),
            UserPassword: Yup.string()
              .min(6, 'Password must be at least 6 characters')
              .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'Password must contain at least one uppercase letter, one lowercase letter, and one number'
              )
              .required('Password is required'),
          })}
          onSubmit={handleSubmitAction}
        >
          {(props) => (
            <Form autoComplete="off" noValidate>
              <Stack spacing={3}>
                {/* Error Message */}
                {errorMsg && (
                  <Alert
                    message={errorMsg}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setErrorMsg(null)}
                  />
                )}

                {/* Success Message */}
                {successMsg && <Alert message={successMsg} type="success" showIcon />}

                <TextFieldForm
                  formik={props}
                  label="First Name"
                  field="UserFirstName"
                  disabled={isLoading}
                />
                <TextFieldForm
                  formik={props}
                  label="Last Name"
                  field="UserLastName"
                  disabled={isLoading}
                />
                <TextFieldForm
                  formik={props}
                  label="Email"
                  field="UserEmail"
                  disabled={isLoading}
                />
                <TextFieldForm
                  formik={props}
                  label="Password"
                  field="UserPassword"
                  type={!showPassword ? 'text' : 'password'}
                  disabled={isLoading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          disabled={isLoading}
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

                {!successMsg && (
                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="success"
                    disabled={isLoading || isSubmitting || !props.isValid}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{
                      minHeight: 48,
                      '&:disabled': {
                        backgroundColor: theme.palette.grey[300],
                        color: theme.palette.grey[500],
                      },
                    }}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Sign up'}
                  </Button>
                )}
              </Stack>
            </Form>
          )}
        </Formik>
      }
      endString={
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            // textAlign: 'center',
            // mt: 5,
            opacity: isLoading ? 0.5 : 1,
          }}
        >
          Do you already have an account?{' '}
          <Link
            variant="subtitle2"
            underline="hover"
            onClick={() => !isLoading && router.push('/login')}
            sx={{
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            Sign in
          </Link>
        </Typography>
      }
    />
  );
}
