import { useSelector, useDispatch } from 'react-redux';

import { toggleAmountVisibility } from 'src/redux/actions/common';

export const useAmountVisibility = () => {
  const dispatch = useDispatch();
  const isAmountVisible = useSelector((state) => state.common.isAmountVisible);

  const toggleVisibility = () => {
    dispatch(toggleAmountVisibility());
  };

  return {
    isAmountVisible,
    toggleVisibility,
  };
}; 