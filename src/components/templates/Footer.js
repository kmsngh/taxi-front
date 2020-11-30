import styled from 'styled-components';
import Navbar from 'react-bootstrap/Navbar';

import { ReactComponent as Logo } from 'static/snow.svg';

const _Footer = styled(Navbar)`
  height: 50px;
  padding-left: 24px;
  padding-right: 24px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  background-color: #f8f8f8;

  @media (max-width: 767px) {
    padding: 11px 16px;
  }
`;

const Footer = () => {
  return (
    <_Footer>
      <Navbar.Brand>
        <Logo height="27px" />
      </Navbar.Brand>
      <span>Contact: snow@sparcs.org</span>
    </_Footer>
  );
};

export default Footer;
