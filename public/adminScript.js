
/* jshint devel:true */
/* jshint esnext: true */


var document;
var $;
var socket, io, window;
function stopMatch(nazwaZawodow, etap)
{
  
    if(etapOgolny[etap][0]<=wszystkieGrupy[etap][0])
    {
        if( etapOgolny[etap][0]>0)
        {
            etapOgolny[etap][1]++;
        }
        else
             etapOgolny[etap][0]++;
       //   alert( etapOgolny[etap]);
        var tempLimit=wszystkieGrupy[etap][1][etapOgolny[etap][0]];
        tempLimit++;
        if(etapOgolny[etap][1]==tempLimit)
        {
            etapOgolny[etap][0]++;
            etapOgolny[etap][1]=0;
        }

        document.getElementById("tekstDoZmian"+etap).innerHTML= "Grupa : "+etapOgolny[etap][0]+"/"+wszystkieGrupy[etap][1];
        document.getElementById("tekstDoZmian"+etap).innerHTML+= "<br>Kon : "+etapOgolny[etap][1]+"/"+wszystkieGrupy[etap][1][etapOgolny[etap][0]];

         socket.emit('przepchnijZawody', {
                etap: etapOgolny[etap][0]+"-"+etapOgolny[etap][1],
                nazwa: nazwaZawodow
            });
        
       
    }
    readCompetition();
   
}

 

function popedz(nazwaZawodow)
{
    socket.emit('popedz', {
              
                coPopedzic: nazwaZawodow
            });
  
}

function createJudges()
{
    var sedziaImie = document.getElementById("sedziaImie").value;
    var sedziaNazwisko = document.getElementById("sedziaNazwisko").value;
    var sedziaHaslo = document.getElementById("sedziaHaslo").value;
  
    $.getJSON("/addJudge?imie="+sedziaImie+"&nazwisko="+sedziaNazwisko+"&haslo="+sedziaHaslo, function(data) 
        {
            alert("dodano sedziego");
            readJudges();
        
            
        });
}
function createHorses()
{
    var konImie = document.getElementById("konImie").value;
    var konPlec = document.getElementById("konPlec").value;
    var konHodowca = document.getElementById("konHodowca").value;
  
    
    $.getJSON("/addHorse?imie="+konImie+"&plec="+konPlec+"&hodowca="+konHodowca, function(data) 
        {
            alert("dodano konia");
            readHorses();
        });
}

var socket = io.connect('//' + window.location.host);
socket.on('popedz', function(data) {
 
});
socket.on('czytaj', function(data) {
 
});

socket.on('czytajAdmin', function(data) {
    
    if(data.co=="sedzia")
        updateDaneSedziego();
    if(data.co=="kon")
        updateDaneKonia();
    if(data.co=="zawody")
        readCompetition();
});




function pokazMenu(ktore)
{
   
    if(ktore===0)
    {
        document.getElementById("listaZawodow").style.display="block";
        document.getElementById("tworzenieZawodow").style.display="none";
        document.getElementById("sedziaField").style.display="none";
        document.getElementById("konField").style.display="none";
    }
    else if(ktore==1)
    {
        document.getElementById("listaZawodow").style.display="none";
        document.getElementById("tworzenieZawodow").style.display="block";
        document.getElementById("sedziaField").style.display="none";
        document.getElementById("konField").style.display="none";
    }
    else if(ktore==2)
    {
        document.getElementById("listaZawodow").style.display="none";
        document.getElementById("tworzenieZawodow").style.display="none";
        document.getElementById("sedziaField").style.display="none";
        document.getElementById("konField").style.display="block";
    }
    else if(ktore==3)
    {
        document.getElementById("listaZawodow").style.display="none";
        document.getElementById("tworzenieZawodow").style.display="none";
        document.getElementById("sedziaField").style.display="block";
        document.getElementById("konField").style.display="none";
    }
    
}

