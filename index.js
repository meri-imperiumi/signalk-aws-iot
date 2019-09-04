const awsIot = require('aws-iot-device-sdk');

module.exports = (app) => {
  const plugin = {};
  let device;
  let unsubscribes = [];

  plugin.id = 'signalk-aws-iot';
  plugin.name = 'SignalK AWS IoT';
  plugin.description = 'Plugin that sends data to AWS IoT Core';

  plugin.start = (options) => {
    // Here we put our plugin logic
    app.debug('Plugin started');

    device = awsIot.device({
      host: options.aws_host,
      clientId: options.aws_client_id,
      privateKey: Buffer.from(options.aws_key, 'utf8'),
      clientCert: Buffer.from(options.aws_cert, 'utf8'),
      caCert: Buffer.from(options.aws_ca, 'utf8'),
    });

    const localSubscription = {
      context: '*', // Get data for all contexts
      subscribe: [{
        path: '*', // Get all paths
        period: 5000, // Every 5000ms
      }],
    };

    app.subscriptionmanager.subscribe(
      localSubscription,
      unsubscribes,
      (subscriptionError) => {
        app.error(subscriptionError);
      },
      (delta) => {
        delta.updates.forEach((u) => {
          u.values.forEach((v) => {
            app.debug(`PUB ${v.path.replace(/\./g, '/')} ${JSON.stringify(v.value)}`);
            device.publish(v.path.replace(/\./g, '/'), JSON.stringify(v.value));
          });
        });
      },
    );

    device
      .on('connect', () => {
        app.debug('Connected to AWS IoT Core');
      });
    device
      .on('offline', () => {
        app.debug('Offline');
      });
    device
      .on('error', (error) => {
        app.error(error);
      });
  };

  plugin.stop = () => {
    unsubscribes.forEach((f) => f());
    unsubscribes = [];
    if (device) {
      device.end(true);
    }
    app.debug('Plugin stopped');
  };

  plugin.schema = {
    type: 'object',
    required: [
      'aws_host',
    ],
    properties: {
      aws_host: {
        type: 'string',
        format: 'hostname',
        title: 'AWS IoT endpoint hostname',
      },
      aws_client_id: {
        type: 'string',
        title: 'AWS IoT client ID',
      },
      aws_key: {
        type: 'string',
        title: 'AWS IoT device private key',
      },
      aws_cert: {
        type: 'string',
        title: 'AWS IoT device certificate',
      },
      aws_ca: {
        type: 'string',
        title: 'AWS IoT certificate authority',
        default: `-----BEGIN CERTIFICATE-----
MIIDQTCCAimgAwIBAgITBmyfz5m/jAo54vB4ikPmljZbyjANBgkqhkiG9w0BAQsF
ADA5MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRkwFwYDVQQDExBBbWF6
b24gUm9vdCBDQSAxMB4XDTE1MDUyNjAwMDAwMFoXDTM4MDExNzAwMDAwMFowOTEL
MAkGA1UEBhMCVVMxDzANBgNVBAoTBkFtYXpvbjEZMBcGA1UEAxMQQW1hem9uIFJv
b3QgQ0EgMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALJ4gHHKeNXj
ca9HgFB0fW7Y14h29Jlo91ghYPl0hAEvrAIthtOgQ3pOsqTQNroBvo3bSMgHFzZM
9O6II8c+6zf1tRn4SWiw3te5djgdYZ6k/oI2peVKVuRF4fn9tBb6dNqcmzU5L/qw
IFAGbHrQgLKm+a/sRxmPUDgH3KKHOVj4utWp+UhnMJbulHheb4mjUcAwhmahRWa6
VOujw5H5SNz/0egwLX0tdHA114gk957EWW67c4cX8jJGKLhD+rcdqsq08p8kDi1L
93FcXmn/6pUCyziKrlA4b9v7LWIbxcceVOF34GfID5yHI9Y/QCB/IIDEgEw+OyQm
jgSubJrIqg0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMC
AYYwHQYDVR0OBBYEFIQYzIU07LwMlJQuCFmcx7IQTgoIMA0GCSqGSIb3DQEBCwUA
A4IBAQCY8jdaQZChGsV2USggNiMOruYou6r4lK5IpDB/G/wkjUu0yKGX9rbxenDI
U5PMCCjjmCXPI6T53iHTfIUJrU6adTrCC2qJeHZERxhlbI1Bjjt/msv0tadQ1wUs
N+gDS63pYaACbvXy8MWy7Vu33PqUXHeeE6V/Uq2V8viTO96LXFvKWlJbYK8U90vv
o/ufQJVtMVT8QtPHRh8jrdkPSHCa2XV4cdFyQzR1bldZwgJcJmApzyMZFo6IQ6XU
5MsI+yMRQ+hDKXJioaldXgjUkK642M4UwtBV8ob2xJNDd2ZhwLnoQdeXeGADbkpy
rqXRfboQnoZsG4q5WTP468SQvvG5
-----END CERTIFICATE-----`,
      },
    },
  };
  plugin.uiSchema = {
    aws_key: {
      'ui:widget': 'textarea',
    },
    aws_cert: {
      'ui:widget': 'textarea',
    },
    aws_ca: {
      'ui:widget': 'textarea',
    },
  };

  return plugin;
};
