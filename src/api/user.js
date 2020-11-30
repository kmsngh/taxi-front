import axios from 'axios';

const user = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/user`,
  withCredentials: true,
});

export const register = (body) => user.post('/register', body);
export const login = (body) => user.post('/login', body);
export const check = () => user.get(`/check`);
export const logout = () => user.get(`/logout`);

export const other = (userId) => user.get(`/other/${userId}`);

export const passengers = () => user.get(`/passengers`);
export const drivers = () => user.get(`/drivers`);

export const arrivesAt = (minutes) => user.post(`/arrivesAt`, { minutes });
export const waitingSince = () => user.post(`/waitingSince`);

export const update = () => user.patch(`/update`);
export const cancel = () => user.patch(`/`);

export const updateArrivesAt = () => user.patch(`/arrivesAt`);
export const updateWaitingSince = () => user.patch(`/waitingSince`);

export const tryJoin = (userId) => user.patch(`/try/${userId}`);
export const acceptJoin = () => user.patch(`/accept`);
export const cancelJoin = () => user.patch(`/cancel`);
