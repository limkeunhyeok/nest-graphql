export default () => ({
  // Server
  nodeEnv: process.env.NODE_ENV || 'dev',
  port: Number(process.env.PORT) || 3333,

  // DB
  mongoUri: process.env.MONGO_URI || 'localhost',
  mongoUser: process.env.MONGO_USER || 'root',
  mongoPass: process.env.MONGO_PASS || 'password',
  mongoName: process.env.MONGO_NAME || 'graphql',

  // auth
  secretKey: process.env.SECRET_KEY || 'secretKey',
  saltRound: Number(process.env.SALT_ROUND) || 10,
});
