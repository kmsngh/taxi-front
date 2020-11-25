import { useState } from 'react';
import styled from 'styled-components';

import { Container, Col, Row, Form, Button, Nav } from 'react-bootstrap';

import Header from 'components/templates/Header';
import { ReactComponent as Driver } from 'static/driver.svg';
import { ReactComponent as Passenger } from 'static/passenger.svg';

const RegisterModule = styled(Col)`
  display: flex;
  flex-direction: column;
  border: 1px solid #dddddd;
  border-radius: 8px;
  height: 300px;
  padding: 16px;
  transition: 0.4s;
  margin: 16px 8px;
  box-shadow: 0 4px 4px #dddddd;
  margin-top: 16px;

  @media (min-width: 992px) {
    margin-top: 25vh;
  }
`;

const ChooseModule = styled(RegisterModule)`
  align-items: center;
  justify-content: center;
  cursor: pointer;
  :hover {
    box-shadow: 0 8px 16px #dddddd;
  }
`;

const FormWrapper = styled(Form)`
  width: 100%;
  padding: 16px 0;
`;

const Register = () => {
  const [userType, setUserType] = useState(0);

  const RegisterForm = () => {
    return (
      <FormWrapper style={{ width: '100%' }}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Phone number</Form.Label>
          <Form.Control type="tel" placeholder="Enter phone number" />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </FormWrapper>
    );
  };

  const Module = (props) => {
    const type = props.type;
    if (userType !== 0) {
      if (userType === type) {
        return (
          <RegisterModule lg={5} xl={4}>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ position: 'relative' }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: '0px',
                  cursor: 'pointer',
                }}
                class="material-icons"
                onClick={() => setUserType(0)}
              >
                keyboard_arrow_left
              </span>
              <h1>{props.role}</h1>
            </div>
            <RegisterForm />
          </RegisterModule>
        );
      }
      return null;
    }
    return (
      <ChooseModule lg={5} xl={4} onClick={() => setUserType(type)}>
        <props.src style={{ padding: '16px' }} />
        <h1>{props.role}</h1>
        <p style={{ textAlign: 'center' }}>{props.description}</p>
      </ChooseModule>
    );
  };

  return (
    <>
      <Header />
      <Container>
        <Row className="justify-content-center">
          <Module
            src={Passenger}
            role="Passenger"
            description="Check whether a taxi has arrived."
            type={1}
          />
          <Module
            src={Driver}
            role="Driver"
            description="Let passengers know when you arrive."
            type={2}
          />
        </Row>
      </Container>
    </>
  );
};

export default Register;
