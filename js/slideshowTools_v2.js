/*!
 * Slideshow Tools Library v2.0.0
 *
 * Date: 2023-03-12T08:00Z
 */

var slideShowObjects;
slideShowObjects=JSON.parse("[]");

(function($) {
  $(document).ready(function(){
    // ajout du listener
    $.getJSON('slideshowDataDemo.json', function(data) {         
        slideShowDatas = data;
        google.charts.load("current", {packages:["timeline"]});
        fillSlideShow();
        $('#timelines').show();
    });  
  });
})(jQuery);

var openFile = function(event) {
        var input = event.target;
        var reader = new FileReader();
        reader.onload = function(){
          slideShowObjects = JSON.parse(reader.result);
          google.charts.load("current", {packages:["timeline"]});
          fillSlideShow();
          $('#timelines').show();
        };
          reader.readAsText(input.files[0]);
};

function fillSlideShow(){
    var div_data='<table><th></th><th>N°</th><th>File</th><th>Coming at</th><th>Actions</th>';
    var cpt=0;
    slideShowObjects.forEach(slideShowObjects => div_data+=printSlideShowData(slideShowObjects,cpt++));
    div_data+='</table>';
    $('#slideShow').html(div_data); 
    $('#slideShow').show(); 
    drawChart() ;
}

function calculeAnimationTime(){
  var animationTime=0;
  slideShowObjects.filter(slideShowObject => slideShowObject["duration"] !=null).forEach(slideShowObject => animationTime+=parseFloat(slideShowObject["duration"]));
  slideShowObjects.filter(slideShowObject => parseFloat(getEndTime(slideShowObject["file"]))>0 && slideShowObject["media"]=="mp4").forEach(slideShowObject => animationTime+=getDuration(slideShowObject.file));
  return animationTime;
}

function toDateTime(secs) {
    var t = new Date(0,0,0,0,0,0);
    t.setSeconds(secs);
    return t;
}

var time=0;
var timeCpt=-1;
function  buildData(slideShowObject) {
  var startTime=time;
   timeCpt++;
    if (slideShowObject["duration"] !=null){
      time+=parseFloat(slideShowObject["duration"]);
    } else if (slideShowObject["media"]=="mp4"){
      time+=getDuration(slideShowObject.file);
    } else{
       return [ slideShowObject.media ,timeCpt+':'+ getFilename(slideShowObject.file),toDateTime(startTime), toDateTime(startTime+getDuration(slideShowObject.file))];
    } 
    if (slideShowObject["media"]=="txt"){
      return [ slideShowObject.media ,timeCpt+':'+ slideShowObject.name, toDateTime(startTime),  toDateTime(time)];
    }
    return [ slideShowObject.media ,timeCpt+':'+ getFilename(slideShowObject.file), toDateTime(startTime),  toDateTime(time)];
}

function showTimeLine(){
   drawChart();
   $('#timelines').toggle();
}

function drawChart(){

    var container = document.getElementById('timelineDiv');
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'string', id: 'Media' });
    dataTable.addColumn({ type: 'string', id: 'Filename' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });
    
    var currentData=[];
    time=0;
    timeCpt=-1;
    slideShowObjects.forEach(object => currentData.push(buildData(object)));
    dataTable.addRows( currentData);
   /* dataTable.addRows([
      [ 'Music', 'Beginning JavaScript',       new Date(0,0,0,0,0,0),  new Date(0,0,0,0,0,30) ],
      [ 'Image', 'Intermediate JavaScript',    new Date(0,0,0,0,0,0),  new Date(0,0,0,0,0,10) ],
      [ 'Texte', 'Advanced JavaScript',        new Date(0,0,0,0,0,10),  new Date(0,0,0,0,0,20) ],
      [ 'Video',   'Advanced Google Charts',   new Date(0,0,0,0,0,20), new Date(0,0,0,0,1,0) ]]);
          */
    var options = {
      timeline: { showBarLabels: false,  rowLabelStyle: { fontSize: 11 }, barLabelStyle: { fontSize: 6 }  },
      height: 180,
      width: 10000,
      hAxis: {format: 'mm:ss'},
      colors: ['blue', 'red', 'green'],
      chartArea: { top: 20, height: '70%' }
    };
    chart.draw(dataTable, options);
    $('#timelineDiv div div div').attr({'style': 'position: absolute; left: 15px; top: 10px; width: 100%; height: 100%;'})
    $('#timelineDiv div div div svg g:first text').attr({'x':25,"text-anchor":"end"})

    google.visualization.events.addListener(chart, 'select', function() {
      var row = chart.getSelection()[0].row;
      var elt;
      var cpt=dataTable.getValue(row, 1).split(":")[0];
      $('#icon'+cpt).attr({'style': 'color:yellow;'});
      setTimeout(function() {
            $('#icon'+cpt).attr({'style': 'color:green;'});
        }, 1000);
      if (dataTable.getValue(row, 0)=='mp3' || dataTable.getValue(row, 0)=='mp4'){
        elt= '#startFile'+cpt;
      } else {
        elt= '#durationFile'+cpt;
      }
      $(elt).focus();
  });
}


