// 대여 기간 현재 날짜로 초기
document.getElementById('date').value = new Date().toISOString().substring(0, 10);
$(document).ready(function() {

  // URL 파싱
  function parseURL(){

  }

  // Page Blur(흐림처리)
  function pageBlur() {

  }

  // Page unBlur
  fu   nction pageUnblur() {

  }

  // DataBase Table Load ( 초기 테이블 로드 )
  function loadTable() {
    $.ajax({
      url: "/Data.json",
      success: function(result) {
        for(var i=0; i<result.length; i++){
          var loadTr = $('<tr />');

          var indexTd = $('<td />', { text : result[i][0] });
          indexTd.appendTo(loadTr);

          var catTd = $('<td />', { text : result[i][1] });
          catTd.appendTo(loadTr);

          var pnameTd = $('<td />', { text : result[i][2] });
          pnameTd.appendTo(loadTr);

          var rnameTd = $('<td />', { text : result[i][3] });
          rnameTd.appendTo(loadTr);

          var date = result[i][4] + " ~ " + result[i][5];
          var dateTd = $('<td />', { text : date });
          nameTd.appendTo(loadTr);

          if(result[i][6]) { // 대여여부 0이면 대여중
            var btn = $('<input />', {
              type : "button",
              value : "불가",
              class : "bttn-simple bttn-md bttn-retu",
              click : function() { tableBtnClicked(this); }
            });
          }
          else {            // 대여여부 1이면 대여가능
            var btn = $('<input />', {
              type : "button",
              value : "가능",
              class : "bttn-simple bttn-md bttn-rent"
            });
          }
        }
      },
      error : function(result) { alert("저장된 물품 데이터가 없습니다."); }
    });
  }

  // Table 변경시 함수
  function changeTable() {

  }

  // 테이블의 가능/불가 버튼 누를시 발생
  function tableBtnClicked(obj) {

  }

  // 불가 Div load
  function impossibleDivload(){

  }

  // 가능 Div load
  function possibleDivload(){

  }

});
