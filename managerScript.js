$(document).ready(function(){
  $("#save").css("display","none");
  $('#createBtn').click(function(){

    // input에 입력하는 값들을 뽑아서 변수에 저장

    var m_number = $('#m_number').val();
    var m_group = $('#m_group').val();

    // var m_url="http://168.188.7.186/Tangerine/load.html#";
    var m_url="http://35.188.153.88/Tangerine-Tangerine/load.html#";

    // encodeURIComponent로 인코딩

    m_number = encodeURIComponent(m_number);
    m_group=encodeURIComponent(m_group);
    m_url = encodeURIComponent(m_url);

    googleQRUrl = "https://chart.googleapis.com/chart?chs=177x177&cht=qr&chl=";


    // 이미지가 나타날 영역에 원하는 내용을 넣은 QR code의 이미지를 출력
    $('#qrcode').attr('src', googleQRUrl+m_url+m_number+'_'+m_group+'&choe=UTF-8');
  });

});
