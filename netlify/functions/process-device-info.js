exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    console.log(`it's 405`);
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  const crt = `-----BEGIN CERTIFICATE-----
MIIDaTCCAlGgAwIBAgIBATANBgkqhkiG9w0BAQUFADB5MQswCQYDVQQGEwJVUzET
MBEGA1UEChMKQXBwbGUgSW5jLjEmMCQGA1UECxMdQXBwbGUgQ2VydGlmaWNhdGlv
biBBdXRob3JpdHkxLTArBgNVBAMTJEFwcGxlIGlQaG9uZSBDZXJ0aWZpY2F0aW9u
IEF1dGhvcml0eTAeFw0wNzA0MTYyMjU0NDZaFw0xNDA0MTYyMjU0NDZaMFoxCzAJ
BgNVBAYTAlVTMRMwEQYDVQQKEwpBcHBsZSBJbmMuMRUwEwYDVQQLEwxBcHBsZSBp
UGhvbmUxHzAdBgNVBAMTFkFwcGxlIGlQaG9uZSBEZXZpY2UgQ0EwgZ8wDQYJKoZI
hvcNAQEBBQADgY0AMIGJAoGBAPGUSsnquloYYK3Lok1NTlQZaRdZB2bLl+hmmkdf
Rq5nerVKc1SxywT2vTa4DFU4ioSDMVJl+TPhl3ecK0wmsCU/6TKqewh0lOzBSzgd
Z04IUpRai1mjXNeT9KD+VYW7TEaXXm6yd0UvZ1y8Cxi/WblshvcqdXbSGXH0KWO5
JQuvAgMBAAGjgZ4wgZswDgYDVR0PAQH/BAQDAgGGMA8GA1UdEwEB/wQFMAMBAf8w
HQYDVR0OBBYEFLL+ISNEhpVqedWBJo5zENinTI50MB8GA1UdIwQYMBaAFOc0Ki4i
3jlga7SUzneDYS8xoHw1MDgGA1UdHwQxMC8wLaAroCmGJ2h0dHA6Ly93d3cuYXBw
bGUuY29tL2FwcGxlY2EvaXBob25lLmNybDANBgkqhkiG9w0BAQUFAAOCAQEAd13P
Z3pMViukVHe9WUg8Hum+0I/0kHKvjhwVd/IMwGlXyU7DhUYWdja2X/zqj7W24Aq5
7dEKm3fqqxK5XCFVGY5HI0cRsdENyTP7lxSiiTRYj2mlPedheCn+k6T5y0U4Xr40
FXwWb2nWqCF1AgIudhgvVbxlvqcxUm8Zz7yDeJ0JFovXQhyO5fLUHRLCQFssAbf8
B4i8rYYsBUhYTspVJcxVpIIltkYpdIRSIARA49HNvKK4hzjzMS/OhKQpVKw+OCEZ
xptCVeN2pjbdt9uzi175oVo/u6B2ArKAW17u6XEHIdDMOe7cb33peVI6TD15W4MI
pyQPbp8orlXe+tA8JA==
-----END CERTIFICATE-----`

