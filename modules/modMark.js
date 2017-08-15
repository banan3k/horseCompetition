/* jshint devel:true */
var module;
var exports = module.exports = {};

exports.updateMarks = function updateMarks(db,ZawodyKon, zmusDoReloadu, ktoryDzial, jakaOcena, nazwaZawodow, idKonia, idSedziego)
{
   var ocenaString = parseInt(ktoryDzial)+1;
    var ktoraOcena = "ocena"+ocenaString+"Sedzia";
    
   var ocenaDoWstawienia = jakaOcena+"-"+idSedziego+"+";
    var modelDlaKoniOceny = db.model('zawodykon'+nazwaZawodow, ZawodyKon);
    
    var daneDoSzukania=[];
    daneDoSzukania=idKonia.split("-");
     console.log("na : "+ktoraOcena+ " vs "+nazwaZawodow);
    console.log("update na :"+daneDoSzukania[0]+" vs "+daneDoSzukania[1]+" vs "+jakaOcena);
    
    /*var swapMark = zwracanaWartosc.ocena1Sedzia;
        var idOfSwap = swapMark.indexOf(idSedziego+"+");
        if(idOfSwap>=0)
        {
            var pattern = new RegExp("[0-9]*.*[0-9]-" + idSedziego + "[+]");
            swapMark = swapMark.replace(pattern,ocenaDoWstawienia);
        }*/
    modelDlaKoniOceny.findOne({imie: daneDoSzukania[0], hodowca: daneDoSzukania[1]}, function (err, zwracanaWartosc) 
    {
        var swapMark, idOfSwap, pattern;
        if(ocenaString==1)
        {
            swapMark = zwracanaWartosc.ocena1Sedzia;
            if(swapMark===undefined)
                swapMark="";
            idOfSwap = swapMark.indexOf(idSedziego+"+");
            if(idOfSwap>=0)
            {
                pattern = new RegExp("[0-9]*.*[0-9]-" + idSedziego + "[+]");
                swapMark = swapMark.replace(pattern,ocenaDoWstawienia);
            }
            else
            {
                swapMark+=ocenaDoWstawienia;
            }
            modelDlaKoniOceny.update({imie: daneDoSzukania[0], hodowca: daneDoSzukania[1]}, {$set: {"ocena1Sedzia": swapMark}}, 
                function (err) {
                    console.log("zaktualizowano ocene");
                    zmusDoReloadu();
                }
            );
        }
        else if(ocenaString==2)
        {
            swapMark = zwracanaWartosc.ocena2Sedzia;
            if(swapMark===undefined)
                swapMark="";
            idOfSwap = swapMark.indexOf(idSedziego+"+");
            if(idOfSwap>=0)
            {
                pattern = new RegExp("[0-9]*.*[0-9]-" + idSedziego + "[+]");
                swapMark = swapMark.replace(pattern,ocenaDoWstawienia);
            }
            else
            {
                swapMark+=ocenaDoWstawienia;
            }
            modelDlaKoniOceny.update({imie: daneDoSzukania[0], hodowca: daneDoSzukania[1]}, {$set: {"ocena2Sedzia": swapMark}}, 
                    function (err) {
                        console.log("zaktualizowano ocene");
                        zmusDoReloadu();
                    }
            );
        }
         else if(ocenaString==3)
        {
            swapMark = zwracanaWartosc.ocena3Sedzia;
            if(swapMark===undefined)
                swapMark="";
            idOfSwap = swapMark.indexOf(idSedziego+"+");
            if(idOfSwap>=0)
            {
                pattern = new RegExp("[0-9]*.*[0-9]-" + idSedziego + "[+]");
                swapMark = swapMark.replace(pattern,ocenaDoWstawienia);
            }
            else
            {
                swapMark+=ocenaDoWstawienia;
            }
            modelDlaKoniOceny.update({imie: daneDoSzukania[0], hodowca: daneDoSzukania[1]}, {$set: {"ocena3Sedzia": swapMark}}, 
                    function (err) {
                        console.log("zaktualizowano ocene");
                        zmusDoReloadu();
                    }
            );
        }
         else if(ocenaString==4)
        {
            swapMark = zwracanaWartosc.ocena4Sedzia;
            if(swapMark===undefined)
                swapMark="";
            idOfSwap = swapMark.indexOf(idSedziego+"+");
            if(idOfSwap>=0)
            {
                pattern = new RegExp("[0-9]*.*[0-9]-" + idSedziego + "[+]");
                swapMark = swapMark.replace(pattern,ocenaDoWstawienia);
            }
            else
            {
                swapMark+=ocenaDoWstawienia;
            }
            modelDlaKoniOceny.update({imie: daneDoSzukania[0], hodowca: daneDoSzukania[1]}, {$set: {"ocena4Sedzia": swapMark}}, 
                    function (err) {
                        console.log("zaktualizowano ocene");
                        zmusDoReloadu();
                    }
            );
        }
         else if(ocenaString==5)
        {
            swapMark = zwracanaWartosc.ocena5Sedzia;
            if(swapMark===undefined)
                swapMark="";
            idOfSwap = swapMark.indexOf(idSedziego+"+");
            if(idOfSwap>=0)
            {
                pattern = new RegExp("[0-9]*.*[0-9]-" + idSedziego + "[+]");
                swapMark = swapMark.replace(pattern,ocenaDoWstawienia);
            }
            else
            {
                swapMark+=ocenaDoWstawienia;
            }
            modelDlaKoniOceny.update({imie: daneDoSzukania[0], hodowca: daneDoSzukania[1]}, {$set: {"ocena5Sedzia": swapMark}}, 
                    function (err) {
                        console.log("zaktualizowano ocene");
                        zmusDoReloadu();
                    }
            );
        }
        
    });
    
};