import { alpha } from '@mui/material/styles';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
// import { margin } from '@mui/system';

// ----------------------------------------------------------------------

export function overrides(theme) {
  return {
    // MuiCssBaseline: {
    //   styleOverrides: {
    //     '*': {
    //       boxSizing: 'border-box',
    //     },
    //     html: {
    //       margin: 0,
    //       padding: 0,
    //       width: '100%',
    //       height: '100%',
    //       WebkitOverflowScrolling: 'touch',
    //     },
    //     body: {
    //       margin: 0,
    //       padding: 0,
    //       width: '100%',
    //       height: '100%',
    //     },
    //     '#root': {
    //       width: '100%',
    //       height: '100%',
    //     },
    //     input: {
    //       '&[type=number]': {
    //         MozAppearance: 'textfield',
    //         '&::-webkit-outer-spin-button': {
    //           margin: 0,
    //           WebkitAppearance: 'none',
    //         },
    //         '&::-webkit-inner-spin-button': {
    //           margin: 0,
    //           WebkitAppearance: 'none',
    //         },
    //       },
    //     },
    //     img: {
    //       maxWidth: '100%',
    //       display: 'inline-block',
    //       verticalAlign: 'bottom',
    //     },
    //   },
    // },
    // MuiBackdrop: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: alpha(theme.palette.grey[900], 0.8),
    //     },
    //     invisible: {
    //       background: 'transparent',
    //     },
    //   },
    // },
    // MuiButton: {
    //   styleOverrides: {
    //     containedInherit: {
    //       color: theme.palette.common.white,
    //       backgroundColor: theme.palette.grey[800],
    //       '&:hover': {
    //         color: theme.palette.common.white,
    //         backgroundColor: theme.palette.grey[800],
    //       },
    //     },
    //     sizeLarge: {
    //       minHeight: 48,
    //     },
    //   },
    // },
    // MuiSwitch: {
    //   styleOverrides: {
    //     root: {
    //       '& .MuiSwitch-switchBase': {
    //         '&:hover': {
    //           backgroundColor: theme.palette.action.hover, // Hover background color
    //         },
    //         '&.Mui-checked': {
    //           color: theme.palette.success.main, // Checked thumb color
    //           '& + .MuiSwitch-track': {
    //             backgroundColor: theme.palette.success.main, // Checked track color
    //           },
    //         },
    //         '&.Mui-error': {
    //           color: theme.palette.error.main, // Error thumb color
    //           '& + .MuiSwitch-track': {
    //             backgroundColor: theme.palette.error.main, // Error track color
    //           },
    //         },
    //       },
    //       '& .MuiSwitch-track': {
    //         backgroundColor: theme.palette.grey[500], // Default track color
    //       },
    //     },
    //   },
    // },
    // MuiTextField: {
    //   styleOverrides: {
    //     root: {
    //       '& .MuiOutlinedInput-root': {
    //         '& fieldset': {
    //           // borderColor: theme.palette.grey[500], // Default border color
    //         },
    //         '&:hover fieldset': {
    //           borderColor: theme.palette.grey[1000], // Hover border color
    //         },
    //         '&.Mui-focused fieldset': {
    //           borderColor: theme.palette.grey[1000], // Focus border color
    //         },
    //         '&.Mui-error fieldset': {
    //           borderColor: theme.palette.error.main, // Error border color
    //         },
    //         '&.Mui-error.Mui-focused fieldset': {
    //           borderColor: theme.palette.error.main, // Error focus border color
    //         },
    //       },
    //     },
    //   },
    // },
    // MuiInputLabel: {
    //   styleOverrides: {
    //     root: {
    //       color: theme.palette.grey[600], // Default label color
    //       '&.Mui-focused': {
    //         color: theme.palette.grey[1000], // Focused label color
    //       },
    //       '&.Mui-error': {
    //         color: theme.palette.error.main, // Error label color
    //       },
    //       '&.Mui-error.Mui-focused': {
    //         color: theme.palette.error.main, // Error and focused label color
    //       },
    //     },
    //   },
    // },
    // MuiCard: {
    //   styleOverrides: {
    //     root: {
    //       boxShadow: theme.customShadows.card,
    //       borderRadius: Number(theme.shape.borderRadius) * 2,
    //       position: 'relative',
    //       zIndex: 0,
    //     },
    //   },
    // },
    // MuiCardHeader: {
    //   defaultProps: {
    //     titleTypographyProps: { variant: 'h6' },
    //     subheaderTypographyProps: { variant: 'body2' },
    //   },
    //   styleOverrides: {
    //     root: {
    //       padding: theme.spacing(3, 3, 0),
    //     },
    //   },
    // },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          [`& .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: alpha(theme.palette.grey[500], 0.24),
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: theme.palette.grey[500],
          fontSize: 13,
          fontWeight: 600,
          '&.Mui-checked': {
            // color: theme.palette.primary.main,
          },
          '&:hover': {
            // backgroundColor: theme.palette.grey[300], // hover background
          },
          '& .MuiSvgIcon-root': {
            fontSize: 18,
            borderRadius: '80%',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.background.neutral,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.grey[800],
        },
        arrow: {
          color: theme.palette.grey[800],
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        paragraph: {
          marginBottom: theme.spacing(2),
        },
        gutterBottom: {
          marginBottom: theme.spacing(1),
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          ...theme.typography.body2,
          marginBottom: theme.spacing(0),
        },
      },
    },
    // MuiAutocomplete: {
    //   styleOverrides: {
    //     root: {
    //       ...theme.typography.body1,
    //       marginBottom: theme.spacing(),
    //     },
    //   },
    // },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          borderBottom: 'none !important',
          boxShadow: 'none !important',
          position: 'relative',
          '& .MuiTabs-flexContainer': {
            borderBottom: 'none !important',
          },
          border: 'none',
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.main,
          },
        },
      },
    },
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          minWidth: 0,
          padding: '6px 12px',
          '&:hover': {
            color: theme.palette.primary.main,
            backgroundColor: 'transparent',
          },
          '&.Mui-selected': {
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            backgroundColor: 'transparent',
          },
          '&.Mui-focusVisible': {
            backgroundColor: 'transparent',
          },
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
        },
        body: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
        },
        '#root': {
          width: '100%',
          height: '100%',
        },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
          },
        },
        img: {
          maxWidth: '100%',
          display: 'inline-block',
          verticalAlign: 'bottom',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(theme.palette.grey[900], 0.8),
        },
        invisible: {
          background: 'transparent',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // fontSize: 14,
          borderRadius: '8px',
          boxShadow: 'none',
          // fontWeight: 600,
          padding: '5px 15px',
        },
        sizeLarge: {
          // minHeight: 48,
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        shrink: true,
      },
      styleOverrides: {
        root: {
          position: 'static',
          transform: 'none',
          marginBottom: 1,
          fontSize: 13,
          fontWeight: 600,
          color: theme.palette.text?.primary,
          '&.Mui-focused': {
            color: theme.palette.text?.primary,
          },
          '&.Mui-error': {
            color: theme.palette.error.main,
          },
          '&.Mui-error.Mui-focused': {
            color: theme.palette.text?.primary,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            fontSize: 14,
            borderRadius: 5,
            // backgroundColor: theme.palette.grey[200],
            backgroundColor: theme.palette.background.textbox,
            padding: '6px 8px',
            '& .MuiOutlinedInput-input': {
              padding: '6px 8px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              legend: {
                display: 'none',
              },
            },
            '& fieldset': {
              top: 0, // remove notch offset
            },
            // height: 45,
            // minHeight: 45,
            // '& .MuiOutlinedInput-notchedOutline': {
            //   border: `1px solid ${theme.palette.grey[300]}`,
            // },
            // '&:hover .MuiOutlinedInput-notchedOutline': {
            //   border: `1px solid ${theme.palette.success.main}`,
            // },
            // '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            //   legend: {
            //     display: 'none', // ⬅️ hide the legend that cuts the border
            //   },
            //   border: `1px solid ${theme.palette.success.main}`,
            // },
            // '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            //   border: `1px solid ${theme.palette.error.main}`,
            // },
            // '&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
            //   border: `1px solid ${theme.palette.error.main}`,
            // },
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            fontSize: 14,
            borderRadius: 5,
            backgroundColor: theme.palette.background.textbox,
            padding: '6px 8px',
            // padding: '4px 5px',
            // minHeight: 55,
            // margin: 0,
            // '& .MuiAutocomplete-input': {
            //   padding: '10px 12px !important',
            // },
            // '& fieldset': {
            //   borderColor: theme.palette.grey[200],
            // },
            // '&:hover fieldset': {
            //   borderColor: theme.palette.grey[200],
            // },
            // '&.Mui-focused fieldset': {
            //   borderColor: theme.palette.grey[200],
            // },
            // '&.Mui-error fieldset': {
            //   // borderColor: theme.palette.error.main,
            // },
            // '&.Mui-error.Mui-focused fieldset': {
            //   // borderColor: theme.palette.error.main,
            // },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderRadius: Number(theme.shape.borderRadius) * 1,
          border: `1px solid ${theme.palette.border?.default} `,
          position: 'relative',
          zIndex: 0,
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: 'h6' },
        subheaderTypographyProps: { variant: 'body2' },
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0),
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: 14,
          borderRadius: 5,
          backgroundColor: theme.palette.background.textbox,
        },
        select: {
          padding: '8px 10px',
        },
      },
    },
  };
}
