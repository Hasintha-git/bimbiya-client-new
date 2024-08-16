export interface EnvironmentField {
    production: boolean;
    host: string;
    port?: string; // Mark 'port' as optional
    secure: boolean;
    envName: string;
  }
  