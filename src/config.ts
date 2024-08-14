export default () => ({
  nodeEnv: process.env.NODE_ENV || 'dev',
  port: Number(process.env.PORT) || 3333,
  mongoHost: process.env.MONGO_HOST || 'localhost',
  mongoPort: Number(process.env.MONGO_PORT) || 27017,
  mongoUser: process.env.MONGO_USER || 'root',
  mongoPass: process.env.MONGO_PASS || 'password',
  mongoName: process.env.MONGO_NAME || 'graphql',
});
