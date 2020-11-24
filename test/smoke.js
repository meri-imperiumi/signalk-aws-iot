const chai = require('chai');
const plugin = require('../index');

describe('Signal K AWS IoT plugin', () => {
  let status = null;
  let error = null;
  const appMock = {
    debug: (msg) => console.log('DEBUG', msg),
    error: (err) => console.log('ERROR', err),
    setProviderError: (err) => {
      error = err;
    },
    setProviderStatus: (stat) => {
      status = stat;
    },
    subscriptionmanager: {
      subscribe: () => {},
    },
  };
  const options = {};
  let instance;
  describe('interface', () => {
    it('should be a function', () => {
      chai.expect(plugin).to.be.a('function');
    });
    it('should be possible to load', () => {
      instance = plugin(appMock);
    });
    it('should produce a plugin instance', () => {
      chai.expect(instance.id).to.equal('signalk-aws-iot');
      chai.expect(instance.schema).to.be.an('object');
    });
  });
  describe('on start', () => {
    it('should be possible to start', () => {
      Object.keys(instance.schema.properties).forEach((key) => {
        if (instance.schema.properties[key].default) {
          options[key] = instance.schema.properties[key].default;
        }
      });
      options.aws_host = 'example.net';
      options.aws_client_id = '123';
      options.aws_key = `-----BEGIN PRIVATE KEY-----
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
xN3pGWoro+JEoLfTR1NYUfZrsLIPB9g=
-----END PRIVATE KEY-----`;
      options.aws_cert = `-----BEGIN CERTIFICATE-----
MIIFWDCCA0ACCQCv+U7AfscYxTANBgkqhkiG9w0BAQsFADBuMQswCQYDVQQGEwJG
UjEWMBQGA1UECAwNSWxlLWRlLUZyYW5jZTEOMAwGA1UEBwwFUGFyaXMxHTAbBgNV
BAoMFE15SW50ZXJuZXRDb21wYW55TFREMRgwFgYDVQQDDA93d3cuZXhhbXBsZS5j
b20wHhcNMjAxMTI0MTAyNDU3WhcNMjExMTI0MTAyNDU3WjBuMQswCQYDVQQGEwJG
UjEWMBQGA1UECAwNSWxlLWRlLUZyYW5jZTEOMAwGA1UEBwwFUGFyaXMxHTAbBgNV
BAoMFE15SW50ZXJuZXRDb21wYW55TFREMRgwFgYDVQQDDA93d3cuZXhhbXBsZS5j
b20wggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDGiqy4jK39JEwlwRfH
G8meGti+9TmNxh4S178VulcCoAxUHEDGWc6d9+D7ayKOjyvZ9WePlPGKVh5S0vr1
0tuei0CLfQyjabPXnbuaOr5c98RdhNiGU7BzCqTdZKEngXz3BoqTSqZ69IvKGz6e
NVNu8sMNw4tpydA8LS6O8Mb+49KuTRDVl5VfZaH09N4XBBiw4u+qcxcKLb0dBPZ7
VqlFm2ofCKPLvoSrWu88PZe0KGJ4awbOfQ1JaarL+FRhmJkDp0fiGEY770+f3a3P
sgQP6to+ErSPHp8N80Ah5waP5EE4oHwYoXd/s+TC6r2DRo6Ptcp+FzeDoyXLXwOL
t37CPxOOSdlTGDbkLIkNGMivBignyn5OVVSOKhRW9rbfWKGUXlAw5ZHhhswc6/QB
3MIcnYu+VazqGTz3cNztHf8Vw6DrMf66a5LZT0McGjAfwH2+nXFybxuHsJqtOxtB
kVtK4bKoHbSr04NKkwVNa3ayDpzoO0uU06/8R2uShVrVTeI01GMPru29SuvNk160
LnhiiYHyq9MPNZla+31PqQYSeIjaDd/jG/WcmKFR/5Ysl/TLb15zI7QxBa1R56/d
ETj9Nd0c7ZE2girVqfVk1YVAdCoQSdmNT171gG8e5LMtTu4SdT/nlnkFp81O5E6x
UQ8fyIo3FCyPa1Sj6XuEUdps4QIDAQABMA0GCSqGSIb3DQEBCwUAA4ICAQCXSOKj
geib0pLFcM8YhpAqBHGjSAzyF+IAoIjUZLhRSv/Iy0Nqk78yZofklBE+tDi5npBI
Ohw3kEYW1LS9Xfl+MJlWiBqcI+Id97kHUaU+494pUAwsS6iMbHbgcpHkgTgMHly5
OVzJFZLgPyc6GF73j5sywzztE1/TC2r0teGYduu8da5HnQJHtEcURmwC7o+828PS
h+I261bXRBiET6KA3r0PYPoJ2fm9wjOzVHHbVc3x3uK3s6xfhPvpCfgfqZlkI44O
/q9feGUkpjqIc+F8cl4FoVMk85EIqjq4AdJjZ7v1eY921Sld2WRy3/Uj3k/30RJP
nWcoV/FTFB+84OecEOkWXoNbSH9cfLmRBUmUe9eLqkOzAwCo/qlyLjImsOZdSCwa
p4EG4Ibftm/fzcyHHKYmhE4IMtpEvjX4RXpPDw4OwwO9ubWaMk6DWvNfU0jM+VBe
ys39e0t9CXtMY9wW5unwpvXi+Y10JVGkyuUiBUr9ESlxYSN7OkpV1vIRuHHSQaZi
POHgDV5jS4FWfQUce9lipn8hEgBLst4pZfki52Lksqp2nbla/5YOIzuWPVUU+jSd
1OClU7hzANZutwoFPZAJzQoqArMbks2Lk3mWyiWhsym6y1fU+XeE1rSPhejcaOG9
qk3zOcBzNkcGtiBhYLq2FwGmhJb8yiGRaD8tOg==
-----END CERTIFICATE-----`;
      instance.start(options);
    });
    it('should have set status', () => {
      chai.expect(status).to.equal('Initializing');
      chai.expect(error).to.be.a('null');
    });
  });
  describe('on stop', () => {
    it('should be able to stop', () => {
      instance.stop();
    });
  });
});
