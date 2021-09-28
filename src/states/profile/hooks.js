import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import { login, logout } from './reducer';
// tạo những hooks để làm việc với state này
// lấy state hiện tại
export const useProfileState = () => {
  return useSelector(state => state.profile)
}
//sử lý các events
export const useProfileHandler = () => {
  const dispatch = useDispatch()
  const onLogout = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  const onLogin = useCallback(() => {
    dispatch(login())
  }, [dispatch])
  return {onLogout, onLogin}
}