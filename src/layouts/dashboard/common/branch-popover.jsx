// import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// import Popover from '@mui/material/Popover';
// import MenuItem from '@mui/material/MenuItem';
// import IconButton from '@mui/material/IconButton';

import { DefaultBrachService } from 'src/Services/User.Services';

import { CustomSelect } from 'src/components/CustomComponents';

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  // const [open, setOpen] = useState(null);
  const dispatch = useDispatch();

  const { BranchesList, SelectBranch } = useSelector((state) => state?.master?.BranchesList);

  // const handleOpen = (event) => {
  //   setOpen(event.currentTarget);
  // };

  const handleClose = (BranchId) => {
    dispatch(
      DefaultBrachService(BranchId, (res) => {
        window.location.reload();
      })
    );
    // setOpen(null);
  };

  return (
    <>
      <CustomSelect
        valueKey="BranchId"
        labelKey="BranchName"
        size="small"
        sx={{ width: 200 }}
        menuList={BranchesList}
        defaultValue={SelectBranch?.BranchId}
        callBackAction={(value) => handleClose(value)}
      />
      {/* <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <img src={LANGS[0].icon} alt={LANGS[0].label} />
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
            width: 180,
          },
        }}
      >
        {BranchesList?.map((option) => (
          <MenuItem
            key={option?.BranchId}
            selected={option?.BranchId === SelectBranch?.BranchId}
            onClick={() => handleClose(option?.BranchId)}
            sx={{ typography: 'body2', py: 1 }}
          >
            {option?.BranchName}
          </MenuItem>
        ))}
      </Popover> */}
    </>
  );
}
