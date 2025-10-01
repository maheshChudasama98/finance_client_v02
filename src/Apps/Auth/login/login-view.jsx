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

import { LoginApiAction, InfoApiActionService } from 'src/Services/Auth.Services';

import { TextFieldForm } from 'src/components/inputs';
import { CustomAuthBackend } from 'src/components/CustomComponents';

import { Alert } from 'antd';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

// ----------------------------------------------------------------------

export default function LoginView() {
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
        LoginApiAction(payload, (response) => {
          setIsLoading(false);
          setIsSubmitting(false);
          setSubmitting(false);

          if (response?.status) {
            setErrorMsg(null);
            setSuccessMsg('Login successful! Redirecting to dashboard...');
            dispatch(
              InfoApiActionService((res) => {
                router.push('/dashboard');
              })
            );
          } else {
            setErrorMsg(response?.message || 'Invalid email or password. Please try again.');
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
      titleString="Sign in to your account"
      height={{ xs: '70%', md: '100%' }}
      ChildComponent={
        <Formik
          enableReinitialize
          initialValues={{
            UserEmail: '',
            UserPassword: '',
          }}
          validationSchema={Yup.object().shape({
            UserEmail: Yup.string()
              .email('Please enter a valid email address')
              .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                'Please enter a valid email'
              )
              .required('Email is required'),
            UserPassword: Yup.string()
              .min(1, 'Password is required')
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
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
                <Link
                  variant="subtitle2"
                  underline="hover"
                  onClick={() => !isLoading && router.push('/forgot-password')}
                  sx={{
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  Forgot password?
                </Link>
              </Stack>

              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
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
                {isSubmitting ? 'Signing in...' : 'Login'}
              </Button>
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
          Don&apos;t have an account?
          <Link
            variant="subtitle2"
            underline="hover"
            onClick={() => !isLoading && router.push('/signup')}
            sx={{
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            {' '}
            Sign up
          </Link>
        </Typography>
      }
    />
  );
}
