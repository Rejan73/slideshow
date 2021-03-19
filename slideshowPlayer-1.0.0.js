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
              $('#video').get(0).webkitExitFullscreen();
              currentDataId++;
              runAnimation();
    });
  });
})(jQuery);

var openFile = function(event) {
        var input = event.target;
        var reader = new FileReader();
        reader.onload = function(){
          slideShowDatas = JSON.parse(reader.result);
        };
        reader.readAsText(input.files[0]);
      };

$('a[start-slideshow-id]').click(function(e) {
   runAnimation();
});

$('a[config-id]').click(function(e) {
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
  $('#srcImage').attr('width',currentData.width);
  $('#srcImage').attr('height',currentData.height);
  $('#images').show();
  currentDataId++;
  window.setTimeout( runAnimation, currentData.duration*1000);
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
  var div_data ='<div class="title">'
  + '<p>'+currentData.title+'</p>'
  + '<h1>'+currentData.subTitle+'</h1></div>' ;
  currentData.lines.forEach(object => div_data=div_data+'<p>'+object.line+'<p>');
  div_data=div_data+"</div>"                     

  $("#divCrawl").html(div_data);                     
  $('#textes').show(); 
  currentDataId++;
  window.setTimeout( runAnimation, currentData.duration*1000);
};
