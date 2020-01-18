<?php
include "Sendmail.php";


$config=array(
  'host'=>'ssl://smtp.naver.com',
  'smtp_id'=>'sji0800',
  'smtp_pw'=>'ahn1313!!',
  'debug'=>1,
  'charset'=>'utf-8',
  'ctype'=>'text/plain'
);
$sendmail = new Sendmail($config);

$to = $_POST["mailAddress"];
// $to = "sji0800@naver.com";
$from = "sji0800@naver.com";
$subject = "SPG 물품 반납관련 메일입니다.";
$end_date = $_POST["endDate"];
$pname = $_POST["pname"];
// format -> 0000-00-00

$today = date("Y-m-d");

$end_form = new DateTime($end_date);
$now_form = new DateTime($today);
$diff = date_diff($end_form, $now_form);
$diff_days = $diff->days;

$body =
"안녕하세요, SPG 물품관리시스템 안내메일입니다\n
현재 빌려가신 물품 (".$pname.") 반납일이 예정보다\n"
. $diff_days . "일 초과되었습니다. 해당 물품을 꼭 반납해주시고
\n 물품 반납 후 반납처리를 하지 않으셨다면 처리를 해주시거나 관리자에게 문의바랍니다
\n\n <해당 메일은 회신 불필요한 메일입니다>";

$sendmail->send_mail($to, $from, $subject, $body)

?>
