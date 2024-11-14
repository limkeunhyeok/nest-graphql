export default () => ({
  // Server
  nodeEnv: process.env.NODE_ENV || 'dev',
  port: Number(process.env.PORT) || 3333,

  // DB
  mongoUri: process.env.MONGO_URI || 'mongo1:27017,mongo2:27018,mongo3:27019',
  mongoUser: process.env.MONGO_USER || 'root',
  mongoPass: process.env.MONGO_PASS || 'password',
  mongoName: process.env.MONGO_NAME || 'graphql',
  mongoReplicaSet: process.env.MONGO_REPLICA_SET || 'myReplicaSet',

  // auth
  secretKey: process.env.SECRET_KEY || 'secretKey',
  saltRound: Number(process.env.SALT_ROUND) || 10,
});
