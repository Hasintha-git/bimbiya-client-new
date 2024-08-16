import { environment } from "src/environments/environment";

const HOST = environment.host;
const PORT = environment.port || ''; // Fallback to an empty string if port is undefined
const SECURE = environment.secure;

export const getEndpoint = () => {
  const protocol = SECURE ? 'https' : 'http';
  const portPart = PORT ? `:${PORT}` : '';
  return `${protocol}://${HOST}${portPart}/admin`;
};
