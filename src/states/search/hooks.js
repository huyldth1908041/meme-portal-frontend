import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { clearSearch, sendSearch } from './reducer';
// tạo những hooks để làm việc với state này
// lấy state hiện tại
export const useSearchState = () => {
  return useSelector(state => state.search);
};
//sử lý các events
export const useSearchHandler = () => {
  const dispatch = useDispatch();
  const onSendSearch = useCallback((query) => {
    dispatch(sendSearch({ query }));
  }, [dispatch]);

  const onClearSearch = useCallback(() => {
    dispatch(clearSearch());
  }, [dispatch]);
  return { onClearSearch, onSendSearch };
};