<?php
$jsonData = $_POST["sendFile"];
$fileName = "data/Data.json";

$fp = fopen($fileName, "w+");
fwrite($fp, $jsonData);
fclose($fp);
?>
