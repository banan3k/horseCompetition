
/* jshint devel:true */
/* jshint esversion: 6 */

var document, $, socket;

var myData="";

var globalneRozwiniecie = 0;
readCompetition(0);               

function rozwinZawody(idRozwiniecia)
{
    globalneRozwiniecie=idRozwiniecia;
    if(document.getElementById("rozwin"+idRozwiniecia).innerHTML==="")
    {
        document.getElementById("rozwin"+idRozwiniecia).innerHTML=htmlDoRozwiniecia[idRozwiniecia];
        document.getElementById("streamRozwin"+idRozwiniecia).innerHTML=streamDoWyswietlenia[idRozwiniecia];
    }
    else
    {
        document.getElementById("rozwin"+idRozwiniecia).innerHTML="";
        document.getElementById("streamRozwin"+idRozwiniecia).innerHTML="";
        
    }
    
   

    
    

}

function updateRozwiniecie()
{
    //htmlDoRozwiniecia[globalneRozwiniecie]+="aaaaaa";
    document.getElementById("rozwin"+globalneRozwiniecie).innerHTML=htmlDoRozwiniecia[globalneRozwiniecie];
}

var htmlDoRozwiniecia = [];
function readCompetition(mode)
{
    if(mode===0)
        document.getElementById("listaZawodow").innerHTML="";
   
    var licznik=0;
    var canGoThru=0;
     var wybranaPunktacjaSedziego = [];
     
     $.getJSON("/readCompetitionFullWidz.json", function(data) 
     {
 
         var licznik=0;
         
         var zwyciezcaGrupy = [];
          var wszystkieWyniki=[];
         while(data["zawodyNr"+licznik]!==undefined)
        {
             var tableForAll="";
            
            var possibleString = "";
            canGoThru=0;
            
            wszystkieWyniki[licznik]=[];
            zwyciezcaGrupy[licznik] = [];
            
            var urlTabeli =  data.zawodyAll[licznik].urlStream;
            var nazwaTabeli = data.zawodyAll[licznik].nazwa;
            var myIDasJudge=-1;
            
            var etapAktualny = data.zawodyAll[licznik].aktualnyEtap.split("-");
            var calePunkty = data.zawodyAll[licznik].calePunkty;

            var liczbaSedziowWZawodach = data["zawodyNr"+licznik]["sedziowieAll"+nazwaTabeli].length;

            tableForAll+="<table style='border:1px solid;'>";
            
            tableForAll+="<tr>";
            tableForAll+="<td>nazwa</td>";
            tableForAll+="<td>max punkty</td>";
            tableForAll+="<td>system punktowy</td>";
            tableForAll+="<td>aktualny etap</td>";
            tableForAll+="<td>data</td>";
            tableForAll+="</tr>";
            
            tableForAll+="<tr>";
            tableForAll+="<td style='border:1px solid;  width:10%;'>"+nazwaTabeli+"</td>";
            
            
            
            tableForAll+="<td style='border:1px solid;  width:10%;'>"+ data.zawodyAll[licznik].maxPunkt+"</td>";
            tableForAll+="<td style='border:1px solid;  width:10%;'>"+ calePunkty+"</td>";
            tableForAll+="<td style='border:1px solid;  width:10%;'>"+ etapAktualny[0]+"</td>";
            tableForAll+="<td style='border:1px solid;  width:10%;'>"+ etapAktualny[1]+"</td>";
            tableForAll+="<td style='border:1px solid;  width:10%;'>"+ data.zawodyAll[licznik].data+"</td>";
            tableForAll+="</tr>";
            
           
            tableForAll+="</table><br>";
            tableForAll+="Sedziowie :<br>";
            tableForAll+="<table style='border:1px solid;'>";
             tableForAll+="<tr>";
            
            for(var i=0; i<liczbaSedziowWZawodach; i++)
            {
                tableForAll+="<td style='border:1px solid; width:10%;'>"+ data["zawodyNr"+licznik]["sedziowieAll"+nazwaTabeli][i].imie+" "+data["zawodyNr"+licznik]["sedziowieAll"+nazwaTabeli][i].nazwisko+"</td>";
                
               
            }
            
            tableForAll+="</tr>";
            tableForAll+="</table><br>";
            tableForAll+="<table style='border:1px solid;'>";
            
          
            
            
            var liczbaKoniwWZawodach = data["zawodyNr"+licznik]["konieAll"+nazwaTabeli].length;
            var stringForGroup=[];
            var aktualnyKon="";
                
            var wynikiWGrupach=[];   
            var dzielnikWGrupach=[];

            
            var ktoryKonWGrupie=[];
           
            
            for(let i=0; i<liczbaKoniwWZawodach; i++)
            {
        
                var grupa = data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][i].grupa;
                if(stringForGroup[grupa]===undefined )
                {
                    stringForGroup[grupa]="";
                }
                if(zwyciezcaGrupy[licznik][grupa]===undefined)
                {
                    zwyciezcaGrupy[licznik][grupa]=[];
                    
                }
                
                var backgroundCol = "white";
                
                if((i+1)==etapAktualny[1] && grupa==etapAktualny[0])
                {
                    backgroundCol = "green";
                    
                }
                
                if(ktoryKonWGrupie[grupa]===undefined)
                    ktoryKonWGrupie[grupa]=0;
                else
                    ktoryKonWGrupie[grupa]++;
                

                stringForGroup[grupa]+="<tr>";

                 stringForGroup[grupa]+="<td style='border:1px solid; background-color:"+backgroundCol+";  width:10%;'>Kon nr. "+ktoryKonWGrupie[grupa]+"</td>";
                

                var ocenaPodzielona = [];

                     wynikiWGrupach[grupa]=[];
                    dzielnikWGrupach[grupa]=[];
                for(var i5=1; i5<=5; i5++)
                {
                    var ocenySedziegoSort = data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][i]["ocena"+i5+"Sedzia"].split("+");
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
                if(wszystkieWyniki[licznik][grupa]===undefined)
                    wszystkieWyniki[licznik][grupa]=[];
                for(let i5=0; i5<5; i5++)
                {
                    if(wynikiWGrupach[grupa][i5]===undefined)
                            wynikiWGrupach[grupa][i5]=0;
                    if(wynikiWGrupach[grupa][i5]>0)
                    {
                        
                        wynikiWGrupach[grupa][i5]/=dzielnikWGrupach[grupa][i5];
                        if( wszystkieWyniki[licznik][grupa][ktoryKonWGrupie[grupa]]===undefined)
                             wszystkieWyniki[licznik][grupa][ktoryKonWGrupie[grupa]]=0;
                        wszystkieWyniki[licznik][grupa][ktoryKonWGrupie[grupa]]+=wynikiWGrupach[grupa][i5];
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
                
               
                if(wszystkieWyniki[licznik][grupa][ktoryKonWGrupie[grupa]]===undefined)
                   wszystkieWyniki[licznik][grupa][ktoryKonWGrupie[grupa]]=0;
                var wynikTemp =  (wszystkieWyniki[licznik][grupa][ktoryKonWGrupie[grupa]]/5);
                
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
            

                 
            
            tableForAll+="</table><br>";
            
            var licznikTemp=1;

            while(zwyciezcaGrupy[licznik][licznikTemp]!==undefined)
            {   
            
                if(zwyciezcaGrupy[licznik][licznikTemp][0]===undefined)
                    zwyciezcaGrupy[licznik][licznikTemp][0]="";
                if(zwyciezcaGrupy[licznik][licznikTemp][1]===undefined)
                    zwyciezcaGrupy[licznik][licznikTemp][1]="";
                if(zwyciezcaGrupy[licznik][licznikTemp][2]===undefined)
                    zwyciezcaGrupy[licznik][licznikTemp][2]="";
                tableForAll+="<table style='border:1px solid;'>"; 
                
                var licznikTemp2=0;
                
                var miejsce=1;
                var skokMiejsca=0;
                while(zwyciezcaGrupy[licznik][licznikTemp][licznikTemp2]!==undefined)
                {
                    var wynikiTablica =zwyciezcaGrupy[licznik][licznikTemp][licznikTemp2];
                    
                    if(licznikTemp2>0 && wszystkieWyniki[licznik][licznikTemp][licznikTemp2]!=wszystkieWyniki[licznik][licznikTemp][licznikTemp2-1])
                    {
                        miejsce+=1+skokMiejsca;
                        skokMiejsca=0;
                    }
                    else if(licznikTemp2>0)
                    {
                        skokMiejsca++;
                    }
                    
                    if(wynikiTablica!=="" || wynikiTablica=="0")
                    {
                        tableForAll+="<tr>";
                        tableForAll+="<td>"+miejsce+" miejsce grupy "+licznikTemp+" :</td><td>"+wynikiTablica+"</td>";
                        tableForAll+="</tr>";
                    }

                    licznikTemp2++;
                }

                tableForAll+="</table><br>";
                
                licznikTemp++;
            }
            
           
            if(urlTabeli!=="")
            {
                //tableForAll+='<iframe src="'+urlTabeli+'" frameborder="0" scrolling="no" height="378" width="620"></iframe>'; 
                streamDoWyswietlenia[licznik]='<iframe src="'+urlTabeli+'" frameborder="0" scrolling="no" height="378" width="620"></iframe>';
            }
            else
                streamDoWyswietlenia[licznik]="";
            
            htmlDoRozwiniecia[licznik]=tableForAll;
            
            if(mode===0)
            document.getElementById("listaZawodow").innerHTML+="<h1 onclick='rozwinZawody("+licznik+")'>Zawody nr. "+licznik+"</h1><div id='rozwin"+licznik+"'></div><div id='streamRozwin"+licznik+"'></div><br>";
            
           
          
            
            
             licznik++;
        }
         if(mode==1)
            updateRozwiniecie();
     });
    
   
}

var streamDoWyswietlenia = [];
socket.on('czytaj', function(data){
      readCompetition(1);   
    
});

var forHowMany=1;



