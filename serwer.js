/* jshint esnext: true */
/* jshint node: true */

var http = require('http');
var express = require('express');
var async = require('async');

var forceSSL = require('express-force-ssl');
var fs = require('fs');
var https = require('https');
 
var ssl_options = {
  key: fs.readFileSync('./key/my.key'),
  cert: fs.readFileSync('./key/my.crt')
};

var app = express();

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var socketIo = require('socket.io');
var passportSocketIo = require('passport.socketio');
var session = require('express-session');

var passwordHash = require('password-hash');



var mongoose = require('mongoose');
var options = { 
    server: {
        ssl : true,
        sslValidate:false,
    },
};


mongoose.connect('mongodb://localhost/test', options);
var db = mongoose.connection;
var sessionStore = require("connect-mongo")(session);
var sessionData = new sessionStore({ url:"mongodb://localhost/test?ssl=true&sslValidate=false"});

db.on('error', console.error.bind(console,'afera'));
db.once('open', function(callback) {
   console.log('Connected to mongo'); 
    
});


var ConnectRoles = require('connect-roles');
var roles = new ConnectRoles();
roles.admin = {
    id: "admin",
    name: "Admin",
    description: ""
};
roles.sedzia = {
    id: "sedzia",
    name: "Sedzia",
    description: ""
};
roles.widz = {
    id: "widz",
    name: "Widz",
    description: ""
};


var user = new ConnectRoles({
  failureHandler: function (req, res, action) {

      
   
    var accept = req.headers.accept || '';
    res.status(403);
    if (~accept.indexOf('html')) {
      res.render('access-denied', {action: action});
    } else {
      res.send('Access Denied - You don\'t have permission to: ' + action);
    }
  }
});



var sessionSecret = 'wielkiSekret44';
var sessionKey = 'express.sid';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});


var zawodySchema = mongoose.Schema({
        nazwa: String,
        data: String,
        aktualnyEtap: String,
        maxPunkt: String,
        calePunkty: String,
        urlStream: String
        
});

var ZawodyKon = mongoose.Schema({
        imie: String,
        hodowca: String,
        grupa: String,
        ocena1Sedzia: String,
        ocena2Sedzia: String,
        ocena3Sedzia: String,
        ocena4Sedzia: String,
        ocena5Sedzia: String,
        ocena1Widz: String,
        ocena2Widz: String,
        ocena3Widz: String,
        ocena4Widz: String,
        ocena5Widz: String,
    
        iloscOcena1Sedzia: Number,
        iloscOcena2Sedzia: Number,
        iloscOcena3Sedzia: Number,
        iloscOcena4Sedzia: Number,
        iloscOcena5Sedzia: Number,
        iloscOcena1Widz: Number,
        iloscOcena2Widz: Number,
        iloscOcena3Widz: Number,
        iloscOcena4Widz: Number,
        iloscOcena5Widz: Number
});
var ZawodySedzia = mongoose.Schema({
        imie: String,
        nazwisko: String,
        grupy: String,
        ocena1: String,
        ocena2: String,
        ocena3: String,
        ocena4: String,
        ocena5: String
});



