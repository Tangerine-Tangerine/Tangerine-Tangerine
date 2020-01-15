// 대여 기간 현재 날짜로 초기
document.getElementById('rent-date').value = new Date().toISOString().substring(0, 10);
$(document).ready(function() {
  var memberList = new Array();
  var listCount = 0;
  parseURL();

  //URL 파싱
  function parseURL(){
    loadTable();
    memberLoad();
    setTimeout(function() {
      $("#loadPage").css("display","none");
      $("#total_Page").css("display","block");

      var url = String($(location).attr('href'));
      if(url.includes("#")){
        var url_parse = url.split("#");
        var url_data = url_parse[1].split("_");
        var url_idx_string = url_data[0];
        var idx;
        if(url_idx_string.substring(0,2)=="00"){
          idx = Number(url_idx_string.substring(2,3));
        }
        else if(url_idx_string.substring(0,1)=="0"){
          idx = Number(url_idx_string.substring(1,2));
        }
        else if(url_idx_string=="000"){
          idx = Number(0);
        }
        if($("#btn-"+idx).attr("value")=="가능"){
          $("#rent_hidden").val(idx);
          possibleDivload(idx);
        } else{
          $("#return_hidden").val(idx);
          impossibleDivload(idx);
        }
      }
    }, 800);
  }

  // Page Blur(흐림처리)
  function pageBlur() {

  }

  // Page unBlur
  function pageUnblur() {

  }

  // DataBase Table Load ( 초기 테이블 로드 )
  function loadTable() {
    $.ajax({
      url: "data/Data.json",
      success: function(result) {
        for(var i=0; i<result.length; i++){
          listCount++;
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

  // 현재 날짜 yy-mm-dd 형식으로 가져오기
  function getDateFormat(){
    var fullDate = new Date();
    var year = String(fullDate.getYear()).substring(1,3);
    var month = String(fullDate.getMonth()+1);
    if(month.length==1) { month = "0" + month; }
    var date = String(fullDate.getDate());
    if(date.length==1) { date = "0" + month; }
    return year + "." + month + "." + date;
  }

  // 날짜 형식 변환
  function DateFormatChange(dateStr){
    var year = String(dateStr).substring(2,4);
    var month = String(dateStr).substring(5,7);
    var date = String(dateStr).substring(8,10);
    return year + "." + month + "." + date;
  }

  // Table 변경시 함수
  function changeTable(inputRent,idx) {
    var uploadOk = false;
    if(inputRent==1){
      var start_date = getDateFormat();
      var end_date = DateFormatChange($("#rent-date").val());
      var rname = $("#rent-rname").val();
      var rent_pw = $("#rent-pw").val();
      if(String(rent_pw).length<5){
        alert("비밀번호는 5자리 이상으로 해주세요");
        uploadOk = false;
      } else {
        uploadOk = true;
      }
    }
    else{
      var return_pw = $("#return-pw").val();
    }

    $.ajax({
      url: "data/Data.json",
      success: function(result) {
        if(inputRent==1 && memberCheck(rname)==true && uploadOk==true){
          var newArray = result;
          newArray[idx][3] = rname;
          newArray[idx][4] = start_date;
          newArray[idx][5] = end_date;
          newArray[idx][6] = 0;
          newArray[idx][7] = rent_pw;
          var sendFile = JSON.stringify(newArray);
          $.ajax({
            url : "uploads.php",
            type : 'POST',
            data : { sendFile : sendFile }
          });
          alert("대여가 완료되었습니다");
          $("#rname-"+idx).text(rname);
          $("#date-"+idx).text(start_date + " ~ " + end_date);
          $("#btn-"+idx).attr("class","bttn-simple bttn-md bttn-no");
          $("#btn-"+idx).attr("value","불가");
          rentCancel();
        }
        else if(inputRent==0){
          if(result[idx][7]==return_pw){
            var newArray = result;
            newArray[idx][3] = "-";
            newArray[idx][4] = "-";
            newArray[idx][5] = "-";
            newArray[idx][6] = 1;
            newArray[idx][7] = "";
            var sendFile = JSON.stringify(newArray);
            $.ajax({
              url : "uploads.php",
              type : 'POST',
              data : { sendFile : sendFile }
            });
            alert("반납이 완료되었습니다");
            $("#rname-"+idx).text("-");
            $("#date-"+idx).text("- ~ -");
            $("#btn-"+idx).attr("class","bttn-simple bttn-md bttn-yes");
            $("#btn-"+idx).attr("value","가능");
            returnCancel();
          }
          else{
            alert("비밀번호를 확인해주세요");
          }
        }
      },
      error : function(result) { alert("물품 데이터를 찾을 수 없습니다."); }
    });
  }

  // 동아리 명단 최초 Load
  function memberLoad(){
    $.ajax({
      url : "data/SPG_MEMBER.json",
      success: function(result) {
        memberList = result;
      },
      error : function(result) { alert("회원 목록을 찾을 수 없습니다."); }
    });
  }

  // 동아리 명단 비교
  function memberCheck(str){
    for(var i=0; i<memberList.length; i++){
      if(str==memberList[i]) { return true; }
    }
    alert("회원 목록에 존재하지 않는 이름입니다. 다시 확인해주세요")
    return false;
  }

  // 테이블의 가능/불가 버튼 누를시 발생
  function tableBtnClicked(obj) {
    var objId = $(obj).attr("id");
    var idxArr = objId.split("-");
    var idx = Number(idxArr[1]);

    if($(obj).val()=="가능"){
      $("#rent_hidden").val(idx);
      possibleDivload(idx);
    } else{
      $("#return_hidden").val(idx);
      impossibleDivload(idx);
    }
  }

  // 불가 Div load
  function impossibleDivload(idx){
    if($("#rent").css("display")!="block"){
      $("#return-pname").val( $("#pname-"+idx).text() );
      $("#return-rname").val( $("#rname-"+idx).text() );
      $("#return").css("display","block");
      $("#return_hidden").val(idx);
      // pageBlur();
    }
  }

  // 가능 Div load
  function possibleDivload(idx){
    if($("#return").css("display")!="block"){
      $("#rent-pname").val( $("#pname-"+idx).text() );
      $("#rent").css("display","block");
      $("#rent").val(idx);
      // pageBlur();
    }
  }

  // Rent Div에서 버튼 눌렀을때
  function rentSubmit(){
    changeTable(1, $("#rent_hidden").val());
  }

  // Return Div에서 버튼 눌렀을때
  function returnSubmit(){
    changeTable(0, $("#return_hidden").val());
  }

  // Rent Div에서 Cancel 버튼 눌렀을때
  function rentCancel(){
    $("#rent").css("display","none");
    $("#rent-date").val("");
    $("#rent-rname").val("");
    $("#rent-pname").val("");
    $("#rent-pw").val("");
    $("#rent_hidden").val("");
  }

  // Return Div에서 Cancel 버튼 눌렀을때
  function returnCancel(){
    $("#return").css("display","none");
    $("#return-pname").val("");
    $("#return-rname").val("");
    $("#return-pw").val("");
    $("#return_hidden").val("");
  }

  // 관리자 페이지로 이동
  function moveToAdmin(){
    var adminPage = window.open("http://34.87.29.227/Ahn/manager.html", '_blank');
    // 링크 경로에 맞춰서 수정해야함
    adminPage.focus();
  }

  // Search Div Load
  function searchClicked(){
    if( $("#search").css("display") == "none" ){
      $("#search").css("display","block");
    }
    else{
      $("#search").val("");
      $("#search").css("display","none");
    }
  }

  // Search function
  function searchTable(){
    revertTable();
    for(var i=0; i<listCount; i++){
      var findKeyWord = false;
      var keyword = String($("#srch").val());

      if( $("#index-"+i).text().match(keyword) ){
        findKeyWord = true;
      }
      if( $("#cat-"+i).text().match(keyword) ){
        findKeyWord = true;
      }
      if( $("#pname-"+i).text().match(keyword) ){
        findKeyWord = true;
      }
      if( $("#rname-"+i).text().match(keyword) ){
        findKeyWord = true;
      }
      if(findKeyWord==false){
        $("#line-"+i).css("display","none");
      }
    }
    $("#search").val("");
  }

  // Search 결과 되돌리기
  function revertTable(){
    for(var i=0; i<listCount; i++){
      if($("#line-"+i).css("display")=="none")
      $("#line-"+i).css("display","");
    }
  }

  // Main Clicked
  function mainClicked(){
    revertTable();
    $("#search").val("");
    $("#search").css("display","none");
  }

  $("#rent-btn").click(rentSubmit);
  $("#return-btn").click(returnSubmit);
  $("#rent-cancel").click(rentCancel);
  $("#return-cancel").click(returnCancel);
  $("#login").click(moveToAdmin);
  $("#Info").click(searchClicked);
  $("#btn-search").click(searchTable);
  $("#Main").click(mainClicked);
});

// qr 코드 눌렀을때
function openQRCamera(node) {
  var reader = new FileReader();
  reader.onload = function() {
    node.value = "";
    qrcode.callback = function(res) {
      if(res instanceof Error) {
        alert("No QR code found. Please make sure the QR code is within the camera's frame and try again.");
      } else {
        if(res != ""){
          location.href = res;
          location.reload();
        }
      }
    };
    qrcode.decode(reader.result);
  };
  reader.readAsDataURL(node.files[0]);
}

function showQRIntro() {
  return confirm("Use your camera to take a picture of a QR code.");
}
