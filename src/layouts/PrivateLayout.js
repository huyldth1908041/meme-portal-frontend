import { AppFooter, AppHeader } from '../containers';
import { privateRoute } from '../routes';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useProfileHandler, useProfileState } from '../states/profile';
import { logout } from '../states/profile/reducer';

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
  const {isLoggedIn}  = useProfileState();
  console.log(isLoggedIn);
  //logout functions for demo purpose only
  const {onLogout} = useProfileHandler();
  return (
    <div className='App Private-Layout'>
      <AppHeader />
      <button onClick={() => onLogout()}>Logout</button>
      <div className='App-Body'>
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
          <Redirect from='/' to={privateRoute.explore.path} />
        </Switch>
      </div>
      <AppFooter />
    </div>
  );
};

export default PrivateLayout;