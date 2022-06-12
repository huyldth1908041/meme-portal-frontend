import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { PrivateLayout } from './layouts';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Provider } from 'react-redux';
import store from './states';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton';
import { initFacebookSdk } from './utils';
<<<<<<< HEAD
import updater from './updater';
=======
import ReactGA from 'react-ga';
import { useEffect } from 'react';
>>>>>>> 8d5c9a9a040d4f6d4d86d7005320ec4559e9e08e

const queryClient = new QueryClient();
initFacebookSdk().then(App);

<<<<<<< HEAD
=======

const TRACKING_ID = 'UA-199508261-1'; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

>>>>>>> 8d5c9a9a040d4f6d4d86d7005320ec4559e9e08e
function App() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route exact path='/login' component={LoginPage} />
          <Route exact path='/register' component={RegisterPage} />
          <PrivateLayout />
        </Switch>
      </Router>
      <Toaster />
      <ScrollToTopButton />
    </QueryClientProvider>
  );
}

export default updater(App);
