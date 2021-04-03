/*!
 * SlideshowPlayer Library v1.0.0
 *
 * Date: 2021-03-19T08:00Z
 */
function hideAll(){
    $('#srcVideo').attr('src','');
    $('#videos').hide();
    $('#images').hide();
    $('#musics').hide();
    $('#textes').hide();
    $('#configurationSlideShow').hide();
}

function stopMusic(){
    $('#music').get(0).pause();
    $('#srcMusic').attr('src','');
}

var slideShowDatas;
var currentDataId=0;

(function($) {
  $(document).ready(function(){
    currentDataId=0;
    // ajout du listener
    $('#video').get(0).addEventListener('pause', function(e) {
              //$('#video').get(0).exitFullscreen();
              currentDataId++;
              runAnimation();
    });
    $.getJSON('slideshowDataDemo.json', function(data) {         
        slideShowDatas = data;
    });  
  });
})(jQuery);

var openFile = function(event) {
        var input = event.target;
        var reader = new FileReader();
        reader.onload = function(){
          slideShowDatas = JSON.parse(reader.result);
          currentDataId=0;
          $('#idSlideShow').val(currentDataId);
        };
        reader.readAsText(input.files[0]);
      };

$('a[start-slideshow-id]').click(function(e) {
   runAnimation();
});

$('a[config-id]').click(function(e) {
   $('#idSlideShow').val(currentDataId);
   $('#configurationSlideShow').toggle();
});
$('a[set-slideshow-id]').click(function(e) {
   currentDataId =$('#idSlideShow').val();
});


function runAnimation(){
  hideAll();
  if (currentDataId>=slideShowDatas.length){
    console.log('fini');
    return null;
  }
  var currentData=slideShowDatas[currentDataId];
  switch (currentData.media)
  {
    case "mp3":
         playMusic(currentData);
         break;
    case "mp4":
         stopMusic();
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
  $('#images').show();
  oldcurrentDataId=currentDataId;
  currentDataId++;
  setTimeout(function() {            
    $("#images").removeClass(currentData["comeInEffect"]);
    $("#images").removeClass(currentData["movementEffect"]);
    $("#images").addClass(currentData["comeOutEffect"]);
    if ("comeOutEffectShowNextImage"==currentData["comeOutEffect"]){
      $('#srcNextImage').attr('src',currentData.file);
      $("#nextImage").addClass("comeOutEffectShowNextImage2"); 
      $('#nextImage').show(); 
      if (currentDataId+1<slideShowDatas.length && slideShowDatas[oldcurrentDataId+1].media=="img"){
        $('#srcImage').attr('src',slideShowDatas[oldcurrentDataId+1].file);
      }
    }
  }, currentData["duration"]*1000);
 
  durationEffect=2000;
  if ("comeOutEffectShowNextImage"==currentData["comeOutEffect"]){
    durationEffect=5000;
  }
  
  setTimeout(function() { 
    $("#images").removeClass(currentData["styleEffect"]);
    $("#images").removeClass(currentData["comeOutEffect"]);
    if ("comeOutEffectShowNextImage"==currentData["comeOutEffect"]){
      $('#srcNextImage').attr('src','');
      $("#nextImage").removeClass("comeOutEffectShowNextImage2"); 
      $('#nextImage').hide(); 
    }     
    runAnimation();
  }, currentData["duration"]*1000+durationEffect) ;
  

};

function playMovie(currentData){
    $('#srcVideo').attr('src',currentData.file);
    $('#video')[0].load();
    $('#videos').show();
    //$('#video').get(0).requestFullscreen();
    $('#video').get(0).play();
    
}
  
function playMusic(currentData){
  $('#srcMusic').attr('src',currentData.file);
  $('#music')[0].load();
  //$('#musics').show();
  $('#music').get(0).play();
  currentDataId++;
  runAnimation();
};

function playText(currentData){
  if (currentData.styleEffect=='starwars'){
    var div_data ='<p id="startStarWars">Il y a bien longtemps, dans une galaxie lointaine, tr&egrave;s lontaine</p>';
    div_data+='<h1 id="h1StarWars">'+currentData.title+'</h1>';
    div_data+='<div id="titlesStarWars">';
    div_data+='<div id="titlecontentStarWars">';
    div_data+='<p class="centerStarWars">'+currentData.subTitle+'</p>';
    currentData.lines.forEach(object => div_data=div_data+'<p>'+object.line+'<p>');
    div_data+="</div></div>";   
    $("#divText").html(div_data);    
    $('#textes').show();
  } else {  
    var div_data ='<center><h1>'+currentData.title+'</h1><h2>'+currentData.subTitle+'</h2>' ;
    currentData.lines.forEach(object => div_data=div_data+'<p>'+object.line+'<p>');
    div_data+='<br></center>';
    $("#textes").addClass(currentData["styleEffect"]);
    $("#textes").addClass(currentData["comeInEffect"]);
    $("#textes").addClass(currentData["movementEffect"]);
    $("#divText").html(div_data);
    $("#divCrawl").html("");
    $('#textes').show();
  }    
    currentDataId++;
    
    setTimeout(function() {
      $("#textes").removeClass(currentData["comeInEffect"]);
      $("#textes").removeClass(currentData["movementEffect"]);
      $("#textes").addClass(currentData["comeOutEffect"]);
    }, currentData["duration"]*1000);
  
    setTimeout(function() {
      $("#images").removeClass(currentData["styleEffect"]);
      $("#images").removeClass(currentData["comeOutEffect"]);
      runAnimation();
    }, currentData["duration"]*1000+2000) ;
  
};
