const forge = require('node-forge');

// Generate a new key pair
const keys = forge.pki.rsa.generateKeyPair(2048);

// Create a certificate
const cert = forge.pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

const attrs = [{
  name: 'commonName',
  value: 'Test Certificate'
}, {
  name: 'countryName',
  value: 'US'
}];
cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.sign(keys.privateKey);

// Create PKCS#7 structure
const p7 = forge.pkcs7.createSignedData();
p7.addCertificate(cert);

// Convert everything to PEM format
const privatePem = forge.pki.privateKeyToPem(keys.privateKey);
const publicPem = forge.pki.publicKeyToPem(keys.publicKey);
const certPem = forge.pki.certificateToPem(cert);
const p7Pem = forge.pkcs7.messageToPem(p7);

console.log('PRIVATE KEY:');
console.log(privatePem);
console.log('\nPUBLIC KEY:');
console.log(publicPem);
console.log('\nCERTIFICATE:');
console.log(certPem);
console.log('\nPKCS#7:');
console.log(p7Pem);