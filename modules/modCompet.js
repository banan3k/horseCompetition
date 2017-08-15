/* jshint devel:true */
var module;
var exports = module.exports = {};

exports.test = function test(mode)
{
    console.log("testowaie"+ mode);
};

exports.readComptetition = function readComptetition(ModelZawody, callback)
{ 
    ModelZawody.find({},{nazwa:true,data:true, aktualnyEtap:true,maxPunkt:true,calePunkty:true,_id:false,}, function (err, zwracanaWartosc) {
        callback(zwracanaWartosc);
    });
};

function readAsync(db, ZawodySedzia, ZawodyKon, nazwaZawodowTemp, id,callback)
{
   // console.log(db);   
    var sendingValue = {};

        var nazwa = nazwaZawodowTemp;
       console.log("naaa "+db);
        var modelSprawdzSedziego = db.model("zawodysedzia"+nazwa, ZawodySedzia);
        modelSprawdzSedziego.find({},function (err, zwracaniSedziowie) 
        {
            sendingValue["sedziowieAll"+nazwa]=zwracaniSedziowie;
            var modelSprawdzKonie = db.model("zawodykon"+nazwa, ZawodyKon);
            modelSprawdzKonie.find({},function (err, zwracaniKoni) 
            {
                sendingValue["konieAll"+nazwa]=zwracaniKoni;
            
                callback(sendingValue,nazwaZawodowTemp, id);
            });
        });
        
}

exports.readComptetitionFull = function readComptetitionFull(db, ZawodySedzia, ZawodyKon, ModelZawody,callback)
{ 
   
    var sendingValue={};
    var nazwa="";
    var nazwaArr=[];
    ModelZawody.find({},{nazwa:true,data:true, aktualnyEtap:true,maxPunkt:true,calePunkty:true,urlStream:true,_id:false,}, function (err, zwracanaWartosc) 
    {
        var tempStop=0;

        sendingValue.zawodyAll=zwracanaWartosc;
        var licznik=0;
        
        function a(num, nazwa, cou)
        {
             sendingValue["zawodyNr"+cou]=num;
             licznik++;
             if(licznik==zwracanaWartosc.length)
                callback(sendingValue);
        }
        
        for(var i=0; i<zwracanaWartosc.length; i++)
        {          
            nazwa=zwracanaWartosc[i].nazwa;
            readAsync(db, ZawodySedzia, ZawodyKon, nazwa,i,a);
            
        }

    });
};


exports.updateCompetition = function updateCompetition(ModelZawody, zmusDoReloadu, reloadAdmina, nazwa, etap)
{
     ModelZawody.update({"nazwa": nazwa}, {$set: {"aktualnyEtap": etap}}, 
            function (err) {
                console.log("przepchnieto zawody "+nazwa);
                zmusDoReloadu();
         
                reloadAdmina(2);
            }
    );
};


exports.readLengthGroup = function readLengthGroup(db, ZawodySedzia, ZawodyKon, ModelZawody,callback)
{ 
   
    var sendingValue={};
    var nazwa="";
    var nazwaArr=[];
    ModelZawody.find({},{nazwa:true,data:true, aktualnyEtap:true,maxPunkt:true,calePunkty:true,_id:false,}, function (err, zwracanaWartosc) 
    {
        var tempStop=0;
        var licznik=0;
        
        
        function a(num, nazwaa, cou)
        {
              var pelnaNazwaKonia = "konieAll"+nazwaa;
                var dlugoscDoPrzeslania=num[pelnaNazwaKonia].length;
                
                var ileWKazdejGrupie=[];
                
                var tempArrGroup=[];
                var ileGrup=0;
                var isMore=0;
                for(var i2=0; i2<dlugoscDoPrzeslania; i2++)
                {
                    if( ileWKazdejGrupie[num[pelnaNazwaKonia][i2].grupa]===undefined)
                         ileWKazdejGrupie[num[pelnaNazwaKonia][i2].grupa]=0;
                    ileWKazdejGrupie[num[pelnaNazwaKonia][i2].grupa]++;
                    tempArrGroup[i2]=num[pelnaNazwaKonia][i2].grupa;
                    for(var i3=0; i3<i2; i3++)
                    {
                        if(num[pelnaNazwaKonia][i2].grupa==tempArrGroup[i3])
                            isMore=1;
                    }
                    if(isMore===0)
                        ileGrup++;
                    
                        
                }
         
               sendingValue["iloscDla"+cou]=dlugoscDoPrzeslania+"+"+ileGrup;//["konieAlltoo1"];
               sendingValue["konkretne"+cou]=ileWKazdejGrupie;

                licznik++;
                if(licznik==zwracanaWartosc.length)
                    callback(sendingValue);
        }
        
        
        for(var i=0; i<zwracanaWartosc.length; i++)
        {
            nazwa=zwracanaWartosc[i].nazwa;
            nazwaArr[i]=nazwa;
             readAsync(db, ZawodySedzia, ZawodyKon, nazwa,i,a);
            
        }

    });

};

