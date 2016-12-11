export default {
  env: process.env.NODE_ENV,
  jwtSecret: process.env.jwtSecret,
  db: process.env.mongodb,
  port: process.env.LEANCLOUD_APP_PORT || 3000
};
