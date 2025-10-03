import { useSelector, useDispatch } from 'react-redux';

import { toggleAmountVisibility } from 'src/redux/actions/common';
import { AmountVisibilityModifyService } from 'src/Services/User.Services';

export const useAmountVisibility = () => {
  const dispatch = useDispatch();
  const isAmountVisible = useSelector((state) => state.common.isAmountVisible);
  const token = localStorage.getItem('token');

  const toggleVisibility = () => {
    const newVisibility = !isAmountVisible;
    
    // Update Redux state immediately for UI responsiveness
    dispatch(toggleAmountVisibility());
    
    // Update localStorage
    localStorage.setItem('AmountHide', !newVisibility);
    
    // Save to database
    if (token) {
      dispatch(AmountVisibilityModifyService(newVisibility, (res) => {
        // Silent save - no error handling needed
      }));
    }
  };

  return {
    isAmountVisible,
    toggleVisibility,
  };
}; 