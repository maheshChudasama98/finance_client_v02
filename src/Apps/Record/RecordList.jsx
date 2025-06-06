import React from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { fText } from 'src/utils/format-text';
import { lightenColor } from 'src/utils/utils';
import { formatToINR } from 'src/utils/format-number';
import { sweetAlertQuestion } from 'src/utils/sweet-alerts';

import { CustomAvatar, CustomTooltip } from 'src/components/CustomComponents';

const RecordList = ({ item, isHeader, deleteAction, editAction, filterHeader }) => {
  const styes = {
    fontSize: { xs: 11, md: 12 },
    borderRadius: 1,
    fontWeight: 700,
  };

  const ChipFun = (status, bg = true) => {
    switch (status) {
      case 'In':
        return (
          <Chip
            onClick={() => filterHeader('Actions', ['In'])}
            size="small"
            sx={{
              ...styes,
              // color: bg ? '#1b925e' : (theme) => `${theme?.palette?.grey?.[600]}`,
              color: '#1b925e',
              backgroundColor: bg ? '#dbf6e5' : '#FFF',
            }}
            label="Income"
          />
        );
      case 'Out':
        return (
          <Chip
            onClick={() => filterHeader('Actions', ['Out'])}
            size="small"
            sx={{
              ...styes,
              color: '#ff5630',
              backgroundColor: bg ? '#ffe4de' : '#FFF',
            }}
            label="Expense"
          />
        );

      case 'From':
        return (
          <Chip
            onClick={() => filterHeader('Actions', ['From'])}
            size="small"
            sx={{
              ...styes,
              color: '#ba7308',
              backgroundColor: bg ? '#fff1d6' : '#FFF',
            }}
            label="Transfer"
          />
        );
      case 'Investment':
        return (
          <Chip
            size="small"
            onClick={() => filterHeader('Actions', ['Investment'])}
            sx={{
              ...styes,
              color: '#1877F2',
              backgroundColor: bg ? '#D0ECFE' : '#FFF',
            }}
            label="Investment"
          />
        );
      case 'Debit':
        return (
          <Chip
            size="small"
            onClick={() => filterHeader('Actions', ['Debit'])}
            sx={{
              ...styes,
              color: '#00B8D9',
              backgroundColor: bg ? '#CAFDF5' : '#FFF',
            }}
            label="Debit"
          />
        );

      case 'Credit':
        return (
          <Chip
            size="small"
            onClick={() => filterHeader('Actions', ['Credit'])}
            sx={{
              ...styes,
              color: '#5119b7',
              backgroundColor: bg ? '#eddeff' : '#FFF',
            }}
            label="Credit"
          />
        );
      default:
        break;
    }
  };

  const iconSet = (action, icon) => {
    if (action === 'From') {
      return 'fa-solid fa-right-left';
    }
    if (action === 'Investment') {
      // return 'fa-solid fa-arrow-up-right-dots';
      // return 'fa-solid fa-ranking-star';
      return 'fa-solid fa-chart-simple';
    }
    if (action === 'Debit' || action === 'Credit') {
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
  const tooltipString = (record) => {
    const tagList = record?.TagList?.map((e) => e?.LabelName) || [];

    let formattedTags = '';
    if (tagList.length > 1) {
      formattedTags = `${tagList.slice(0, -1).join(', ')} and ${tagList.slice(-1)}`;
    } else if (tagList.length === 1) {
      formattedTags = tagList[0];
    }

    return (
      <div>
        {tagList.length > 0 && (
          <div>
            <small>
              <b>Label:</b> {formattedTags}
            </small>
          </div>
        )}
        
        {record?.Description && (
          <div>
            <small>
              <b>Desc:</b> {record.Description}
            </small>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Box
        sx={{
          py: { xs: 1.5, md: 2 },
          px: { xs: 1.5, md: 2.5 },
          backgroundColor: (theme) => `${theme?.palette?.grey?.[100]}`,
        }}
      >
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid xs={6}>
            <Typography variant="normal" color="text.secondary">
              {fDate(item?.date)}
            </Typography>
          </Grid>

          <Grid xs={6}>
            <Typography
              color="text.secondary"
              variant="normal"
              sx={{
                textAlign: 'end',
                fontWeight: 600,
                color: item?.dayTotal >= 0 ? '#00A76F' : '#FF5630',
              }}
            >
              {formatToINR(item?.dayTotal)}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      {item?.records?.map((record, key) => (
        <Box sx={{ px: { xs: 1.5, md: 2 } }} key={key}>
          <Box
            key={key}
            sx={{
              display: { xs: 'none', lg: 'block' },
              py: isHeader ? 1.5 : 0.8,
              borderBottom:
                item?.records?.length > key + 1
                  ? (theme) => `dashed 1px ${theme?.palette?.grey?.[300]}`
                  : '',
              backgroundColor: isHeader ? (theme) => `${theme?.palette?.grey?.[200]}` : '',
            }}
          >
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
              <Grid xs={2.5}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <CustomAvatar
                    width={45}
                    height={45}
                    iconSize={15}
                    icon={iconSet(record?.Action, record?.SubCategoryDetails?.Icon)}
                    bgColor={record?.CategoryDetails?.Color}
                  />
                  <Typography variant="normal">
                    {getSubCategoryName(record)}
                    {record?.CategoryDetails?.CategoryName && (
                      <Typography variant="light" color="text.secondary">
                        {fText(`${record?.CategoryDetails?.CategoryName}`)}
                      </Typography>
                    )}
                  </Typography>
                </Stack>
              </Grid>

              <Grid
                xs={1.5}
                sx={{
                  alignItems: 'center',
                  display: 'inline-flex',
                  justifyContent: 'space-between',
                }}
              >
                {ChipFun(record?.Action)}
                {(record.Description || record?.TagList) && (
                  <CustomTooltip label={tooltipString(record)} Placement="right">
                    <i className="fa-solid fa-info custom-info-icon-css" />
                  </CustomTooltip>
                )}
              </Grid>

              <Grid xs={1.5}>
                <Typography variant="light">
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Chip
                      onClick={() => filterHeader('AccountsIds', [record?.AccountId])}
                      size="small"
                      sx={{
                        ...styes,
                        color: record?.AccountDetails?.Color || '#1b925e',
                        backgroundColor: lightenColor(
                          record?.AccountDetails?.Color || '#1b925e',
                          0.92
                        ),
                      }}
                      label={record?.AccountDetails?.AccountName}
                    />
                  </Stack>
                </Typography>
              </Grid>

              <Grid xs={1.5}>
                {record?.TransferDetails?.AccountName && (
                  <Chip
                    size="small"
                    avatar="M"
                    sx={{
                      ...styes,
                      color: record?.TransferDetails?.Color || '#1b925e',
                      backgroundColor: lightenColor(
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
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <CustomAvatar
                      width={45}
                      height={45}
                      iconSize={15}
                      displayName={record?.PartyDetails?.PartyAvatar}
                    />
                    <Typography variant="light">
                      {fText(`${record?.PartyDetails?.FullName}`)}
                    </Typography>
                  </Stack>
                )}
              </Grid>

              <Grid xs={1.5}>
                <Typography
                  variant="light"
                  sx={{
                    textAlign: 'end',
                    fontWeight: 600,
                    color: record?.AccountAmount > 0 ? '#00A76F' : '#FF5630',
                  }}
                >
                  {formatToINR(record?.AccountAmount)}
                </Typography>
              </Grid>

              <Grid xs={2} sx={{ alignItems: 'end', textAlign: 'end', justifyContent: 'end' }}>
                <Stack
                  direction="row"
                  alignItems="end"
                  spacing={0.5}
                  sx={{ alignItems: 'end', textAlign: 'end', justifyContent: 'end' }}
                >
                  {/* <Button size="small" color="success" onClick={() => editAction(record)}>
                  <i className="fa-solid fa-info custom-info-icon-css" />
                  </Button> */}

                  <Button size="small" color="success" onClick={() => editAction(record)}>
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
                  >
                    Delete
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          <Box
            key={key}
            sx={{
              display: { xs: 'block', lg: 'none' },
              py: isHeader ? 1.5 : 0.8,
              borderBottom: isHeader ? '' : (theme) => `solid 1px ${theme?.palette?.grey?.[200]}`,
              backgroundColor: isHeader ? (theme) => `${theme?.palette?.grey?.[200]}` : '',
            }}
            onClick={() => editAction(record)}
          >
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
              <Grid xs={6}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CustomAvatar
                    width={45}
                    height={45}
                    iconSize={15}
                    icon={iconSet(record?.Action, record?.SubCategoryDetails?.Icon)}
                    bgColor={record?.CategoryDetails?.Color}
                  />

                  <Typography variant="normal">
                    {record?.SubCategoryDetails?.SubCategoriesName || ''}
                    <Typography variant="light" color="text.secondary">
                      {record?.AccountDetails?.AccountName}
                    </Typography>
                  </Typography>
                </Stack>
              </Grid>

              <Grid xs={6}>
                <Typography
                  variant="light"
                  sx={{
                    textAlign: 'end',
                    fontWeight: 600,
                    color: record?.AccountAmount > 0 ? '#00A76F' : '#FF5630',
                  }}
                >
                  {formatToINR(record?.AccountAmount)}

                  <Typography fontSize={5} color="text.secondary">
                    {ChipFun(record?.Action, false)}
                  </Typography>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      ))}
    </>
  );
};
export default RecordList;
