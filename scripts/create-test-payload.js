const forge = require('node-forge');

// Use your private key here (paste from terminal output)
const privateKeyPem = `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEAw6V32DfASf6JR2gz0vxmMFNSa9FIleOAJewp7arfuZAm0nrj
W8vRb1auVlJuZx1XC5/el+x2oFhT2rs4uBBEb2GVdf51/D7XsYSDaL8CR5NRL0uk
r3S3CDpvgLj34FcBZZk1AoXC4PtLsRk8HFOko68UsuqlWCQqx/6eNPJ41f0OkQyw
NSzG5xLDqYac4LkNHpk00zw9dVbceDwuKiZ4vyv+ezZwLm/PMGORZDNWTy0c8a4R
sPZgr9shS/zHPbUMmtX+0Hyh1WT5V5pEtuxhmy6MPTdg3MD5bpvucDRAikUJMG1L
SZUbOXI8hkP52Xhzw6SxNBfITfrqx9+CxZxs9QIDAQABAoIBABLDAbLnp8ZAxU/m
d3/OagtM1jzWKUiMdEvOsbejuQgtwXdSRw7UxR0Q+i93gLRdPS11c45so/Sc+8+g
QCBwmOt4d3GFCTH7IcqZe1OWa6TLBRBMx/p2bh35Ipu8wTKPjWf9kPaQtr9GAfx1
/8x0nfd/cPP2agxBjaO3sFrB/OICUw6WL+jF+4d5jnlnGpQTwUU3PTOINWmnoZ7H
wq9xFyx2NJh/329rxZr5cb5sOcdsfCTTIw1A5CoIFaIfImP5QxbY5PHdsXGia2k2
gyir6LrXUVl8kfHxaYEVtLZ5yI5GP1JHzQxD9Ikqtkp6fD6Vza/e9D/I8P66w9QH
IkDUA1ECgYEA+bhVlIoBP5/nd2VW6HMkQfTSr3dzUkSRmI4VmVSnv9lcsdcPYrlk
wvfE6UwqKfg1/4A5ZtXZK8SoSNkFj2k9dv1xbWIuOIL6lx/HKkqMwzfQjZBlgVKs
i2h/3csLYw1/YhHVnUL10zJN1jU05M0Y71Uyn0dadahlYtcCyzwsmnECgYEAyJED
qrnzVZrvIvbXJAU1Vz84pkKa4cQpu8bRuYQ10JJprVWRlWSzWO7HLXX6j+BMPDHO
8Bt8TW7rspwDoZHckgk3E8R+KKocNtTbACSJhGPVavFLz9DRwucIFVJ15rN0ZU2d
RwdIsz5ltRkCLlSu78RwQKLplrnWpCWnhIek1MUCgYEAwUbu1fzKYpg86qhAz8Du
ey4mMzDczPvNRKoUBY0EGPT/TZYKjnq3hj+G5JrSt5EpGgwAYZt6bunS5i8yooDt
1b7rn6Gx7INTuMwbtpvkvuPgQvFT3vhCG9RRwzR4J742rYzoLMO6yC/TFswvmDc1
6WejuqvbU912Oz33J533V8ECgYEAssIk3YZsbbDwUF5ms9D8kK1lZTHZ7zyx4Y27
oLhIaoQEMhwg7GDbRHlVBpyvXIqSB9hw0yn8KNuisQdCaT+isnoKH9EyjDXJfclL
A56M/nUoYu97HVbFjgvx9WcQdDUfmaaKdiL01eTYK4eFnRuW61ZOoh1RSiiKOLTi
0ElBTO0CgYEA4N8ocsSAdXgokZHSYvi7PoNZrIorGjPFLXzvsBPfsWxTneyOSrJ1
XP9R6m5PskMkWVT0sPsN9nuoFnmvJrlldsw18LRLZ1XHwEqKlMGH2Z3KM7DFP3zy
os6mrLm4g2DQVPWUXm4WNmB1WhJNLl+jNyd6T8NsoR2pNTF6HpHDJfY=
-----END RSA PRIVATE KEY-----`;

// Use your certificate here (paste from terminal output)
const certPem = `-----BEGIN CERTIFICATE-----
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

const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
const cert = forge.pki.certificateFromPem(certPem);

// Create a test plist
const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>UDID</key><string>test-device-id</string>
    <key>DEVICE_NAME</key><string>Test iPhone</string>
    <key>PRODUCT</key><string>iPhone14,3</string>
    <key>VERSION</key><string>16.0</string>
    <key>CHALLENGE</key><string>test-challenge</string>
  </dict>
</plist>`;

// Create PKCS#7 signed data
const p7 = forge.pkcs7.createSignedData();
p7.content = forge.util.createBuffer(plist);

// Add signer with the certificate we generated
p7.addSigner({
  key: privateKey,
  certificate: cert
});

p7.sign();

// Convert to base64
const der = forge.asn1.toDer(p7.toAsn1()).getBytes();
const base64 = Buffer.from(der, 'binary').toString('base64');

console.log('payload:');
console.log(base64);