function printSlideShowData(slideShowObject,cpt){
  var line='';
  switch (slideShowObject.media)
  {
    case "mp3":
         line+='<td><i id="icon'+cpt+'" class="fa fa-file-audio-o fa-1x" ></i></td><td>'+cpt+'</td><td>'+getFilename(slideShowObject.file)+'</td>';
         break;
    case "mp4":
         line+='<td><i id="icon'+cpt+'"class="fa fa-file-movie-o fa-1x" ></i></td><td>'+cpt+'</td><td>'+getFilename(slideShowObject.file)+'</td>';
         break;
    case "img":
         line+='<td><div class="tooltip"><i id="icon'+cpt+'"class="fa fa-file-photo-o fa-1x" ></i><span class="tooltiptext">';
         line+='<img width="100" heigth="100" src="'+slideShowObject.file+'"></span></div></td>';
         line+='<td>'+cpt+'</td><td>'+getFilename(slideShowObject.file)+'</td>';
         break;
    case "txt":
         line+='<td><i id="icon'+cpt+'"class="fa fa-file-text-o fa-1x" ></i></td><td>'+cpt+'</td><td>'+slideShowObject.name+'</td>';
         break; 
    defaut:
         break;    
  }
  line+='<td><input type="time" step="1" min="00:00:00" max="24:00:00" size="1" id="comingAt'+cpt+'" value="' + afficheTemps(slideShowObject.comingAt) +'"/></td>';
  line+='<td>';
  line+='&nbsp;<a class="js-open-modal btn" href="#" title="Save" onclick="changeComingAt('+cpt+');"><i class="fa fa-save fa-1x" ></i></a>';
  line+='&nbsp;<a class="js-open-modal btn" href="#" title="Modify Effect" onclick="updateAnimation('+cpt+');"><i class="fa fa-film fa-1x" ></i></a>';
  line+='&nbsp;<a class="js-open-modal btn" href="#" title="Play" onclick="runAnimation('+cpt+');"><i class="fa fa-play-circle fa-1x" ></i></a>';
  line+='&nbsp;&nbsp;<a class="js-open-modal btn" href="#" title="Remove" onclick="removeAnimation('+cpt+');"><i class="fa fa-times-circle fa-1x" style="color:red;"></i></a></td>';
  
  return '<tr>'+line+'</tr>';
}

function changeSaveallColorRed(){
  $("#isaveall").attr({'style': 'color:red;'});
}

function getFilePath(file){ 
  return  file.split('#t=')[0];
}

function getFilename(file){
  if (file.split('#t=')[0].split('\/').length<2){
    return file.split('#t=')[0];
  }
  return  file.split('#t=')[0].split('\/')[1];
}

function getDuration(file){
    return parseFloat(toSecond(getEndTime(file)))-parseFloat(toSecond(getStartTime(file)));
}

function getStartTime(file){
  if (file.split('#t=').length<2){
    return 0;
  }
  var temps=file.split('#t=')[1].split(',')[0];
  return  afficheTemps(temps);
}

function getEndTime(file){
  if (file.split('#t=').length<2){
    return '';
  }
  var temps=file.split('#t=')[1].split(',')[1];
  return  afficheTemps(temps);

}
function afficheTemps(temps){
  var heures= Math.floor(temps/3600);
  var minutes = Math.floor((temps%3600)/60);
  var secondes = Math.floor((temps%3600)%60);
  return  (heures<10?"0"+heures:heures)+":"+(minutes<10?"0"+minutes:minutes)+":"+(secondes<10?"0"+secondes:secondes);
}

