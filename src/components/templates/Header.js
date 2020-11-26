import Navbar from 'react-bootstrap/Navbar';

import { ReactComponent as Logo } from 'static/taxi.svg';
import styled from 'styled-components';

const _Header = styled(Navbar)`
  height: 55px;
  border-top: solid #eba12a 5px;
  padding-left: 24px;
  padding-right: 24px;
`;

const Header = () => {
  return (
    <_Header>
      <Navbar.Brand href="/">
        <Logo height="27px" />
      </Navbar.Brand>
    </_Header>
  );
};

export default Header;
