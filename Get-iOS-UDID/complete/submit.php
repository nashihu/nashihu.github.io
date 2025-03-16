<?php
	$a = $_POST['udid'] . "\n" . $_POST['name'] . "\n" . $_POST['email'] . "\n" . $_POST['product'];
	mail("ahmad.n.id@gmail.com", "UDID", $a);
	header('Location: finished.html');
?>
	