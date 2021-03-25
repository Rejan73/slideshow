/*!
 * Slideshow Tools Library v1.0.0
 *
 * Date: 2021-03-19T08:00Z
 */
var slideShowDatas;
var openFile = function(event) {
        var input = event.target;
        var reader = new FileReader();
        reader.onload = function(){
          slideShowDatas = JSON.parse(reader.result);
          fillSlideShow();
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
    var div_data='<table><th></th><th>File</th><th>Width</th><th>Height</th><th>PlayTime in s</th><th>Actions</th>';
    var cpt=0;
    slideShowDatas.forEach(slideShowData => div_data+=printSlideShowData(slideShowData,cpt++));
    div_data+='</table>';
   div_data+='<br/><br/>Animation duration :'+calculeAnimationTime()+'s'; 
   div_data+='<br/><br/><select name="mediaToAdd" id="mediaToAdd">';
   div_data+='<option value="img">Photo</option>';
   div_data+='<option value="mp3">Music</option>';
   div_data+='<option value="mp4">Video</option>';
   div_data+='<option value="txt">Texte</option>';
   div_data+='</select>';
   div_data+=' File : <input type="text" size="20" id="fileToAdd" value="" title="avec le bon nom de dossier/fichier"/>'; 
   div_data+=' <a class="js-open-modal btn" href="#" add-media="add-media" title="add media" onclick="addAnimation();"><i class="fa fa-plus-circle fa-2x"></i></a>';
   div_data+='<br/><br/><a class="js-open-modal btn" href="#" saveall-media="saveall-media" title="save all to file" onclick="saveAllAnimation();"><i class="fa fa-save fa-5x"></i></a>'; 
     
    $('#slideShow').html(div_data); 
                                                                                         
}

function calculeAnimationTime(){
  var animationTime=0;
  slideShowDatas.filter(slideShowData => slideShowData["duration"] !=null).forEach(slideShowData => animationTime+=parseFloat(slideShowData["duration"]));
  slideShowDatas.filter(slideShowData => parseFloat(getEndTime(slideShowData["file"]))>0 && slideShowData["media"]!="mp3").forEach(slideShowData => animationTime+=getDuration(slideShowData.file));
  return animationTime;
}


  google.charts.load("current", {packages:["timeline"]});
  google.charts.setOnLoadCallback(drawChart);      
function drawChart(){
      
    var container = document.getElementById('timeline');
    
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'string', id: 'Room' });
    dataTable.addColumn({ type: 'string', id: 'Name' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });
    dataTable.addRows([
      [ 'Music', '1s.mpeg3',       new Date(0,0,0,12,0,0),  new Date(0,0,0,12,0,30) ],
      [ 'Image', 'Intermediate ',    new Date(0,0,0,12,0,0),  new Date(0,0,0,12,0,10) ],
      [ 'Texte', 'JavaScript',        new Date(0,0,0,12,0,10),  new Date(0,0,0,12,0,30) ],
      [ 'Video',   'Google Charts',   new Date(0,0,0,12,0,30), new Date(0,0,0,12,0,40) ]]);

    var options = {
      timeline: { colorByRowLabel: true }
    };

    chart.draw(dataTable, options);
     $('#timelines').show();
     
}


