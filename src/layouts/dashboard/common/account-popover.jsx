import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { PASSWORD_REGEX } from 'src/constance';
import { ResetPasswordService } from 'src/Services/Auth.Services';

import { ModalDialog } from 'src/components/model';
import { TextFieldForm } from 'src/components/inputs';

import { Form, Formik } from 'formik';

import * as Yup from 'yup';
// ----------------------------------------------------------------------

// const MENU_OPTIONS = [
//   {
//     label: 'Home',
//     icon: 'eva:home-fill',
//   },
//   {
//     label: 'Profile',
//     icon: 'eva:person-fill',
//   },
//   {
//     label: 'Change Password',
//     icon: 'eva:person-fill',
//   },
//   // {
//   //   label: 'Settings',
//   //   icon: 'eva:settings-2-fill',
//   // },
// ];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.auth?.userDetails);
  const [open, setOpen] = useState(null);
  const [show, setShow] = useState(false);


  console.log();
  
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleLogout = () => {
    navigate("/login")
    setOpen(null);
    localStorage.clear();
    dispatch({ type: "USER_REMOVE" });
  };
  const handleClose = () => {
    // navigate("/login")
    setOpen(null);
  };


  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src='/assets/images/avatars/avatar_25.jpg'
          alt={UserDetails?.FullName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {UserDetails?.FullName?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {UserDetails?.FullName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {UserDetails?.Email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleClose} sx={{ m: 0, py: 1.5 }}>
          Profile
        </MenuItem>
        <MenuItem sx={{ m: 0, py: 1.5 }} onClick={() => setShow(true)} >
          Change Password
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}>
          Logout
        </MenuItem>
      </Popover >


      <ModalDialog
        fullScreen
        title="Change Password"
        open={show}
        handleClose={() => { setShow(false); }}>
        <Box sx={{ minWidth: { xs: 250, md: 500, }, }}>

          <Formik
            enableReinitialize
            initialValues={{
              OldPassword: null,
              Password: null,
              ConfirmPassword: null,
            }}
            validationSchema={Yup.object().shape({
              OldPassword: Yup.string().required("Current password is required."),
              Password: Yup.string()
                .matches(
                  PASSWORD_REGEX,
                  'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
                )
                .required('Password is required'),
              ConfirmPassword: Yup.string()
                .oneOf([Yup.ref('Password')], 'Passwords must match')
                .required("Confirm password is required."),
            })}
            onSubmit={(values) => {
              values.UserEmail = UserDetails.UserEmail;
              values.UserPassword = values.ConfirmPassword;
              dispatch(ResetPasswordService(values, (res) => {

                if (res.status) { 
                  setShow(false);
                }
              }))

            }}
          >
            {(props) => (
              <Form noValidate>
                <Stack spacing={3} alignItems="center" justifyContent="center">
                  <TextFieldForm formik={props} field="OldPassword" label="Current Password" required />
                  <TextFieldForm formik={props} field="Password" label="New Password" type="password" required />
                  <TextFieldForm formik={props} field="ConfirmPassword" label="Confirm Password" type="password" required />

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


          {/*
           <Typography variant='normal' sx={{ alignItems: "center" }}>Are you sure want to delete ?</Typography>
          <Box sx={{
            mt: 2,
            textAlign: "end",
            justifyContent: "center",
            display: "flex"
          }}>
            <Button
              onClick={DeleteAction}
              variant="contained"
              color="error"
              size="small" >
              Delete
            </Button>

            <Button
              sx={{ marginX: 1 }}
              size="small"
              onClick={() => { setOpen(false); setDeleteObject({}) }}
              variant="outlined"
              color="CancelButton">
              Cancel
            </Button>
          </Box>
           */}
        </Box>
      </ModalDialog >

    </>
  );
}
