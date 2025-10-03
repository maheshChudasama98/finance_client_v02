import { useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';
import { useThemeSettings } from 'src/theme';

import Logo from '../logo';

export const CustomAuthBackend = ({ ChildComponent, titleString, endString, height }) => {
  const theme = useTheme();

  const { setMode, setPrimaryColor } = useThemeSettings();

  const persistedMode = 'light';
  const persistedPrimary = '#5BC43A';
  
  // Use useEffect to prevent infinite re-renders
  useEffect(() => {
    if (persistedMode) setMode(persistedMode);
    if (typeof persistedPrimary !== 'undefined') setPrimaryColor(persistedPrimary || '');
  }, [setMode, setPrimaryColor, persistedMode, persistedPrimary]);

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_1.jpg',
          startColor: alpha(theme.palette.success.main, 0.2),
          endColor: alpha(theme.palette.background.default, 0.1),
        }),
        height: 1,
        overflow: { xs: 'none', lg: 'hidden' },
        position: 'relative',
      }}
    >
      <Grid container spacing={0} sx={{ height: 1 }}>
        <Grid
          xs={12}
          md={6}
          lg={7}
          sx={{
            overflow: 'hidden',
            display: { xs: 'none', md: 'block' },
            height: 1,
          }}
        >
          <Stack
            sx={{
              height: { xs: '100%', md: '100%' },
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h3">Hi, Welcome back</Typography>
            <Typography variant="body2" sx={{ mt: 2, mb: 5 }} color="text.secondary">
              More effectively with optimized workflows.
            </Typography>
            <img
              style={{ width: 700, height: 'auto' }}
              src="/assets/background/background.png"
              alt="Dashboard illustration"
            />
          </Stack>
        </Grid>
        <Grid xs={12} md={6} lg={5}>
          <Box sx={{ height: 1, alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
            <Stack
              sx={{
                height: { xs: '100%', md: '100%' },
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: '100%', md: '100%' },
              }}
            >
              <Card
                sx={{
                  p: 5,
                  width: 1,
                  height: 1,
                  position: 'relative',
                  borderRadius: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                }}
              >
                <Logo disabledLink />
                <Box
                  sx={{
                    height: { xs: '90%', md: '90%' },
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Stack sx={{ height: 1 }}>
                    <Typography variant="h5" sx={{ mt: 2, mb: 5 }}>
                      {titleString}
                      <Box mt={1.5}>{endString}</Box>
                    </Typography>

                    {ChildComponent}
                  </Stack>
                </Box>
              </Card>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

CustomAuthBackend.propTypes = {
  ChildComponent: PropTypes.node,
  titleString: PropTypes.string,
  endString: PropTypes.node,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