function printSlideShowData(slideShowData,cpt){
  var line='';
  switch (slideShowData.media)
  {
    case "mp3":
         line+='<td><i class="fa fa-file-audio-o fa-2x" ></i></td><td>'+getFilePath(slideShowData.file)+'</td><td></td><td></td>';
         line+='<td>start <input type="text" size="1" id="startFile'+cpt+'" value="' + getStartTime(slideShowData.file) +'"/>';
         line+=' end <input type="text" size="1" id="endFile'+cpt+'" value="' + getEndTime(slideShowData.file)+'"/></td>';
         break;
    case "mp4":
         line+='<td><i class="fa fa-file-movie-o fa-2x" ></i></td><td>'+getFilePath(slideShowData.file)+'</td>';
         line+='<td><input type="text" size="1" id="widthFile'+cpt+'" value="' + slideShowData.width+'"/></td>';
         line+='<td><input type="text" size="1" id="heightFile'+cpt+'" value="' + slideShowData.height+'"/></td>';
         line+='<td>start <input type="text" size="1" id="startFile'+cpt+'" value="' + getStartTime(slideShowData.file) +'"/>';
         line+=' end <input type="text" size="1" id="endFile'+cpt+'" value="' + getEndTime(slideShowData.file)+'"/></td>';
         break;
    case "img":
         line+='<td><i class="fa fa-file-photo-o fa-2x" ></i></td><td>'+slideShowData.file+'</td>';
         line+='<td><input type="text" size="1" id="widthFile'+cpt+'" value="' + slideShowData.width+'"/></td>';
         line+='<td><input type="text" size="1" id="heightFile'+cpt+'" value="' + slideShowData.height+'"/></td>';
         line+='<td>duration <input type="text" size="1" id="durationFile'+cpt+'" value="' + slideShowData.duration +'"/></td>';
         break;
    case "txt":
         line+='<td><i class="fa fa-file-text-o fa-2x" ></i></td><td>'+slideShowData.file+'</td>';
         line+='<td colspan="2"><a class="js-open-modal btn" href="#" title="Modify Text" onclick="updateTextAnimation('+cpt+');"><i class="fa fa-pencil-square fa-2x" ></i></a></td>';
         line+='<td>duration <input type="text" size="1" id="durationFile'+cpt+'" value="' + slideShowData.duration +'"/></td>';
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

function getFilePath(file){
  return  file.split('#t=')[0];
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

function hideAll(){
    $('#srcVideo').attr('src','');
    $('#videos').hide();
    $('#images').hide();
    $('#musics').hide();
    $('#textes').hide();
    $('#updateTexte').hide();
    $('#updateEffect').hide();
    $('#timelines').hide();
    
}

function stopMusic(){
    $('#music').get(0).pause();
    $('#srcMusic').attr('src','');
}


$('a[config-id]').click(function(e) {
   $('#configurationSlideShow').toggle();
});
$('a[set-slideshow-id]').click(function(e) {
   id =$('#idSlideShow').val();
});

function saveAnimation(currentDataId){
  hideAll();
  currentData=slideShowDatas[currentDataId];
  currentData.width=    $('#widthFile'+currentDataId).val();
  currentData.height=    $('#heightFile'+currentDataId).val();
  currentData.duration=    $('#durationFile'+currentDataId).val();
  currentData.effect=$('#effectFile'+currentDataId).val();
  if (currentData.media=='mp3' || currentData.media=='mp4'){
    currentData.file= getFilePath(currentData.file)+'#t='+ $('#startFile'+currentDataId).val() +','+$('#endFile'+currentDataId).val();
  }
  fillSlideShow();
}


function removeAnimation(currentDataId){
  hideAll();
  slideShowDatas.splice(currentDataId, 1);
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
  }
  fillSlideShow();
}

function addAnimation(){
  var dataToAdd={};
  dataToAdd["media"]=$('#mediaToAdd').val();
  if (dataToAdd["media"]=='txt'){
     dataToAdd["file"]='Texte_'+slideShowDatas.length;
     dataToAdd["title"]='Titre';
     dataToAdd["subTitle"]='Sous-Titre';
     dataToAdd["lines"]=[{"line":"ceci est une ligne"}];
  } else{ 
    dataToAdd.file=$('#fileToAdd').val();
  }
  
  if (dataToAdd["media"]=='img' || dataToAdd["media"]=='txt'){
    dataToAdd["duration"]='5';
  } 
  dataToAdd["styleEffect"]="none";
  dataToAdd["movementEffect"]="none";
  dataToAdd["comeInEffect"]="none";
  dataToAdd["comeOutEffect"]="none";
  dataToAdd["width"]='800';
  dataToAdd["height"]='600'; 
  slideShowDatas.push(dataToAdd);
  
  fillSlideShow();
}

function saveAllAnimation(){
  hideAll();
  downAll(JSON.stringify(slideShowDatas),'slideshowData-'+Date.now()+'.json','application/json');
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

function runAnimation(currentDataId){
  hideAll();
  currentData=slideShowDatas[currentDataId];
  switch (currentData.media)
  {
    case "mp3":
         playMusic(currentData);
         break;
    case "mp4":
         playMovie(currentData);
         break;
    case "img":
         playImage(currentData);
         break;
    case "txt":
         playText(currentData);
         break; 
    defaut:
         break;    
  }
}

function playImage(currentData){
  $('#srcImage').attr('src',currentData.file);
  $("#images").addClass(currentData["styleEffect"]);
  $("#images").addClass(currentData["comeInEffect"]);
  $("#images").addClass(currentData["movementEffect"]);
 // $('#srcImage').attr('width',currentData.width);
 // $('#srcImage').attr('height',currentData.height);
  $('#images').show();
  setTimeout(function() {
    $("#images").removeClass(currentData["comeInEffect"]);
    $("#images").removeClass(currentData["movementEffect"]);
    $("#images").addClass(currentData["comeOutEffect"]);
  }, currentData["duration"]*1000);
  
  setTimeout(function() {
    $("#images").removeClass(currentData["styleEffect"]);
    $("#images").removeClass(currentData["comeOutEffect"]);
  }, currentData["duration"]*1000+2000) ;
  
};

function playMovie(currentData){
  $('#srcVideo').attr('src',currentData.file);
  $('#video')[0].load();
  $('#videos').show();
  $('#video').get(0).play();
  //$('#video').get(0).requestFullscreen();
}
  
function playMusic(currentData){
  $('#srcMusic').attr('src',currentData.file);
  $('#music')[0].load();
  $('#musics').show();
  $('#music').get(0).play();
  

};


function playText(currentData){
  if (currentData.styleEffect=='starwars'){
    var div_data ='<div class="title">'
    + '<p>'+currentData.title+'</p>'
    + '<h1>'+currentData.subTitle+'</h1></div><div>' ;
    currentData.lines.forEach(object => div_data=div_data+'<p>'+object.line+'<p>');
    div_data=div_data+"</div>"   
    $("#divCrawl").html(div_data);
    $("#divText").html("");   
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
    $("#textes").removeClass(currentData["comeInEffect"]);
    $("#textes").removeClass(currentData["movementEffect"]);
    $("#textes").addClass(currentData["comeOutEffect"]);
  }, currentData["duration"]*1000);
  
  setTimeout(function() {
    $("#textes").removeClass(currentData["styleEffect"]);
    $("#textes").removeClass(currentData["comeOutEffect"]);
  }, currentData["duration"]*1000+2000) ;
  }                   
  $('#textes').show(); 
  
}


function  updateTextAnimation(currentDataId){
  hideAll();
  currentData=slideShowDatas[currentDataId];
  var div_text ='<p>Text Modification '+currentData.file+'<p><br>Title : <input type="text" size="50" id="updatetitle" value="'+currentData.title+'"/><br>';
  div_text+='SubTitle :<input type="text" size="50" id="updatesubtitle" value="'+currentData.subTitle+'"/><br>';
  div_text+='Text : <textarea id="updatelines" rows="10" cols="100">';
  currentData.lines.forEach(object => div_text=div_text+object.line+'\n');
  div_text+='</textarea>'; 
  div_text+='<br><a class="js-open-modal btn" href="#" save-media="save-media" title="Modify" onclick="saveTextAnimation('+currentDataId+');"><i class="fa fa-pencil-square fa-2x"></i></a></td>';
  $("#updateTexte").html(div_text);  
  $('#updateTexte').show();

}
function  saveTextAnimation(currentDataId){
  currentData=slideShowDatas[currentDataId];
  currentData["title"]=$('#updatetitle').val();
  currentData["subTitle"]=$('#updatesubtitle').val();
  var dataLine= $('#updatelines').val().split('\n');
  currentData["lines"]=[];
  dataLine.forEach(object => currentData["lines"].push({"line": object }));
  
  $('#updateTexte').hide();
}


function  updateEffectAnimation(currentDataId){
  hideAll();
  currentData=slideShowDatas[currentDataId];
  var div_effect ='<p>Style Modification '+currentData.file+'<p><br><label><i class="fa fa-film fa-2x"></i> Style Effect</label> ';
  switch (currentData.media)
  {
    case "mp3":
         div_effect+=getMusicEffect(currentData.styleEffect);
         break;
    case "mp4":
         div_effect+=getVideoEffect(currentData.styleEffect);
         break;
    case "img":
        div_effect+=getImageEffect(currentData.styleEffect);
         break;
    case "txt":
         div_effect+=getTextEffect(currentData.styleEffect);
         break; 
    defaut:
         break;    
  }
  div_effect+='<br><label><i class="fa fa-film fa-2x"></i> Movement Effect</label> ';
  div_effect+=getMovementEffect(currentData.movementEffect);
  div_effect+='<br><label><i class="fa fa-film fa-2x"></i> Come In Effect</label> ';
  div_effect+=getComeInEffect(currentData.comeInEffect);
  div_effect+='<br><label><i class="fa fa-film fa-2x"></i> Come Out Effect</label> ';
  div_effect+=getComeOutEffect(currentData.comeOutEffect);
  div_effect+='<br><a class="js-open-modal btn" href="#" save-media="save-media" title="Modify" onclick="saveEffectAnimation('+currentDataId+');"><i class="fa fa-save fa-2x"></i></a></td>';
  $("#updateEffect").html(div_effect);  
  $('#styleEffect').val(currentData["styleEffect"]);
  $('#movementEffect').val(currentData["movementEffect"]);
  $('#comeInEffect').val(currentData["comeInEffect"]);
  $('#comeOutEffect').val(currentData["comeOutEffect"]);
  $('#updateEffect').show();

}
function  saveEffectAnimation(currentDataId){
  currentData=slideShowDatas[currentDataId];
  currentData["styleEffect"]=$('#styleEffect').val();
  currentData["movementEffect"]=$('#movementEffect').val();
  currentData["comeInEffect"]=$('#comeInEffect').val();
  currentData["comeOutEffect"]=$('#comeOutEffect').val();
  
  $('#updateEffect').hide();
}
  function getMovementEffect(selectedEffect){
    var selectEffect='<select name="movementEffect" id="movementEffect">';
    selectEffect+='<option value="movementEffectNone">none</option>';
    selectEffect+='<option value="movementEffectUpToDown" selected>Up to Down</option>';
    selectEffect+='<option value="movementEffectDownToUp" selected>Down to Up</option>';
    selectEffect+='<option value="movementEffectLeftToRight" selected>Left to Right</option>';
    selectEffect+='<option value="movementEffectRightToLeft" selected>Right to Left</option>';
    selectEffect+='</select>';
    return selectEffect;
  }

  function getComeInEffect(selectedEffect){
    var selectEffect='<select name="comeInEffect" id="comeInEffect">';
    selectEffect+='<option value="comeInEffectNone">none</option>';
    selectEffect+='<option value="comeInEffectFadeIn">Fade In</option>';
    selectEffect+='</select>';
    return selectEffect;
  }
  
  function getComeOutEffect(selectedEffect){
    var selectEffect='<select name="comeOutEffect" id="comeOutEffect">';
    selectEffect+='<option value="comeOutEffectNone">none</option>';
    selectEffect+='<option value="comeOutEffectFadeOut">Fade Out</option>';
    selectEffect+='</select>';
    return selectEffect;
  }

  function getImageEffect(selectedEffect){
    var selectEffect='<select name="styleEffect" id="styleEffect">';
    selectEffect+='<option value="imageEffectNone">none</option>';
    selectEffect+='<option value="imageEffectSepia">Sepia</option>';
    selectEffect+='<option value="imageEffectBlackAndWhite">Black and White</option>';
    selectEffect+='</select>';
    return selectEffect;
  }
  
  function getTextEffect(selectedEffect){
    var selectEffect='<select name="styleEffect" id="styleEffect">';
    selectEffect+='<option value="none">none</option>';
    selectEffect+='<option value="starwars">starwars</option>';
    selectEffect+='</select>';
    return selectEffect;
  }
  
  function getVideoEffect(selectedEffect){
    var selectEffect='<select name="styleEffect" id="styleEffect">';
    selectEffect+='<option value="videoEffectNone" selected>none</option>';
    selectEffect+='</select>';
    return selectEffect;
  }

  function getMusicEffect(selectedEffect){
    var selectEffect='<select name="styleEffect" id="styleEffect">';
    selectEffect+='<option value="musicEffectNone" selected>none</option>';
    selectEffect+='</select>';
    return selectEffect;
  }
  