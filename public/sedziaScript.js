
/* jshint devel:true */
/* jshint esversion: 6 */
//alert("A");
var document, $, socket;

var myData="";

function readData()
{
    document.getElementById("listaZawodow").innerHTML="";
    
    var licznik=0;
     $.getJSON("/getMyData.json", function(data) 
     {
         myData=data;
  
         readCompetition();
     });
}
               
               

function readCompetition()
{
    document.getElementById("listaZawodow").innerHTML="";
   
    var licznik=0;
    var canGoThru=0;
     var wybranaPunktacjaSedziego = [];
     $.getJSON("/readCompetitionFull.json", function(data) 
     {

         var tableForAll="";

         var licznik=0;
         while(data["zawodyNr"+licznik]!==undefined)
        {
         
            var possibleString = "";
            canGoThru=0;
            
          
            var urlTabeli =  data.zawodyAll[licznik].urlStream;
            var nazwaTabeli = data.zawodyAll[licznik].nazwa;
            
            var myIDasJudge=-1;
            
            var etapAktualny = data.zawodyAll[licznik].aktualnyEtap.split("-");
            var calePunkty = data.zawodyAll[licznik].calePunkty;
            
            var maxPunkty = data.zawodyAll[licznik].maxPunkt;
            
            var liczbaSedziowWZawodach = data["zawodyNr"+licznik]["sedziowieAll"+nazwaTabeli].length;
            for(var i=0; i<liczbaSedziowWZawodach; i++)
            {
                possibleString=data["zawodyNr"+licznik]["sedziowieAll"+nazwaTabeli][i].imie[0]+data["zawodyNr"+licznik]["sedziowieAll"+nazwaTabeli][i].nazwisko;
                if(possibleString==myData.imie)
                {
                    canGoThru=1;
                    myIDasJudge=i;
                }
            }

            
            
            if(canGoThru==1)
            {
            tableForAll+="<h1>Zawody nr. "+(licznik+1)+"</h1><br>";
 
            tableForAll+="<table style='border:1px solid;'>";
            
            var grupyRozdzielone = data["zawodyNr"+licznik]["sedziowieAll"+nazwaTabeli][myIDasJudge].grupy.split(",");
            
            
            var liczbaKoniwWZawodach = data["zawodyNr"+licznik]["konieAll"+nazwaTabeli].length;
            var stringForGroup=[];

            var aktualnyKon="";
                
            var licznikGrupy=[];

            for(let i=0; i<liczbaKoniwWZawodach; i++)
            {
                var grupa = data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][i].grupa;
                if(licznikGrupy[grupa]===undefined)
                    licznikGrupy[grupa]=1;
                else
                    licznikGrupy[grupa]++;
                if(stringForGroup[grupa]===undefined )
                    stringForGroup[grupa]="";
                stringForGroup[grupa]+="<tr>";

                stringForGroup[grupa]+="<td style='border:1px solid;  width:10%;'>Koń nr. "+ licznikGrupy[grupa]+"</td>";
                
                 stringForGroup[grupa]+="<td style='border:1px solid; width:10%;'>"+ data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][i].grupa+"</td>";
                
                var ocenaPodzielona = [];
                for(var i5=1; i5<=5; i5++)
                {
                    var ocenySedziegoSort = data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][i]["ocena"+i5+"Sedzia"].split("+");
                    

                    var ileGlosow=0;
                    while(ileGlosow<ocenySedziegoSort.length)
                    {
                         if(ocenySedziegoSort[ileGlosow]!==undefined)
                        {
                            if(ocenySedziegoSort[ileGlosow].split("-")[1]==myIDasJudge)
                                ocenaPodzielona[i5-1]=ocenySedziegoSort[ileGlosow].split("-")[0];
                        }
                        else
                            ocenySedziegoSort[i5]="";
                        ileGlosow++;
                    }
                   
                    
                    
                }
          
                for(var i4=0; i4<5; i4++)
                {
                    if(ocenaPodzielona[i4]===undefined)
                        ocenaPodzielona[i4]=" ";
                }
                
               
                stringForGroup[grupa]+="<td style='border:1px solid;  width:10%;'>"+ ocenaPodzielona[0]+"</td>";
                stringForGroup[grupa]+="<td style='border:1px solid; width:10%;'>"+ ocenaPodzielona[1]+"</td>";
                stringForGroup[grupa]+="<td style='border:1px solid; width:10%;'>"+ ocenaPodzielona[2]+"</td>";
                stringForGroup[grupa]+="<td style='border:1px solid; width:10%;'>"+ ocenaPodzielona[3]+"</td>";
                stringForGroup[grupa]+="<td style='border:1px solid; width:10%;'>"+ ocenaPodzielona[4]+"</td>";
                
                
                stringForGroup[grupa]+="<td style='border:1px solid;'>"+ data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][i].iloscOcena1Sedzia+"</td>";
                stringForGroup[grupa]+="<td style='border:1px solid;'>"+ data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][i].iloscOcena2Sedzia+"</td>";
                stringForGroup[grupa]+="<td style='border:1px solid;'>"+ data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][i].iloscOcena3Sedzia+"</td>";
                stringForGroup[grupa]+="<td style='border:1px solid;'>"+ data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][i].iloscOcena4Sedzia+"</td>";
                stringForGroup[grupa]+="<td style='border:1px solid;'>"+ data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][i].iloscOcena5Sedzia+"</td>";
                stringForGroup[grupa]+="</tr>";
                

                if((i+1)==etapAktualny[1] && grupa==etapAktualny[0])
                {
                    var canPassThru=0;
                    for(var t1=0; t1<grupyRozdzielone.length; t1++)
                    {
                        if(grupyRozdzielone[t1]==grupa)
                            canPassThru=1;
                    }

                    if(canPassThru==1)
                    {
                        aktualnyKon=data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][i].imie+"-"+data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][i].hodowca;
                        wybranaPunktacjaSedziego[licznik]=[];
                        wybranaPunktacjaSedziego[licznik][0] = ocenaPodzielona[0];
                        wybranaPunktacjaSedziego[licznik][1] = ocenaPodzielona[1];
                        wybranaPunktacjaSedziego[licznik][2] = ocenaPodzielona[2];
                        wybranaPunktacjaSedziego[licznik][3] = ocenaPodzielona[3];
                        wybranaPunktacjaSedziego[licznik][4] = ocenaPodzielona[4];
                    }
 
                }

            }
            for(let i=1; i<stringForGroup.length; i++)
            {
                tableForAll+="Grupa nr. "+i;
               
                tableForAll+="<table style='border:1px solid;'>";
                tableForAll+=stringForGroup[i];
                tableForAll+="</table><br>";
            }
    
            tableForAll+="</table><br><br>";
            
            tableForAll+="Aktualny kon nr. "+etapAktualny[1]+" z grupy nr. "+etapAktualny[0];
               
            tableForAll+="<table style='border:1px solid;'>";
            
           
            var stringToReturn = "";
                 
            if(aktualnyKon!=="" )
            {
                stringToReturn+="<td style='border:1px solid;  width:10%;'>"+returnSelect(myIDasJudge,aktualnyKon,nazwaTabeli,etapAktualny[0],etapAktualny[1],licznik,calePunkty, wybranaPunktacjaSedziego[licznik][0],0,maxPunkty)+"</td>";
                stringToReturn+="<td style='border:1px solid; width:10%;'>"+ returnSelect(myIDasJudge,aktualnyKon,nazwaTabeli,etapAktualny[0],etapAktualny[1],licznik,calePunkty, wybranaPunktacjaSedziego[licznik][1],1,maxPunkty)+"</td>";
                stringToReturn+="<td style='border:1px solid; width:10%;'>"+ returnSelect(myIDasJudge,aktualnyKon,nazwaTabeli,etapAktualny[0],etapAktualny[1],licznik,calePunkty, wybranaPunktacjaSedziego[licznik][2],2,maxPunkty)+"</td>";
                stringToReturn+="<td style='border:1px solid; width:10%;'>"+ returnSelect(myIDasJudge,aktualnyKon,nazwaTabeli,etapAktualny[0],etapAktualny[1],licznik,calePunkty, wybranaPunktacjaSedziego[licznik][3],3,maxPunkty)+"</td>";
                stringToReturn+="<td style='border:1px solid; width:10%;'>"+ returnSelect(myIDasJudge,aktualnyKon,nazwaTabeli,etapAktualny[0],etapAktualny[1],licznik,calePunkty, wybranaPunktacjaSedziego[licznik][4],4,maxPunkty)+"</td>";

                stringToReturn+="<td style='border:1px solid;'>"+ data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][0].iloscOcena1Sedzia+"</td>";
                stringToReturn+="<td style='border:1px solid;'>"+ data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][0].iloscOcena2Sedzia+"</td>";
                stringToReturn+="<td style='border:1px solid;'>"+ data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][0].iloscOcena3Sedzia+"</td>";
                stringToReturn+="<td style='border:1px solid;'>"+ data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][0].iloscOcena4Sedzia+"</td>";
                stringToReturn+="<td style='border:1px solid;'>"+ data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][0].iloscOcena5Sedzia+"</td>";

                tableForAll+=stringToReturn;
            }
            else
                tableForAll+="<td>Brak koniaaaaa do oceny</td>";
            tableForAll+="</table><br>";
                
            }
             licznik++;
            
        }
       

          document.getElementById("listaZawodow").innerHTML=tableForAll;
         
     });
    
   
}
function givingMark(objekt,etapAktualny1, etapAktualny2,nazwa, kon, myIDtoSend)
{

     $.getJSON("/addMarkJuries?nazwa="+nazwa+"&kon="+kon+"&ocena="+objekt.value+"&idZawody="+objekt.id+"&kategoria="+objekt.name+"&numerKonia="+etapAktualny1+"&numerGrupy="+etapAktualny2+"&myID="+myIDtoSend, function(data) 
    {
         
     });
}
function returnSelect(myIDtoSend, aktualnyKon,nazwaZawodow, etapAktualny1, etapAktualny2,licznik, calePunkty, wybranaPunktacja,ktoreZrzedu, maxPunkty)
{
 
    var nazwa = nazwaZawodow+"";
    var punktacjaDoWybrania="<select id='"+licznik+"' name='"+ktoreZrzedu+"' onchange='givingMark(this,"+etapAktualny1+","+etapAktualny1+",&quot;"+nazwa+"&quot;"+",&quot;"+aktualnyKon+"&quot;,"+myIDtoSend+")'>";
          //  alert(calePunkty+" vs "+nazwaZawodow);
            if(calePunkty!="0")
            {
                for(var i2=0; i2<=maxPunkty; i2++)
                {
                    if(i2==wybranaPunktacja)
                        punktacjaDoWybrania += "<option selected='selected' value='"+i2+"'>"+i2+"</option>";
                    else
                        punktacjaDoWybrania += "<option value='"+i2+"'>"+i2+"</option>";
                }
            }
            else
            {
                var tempi2=0;
                for(let i2=0; i2<=maxPunkty*2; i2++)
                {
                    if(i2 % 2===0)
                    {
                        if(tempi2==wybranaPunktacja)
                            punktacjaDoWybrania += "<option selected='selected' value='"+tempi2+"'>"+tempi2+"</option>";
                        else
                            punktacjaDoWybrania += "<option value='"+tempi2+"'>"+tempi2+"</option>";
                    }
                    else
                    {
                        var wartoscTemp = tempi2+".5";
                        if(wartoscTemp==wybranaPunktacja)
                            punktacjaDoWybrania += "<option selected='selected' value='"+tempi2+".5'>"+tempi2+".5</option>";
                        else
                            punktacjaDoWybrania += "<option value='"+tempi2+".5'>"+tempi2+".5</option>";
                        tempi2++;
                    }
                }
            }
            punktacjaDoWybrania+="</select>";
    
            return punktacjaDoWybrania;
}

socket.on('czytaj', function(data){
      readData();
    popedzanieGrafika(1);
    //document.getElementById("popedzanieBlock").style.display="none";
    
});

socket.on('popedz', function(data){
      jestemPopedzany();
    });

function jestemPopedzany()
{
    popedzanieGrafika();
    //alert("popedzanie!");
}

readData();
var forHowMany=1;
popedzanieGrafika(0);
function popedzanieGrafika(mode)
{
    if(mode==1)
    {
        document.getElementById("popedzanieBlock").style.display="none";
        document.getElementById("listaZawodow").style.border=null;
        
    }
    else
    {
        document.getElementById("popedzanieBlock").style.display="block";
        document.getElementById("listaZawodow").style.border="1px solid red";
    }
   // listaZawodow
    // document.getElementById("tworzenieZawodow").style.display="none";
   
   
}

