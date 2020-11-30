import React from 'react';
import styled from 'styled-components';
import { Card, Collapse } from 'react-bootstrap';
import {
  Nav,
  Icon,
  Modal,
  Button,
  Steps,
  List,
  Loader,
  Toggle,
  ButtonGroup,
  Divider,
  Progress,
} from 'rsuite';

const { Line } = Progress;

import { Header, Footer, PageBody } from 'components/templates';

import * as userAPI from 'api/user';
import { useState, useEffect } from 'react';

const Phone = styled.div`
  padding: 8px;
`;

const IconSpan = styled.span`
  padding-right: 8px;
  font-size: 18px;
`;

const UserCard = styled(Card)`
  margin-bottom: 12px;
  transition: 0.4s;
  box-shadow: 0 4px 4px #dddddd;
`;

const DisabledUserCard = styled(UserCard)`
  background-color: #f1f1f1;
`;

const ActiveUserCard = styled(UserCard)`
  border-color: #1675e0;
  cursor: pointer;
  transition: 0.4s;
  :hover {
    box-shadow: 0 8px 12px #dddddd;
    background-color: #ddeeff;
  }
`;

const Refresh = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
  line-height: 18px;
`;

const RefreshInner = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
  font-size: 14px;
  line-height: 18px;
  cursor: pointer;
  transition: 0.4s;
  &:hover {
    opacity: 0.7;
  }
`;

const Loading = styled.div`
  margin: auto;
  width: fit-content;
  padding-top: 20vh;
`;

const JoinButton = styled(Button)`
  width: 120px;
  margin-top: 8px;
`;

const MyButton = styled(Button)`
  width: 100%;
  margin-top: 16px;
`;

const MinuteButton = styled(Button)`
  width: 65px;
`;

const timeBetween = (date, since, detailed) => {
  var seconds = Math.floor((new Date() - date) / 1000);

  if (since) seconds *= -1;

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + '년';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + '개월';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + '일';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + '시간';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return !detailed
      ? Math.floor(interval) + '분'
      : {
          parsed:
            Math.floor(interval) + `분 ${Math.floor(seconds % 60)}초`,
          seconds: Math.floor(seconds),
        };
  }
  return seconds ? Math.floor(seconds) + '초' : null;
};

