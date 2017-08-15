
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
        document.getElementById("streamBorder"+idRozwiniecia).style.marginTop = document.getElementById("zwyciezcyTabela").offsetTop+"px";
        //alert(document.getElementById("zwyciezcyTabela").offsetTop);
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
      var stringActualHorse="";
     $.getJSON("/readCompetitionFullWidz.json", function(data) 
     {

         var licznik=0;
         var grupa;
         var zwyciezcaGrupy = [];
          var wszystkieWyniki=[];
         var wszystkieKonieSpis=[];
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
            tableForAll+="<table style='width:100%;'><tr><td style='width:50%;'>";
            tableForAll+="Dane dotyczące zawodów: <div id='daneWhole'>";
            tableForAll+="<table cellpadding='2'>";
            
            var jakiePolowki = "";
            if(calePunkty==1)
                jakiePolowki="wraz z .5";
            else
                jakiePolowki="bez .5";
       //     tableForAll+="<tr>";
            tableForAll+="<tr><td>Nazwa zawodów: </td><td id='daneZawodow'>"+nazwaTabeli+"</td></tr>";
            tableForAll+="<tr><td>System punktowy max do: </td><td id='daneZawodow' >"+ data.zawodyAll[licznik].maxPunkt+" "+jakiePolowki+"</td><tr>";
           /* tableForAll+="<tr><td>system punktowy</td><td style='border:1px solid;  width:50%;'>"+ calePunkty+"</td><tr>";*/
            tableForAll+="<tr><td>Aktualna grupa: </td><td id='daneZawodow'>"+ etapAktualny[0]+"</td><tr>";
            tableForAll+="<tr><td>Data zawodów: </td><td id='daneZawodow'>"+ data.zawodyAll[licznik].data+"</td><tr>";
         //   tableForAll+="</tr>";
            
          /*  tableForAll+="<tr>";
            tableForAll+="<td style='border:1px solid;  width:10%;'>"+nazwaTabeli+"</td>";
            
            
            
            tableForAll+="<td style='border:1px solid;  width:10%;'>"+ data.zawodyAll[licznik].maxPunkt+"</td>";
            tableForAll+="<td style='border:1px solid;  width:10%;'>"+ calePunkty+"</td>";
            tableForAll+="<td style='border:1px solid;  width:10%;'>"+ etapAktualny[0]+"</td>";
            tableForAll+="<td style='border:1px solid;  width:10%;'>"+ etapAktualny[1]+"</td>";
            tableForAll+="<td style='border:1px solid;  width:10%;'>"+ data.zawodyAll[licznik].data+"</td>";
            tableForAll+="</tr>";*/
            
           
            tableForAll+="</table></div><br>";
            tableForAll+="<div id='skladSedziowski'>";
            tableForAll+="Skład sędziowski :<br>";
          //  tableForAll+="<table style='border:1px solid;'>";
             tableForAll+="<ol>";
            
            for(var i=0; i<liczbaSedziowWZawodach; i++)
            {
                tableForAll+="<li >"+ data["zawodyNr"+licznik]["sedziowieAll"+nazwaTabeli][i].imie+" "+data["zawodyNr"+licznik]["sedziowieAll"+nazwaTabeli][i].nazwisko+"</li>";
                
               
            }
            
            tableForAll+="</ol>";
            tableForAll+="</div>";
            //tableForAll+="</table><br>";
            
             tableForAll+="</td><td style='width:50%;'>";
            tableForAll+="<table style='border:1px solid;'>";
            
          
            
            
            var liczbaKoniwWZawodach = data["zawodyNr"+licznik]["konieAll"+nazwaTabeli].length;
            var stringForGroup=[];
            var aktualnyKon="";
                
            var wynikiWGrupach=[];   
            var dzielnikWGrupach=[];

            
            var ktoryKonWGrupie=[];
           
            
            for(let i=0; i<liczbaKoniwWZawodach; i++)
            {
        
                grupa = data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][i].grupa;
                if(stringForGroup[grupa]===undefined )
                {
                    stringForGroup[grupa]="";
                }
                 if(wszystkieKonieSpis[grupa]===undefined )
                {
                    wszystkieKonieSpis[grupa]=[];
                }
                if(zwyciezcaGrupy[licznik][grupa]===undefined)
                {
                    zwyciezcaGrupy[licznik][grupa]=[];
                    
                }
               // alert(data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][0].imie)
                
                
                var backgroundCol = "white";
                
                if((i+1)==etapAktualny[1] && grupa==etapAktualny[0])
                {
                    backgroundCol = "green";
                    
                }
                
                if(ktoryKonWGrupie[grupa]===undefined)
                    ktoryKonWGrupie[grupa]=0;
                else
                    ktoryKonWGrupie[grupa]++;
                
                wszystkieKonieSpis[grupa][ktoryKonWGrupie[grupa]]=data["zawodyNr"+licznik]["konieAll"+nazwaTabeli][i].imie;

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
                
                /*stringForGroup[grupa]+="<td style='border:1px solid; background-color:white; width:10%;'>"+ wynikiWGrupach[grupa][0]+"</td>";
                stringForGroup[grupa]+="<td style='border:1px solid; background-color:white; width:10%;'>"+ wynikiWGrupach[grupa][1]+"</td>";
                stringForGroup[grupa]+="<td style='border:1px solid; background-color:white; width:10%;'>"+ wynikiWGrupach[grupa][2]+"</td>";
                stringForGroup[grupa]+="<td style='border:1px solid; background-color:white; width:10%;'>"+ wynikiWGrupach[grupa][3]+"</td>";
                stringForGroup[grupa]+="<td style='border:1px solid; background-color:white; width:10%;'>"+ wynikiWGrupach[grupa][4]+"</td>";*/
                
                
                
                if(wszystkieWyniki[licznik][grupa][ktoryKonWGrupie[grupa]]===undefined)
                   wszystkieWyniki[licznik][grupa][ktoryKonWGrupie[grupa]]=0;
                var wynikTemp =  (wszystkieWyniki[licznik][grupa][ktoryKonWGrupie[grupa]]/5);
                
                if((i+1)==etapAktualny[1] && grupa==etapAktualny[0])
                {
                    stringActualHorse+="<td id='ocenyAktualneWTabeli'><center>"+ wynikiWGrupach[grupa][0]+"</center></td>";
                    stringActualHorse+="<td id='ocenyAktualneWTabeli'><center>"+ wynikiWGrupach[grupa][1]+"</center></td>";
                    stringActualHorse+="<td id='ocenyAktualneWTabeli'><center>"+ wynikiWGrupach[grupa][2]+"</center></td>";
                    stringActualHorse+="<td id='ocenyAktualneWTabeli'><center>"+ wynikiWGrupach[grupa][3]+"</center></td>";
                    stringActualHorse+="<td id='ocenyAktualneWTabeli'><center>"+ wynikiWGrupach[grupa][4]+"</center></td>";
                    stringActualHorse+="<td id='ocenyAktualneWTabeli'><center>"+ wynikTemp +"</center></td>";
                    
                    stringForGroup[grupa]+="<td style='border:1px solid; background-color:white; width:10%;'>W trakcie oceniania</td>";
                }
                else
                {
                    stringForGroup[grupa]+="<td style='border:1px solid; background-color:white; width:10%;'>"+ wynikTemp +"</td>";
                }
                
                
                

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
               
                tableForAll+="<table id='grupaTabela'>";
                tableForAll+=stringForGroup[i];
                tableForAll+="</table><br>";
            }

            tableForAll+="</table><br><br>";
             tableForAll+="</td></tr></table>";
        //    tableForAll+="Aktualny kon nr. "+etapAktualny[1]+" z grupy nr. "+etapAktualny[0];
               
            tableForAll+="<br>Aktualnie oceniany koń : <br>";
            tableForAll+="<div id='aktualnaTabela'><center><table style='border:1px solid;'>";
            
           // alert(stringActualHorse);
            if(stringActualHorse!=="")
            {
            
            tableForAll+="<tr><td><center>Typ</center></td><td><center>Głowa i szyja</center></td><td><center>Kłoda</center></td><td><center>Nogi</center></td><td><center>Ruch</center></td><td><center>Wynik</center></td></tr>";
             
            
            tableForAll+="<tr>"+stringActualHorse+"</tr>";
                
            }
            else
                tableForAll+="<tr><td><center>AKTUALNIE BRAK KONIA NA WYBIEGU</center></td></tr>";
            
            tableForAll+="</table></center></div><br>";
            
            //for(var i10=0; i10<4; i10++)
            
            var licznikTemp=1;
            
            while(zwyciezcaGrupy[licznik][licznikTemp]!==undefined)
            {   
               
                if(zwyciezcaGrupy[licznik][licznikTemp][0]===undefined)
                    zwyciezcaGrupy[licznik][licznikTemp][0]="";
                if(zwyciezcaGrupy[licznik][licznikTemp][1]===undefined)
                    zwyciezcaGrupy[licznik][licznikTemp][1]="";
                if(zwyciezcaGrupy[licznik][licznikTemp][2]===undefined)
                    zwyciezcaGrupy[licznik][licznikTemp][2]="";
               // if(licznikTemp==1)
                var tempMargin = (((licznikTemp-1)%3)*10);
                if((licznikTemp-1)%3===0)
                     tableForAll+="<br>";
              // alert(tempMargin);
                
                if(grupa<etapAktualny[0])
                {
                tableForAll+="<table style='padding:2%;'  id='zwyciezcyTabela'><tr><td>Wyniki grupy "+licznikTemp+"</td></tr>"; 
                
               /* else 
               margin-left:"+tempMargin+"%'
                    tableForAll+="<table id='zwyciezcyTabela'>"; */
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
                        //tableForAll+="<td>"+miejsce+" miejsce grupy "+licznikTemp+" :</td><td>"+wynikiTablica+"</td>";
                        tableForAll+="<td>"+miejsce+" miejsce :</td><td>"+ wszystkieKonieSpis[licznikTemp][wynikiTablica]+"</td>";
                        tableForAll+="</tr>";
                    }

                    licznikTemp2++;
                }

                tableForAll+="</table><br><br>";
                }
                licznikTemp++;
            }
            tableForAll+="<br><br><br><br><br><br><br><br>";
           
            if(urlTabeli!=="")
            {
                //tableForAll+='<iframe src="'+urlTabeli+'" frameborder="0" scrolling="no" height="378" width="620"></iframe>'; 
                
                streamDoWyswietlenia[licznik]='<div id="streamBorder'+licznik+'" style="width:50%; position:absolute; top:1%; right:10%; background-color:white; "><center><iframe src="'+urlTabeli+'" frameborder="0" scrolling="no" height="350px" width="100%"></iframe></center><div>';
            }
            else
                streamDoWyswietlenia[licznik]="";
            
            htmlDoRozwiniecia[licznik]=tableForAll;
            
            if(mode===0)
            document.getElementById("listaZawodow").innerHTML+="<div id='rozwijanka'><h1 onclick='rozwinZawody("+licznik+")' style='cursor:pointer;' >"+(licznik+1)+". Zawody "+nazwaTabeli+"</h1><div id='rozwin"+licznik+"'></div><div id='streamRozwin"+licznik+"'></div></div><br>";
            
           
          
            
            
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