function readJudges()
{
    var licznik=0;
     
     $.getJSON("/readJudgeHttp.json", function(data) 
     {
         document.getElementById("listaSedziow").innerHTML="";
         while(data["sedzia"+licznik]) 
         {
            let imieOsoby=data["sedzia"+licznik].imie;
            let nazwiskoOsoby=data["sedzia"+licznik].nazwisko;
                       
            document.getElementById("listaSedziow").innerHTML+="<input type='checkbox' name='sedziowie' value='"+(imieOsoby+"-"+nazwiskoOsoby)+"'>"+imieOsoby+" "+nazwiskoOsoby+"<br>";
           
             licznik++;
         }
         
         licznik=0;
         document.getElementById("listaSedziowD").innerHTML="";
         
         document.getElementById("listaSedziowD").innerHTML+="<table>";
         while(data["sedzia"+licznik]) 
         {
            let imieOsoby=data["sedzia"+licznik].imie;
            let nazwiskoOsoby=data["sedzia"+licznik].nazwisko;
                       
            document.getElementById("listaSedziowD").innerHTML+="<tr>";
            document.getElementById("listaSedziowD").innerHTML+="<td><span id='daneSedziego"+licznik+"'>"+imieOsoby+" "+nazwiskoOsoby+"</span></td>";
             
              document.getElementById("listaSedziowD").innerHTML+="<td><button onclick='usunSedziego(&quot;"+imieOsoby+"&quot;,&quot;"+nazwiskoOsoby+"&quot;)'>X</button>";
             
              
               document.getElementById("listaSedziowD").innerHTML+="<input type='text' id='changeForJudge"+licznik+"'>";
             
              let selectInner = "<select id='selectValueUpdate2"+licznik+"'><option value='1'>Imie</option><option value='2'>Nazwisko</option><option value='3'>Haslo</option></select>";
              document.getElementById("listaSedziowD").innerHTML+=selectInner;
             
                 document.getElementById("listaSedziowD").innerHTML+="<button onclick='updateSedziego("+licznik+",&quot;"+imieOsoby+"&quot;,&quot;"+nazwiskoOsoby+"&quot;)'>Update</button></td><br>";
             
              
              document.getElementById("listaSedziowD").innerHTML+="</tr>";
             licznik++;
         }
         document.getElementById("listaSedziowD").innerHTML+="</table>";
         alert(document.getElementById("listaSedziowD").innerHTML);
         
     });
  
}
function updateDaneSedziego()
{
    var licznik=0;
    $.getJSON("/readJudgeHttp.json", function(data) 
    {
         while(data["sedzia"+licznik]) 
         {
            let imieOsoby=data["sedzia"+licznik].imie;
            let nazwiskoOsoby=data["sedzia"+licznik].nazwisko;
           
             document.getElementById("daneSedziego"+licznik).innerHTML = imieOsoby+" "+nazwiskoOsoby;
             licznik++;
         }
    });
}


var plciKoni = [];

function usunKonia(imie, hodowca)
{
    $.getJSON("/removeHorse?imie="+imie+"&hodowca="+hodowca, function(data) 
     {
          readHorses();
      });
}
function usunSedziego(imie, nazwisko)
{
    
      $.getJSON("/removeJudge?imie="+imie+"&nazwisko="+nazwisko, function(data) 
     {
          readJudges();
      });
}