var wynikLogowania;
var People = mongoose.Schema({
    imie: String,
    nazwisko: String,
    haslo: String
});
var Horses = mongoose.Schema({
    imie: String,
    plec: String,
    hodowca: String
});
var Admin = mongoose.Schema({
    nick: String,
    haslo: String
});
var ModelZawody = db.model('ZawodyAll', zawodySchema);
var Model = db.model('Sedziowie', People);
var ModelKon = db.model('Konie', Horses);
var ModelAdmin = db.model('Admin', Admin);
function checkLoginPoss(loginM, passwordM, callback)
{
    var daneDoLogowania = loginM.slice( 1 );
    
    /*var hasha = passwordHash.generate("tajne");
     var nowyAdmin = new ModelAdmin({
        nick: "admin",
       
	    haslo: hasha
    });
    nowyAdmin.save(function (err, item) {
        console.log("dodano admina!");  
       
    });*/
    
    ModelAdmin.findOne({nick: loginM}, function (err, zwracanaWartosc) {

          // console.log(loginM+" vs "+passwordM+" vs "+zwracanaWartosc);
            doWithVal(zwracanaWartosc);
            var hashedBefore=""; 
            if(zwracanaWartosc===null)
            {
                 
               

                Model.findOne({ nazwisko: daneDoLogowania }, function (err, zwracanaWartosc) {
                    if(zwracanaWartosc!==null)
                    {

                        console.log(zwracanaWartosc+" and");
                        hashedBefore=zwracanaWartosc.haslo;

                        
                        if(passwordHash.verify(passwordM,hashedBefore)===true)
                        {
                            doWithVal(zwracanaWartosc);
                            console.log(passwordHash.verify(passwordM,hashedBefore));
                            callback("sedzia");
                            //if(zwracanaWartosc!=null)

                        }
                        else
                            callback("");
                    }
                    else 
                        callback("");

                });
            }
            else
            {
              //  console.log("afera "+zwracanaWartosc);
                hashedBefore=zwracanaWartosc.haslo;
                console.log(hashedBefore+" vs "+passwordM);
                if(passwordHash.verify(passwordM,hashedBefore)===true)
                {
                    callback("admin");
                }
                else
                    callback(""); 
                
                
            }
    });
    
    /*if(loginM!="admin")
    {
        var hashedBefore=""; 

        Model.findOne({ nazwisko: daneDoLogowania }, function (err, zwracanaWartosc) {
            if(zwracanaWartosc!==undefined)
            {

                console.log(zwracanaWartosc.haslo);
                hashedBefore=zwracanaWartosc.haslo;

                console.log(passwordHash.verify(passwordM,hashedBefore));
                if(passwordHash.verify(passwordM,hashedBefore)===true)
                {
                    doWithVal(zwracanaWartosc);
                    //if(zwracanaWartosc!=null)

                }
            }
            callback();

        });
    }
    else
    {
    
    
        ModelAdmin.findOne({ nick: loginM, haslo: passwordM }, function (err, zwracanaWartosc) {

            console.log(zwracanaWartosc);
            doWithVal(zwracanaWartosc);
            //if(zwracanaWartosc!=null)
            callback();
        });
    }*/
}
function doWithVal(val)
{
    wynikLogowania=val;
}


/*function removeJudge(imie, nazwisko, callback)
{
    Model.remove({imie: imie, nazwisko: nazwisko},function (err, zwracanaWartosc) {
       console.log("usunieto: "+imie+" "+nazwisko);
        callback("true");
    });     
}
function removeHorse(imie, hodowca, callback)
{
    ModelKon.remove({imie: imie, hodowca: hodowca},function (err, zwracanaWartosc) {
       callback("true");
    });     
}

function updateHorse(imieStare, imieNowe, hodowcaStare, hodowcaNowe, plec, callback)
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
}
function updateJudge(imieStare, imieNowe, nazwiskoNowe, nazwiskoStare, haslo, callback)
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
    
}



function createJudges(imie, nazwisko, haslo)
{
    //var hashedPassword = passwordHash.generate(haslo);
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
    
}



function createHorses(imie, plec, hodowca)
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
    
}
function readJudges(callback)
{ 
    Model.find({},{imie:true,nazwisko:true, _id:false}, function (err, zwracanaWartosc) {
        
        callback(zwracanaWartosc);
    });
}
function readHorses(callback)
{ 
    ModelKon.find({},{imie:true,plec:true, hodowca:true,_id:false,}, function (err, zwracanaWartosc) {
        callback(zwracanaWartosc);
    });
}
function readComptetition(callback)
{ 
    ModelZawody.find({},{nazwa:true,data:true, aktualnyEtap:true,maxPunkt:true,calePunkty:true,_id:false,}, function (err, zwracanaWartosc) {
        callback(zwracanaWartosc);
    });
}*/