exports.updateCompetition = function updateCompetition(zmusDoReloadu,reloadAdmina,ModelZawody,nazwa, etap)
{
     ModelZawody.update({"nazwa": nazwa}, {$set: {"aktualnyEtap": etap}}, 
            function (err) {
                console.log("przepchnieto zawody "+nazwa);
                zmusDoReloadu();
         
                reloadAdmina(2);
            }
    );
};

exports.updateMarks = function updateMarks(ktoryDzial, db, ZawodyKon,zmusDoReloadu,jakaOcena, nazwaZawodow, idKonia, idSedziego)
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


exports.ogarnijZawody = function ogarnijZawody(db, ZawodyKon, ZawodySedzia, ModelZawody, data)
{
 
        var sedziowie = data.sedziowieString.split(",");
        var konie = data.konieString.split(",");
        var grupaKoni = [];


        var forHowManyRead = data.groupConnection.length;
        var groupingArray = [];
       
        var sedziowiePer = data.iloscPer;
        var licznikTempDlaGrup=0;
        var licznikGlownyDlaGrup=0;
        for(var i2=0; i2<data.groupConnection.length; i2++)
        {
          
                if(groupingArray[ licznikTempDlaGrup]===undefined)
                    groupingArray[ licznikTempDlaGrup]="";
                
               
                if(data.groupConnection[i2]!=',')
                {
                     console.log(data.groupConnection[i2]+" lulu "+sedziowiePer+" and "+licznikTempDlaGrup);
                  //  groupingArray[ licznikTempDlaGrup]+=(data['groupConnection'][i2]+',');
                    groupingArray[ licznikTempDlaGrup]+=(licznikGlownyDlaGrup+',');
                    licznikTempDlaGrup++;
                    if(sedziowiePer==licznikTempDlaGrup)
                    {
                        licznikTempDlaGrup=0;
                        licznikGlownyDlaGrup++;   
                    }
                }
        }
       
        var ModelZawodyKon = db.model('ZawodyKon'+data.nazwaZawodow, ZawodyKon);
        var ModelZawodySedzia = db.model('ZawodySedzia'+data.nazwaZawodow, ZawodySedzia);


        for(var i3=0; i3<konie.length; i3++)
        {
            grupaKoni[i3]=konie[i3][konie[i3].length-2];
            konie[i3]=konie[i3].slice(0, -3);


            var noweZawodyModelKon = new ModelZawodyKon({
            imie: konie[i3].split("-")[0],
            hodowca:  konie[i3].split("-")[1],
            grupa: grupaKoni[i3],
            ocena1Sedzia: "",
            ocena2Sedzia: "",
            ocena3Sedzia: "",
            ocena4Sedzia: "",
            ocena5Sedzia: "",
            ocena1Widz: "",
            ocena2Widz: "",
            ocena3Widz: "",
            ocena4Widz: "",
            ocena5Widz: "",

            iloscOcena1Sedzia: 0,
            iloscOcena2Sedzia: 0,
            iloscOcena3Sedzia: 0,
            iloscOcena4Sedzia: 0,
            iloscOcena5Sedzia: 0,
            iloscOcena1Widz: 0,
            iloscOcena2Widz: 0,
            iloscOcena3Widz: 0,
            iloscOcena4Widz: 0,
            iloscOcena5Widz: 0
            });
            noweZawodyModelKon.save(function (err, item) {});
        }

        for(var i4 =0; i4<sedziowie.length; i4++)
        {
            
            if(groupingArray[i4]!==undefined)
            {
                groupingArray[i4] = groupingArray[i4].slice(0,-1);
            }
            console.log(groupingArray[i4]+ " blad na "+i4);
            
            var noweZawodyModelSedzia = new ModelZawodySedzia({
            imie: sedziowie[i4].split("-")[0],
            nazwisko: sedziowie[i4].split("-")[1],
            grupy: groupingArray[i4],
            ocena1: "",
            ocena2: "",
            ocena3: "",
            ocena4: "",
            ocena5: ""
            });
            noweZawodyModelSedzia.save(function (err, item) {});
        }
        console.log("url : "+data.urlStream);
        var dodajZawody = new ModelZawody({
            nazwa: data.nazwaZawodow,
            data: data.dataZawodow,
            aktualnyEtap: "0-0",
            maxPunkt: data.maxScore,
            calePunkty: data.halfScore,
            urlStream: data.urlStream
        });
        dodajZawody.save(function (err, item) {});


        console.log("stworzono zawody!");

};