function updateKonia(id, imie, hodowca)
{

    var whatSectionChange = document.getElementById("selectValueUpdate"+id).value;
    var valueChanging = document.getElementById("changeForHorse"+id).value;
    if(whatSectionChange==1)
    {
        $.getJSON("/updateHorse?imieNowe="+valueChanging+"&imieStare="+imie+"&hodowcaStare="+hodowca, function(data) 
         {
              readHorses();
         });
    }
    if(whatSectionChange==2)
    {
        $.getJSON("/updateHorse?plec="+valueChanging+"&imieStare="+imie+"&hodowcaStare="+hodowca, function(data) 
         {
              readHorses();
         });
    }
    if(whatSectionChange==3)
    {
        $.getJSON("/updateHorse?hodowcaNowe="+valueChanging+"&imieStare="+imie+"&hodowcaStare="+hodowca, function(data) 
         {
              readHorses();
         });
    }
}
function updateSedziego(id, imie, nazwisko)
{
    var whatSectionChange = document.getElementById("selectValueUpdate2"+id).value;
    var valueChanging = document.getElementById("changeForJudge"+id).value;
    if(whatSectionChange==1)
    {
        $.getJSON("/updateJudge?imieNowe="+valueChanging+"&imieStare="+imie+"&nazwiskoStare="+nazwisko, function(data) 
         {
              readJudges();
         });
    }
    if(whatSectionChange==2)
    {
        $.getJSON("/updateJudge?nazwiskoNowe="+valueChanging+"&imieStare="+imie+"&nazwiskoStare="+nazwisko, function(data) 
         {
              readJudges();
         });
    }
    if(whatSectionChange==3)
    {
        $.getJSON("/updateJudge?haslo="+valueChanging+"&imieStare="+imie+"&nazwiskoStare="+nazwisko, function(data) 
         {
              readJudges();
         });
    }
}

function readHorses()
{
    
    var licznik=0;
     $.getJSON("/readHorseHttp.json", function(data) 
     {
         document.getElementById("listaKoni").innerHTML="";
         while(data["kon"+licznik]) 
         {
             let imieKon=data["kon"+licznik].imie;
             let plecKon=data["kon"+licznik].plec;
             let hodowcaKon=data["kon"+licznik].hodowca;
             
              document.getElementById("listaKoni").innerHTML+="<input type='checkbox' name='konie' value='"+(imieKon+"-"+hodowcaKon)+"'>"+imieKon+" "+plecKon+" "+hodowcaKon;
                
                let selectInner = "<span name='selectOptions'><select id='selectValue"+licznik+"'><option value='1'>1</option></select></span>";
                
                document.getElementById("listaKoni").innerHTML+=selectInner+"<br>";
             
             licznik++;
         }
         
         licznik=0;
         document.getElementById("listaKoniD").innerHTML="";
         while(data["kon"+licznik]) 
         {
             let imieKon=data["kon"+licznik].imie;
             let plecKon=data["kon"+licznik].plec;
             let hodowcaKon=data["kon"+licznik].hodowca;
             
              document.getElementById("listaKoniD").innerHTML+="<span id='daneKonia"+licznik+"'>"+imieKon+" "+plecKon+" "+hodowcaKon+"</span>";
                
                let selectInner = "<span name='selectOptions'><select id='selectValue"+licznik+"'><option value='1'>1</option></select></span>";
                
                document.getElementById("listaKoniD").innerHTML+=selectInner;
             
               document.getElementById("listaKoniD").innerHTML+="<button onclick='usunKonia(&quot;"+imieKon+"&quot;,&quot;"+hodowcaKon+"&quot;)'>X</button>";
             
               document.getElementById("listaKoniD").innerHTML+="<input type='text' id='changeForHorse"+licznik+"'>";
             
              selectInner = "<select id='selectValueUpdate"+licznik+"'><option value='1'>Imie</option><option value='2'>Plec</option><option value='3'>Hodowca</option></select>";
              document.getElementById("listaKoniD").innerHTML+=selectInner;
             
                 document.getElementById("listaKoniD").innerHTML+="<button onclick='updateKonia("+licznik+",&quot;"+imieKon+"&quot;,&quot;"+hodowcaKon+"&quot;)'>Update</button><br>";
             
             licznik++;
         }
         
     });
   
    
}

function updateDaneKonia()
{
    var licznik=0;
    $.getJSON("/readHorseHttp.json", function(data) 
    {
         while(data["kon"+licznik]) 
         {
            let imieKon=data["kon"+licznik].imie;
             let plecKon=data["kon"+licznik].plec;
             let hodowcaKon=data["kon"+licznik].hodowca;
           
             document.getElementById("daneKonia"+licznik).innerHTML = imieKon+" "+plecKon+" "+hodowcaKon;
             licznik++;
         }
    });
}

