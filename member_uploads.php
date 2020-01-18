<?php
$jsonData = $_POST["sendFile"];
$fileName = "data/SPG_MEMBER.json";

$fp = fopen($fileName, "w+");
fwrite($fp, $jsonData);
fclose($fp);
?>
