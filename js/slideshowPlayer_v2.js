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

var slideShowObjects;
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
        slideShowObjects = data;
    });  
  });
})(jQuery);

var openFile = function(event) {
        var input = event.target;
        var reader = new FileReader();
        reader.onload = function(){
          slideShowObjects = JSON.parse(reader.result);
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

function createObjectText(slideShowObject){
  var elem = document.createElement("div");
  elem.id= slideShowObject["name"];
  elem.innerHTML+=slideShowObject["txt"];
  //border: solid red;
  elem.style.cssText = addStyleText(slideShowObject);
  document.getElementById("playSlideShow").appendChild(elem);
}

function createObjectVideo(slideShowObject){
  var elem = document.createElement("video");
  elem.id= slideShowObject["name"];
  elem.src=slideShowObject["file"];
  elem.style.cssText = addStyle(slideShowObject);
  document.getElementById("playSlideShow").appendChild(elem);
}

function createObjectImage(slideShowObject){
  var elem = document.createElement("img");
  elem.id= slideShowObject["name"];
  elem.src=slideShowObject["file"];
  elem.style.cssText = addStyle(slideShowObject);
  document.getElementById("playSlideShow").appendChild(elem);
 
}
function createObjectMusic(slideShowObject){
  var elem = document.createElement("audio");
  elem.id= slideShowObject["name"];
  elem.src=slideShowObject["file"];
  elem.style.cssText = addStyle(slideShowObject);
  document.getElementById("playSlideShow").appendChild(elem);
}

function addStyle(slideShowObject){
  top=slideShowObject["top"];
  left=slideShowObject["left"];
  width=slideShowObject["width"];
  height=slideShowObject["height"];
  return 'display:none;object-fit:contain;position:absolute;top:'
    +top+'px;left:'
    +left+'px;width:'
    +width+'px;height:'
    +height+'px;z-index:'
    +slideShowObject["z-index"]+';';
}

function addStyleText(slideShowObject){
  top=slideShowObject["top"];
  left=slideShowObject["left"];
  width=slideShowObject["width"];
  height=slideShowObject["height"];
  return 'display:none;object-fit:contain;position:absolute;top:'
    +top+'px;left:'
    +left+'px;width:'
    +width+'px;height:'
    +height+'px;z-index:'
    +slideShowObject["z-index"]+';font-size:'
    +slideShowObject["fontsize"]+'px;font-family:'
    +slideShowObject["font"]+';color:'
    +slideShowObject["fontcolor"]+';';
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
      document.getElementById("playSlideShow").removeChild(elem);
    }, duration*1000);
  }, slideShowObject["comingAt"]*1000);  
  return elem;
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

function runAnimation(){
  $("#configurationSlideShow").hide();
  slideShowObjects.forEach(slideShowObject => createAndRunAnimation(slideShowObject));
  return "Let's go !"
}