/*function readAsync(nazwaZawodowTemp, id,callback)
{
       var sendingValue = {};

        var nazwa = nazwaZawodowTemp;
       
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
        
}*/



/*function readComptetitionFull(callback)
{ 

    var sendingValue={};
    var nazwa="";
    var nazwaArr=[];
    ModelZawody.find({},{nazwa:true,data:true, aktualnyEtap:true,maxPunkt:true,calePunkty:true,urlStream:true,_id:false,}, function (err, zwracanaWartosc) 
    {
       // console.log(zwracanaWartosc);
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
            readAsync(nazwa,i,a);
            
        }

    });

}*/

/*function readLengthGroup(callback)
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
            readAsync(nazwa,i,a);
            
        }

    });

}*/

function updateCompetition(nazwa, etap)
{
     ModelZawody.update({"nazwa": nazwa}, {$set: {"aktualnyEtap": etap}}, 
            function (err) {
                console.log("przepchnieto zawody "+nazwa);
                zmusDoReloadu();
         
                reloadAdmina(2);
            }
    );
}

/*function updateMarks(ktoryDzial, jakaOcena, nazwaZawodow, idKonia, idSedziego)
{
   var ocenaString = parseInt(ktoryDzial)+1;
    var ktoraOcena = "ocena"+ocenaString+"Sedzia";
    
   var ocenaDoWstawienia = jakaOcena+"-"+idSedziego+"+";
    var modelDlaKoniOceny = db.model('zawodykon'+nazwaZawodow, ZawodyKon);
    
    var daneDoSzukania=[];
    daneDoSzukania=idKonia.split("-");
     console.log("na : "+ktoraOcena+ " vs "+nazwaZawodow);
    console.log("update na :"+daneDoSzukania[0]+" vs "+daneDoSzukania[1]+" vs "+jakaOcena);
    
    var swapMark = zwracanaWartosc.ocena1Sedzia;
        var idOfSwap = swapMark.indexOf(idSedziego+"+");
        if(idOfSwap>=0)
        {
            var pattern = new RegExp("[0-9]*.*[0-9]-" + idSedziego + "[+]");
            swapMark = swapMark.replace(pattern,ocenaDoWstawienia);
        }
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
    
}*/



var whereToLogin=0;
passport.use(new LocalStrategy(
    
    function (username, password, done) {
    var daneLog="";    
        async.series([
            function(callback)
            {
                checkLoginPoss(username,password, function(num){daneLog=num; callback(null);});   
            },
            function(callback)
            {
                 console.log("wynik :"+daneLog);
                
                if (daneLog=="admin") {
                    console.log("Udane logowanie admin...");
                    whereToLogin=1;
                     
                    return done(null, {
                        username: username,
                        password: password
                        
                    });
                   
                } else if(daneLog=="sedzia")
                {
                    wynikLogowania=null;
                    whereToLogin=2;
                    console.log("Udane logowanie sedzia...");
                    return done(null, {
                        username: username,
                        
                        password: password
                       
                    });
                } else {
                    return done(null, false);
                }
                
                 callback();
            }
        ]);
        
        
    }
));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    resave: true,
    saveUninitialized: true,
    key: sessionKey,
    secret: sessionSecret,
    store: sessionData
}));
app.use(passport.initialize());
app.use(passport.session());

var modHorse = require('./modules/modHorse.js');
var modJudge = require('./modules/modJudge.js');
var modCompet = require('./modules/modCompet.js');
var modMark = require('./modules/modMark.js');
modHorse.test(1);


app.use(express.static('public'));

var routes = require('./routes');

app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login'
    }),
    function (req, res) 
    {
       
        if(whereToLogin==1)
        {
            req.user.role = 'admin';
            res.redirect('/admin.html');
        }
        else
        {
            req.user.role = 'admin';
            res.redirect('/sedzia.html');
            
        }
    
    
    }
);




 


app.get('/logout', routes.logout);

