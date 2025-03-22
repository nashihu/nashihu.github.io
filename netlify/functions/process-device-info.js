exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    console.log(`it's 405`);
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    const forge = require('node-forge');
    
    // Get the raw data and log it for debugging
    const rawData = event.body;
    console.log('Raw data length:', rawData.length);
    console.log('Content-Type:', event.headers['content-type']);

    // Try different parsing approaches
    let plistData;
    try {
      // Clean and decode the base64 data
      const cleanedData = rawData.replace(/[\r\n\s]/g, ''); // Remove whitespace and line breaks
      const binaryData = Buffer.from(cleanedData, 'base64');
      
      // Parse as PKCS#7
      const asn1 = forge.asn1.fromDer(binaryData.toString('binary'));
      const p7 = forge.pkcs7.messageFromAsn1(asn1);
      
      // Extract the content
      plistData = Buffer.from(p7.content, 'binary').toString('utf8');
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