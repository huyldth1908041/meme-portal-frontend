/* eslint-disable no-unused-vars */
import { AppHeader } from '../containers';
import { privateRoute } from '../routes';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useAuthentication } from '../hooks';

function PrivateRoute({ component: Component, authed, requiredLogin, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => !requiredLogin || authed === true
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  );
}

const PrivateLayout = () => {
  const { isLoggedIn } = useAuthentication();
  return (
    <div>
      <AppHeader />
      {/* <button onClick={() => onLogout()}>Logout</button> */}
      <div style={{ marginTop: '50px' }}>
        <Switch>
          {Object.values(privateRoute)
            //.filter(({ requiredLogin }) => !requiredLogin || isLoggedIn)
            .map(({ path, component, requiredLogin }) => (
              // <Route exact key={path} path={path} component={component} />
              <PrivateRoute
                exact
                key={path}
                authed={isLoggedIn}
                requiredLogin={requiredLogin}
                path={path}
                component={component} />
            ))}
          <Redirect from='/' to={privateRoute.hotPost.path} />
        </Switch>
      </div>
      {/* <AppFooter /> */}
    </div>
  );
};

export default PrivateLayout;