function toSecond(mmss){
  if (mmss.split(':').length<2){
    return mmss;
  }
  if (mmss.split(':').length<3){
    return mmss.split(':')[0]*60 + mmss.split(':')[1]*1;;
  }
  return mmss.split(':')[0]*3600+mmss.split(':')[1]*60 + mmss.split(':')[2]*1;
}

$('a[set-slideshow-id]').click(function(e) {
   id =$('#idSlideShow').val();
});


function removeAnimation(id){
  slideShowObjects.splice(id, 1);
  changeSaveallColorRed();
  fillSlideShow();
}

function sortslideShowObjects(){
  slideShowObjects.sort(function compare(a, b) {
    if (a.comingAt < b.comingAt)
      return -1;
    if (a.comingAt > b.comingAt )
      return 1;
    return 0;
  });
}

function addAnimationObject(){
  var dataToAdd={};
  if ($("#objectId").val()>-1){//Update
    dataToAdd=slideShowObjects[$("#objectId").val()];
  } else {//Creation
    if ($("#objectMedia").val()!="txt"){
      var folder="";
      if ($("#objectMedia").val()=="mp4"){
        folder="videos/";
      } else if ($("#objectMedia").val()=="mp3"){
        folder="musics/";
      } else if ($("#objectMedia").val()=="img"){
        folder="photos/";
      }
      dataToAdd["file"]=folder+$("#objectFile")[0].files[0].name;
    }
  }
  if ($("#objectMedia").val()=="txt"){
    dataToAdd["txt"]=$("#objectTextarea").html();
    dataToAdd["fontFamily"]=$("#fontFamily").val();
    dataToAdd["fontColor"]=$("#fontColor").val();
    dataToAdd["fontSize"]=$("#fontSize").val();
    dataToAdd["textAlign"]=getTextFontAlign();
    dataToAdd["fontStyle"]=getTextFontStyle();
    dataToAdd["fontWeight"]=getTextFontWeight();
    dataToAdd["textDecoration"]=getTextDecoration();
  }
  if ($("#objectMedia").val()=="mp4" || $("#objectMedia").val()=="mp3"){
    dataToAdd["file"]= getFilePath(dataToAdd["file"])+'#t='+ toSecond($('#objetStartFile').val()) +','+toSecond($('#objectEndFile').val());
  }
  dataToAdd["name"]=$("#objectName").val();
  dataToAdd["media"]=$("#objectMedia").val();
 
  dataToAdd["width"]=$("#objectWidth").val();
  dataToAdd["height"]=$("#objectHeight").val();
  dataToAdd["top"]=$("#objectTop").val();
  dataToAdd["left"]=$("#objectLeft").val();
  dataToAdd["z-index"]=$("#objectZindex").val();
  dataToAdd["comingAt"]=toSecond($("#objetComingTime").val());
  dataToAdd["duration"]=toSecond($("#objetDuration").val());
  dataToAdd["volume"]=$("#objectVolume").val();
  dataToAdd["styleEffect"]=$("#objectStyleEffect").val();
  dataToAdd["comeInEffect"]=$("#objectComeInEffect").val();
  dataToAdd["comeOutEffect"]=$("#objectComeOutEffect").val();

  if ($("#objectId").val()<0){
    slideShowObjects.push(dataToAdd);
  }
  $("#divObject").hide();
  sortslideShowObjects();
  changeSaveallColorRed();
  fillSlideShow();
}

