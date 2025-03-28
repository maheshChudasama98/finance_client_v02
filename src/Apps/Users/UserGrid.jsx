import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { success } from 'src/theme/palette';

import { CustomAvatar } from 'src/components/CustomComponents';

const ProjectItem = ({ item, editAction, deleteAction }) => (
  <Card
    sx={{
      border: (theme) => `solid 1px ${theme?.palette?.grey?.[400]}`,
      borderColor: (theme) => `${theme?.palette?.grey?.[200]}`,
      borderRadius: 1,
      my: 1,
    }}
  >
    <Box
      sx={{ width: '100%', px: 1, py: 1.5 }}
      onClick={() => {
        editAction(item);
      }}
    >
      <Grid container spacing={1.5}>
        <Grid xs={12}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CustomAvatar
              width={{ xs: 60, md: 60, lg: 60 }} // default width
              height={{ xs: 60, md: 60, lg: 60 }}
              bgColor={success?.main}
              displayName={item?.AvatarName}
              photoURL={item?.ImgPath || ''}
            />

            <Typography variant="big">
              {item?.FullName}
              <Typography
                variant="light"
                color="text.secondary"
                sx={{
                  whiteSpace: 'nowrap', // Prevent line break
                  overflow: 'hidden', // Hide overflowing text
                  textOverflow: 'ellipsis',
                  maxWidth: '200px',
                }}
              >
                {item?.Email}
              </Typography>
            </Typography>
          </Stack>
        </Grid>

        <Grid xs={6} sx={{ pl: 2 }}>
          <Typography variant="normal" fontWeight={700} color="text.secondary">
            Role Name{' '}
          </Typography>
        </Grid>
        <Grid xs={6}>
          <Typography variant="light" fontWeight={500}>
            {item?.RoleName}
          </Typography>
        </Grid>

        <Grid xs={6} sx={{ pl: 2 }}>
          <Typography variant="normal" fontWeight={700} color="text.secondary">
            Mobile
          </Typography>
        </Grid>
        <Grid xs={6}>
          <Typography variant="light" fontWeight={500}>
            {item?.Mobile || 'N/A'}
          </Typography>
        </Grid>

        <Grid xs={6} sx={{ pl: 2 }}>
          <Typography variant="normal" fontWeight={700} color="text.secondary">
            Registration{' '}
          </Typography>
        </Grid>
        <Grid xs={6}>
          <Typography variant="light" fontWeight={500}>
            {fDate(item?.createdAt)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  </Card>
);
export default ProjectItem;
