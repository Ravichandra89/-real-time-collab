export interface Helper {
    port: number;
    env: string;
    host?: string;
  }
  
  const serverConfig: Helper = {
    port: parseInt(process.env.PORT || "3001", 10),
    env: process.env.NODE_ENV || "sampleEnv",
    host: process.env.HOST || "localhost",
  };
  
  export default serverConfig;
  