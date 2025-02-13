import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
// import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
// import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import { LoginApiAction } from 'src/Services/Auth.Services';
import { StaffID, VisitorID, ProjectName, ContractorID, SuperAdminID, JuniorEngineerID, } from 'src/constance';

import Logo from 'src/components/logo';
import { TextFieldForm } from 'src/components/inputs';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';

// ----------------------------------------------------------------------

export default function LoginView() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(true);

  const handleClick = (Role_id) => {
    switch (Role_id) {
      case StaffID: router.push('/dashboard'); break;
      case ContractorID: router.push('/dashboard'); break;
      case JuniorEngineerID: router.push('/dashboard'); break;
      case SuperAdminID: router.push('/dashboard'); break;
      case VisitorID: router.push('/dashboard'); break;
      default: break;
    }
  };


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmitAction = (values) => {
    const payload = {
      "UserEmail": values.UserEmail,
      "UserEmploymentNumber": values.UserEmploymentNumber,
      "UserPassword": values.UserPassword,
    }

    dispatch(LoginApiAction(payload, (response) => {
      setTimeout(() => {
        handleClick(response?.userData?.UserType_Id)
      }, 100)

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
          <Typography variant="h4" align='center' sx={{ mt: 2, mb: 5 }}>Sign in to {ProjectName}</Typography>

          <Formik
            enableReinitialize
            initialValues={{
              UserEmail: "",
              UserEmploymentNumber: "",
              UserPassword: ""
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
                  }),
                UserPassword: Yup.string()
                  .required('Password is required')
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
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
                  <Link variant="subtitle2" underline="hover" onClick={() => router.push('/forgot-password')} >
                    Forgot password?
                  </Link>
                </Stack>
                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="success" > Login
                </Button>
                <Typography variant="body2" sx={{ color: 'text.secondary'  , textAlign: 'center', mt: 1  }}>
                  Version : {__APP_VERSION__}
                </Typography>

              </Form>
            )}
          </Formik >
        </Card>
      </Stack>
    </Box >
  );
}
