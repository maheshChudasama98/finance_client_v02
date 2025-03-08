import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import { OTPPasswordService, ForgotPasswordService, } from 'src/Services/Auth.Services';

import Logo from 'src/components/logo';
import { TextFieldForm } from 'src/components/inputs';

import { Alert } from 'antd';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';


// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(true);

  const [userEmail, setUserEmail] = useState(null);
  const [userEmploymentNumber, setUserEmploymentNumber] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [flag, setFlag] = useState(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  const handleSubmitAction = (values) => {
    const payload = {
      "UserEmail": values.UserEmail,
      "UserEmploymentNumber": values.UserEmploymentNumber,
    }
    if (values.UserEmail) {
      setUserEmail(values.UserEmail)
    };

    if (values.UserEmploymentNumber) {
      setUserEmploymentNumber(values.UserEmploymentNumber)
    };

    setSuccessMsg(null);
    setErrorMsg(null);

    dispatch(ForgotPasswordService(payload, (response) => {
      if (response?.status) {
        setSuccessMsg(response?.message);
        setErrorMsg(null);
        setFlag(false);
      } else {
        setErrorMsg(response?.message);
        setSuccessMsg(null);
        setFlag(true);
      }
    }))
  };

  const handleSubmitUpdateAction = (values) => {
    const payload = {
      "OptNum": values.OptNum,
      "UserPassword": values.UserPassword,
    }
    if (userEmail) {
      payload.UserEmail = userEmail;
    };

    if (userEmploymentNumber) {
      payload.UserEmploymentNumber = userEmploymentNumber;
    };
    setSuccessMsg(null);
    setErrorMsg(null);

    dispatch(OTPPasswordService(payload, (response) => {
      if (response?.status) {
        setSuccessMsg(response?.message);
        setErrorMsg(null);
        router.push('/login');
        // setFlag(false);
      } else {
        setErrorMsg(response?.message);
        setSuccessMsg(null);
        // setFlag(true);
      }
    }))
  };


  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />


      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >

          <Typography variant="h4">Forgot Password</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
            {/* Don’t have an account? */}
            <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={() => router.push('/login')}>
              Sign in ?
            </Link>
          </Typography>

          <Box sx={{ my: 2 }}>
            {
              errorMsg && <Alert message={errorMsg} type="error" showIcon />
            }

            {
              successMsg && <Alert message={successMsg} type="success" showIcon />
            }
          </Box>

          {
            flag &&
            <Formik
              enableReinitialize
              initialValues={{
                UserEmail: "",
                UserEmploymentNumber: "",
              }}
              validationSchema={
                Yup.object().shape({

                  UserEmail: Yup.string()
                    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email')
                    .nullable()
                    .test('either-email-or-employment', 'Either Email or Employment Number is required', (value, context) => {
                      const { UserEmploymentNumber } = context.parent;
                      return Boolean(value || UserEmploymentNumber);
                    }),
                  UserEmploymentNumber: Yup.string()
                    .nullable()
                    .test('either-email-or-employment', 'Either Email or Employment Number is required', (value, context) => {
                      const { UserEmail } = context.parent;
                      return Boolean(value || UserEmail);
                    })
                })
              }
              onSubmit={handleSubmitAction}
            >
              {(props) => (
                <Form autoComplete="off" noValidate >
                  <Stack spacing={3}  >
                    <TextFieldForm
                      formik={props}
                      label='Email'
                      field='UserEmail'
                    />

                    <Divider sx={{ my: 3 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        OR
                      </Typography>
                    </Divider>

                    <TextFieldForm
                      type="number"
                      formik={props}
                      label='Employment Number'
                      field='UserEmploymentNumber'
                    />


                    <Button
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="success" > Forgot Password
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik >
          }

          {
            !flag &&
            <Formik
              enableReinitialize
              initialValues={{
                OptNum: "",
                UserPassword: "",
              }}
              validationSchema={
                Yup.object().shape({
                  OptNum: Yup.string()
                    .matches(/^[0-9]+$/, "Must be a valid number.")
                    .required("Opt Number is required."),
                  UserPassword: Yup.string()
                    .required('Password is required')
                    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])(?=\S+$).{8,}$/, "Passwords should have at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and 1 valid special character. Avoid spaces."),
                })
              }
              onSubmit={handleSubmitUpdateAction}
            >
              {(props) => (
                <Form autoComplete="off" noValidate >
                  <Stack spacing={3}  >
                    <TextFieldForm
                      type="number"
                      formik={props}
                      label='Opt'
                      field='OptNum'
                    />

                    <TextFieldForm
                      formik={props}
                      label='Password'
                      field='UserPassword'
                      type={!showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOutlinedIcon fontSize="small" /> : <VisibilityOffOutlinedIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />

                    <Button
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="success" > Change Password
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik >
          }

        </Card>
      </Stack>
    </Box>
  );
}
