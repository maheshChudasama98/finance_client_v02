import { alpha } from '@mui/material/styles';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';

// ----------------------------------------------------------------------

export function overrides(theme) {
  return {
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          [`& .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: alpha(theme.palette.grey[500], 0.24),
          },
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
    MuiDialog: {
      styleOverrides: {
        root: {
          borderRadius: Number(12) * 1,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: 12,
          fontWeight: 600,
          padding: '6px 15px',
          borderRadius: Number(theme.shape.borderRadius) * 1.3,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: 10,
          fontWeight: 700,
          borderRadius: Number(theme.shape.borderRadius) * 1,
          height: 'auto',
        },
        label: {
          padding: '3px 6px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          // boxShadow: shadows()[3],
          boxShadow: theme.customShadows.card,
          borderRadius: Number(theme.shape.borderRadius) * 1.8,
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
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          overflow: 'visible',
          '& .MuiTabs-indicator': {
            display: 'none', // ✅ hide underline
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
          position: 'relative',
          // border: `1px solid ${theme.palette.primary.lighter}`,
          borderRadius: Number(theme.shape.borderRadius) * 1,
          minWidth: 0,
          marginRight: 6,
          padding: '1px 10px',
          fontWeight: 100,
          fontSize: 12,
          minHeight: 30,
          overflow: 'visible',
          color: theme.palette.text.dark,
          '&:hover': {
            color: theme.palette.primary.main,
            backgroundColor: 'transparent',
          },
          '&.Mui-selected': {
            color: theme.palette.primary.contrastText,
            fontWeight: 700,
            backgroundColor: theme.palette.primary.main,
            border: 'none',
            fontSize: 11,
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -5,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: `6px solid ${theme.palette.primary.main}`,
            },
          },

          '&.Mui-focusVisible': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiPopper: {
      styleOverrides: {
        root: {
          '& .MuiAutocomplete-paper': {
            background: `linear-gradient(225deg, ${alpha(theme.palette.info.main, 0.1)}, ${
              theme.palette.background.default
            }, ${theme.palette.background.default},${alpha(theme.palette.error.main, 0.1)})`,
            backdropFilter: 'blur(30px)',
            padding: '5px 5px 0px 5px',
            margin: 0,
            borderRadius: Number(theme.shape.borderRadius) * 1.3,
          },
          '& .MuiAutocomplete-listbox': {
            padding: 0,
          },
          '& .MuiAutocomplete-option': {
            borderRadius: Number(theme.shape.borderRadius) * 1.3,
            fontSize: 14,
            fontWeight: 600,
            transition: 'all 0.2s ease',
            padding: '8px 12px',
            marginBottom: 5,
            '&:hover': {
              backgroundColor: alpha(theme.palette.darker.main, 0.1), // light blue
            },
            '&.Mui-focused': {
              backgroundColor: alpha(theme.palette.darker.main, 0.1), // light blue
            },
            '&[aria-selected="true"]': {
              backgroundColor: alpha(theme.palette.darker.main, 0.2), // light blue
            },
            '&[aria-selected="true"]:hover': {
              backgroundColor: alpha(theme.palette.darker.main, 0.1), // light blue
            },
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: `linear-gradient(225deg, ${alpha(theme.palette.info.main, 0.1)}, ${
            theme.palette.background.default
          }, ${theme.palette.background.default},${alpha(theme.palette.error.main, 0.1)})`,
          backdropFilter: 'blur(30px)',
          padding: '5px 5px 0px 5px',
          borderRadius: 10,
          '& .MuiList-root.MuiMenu-list': {
            padding: '5px 5px 0px 5px',
            // margin: 0,
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 7,
          fontSize: 12,
          fontWeight: 500,
          transition: 'all 0.2s ease',
          padding: '5px 8px',
          // margin: '0px 5px',
          marginBottom: 4,
          '&:hover': {
            backgroundColor: alpha(theme.palette.darker.main, 0.1),
          },
          '&.Mui-focusVisible': {
            backgroundColor: alpha(theme.palette.darker.main, 0.1),
          },
          '&.Mui-selected': {
            backgroundColor: alpha(theme.palette.darker.main, 0.2),
          },
          '&.Mui-selected:hover': {
            backgroundColor: alpha(theme.palette.darker.main, 0.1),
          },
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
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase': {
            '&:hover': {
              backgroundColor: theme.palette.action.hover, // Hover background color
            },
            '&.Mui-checked': {
              color: theme.palette.primary.main, // Checked thumb color
              '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.primary.main, // Checked track color
              },
            },
            '&.Mui-error': {
              color: theme.palette.error.main, // Error thumb color
              '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.error.main, // Error track color
              },
            },
          },
          '& .MuiSwitch-track': {
            backgroundColor: theme.palette.grey[500], // Default track color
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '& .MuiSvgIcon-root': {
            fontSize: 18,
            borderRadius: '50%',
          },
          '&.Mui-checked .MuiSvgIcon-root': {
            color: theme.palette.primary.main,
            borderRadius: '50%',
          },
          '&:hover .MuiSvgIcon-root': {
            borderRadius: '50%',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          position: 'static',
          transform: 'none',
          marginBottom: 1.5,
          marginLeft: 3,
          fontSize: 12,
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
    MuiFormLabel: {
      styleOverrides: {
        root: {
          marginLeft: 3,
          fontSize: 12,
          fontWeight: 600,
          '&.MuiFormLabel-root': {
            position: 'static',
            transform: 'none',
            marginBottom: 1.5,
            fontSize: 12,
            fontWeight: 600,
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
            borderRadius: Number(theme.shape.borderRadius) * 1.3,
            backgroundColor: theme.palette.background.textbox,
            minHeight: 36,
            border: 'none',
            padding: '6px 8px',
            '& .MuiOutlinedInput-input': {
              padding: '6px 8px',
              height: 'auto',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              legend: {
                display: 'none',
              },
            },
            '& .MuiInputLabel-asterisk': {
              color: 'red',
              fontSize: 14,
            },
            '& fieldset': {
              top: 0, // remove notch offset
            },
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            fontSize: 14,
            borderRadius: Number(theme.shape.borderRadius) * 1.3,
            backgroundColor: theme.palette.background.textbox,
            padding: '6px 8px',
            minHeight: 36,
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
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: 12,
          borderRadius: Number(theme.shape.borderRadius) * 1.3,
          backgroundColor: theme.palette.background.textbox,
        },
        select: {
          padding: '8px 10px',
        },
      },
    },
  };
}
