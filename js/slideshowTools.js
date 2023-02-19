/*!
 * Slideshow Tools Library v1.0.0
 *
 * Date: 2021-03-19T08:00Z
 */
var slideShowDatas;

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
          slideShowDatas = JSON.parse(reader.result);
          google.charts.load("current", {packages:["timeline"]});
          fillSlideShow();
          $('#timelines').show();
        };
          reader.readAsText(input.files[0]);
        /*
        $('#video').get(0).addEventListener('pause', function(e) {
              $('#video').get(0).currentTime;
        });  
        */
        
      };
      

function fillSlideShow(){
    hideAll();
    var div_data='<table><th></th><th>File</th><th>Time in s</th><th>Actions</th>';
    var cpt=0;
    slideShowDatas.forEach(slideShowData => div_data+=printSlideShowData(slideShowData,cpt++));
    div_data+='</table>';
    $('#slideShow').html(div_data); 
    $('#slideShow').show(); 
    drawChart() ;
                                                                                         
}

function calculeAnimationTime(){
  var animationTime=0;
  slideShowDatas.filter(slideShowData => slideShowData["duration"] !=null).forEach(slideShowData => animationTime+=parseFloat(slideShowData["duration"]));
  slideShowDatas.filter(slideShowData => parseFloat(getEndTime(slideShowData["file"]))>0 && slideShowData["media"]=="mp4").forEach(slideShowData => animationTime+=getDuration(slideShowData.file));
  return animationTime;
}

function toDateTime(secs) {
    var t = new Date(0,0,0,0,0,0);
    t.setSeconds(secs);
    return t;
}

