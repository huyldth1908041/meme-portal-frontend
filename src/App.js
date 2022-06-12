import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { PrivateLayout } from './layouts';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton';
import { initFacebookSdk } from './utils';
import updater from './updater';
import ReactGA from 'react-ga';
import { useEffect } from 'react';


const queryClient = new QueryClient();
initFacebookSdk().then(App);



const TRACKING_ID = 'UA-199508261-1'; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);


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
