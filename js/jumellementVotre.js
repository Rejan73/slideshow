/*!
 * SlideshowPlayer Library v1.0.0
 *
 * Date: 2021-03-19T08:00Z
 */
var chloeIndentity=new Array();	
chloeIndentity[0]="photos/identite/chloe2002.jpg";
chloeIndentity[1]="photos/identite/chloeBebe.jpg";
chloeIndentity[2]="photos/identite/chloe2003.jpg";
chloeIndentity[3]="photos/identite/chloe2005.jpg";
chloeIndentity[4]="photos/identite/chloe2005-2006.jpg";
chloeIndentity[5]="photos/identite/chloe2006-2007.jpg";
chloeIndentity[6]="photos/identite/chloe2007-2008.jpg";
chloeIndentity[7]="photos/identite/chloe2008-2009.jpg";
chloeIndentity[8]="photos/identite/chloe2009-2010.jpg";
chloeIndentity[9]="photos/identite/chloe2010-2011.jpg";
chloeIndentity[10]="photos/identite/chloe2011-2012.jpg";
chloeIndentity[11]="photos/identite/chloe2012-2013.jpg";
chloeIndentity[12]="photos/identite/chloe2013-2014.jpg";
chloeIndentity[13]="photos/identite/chloe2015.jpg";
chloeIndentity[14]="photos/identite/chloe2016.jpg";
chloeIndentity[15]="photos/identite/chloe2017.jpg";
chloeIndentity[16]="photos/identite/chloe2018.jpg";
chloeIndentity[17]="photos/identite/chloe2019.jpg";
chloeIndentity[18]="photos/identite/chloe2020.jpg";

var sarahIdentity=new Array();
sarahIdentity[0]="photos/identite/sarah2002.jpg";
sarahIdentity[1]="photos/identite/sarahBebe.jpg";
sarahIdentity[2]="photos/identite/sarah2003.jpg";
sarahIdentity[3]="photos/identite/sarah2005.jpg";
sarahIdentity[4]="photos/identite/sarah2005-2006.jpg";
sarahIdentity[5]="photos/identite/sarah2006-2007.jpg";
sarahIdentity[6]="photos/identite/sarah2007-2008.jpg";
sarahIdentity[7]="photos/identite/sarah2008-2009.jpg";
sarahIdentity[8]="photos/identite/sarah2009-2010.jpg";
sarahIdentity[9]="photos/identite/sarah2009-2011.jpg";
sarahIdentity[10]="photos/identite/sarah2011-2012.jpg";
sarahIdentity[11]="photos/identite/sarah2012-2013.jpg";
sarahIdentity[12]="photos/identite/sarah2013-2014.jpg";
sarahIdentity[13]="photos/identite/sarah2015.jpg";
sarahIdentity[14]="photos/identite/sarah2016.jpg";
sarahIdentity[15]="photos/identite/sarah2017.jpg";
sarahIdentity[16]="photos/identite/sarah2018.jpg";
sarahIdentity[17]="photos/identite/sarah2019.jpg";
sarahIdentity[18]="photos/identite/sarah2020.jpg";

var chloeGauche=new Array();	
chloeGauche[0]="photos/gauche/chloeDoudou.png";
chloeGauche[1]="photos/GX.png";
chloeGauche[2]="photos/GX.png";
chloeGauche[3]="photos/gauche/G2004.png";
chloeGauche[4]="photos/GX.png";
chloeGauche[5]="photos/gauche/G2006.png";
chloeGauche[6]="photos/GX.png";
chloeGauche[7]="photos/GX.png";
chloeGauche[8]="photos/GX.png";
chloeGauche[9]="photos/GX.png";
chloeGauche[10]="photos/GX.png";
chloeGauche[11]="photos/GX.png";
chloeGauche[12]="photos/GX.png";
chloeGauche[13]="photos/GX.png";
chloeGauche[14]="photos/GX.png";
chloeGauche[15]="photos/gauche/G2018.png";
chloeGauche[16]="photos/GX.png";
chloeGauche[17]="photos/GX.png";
chloeGauche[18]="photos/GX.png";

var sarahDroite=new Array();
sarahDroite[0]="photos/droite/sarahDoudou.png";
sarahDroite[1]="photos/DX.png";
sarahDroite[2]="photos/DX.png";
sarahDroite[3]="photos/droite/D2004.png";
sarahDroite[4]="photos/DX.png";
sarahDroite[5]="photos/DX.png";
sarahDroite[6]="photos/DX.png";
sarahDroite[7]="photos/droite/D2008.png";
sarahDroite[8]="photos/DX.png";
sarahDroite[9]="photos/DX.png";
sarahDroite[10]="photos/DX.png";
sarahDroite[11]="photos/droite/D2013.png";
sarahDroite[12]="photos/droite/D2014.png";
sarahDroite[13]="photos/DX.png";
sarahDroite[14]="photos/DX.png";
sarahDroite[15]="photos/droite/D2018.png";
sarahDroite[16]="photos/DX.png";
sarahDroite[17]="photos/droite/D2020.png";
sarahDroite[18]="photos/droite/D2021.png";

var cptIdentity=0;


function playSoundMusic(soundFile){
    $('#srcMusic').attr('src',soundFile);
    $('#music')[0].load();
    //$('#musics').show();
    $('#music').get(0).play();
};

function letsGo(){
	$('#srcPlay').hide();
	
	playSoundMusic("musics/amicalementVotre.m4a");
	i=0;
	if (i==0){
	$('#playIntro').show();
		setTimeout(function() {
			$('#playIntro').hide();
			$('#playSlideShow').show();
			playIdentity();
		}, 7*1000);
    }else {	
		$('#playFinal').show();
	}
}

function playIdentity(){
	$('#srcPhotoGauche').attr('src',chloeIndentity[cptIdentity]);
	$('#srcPhotoDroite').attr('src',sarahIdentity[cptIdentity]);

	$('#srcImageGauche').attr('src',chloeGauche[cptIdentity]);
	$('#srcImageDroite').attr('src',sarahDroite[cptIdentity]);
	if (cptIdentity==1){
		playMovie("videos/bebes.mp4",10);
	}
	cptIdentity++;
	if (cptIdentity<chloeIndentity.length){
		setTimeout(function() {
			playIdentity()
		}, 6*1000);
    } else{
		$('#playSlideShow').hide();
		$('#playFinal').show();
	}
}

function playMovie(movieFile,duration){
   $('#srcVideoDroite').attr('src',movieFile);
    $('#videoDroite')[0].load();
    $('#divDroiteVideo').show();
    $('#videoDroite').get(0).play();
	setTimeout(function() {
		$('#divDroiteVideo').hide();
	}, duration*1000) ;
    
}