var time=0;
var timeCpt=-1;
function  buildData(slideShowData) {
  var startTime=time;
   timeCpt++;
    if (slideShowData["duration"] !=null){
      time+=parseFloat(slideShowData["duration"]);
    } else if (slideShowData["media"]=="mp4"){
      time+=getDuration(slideShowData.file);
    } else{
       return [ slideShowData.media ,timeCpt+':'+ getFilename(slideShowData.file),toDateTime(startTime), toDateTime(startTime+getDuration(slideShowData.file))];
    } 
    return [ slideShowData.media ,timeCpt+':'+ getFilename(slideShowData.file), toDateTime(startTime),  toDateTime(time)];
    
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
    slideShowDatas.forEach(object => currentData.push(buildData(object)));
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


function printSlideShowData(slideShowData,cpt){
  var line='';
  switch (slideShowData.media)
  {
    case "mp3":
         line+='<td><i id="icon'+cpt+'" class="fa fa-file-audio-o fa-2x" ></i></td><td>'+getFilename(slideShowData.file)+'</td>';
         line+='<td>start <input type="text" size="1" id="startFile'+cpt+'" value="' + getStartTime(slideShowData.file) +'"/>';
         line+=' end <input type="text" size="1" id="endFile'+cpt+'" value="' + getEndTime(slideShowData.file)+'"/></td>';
         break;
    case "mp4":
         line+='<td><i id="icon'+cpt+'"class="fa fa-file-movie-o fa-2x" ></i></td><td>'+getFilename(slideShowData.file)+'</td>';
         line+='<td>start <input type="text" size="1" id="startFile'+cpt+'" value="' + getStartTime(slideShowData.file) +'"/>';
         line+=' end <input type="text" size="1" id="endFile'+cpt+'" value="' + getEndTime(slideShowData.file)+'"/></td>';
         break;
    case "img":
         line+='<td><div class="tooltip"><i id="icon'+cpt+'"class="fa fa-file-photo-o fa-2x" ></i><span class="tooltiptext">';
         line+='<img width="100" heigth="100" src="'+slideShowData.file+'"></span></div></td>';
         line+='<td>'+getFilename(slideShowData.file)+'</td>';
         line+='<td>duration <input type="text" size="1" id="durationFile'+cpt+'" value="' + slideShowData.duration +'"/></td>';
         break;
    case "txt":
         line+='<td><i id="icon'+cpt+'"class="fa fa-file-text-o fa-2x" ></i></td><td>'+slideShowData.file+'</td>';
         line+='<td>duration <input type="text" size="1" id="durationFile'+cpt+'" value="' + slideShowData.duration +'"/>';
         line+=' <a class="js-open-modal btn" href="#" title="Modify Text" onclick="updateTextAnimation('+cpt+');"><i class="fa fa-pencil-square fa-2x" ></i></a></td>';
         break; 
    defaut:
         break;    
  }
  
  line+='<td>';
  line+='<a class="js-open-modal btn" href="#" title="up" onclick="moveUpAnimation('+cpt+');"><i class="fa fa-arrow-circle-up fa-2x" ></i></a>';
  line+='<a class="js-open-modal btn" href="#" title="down" onclick="moveDownAnimation('+cpt+');"><i class="fa fa-arrow-circle-down fa-2x" ></i></a>';
  line+='<a class="js-open-modal btn" href="#" title="Modify Effect" onclick="updateEffectAnimation('+cpt+');"><i class="fa fa-film fa-2x" ></i></a>';
  line+='<a class="js-open-modal btn" href="#" title="Save" onclick="saveAnimation('+cpt+');"><i class="fa fa-save fa-2x" ></i></a>';
  line+='<a class="js-open-modal btn" href="#" title="Remove" onclick="removeAnimation('+cpt+');"><i class="fa fa-times-circle fa-2x" style="color:red;"></i></a>';
  line+='<a class="js-open-modal btn" href="#" title="Play" onclick="runAnimation('+cpt+');"><i class="fa fa-play-circle fa-2x" ></i></a></td>';
  
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
    return parseFloat(getEndTime(file))-parseFloat(getStartTime(file));
}

function getStartTime(file){
  if (file.split('#t=').length<2){
    return 0;
  }
  return  file.split('#t=')[1].split(',')[0];
}

function getEndTime(file){
  if (file.split('#t=').length<2){
    return '';
  }
  return  file.split('#t=')[1].split(',')[1];
}

$('a[set-slideshow-id]').click(function(e) {
   id =$('#idSlideShow').val();
});

function saveAnimation(currentDataId){
  hideAll();
  currentData=slideShowDatas[currentDataId];
  currentData.duration=    $('#durationFile'+currentDataId).val();
  currentData.effect=$('#effectFile'+currentDataId).val();
  if (currentData.media=='mp3' || currentData.media=='mp4'){
    currentData.file= getFilePath(currentData.file)+'#t='+ $('#startFile'+currentDataId).val() +','+$('#endFile'+currentDataId).val();
  }
  changeSaveallColorRed();
  fillSlideShow();
}


function removeAnimation(currentDataId){
  hideAll();
  slideShowDatas.splice(currentDataId, 1);
  changeSaveallColorRed();
  fillSlideShow();
}

function moveDownAnimation(currentDataId){
  hideAll();
  if (currentDataId<slideShowDatas.length-1){
    currentData=slideShowDatas[currentDataId];
    if (currentData.media=='txt'){
      currentData["file"]='Texte_'+(currentDataId+1);
    }
    slideShowDatas[currentDataId]=slideShowDatas[currentDataId+1];
    slideShowDatas[currentDataId+1]=currentData;
    changeSaveallColorRed();
  }
  fillSlideShow();
}

function moveUpAnimation(currentDataId){
  hideAll();
  if (currentDataId>0){
    currentData=slideShowDatas[currentDataId];
    if (currentData.media=='txt'){
      currentData["file"]='Texte_'+(currentDataId-1);
    }
    slideShowDatas[currentDataId]=slideShowDatas[currentDataId-1];
    slideShowDatas[currentDataId-1]=currentData;
    changeSaveallColorRed();
  }
  fillSlideShow();
}

function addTxtAnimation(){
    var dataToAdd={};
    dataToAdd["media"]="txt";
    dataToAdd["file"]='Texte_'+slideShowDatas.length;
    dataToAdd["title"]='Titre';
    dataToAdd["subTitle"]='Sous-Titre';
    dataToAdd["lines"]=[{"line":"ceci est une ligne"}];
    dataToAdd["duration"]='5';
    dataToAdd["styleEffect"]="none";
    dataToAdd["movementEffect"]="none";
    dataToAdd["comeInEffect"]="none";
    dataToAdd["comeOutEffect"]="none";
    dataToAdd["soundEffectComeIn"]="none";
    dataToAdd["soundEffectComeOut"]="none";
    dataToAdd["font"]="none";
    dataToAdd["fontcolor"]="#ff0000";
    dataToAdd["fontsize"]="100";
    
    slideShowDatas.push(dataToAdd);
    changeSaveallColorRed();
    fillSlideShow();
}

function addAnimation(){
  var files = $("#files")[0].files;
  for (i=0;i<files.length;i++){ 
    var dataToAdd={};
    dataToAdd["media"]=$('#mediaToAdd').val();
    switch (dataToAdd["media"])
    {
      case "mp3":
          dataToAdd.file='musics/'+files[i].name;
          break;
      case "mp4":
          dataToAdd.file='videos/'+files[i].name;
          dataToAdd["orientationEffect"]="landscape";
          break;
      case "img":
          dataToAdd.file='photos/'+files[i].name;
          dataToAdd["duration"]='5';
          dataToAdd["orientationEffect"]="landscape";
          break;
      defaut:
          break; 
    }
    dataToAdd["styleEffect"]="none";
    dataToAdd["movementEffect"]="none";
    dataToAdd["comeInEffect"]="none";
    dataToAdd["comeOutEffect"]="none";
    dataToAdd["soundEffectComeIn"]="none";
    dataToAdd["soundEffectComeOut"]="none";
    slideShowDatas.push(dataToAdd);
  }
  changeSaveallColorRed();
  fillSlideShow();
}

function saveAllAnimation(){
  hideAll();
  downAll(JSON.stringify(slideShowDatas),'slideshowData-'+Date.now()+'.json','application/json');
  $("#isaveall").attr({'style':'color:green;'});
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

function hideAll(){
    $('#srcVideo').attr('src','');
    $('#videos').hide();
    $('#images').hide();
    $('#musics').hide();
    $('#textes').hide();
    $('#updateTexte').hide();
    $('#updateEffect').hide();
    $('#addNewAnimation').hide();
}

function runAnimation(currentDataId){
  hideAll();
  playAnimation(currentDataId);
}  

function playAnimation(currentDataId){ 
  $('#srcVideo').attr('src','');
  $("#music").attr('controls', '');
  $('#videos').hide();
  $('#images').hide();
  $('#musics').hide();
  $('#textes').hide(); 
  currentData=slideShowDatas[currentDataId];
  switch (currentData.media)
  {
    case "mp3":
         playMusic(currentData.file);
         break;
    case "mp4":
         playMovie(currentDataId);
         break;
    case "img":
         playImage(currentDataId);
         break;
    case "txt":
         playText(currentDataId);
         break; 
    defaut:
         break;    
  }
}

function playImage(currentDataId){
  $("#music").removeAttr('controls');
  currentData=slideShowDatas[currentDataId];
  $('#srcImage').attr('src',currentData.file);
  $("#srcImage").addClass(currentData["orientationEffect"]);
  $("#images").addClass(currentData["styleEffect"]);
  $("#images").addClass(currentData["comeInEffect"]);
  $("#images").addClass(currentData["movementEffect"]);
  playMusic(currentData["soundEffectComeIn"]);
  $('#images').show();
  
  setTimeout(function() {
    $("#images").removeClass(currentData["comeInEffect"]);
    $("#images").removeClass(currentData["movementEffect"]);
    $("#images").addClass(currentData["comeOutEffect"]);
    if ("comeOutEffectShowNextImage"==currentData["comeOutEffect"]){
      $('#srcNextImage').attr('src',currentData.file);
      $("#nextImage").addClass("comeOutEffectShowNextImage2"); 
      $('#nextImage').show(); 
      if (currentDataId+1<slideShowDatas.length && slideShowDatas[currentDataId+1].media=="img"){
        $('#srcImage').attr('src',slideShowDatas[currentDataId+1].file);
      }
    }
    playMusic(currentData["soundEffectComeOut"]);
  }, currentData["duration"]*1000);

  durationEffect=2000;
  if ("comeOutEffectShowNextImage"==currentData["comeOutEffect"]){
    durationEffect=5000;
  }

  setTimeout(function() {
    $("#srcImage").removeClass(currentData["orientationEffect"]);
    $("#images").removeClass(currentData["styleEffect"]);
    $("#images").removeClass(currentData["comeOutEffect"]);
    if ("comeOutEffectShowNextImage"==currentData["comeOutEffect"]){
      $('#srcNextImage').attr('src','');
      $("#nextImage").removeClass("comeOutEffectShowNextImage2"); 
      $('#nextImage').hide(); 
    }
    stopMusic();
  }, currentData["duration"]*1000+durationEffect) ;
  
};

function playMovie(currentDataId){
  currentData=slideShowDatas[currentDataId];
  $("#video").addClass(currentData["orientationEffect"]);
  $('#srcVideo').attr('src',currentData.file);
  $('#video')[0].load();
  $('#videos').show();
  $('#video').get(0).play();
  //$('#video').get(0).requestFullscreen();
}
  
function stopMusic(){
    $('#music').get(0).pause();
    $('#srcMusic').attr('src','');
}

function playMusic(soundFile){
  if (soundFile!='none' && soundFile!==undefined){
    stopMusic();
    $('#srcMusic').attr('src',soundFile);
    $('#music')[0].load();
    $('#musics').show();
    $('#music').get(0).play();
  }
};


function playText(currentDataId){
  $("#music").removeAttr('controls');
  currentData=slideShowDatas[currentDataId];
  $("#textes").css("font-family", currentData["font"]);
  $("#textes").css("color", currentData["fontcolor"]);
  $("#textes").css("font-size", currentData["fontsize"]+"%");
     
  playMusic(currentData["soundEffectComeIn"]);
  if (currentData.styleEffect=='starwars'){
    var div_data ='<p id="startStarWars">Il y a bien longtemps, dans une galaxie lointaine, tr&egrave;s lontaine</p>';
    div_data+='<h1 id="h1StarWars">'+currentData.title+'</h1>';
    div_data+='<div id="titlesStarWars">';
    div_data+='<div id="titlecontentStarWars">';
    div_data+='<p class="centerStarWars">'+currentData.subTitle+'</p>';

    currentData.lines.forEach(object => div_data=div_data+'<p>'+object.line+'<p>');
    
    div_data+="</div></div>";   
    $("#divText").html(div_data);
       
  } else {  
    var div_data ='<center><h1>'+currentData.title+'</h1><h2>'+currentData.subTitle+'</h2>' ;
    currentData.lines.forEach(object => div_data=div_data+'<p>'+object.line+'<p>');
    div_data+='<br></center>';
    $("#textes").addClass(currentData["styleEffect"]);
    $("#textes").addClass(currentData["comeInEffect"]);
    $("#textes").addClass(currentData["movementEffect"]);
    $("#divText").html(div_data);
    $("#divCrawl").html("");
    setTimeout(function() {
      playMusic(currentData["soundEffectComeOut"]);
      $("#textes").removeClass(currentData["comeInEffect"]);
      $("#textes").removeClass(currentData["movementEffect"]);
      $("#textes").addClass(currentData["comeOutEffect"]);
    }, currentData["duration"]*1000);
  
    setTimeout(function() {
      stopMusic();
      $("#textes").removeClass(currentData["styleEffect"]);
      $("#textes").removeClass(currentData["comeOutEffect"]);
    }, currentData["duration"]*1000+2000) ;
  }                   
  $('#textes').show(); 
  
}


function  updateTextAnimation(currentDataId){
  oldCurrentDataId=$('#textCurrentDataId').val();
  currentData=slideShowDatas[currentDataId];
  var div_text ='<p>Text Modification '+currentData.file+'</p>';
  div_text+='Title : <input type="text" size="50" id="updatetitle" value="'+currentData.title+'"/><br>';
  div_text+='SubTitle : <input type="text" size="50" id="updatesubtitle" value="'+currentData.subTitle+'"/><br>';
  div_text+='Text : <textarea id="updatelines" rows="5" cols="60">';
  currentData.lines.forEach(object => div_text=div_text+object.line+'\n');
  div_text+='</textarea>'; 
  div_text+='<br>Font:'+getFonts();
  div_text+='&nbsp;&nbsp;&nbsp;&nbsp;<a class="js-open-modal btn" href="#" title="Modify" onclick="saveTextAnimation('+currentDataId+');"><i class="fa fa-save fa-2x"></i></a>';
  div_text+='&nbsp;<a class="js-open-modal btn" href="#" title="Play" onclick="playAnimation('+currentDataId+');"><i class="fa fa-play-circle fa-2x" ></i></a>';
  div_text+='&nbsp;<a class="js-open-modal btn" href="#"  title="Cancel" onclick="hideTextAnimation();"><i class="fa fa-times-circle fa-2x"></i></a>';
  div_text+='<input type="hidden" id="textCurrentDataId" value="'+currentDataId+'">';
  $("#updateTexte").html(div_text); 
  $('#fontEffect').val(currentData["font"]);
  $('#fontColor').val(currentData["fontcolor"]);
  $('#fontSize').val(currentData["fontsize"]);
  $('#updateEffect').hide(); 
  if (oldCurrentDataId==currentDataId){
    $('#updateTexte').toggle();
  } else {
    $('#updateTexte').show();
  }

}
function  saveTextAnimation(currentDataId){
  currentData=slideShowDatas[currentDataId];
  currentData["title"]=$('#updatetitle').val();
  currentData["subTitle"]=$('#updatesubtitle').val();
  currentData["font"]=$('#fontEffect').val();
  currentData["fontcolor"]=$('#fontColor').val();
  currentData["fontsize"]=$('#fontSize').val();
  var dataLine= $('#updatelines').val().split('\n');
  currentData["lines"]=[];
  dataLine.forEach(object => currentData["lines"].push({"line": object }));
  changeSaveallColorRed();
}

function hideTextAnimation(){
  $('#updateTexte').hide();
}

function addNewAnimation(){
  if ($('#addNewAnimation').is(":visible")){
    hideAll();
  }else {
    hideAll();
    $('#addNewAnimation').show();
  }
}

function hideAddNewAnimation(){
  $('#addNewAnimation').hide();
}


function  updateEffectAnimation(currentDataId){
  oldCurrentDataId=$('#effetCurrentDataId').val();
  currentData=slideShowDatas[currentDataId];
  var div_effect ='<p>Style Modification '+currentData.file+'</p>';
  switch (currentData.media)
  {
    case "mp3":
         div_effect+=getStartEndEffect(currentData);
         break;
    case "mp4":
         div_effect+=getOrientationEffect(currentData.styleEffect);
         div_effect+=getMovieEffect(currentData.styleEffect);
         div_effect+=getStartEndEffect(currentData);
         break;
    case "img":
        div_effect+=getOrientationEffect(currentData.styleEffect);
        div_effect+=getImageEffect(currentData.styleEffect);
        div_effect+=getSoundEffect(currentData);
        div_effect+=getMovementEffect(currentData.movementEffect);
        div_effect+=getComeInEffect(currentData.comeInEffect);
        div_effect+=getComeOutEffect(currentData.comeOutEffect);
         break;
    case "txt":
         div_effect+=getTextEffect(currentData.styleEffect);
         div_effect+=getSoundEffect(currentData);
         div_effect+=getMovementEffect(currentData.movementEffect);
         div_effect+=getComeInEffect(currentData.comeInEffect);
         div_effect+=getComeOutEffect(currentData.comeOutEffect);
         break; 
    defaut:
         break;    
  }
  div_effect+='<br><center><a class="js-open-modal btn" href="#" save-media="save-media" title="Modify" onclick="saveEffectAnimation('+currentDataId+');"><i class="fa fa-save fa-2x"></i></a>';
  div_effect+='&nbsp;<a class="js-open-modal btn" href="#" title="Play" onclick="playAnimation('+currentDataId+');"><i class="fa fa-play-circle fa-2x" ></i></a>';
  div_effect+='&nbsp;<a class="js-open-modal btn" href="#"  title="Cancel" onclick="hideEffectAnimation();"><i class="fa fa-times-circle fa-2x"></i></a></center>';
  div_effect+='<input type="hidden" id="effetCurrentDataId" value="'+currentDataId+'">';
  
  $("#updateEffect").html(div_effect);  
  $('#orientationEffect').val(currentData["orientationEffect"]);
  $('#styleEffect').val(currentData["styleEffect"]);
  $('#movementEffect').val(currentData["movementEffect"]);
  $('#comeInEffect').val(currentData["comeInEffect"]);
  $('#comeOutEffect').val(currentData["comeOutEffect"]);
  
  $('#updateTexte').hide();
  if (oldCurrentDataId==currentDataId){
    $('#updateEffect').toggle();
  } else {
    $('#updateEffect').show();
  }

}
function  saveEffectAnimation(currentDataId){
  currentData=slideShowDatas[currentDataId];
  if ( currentData.media=="mp4"){
    currentData["styleEffect"]=$('#styleEffect').val();
  }
  if ( currentData.media=="mp4" || currentData.media=="img"){
    $("#video").removeClass(currentData["orientationEffect"]);
    currentData["orientationEffect"]=$('#orientationEffect').val();
  } 
  if (currentData.media=="txt" || currentData.media=="img"){
    currentData["styleEffect"]=$('#styleEffect').val();
    currentData["movementEffect"]=$('#movementEffect').val();
    currentData["comeInEffect"]=$('#comeInEffect').val();
    currentData["comeOutEffect"]=$('#comeOutEffect').val();
    currentData["soundEffectComeIn"]=$('#soundEffectComeIn').val();
    currentData["soundEffectComeOut"]=$('#soundEffectComeOut').val();
  } else if (currentData.media=="mp3" || currentData.media=="mp4"){
    currentData.file= getFilePath(currentData.file)+'#t='+ $('#startFileUpdate').val() +','+$('#endFileUpdate').val();
    $('#startFile'+currentDataId).val($('#startFileUpdate').val()); 
    $('#endFile'+currentDataId).val($('#endFileUpdate').val());
  }
  changeSaveallColorRed();
}

function hideEffectAnimation(){
  $('#updateEffect').hide();
}

  function getMovementEffect(selectedEffect){
    var selectEffect='<label><i class="fa fa-film fa-1x"></i> Movement Effect</label>'; 
    selectEffect+='<select name="movementEffect" id="movementEffect">';
    selectEffect+='<option value="movementEffectNone">none</option>';
    selectEffect+='<option value="movementEffectUpToDown">Up to Down</option>';
    selectEffect+='<option value="movementEffectDownToUp">Down to Up</option>';
    selectEffect+='<option value="movementEffectLeftToRight">Left to Right</option>';
    selectEffect+='<option value="movementEffectRightToLeft">Right to Left</option>';
    selectEffect+='</select>';                                                                                                         
    return selectEffect;
  }

  function getComeInEffect(selectedEffect){
    var selectEffect='<br><label><i class="fa fa-film fa-1x"></i> Come In Effect</label> ';
    selectEffect+='<select name="comeInEffect" id="comeInEffect">';
    selectEffect+='<option value="comeInEffectNone">none</option>';
    selectEffect+='<option value="comeInEffectFadeIn">Fade In</option>';
    selectEffect+='<option value="comeInEffectZoomIn">Zoom In</option>';
    selectEffect+='<option value="comeInEffectZoomInWithRotate">Zoom In with Rotate</option>';
    selectEffect+='<option value="comeInEffectZoomInSlowMotion">Zoom in slow-motion</option>';
    selectEffect+='</select>';
    return selectEffect;
  }
  
  function getComeOutEffect(selectedEffect){
    var selectEffect='<br><label><i class="fa fa-film fa-1x"></i> Come Out Effect</label> ';
    selectEffect+='<select name="comeOutEffect" id="comeOutEffect">';
    selectEffect+='<option value="comeOutEffectNone">none</option>';
    selectEffect+='<option value="comeOutEffectFadeOut">Fade Out</option>';
    selectEffect+='<option value="comeOutEffectZoomOut">Zoom Out</option>';
    selectEffect+='<option value="comeOutEffectZoomOutWithRotate">Zoom Out with Rotate</option>';
    selectEffect+='<option value="comeOutEffectZoomOutSlowMotion">Zoom Out slow-motion</option>';
    selectEffect+='<option value="comeOutEffectShowNextImage">Show Next Image</option>';
    selectEffect+='</select>';
    return selectEffect;
  }

  function getImageEffect(selectedEffect){
    var selectEffect='<label><i class="fa fa-film fa-1x"></i> Style Effect</label> ';
    selectEffect+='<select name="styleEffect" id="styleEffect">';
    selectEffect+='<option value="imageEffectNone">none</option>';
    selectEffect+='<option value="imageEffectSepia">Sepia</option>';
    selectEffect+='<option value="imageEffectBlackAndWhite">Black and White</option>';
    selectEffect+='</select>';
    return selectEffect;
  }

  function getMovieEffect(selectedEffect){
    var selectEffect='<br><label><i class="fa fa-film fa-1x"></i> Style Effect</label> ';
    selectEffect+='<select name="styleEffect" id="styleEffect">';
    selectEffect+='<option value="keepMusic">Keep Music</option>';
    selectEffect+='<option value="stopMusic">Stop Music</option>';
    selectEffect+='</select>';
    return selectEffect;
  }
  
  function getOrientationEffect(selectedEffect){
    var selectEffect='<label><i class="fa fa-film fa-1x"></i> Orientation</label> ';
    selectEffect+='<select name="orientationEffect" id="orientationEffect">';
    selectEffect+='<option value="landscape">landscape</option>';
    selectEffect+='<option value="portrait">portrait</option>';
    selectEffect+='</select>';
    return selectEffect;
  }
  
  function getTextEffect(selectedEffect){
    var selectEffect='<label><i class="fa fa-film fa-1x"></i> Style Effect</label> ';
    selectEffect+='<select name="styleEffect" id="styleEffect">';
    selectEffect+='<option value="none">none</option>';
    selectEffect+='<option value="starwars">starwars</option>';
    selectEffect+='</select>';
    return selectEffect;
  }
  
  function getStartEndEffect(currentData){
    var selectEffect='<label><i class="fa fa-film fa-2x"></i> Style Effect</label> ';
    selectEffect+='start in s <input type="text" size="1" id="startFileUpdate" value="' + getStartTime(currentData.file) +'"/> <i class="fa fa-hourglass-o fa-2x" title="fix start time" style="cursor: pointer;" onclick="setStartCurrentTime(\''+currentData.media+'\');"></i>';
    selectEffect+=' end in s <input type="text" size="1" id="endFileUpdate" value="' + getEndTime(currentData.file)+'"/> <i class="fa fa-hourglass fa-2x" title="fix end time" style="cursor: pointer;" onclick="setEndCurrentTime(\''+currentData.media+'\');"></i><br>';
    return selectEffect;
  }
  function setStartCurrentTime(media){
   var mediaComponent="#video";
   if (media=='mp3'){
     mediaComponent="#music";
   }
   $("#startFileUpdate").val($(mediaComponent)[0].currentTime);
  }
  
  function setEndCurrentTime(media){
   var mediaComponent="#video";
   if (media=='mp3'){
     mediaComponent="#music";
   }
   $("#endFileUpdate").val($(mediaComponent)[0].currentTime);
  }
                                                                                                  
  function getSoundEffect(currentData){
    var selectEffect='<br><label><i class="fa fa-film fa-1x"></i> Come In Sound Effect</label><input type="text" id="soundEffectComeIn" value="'+currentData.soundEffectComeIn+'">';
    selectEffect+=' <input type="file" id="comeInfile" name="comeInfile" accept="audio/mp3,audio/ogg,audio/wav,audio/mpeg"  onchange="openComeInSoundFile(event)">';
    selectEffect+='<br><label><i class="fa fa-film fa-1x"></i> Come Out Sound Effect</label><input type="text" id="soundEffectComeOut" value="'+currentData.soundEffectComeOut+'">';
    selectEffect+=' <input type="file" id="comeOutfile" name="comeoutfile" accept="audio/mp3,audio/ogg,audio/wav,audio/mpeg" onchange="openComeOutSoundFile(event)"><br>';
    return selectEffect;
  }
  
  var openComeInSoundFile = function(event) {
        var input = event.target;
        $("#soundEffectComeIn").val("sons/"+input.files[0].name);
  };
  var openComeOutSoundFile = function(event) {
        var input = event.target;
        $("#soundEffectComeOut").val("sons/"+input.files[0].name);
  };

function getFonts(){
var fonts= [
'Friends',
'hobbitonbrushhand',  
'A-Bug-s-Life---Debugged',
'A-Bug-s-Life',
'akaPotsley_0',
'AL-Cinderella',
'aladdin',
'ALGERIA',
'algerian_becker',
'algerian_becker_basic',
'algerian_becker_basic_caps',
'Alice_in_Wonderland_3',
'BFG-Font',
'bighero_v4',
'blasteei',
'blasteet',
'blasteii',
'blastein',
'blaster',
'blasteri',
'BLKCHCRY',
'BUBBALOB',
'bubbalove-bold',
'Buka-Bird',
'Caribbean',
'Caribbean_0',
'celticmd',
'columbusdb',
'columbusregular',
'DENMARK',
'Diner-Regular',
'DIOGENES',
'disney-print',
'Findet-Nemo',
'Flat-Earth-Scribe',
'Florida-Project-Phase-One',
'Florida-Project-Phase-One',
'Florida-Project-Phase-Two',
'Florida-Project-Phase-Two',
'graceyscurse',
'graceyscurse_0',
'gunship',
'gunship3d',
'gunship3dital',
'gunshipacad',
'gunshipacadital',
'gunshipbold',
'gunshipboldital',
'gunshipcond',
'gunshipcondital',
'gunshipexpand',
'gunshipexpandital',
'gunshipgrad',
'gunshipgradital',
'gunshiphalf',
'gunshiphalfital',
'gunshipital',
'gunshiplaser',
'gunshiplaserital',
'gunshipleft',
'gunshipout',
'gunshipoutital',
'gunshipsemital',
'gunshipsuperital',
'heroesassemble2',
'heroesassemble3d',
'heroesassemble3dital',
'heroesassembleacad',
'heroesassembleacadital',
'heroesassemblebold2',
'heroesassembleboldexpand2',
'heroesassembleboldexpandital2',
'heroesassembleboldital2',
'heroesassemblecond2',
'heroesassemblecondital2',
'heroesassembleexpand2',
'heroesassembleexpandital2',
'heroesassemblegrad',
'heroesassemblegradital',
'heroesassembleital2',
'heroesassembleleft2',
'heroesassembleout',
'heroesassembleoutital',
'Ice-kingdom---Bold---Por-Kustren',
'Incredibles,-The',
'Intensa-Fuente',
'JUNGLEFE',
'lion_king',
'LMS-Happily-Ever-After',
'MAGNETOB',
'Maleficio',
'Mickey-Ears',
'mickey-m-tfb',
'MICKEY',
'mickeymousebats',
'Minnie',
'Monster-AG',
'Mouse-Tags',
'MouseMemoirs-Regular',
'mulan',
'Nightmare-Before-Christmas',
'Orange-Grove',
'PentaGrams-Malefissent',
'PokerHunters',
'PrincesS-AND-THE-FROG',
'rapierletletplain1.0',
'RAPSCALL',
'SANFW',
'SHADSER',
'sonic_advance_2',
'Space-Station-77',
'Space-Station-77_0',
'Spaceship-Bullet_0',
'Starjedi',
'Starjhol',
'Starjout',
'startedbyamouse_0',
'STJEDISE',
'Stjldbl1',
'Stjldbl2',
'Storyboo',
'Storyboo_0',
'Strjmono',
'Tangled',
'Tr2n',
'Walter',
'waltograph42',
'waltographUI',
'WOODCUT',
'Zootopia-JPosters.com.ar',
'AvenirLTStd-Black',
'AvenirLTStd-BlackOblique',
'AvenirLTStd-Book',
'AvenirLTStd-BookOblique',
'AvenirLTStd-Heavy',
'AvenirLTStd-HeavyOblique',
'AvenirLTStd-Light',
'AvenirLTStd-LightOblique',
'AvenirLTStd-Medium',
'AvenirLTStd-MediumOblique',
'AvenirLTStd-Oblique',
'AvenirLTStd-Roman'
];


    var selectEffect='<select name="fontEffect" id="fontEffect" onchange="changeFont()">';
    $.each( fonts, function( i, l ){
      selectEffect+='<option value="'+l+'">'+l+'</option>';
    });
    selectEffect+='</select>';
    selectEffect+=' <input type="color" id="fontColor" name="fontColor" value="#ff0000" onchange="changeFont()">';
    selectEffect+=' size : <input type="number" id="fontSize" name="fontSize" value="100" onchange="changeFont()">';
    return selectEffect;
}

function changeFont(){
       $("#textes").css("font-family", $('#fontEffect').val());
       $("#textes").css("color", $('#fontColor').val());
       $("#textes").css("font-size", $('#fontSize').val()+"%");
}