var wszystkieGrupy=[];
 var etapOgolny=[];
function readCompetition()
{
    document.getElementById("listaZawodow").innerHTML="";
   
     var licznik=0;
   
     $.getJSON("/readCompetitionHttp.json", function(data) 
     {
         while(data["zawody"+licznik]) 
         {
         
            var nazwaZawodow=data["zawody"+licznik].nazwa;
            var dataZawodow=data["zawody"+licznik].data;
            var etapZawodow=data["zawody"+licznik].etap;
            var calePunkty=data["zawody"+licznik].cale;
            var maxPunkty=data["zawody"+licznik].max;
             
             etapOgolny[licznik]=etapZawodow.split("-");
             document.getElementById("listaZawodow").innerHTML+="<div id='"+nazwaZawodow+"' style='border:1px solid;'>Nazwa: "+nazwaZawodow+"<br>Data: "+dataZawodow+"<br>Etap: "+etapZawodow+"/5<br>Skala: "+maxPunkty+"<br>Polowki: "+calePunkty+"<br>";
             
             document.getElementById("listaZawodow").innerHTML+="<div id='change"+licznik+"'><div id='tekstDoZmian"+licznik+"'></div><button onclick='stopMatch(\""+nazwaZawodow+"\",\""+licznik+"\")'>Rozpocznij nastepny etap</button><button onclick='popedz(\""+nazwaZawodow+"\")'>Popedz sedziow</button></div></div><br>";
             
             licznik++;
         }
         var licznik3=0;
         $.getJSON("/readCompetitionFullWidz.json", function(data) 
        {
            var stringForGroup=[];
             while(data["zawodyNr"+licznik3]!==undefined)
            {
             var nazwaTabeli = data.zawodyAll[licznik3].nazwa;
                var grupa=0;
                     var zwyciezcaGrupy = [];
          var wszystkieWyniki=[];
         var wszystkieKonieSpis=[];
                var ktoryKonWGrupie=[];
                 var etapAktualny = data.zawodyAll[licznik3].aktualnyEtap.split("-");
                 var wynikiWGrupach=[];   
            var dzielnikWGrupach=[];
            var liczbaKoniwWZawodach = data["zawodyNr"+licznik3]["konieAll"+nazwaTabeli].length;
            
            for(let i=0; i<liczbaKoniwWZawodach; i++)
            {
        
                grupa = data["zawodyNr"+licznik3]["konieAll"+nazwaTabeli][i].grupa;
                if(stringForGroup[grupa]===undefined )
                {
                    stringForGroup[grupa]="";
                }
                 if(wszystkieKonieSpis[grupa]===undefined )
                {
                    wszystkieKonieSpis[grupa]=[];
                }
                if(zwyciezcaGrupy[licznik3][grupa]===undefined)
                {
                    zwyciezcaGrupy[licznik3][grupa]=[];
                    
                }
               // alert(data["zawodyNr"+licznik3]["konieAll"+nazwaTabeli][0].imie)
                
                
                var backgroundCol = "white";
                
                if((i+1)==etapAktualny[1] && grupa==etapAktualny[0])
                {
                    backgroundCol = "green";
                    
                }
                
                if(ktoryKonWGrupie[grupa]===undefined)
                    ktoryKonWGrupie[grupa]=0;
                else
                    ktoryKonWGrupie[grupa]++;
                
                wszystkieKonieSpis[grupa][ktoryKonWGrupie[grupa]]=data["zawodyNr"+licznik3]["konieAll"+nazwaTabeli][i].imie;

                stringForGroup[grupa]+="<tr>";

                 stringForGroup[grupa]+="<td style='border:1px solid; background-color:"+backgroundCol+";  width:10%;'>Kon nr. "+ktoryKonWGrupie[grupa]+"</td>";
                

                var ocenaPodzielona = [];

                     wynikiWGrupach[grupa]=[];
                    dzielnikWGrupach[grupa]=[];
                for(var i5=1; i5<=5; i5++)
                {
                    var ocenySedziegoSort = data["zawodyNr"+licznik3]["konieAll"+nazwaTabeli][i]["ocena"+i5+"Sedzia"].split("+");
                   // 
                    for(let i6=0; i6<ocenySedziegoSort.length-1; i6++)
                    {
                      // alert(ocenySedziegoSort.length+" vs "+ocenySedziegoSort);
                        if(dzielnikWGrupach[grupa][i5-1]===undefined)
                        {

                            dzielnikWGrupach[grupa][i5-1]=0;
                            wynikiWGrupach[grupa][i5-1]=0;
                        }
                        if(ocenySedziegoSort[0][0]!==undefined)
                        {
                           //  alert(ocenySedziegoSort[0].split("-")[0]);
                            dzielnikWGrupach[grupa][i5-1]++;
                            wynikiWGrupach[grupa][i5-1]+=parseFloat(ocenySedziegoSort[0].split("-")[0]);
                        }
                    }
                    var ileGlosow=0;
                    
                }
                if(wszystkieWyniki[licznik3][grupa]===undefined)
                    wszystkieWyniki[licznik3][grupa]=[];
                for(let i5=0; i5<5; i5++)
                {
                    if(wynikiWGrupach[grupa][i5]===undefined)
                            wynikiWGrupach[grupa][i5]=0;
                    if(wynikiWGrupach[grupa][i5]>0)
                    {
                        
                        wynikiWGrupach[grupa][i5]/=dzielnikWGrupach[grupa][i5];
                        if( wszystkieWyniki[licznik3][grupa][ktoryKonWGrupie[grupa]]===undefined)
                             wszystkieWyniki[licznik3][grupa][ktoryKonWGrupie[grupa]]=0;
                        wszystkieWyniki[licznik3][grupa][ktoryKonWGrupie[grupa]]+=wynikiWGrupach[grupa][i5];
                    }
                }

                for(let i4=0; i4<5; i4++)
                {
                    if(ocenaPodzielona[i4]===undefined)
                        ocenaPodzielona[i4]=" ";
                }
                
                stringForGroup[grupa]+="<td style='border:1px solid; background-color:white; width:10%;'>"+ wynikiWGrupach[grupa][0]+"</td>";
                stringForGroup[grupa]+="<td style='border:1px solid; background-color:white; width:10%;'>"+ wynikiWGrupach[grupa][1]+"</td>";
                stringForGroup[grupa]+="<td style='border:1px solid; background-color:white; width:10%;'>"+ wynikiWGrupach[grupa][2]+"</td>";
                stringForGroup[grupa]+="<td style='border:1px solid; background-color:white; width:10%;'>"+ wynikiWGrupach[grupa][3]+"</td>";
                stringForGroup[grupa]+="<td style='border:1px solid; background-color:white; width:10%;'>"+ wynikiWGrupach[grupa][4]+"</td>";
                
                
                
                if(wszystkieWyniki[licznik3][grupa][ktoryKonWGrupie[grupa]]===undefined)
                   wszystkieWyniki[licznik3][grupa][ktoryKonWGrupie[grupa]]=0;
                var wynikTemp =  (wszystkieWyniki[licznik3][grupa][ktoryKonWGrupie[grupa]]/5);
                
                
                    stringForGroup[grupa]+="<td style='border:1px solid; background-color:white; width:10%;'>"+ wynikTemp +"</td>";
               
                
                
                

                var miejsceDoUstawienia=1;
                
                if(zwyciezcaGrupy[licznik][grupa][0]===undefined)
                {   
                    zwyciezcaGrupy[licznik][grupa][0]=ktoryKonWGrupie[grupa];
                }
                else if(zwyciezcaGrupy[licznik][grupa][0]<wynikTemp)
                {
                    zwyciezcaGrupy[licznik][grupa].splice(0,0,ktoryKonWGrupie[grupa]);
                }
                else if(zwyciezcaGrupy[licznik][grupa][1]<wynikTemp || zwyciezcaGrupy[licznik][grupa][1]===undefined)
                {
                    zwyciezcaGrupy[licznik][grupa].splice(1,0,ktoryKonWGrupie[grupa]);
                }
                else if(zwyciezcaGrupy[licznik][grupa][2]<=wynikTemp || zwyciezcaGrupy[licznik][grupa][2]===undefined)
                {
                    if(zwyciezcaGrupy[licznik][grupa][2]==wynikTemp)
                        zwyciezcaGrupy[licznik][grupa].splice(2,0,ktoryKonWGrupie[grupa]);
                    else
                        zwyciezcaGrupy[licznik][grupa][2]=ktoryKonWGrupie[grupa];
                }
                
                for(let i=1; i<stringForGroup.length; i++)
                {
                    document.getElementById("tekstDoZmian"+licznik2).innerHTML+="Grupa nr. "+i;

                    document.getElementById("tekstDoZmian"+licznik2).innerHTML+="<table id='grupaTabela'>";
                    document.getElementById("tekstDoZmian"+licznik2).innerHTML+=stringForGroup[i];
                    document.getElementById("tekstDoZmian"+licznik2).innerHTML+="</table><br>";
                }
                
             
            }
             licznik3++;
                
            }
         });
         
          var licznik2=0;
            $.getJSON("/readLength.json", function(data) 
            {
              
                while(data["iloscDla"+licznik2]) 
                 {
                   
                      document.getElementById("tekstDoZmian"+licznik2).innerHTML="";
                     var groupString = data["iloscDla"+licznik2].split("+");
                     
                     var konkretneIlosci = data["konkretne"+licznik2];
                   
                     wszystkieGrupy[licznik2]=[];
                     wszystkieGrupy[licznik2][0]=groupString[1];
                     wszystkieGrupy[licznik2][1]=konkretneIlosci;
               
                   document.getElementById("tekstDoZmian"+licznik2).innerHTML+= "Grupa : "+etapOgolny[licznik2][0]+"/"+groupString[1];
                      document.getElementById("tekstDoZmian"+licznik2).innerHTML+= "<br>Kon : "+etapOgolny[licznik2][1]+"/"+konkretneIlosci[groupString[1]];
                  
                     licznik2++;
                 }
            });
         
     });
    
    
  
}

