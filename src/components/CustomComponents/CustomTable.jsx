import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { keyframes } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Unstable_Grid2';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import RemoveIcon from '@mui/icons-material/Remove';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

const rotate = keyframes` from { transform: rotate(0deg);}  to { transform: rotate(180deg);} `;

export const CustomTable = ({ columns, data, expanded, allOpen }) => {
  const [expandedState, setExpandedState] = useState(Array(data.length).fill(false));

  const handleAccordionToggle = (rowIndex) => {
    setExpandedState((prevState) =>
      prevState.map((pre, index) => (index === rowIndex ? !pre : pre))
    );
  };
  useEffect(() => {
    // Initialize expandedState based on `allOpen` prop
    setExpandedState(Array(data.length).fill(allOpen));
  }, [allOpen, data.length]);

  const getBorderStyle = (rowIndex, values, State, theme) => {
    if (values.length - 1 > rowIndex) return `dashed 1px ${theme.palette.grey[400]}`;
    return 0;
  };
  return (
    <>
      {expanded ? (
        <>
          <Box
            sx={{
              py: 1.5,
              pl: 4,
              backgroundColor: (theme) => `${theme?.palette?.grey?.[200]}`,
            }}
          >
            <Grid
              container
              spacing={2}
              sx={{
                alignItems: 'center',
                mx: 1.5,
              }}
            >
              {columns.map((item, key) => (
                <Grid xs={item?.xs} key={key}>
                  <Typography
                    variant="tableHead"
                    color="text.secondary"
                    className={item?.className}
                    sx={item?.sx}
                  >
                    {item?.Header}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>

          {data.length > 0 &&
            data.map((row, rowIndex) => (
              <Box
                key={rowIndex}
                sx={{
                  py: expandedState[rowIndex] ? 1.5 : 0.5,
                  borderBottom: (theme) => getBorderStyle(rowIndex, data, expandedState, theme),
                  borderColor: (theme) => theme.palette.grey[400],
                }}
              >
                <Box
                  sx={{
                    borderTop: expandedState[rowIndex] ? 1 : 0,
                    borderLeft: expandedState[rowIndex] ? 1 : 0,
                    borderRight: expandedState[rowIndex] ? 1 : 0,
                    borderBottom: expandedState[rowIndex] ? 1 : 0,
                    borderColor: (theme) => theme.palette.grey[400],
                    borderRadius: expandedState[rowIndex] ? 1 : 0,
                  }}
                >
                  <Accordion
                    expanded={expandedState[rowIndex]}
                    sx={{
                      m: 0,
                      p: 0,

                      borderColor: (theme) => `${theme.palette.grey[400]}`,
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        expandedState[rowIndex] ? (
                          <RemoveIcon
                            sx={{
                              pointerEvents: 'auto',
                              animation: `${rotate} 0.3s ease`,
                            }}
                            fontSize="2px"
                            onClick={() => handleAccordionToggle(rowIndex)}
                          />
                        ) : (
                          <AddIcon
                            sx={{
                              pointerEvents: 'auto',
                              animation: `${rotate} 0.3s ease`,
                            }}
                            fontSize="2px"
                            onClick={() => handleAccordionToggle(rowIndex)}
                          />
                        )
                      }
                      sx={{
                        m: 0,
                        p: 0,
                        pl: 1,
                        flexDirection: 'row-reverse',
                        pointerEvents: 'none',
                        border: 'none !important',
                        '&.MuiAccordionSummary-content': {
                          alignItems: 'center',
                          '&.Mui-expanded': {
                            margin: '12px 0',
                          },
                        },
                        '.MuiAccordionSummary-expandIconWrapper': {
                          border: 0.1,
                          borderRadius: 0.8,
                          borderColor: (theme) => `${theme.palette.grey[300]}`,
                          transform: 'none',
                          height: 18,
                          width: 18,
                          alignItems: 'center',
                          justifyContent: 'center',
                          '&.Mui-expanded': {
                            transform: 'none',
                            color: 'primary.main',
                            borderColor: 'primary.main',
                          },
                          '& svg': {
                            fontSize: '1rem',
                          },
                        },
                      }}
                    >
                      <Box
                        sx={{
                          mx: 1,
                          pl: 3,
                          width: '100%',
                          alignItems: 'center',
                          alignContent: 'center',
                          border: 'none !important',
                        }}
                      >
                        <Grid container spacing={2} sx={{ border: 'none', alignItems: 'center' }}>
                          {columns.map((col, colIndex) => (
                            <Grid key={colIndex} xs={col?.xs} sx={{ p: 0, m: 0 }}>
                              {row[col.keyLabel]}
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </AccordionSummary>

                    {row?.child && (
                      <AccordionDetails
                        sx={{
                          py: 1,
                          borderTop: expandedState[rowIndex] ? 1 : 0,
                          borderColor: (theme) => theme.palette.grey[300],
                        }}
                      >
                        {row?.child}
                      </AccordionDetails>
                    )}
                  </Accordion>
                </Box>
              </Box>
            ))}
        </>
      ) : (
        <>
          <Box
            sx={{
              py: 1.5,
              backgroundColor: (theme) => `${theme?.palette?.grey?.[200]}`,
            }}
          >
            <Grid container spacing={2} sx={{ alignItems: 'center', mx: 1.5 }}>
              {columns.map((item, key) => (
                <Grid xs={item?.xs} key={key}>
                  <Typography
                    variant="tableHead"
                    color="text.secondary"
                    className={item?.className}
                    sx={item?.sx}
                  >
                    {item?.Header}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box>
            {data.length > 0 &&
              data.map((row, rowIndex) => (
                <Box
                  sx={{
                    pt: 2,
                    pb: 2,
                    borderBottom:
                      (data?.length || 0) - 1 > rowIndex
                        ? (theme) => `dashed 1px ${theme?.palette?.grey?.[400]}`
                        : '',
                  }}
                >
                  <Grid
                    key={rowIndex}
                    container
                    spacing={2}
                    sx={{
                      mx: 1.5,
                      pl: 1,
                      alignItems: 'center',
                    }}
                  >
                    {columns.map((col, colIndex) => (
                      <Grid key={colIndex} xs={col?.xs} sx={{ p: 0, m: 0 }}>
                        {row[col.keyLabel]}
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
          </Box>
        </>
      )}
    </>
  );
};

CustomTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  expanded: PropTypes.bool,
};
