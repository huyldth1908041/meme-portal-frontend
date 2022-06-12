import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { clearUser, setUser } from './reducer';
// tạo những hooks để làm việc với state này
// lấy state hiện tại
export const useUser = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const onSetUser = useCallback((user) => {
    dispatch(setUser(user));
  }, [dispatch]);

  const onClearUser = useCallback(() => {
    dispatch(clearUser());
  }, [dispatch]);
  return { onSetUser, onClearUser, user };
};
