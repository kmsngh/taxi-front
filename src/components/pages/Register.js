import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { withRouter } from 'react-router-dom';

import {
  Container,
  Col,
  Row,
  Form,
  Button,
  Collapse,
} from 'react-bootstrap';
import { ReactComponent as Driver } from 'static/driver3.svg';
import { ReactComponent as Passenger } from 'static/passenger2.svg';
import { Header, Footer } from 'components/templates';

import * as userAPI from 'api/user';

const RegisterModule = styled(Col)`
  display: flex;
  flex-direction: column;

  padding-top: 16px;

  @media (min-width: 768px) {
    padding: 30px 50px;
    border: 1px solid #dddddd;
    border-radius: 8px;
    margin: 8px 16px;
    box-shadow: 0 4px 4px #dddddd;
  }
`;

const ChooseModule = styled(RegisterModule)`
  border: 1px solid #dddddd;
  border-radius: 8px;
  margin: 8px 16px;
  padding: 16px;
  height: 250px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.4s;
  box-shadow: 0 4px 4px #dddddd;
  :hover {
    box-shadow: 0 8px 12px #dddddd;
  }
  @media (min-width: 992px) {
    height: 300px;
  }
`;

const FormWrapper = styled(Form)`
  width: 100%;
  padding: 16px 0;
`;

const RegisterHeading = styled.h1`
  text-align: center;
  font-family: NanumSquare Extrabold;
`;

const Register = ({ history }) => {
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(0);

  useEffect(() => {
    userAPI
      .check()
      .then(() => history.push('/'))
      .catch(() => {
        setLoading(false);
      });
  });

  if (loading) return null;

  const RegisterForm = () => {
    const handleRegistration = (values) => {
      values.isDriver = userType === 2;
      userAPI
        .register(values)
        .then(() => {
          history.push('/login');
        })
        .catch((err) => {
          alert(err.response.data);
        });
    };

    const schema = Yup.object({
      nickname: Yup.string()
        .min(4, '4글자 이상이여야 합니다')
        .max(16, '16글자 이하여야 합니다')
        .required('필수'),
      phone: Yup.string()
        .min(11, '11자리 숫자여야 합니다')
        .max(11, '11자리 숫자여야 합니다')
        .required('필수'),
      password: Yup.string()
        .min(6, '6자 이상이여야 합니다')
        .matches(
          '^[a-zA-Z0-9!@#$%^*]*$',
          '영문 및 !, @, #, $, %, ^, *만 입력이 가능합니다.'
        )
        .required('필수'),
    });

    return (
      <Formik
        validationSchema={schema}
        onSubmit={handleRegistration}
        initialValues={{ nickname: '', phone: '', password: '' }}
      >
        {({ handleSubmit, handleChange, values, errors }) => (
          <FormWrapper noValidate onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>닉네임</Form.Label>
              <Form.Control
                type="text"
                name="nickname"
                placeholder="닉네임은 다른 사용자들에게 공개됩니다."
                onChange={handleChange}
                value={values.nickname}
                isInvalid={!!errors.nickname}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nickname}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>전화번호</Form.Label>
              <Form.Control
                name="phone"
                type="text"
                onChange={(e) => {
                  if (e.target.value.match('^[0-9]*$') != null) {
                    handleChange(e);
                  }
                }}
                value={values.phone}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
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
              회원가입
            </Button>
          </FormWrapper>
        )}
      </Formik>
    );
  };

  const Module = (props) => {
    const type = props.type;
    if (userType !== 0) {
      if (userType === type) {
        return (
          <RegisterModule lg={6} xl={5}>
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
                className="material-icons"
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
        <p style={{ textAlign: 'center', paddingTop: '8px' }}>
          {props.description}
        </p>
      </ChooseModule>
    );
  };

  return (
    <div className="page">
      <Header />
      <Container className="page-body justify-content-center align-items-center">
        <Collapse in={userType === 0}>
          <RegisterHeading
            style={userType !== 0 ? { color: 'white' } : {}}
          >
            회원가입
          </RegisterHeading>
        </Collapse>
        <Row className="justify-content-center">
          <Module
            src={Passenger}
            role="승객"
            description="택시승강장에 택시가 도착했는지 확인하세요."
            type={1}
          />
          <Module
            src={Driver}
            role="운전기사"
            description="택시승강장 도착 전 미리 승객들에게 알리세요."
            type={2}
          />
        </Row>
        <div className="muted">
          이미 회원이신가요? <a href="/login">로그인</a>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default withRouter(Register);