app.use(user.middleware());
user.use(function (req) {
  if (req.user.role === 'admin') {
    return true;
  }
});


app.get('/addCompetition', function (req, res) {
   
        var rolaDoObslugi = req.user.role.toString();
        if(rolaDoObslugi=="admin")
        {
            
            var nazwa = req.query.nazwa;
            var konie = req.query.konie;
            var sedziowie = req.query.sedziowie;
            var group = req.query.groupConn;
            var dataZawodow = req.query.data;
            var maxScore= req.query.max;
            var halfScore= req.query.half;
            var urlStream= req.query.urlStream;
             var iloscPer= req.query.sedziowiePer;
            console.log(group+" grupa");
            
            var jsonObj = {};
            jsonObj.nazwaZawodow=nazwa;
            jsonObj.dataZawodow=dataZawodow;
            jsonObj.maxScore=maxScore;
            jsonObj.halfScore=halfScore;
            jsonObj.groupConnection=group;
            jsonObj.sedziowieString=sedziowie;
            jsonObj.konieString=konie;
            jsonObj.urlStream=urlStream;
            jsonObj.iloscPer=iloscPer;
            modCompet.ogarnijZawody(db, ZawodyKon, ZawodySedzia, ModelZawody, jsonObj);
            
            var jsonObjOdp= {};
            jsonObjOdp.odp="true";
            
            reloadAdmina(2);
            res.json(jsonObjOdp);
            
        }
    
});

function a(req,res)
{
    
}

app.get('/addJudge', function (req, res) {
    
        var rolaDoObslugi = req.user.role.toString();
        if(rolaDoObslugi=="admin")
        {
            
            var imie = req.query.imie;
            var nazwisko = req.query.nazwisko;
            var haslo = req.query.haslo;
          
            var hashedPassword = passwordHash.generate(haslo);
            modJudge.createJudges(reloadAdmina,Model,imie, nazwisko, hashedPassword);
            
            var jsonObjOdp= {};
            jsonObjOdp.odp="true";
            res.json(jsonObjOdp);
            
        }
   
});
app.get('/addHorse', function (req, res) {
   
        var rolaDoObslugi = req.user.role.toString();
        if(rolaDoObslugi=="admin")
        {
            
            var imie = req.query.imie;
            var plec = req.query.plec;
            var hodowca = req.query.hodowca;
          
             modHorse.createHorses(ModelKon,imie,plec,hodowca, reloadAdmina);
            
           
            var jsonObjOdp= {};
            jsonObjOdp.odp="true";
            res.json(jsonObjOdp);
            
        }
    
});
               
app.get('/addMarkJuries', function (req, res) {
    
        
        var rolaDoObslugi = req.user.role.toString();
        if(rolaDoObslugi=="admin" || rolaDoObslugi=="sedzia")
        {
            modMark.updateMarks(db,ZawodyKon, zmusDoReloadu, req.query.kategoria, req.query.ocena, req.query.nazwa, req.query.kon, req.query.myID);
        }
    
});


app.get('/readJudgeHttp.json', function (req, res) {
    modJudge.readJudges(Model,function(num){
        
     
        var rolaDoObslugi = req.user.role.toString();
        if(rolaDoObslugi=="admin" || rolaDoObslugi=="sedzia")
        {
            var jsonObj = {};
            for(var i=0; i<num.length; i++)
            {
                 jsonObj["sedzia"+i] = {};
                jsonObj["sedzia"+i].imie=num[i].imie;
                jsonObj["sedzia"+i].nazwisko=num[i].nazwisko;
            }
            res.json(jsonObj);
        }
    });
});
app.get('/readHorseHttp.json', function (req, res) {
    modHorse.readHorses(ModelKon,function(num){
        var rolaDoObslugi = req.user.role.toString();
        if(rolaDoObslugi=="admin" || rolaDoObslugi=="sedzia")
        {
            var jsonObj = {};
            for(var i=0; i<num.length; i++)
            {
                jsonObj["kon"+i] = {};
                jsonObj["kon"+i].imie=num[i].imie;
                jsonObj["kon"+i].plec=num[i].plec;
                jsonObj["kon"+i].hodowca=num[i].hodowca;
            }

            res.json(jsonObj);
        }
    });
});

