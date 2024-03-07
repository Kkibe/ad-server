// config.js
module.exports = {
    mongoURI: 'mongodb://localhost:27017/adserver',
    jwtSecret: 'your_secret_key_here',
    email: {
      service: 'your_email_service_here',
      auth: {
        user: 'your_email_here',
        pass: 'your_password_here',
      },
    },
  };
  