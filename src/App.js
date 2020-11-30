import './App.scss';
import { Route, Switch, Redirect } from 'react-router-dom';
import UserRoute from 'components/route/UserRoute';

import Register from 'components/pages/Register';
import Login from 'components/pages/Login';
import Main from 'components/pages/Main';

function App() {
  return (
    <Switch>
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />

      <UserRoute path="/" component={Main} />
      <Redirect to="/register" />
    </Switch>
  );
}

export default App;
