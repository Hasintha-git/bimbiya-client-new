const HOST: string = 'localhost';

const PORT: string = '8080';

//production
// const HOST: string = 'bimbiya.com';


//production - true | local - false
export const SECURE = false;

export const getEndpoint = (isHttps:any) => {
  //production point
  // return `${isHttps ? 'https' : 'http'}://${HOST}/admin`;
  
  return `${isHttps ? 'https' : 'http'}://${HOST}:${PORT}/admin`;
};
