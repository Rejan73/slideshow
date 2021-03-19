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
      };

function fillSlideShow(){
    var div_data='<table><th></th><th>File</th><th>Width</th><th>Height</th><th>PlayTime in s</th><th>Effect</th><th>Actions</th>';
    var cpt=0;
    slideShowDatas.forEach(slideShowData => div_data+=printSlideShowData(slideShowData,cpt++));
    div_data+='</table>';
    
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

function printSlideShowData(slideShowData,cpt){
  var line='';
  switch (slideShowData.media)
  {
    case "mp3":
         line+='<td><i class="fa fa-file-audio-o fa-2x" ></i></td><td>'+getFilePath(slideShowData.file)+'</td><td></td><td></td>';
         line+='<td>start <input type="text" size="1" id="startFile'+cpt+'" value="' + getStartTime(slideShowData.file) +'"/>';
         line+=' end <input type="text" size="1" id="endFile'+cpt+'" value="' + getEndTime(slideShowData.file)+'"/></td>';
         line+='<td>'+getEffectMusic(cpt,slideShowData.effect)+'</td>';
         break;
    case "mp4":
         line+='<td><i class="fa fa-file-movie-o fa-2x" ></i></td><td>'+getFilePath(slideShowData.file)+'</td>'
         line+='<td><input type="text" size="1" id="widthFile'+cpt+'" value="' + slideShowData.width+'"/></td>';
         line+='<td><input type="text" size="1" id="heightFile'+cpt+'" value="' + slideShowData.height+'"/></td>';
         line+='<td>start <input type="text" size="1" id="startFile'+cpt+'" value="' + getStartTime(slideShowData.file) +'"/>';
         line+=' end <input type="text" size="1" id="endFile'+cpt+'" value="' + getEndTime(slideShowData.file)+'"/></td>';
         line+='<td>'+getEffectVideo(cpt,slideShowData.effect)+'</td>';
         break;
    case "img":
         line+='<td><i class="fa fa-file-photo-o fa-2x" ></i></td><td>'+slideShowData.file+'</td>'
         line+='<td><input type="text" size="1" id="widthFile'+cpt+'" value="' + slideShowData.width+'"/></td>';
         line+='<td><input type="text" size="1" id="heightFile'+cpt+'" value="' + slideShowData.height+'"/></td>';
         line+='<td>duration <input type="text" size="1" id="durationFile'+cpt+'" value="' + slideShowData.duration +'"/></td>';
         line+='<td>'+getEffectImg(cpt,slideShowData.effect)+'</td>';
         break;
    case "txt":
         line+='<td><i class="fa fa-file-text-o fa-2x" ></i></td><td>texte</td><td></td><td></td>';
         line+='<td>duration <input type="text" size="1" id="durationFile'+cpt+'" value="' + slideShowData.duration +'"/></td>';
         line+='<td>'+getEffectText(cpt,slideShowData.effect)+'</td>';
         break; 
    defaut:
         break;    
  }
  
  line+='<td>';
  if (slideShowData.media=='txt'){
      line+='<a class="js-open-modal btn" href="#" save-media="save-media" title="Modify" onclick="updateTextAnimation('+cpt+');"><i class="fa fa-pencil-square fa-2x" ></i></a>';
  }
  line+='<a class="js-open-modal btn" href="#" save-media="save-media" title="Save" onclick="saveAnimation('+cpt+');"><i class="fa fa-save fa-2x" ></i></a>';
  line+='<a class="js-open-modal btn" href="#" delete-media="remove-media" title="Remove" onclick="removeAnimation('+cpt+');"><i class="fa fa-times-circle fa-2x" style="color:red;"></i></a>';
  line+='<a class="js-open-modal btn" href="#" moveup-media="moveup-media" title="up" onclick="moveUpAnimation('+cpt+');"><i class="fa fa-arrow-circle-up fa-2x" ></i></a>';
  line+='<a class="js-open-modal btn" href="#" movedown-media="movedown-media" title="down" onclick="moveDownAnimation('+cpt+');"><i class="fa fa-arrow-circle-down fa-2x" ></i></a>';
  line+='<a class="js-open-modal btn" href="#" save-media="play-media" title="Play" onclick="runAnimation('+cpt+');"><i class="fa fa-play-circle fa-2x" ></i></a></td>';
  
  
  return '<tr>'+line+'</tr>';
}

 
  function getEffectText(cpt,effect){
    var selectEffect='<select name="effectFile'+cpt+'" id="effectFile'+cpt+'">';
    selectEffect+='<option value="default">default</option>';
    selectEffect+='<option value="starwars" selected>starwars</option>';
    selectEffect+='</select>';
    return selectEffect;
  }
  
  function getEffectImg(cpt,effect){
    var selectEffect='<select name="effectFile'+cpt+'" id="effectFile'+cpt+'">';
    selectEffect+='<option value="default" selected>default</option>';
    selectEffect+='</select>';
    return selectEffect;
  }
  
  function getEffectVideo(cpt,effect){
    var selectEffect='<select name="effectFile'+cpt+'" id="effectFile'+cpt+'">';
    selectEffect+='<option value="default" selected>default</option>';
    selectEffect+='</select>';
    return selectEffect;
  }
  
  function getEffectMusic(cpt,effect){
    var selectEffect='<select name="effectFile'+cpt+'" id="effectFile'+cpt+'">';
    selectEffect+='<option value="default" selected>default</option>';
    selectEffect+='</select>';
    return selectEffect;
  }


function getFilePath(file){
  return  file.split('#t=')[0];
}

function getStartTime(file){
  if (file.split('#t=').length<2){
    return '';
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
    $('#updatetexte').hide();
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
  currentData=slideShowDatas[currentDataId];
  currentData.width=    $('#widthFile'+currentDataId).val();
  currentData.height=    $('#heightFile'+currentDataId).val();
  currentData.duration=    $('#durationFile'+currentDataId).val();
  currentData.effect=$('#effectFile'+currentDataId).val();
  currentData.file= getFilePath(currentData.file)+'#t='+ $('#startFile'+currentDataId).val() +','+$('#endFile'+currentDataId).val();
  fillSlideShow();
}


function removeAnimation(currentDataId){
  slideShowDatas.splice(currentDataId, 1);
  fillSlideShow();
}

function moveDownAnimation(currentDataId){
  if (currentDataId<slideShowDatas.length-1){
    currentData=slideShowDatas[currentDataId];
    slideShowDatas[currentDataId]=slideShowDatas[currentDataId+1];
    slideShowDatas[currentDataId+1]=currentData;
  }
  fillSlideShow();
}

function moveUpAnimation(currentDataId){
  if (currentDataId>0){
    currentData=slideShowDatas[currentDataId];
    slideShowDatas[currentDataId]=slideShowDatas[currentDataId-1];
    slideShowDatas[currentDataId-1]=currentData;
  }
  fillSlideShow();
}

function addAnimation(){
  var dataToAdd={};
  dataToAdd["media"]=$('#mediaToAdd').val();
  if (dataToAdd["media"]=='txt'){
     dataToAdd["title"]='Titre';
     dataToAdd["subTitle"]='Sous-Titre';
     dataToAdd["lines"]=[{"line":"ceci est une ligne"}];
  } else{ 
    dataToAdd.file=$('#fileToAdd').val();
  }
  
  if (dataToAdd["media"]=='img'){
    dataToAdd["duration"]='3';
  } 
  dataToAdd["effect"]='default';
  dataToAdd["width"]='800';
  dataToAdd["height"]='600'; 
  slideShowDatas.push(dataToAdd);
  
  fillSlideShow();
}

function saveAllAnimation(){
  console.log(JSON.stringify(slideShowDatas));
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
 // $('#srcImage').attr('width',currentData.width);
 // $('#srcImage').attr('height',currentData.height);
  $('#images').show();

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


function  updateTextAnimation(currentDataId){
  currentData=slideShowDatas[currentDataId];
  var div_text ='Title : <input type="text" size="50" id="updatetitle" value="'+currentData.title+'"/><br>';
  div_text+='SubTitle :<input type="text" size="50" id="updatesubtitle" value="'+currentData.subTitle+'"/><br>';
  div_text+='Text : <textarea id="updatelines" rows="10" cols="100">';
  currentData.lines.forEach(object => div_text=div_text+object.line+'\n');
  div_text+='</textarea>'; 
  div_text+='<br><a class="js-open-modal btn" href="#" save-media="save-media" title="Modify" onclick="saveTextAnimation('+currentDataId+');"><i class="fa fa-pencil-square fa-2x"></i></a></td>';
  $("#updatetexte").html(div_text);  
  $('#updatetexte').show();

}
function  saveTextAnimation(currentDataId){
  currentData=slideShowDatas[currentDataId];
  currentData["title"]=$('#updatetitle').val();
  currentData["subTitle"]=$('#updatesubtitle').val();
  var dataLine= $('#updatelines').val().split('\n');
  currentData["lines"]=[];
  dataLine.forEach(object => currentData["lines"].push({"line": object }));
  
  $('#updatetexte').hide();
}


function playText(currentData){
  var div_data ='<div class="title">'
  + '<p>'+currentData.title+'</p>'
  + '<h1>'+currentData.subTitle+'</h1></div>' ;
  currentData.lines.forEach(object => div_data=div_data+'<p>'+object.line+'<p>');
  div_data=div_data+"</div>"                     

  $("#divCrawl").html(div_data);                     
  $('#textes').show(); 
  
};