const crt2 = `-----BEGIN CERTIFICATE-----
MIICyTCCAbGgAwIBAgIBATANBgkqhkiG9w0BAQUFADAoMRkwFwYDVQQDExBUZXN0
IENlcnRpZmljYXRlMQswCQYDVQQGEwJVUzAeFw0yNTAzMjIxMzI4MTNaFw0yNjAz
MjIxMzI4MTNaMCgxGTAXBgNVBAMTEFRlc3QgQ2VydGlmaWNhdGUxCzAJBgNVBAYT
AlVTMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw6V32DfASf6JR2gz
0vxmMFNSa9FIleOAJewp7arfuZAm0nrjW8vRb1auVlJuZx1XC5/el+x2oFhT2rs4
uBBEb2GVdf51/D7XsYSDaL8CR5NRL0ukr3S3CDpvgLj34FcBZZk1AoXC4PtLsRk8
HFOko68UsuqlWCQqx/6eNPJ41f0OkQywNSzG5xLDqYac4LkNHpk00zw9dVbceDwu
KiZ4vyv+ezZwLm/PMGORZDNWTy0c8a4RsPZgr9shS/zHPbUMmtX+0Hyh1WT5V5pE
tuxhmy6MPTdg3MD5bpvucDRAikUJMG1LSZUbOXI8hkP52Xhzw6SxNBfITfrqx9+C
xZxs9QIDAQABMA0GCSqGSIb3DQEBBQUAA4IBAQCJFj3tKHvghf87Q4C5HimUVk0B
QjTSb0+3fyKRHs0leEqLzygSWsIL+PSgT96JqCRoPsgHbzP3VP8lUoKfHNSdISV1
kbWPS8fe6WndEu+bVfJD2FiuJjFEZZZEtEdAoDbPm7aw3n7iKqihdtdA6W6Z1Q53
10JLwevRLTn0CojkWwo5BuYcZd0X28e+1GV0P02g0WW841sAgY8nnG1e/OisuS4N
tyWUJUIHOtMhKSRCQ3g9BIUZli25j0gCid0WPpRIYSOFUH4NGDE0az4VOcRSqKJW
wHwdhXGgvrdV0TmLkUGG2kIHxj+AuloLEdNwZ4qHEjUfFVUvR+FcDhH04UWc
-----END CERTIFICATE-----`;

  try {
    const forge = require('node-forge');
    
    try {
      const rawData = event.body;
      console.log('Raw data length:', rawData.length);
      console.log('Content-Type:', event.headers['content-type']);
      
      // Use the certificate defined above
      const certStore = forge.pki.createCaStore([crt2]);
      
      const binaryData = Buffer.from(rawData, 'base64');
      
      // Parse and verify the PKCS#7 signed data
      const asn1 = forge.asn1.fromDer(binaryData.toString('binary'));
      const p7 = forge.pkcs7.messageFromAsn1(asn1);
      
      // Verify against Apple's CA
      const verified = p7.verify([], certStore);
      if (!verified) {
        throw new Error('Invalid device signature');
      }
      
      // Extract the content
      const plistData = Buffer.from(p7.content, 'binary').toString('utf8');
      console.log('PKCS#7 parsing successful');
      console.log('Extracted plist:', plistData.substring(0, 100));
    } catch (e1) {
      console.log('PKCS#7 parsing failed:', e1.message);
      throw new Error('Failed to parse PKCS#7 data');
    }

    // Parse the plist XML
    const DOMParser = require('xmldom').DOMParser;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(plistData, "text/xml");

    // Validate that it's a plist
    if (!xmlDoc.getElementsByTagName('plist').length) {
      console.log(`it's 400`);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid plist format' })
      };
    }
    
    // Extract device information
    const dict = xmlDoc.getElementsByTagName('dict')[0];
    const deviceInfo = {};
    
    // Helper function to get value for a key
    const getValue = (keyName) => {
      const keys = dict.getElementsByTagName('key');
      for (let i = 0; i < keys.length; i++) {
        const keyNode = keys[i];
        if (keyNode && keyNode.firstChild && keyNode.firstChild.nodeValue === keyName) {
          const nextSibling = keyNode.nextSibling;
          // Skip text nodes (whitespace)
          const valueNode = nextSibling.nodeType === 3 ? nextSibling.nextSibling : nextSibling;
          return valueNode && valueNode.firstChild ? valueNode.firstChild.nodeValue : '';
        }
      }
      return '';
    };

    deviceInfo.UDID = getValue('UDID');
    deviceInfo.DEVICE_NAME = getValue('DEVICE_NAME');
    deviceInfo.PRODUCT = getValue('PRODUCT');
    deviceInfo.VERSION = getValue('VERSION');
    deviceInfo.CHALLENGE = getValue('CHALLENGE');
    
    // Create the redirect URL with parameters
    const params = new URLSearchParams(deviceInfo).toString();
    const redirectUrl = `https://ahmad-nashihuddien.netlify.app/get-ios-udid/complete?${params}`;

    return {
      statusCode: 301,
      headers: {
        location: redirectUrl
      },
      body: JSON.stringify(deviceInfo)
    };
  } catch (error) {
    console.log(`it's 500 ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
    };
  }
};