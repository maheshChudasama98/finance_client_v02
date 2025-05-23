import { useSelector, useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { DefaultBrachService } from 'src/Services/User.Services';

import { CustomAvatar, CustomSelect } from 'src/components/CustomComponents';

// ----------------------------------------------------------------------
export default function LanguagePopover() {
  const dispatch = useDispatch();
  const { BranchesList = [], SelectBranch } = useSelector(
    (state) => state?.master?.BranchesList || {}
  );

  const handleSelectBranch = (BranchId) => {
    if (!BranchId) return;

    dispatch(
      DefaultBrachService(BranchId, () => {
        window.location.reload();
      })
    );
  };

  const BranchesListCustomList = BranchesList.map((item) => (
    <MenuItem key={item?.BranchId} value={item?.BranchId}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar
          imgDefault
          iconSize={14}
          width={{ xs: 35, md: 35, lg: 40 }}
          height={{ xs: 35, md: 35, lg: 40 }}
          icon="fa-solid fa-sitemap"
          photoURL={item?.ImgPath || ''}
        />
        <Typography variant="body2" sx={{ mx: 1 }}>
          {item?.BranchName || ''}
        </Typography>
      </Box>
    </MenuItem>
  ));

  return (
    <CustomSelect
      valueKey="BranchId"
      labelKey="BranchName"
      size="small"
      sx={{ width: { xs: 250, md: 300, lg: 300 } }}
      menuList={BranchesList}
      defaultValue={SelectBranch?.BranchId}
      callBackAction={handleSelectBranch}
      customMenuList={BranchesListCustomList}
    />
  );
}
