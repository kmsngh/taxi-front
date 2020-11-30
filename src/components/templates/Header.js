import { useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { withRouter, useLocation } from 'react-router-dom';

import Logo from 'static/taxi.png';
import styled from 'styled-components';

import { check, logout } from 'api/user';
import { useEffect } from 'react';

const _Header = styled(Navbar)`
  height: 55px;
  border-top: solid #1675e0 5px;
  padding: 11px 24px;
  justify-content: space-between;

  @media (max-width: 767px) {
    padding: 11px 16px;
  }
`;

const NavItem = styled(Nav.Item)`
  line-height: 16px;
  color: #666666;
`;

const Login = styled(NavItem)`
  line-height: 16px;
  padding-left: 6px;
  font-family: Helvetica Neue;
  color: #333333;
  font-size: 14px;
`;

const NavName = styled(Nav)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ActiveNavName = styled(NavName)`
  cursor: pointer;
  &:hover {
    opacity: 0.7;
    text-decoration: none;
  }
`;

const Person = styled(NavItem)`
  font-size: 16px;
`;

const Header = ({ history }) => {
  const [name, setName] = useState(false);

  const handleLogout = () => {
    logout().then(() => history.push('/register'));
  };

  useEffect(() => {
    check()
      .then(({ data }) => setName(data.nickname))
      .catch(() => {
        setName(false);
      });
  }, []);

  return (
    <_Header collapseOnSelect expand="md">
      <a href="/">
        <img src={Logo} height="27px" />
      </a>
      {name ? (
        <ActiveNavName onClick={handleLogout}>
          <Person className="material-icons">person</Person>
          <Login>로그아웃</Login>
        </ActiveNavName>
      ) : (
        <ActiveNavName as="a" href={'/login'}>
          <Person className="material-icons">person</Person>
          <Login>로그인</Login>
        </ActiveNavName>
      )}
    </_Header>
  );
};

export default withRouter(Header);
