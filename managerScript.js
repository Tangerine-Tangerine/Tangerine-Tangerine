$("#add").css("display","none");
$(document).ready(function(){
  loadTable();
  var manager_ID = "";

  $("#save").css("display","none");
  $('#createBtn').click(function(){

    // input에 입력하는 값들을 뽑아서 변수에 저장

    var m_number = $('#m_number').val();
    var m_group = $('#m_group').val();

    // var m_url="http://168.188.7.186/Tangerine/load.html#";
    var m_url="http://34.87.29.227/sohui/main.html#";

    // encodeURIComponent로 인코딩

    m_number = encodeURIComponent(m_number);
    m_group=encodeURIComponent(m_group);
    m_url = encodeURIComponent(m_url);

    googleQRUrl = "https://chart.googleapis.com/chart?chs=177x177&cht=qr&chl=";


    // 이미지가 나타날 영역에 원하는 내용을 넣은 QR code의 이미지를 출력
    $('#qrcode').attr('src', googleQRUrl+m_url+m_number+'_'+m_group+'&choe=UTF-8');
    $("#add").css("display","block");

  });

  // Login Submit시 함수
  function loginSubmit(){
    var input_id = $("#username").val();
    var input_pw = $("#password").val();
    $.ajax({
      url: "data/managerList.json",
      success: function(list){
        for(var i=0; i<list.length; i++){
          if(list[i][0]==input_id && list[i][1]==input_pw){
            manager_ID = input_id;
            loginSuccess();
          }
        }
      },
      error : function(result) { alert("매니저 정보를 찾을 수 없습니다."); }
    });
  }

  // Login 성공시 Page Change
  function loginSuccess(){
    $("#manage").css("display","none");
    $("#logged").css("display","block");
  }

  // Data Table load
  function loadTable(){
    $.ajax({
      url: "data/Data.json",
      success: function(result) {
        for(var i=0; i<result.length; i++){
          var loadTr = $('<tr />', {
            id : "line-" + i
          });

          var indexTd = $('<td />', {
            text : result[i][0],
            id : "index-"+i
          });
          indexTd.appendTo(loadTr);

          var catTd = $('<td />', {
            text : result[i][1],
            id : "cat-"+i
          });
          catTd.appendTo(loadTr);

          var pnameTd = $('<td />', {
            text : result[i][2],
            id : "pname-"+i
          });
          pnameTd.appendTo(loadTr);

          var rnameTd = $('<td />', {
            text : result[i][3],
            id : "rname-"+i
          });
          rnameTd.appendTo(loadTr);

          var date = result[i][4] + " ~ " + result[i][5];
          var dateTd = $('<td />', {
            text : date,
            id : "date-"+i
          });
          dateTd.appendTo(loadTr);

          if(result[i][6]==0) { // 대여여부 0이면 대여중
            var btn = $('<input />', {
              type : "button",
              value : "불가",
              id : "btn-"+i,
              class : "bttn-simple bttn-md bttn-no",
              click : function() { tableBtnClicked(this); }
            });
          }
          else {            // 대여여부 1이면 대여가능
            var btn = $('<input />', {
              type : "button",
              value : "가능",
              id : "btn-"+i,
              class : "bttn-simple bttn-md bttn-yes",
              click : function() { tableBtnClicked(this); }
            });
          }
          var btnTd = $('<td />');
          $(btn).appendTo(btnTd);
          $(btnTd).appendTo(loadTr);
          $(loadTr).appendTo("#mainTable");
        }
      },
      error : function(result) { alert("저장된 물품 데이터가 없습니다."); }
    });

  }

  $("#btn-login").click(loginSubmit);
});
