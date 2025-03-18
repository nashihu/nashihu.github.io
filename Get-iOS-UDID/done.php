<?php


$data = file_get_contents('php://input');

// Log the input data
file_put_contents('debug.log', date('Y-m-d H:i:s') . " Received data: " . $data . "\n", FILE_APPEND);

// Send data to Netlify function
$ch = curl_init('https://ahmad-nashihuddien.netlify.app/.netlify/functions/process-device-info');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/xml'));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Log the API response
file_put_contents('debug.log', date('Y-m-d H:i:s') . " API Response (HTTP $httpCode): " . $response . "\n", FILE_APPEND);

$plistBegin   = '<?xml version="1.0"';
$plistEnd   = '</plist>';
$pos1 = strpos($data, $plistBegin);
$pos2 = strpos($data, $plistEnd);
$data2 = substr ($data,$pos1,$pos2-$pos1);
$xml = xml_parser_create();
xml_parse_into_struct($xml, $data2, $vs);
xml_parser_free($xml);

$UDID = "";
$CHALLENGE = "";
$DEVICE_NAME = "";
$DEVICE_PRODUCT = "";
$DEVICE_VERSION = "";
$iterator = 0;

$arrayCleaned = array();
foreach($vs as $v){
if($v['level'] == 3 && $v['type'] == 'complete'){
$arrayCleaned[]= $v;
}
$iterator++;
}

$data = "";
$iterator = 0;

foreach($arrayCleaned as $elem){

$data .= "\n==".$elem['tag']." -> ".$elem['value']."<br/>";

switch ($elem['value']) {

case "CHALLENGE":

$CHALLENGE = $arrayCleaned[$iterator+1]['value'];

break;

case "DEVICE_NAME":

$DEVICE_NAME = $arrayCleaned[$iterator+1]['value'];

break;

case "PRODUCT":

$DEVICE_PRODUCT = $arrayCleaned[$iterator+1]['value'];

break;

case "UDID":

$UDID = $arrayCleaned[$iterator+1]['value'];

break;

case "VERSION":

$DEVICE_VERSION = $arrayCleaned[$iterator+1]['value'];

break;

}
$iterator++;
}

$params = "UDID=".$UDID."&CHALLENGE=".$CHALLENGE."&DEVICE_NAME=".$DEVICE_NAME."&DEVICE_PRODUCT=".$DEVICE_PRODUCT."&DEVICE_VERSION=".$DEVICE_VERSION;

header('Location: https://ahmad-nashihuddien.fwh.is/complete?'.$params);

?>