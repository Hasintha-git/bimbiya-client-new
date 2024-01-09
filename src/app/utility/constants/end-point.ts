const HOST: string = 'localhost';
// const HOST: string = '104.152.222.98';
const PORT: string = '8080';

export const SECURE = false;

export const getEndpoint = (isHttps:any) => {
  return `${isHttps ? 'https' : 'http'}://${HOST}:${PORT}/admin`;
};
