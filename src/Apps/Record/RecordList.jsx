import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { useAmountVisibility } from 'src/hooks/use-amount-visibility';

import { fDate } from 'src/utils/format-time';
import { fText } from 'src/utils/format-text';
import { getThemeColor } from 'src/utils/utils';
import { formatToINR } from 'src/utils/format-number';
import { sweetAlertQuestion } from 'src/utils/sweet-alerts';

import { TransactionActions } from 'src/constance';

import { CustomAvatar } from 'src/components/CustomComponents';

const RecordList = ({ item, isHeader, deleteAction, editAction, filterHeader }) => {
  const { isAmountVisible } = useAmountVisibility();

  const chipStyles = {
    fontSize: { xs: 10, sm: 11 },
    borderRadius: 1,
    fontWeight: 700,
  };

  const ChipFun = (status) => {
    const Action = TransactionActions?.find((i) => status === i.key);

    return (
      <Chip
        size="small"
        sx={{
          ...chipStyles,
          color: Action?.textColor ? Action?.textColor : '#000',
          backgroundColor: getThemeColor(Action?.textColor ? Action?.textColor : '#FFF', 0.85),
          '&:hover': {
            backgroundColor: getThemeColor(Action?.textColor ? Action?.textColor : '#FFF', 0.5),
          },
        }}
        label={Action?.value || status}
      />
    );
  };

  const iconSet = (action, icon) => {
    if (action === 'From') {
      return 'fa-solid fa-right-left';
    }
    if (action === 'Investment') {
      return 'fa-solid fa-chart-simple';
    }
    if (action === 'Debit' || action === 'Credit' || action === 'Refund' || action === 'Credit') {
      return 'fa-solid fa-people-arrows';
    }
    return icon;
  };

  const getSubCategoryName = (record) => {
    if (record?.SubCategoryDetails?.SubCategoriesName) {
      return fText(`${record?.SubCategoryDetails?.SubCategoriesName}`);
    }
    if (record?.Action === 'From') {
      return 'Transfer';
    }
    return record?.Action;
  };

  // const tooltipString = (record) => {
  //   const tagList = record?.TagList?.map((e) => e?.LabelName) || [];

  //   let formattedTags = '';
  //   if (tagList.length > 1) {
  //     formattedTags = `${tagList.slice(0, -1).join(', ')} and ${tagList.slice(-1)}`;
  //   } else if (tagList.length === 1) {
  //     formattedTags = tagList[0];
  //   }

  //   return (
  //     <div>
  //       {tagList.length > 0 && (
  //         <div>
  //           <small>
  //             <b>Label:</b> {formattedTags}
  //           </small>
  //         </div>
  //       )}
  //       {record?.Description && (
  //         <div>
  //           <small>
  //             <b>Desc:</b> {record.Description}
  //           </small>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  const renderTags = (record) => {
    if (!record?.TagList || record.TagList.length === 0) return null;

    return (
      <Box sx={{ mt: 1.5, pt: 1.5, borderTop: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mr: 1 }}>
            Tags:
          </Typography>
          {record.TagList.map((tag, index) => (
            <Chip
              key={index}
              size="small"
              variant="outlined"
              sx={{
                fontSize: 10,
                height: 20,
                borderRadius: 1,
                borderColor: 'primary.main',
                color: 'white',
                backgroundColor: 'primary.main',
              }}
              label={tag.LabelName}
            />
          ))}
        </Stack>
      </Box>
    );
  };

  const renderDescription = (record) => {
    if (!record?.Description) return null;

    return (
      <Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          &ldquo;{record.Description}&rdquo;
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Card
        sx={{
          mb: 1,
          backgroundColor: (theme) => theme.palette.background.neutral2,
          borderRadius: 2,
        }}
      >
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid xs={6}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                {fDate(item?.date)}
              </Typography>
            </Grid>
            <Grid xs={6}>
              <Typography
                variant="subtitle1"
                sx={{
                  textAlign: 'end',
                  fontWeight: 700,
                  color: (theme) =>
                    item?.dayTotal >= 0 ? theme.palette.success.main : theme.palette.error.main,
                }}
              >
                {formatToINR(item?.dayTotal)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* Transaction Records */}
      {item?.records?.map((record, key) => (
        <Card
          key={key}
          sx={{
            mb: 1,
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
            '&:hover': {
              boxShadow: 2,
              borderColor: 'primary.main',
            },
          }}
        >
          {/* Desktop View */}
          <Box sx={{ display: { xs: 'none', lg: 'block' }, p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid xs={2.5}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <CustomAvatar
                    width={40}
                    height={40}
                    iconSize={14}
                    icon={iconSet(record?.Action, record?.SubCategoryDetails?.Icon)}
                    bgColor={record?.CategoryDetails?.Color}
                  />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {getSubCategoryName(record)}
                    </Typography>
                    {record?.CategoryDetails?.CategoryName && (
                      <Typography variant="caption" color="text.secondary">
                        {fText(`${record?.CategoryDetails?.CategoryName}`)}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Grid>

              <Grid xs={1.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  {ChipFun(record?.Action)}
                </Stack>
              </Grid>

              <Grid xs={1.5}>
                <Chip
                  onClick={() => filterHeader('AccountsIds', [record?.AccountId])}
                  size="small"
                  sx={{
                    ...chipStyles,
                    color: record?.AccountDetails?.Color || '#1b925e',
                    backgroundColor: getThemeColor(
                      record?.AccountDetails?.Color || '#1b925e',
                      0.85
                    ),
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: getThemeColor(
                        record?.AccountDetails?.Color || '#1b925e',
                        0.85
                      ),
                    },
                  }}
                  label={record?.AccountDetails?.AccountName}
                />
              </Grid>

              <Grid xs={1.5}>
                {record?.TransferDetails?.AccountName && (
                  <Chip
                    size="small"
                    sx={{
                      ...chipStyles,
                      color: record?.TransferDetails?.Color || '#1b925e',
                      backgroundColor: getThemeColor(
                        record?.TransferDetails?.Color || '#00A76F',
                        0.92
                      ),
                    }}
                    label={record?.TransferDetails?.AccountName}
                  />
                )}
              </Grid>

              <Grid xs={1.5}>
                {record?.PartyDetails?.FullName && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CustomAvatar
                      width={45}
                      height={45}
                      iconSize={15}
                      displayName={record?.PartyDetails?.PartyAvatar}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                      {fText(`${record?.PartyDetails?.FullName}`)}
                    </Typography>
                  </Stack>
                )}
              </Grid>

              <Grid xs={1.5}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    textAlign: 'end',
                    fontWeight: 700,
                    color: (theme) =>
                      record?.AccountAmount > 0
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                  }}
                >
                  {formatToINR(record?.AccountAmount, isAmountVisible)}
                </Typography>
              </Grid>

              <Grid xs={2}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    size="small"
                    color="success"
                    onClick={() => editAction(record)}
                    sx={{
                      minWidth: 'auto',
                      px: 1.5,
                      fontSize: '0.75rem',
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      sweetAlertQuestion()
                        .then((result) => {
                          if (result === 'Yes') {
                            deleteAction(record);
                          }
                        })
                        .catch((error) => {
                          console.error(error);
                        });
                    }}
                    sx={{
                      minWidth: 'auto',
                      px: 1.5,
                      fontSize: '0.75rem',
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              </Grid>
            </Grid>

            {/* Tags and Description for Desktop */}
            {(record?.TagList?.length > 0 || record?.Description) && (
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Grid container spacing={2}>
                  {record?.TagList?.length > 0 && (
                    <Grid xs={6}>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontWeight: 600, mr: 1 }}
                        >
                          Tags:
                        </Typography>
                        {record?.TagList?.map((tag, index) => (
                          <Chip
                            key={index}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: 10,
                              height: 20,
                              borderRadius: 1,
                              borderColor: 'primary.main',
                              color: 'white',
                              backgroundColor: 'primary.main',
                            }}
                            label={tag.LabelName}
                          />
                        ))}
                      </Stack>
                    </Grid>
                  )}
                  {record?.Description && (
                    <Grid xs={record?.TagList?.length > 0 ? 6 : 12}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic' }}
                      >
                        &ldquo;{record.Description}&rdquo;
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </Box>

          {/* Mobile View */}
          <Box
            sx={{
              display: { xs: 'block', lg: 'none' },
              p: 2,
              cursor: 'pointer',
            }}
            onClick={() => editAction(record)}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid xs={8}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <CustomAvatar
                    width={40}
                    height={40}
                    iconSize={14}
                    icon={iconSet(record?.Action, record?.SubCategoryDetails?.Icon)}
                    bgColor={record?.CategoryDetails?.Color}
                  />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {getSubCategoryName(record)}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      {ChipFun(record?.Action)}
                      {record?.AccountDetails?.AccountName && (
                        <Chip
                          size="small"
                          sx={{
                            fontSize: 10,
                            height: 20,
                            color: record?.AccountDetails?.Color || '#1b925e',
                            backgroundColor: getThemeColor(
                              record?.AccountDetails?.Color || '#1b925e',
                              0.92
                            ),
                          }}
                          label={record?.AccountDetails?.AccountName}
                        />
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </Grid>

              <Grid xs={4}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: (theme) =>
                        record?.AccountAmount > 0
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                      mb: 0.5,
                    }}
                  >
                    {formatToINR(record?.AccountAmount, isAmountVisible)}
                  </Typography>
                  {record?.PartyDetails?.FullName && (
                    <Typography variant="caption" color="text.secondary">
                      {fText(`${record?.PartyDetails?.FullName}`)}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>

            {(record?.TagList?.length > 0 || record?.Description) && (
              <>
                {renderDescription(record)}
                {renderTags(record)}
              </>
            )}
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default RecordList;