app.get('/removeJudge', function (req, res) {
    var rolaDoObslugi = req.user.role.toString();
    var imie = req.query.imie;
    var nazwisko = req.query.nazwisko;
    if(rolaDoObslugi=="admin")
    {
        modJudge.removeJudge(Model,imie, nazwisko, function(num){
                var jsonObjOdp= {};
                jsonObjOdp.usunieto="true";
                res.json(jsonObjOdp);
                reloadAdmina(1);
        });
    }
});

app.get('/removeHorse', function (req, res) {
    var rolaDoObslugi = req.user.role.toString();
    var imie = req.query.imie;
    var hodowca = req.query.hodowca;
    if(rolaDoObslugi=="admin")
    {
        modHorse.removeHorse(ModelKon, imie, hodowca, function(num){
                var jsonObjOdp= {};
                jsonObjOdp.usunieto="true";
                res.json(jsonObjOdp);
                reloadAdmina(0);
        });
    }
});

app.get('/updateHorse', function (req, res) {
    var rolaDoObslugi = req.user.role.toString();
    var imieStare = req.query.imieStare;
    var imieNowe = req.query.imieNowe;
    var hodowcaStare = req.query.hodowcaStare;
    var hodowcaNowe = req.query.hodowcaNowe;
    var plec = req.query.plec;
    if(rolaDoObslugi=="admin")
    {
         console.log(imieStare+" vs "+hodowcaStare+" vs "+plec);
        modHorse.updateHorse(ModelKon, imieStare, imieNowe, hodowcaStare, hodowcaNowe, plec, function(num){
           
        
            var jsonObjOdp= {};
            jsonObjOdp.zaktualizowano="true";
            res.json(jsonObjOdp);
            reloadAdmina(0);
        });
    }
});
app.get('/updateJudge', function (req, res) {
    var rolaDoObslugi = req.user.role.toString();
    var imieStare = req.query.imieStare;
    var imieNowe = req.query.imieNowe;
    var nazwiskoNowe = req.query.nazwiskoNowe;
    var nazwiskoStare = req.query.nazwiskoStare;
    var haslo = req.query.haslo;
    if(rolaDoObslugi=="admin")
    {
        modJudge.updateJudge(Model,imieStare, imieNowe, nazwiskoNowe, nazwiskoStare, haslo, function(num){
            var jsonObjOdp= {};
            jsonObjOdp.zaktualizowano="true";
            res.json(jsonObjOdp);
            reloadAdmina(1);
        });
        
    }
});


app.get('/readCompetitionHttp.json', function (req, res) {
    modCompet.readComptetition(ModelZawody,function(num){
        var rolaDoObslugi = req.user.role.toString();
        if(rolaDoObslugi=="admin" || rolaDoObslugi=="sedzia")
        {
            var jsonObj = {};

            for(var i=0; i<num.length; i++)
            {
                jsonObj["zawody"+i] = {};
                jsonObj["zawody"+i].nazwa=num[i].nazwa;
                jsonObj["zawody"+i].data=num[i].data;
                jsonObj["zawody"+i].etap=num[i].aktualnyEtap;
                jsonObj["zawody"+i].cale=num[i].calePunkty;
                jsonObj["zawody"+i].max=num[i].maxPunkt;
            }
             res.json(jsonObj);
        }
    });
});

app.get('/getMyData.json', function (req, res) {
    
    
    var num={};
    if(req.user)
    {
        num.imie=req.user.username;
        console.log( num.imie+" imie");
    }
    res.json(num);
});

