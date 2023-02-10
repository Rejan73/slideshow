/*!
 * SlideshowPlayer Library v1.0.0
 *
 * Date: 2021-03-19T08:00Z
 */
var chloeIndentity=new Array();	
chloeIndentity[0]="photos/identite/chloe2002.png";
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
chloeIndentity[19]="photos/identite/chloe2002.png";

var sarahIdentity=new Array();
sarahIdentity[0]="photos/identite/sarah2002.png";
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
sarahIdentity[19]="photos/identite/sarah2002.png";

var chloeGauche=new Array();	
chloeGauche[0]="photos/gauche/FairePart.png";
chloeGauche[1]="photos/gauche/G2003.jpg";
chloeGauche[2]="photos/gauche/G2004.png";
chloeGauche[3]="photos/GX.png";
chloeGauche[4]="photos/gauche/G2006.png";
chloeGauche[5]="photos/gauche/G2007.jpg";
chloeGauche[6]="photos/gauche/G2008.jpg";
chloeGauche[7]="photos/gauche/G2009.jpg";
chloeGauche[8]="photos/gauche/G2010.jpg";
chloeGauche[9]="photos/gauche/G2011.jpg";
chloeGauche[10]="photos/gauche/G2012.jpg";
chloeGauche[11]="photos/gauche/G2013.jpg";
chloeGauche[12]="photos/gauche/G2014.jpg";
chloeGauche[13]="photos/gauche/G2015.jpg";
chloeGauche[14]="photos/gauche/G2016.jpg";
chloeGauche[15]="photos/gauche/G2017.jpg";
chloeGauche[16]="photos/gauche/G2018.png";
chloeGauche[17]="photos/gauche/G2019.png";
chloeGauche[18]="photos/gauche/G2020.png";
chloeGauche[19]="photos/gauche/G2021.jpg";

var sarahDroite=new Array();
sarahDroite[0]="photos/droite/FairePartText.png";
sarahDroite[1]="photos/droite/D2003.jpg";
sarahDroite[2]="photos/droite/D2004.png";
sarahDroite[3]="photos/droite/D2005.jpg";
sarahDroite[4]="photos/droite/D2006.jpg";
sarahDroite[5]="photos/droite/D2007.jpg";
sarahDroite[6]="photos/droite/D2008.png";
sarahDroite[7]="photos/droite/D2009.jpg";
sarahDroite[8]="photos/droite/D2010.jpg";
sarahDroite[9]="photos/droite/D2011.jpg";
sarahDroite[10]="photos/droite/D2012.jpg";
sarahDroite[11]="photos/droite/D2013.jpg";
sarahDroite[12]="photos/droite/D2014-2.jpg";
sarahDroite[13]="photos/DX.png";
sarahDroite[14]="photos/droite/D2016.jpg";
sarahDroite[15]="photos/droite/D2017.png";
sarahDroite[16]="photos/droite/D2018.png";
sarahDroite[17]="photos/droite/D2019.png";
sarahDroite[18]="photos/droite/D2020.png";
sarahDroite[19]="photos/droite/D2021.png";

var cptIdentity=0;


function playSoundMusic(soundFile){
    $('#srcMusic').attr('src',soundFile);
    $('#music')[0].load();
    //$('#musics').show();
    $('#music').get(0).play();
};

function letsGo(){
	$('#srcPlay').hide();
	$('#srcCDoudou').hide();
	$('#srcSDoudou').hide();
	
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
		playMovie("videos/bebes.mp4",6);
	}
	$("#age").text(2002+cptIdentity);
	
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