function updateAnimation(id){
  $("#objectId").val(id);
  $("#objectName").val(slideShowObjects[id]["name"]);
  $("#objectMedia").val(slideShowObjects[id]["media"]).change();
  $("#objectWidth").val(slideShowObjects[id]["width"]);
  $("#objectHeight").val(slideShowObjects[id]["height"]);
  $("#objectTop").val(slideShowObjects[id]["top"]);
  $("#objectLeft").val(slideShowObjects[id]["left"]);
  $("#objectZindex").val(slideShowObjects[id]["z-index"]);
  $("#objetComingTime").val(afficheTemps(slideShowObjects[id]["comingAt"]));
  
  if (slideShowObjects[id]["media"]=="mp4" || slideShowObjects[id]["media"]=="mp3"){
    $("#objetStartFile").val(getStartTime(slideShowObjects[id]["file"]));
    $("#objectEndFile").val(getEndTime(slideShowObjects[id]["file"]));
    $("#objectVolume").val(slideShowObjects[id]["volume"]);
  } else {
    $("#objetDuration").val(afficheTemps(slideShowObjects[id]["duration"]));
  }
  
  $("#objectStyleEffect").val(slideShowObjects[id]["styleEffect"]).change();
  $("#objectComeInEffect").val(slideShowObjects[id]["comeInEffect"]).change();
  $("#objectComeOutEffect").val(slideShowObjects[id]["comeOutEffect"]).change();
  if (slideShowObjects[id]["media"]=="txt"){
    $("#objectTextarea").html(slideShowObjects[id]["txt"]);
    $("#fontFamily").val(slideShowObjects[id]["fontFamily"]);
    $("#fontColor").val(slideShowObjects[id]["fontColor"]);
    $("#fontSize").val(slideShowObjects[id]["fontSize"]);
    $("#objectTextBold").css("color",slideShowObjects[id]["fontWeight"]=='bold'?"green":"grey");
    $("#objectTextItalic").css("color",slideShowObjects[id]["fontStyle"]=='italic'?"green":"grey");
    $("#objectTextUnderline").css("color",slideShowObjects[id]["textDecoration"]=='underline'?"green":"grey");
    $("#objectTextLeft").css("color",slideShowObjects[id]["textAlign"]=='left'?"green":"grey");
    $("#objectTextCenter").css("color",slideShowObjects[id]["textAlign"]=='center'?"green":"grey");
    $("#objectTextRight").css("color",slideShowObjects[id]["textAlign"]=='right'?"green":"grey");
  }
  $("#divObject").show();
}

function addNewAnimation(){
  $("#objectId").val(-1);
  $("#objectName").val("");
  $("#objectMedia").val("img").change();
  $("#objectWidth").val(1260);
  $("#objectHeight").val(720);
  $("#objectTop").val(0);
  $("#objectLeft").val(0);
  $("#objectZindex").val(1);
  $("#objetComingTime").val(afficheTemps(0));
  $("#objetDuration").val(afficheTemps(5));
  $("#objectVolume").val(100);
  $("#objectStyleEffect").val("imageEffectNone").change();
  $("#objectComeInEffect").val("comeInEffectNone").change();
  $("#objectComeOutEffect").val("comeOutEffectNone").change();
  $("#divObject").show();
}



function changeComingAt(id){
  var comingAt="#comingAt"+id;
  slideShowObjects[id].comingAt=toSecond($(comingAt).val());
  sortslideShowObjects();
  changeSaveallColorRed();
  fillSlideShow();
}

function createObjectText(slideShowObject){
  var elem = document.createElement("div");
  elem.id= slideShowObject["name"];
  elem.innerHTML+=slideShowObject["txt"];
  //border: solid red;
  elem.style.cssText = addStyleText(slideShowObject);
  document.getElementById("previewSlideShow").appendChild(elem);
}

function createObjectVideo(slideShowObject){
  var elem = document.createElement("video");
  elem.id= slideShowObject["name"];
  elem.src=slideShowObject["file"];
  elem.style.cssText = addStyle(slideShowObject);
  document.getElementById("previewSlideShow").appendChild(elem);
}

function createObjectImage(slideShowObject){
  var elem = document.createElement("img");
  elem.id= slideShowObject["name"];
  elem.src=slideShowObject["file"];
  elem.style.cssText = addStyle(slideShowObject);
  document.getElementById("previewSlideShow").appendChild(elem);
 
}
function createObjectMusic(slideShowObject){
  var elem = document.createElement("audio");
  elem.id= slideShowObject["name"];
  elem.src=slideShowObject["file"];
  elem.style.cssText = addStyle(slideShowObject);
  document.getElementById("previewSlideShow").appendChild(elem);
}

function addStyle(slideShowObject){
  objectTop=slideShowObject["top"]/2;
  objectLeft=slideShowObject["left"]/2;
  objectWidth=slideShowObject["width"]/2;
  objectHeight=slideShowObject["height"]/2;
  return 'display:none;object-fit:contain;position:absolute;top:'
    +objectTop+'px;left:'
    +objectLeft+'px;width:'
    +objectWidth+'px;height:'
    +objectHeight+'px;z-index:'
    +slideShowObject["z-index"]+';';
}

