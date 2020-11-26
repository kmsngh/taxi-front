import { useState } from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
  Container,
  Col,
  Row,
  Form,
  Button,
  ButtonGroup,
} from 'react-bootstrap';

import { Header, Footer } from 'components/templates';

const LoginModule = styled(Col)`
  height: 100vh;
  padding: 15px;

  @media (min-width: 768px) {
    padding: 30px 50px;
    height: 100%;
    border: 1px solid #dddddd;
    border-radius: 8px;
    margin: auto;
    box-shadow: 0 4px 4px #dddddd;
  }
`;

const FormWrapper = styled(Form)`
  width: 100%;
  padding: 16px 0;
`;

const Register = () => {
  const schema = Yup.object({
    nickname: Yup.string().required('필수'),
    password: Yup.string().required('필수'),
  });

  const handleLogin = (values) => {};
  return (
    <div className="page">
      <Header />
      <Container className="page-body justify-content-center align-items-center">
        <Row className="justify-content-center">
          <LoginModule lg={6} xl={5}>
            <Formik
              validationSchema={schema}
              onSubmit={handleLogin}
              initialValues={{ nickname: '', phone: '', password: '' }}
            >
              {({ handleSubmit, handleChange, values, errors }) => (
                <FormWrapper noValidate onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>닉네임</Form.Label>
                    <Form.Control
                      type="text"
                      name="nickname"
                      value={values.nickname}
                      onChange={handleChange}
                      isInvalid={!!errors.nickname}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nickname}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    로그인
                  </Button>
                </FormWrapper>
              )}
            </Formik>
          </LoginModule>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Register;
