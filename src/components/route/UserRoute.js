import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import * as userAPI from 'api/user';

const UserRoute = ({ component: Component, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [data, setData] = useState(false);

  const checkUser = () => {
    userAPI
      .check()
      .then(({ data }) => {
        setAuth(true);
        setData(data);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  };

  useEffect(() => checkUser(), []);

  if (loading) return <div />;
  return (
    <Route
      {...rest}
      render={(props) =>
        !auth ? (
          <Redirect to="/register" />
        ) : (
          <Component {...props} data={data} />
        )
      }
    />
  );
};

export default UserRoute;