readJudges();
readHorses();
readCompetition();
var forHowMany=1;
function zmienIloscKlas()
{
    var nazwaZawodow;
    forHowMany = parseInt(nazwaZawodow=document.getElementById("iloscKlas").value);
    var stringForInner="";
    if(forHowMany!="NaN")
    {
        for(var i=0; i<document.getElementsByName("selectOptions").length; i++)
        {
            stringForInner="<select id='selectValue"+i+"'>";
           
            for(var i2=0; i2<forHowMany; i2++)
            {
                stringForInner+="<option value='"+(i2+1)+"'>"+(i2+1)+"</option>"; 
               
            }
             
            stringForInner+="</select>";
             document.getElementsByName("selectOptions").item(i).innerHTML=stringForInner;
           
        }
    }
}

var unusedJudges = [];

function createMatch()
{
    var checkSedziowie=document.getElementsByName("sedziowie");
    var checkKonie=document.getElementsByName("konie");
    var konieString="";
    var sedziowieString="";
    var maxScore=10;
    var halfScore=0;
    var nazwaZawodow;
    var iloscSedziow=0;
    var urlDoStreamu="";
    for(var i=0; i<checkSedziowie.length; i++)
    {
        if(checkSedziowie.item(i).checked===true)
        {
            sedziowieString+=checkSedziowie.item(i).value;
            sedziowieString+=',';
            iloscSedziow++;
        }
    }
    var plecCheck = [];
     var czyZgadzaSiePlec = 0;
    var przerwij=0;
    var iloscKoni=0;
    for(let i=0; i<checkKonie.length; i++)
    {
        
        if(checkKonie.item(i).checked===true)
        {
            konieString+=checkKonie.item(i).value;
            var selects = document.getElementById("selectValue"+i);
            var selectedValue = selects.options[selects.selectedIndex].value;
            if(selectedValue===undefined)
                przerwij=1;
            konieString+="("+selectedValue+"),";
           
            iloscKoni++;
        }
    }
    if(document.getElementsByName("maxScore")[0].checked===false)
       maxScore=document.getElementsByName("maxScore")[0].value;
    if(document.getElementsByName("divideScore")[0].checked===false)
       maxScore=document.getElementsByName("divideScore")[0].value;
    
    nazwaZawodow=document.getElementById("nazwaZawodow").value;
  
   var dataZawodow=document.getElementById("dataZawodow").value;
    
    urlDoStreamu=document.getElementById("urlStream").value;
    
  
    var classConnection=[];
    var poprawionaIlosc=iloscSedziow;
    if(iloscSedziow<forHowMany*2)
        poprawionaIlosc=forHowMany*2;
  

    for(let i=0; i<iloscSedziow; i++)
    {
        classConnection[i]=i;
    }
    
    
    
    var rand=0;
    var i3=iloscSedziow;
    var tempArrForRand;
   
    var groupConnection = [];
                                    
    var licznik=0;
    
    var iloscSedziowPer = document.getElementById("iloscSedziowPer").value;
     
    for(let i=0; i<forHowMany; i++)
    {
        groupConnection[i] = [];
      
        classConnection=randomizeArr(classConnection);
        classConnection=unusedJudges.concat(classConnection);
        classConnection=repearArr(classConnection,iloscSedziowPer);
        unusedJudges = [];
       
        for(let i2=0; i2<iloscSedziowPer; i2++)
        {
            groupConnection[i][i2]=classConnection[i2];
        }
        for(let i2=iloscSedziowPer; i2<classConnection.length; i2++)
        {
            unusedJudges.push(classConnection[i2]);
        }
        
    }
    konieString=konieString.slice(0, -1);
    sedziowieString=sedziowieString.slice(0, -1);
      
    if(nazwaZawodow===undefined || dataZawodow===undefined)
        przerwij=1;

    if(forHowMany>0 && przerwij===0 && iloscKoni>=forHowMany &&  iloscSedziow>1 && iloscSedziowPer<=iloscSedziow && czyZgadzaSiePlec===0)
    {
      
      
        
        $.getJSON("/addCompetition?nazwa="+nazwaZawodow+"&konie="+konieString+"&sedziowie="+sedziowieString+"&groupConn="+groupConnection+"&data="+dataZawodow+"&max="+maxScore+"&half="+halfScore+"&urlStream="+urlDoStreamu+"&sedziowiePer="+iloscSedziowPer, function(data) 
        {
            readCompetition();
            alert("stworzono "+iloscSedziowPer);
        });
        
        
    }
    
}

function repearArr(arr, number)
{
    var przesuniecieTablicy=1;
    for(let i=0; i<number-1; i++)
    {
        for(let i2=i+1; i2<number; i2++)
        {
            if(arr[i]==arr[i2])
            {
                arr[i2]=arr[arr.length-przesuniecieTablicy];
                przesuniecieTablicy++;
            }
        }
    }
    
    return arr;
}

function randomizeArr(arr)
{
    var rand=0;
    var i3=arr.length;
    var tempArrForRand;
    while(i3--)
    {
        rand = Math.floor(Math.random() * (i3+1));
        tempArrForRand = arr[i3];
        arr[i3] = arr[rand];                  
        arr[rand]=tempArrForRand;
    }
    return arr;
}
