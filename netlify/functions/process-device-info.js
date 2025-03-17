exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    const xmlData = event.body;
    
    // Parse the XML using a server-side XML parser
    const DOMParser = require('xmldom').DOMParser;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");
    
    // Extract device information
    const deviceInfo = {
      UDID: xmlDoc.getElementsByTagName('UDID')[0]?.textContent || '',
      DEVICE_NAME: xmlDoc.getElementsByTagName('DEVICE_NAME')[0]?.textContent || '',
      PRODUCT: xmlDoc.getElementsByTagName('PRODUCT')[0]?.textContent || '',
      VERSION: xmlDoc.getElementsByTagName('VERSION')[0]?.textContent || '',
      CHALLENGE: xmlDoc.getElementsByTagName('CHALLENGE')[0]?.textContent || ''
    };

    return {
      statusCode: 200,
      body: JSON.stringify(deviceInfo)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
    };
  }
};