function addStyleText(slideShowObject){
  objectFontsize=slideShowObject["fontSize"]/2;
  return addStyle(slideShowObject)
    +'font-size:'+objectFontsize+'px;'
    +'font-family:'+slideShowObject["fontFamily"]+';'
    +'color:'+slideShowObject["fontColor"]+';'
    +'text-align:'+slideShowObject["textAlign"]+';'
    +'font-weight:'+slideShowObject["fontWeight"]+';'
    +'font-style:'+slideShowObject["fontStyle"]+';'
    +'text-decoration:'+slideShowObject["textDecoration"]+';';
}

function boldText(){
  switchIconColor($("#objectTextBold"));
}
function italicText(){
  switchIconColor($("#objectTextItalic"));
}
function underlineText(){
  switchIconColor($("#objectTextUnderline"));
}
function alignLeftText(){
  switchIconColor($("#objectTextLeft"));
  $("#objectTextCenter").css("color", "grey");
  $("#objectTextRight").css("color", "grey");
}
function alignCenterText(){
  switchIconColor($("#objectTextCenter"));
  $("#objectTextLeft").css("color", "grey");
  $("#objectTextRight").css("color", "grey");
}
function alignRightText(){
  switchIconColor($("#objectTextRight"));
  $("#objectTextCenter").css("color", "grey");
  $("#objectTextLeft").css("color", "grey");
}

function switchIconColor(objectIcone){
  if ('rgb(128, 128, 128)'==objectIcone.css("color")){
    objectIcone.css("color", "green");
  }else{
    objectIcone.css("color", "grey");
  }
}

function getTextFontAlign(){
  if ('rgb(128, 128, 128)'!=$("#objectTextCenter").css("color")){
    return "center";
  }
  if ('rgb(128, 128, 128)'!=$("#objectTextRight").css("color")){
    return "right";
  } 
  return "left";
}

function getTextFontWeight(){
  if ('rgb(128, 128, 128)'!=$("#objectTextBold").css("color")){
    return "bold";
  }
  return "normal";
}

function getTextFontStyle(){
  if ('rgb(128, 128, 128)'!=$("#objectTextItalic").css("color")){
    return "italic";
  }
  return "normal";
}

function getTextDecoration(){
  if ('rgb(128, 128, 128)'!=$("#objectTextUnderline").css("color")){
    return "underline";
  }
  return "normal";
}


function previewText(){
  var dataToAdd={};
  
  dataToAdd["txt"]=$("#objectTextarea").html();
  dataToAdd["fontFamily"]=$("#fontFamily").val();
  dataToAdd["fontColor"]=$("#fontColor").val();
  dataToAdd["fontSize"]=$("#fontSize").val();
  dataToAdd["name"]=$("#objectName").val();
  dataToAdd["media"]=$("#objectMedia").val();
 
  dataToAdd["width"]=$("#objectWidth").val();
  dataToAdd["height"]=$("#objectHeight").val();
  dataToAdd["top"]=$("#objectTop").val();
  dataToAdd["left"]=$("#objectLeft").val();
  dataToAdd["z-index"]=$("#objectZindex").val();
  dataToAdd["comingAt"]=1;
  dataToAdd["duration"]=toSecond($("#objetDuration").val());
  dataToAdd["volume"]=$("#objectVolume").val();
  dataToAdd["styleEffect"]=$("#objectStyleEffect").val();
  dataToAdd["comeInEffect"]=$("#objectComeInEffect").val();
  dataToAdd["comeOutEffect"]=$("#objectComeOutEffect").val();
  dataToAdd["textAlign"]=getTextFontAlign();
  dataToAdd["fontStyle"]=getTextFontStyle();
  dataToAdd["fontWeight"]=getTextFontWeight();
  dataToAdd["textDecoration"]=getTextDecoration();

  createObjectText(dataToAdd);
  runObjectAnimation(dataToAdd);
}


