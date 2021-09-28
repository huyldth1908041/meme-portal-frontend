import { useProfileHandler } from '../../states/profile';
import { Link } from 'react-router-dom';
import { privateRoute } from '../../routes';

const LoginPage = () => {
  //demo purpose only
  const { onLogin } = useProfileHandler();
  return (
    <>
      <button onClick={() => onLogin()}>Login</button>
      <br />
      <Link to={privateRoute.create.url(1)}>Go to create page</Link>
    </>
  );
};

export default LoginPage;
