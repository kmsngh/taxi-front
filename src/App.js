import './App.scss';
import { Route, Switch, Redirect } from 'react-router-dom';

import Register from 'components/pages/Register';
import Login from 'components/pages/Login';

function App() {
  return (
    <Switch>
      <Route path="/register" component={Register} />
      <Route path="/Login" component={Login} />
      <Redirect to="/register" />
    </Switch>
  );
}

export default App;
