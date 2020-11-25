import { _Header } from './Header.styled';
import Navbar from 'react-bootstrap/Navbar';

import logo from 'static/taxi.svg';

const Header = () => {
  return (
    <_Header>
      <Navbar.Brand href="/">
        <img src={logo} alt="Taxi" height="27px" />
      </Navbar.Brand>
    </_Header>
  );
};

export default Header;
