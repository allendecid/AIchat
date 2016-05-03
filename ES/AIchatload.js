/* Copyright ONL SpA 2016  Christian Allende

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Contact: christian.allende.cid@gmail.com
    */
function init(csv,decider,reg,largomax,memoria,coef, weights){

d3.csv(csv, function(error, data) {
 /*   data.forEach(function(d) {
 console.log(d.Respuesta);
    });*/
  //  console.log(d3.keys(data[0]));
var anterior=0, temp=0, inda=0;
    $(document).ready(function(){
          var box = null;
          
          
       //   $("input[type='button']").click(function(event, ui) {


       setTimeout( hola, 600);
  
       function hola(){
              if(box) {
                  box.chatbox("option", "boxManager").toggleBox();
              }
              else {
                  box = $("#chat_div").chatbox({id:"Yo", 
                                                user:{key : "value"},
                                                title : "Agente IA",
                                                messageSent : function(id, user, msg) {
                                                  //  $("#log").append(id + " said: " + msg + "<br/>");
                                                    $("#chat_div").chatbox("option", "boxManager").addMsg(id, msg);
                                                     setTimeout( respuesta, 2500,msg);temp=0;
                                                }});
              $("#chat_div").chatbox("option", "boxManager").addMsg("Agente IA", "Buenos días,¿Como está?\n¿Le puedo ayudar en algo?");

}}
          });

          function respuesta(msg, contexto){
        
           
              msg=removeDiacritics(msg);
            msg = msg.toLowerCase();
         //  var reg = / el | los | me | la | las | un | unos | una | unas | y | unas /g;
         
            msg = msg.replace(reg, " ");
            msg = msg.replace("?", "");
            msg = msg.replace("¿", "");
 
var res = msg.split(" ");
var largo=res.length;

var arreglo=[]; // Naive Bayes scrore
var resparr=[]; // Respuesta
var pregarr=[]; // Pregunta
var estimad=[]; // estimador jacobiano
var matcher=[]; // matcher de words en data

data.forEach(function(d) {
               var score=1;
               var igual=[];
               var sintocar=d.Pregunta;
                  d.Pregunta=removeDiacritics(d.Pregunta);
                d.Pregunta=d.Pregunta.toLowerCase();
                d.Pregunta = d.Pregunta.replace(reg, " ");
                d.Pregunta = d.Pregunta.replace("¿", "");
                d.Pregunta = d.Pregunta.replace("?", ""); 
             var match =d.Pregunta.split(" ");   
             var largot=match.length+largo;
         if (weights===1){
             var wpoints =d.Weights.split(" "); // peso para cada palabra, si esta habilitado.
            for (i = 0; i < largo; i++) {
                var position=$.inArray(res[i], match);
           
            if((position>-1)&&(position<wpoints.length)){
                var wscore=wpoints[position]*wpoints.length;
               score=score*(1+wscore)/(largot);igual.push(i);
            }
            else if(res[i].length>4&&similar(res[i],match)>=coef){var wscore=wpoints[similarpos(res[i],match)]*wpoints.length;
                score=score*(1+wscore)/(largot);igual.push(i);
            }                  
             else{score=score*1/(largot);}
            
        }}
         else{
        for (i = 0; i < largo; i++) {
            if($.inArray(res[i], match) > -1){
               score=score*2/(largot);igual.push(i);
            }
            else if(res[i].length>4&&similar(res[i],match)>=coef){
                score=score*2/(largot);igual.push(i);
            }                  
             else{score=score*1/(largot);}
            
        }
        
    }
        arreglo.push(score);
        resparr.push(d.Respuesta);
        pregarr.push(sintocar);
        matcher.push(igual);
        var calcestim=score*Math.pow(largot, largo);
        estimad.push(Math.log(calcestim)/(Math.log(2)*(largot/2)));
  
    });              
           var maxdec;        
       if (typeof(contexto) !== 'undefined'&&memoria===1) {
           contexto.forEach(function(d,n) {
               estimad[n]=estimad[n]+d;
               });
        var ind = estimad.indexOf(d3.max(estimad));
   maxdec=estimad[ind]; // before splicing values
    var get2=secondMax(estimad);
    var sec= get2[0];
    var third= get2[1];
   
         }else{
             var ind = arreglo.indexOf(d3.max(arreglo));
    var get2=secondMax(arreglo);
    var sec= get2[0];
    var third= get2[1];
     maxdec=estimad[ind];  
   }
         


       if(largo>largomax){
            for (i = matcher[ind].length-1; i >-1; i--) {
       res.splice(matcher[ind][i], 1);}
   var newmsg = res.join(" ");
   maxdec=(largo-res.length)/(pregarr[ind].split(" ").length);
     if(maxdec>decider)mostrarmsg();
   if(matcher[ind].length>1)respuesta(newmsg,estimad); 

}else{mostrarmsg();}
    
 function mostrarmsg(){      
       if((maxdec>decider)&&inda!==ind){
       
           inda=ind;
            $("#chat_div").chatbox("option", "boxManager").addMsg("Agente IA",resparr[ind] );
        $("#respuestarel").html('<li><font color="black">'+pregarr[ind]+"</font>"+"<br>"+resparr[ind]+"</li>"+'<li><font color="black">'+pregarr[sec]+"</font>"+"<br>"+resparr[sec]+"</li>"+'<li><font color="black">'+pregarr[third]+"</font>"+"<br>"+resparr[third]+"</li>"); 
            if(!temp){anterior=msg;}
         }   
        else{if(anterior&&!temp&&memoria===1){temp=anterior;anterior=msg;respuesta(temp,estimad);}
             else{$("#chat_div").chatbox("option", "boxManager").addMsg("Agente IA","No tengo la información necesaria para responderle" ); $("#respuestarel").html('<li><font color="black">'+pregarr[ind]+"</font>"+"<br>"+resparr[ind]+"</li>"+'<li><font color="black">'+pregarr[sec]+"</font>"+"<br>"+resparr[sec]+"</li>"+'<li><font color="black">'+pregarr[third]+"</font>"+"<br>"+resparr[third]+"</li>"); if(!temp){anterior=msg;}
          
      }
         
         }
              
          }}
             function similar(a,b) {
    
    var lengthB = b.length;
    var lengthA = a.length;
    var equivalency = [];
   /* var minLength = (a.length > b.length) ? b.length : a.length; */   
   // var maxLength = (a.length < b.length) ? b.length : a.length;  
                 
    for(var i = 0; i < lengthB; i++) {
       
       equivalency.push(levenshtein(a,b[i]));
    }

    return (1-(d3.min(equivalency)/lengthA));
}
function similarpos(a,b) {
    
    var lengthB = b.length;
    var lengthA = a.length;
    var equivalency = [];
   /* var minLength = (a.length > b.length) ? b.length : a.length; */   
   // var maxLength = (a.length < b.length) ? b.length : a.length;  
                 
    for(var i = 0; i < lengthB; i++) {
       
       equivalency.push(levenshtein(a,b[i]));
    }

    return equivalency.indexOf(Math.min.apply(Math, equivalency));
}
function levenshtein(str1, str2) {
    var cost = new Array(),
        n = str1.length,
        m = str2.length,
        i, j;

    var minimum = function(a, b, c) {
        var min = a;
        if (b < min) {
            min = b;
        }
        if (c < min) {
            min = c;
        }
        return min;
    }

    if (n == 0) {
        return;
    }
    if (m == 0) {
        return;
    }

    for (var i = 0; i <= n; i++) {
        cost[i] = new Array();
    }

    for (i = 0; i <= n; i++) {
        cost[i][0] = i;
    }

    for (j = 0; j <= m; j++) {
        cost[0][j] = j;
    }

    for (i = 1; i <= n; i++) {
        var x = str1.charAt(i - 1);

        for (j = 1; j <= m; j++) {
            var y = str2.charAt(j - 1);

            if (x == y) {
                cost[i][j] = cost[i - 1][j - 1];
            } else {
                cost[i][j] = 1 + minimum(cost[i - 1][j - 1], cost[i][j - 1], cost[i - 1][j]);
            }

        } //endfor

    } //endfor

    return cost[n][m];
}
var secondMax = function (arr){ 
    var max = Math.max.apply(null, arr), // get the max of the array
        maxi = arr.indexOf(max);
    arr[maxi] = -Infinity; // replace max in the array with -infinity
    var secondMax = Math.max.apply(null, arr),
            maxi2 = arr.indexOf(secondMax);// get the new max 
 //   var ind = arr.indexOf(Math.max.apply(Math, arr)); To return second index.
    arr[maxi2] = -Infinity;
    var thirdMax = Math.max.apply(null, arr);
    var maxi3 = arr.indexOf(secondMax);
   // console.log(maxi2);console.log(maxi3);
    return [maxi2, maxi3];
};
function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
   //   });
});
}
