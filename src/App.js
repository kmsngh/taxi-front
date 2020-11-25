import logo from './logo.svg';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';

import Register from 'components/pages/Register';

function App() {
  return (
    <Switch>
      <Route path="/register" component={Register} />
      <Redirect to="/register" />
    </Switch>
  );
}

export default App;
