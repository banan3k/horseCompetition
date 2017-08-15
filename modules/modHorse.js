/* jshint devel:true */
var module;
var exports = module.exports = {};

exports.test = function test(mode)
{
    console.log("testowaie"+ mode);
};


//var ModelKon = ModelKon || {};
//var reloadAdmina = reloadAdmina || {};



exports.createHorses = function createHorses(ModelKon,imie, plec, hodowca,reloadAdmina)
{
    var nowyKon = new ModelKon({
        imie: imie,
        plec: plec,
	    hodowca: hodowca
    });
    nowyKon.save(function (err, item) {
        console.log("dodano konia!");  
        reloadAdmina(0);
    });
    
};

exports.readHorses = function readHorses(ModelKon,callback)
{ 
    //console.log(ModelKon);
    ModelKon.find({},{imie:true,plec:true, hodowca:true,_id:false,}, function (err, zwracanaWartosc) {
        callback(zwracanaWartosc);
    });
};

exports.removeHorse = function removeHorse(ModelKon, imie, hodowca, callback)
{
    ModelKon.remove({imie: imie, hodowca: hodowca},function (err, zwracanaWartosc) {
       callback("true");
    });     
};


exports.updateHorse = function updateHorse(ModelKon,imieStare, imieNowe, hodowcaStare, hodowcaNowe, plec, callback)
{
    if(imieNowe!==undefined)
    {
         ModelKon.update({imie: imieStare, hodowca: hodowcaStare}, {$set: {"imie": imieNowe}}, 
                function (err) {
                    console.log("zaktualizowano konia");
                     callback("true");
                }
        );
    }
    else if(hodowcaNowe!==undefined)
    {
        ModelKon.update({imie: imieStare, hodowca: hodowcaStare}, {$set: {"hodowca": hodowcaNowe}}, 
                function (err) {
                    console.log("zaktualizowano konia");
                     callback("true");
                }
        );
    }
    else
    {
         ModelKon.update({imie: imieStare, hodowca: hodowcaStare}, {$set: {"plec": plec}}, 
                function (err) {
                    console.log("zaktualizowano konia");
     callback("true");
                }
        );
    }
};