app.get('/readCompetitionFull.json', function (req, res) {
    modCompet.readComptetitionFull(db, ZawodySedzia, ZawodyKon, ModelZawody,function(num){
           
        var rolaDoObslugi="";
        var jsonObj = {};
        if(req.user)
           rolaDoObslugi = req.user.role.toString();
        if(rolaDoObslugi=="admin" || rolaDoObslugi=="sedzia")
        {
            
            console.log("przechodze");
            
             res.json(num);
        }
        else
             res.json(jsonObj);
    });
});

app.get('/readCompetitionFullWidz.json', function (req, res) {
    
    modCompet.readComptetitionFull(db, ZawodySedzia, ZawodyKon, ModelZawody,function(num){
       
            var jsonObj = {};
            console.log("przechodze");
            
             res.json(num);
        
    });
});

app.get('/readLength.json', function (req, res) {
    modCompet.readLengthGroup(db, ZawodySedzia, ZawodyKon, ModelZawody,function(num){
        var rolaDoObslugi = req.user.role.toString();
        if(rolaDoObslugi=="admin" || rolaDoObslugi=="sedzia")
        {
             res.json(num);
        }
    });
});



var server = http.createServer(app);



var secureServer = https.createServer(ssl_options, app);
var sio = socketIo.listen(secureServer);

var onAuthorizeSuccess = function (data, accept) {
    console.log('Udane połączenie z socket.io');
    accept(null, true);
};

var onAuthorizeFail = function (data, message, error, accept) {
    if (error) {
        throw new Error(message);
    }
    whereToLogin=0;
    console.log('Nieudane połączenie z socket.io:', message);
    accept(null, false);
};

sio.use(passportSocketIo.authorize({
  cookieParser: cookieParser,       // the same cookieParser middleware as registered in express
  key:          sessionKey,         // the name of the cookie storing express/connect session_id
  secret:       sessionSecret,      // the session_secret used to parse the cookie
  store:        sessionData,       // sessionstore – should not be memorystore!
  success:      onAuthorizeSuccess, // *optional* callback on success
  fail:         onAuthorizeFail     // *optional* callback on fail/error
}));


//sio.set('log level', 2); // 3 == DEBUG, 2 == INFO, 1 == WARN, 0 == ERROR


sio.set('transports', ['polling']); 
sio.sockets.on('connection', function (socket) {
    
    socket.emit('news', {
        pozwolenie: whereToLogin
    });
    socket.on('reply', function (data) {
        console.log(data);
    });
     socket.on('przepchnijZawody', function(data){
         //console.log("lol: "+data["nazwa"]);
        modCompet.updateCompetition(ModelZawody, zmusDoReloadu, reloadAdmina,data.nazwa, data.etap);
         
    });
     socket.on('popedz', function(data){
         console.log(data);
         popedzWszystkich();
    });
    
    
    
       
   
  
});

function reloadAdmina(mode)
{
    var coZmienia="";
    if(mode==1)
    {
        coZmienia="sedzia";
    }else if(mode==2)
    {
        coZmienia="zawody";
    }
    else
        coZmienia="kon"; 
    
    sio.sockets.emit('czytajAdmin', {
                co: coZmienia
            });
}

function popedzWszystkich(){
    sio.sockets.emit('popedz', {
            pozwolenie: 1
        });
}
function zmusDoReloadu(){
     sio.sockets.emit('czytaj', {
            pozwolenie: 1
        });
   
}

//zmusDoReloadu();


/*function ogarnijZawody(data)
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

}*/

//80 - http
//443 - https
//forceSSL - express-force-sll
//app.use(forceSSL);
//jak sedzia nie ma co robic to widzi swoje oceny
//widz widzi pelne oceny i ostatniego czastkowe, a admin 

app.use(forceSSL);
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers.host + req.url });
    res.end();
}).listen(80, '192.168.0.105');

/*server.listen(9000, function () {
    console.log('Serwer pod adresem http://localhost:9000/');
});*/
secureServer.listen(443,'192.168.0.105', function () {
    console.log('Serwer pod adresem https://localhost:8000/');
});
