$("#add").css("display","none");
$("#btn-imageCancel").css("display","none");
$(document).ready(function(){
  var listCount = 0;
  var delayCount = 0;
  var memberCount = 0;
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

    var m_url="http://34.87.29.227/Tangerine-Tangerine/main.html#";

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
      var conf = confirm("현재 대여중인 물품입니다. 자동 반납처리 하시겠습니까?");
      if(conf) { autoReturn(idx); }
    } else{
      var conf = confirm("정말 삭제하시겠습니까?");
      if(conf){ deleteLine(idx); }
      else { alert("취소되었습니다"); }
    }
  }

  // 자동 반납처리 함수
  function autoReturn(idx){
    $("#rname-"+idx).text("-");
    $("#date-"+idx).text("- ~ -");
    $("#date-"+idx).attr("dateOver",false);
    $("#date-"+idx).attr("endDate","-");
    $("#btn-"+idx).attr("class","bttn-simple bttn-md bttn-yes");
    $("#btn-"+idx).attr("value","삭제");


    $.ajax({
      url : "data/Data.json",
      success : function(result) {
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
        alert("자동 반납처리 되었습니다.");
      }
    });
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
          $("#imgsrc-"+i).attr("id","imgsrc-"+newIdx);
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
            id : "pname-"+i,
            class : "pnames",
            click : function() { imageDivLoad(this); }
          });
          pnameTd.appendTo(loadTr);

          var srcVal = $('<input />', {
            type : "hidden",
            id : "imgsrc-"+i,
            value : result[i][8],
          })
          $(srcVal).appendTo(pnameTd);

          var rnameTd = $('<td />', {
            text : result[i][3],
            id : "rname-"+i
          });
          rnameTd.appendTo(loadTr);

          var date = result[i][4] + " ~ " + result[i][5];
          var dateTd = $('<td />', {
            text : date,
            id : "date-"+i,
            dateOver : dateOverChecker(result[i][5]),
            endDate : result[i][5]
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

  // 날짜 비교
  function dateOverChecker(day){
    var dayString = String(day).split('.');
    var presentDate = new Date();
    var endDate = new Date(parseInt("20"+dayString[0]), parseInt(dayString[1])-1, parseInt(dayString[2])-1);

    if(presentDate.getTime() > endDate.getTime()){ return true; }

    return false;
  }

  // Add 메뉴 클릭
  function addClicked(){
    if($("#qrcreate").css("display")=="none"){
      $("#qrcreate").css("display","block");
      pageBlur();
    }
  }

  // Add 취소
  function addCancel(){
    pageUnblur();
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
          },
          error : function() { alert("uploads error"); }
        });
        var newTr = $('<tr />', { id : "line-" + listCount });

        var indexTd = $('<td />', { text : listCount , id : "index-"+listCount });
        $(indexTd).appendTo(newTr);

        var catTd = $('<td />', { text : input_group, id : "cat-"+listCount });
        $(catTd).appendTo(newTr);

        var pnameTd = $('<td />', {
          text : input_title, id : "pname-"+listCount,
          click : function() { imageDivLoad(this); }
        });
        $(pnameTd).appendTo(newTr);

        var srcVal = $('<input />', {
          type : "hidden",
          id : "imgsrc-"+listCount,
          value : imgSrc
        })
        $(srcVal).appendTo(pnameTd);

        var rnameTd = $('<td />', { text : "-", id : "rname-"+listCount });
        $(rnameTd).appendTo(newTr);

        var dateTd = $('<td />', { text : "- ~ -", id : "date-"+listCount });
        $(dateTd).appendTo(newTr);

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
    }
    listCount = 0;
  }

  // Search Div Load
  function searchClicked(){
    if( $("#search").css("display") == "none" ){
      $("#search").css("display","block");
    }
    else{
      $("#srch").val("");
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
    pageUnblur();
    revertTable();
    $("#srch").val("");
    $("#search").css("display","none");
    addCancel();
  }

  // QR image load
  function imageDivLoad(obj){3
    pageBlur();
    var objId = String($(obj).attr("id"));
    var idxArr = objId.split("-");
    var idx = Number(idxArr[1]);

    $("#img_qr").attr("src",$("#imgsrc-"+idx).attr("value"));
    $("#div_qrimage").css("display","block");
    $("#btn-imageCancel").css("display","block");
  }

  // QR image Cancel
  function imageCancel(){
    pageUnblur();
    $("#img_qr").attr("src","");
    $("#div_qrimage").css("display","none");
      $("#btn-imageCancel").css("display","none");
  }

  // Page Blur
  function pageBlur(){
    $("#menu").css({'filter' : 'blur(5px)'});
    $("#goods").css({'filter' : 'blur(5px)'});
    $("#search").css({'filter' : 'blur(5px)'});
  }

  // Page unblur
  function pageUnblur(){
    $("#menu").css({'filter' : 'blur(0px)'});
    $("#goods").css({'filter' : 'blur(0px)'});
    $("#search").css({'filter' : 'blur(0px)'});
  }

  // DelayList 표시
  function popDelayList(){
    $("#div_delayList").css("display","block");
    delaylistLoad();
    pageBlur();
  }

  // DelayList Table load
  function delaylistLoad(){
    for(var i=0; i<listCount; i++){
      if(String($("#date-"+i).attr("dateOver"))=="true"){
        delayCount++;
        var nLine = $('<tr />' , {
          id : "delay_line-"+i,
          class : "delayLine"
        });

        var nIndex = $('<td />', {
          text : i,
          id : "delay_index-"+i,
          class : "n"
        });
        $(nIndex).appendTo(nLine);

        var nPname = $('<td />', {
          text : $("#pname-"+i).text(),
          id : "delay_pname-"+i,
          class : "na"
        });
        $(nPname).appendTo(nLine);

        var nRname = $('<td />', {
          text : $("#rname-"+i).text(),
          id : "delay_rname-"+i
        });
        $(nRname).appendTo(nLine);

        var nBtn = $('<input />', {
          type : "button",
          value : "메일 발송",
          id : "nBtn-"+i,
          class : "bttn-simple bttn-md bttn-yes",
          click : function() { sendDelayMail(this); }
        });
        var nBtnTd = $('<td />', {
          class : "e"
        });
        $(nBtn).appendTo(nBtnTd);
        $(nBtnTd).appendTo(nLine);
        $(nLine).appendTo("#table_delayList");

      }
    }
  }

  // DelayList Table delete
  function clearDelayDiv(){
    $(".delayLine").remove();
    delayCount = 0;
  }

  // DelayList Close
  function closeDelayDiv(){
    clearDelayDiv();
    pageUnblur();
    $("#div_delayList").css("display","none");
  }

  // mail Send 함수
  function sendDelayMail(obj){
    var objId = $(obj).attr("id");
    var idxArr = objId.split("-");
    var idx = Number(idxArr[1]);
    var name = $("#rname-"+idx).text();
    var toAddress = "-";
    var dateString = String($("#date-"+idx).attr("endDate"));
    var dateArray = dateString.split(".");
    var addressUpdated = false;

    $.ajax({
      url : "data/SPG_MEMBER.json",
      async : false,
      success : function (result) {
        for(var i=0; i<result.length; i++){
          if(result[i][0]==name){ toAddress = result[i][1]; addressUpdated = true; }
        }
      },
      error : function () { alert("Member List Load Error!"); }
    });

    $.ajax({
      url : 'sendDelayMail.php',
      type : 'POST',
      data : {
        mailAddress : toAddress,
        endDate : "20"+dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2],
        pname : $("#pname-"+idx).text()
      },
      success : function() { alert("안내 메일 전송을 완료했습니다"); },
      error : function() { alert("메일 전송에 실패했습니다."); }
    });
  }

  // member Div load
  function memberDivLoad(){
    $("#div_memberManage").css("display","block");
    pageBlur();
    loadMemberTable();
  }

  // memberTable load
  function loadMemberTable(){
    $.ajax({
      url : "data/SPG_MEMBER.json",
      success : function(result) {
        for(var i=0; i<result.length; i++){
          memberCount++;
          var loadTr = $('<tr />', {
            id : "memberLine-" + i,
            class : "memberLineArr"
          });

          var memberNameTd = $('<td />', {
            text : result[i][0],
            id : "memberName-"+i,
            class : "nm"
          });
          memberNameTd.appendTo(loadTr);

          var memberMailTd = $('<td />', {
            text : result[i][1],
            id : "memberMail-"+i,
            class : "em",
          });
          memberMailTd.appendTo(loadTr);

          var btnTd = $('<td />',{
            class : "dels"
          });
          var memberBtn = $('<input />', {
            type : "button",
            value : "삭제",
            id : "memberBtn-"+i,
            class : "bttn-simple bttn-md bttn-yes",
            click : function() { memberDeleteSubmit(this); }
          });
          $(memberBtn).appendTo(btnTd);
          $(btnTd).appendTo(loadTr);

          $(loadTr).appendTo("#table_memberList");
        }
      }
    });
  }

  // member Div Cancel
  function memberDivCancel(){
    $("#div_memberManage").css("display","none");
    $(".memberLineArr").remove();
    memberCount = 0;
    pageUnblur();
  }

  // member delete
  function memberDeleteSubmit(obj){
    var conf = confirm("해당 멤버를 정말 삭제하시겠습니까?")
    if(conf) {
      var objId = $(obj).attr("id");
      var idxArr = objId.split("-");
      var idx = Number(idxArr[1]);
      $("#memberLine-"+idx).remove();
      memberCount--;

      var newArr = new Array();
      $.ajax({
        url : "data/SPG_MEMBER.json",
        success : function(result) {
          newArr = result;
          newArr.splice(idx,1);
          var sendFile = JSON.stringify(newArr);
          $.ajax({
            url : "member_uploads.php",
            type : 'POST',
            data : { sendFile : sendFile },
            success : function() { alert("멤버 목록 제거가 완료되었습니다."); },
            error : function() { alert("upload error"); }
          });
        }
      });
    } else {
      alert("취소되었습니다");
    }
  }

  // member Add Div load
  function memberAddClicked(){
    $("#div_memberAdd").css("display","block");
  }

  // member add
  function memberAddSubmit(){
    $("#div_memberAdd").css("display","none");
    var input_Name = $("#input_memberName").val();
    var input_Email = $("#input_memberEmail").val();

    var newArr = new Array();
    var newIdx;
    $.ajax({
      url : "data/SPG_MEMBER.json",
      async : false,
      success : function(result) {
        newIdx = result.length;
        newArr = result;
        var newArr_Sub = new Array();
        newArr_Sub.push(String(input_Name));
        newArr_Sub.push(String(input_Email));
        newArr.push(newArr_Sub);
        var sendFile = JSON.stringify(newArr);
        $.ajax({
          url : "member_uploads.php",
          type : 'POST',
          data : { sendFile : sendFile },
          success : function() { alert("추가가 완료되었습니다."); },
          error : function() { alert("upload error"); }
        });
      },
      error : function() { alert("멤버 목록을 찾을 수 없습니다."); }
    });

    memberCount++;
    var newTr = $('<tr />', {
      id : "memberLine-" + newIdx,
      class : "memberLineArr"
    });

    var memberNameTd = $('<td />', {
      text : input_Name,
      id : "memberName-"+newIdx
    });
    memberNameTd.appendTo(newTr);

    var memberMailTd = $('<td />', {
      text : input_Email,
      id : "memberMail-"+newIdx
    });
    memberMailTd.appendTo(newTr);

    var btnTd = $('<td />');
    var memberBtn = $('<input />', {
      type : "button",
      value : "삭제",
      id : "memberBtn-"+newIdx,
      class : "bttn-simple bttn-md bttn-yes",
      click : function() { memberDeleteSubmit(this); }
    });
    $(memberBtn).appendTo(newTr);
    $(btnTd).appendTo(newTr);
    $(newTr).appendTo("#table_memberList");
  }

  // member add close
  function memberAddClose(){
    $("#div_memberAdd").css("display","none");
    $("#input_memberName").val("");
    $("#input_memberEmail").val("");
  }



  $("#btn-addCancel").click(addCancel);
  $("#btn-login").click(loginSubmit);
  $("#btn-add").click(addClicked);
  $("#btn-main").click(mainClicked);
  $("#btn-search").click(searchClicked);
  $("#btn-searchSubmit").click(searchTable);
  $("#add").click(addSubmit);
  $("#logout").click(logOutClicked);
  $("#btn-imageCancel").click(imageCancel);
  $("#btn-delay").click(popDelayList);
  $("#btn-member").click(memberDivLoad);
  $("#btn-delayListClose").click(closeDelayDiv);
  $("#btn-memberDivCancel").click(memberDivCancel);
  $("#btn-memberAdd").click(memberAddClicked);
  $("#btn-memberAddCancel").click(memberAddClose);
  $("#btn-memberAddSubmit").click(memberAddSubmit);
});
