$("#add").css("display","none");
$(document).ready(function(){
  var listCount = 0;
  var manager_ID = "";
  loadTable();
  getCookie();

  $("#save").css("display","none");
  $('#createBtn').click(function(){

    //3자리 숫자로 만드는 함수
    function pad(n,width){
      n=n+'';
      return n.length >= width ? n: new Array(width - n.length + 1).join('0')+n;
    }
    var m_number = pad(listCount,3);

    // input에 입력하는 값들을 뽑아서 변수에 저장
    var m_group = $('#m_group').val();

    // var m_url="http://168.188.7.186/Tangerine/load.html#";
    var m_url="http://34.87.29.227/soy/main.html#";

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
            makeCookie(input_id);
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

  // Cookie 생성
  function makeCookie(inputID){
    document.cookie = "idCookie" + '=' + inputID;
  }

  // Cookie 가져오기
  function getCookie(){
    var value = String(document.cookie);
    if(value.length > 3){
      manager_ID = value.split('-')[1];
      loginSuccess();
    }
  }

  // Cookie 삭제
  function removeCookie(){
    var rm = new Date();

    rm.setDate( rm.getDate() - 1 );
    document.cookie = "idCookie" + "=" + "; expires=" + rm.toGMTString();
  }

  // Logout
  function logOutClicked(){
    removeCookie();
    manager_ID = "";
    $("#logged").css("display","none");
    $("#manage").css("display","block");
  }

  // Button Click 함수
  function tableBtnClicked(obj){
    var objId = $(obj).attr("id");
    var idxArr = objId.split("-");
    var idx = Number(idxArr[1]);

    if($(obj).val()=="대여"){
      alert("현재 대여중인 물품은 삭제할 수 없습니다.")
    } else{
      deleteLine(idx);
    }
  }

  // Delete function
  function deleteLine(idx){
    var newArray = new Array();
    $.ajax({
      url : "data/Data.json",
      success : function(result) {
        newArray = result;
        for(var i=idx; i<newArray.length; i++){
          newArray[i][0] = newArray[i][0] - 1;
        }
        newArray.splice(idx,1);
        var sendFile = JSON.stringify(newArray);
        $.ajax({
          url : "uploads.php",
          type : 'POST',
          data : { sendFile : sendFile },
          success : function() { alert("물품 삭제가 완료되었습니다"); },
          error : function() { alert("upload error"); }
        });
        $("#line-"+idx).remove();
        for(var i=idx+1; i<listCount; i++){
          var newIdx = Number($("#index-"+i).text())-1;
          $("#line-"+i).attr("id","line-"+newIdx);
          $("#index-"+i).text(newIdx);
          $("#index-"+i).attr("id","index-"+newIdx);
          $("#cat-"+i).attr("id","cat-"+newIdx);
          $("#pname-"+i).attr("id","pname-"+newIdx);
          $("#rname-"+i).attr("id","rname-"+newIdx);
          $("#date-"+i).attr("id","date-"+newIdx);
          $("#btn-"+i).attr("id","date-"+newIdx);
        }
        listCount--;
      },
      error : function() { alert("데이터 파일을 찾을 수 없습니다."); }
    });
  }

  // Data Table load
  function loadTable(){
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
              value : "대여",
              id : "btn-"+i,
              class : "bttn-simple bttn-md bttn-no",
              click : function() { tableBtnClicked(this); }
            });
          }
          else {            // 대여여부 1이면 대여가능
            var btn = $('<input />', {
              type : "button",
              value : "삭제",
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

  // Add 메뉴 클릭
  function addClicked(){
    if($("#qrcreate").css("display")=="none"){
      $("#qrcreate").css("display","block");
    }
  }

  // Add 취소
  function addCancel(){
    $("#qrcreate").css("display","none");
    $("#m_title").val("");
    $("#m_number").val("");
    $("#m_group").val("");
    $('#qrcode').attr('src', "");
    $("#add").css("display","none");
  }

  // Add Submit
  function addSubmit(){
    var input_title = $("#m_title").val();
    var input_group = $("#m_group").val();

    $.ajax({
      url : "data/Data.json",
      success : function(result){
        var newArr = new Array();
        newArr = result;
        var newArr_part = new Array();
        var imgSrc = $("#qrcode").attr("src");
        newArr_part.push(result.length);
        newArr_part.push(input_group);
        newArr_part.push(input_title);
        newArr_part.push("-");
        newArr_part.push("-");
        newArr_part.push("-");
        newArr_part.push(1);
        newArr_part.push("-");
        newArr_part.push(imgSrc);
        newArr.push(newArr_part);
        var sendFile = JSON.stringify(newArr);
        $.ajax({
          url : "uploads.php",
          type : 'POST',
          data : { sendFile : sendFile },
          success : function() {
            alert("물품 생성이 완료되었습니다.");
            // clearTable();
            // loadTable();
          },
          error : function() { alert("uploads error"); }
        });
        var newTr = $('<tr />', { id : "line-" + listCount });

        var indexTd = $('<td />', { text : listCount , id : "index-"+listCount });
        indexTd.appendTo(newTr);

        var catTd = $('<td />', { text : input_group, id : "cat-"+listCount });
        catTd.appendTo(newTr);

        var pnameTd = $('<td />', { text : input_title, id : "pname-"+listCount });
        pnameTd.appendTo(newTr);

        var rnameTd = $('<td />', { text : "-", id : "rname-"+listCount });
        rnameTd.appendTo(newTr);

        var dateTd = $('<td />', { text : "- ~ -", id : "date-"+listCount });
        dateTd.appendTo(newTr);

        var btn = $('<input />', {
          type : "button",
          value : "삭제",
          id : "btn-"+result.length,
          class : "bttn-simple bttn-md bttn-yes",
          click : function() { tableBtnClicked(this); }
        });
        var btnTd = $('<td />');
        $(btn).appendTo(btnTd);
        $(btnTd).appendTo(newTr);
        $(newTr).appendTo("#mainTable");
        listCount++;
        addCancel();
      },
      error : function(){
        alert("물품 데이터를 찾을 수 없습니다.");
      }
    });
  }

  // Table Clear
  function clearTable(){
    for(var i=0; i<listCount; i++){
      $("#line-"+i).remove();
      console.log("remove line"+i);
    }
    listCount = 0;
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
    addCancel();
  }

  $("#btn-addCancel").click(addCancel);
  $("#btn-login").click(loginSubmit);
  $("#btn-add").click(addClicked);
  $("#btn-main").click(mainClicked);
  $("#btn-search").click(searchClicked);
  $("#srch").click(searchTable);
  $("#add").click(addSubmit);
  $("#logout").click(logOutClicked);
});
