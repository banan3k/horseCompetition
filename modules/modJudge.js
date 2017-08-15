/* jshint devel:true */
var module;
var exports = module.exports = {};


exports.removeJudge = function removeJudge(Model,imie, nazwisko, callback)
{
    Model.remove({imie: imie, nazwisko: nazwisko},function (err, zwracanaWartosc) {
       console.log("usunieto: "+imie+" "+nazwisko);
        callback("true");
    });     
};

exports.createJudges = function createJudges(reloadAdmina,Model,imie, nazwisko, haslo)
{

    console.log("hashed: "+haslo);
    var nowySedzia = new Model({
        imie: imie,
        nazwisko: nazwisko,
	    haslo: haslo
    });
    nowySedzia.save(function (err, item) {
        //console.dir(err);
        console.log("dodano sedziego!");  
        reloadAdmina(1);
    });
    
};
exports.readJudges = function readJudges(Model,callback)
{ 
    Model.find({},{imie:true,nazwisko:true, _id:false}, function (err, zwracanaWartosc) {
        callback(zwracanaWartosc);
    });
};



exports.updateJudge = function updateJudge(Model,imieStare, imieNowe, nazwiskoNowe, nazwiskoStare, haslo, callback)
{
    if(imieNowe!==undefined)
    {
         Model.update({imie: imieStare, nazwisko: nazwiskoStare}, {$set: {"imie": imieNowe}}, 
                function (err) {
                    console.log("zaktualizowano sedziego");
             
                     callback("true");
             
                }
        );
    }
    else if(nazwiskoNowe!==undefined)
    {
        Model.update({imie: imieStare, nazwisko: nazwiskoStare}, {$set: {"nazwisko": nazwiskoNowe}}, 
                function (err) {
                    console.log("zaktualizowano sedziego");
                     callback("true");
                    
                }
        );
    }
    else
    {
         Model.update({imie: imieStare, nazwisko: nazwiskoStare}, {$set: {"haslo": haslo}}, 
                function (err) {
                    console.log("zaktualizowano sedziego");
                    callback("true");
                    
                }
        );
    }
    
};