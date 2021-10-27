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

const queryClient = new QueryClient();
initFacebookSdk().then(App);
function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
