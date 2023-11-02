'use strict';
const config =  {
    server: {
        listen: {
            // app listen on
            ip: '0.0.0.0',
            port: process.env.PORT || 3010,
        },
        ssl: {
            // ssl/README.md
            cert: './cert/cert.pem',
            key: './cert/key.pem',
        },
    },
};
export default config;