const Main = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeCard, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [taxiPlatformList, setTaxiPlatformList] = useState([]);
  const [taxiPlatform, setTaxiPlatform] = useState(null);
  const [joinData, setJoinData] = useState({});
  const [joinModal, setJoinModal] = useState(false);
  const [user, setUser] = useState(data);
  const [showAll, setShowAll] = useState(false);
  const { nickname, phone, isDriver } = data;
  const formatPhone =
    !phone ||
    phone.substring(0, 3) +
      '-' +
      phone.substring(3, 7) +
      '-' +
      phone.substring(7, 11);

  const sortUsers = (a, b) => {
    if (a.validWaitingSince && !b.validWaitingSince) return -1;
    if (b.validWaitingSince && !a.validWaitingSince) return 1;
    if (a.validWaitingSince && b.validWaitingSince) {
      if (a.validWaitingSince === b.validWaitingSince)
        return a.nickname < b.nickname ? -1 : 1;
      return new Date(a.validWaitingSince) - new Date(b.validWaitingSince);
    }

    if (a.validArrivesAt && !b.validArrivesAt) return -1;
    if (b.validArrivesAt && !a.validArrivesAt) return 1;
    if (a.validArrivesAt && b.validArrivesAt) {
      if (a.validArrivesAt === b.validArrivesAt)
        return a.nickname < b.nickname ? -1 : 1;
      return new Date(a.validArrivesAt) - new Date(b.validArrivesAt);
    }

    return a.nickname < b.nickname ? -1 : 1;
  };

  const handleRefresh = () => setLoading(true);

  const handleTryJoin = (otherId) => {
    userAPI.tryJoin(otherId).then(() => {
      window.location.reload();
    });
  };

  const handleAcceptJoin = () => {
    userAPI.acceptJoin().then(() => {
      window.location.reload();
    });
  };

  const handleCancelJoin = () => {
    userAPI.cancelJoin().then(() => {
      window.location.reload();
    });
  };

  const handleSetTaxiPlatform = () => {
    setTaxiPlatform(
      <>
        {taxiPlatformList.map((info, index) => {
          if (info.validWaitingSince) {
            const waitTime = new Date(info.waitingSince);
            return (
              <ActiveUserCard
                onClick={() => {
                  setActive(activeCard === index ? -1 : index);
                }}
              >
                <Card.Body>
                  <Card.Title>{info.nickname}</Card.Title>
                  <Card.Subtitle className="text-muted">
                    {timeBetween(waitTime, false)} 째 대기 중
                  </Card.Subtitle>
                  <Collapse in={activeCard === index}>
                    <div>
                      <div className="d-flex justify-content-center">
                        <JoinButton
                          appearance="primary"
                          onClick={() => handleTryJoin(info.id)}
                        >
                          {isDriver ? '픽업하기' : '탑승하기'}
                        </JoinButton>
                      </div>
                    </div>
                  </Collapse>
                </Card.Body>
              </ActiveUserCard>
            );
          }
          if (info.validArrivesAt) {
            const arriveTime = new Date(info.arrivesAt);
            return (
              <UserCard>
                <Card.Body>
                  <Card.Title>{info.nickname}</Card.Title>
                  <Card.Subtitle className="text-muted">
                    {timeBetween(arriveTime, true)} 뒤 도착 예정
                  </Card.Subtitle>
                </Card.Body>
              </UserCard>
            );
          }
          if (showAll)
            return (
              <DisabledUserCard>
                <Card.Body>
                  <Card.Title>{info.nickname}</Card.Title>
                  <Card.Subtitle className="text-muted">
                    도착 예정 시간 없음
                  </Card.Subtitle>
                </Card.Body>
              </DisabledUserCard>
            );
        })}
      </>
    );
  };

  useEffect(() => {
    if (isDriver) {
      userAPI.passengers().then(({ data }) => {
        data.sort(sortUsers);
        setTaxiPlatformList(data);
        setLoading(false);
      });
    } else {
      userAPI.drivers().then(({ data }) => {
        data.sort(sortUsers);
        setTaxiPlatformList(data);
        setLoading(false);
      });
    }
  }, [isDriver, loading]);

  useEffect(() => {
    handleSetTaxiPlatform();
    const interval = setInterval(() => {
      handleSetTaxiPlatform();
      userAPI.check().then(({ data }) => {
        setUser(data);
        if (data.readyToJoinUser) {
          userAPI.other(data.readyToJoinUser).then(({ data }) => {
            setJoinData(data);
            setJoinModal(true);
          });
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [taxiPlatformList, activeCard, showAll]);

  const [status, setStatus] = useState(1);
  const [waitingSinceValidUntil, setWaitingSinceValidUntil] = useState();
  const [waitingSinceCooltime, setWaitingSinceCooltime] = useState();
  const [arrivesAtCooltime, setArrivesAtCooltime] = useState();
  const [arrivesAtValidUntil, setArrivesAtValidUntil] = useState();
  const [arrivesAt, setArrivesAt] = useState();
  const [minutes, setMinutes] = useState(5);

  useEffect(() => {
    const updatedAt = new Date(user.updatedAt);
    if (user.validWaitingSince) {
      setWaitingSinceCooltime(isDriver ? 30 : 5);
      setWaitingSinceValidUntil(
        new Date(updatedAt.getTime() + waitingSinceCooltime * 60000)
      );
      setStatus(2);
    } else if (user.validArrivesAt) {
      setArrivesAt(new Date(user.arrivesAt));
      setArrivesAtCooltime(isDriver ? 30 : 10);
      setArrivesAtValidUntil(
        new Date(updatedAt.getTime() + arrivesAtCooltime * 60000)
      );
      setStatus(1);
    } else setStatus(0);
  }, [user]);

  const handleExtendWaitingSince = () => {
    userAPI.update().then(() => {
      window.location.reload();
    });
  };

  const handleStartWaitingSince = () => {
    userAPI.waitingSince().then(() => {
      window.location.reload();
    });
  };

  const handleStartArrivesAt = () => {
    userAPI.arrivesAt(minutes).then(() => {
      window.location.reload();
    });
  };

  const handleExtendArrivesAt = () => {
    userAPI.updateArrivesAt().then(() => {
      window.location.reload();
    });
  };

  const handleCancelAll = () => {
    userAPI.cancel().then(() => {
      window.location.reload();
    });
  };
  const myTab = (
    <div>
      <Steps small>
        <Steps.Item
          status={status === 0 ? 'process' : 'wait'}
          title="대기 중"
          icon={<Icon icon="ellipsis-h" />}
        />
        <Steps.Item
          status={status === 1 ? 'process' : 'wait'}
          title="가는 중"
          icon={<Icon icon="road" />}
        />
        <Steps.Item
          status={status === 2 ? 'process' : 'wait'}
          title="픽업 가능"
          icon={<Icon icon="check" />}
        />
      </Steps>
      {status === 0 ? (
        <>
          <Divider>택승을 곧 갈 예정이면</Divider>
          <div className="d-flex align-items-center justify-content-between">
            <span>
              <ButtonGroup size="lg">
                <MinuteButton
                  appearance={minutes === 5 ? 'primary' : 'ghost'}
                  onClick={() => {
                    setMinutes(5);
                  }}
                >
                  5분
                </MinuteButton>
                <MinuteButton
                  appearance={minutes === 10 ? 'primary' : 'ghost'}
                  onClick={() => {
                    setMinutes(10);
                  }}
                >
                  10분
                </MinuteButton>
                <MinuteButton
                  appearance={minutes === 15 ? 'primary' : 'ghost'}
                  onClick={() => {
                    setMinutes(15);
                  }}
                >
                  15분
                </MinuteButton>
              </ButtonGroup>
              <span style={{ paddingLeft: '8px' }}>뒤 도착</span>
            </span>
            <Button
              size="lg"
              appearance="primary"
              style={{ width: '95px' }}
              onClick={handleStartArrivesAt}
            >
              등록하기
            </Button>
          </div>
          <Divider style={{ marginTop: '54px' }}>이미 도착했으면</Divider>
          <Button
            size="lg"
            color="green"
            appearance="primary"
            style={{ width: '100%' }}
            onClick={handleStartWaitingSince}
          >
            픽업 등록하기
          </Button>
        </>
      ) : status === 1 ? (
        <>
          <List size="lg">
            {(arrivesAt &&
              arrivesAtValidUntil &&
              arrivesAt.getTime() - arrivesAtValidUntil.getTime() <
                50) || (
              <List.Item style={{ textAlign: 'center' }}>
                {timeBetween(arrivesAt, true) ? (
                  <div>
                    {timeBetween(arrivesAt, true, true).parsed}
                    <span> 뒤 도착 예정</span>
                  </div>
                ) : (
                  <Loader />
                )}
              </List.Item>
            )}
            <List.Item style={{ textAlign: 'center' }}>
              {timeBetween(arrivesAtValidUntil, true) ? (
                <div>
                  <Line
                    strokeColor="#ffc107"
                    showInfo={false}
                    percent={
                      timeBetween(arrivesAtValidUntil, true, true)
                        .seconds / 6
                    }
                  />
                  <h1>
                    {timeBetween(arrivesAtValidUntil, true, true).parsed}
                  </h1>
                  <span>뒤 자동 취소</span>
                </div>
              ) : (
                <Loader />
              )}
            </List.Item>
          </List>
          <MyButton
            size="lg"
            appearance="default"
            onClick={handleExtendArrivesAt}
          >
            도착 예정 시간을 {arrivesAtCooltime}분으로 연장하기
          </MyButton>
          <MyButton
            size="lg"
            color="red"
            appearance="primary"
            onClick={handleCancelAll}
          >
            택시승강장 떠나기
          </MyButton>
          <Divider style={{ marginTop: '54px' }}>미리 도착했으면</Divider>
          <Button
            size="lg"
            color="green"
            appearance="primary"
            style={{ width: '100%' }}
            onClick={handleStartWaitingSince}
          >
            픽업 등록하기
          </Button>
        </>
      ) : (
        <>
          <List size="lg">
            <List.Item style={{ textAlign: 'center' }}>
              {timeBetween(waitingSinceValidUntil, true) ? (
                <div>
                  <Line
                    showInfo={false}
                    percent={
                      timeBetween(waitingSinceValidUntil, true, true)
                        .seconds / 3
                    }
                  />
                  <h1>
                    {
                      timeBetween(waitingSinceValidUntil, true, true)
                        .parsed
                    }
                  </h1>
                  <span>동안 픽업 상태 유지</span>
                </div>
              ) : (
                <Loader />
              )}
            </List.Item>
          </List>
          <MyButton
            size="lg"
            appearance="default"
            onClick={handleExtendWaitingSince}
          >
            픽업 가능 상태를 {waitingSinceCooltime}분으로 연장하기
          </MyButton>
          <MyButton
            size="lg"
            color="red"
            appearance="primary"
            onClick={handleCancelAll}
          >
            택시승강장 떠나기
          </MyButton>
        </>
      )}
    </div>
  );

  const handleCloseModal = () => setJoinModal(false);

  const handleMyInfo = () => {
    setActiveTab(0);
  };
  const handleTaxiPlatform = () => {
    setActiveTab(1);
  };

  return (
    <div className="page">
      <Modal size="xs" show={joinModal} onHide={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>
            {joinData.nickname}님께서 택시 매칭 요청을 하셨습니다.
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>요청을 수락하시겠습니까?</Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button style={{ width: '70px' }} onClick={handleCancelJoin}>
            아니오
          </Button>
          <Button
            style={{ width: '70px' }}
            appearance="primary"
            onClick={handleAcceptJoin}
          >
            예
          </Button>
        </Modal.Footer>
      </Modal>
      <Header />
      <PageBody>
        <div className="d-flex flex-column align-items-center">
          <h1>{nickname}</h1>
          <Phone className="d-flex align-items-center">
            <IconSpan className="material-icons">phone</IconSpan>
            <h2>{formatPhone}</h2>
          </Phone>
        </div>

        <Nav
          justified
          appearance="subtle"
          activeKey={activeTab.toString()}
        >
          <Nav.Item
            icon={<Icon icon="dashboard" />}
            eventKey="0"
            onClick={handleMyInfo}
          >
            내 정보
          </Nav.Item>
          <Nav.Item
            icon={<Icon icon="car" />}
            eventKey="1"
            onClick={handleTaxiPlatform}
          >
            택시승강장
          </Nav.Item>
        </Nav>
        <Refresh>
          {activeTab ? (
            <div>
              <Toggle size="sm" onChange={(all) => setShowAll(all)} /> 전체
              보기
            </div>
          ) : (
            <div />
          )}
          <RefreshInner onClick={handleRefresh}>
            새로고침
            <span style={{ fontSize: '18px' }} className="material-icons">
              refresh
            </span>
          </RefreshInner>
        </Refresh>
        {loading ? (
          <Loading>
            <Loader size="md" />
          </Loading>
        ) : activeTab ? (
          taxiPlatform
        ) : (
          myTab
        )}
      </PageBody>
      <Footer />
    </div>
  );
};

export default Main;