function runObjectAnimation(slideShowObject){
  console.log(slideShowObject["name"]);
  var elem= document.getElementById(slideShowObject["name"]);
  setTimeout(function() { 
    console.log(slideShowObject["name"]+" show");
    var id="#"+elem.id;
    var duration=slideShowObject["duration"];
    if (slideShowObject["media"]=="mp4" || slideShowObject["media"]=="mp3"){
      duration=getDuration(slideShowObject["file"]);
      $(id)[0].load();
      volume=slideShowObject["volume"]==undefined ?1:slideShowObject["volume"]/100;
      $(id).get(0).volume=volume;//0.0 to 1.0
      $(id).get(0).play();
    } 
    if (slideShowObject["media"]!="mp3") {
      $(id).show();
      $(id).addClass(slideShowObject["comeInEffect"]);
    }
    setTimeout(function() {    
      console.log(slideShowObject["name"]+" remove");
      $(id).hide();
      document.getElementById("previewSlideShow").removeChild(elem);
    }, duration*1000);
  }, slideShowObject["comingAt"]*1000);  
  return elem;
}

function runAnimation(id){
  var slideShowObject = slideShowObjects[id];
  slideShowObject["comingAt"]=1;
  createAndRunAnimation(slideShowObject);
}

function createAndRunAnimation(slideShowObject){
  if (slideShowObject["media"]=="img"){
    createObjectImage(slideShowObject);
  } else if (slideShowObject["media"]=="txt"){
    createObjectText(slideShowObject);
  } else if (slideShowObject["media"]=="mp4"){
    createObjectVideo(slideShowObject);
  } else if (slideShowObject["media"]=="mp3"){
    createObjectMusic(slideShowObject);
  }
  runObjectAnimation(slideShowObject);
}

function playAllAnimation(){
  slideShowObjects.forEach(slideShowObject => createAndRunAnimation(slideShowObject));
  return "Let's go !"
}

function saveAllAnimation(){
  downAll(JSON.stringify(slideShowObjects),'slideShowObjects-'+Date.now()+'.json','application/json');
  $("#isaveall").attr({'style':'color:green;'});
}

function changeMedia(){
  $("#divConfigurationText").hide();
  $("#divConfigurationVideoAudio").hide();
  $("#divConfigurationPosition").hide();
  $("#divConfigurationImageEffect").hide();
  $("#divConfigurationEffect").hide();
  $("#divConfigurationFile").hide();
  $("#divConfigurationDuration").hide();
    
  if ($("#objectMedia").val()=="mp3"){
    $("#divConfigurationFile").show();
    $("#divConfigurationVideoAudio").show();
  }
  if ($("#objectMedia").val()=="mp4"){
    $("#divConfigurationFile").show();
    $("#divConfigurationPosition").show();    
    $("#divConfigurationVideoAudio").show();
    $("#divConfigurationEffect").show();
  }
  if ($("#objectMedia").val()=="img"){
    $("#divConfigurationFile").show();
    $("#divConfigurationDuration").show();
    $("#divConfigurationPosition").show();
    $("#divConfigurationImageEffect").show();
    $("#divConfigurationEffect").show();
  } 
  if ($("#objectMedia").val()=="txt"){
    $("#divConfigurationText").show();
    $("#divConfigurationPosition").show();
    $("#divConfigurationEffect").show();
    $("#divConfigurationDuration").show();
  }   
}

function downAll(data, filename, mime) {
  var blobData = [data];
  var blob = new Blob(blobData, {type: mime || 'application/octet-stream'});
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
      // IE workaround for "HTML7007: One or more blob URLs were
      // revoked by closing the blob for which they were created.
      // These URLs will no longer resolve as the data backing
      // the URL has been freed."
      window.navigator.msSaveBlob(blob, filename);
  }
  else {
      var blobURL = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob);
      var tempLink = document.createElement('a');
      tempLink.style.display = 'none';
      tempLink.href = blobURL;
      tempLink.setAttribute('download', filename);

      // Safari thinks _blank anchor are pop ups. We only want to set _blank
      // target if the browser does not support the HTML5 download attribute.
      // This allows you to download files in desktop safari if pop up blocking
      // is enabled.
      if (typeof tempLink.download === 'undefined') {
          tempLink.setAttribute('target', '_blank');
      }

      document.body.appendChild(tempLink);
      tempLink.click();

      // Fixes "webkit blob resource error 1"
      setTimeout(function() {
          document.body.removeChild(tempLink);
          window.URL.revokeObjectURL(blobURL);
      }, 200)
  }
}