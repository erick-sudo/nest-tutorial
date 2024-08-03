const AWS = require('aws-sdk');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

AWS.config.getCredentials((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log({
      ACCESS_KEY: AWS.config.credentials.accessKeyId,
      SECRETE_ACCESS_KEY: AWS.config.credentials.secretAccessKey,
      REGION: AWS.config.region,
    });
  }
});
