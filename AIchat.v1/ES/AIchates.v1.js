
$(document).ready(function () {$('body').append('<div id="chat_div"></div><div id="log"></div><!-- Chat Head --><a id="chat-head" href="#"><i>1</i></a>');
    });
reg = typeof reg !== 'undefined' ? reg : /\, |\. /g; // lista de palabras a omitir
   csv = typeof csv !== 'undefined' ? csv : "faqes.csv";   // archivo con preguntas y respuestas
     decider = typeof decider !== 'undefined' ? decider : 0.6; // estimador jacobiano del exito de clasificación
     largomax = typeof largomax !== 'undefined' ? largomax : 8; // largo de la pregunta maximo, para valores mas altos la pregunta se divide en dos
     memoria = typeof memoria !== 'undefined' ? memoria : 0; // toma en cuenta el mensaje anterior al hacer la clasificación
     coef = typeof coef !== 'undefined' ? coef : 0.7; // coeficiente que permite errores de tipeo y asocia palabras con la misma raiz 
     weights = typeof weights !== 'undefined' ? weights : 1;// 1 para habilitar los pesos desde el csv, 0 para deshabilitar pesos
     train = typeof train !== 'undefined' ? train : 0; // 1 para habilitar entrenamiento
     nameagent = typeof nameagent !== 'undefined' ? nameagent : "Agente IA"; // Nombre del bot
     var check = null;
     
    
     
     $(document).ready(function () {
  $('#chat-head').addClass('animate');
  
  $("#chat-head").click(function() {
      
      if(check) { $("#chat_div").chatbox("option", "hidden", false);
                  
              }
              else { init(csv,decider,reg,largomax,memoria,coef, weights);check++;}
   
  });
  $("#load-more-content").click(function() {
      
      if(check) { $("#chat_div").chatbox("option", "hidden", false);
                  
              }
              else { init(csv,decider,reg,largomax,memoria,coef, weights);check++;}
   
  });
});

(function($) {
    $.widget("ui.chatbox", {
        options: {
            id: null, //id for the DOM element
            title: null, // title of the chatbox
            user: null, // can be anything associated with this chatbox
            hidden: false,
            offset: 0, // relative to right edge of the browser window
            width: 300, // width of the chatbox
            messageSent: function(id, user, msg) {
                // override this
                this.boxManager.addMsg(user.first_name, msg);
            },
            boxClosed: function(id) {
            }, // called when the close icon is clicked
            boxManager: {
                // thanks to the widget factory facility
                // similar to http://alexsexton.com/?p=51
                init: function(elem) {
                    this.elem = elem;
                },
                addMsg: function(peer, msg) { // peer es el nombre del que hablar
                    var self = this;
                    var box = self.elem.uiChatboxLog;
                    var e = document.createElement('div');
                    box.append(e);
                    $(e).hide();

                    var systemMessage = false;

                    if (peer) {
                        var peerName = document.createElement("b");
                        $(peerName).html(peer + "<br> ");
                        e.appendChild(peerName);
                        //Imagen
                       /* var elem = document.createElement("img");
                       elem.setAttribute("src", "css/ui-lightness/images/vchat40g.png");
                        elem.setAttribute("height", "40px");
                        elem.setAttribute("width", "40px");
                        elem.setAttribute("alt", "Flower");
                        e.appendChild(elem);*/
                    } else {
                        systemMessage = true;
                    }

                    var msgElement = document.createElement(
                        systemMessage ? "i" : "span");
                    $(msgElement).text(msg);
                    e.appendChild(msgElement);
                    $(e).addClass("ui-chatbox-msg");
                    $(e).css("maxWidth", $(box).width());
                    $(e).fadeIn();
                    self._scrollToBottom();

                    if (!self.elem.uiChatboxTitlebar.hasClass("ui-state-focus")
                        && !self.highlightLock) {
                        self.highlightLock = true;
                        self.highlightBox();
                    }
                },
                highlightBox: function() {
                    var self = this;
                    self.elem.uiChatboxTitlebar.effect("highlight", {}, 300);
                    self.elem.uiChatbox.effect("bounce", {times: 1}, 300, function() {
                        self.highlightLock = false;
                        self._scrollToBottom();
                    });
                },
                toggleBox: function() {
                    this.elem.uiChatbox.toggle();
                },
                _scrollToBottom: function() {
                    var box = this.elem.uiChatboxLog;
                    box.scrollTop(box.get(0).scrollHeight);
                }
            }
        },
        toggleContent: function(event) {
            this.uiChatboxContent.toggle();
            if (this.uiChatboxContent.is(":visible")) {
                this.uiChatboxInputBox.focus();
            }
        },
        widget: function() {
            return this.uiChatbox
        },
        _create: function() {
            var self = this,
            options = self.options,
            title = options.title || "No Title",
            // chatbox
            uiChatbox = (self.uiChatbox = $('<div></div>'))
                .appendTo(document.body)
                .addClass('ui-widget ' +
                          'ui-corner-top ' +
                          'ui-chatbox'
                         )
                .attr('outline', 0)
                .focusin(function() {
                    // ui-state-highlight is not really helpful here
                    //self.uiChatbox.removeClass('ui-state-highlight');
                    self.uiChatboxTitlebar.addClass('ui-state-focus');
                })
                .focusout(function() {
                    self.uiChatboxTitlebar.removeClass('ui-state-focus');
                }),
            // titlebar
            uiChatboxTitlebar = (self.uiChatboxTitlebar = $('<div></div>'))
                .addClass('ui-widget-header ' +
                          'ui-corner-top ' +
                          'ui-chatbox-titlebar ' +
                          'ui-dialog-header' // take advantage of dialog header style
                         )
                .click(function(event) {
                    self.toggleContent(event);
                })
                .appendTo(uiChatbox),
            uiChatboxTitle = (self.uiChatboxTitle = $('<span></span>'))
                .html(title)
                .appendTo(uiChatboxTitlebar),
            uiChatboxTitlebarClose = (self.uiChatboxTitlebarClose = $('<a href="#"></a>'))
                .addClass('ui-corner-all ' +
                          'ui-chatbox-icon '
                         )
                .attr('role', 'button')
                .hover(function() { uiChatboxTitlebarClose.addClass('ui-state-hover'); },
                       function() { uiChatboxTitlebarClose.removeClass('ui-state-hover'); })
                .click(function(event) {
                    uiChatbox.hide();
                    self.options.boxClosed(self.options.id);
                    return false;
                })
                .appendTo(uiChatboxTitlebar),
            uiChatboxTitlebarCloseText = $('<span></span>')
                .addClass('ui-icon ' +
                          'ui-icon-closethick')
                .text('close')
                .appendTo(uiChatboxTitlebarClose),
            uiChatboxTitlebarMinimize = (self.uiChatboxTitlebarMinimize = $('<a href="#"></a>'))
                .addClass('ui-corner-all ' +
                          'ui-chatbox-icon'
                         )
                .attr('role', 'button')
                .hover(function() { uiChatboxTitlebarMinimize.addClass('ui-state-hover'); },
                       function() { uiChatboxTitlebarMinimize.removeClass('ui-state-hover'); })
                .click(function(event) {
                    uiChatbox.hide();
                    self.options.boxClosed(self.options.id);
                    return false;
                })
                .appendTo(uiChatboxTitlebar),
            uiChatboxTitlebarMinimizeText = $('<span></span>')
                .addClass('ui-icon ' +
                          'ui-icon-minusthick')
                .text('minimize')
                .appendTo(uiChatboxTitlebarMinimize),
            // content
            uiChatboxContent = (self.uiChatboxContent = $('<div></div>'))
                .addClass('ui-widget-content ' +
                          'ui-chatbox-content '
                         )
                .appendTo(uiChatbox),
            uiChatboxLog = (self.uiChatboxLog = self.element)
                .addClass('ui-widget-content ' +
                          'ui-chatbox-log'
                         )
                .appendTo(uiChatboxContent),
            uiChatboxInput = (self.uiChatboxInput = $('<div></div>'))
                .addClass('ui-widget-content ' +
                          'ui-chatbox-input'
                         )
                .click(function(event) {
                    // anything?
                })
                .appendTo(uiChatboxContent);
                // Aqui se le agregan cosas al menu
        if (train){
            uiChatboxRest = (self.uiChatboxRest = $('<div><ul>	<li>		<a href="#">Preguntas relacionadas</a>	<ul id="respuestarel">		</ul>		</li>	<li>		<a href="#">Entrenador</a>		<ul class="closedt" id="entrena">	<li>¿Como clasificarías la respuesta?	<br>	<center><button type="button" id="correcto">Correcta</button>       <button type="button" id="falso">Falsa</button> </center><br><center> <button type="button" id="guardar">Guardar Entrenamiento</button></center></li><li id="listo"></li> 	</ul></li>	</ul></div>'))
                .addClass('ui-widget-content ' +
                          'ui-chatbox-rest ' 
                         )
                .appendTo(uiChatboxContent);}
    else {
            uiChatboxRest = (self.uiChatboxRest = $('<div><ul>	<li>		<a href="#">Preguntas relacionadas</a>	<ul id="respuestarel">		</ul>		</li>	</ul></div>'))
                .addClass('ui-widget-content ' +
                          'ui-chatbox-rest ' 
                         )
                .appendTo(uiChatboxContent);}
        //apend al mas grande o general.
            uiChatboxInputBox = (self.uiChatboxInputBox = $('<input type="text"  placeholder="Type Message ..." class="form-control">'))
                .addClass('ui-widget-content ' +
                          'ui-chatbox-input-box ' +
                          'ui-corner-all'
                         )
                .appendTo(uiChatboxInput)
                
                .keydown(function(event) {
                    if (event.keyCode && event.keyCode == $.ui.keyCode.ENTER) {
                        msg = $.trim($(this).val());
                        if (msg.length > 0) {
                            self.options.messageSent(self.options.id, self.options.user, msg);
                        }
                        $(this).val('');
                        return false;
                    }
                })
                
                .focusin(function() {
                    uiChatboxInputBox.addClass('ui-chatbox-input-focus');
                    var box = $(this).parent().prev();
                    box.scrollTop(box.get(0).scrollHeight);
                })
                .focusout(function() {
                    uiChatboxInputBox.removeClass('ui-chatbox-input-focus');
                });

            // disable selection
            uiChatboxTitlebar.find('*').add(uiChatboxTitlebar).disableSelection();

            

            self._setWidth(self.options.width);
            self._position(self.options.offset);

            self.options.boxManager.init(self);

            if (!self.options.hidden) {
                uiChatbox.show();
            }
        },
        _setOption: function(option, value) {
            if (value != null) {
                switch (option) {
                case "hidden":
                    if (value)
                        this.uiChatbox.hide();
                    else
                        this.uiChatbox.show();
                    break;
                case "offset":
                    this._position(value);
                    break;
                case "width":
                    this._setWidth(value);
                    break;
                }
            }
            $.Widget.prototype._setOption.apply(this, arguments);
        },
        _setWidth: function(width) {
            this.uiChatboxTitlebar.width(width + "px");
            this.uiChatboxLog.width(width + "px");
            this.uiChatboxInput.css("maxWidth", width + "px");
            this.uiChatboxRest.css("width", width  + "px");
            // padding:2, boarder:2, margin:5
            this.uiChatboxInputBox.css("width", (width - 18) + "px");
            
        },
        _position: function(offset) {
            this.uiChatbox.css("right", offset);
        }
    });
}(jQuery));

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
                                                title : nameagent,
                                                messageSent : function(id, user, msg) {
                                                  //  $("#log").append(id + " said: " + msg + "<br/>");
                                                    $("#chat_div").chatbox("option", "boxManager").addMsg(id, msg);
                                                     setTimeout( respuesta, 2500,msg);temp=0;
                                                }});
              $("#chat_div").chatbox("option", "boxManager").addMsg(nameagent, "Buenos días,¿Como está?\n¿Le puedo ayudar en algo?");

}}
          });

          function respuesta(msg, contexto){
        
            $("#listo").html("");
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
    console.log(maxdec);     


       if(largo>largomax){
            for (i = matcher[ind].length-1; i >-1; i--) {
       res.splice(matcher[ind][i], 1);}
   var newmsg = res.join(" ");
   //decider=decider-(0.067*(largo-res.length));console.log(maxdec);console.log(decider);
   //decider=decider-(((largo-res.length))/(resparr[ind].split(" ").length));console.log(maxdec);console.log(decider);
   maxdec=(largo-res.length)/(pregarr[ind].split(" ").length);
   mostrarmsg();
     /*if(maxdec>decider)mostrarmsg();
   if(matcher[ind].length>1)respuesta(newmsg,estimad); */// no se ejecuta

}else{mostrarmsg();}
    
 function mostrarmsg(){      
       if((maxdec>decider)&&inda!==ind){
       
           inda=ind;
            $("#chat_div").chatbox("option", "boxManager").addMsg(nameagent,resparr[ind] );
        $("#respuestarel").html('<li><font color="black">'+pregarr[ind]+"</font>"+"<br>"+resparr[ind]+"</li>"+'<li><font color="black">'+pregarr[sec]+"</font>"+"<br>"+resparr[sec]+"</li>"+'<li><font color="black">'+pregarr[third]+"</font>"+"<br>"+resparr[third]+"</li>"); 
         $.ajax({
         url: 'addlogES.php',
         type: 'POST',
         data: { msg: '"'+msg+'"', res: '"'+resparr[ind]+'"', val: maxdec, idx: ind }  
      });   
         if(!temp){anterior=msg;}
         }   
          else{if(anterior&&!temp&&memoria===1){temp=anterior;anterior=msg;respuesta(temp,estimad);}
             else{$("#chat_div").chatbox("option", "boxManager").addMsg(nameagent,"No tengo la información necesaria para responderle" ); $("#respuestarel").html('<li><font color="black">'+pregarr[ind]+"</font>"+"<br>"+resparr[ind]+"</li>"+'<li><font color="black">'+pregarr[sec]+"</font>"+"<br>"+resparr[sec]+"</li>"+'<li><font color="black">'+pregarr[third]+"</font>"+"<br>"+resparr[third]+"</li>"); if(!temp){anterior=msg;}
          $.ajax({
         url: 'addlogES.php',
         type: 'POST',
         data: { msg: '"'+msg+'"', res: "fail", val: maxdec, idx: 0}  
      });  
      }
         
         }
              
          }
 $( "#guardar" ).unbind().click(function() {
        JSONToCSVConvertor(data,true);
 
});             
$( "#correcto" ).unbind().click(function() {
 $("#listo").html('<li><font color="black">'+"Gracias, Información Enviada"+"</li>");
 //console.log(msg);
});
               
$( "#falso" ).unbind().click(function() {
  //$("#listo").html('<form action="passit.php">Correcta: <input type="text" name="fname" size="35"><br><input type="submit" value="Enviar"></form>');
  $("#listo").html('Correcta: <input type="text" name="fname" size="35" id="rcorr"><br><br><center><input type="submit" id="enviado" value="Enviar"></center>');
$( "#enviado" ).unbind().click(function() {console.log("Aqui")
    var bla = $('#rcorr').val();
    //console.log(bla);
   // console.log(msg);
   var strweights="";
   for (i = 0; i < largo; i++) {
                strweights+=1/largo+" ";}
            $.ajax({
         url: 'passites.php',
         type: 'POST',
         data: { msg: '"'+msg+'"', res: '"'+bla+'"', val: strweights }  
      });
      data.push({Pregunta:msg,Respuesta:bla,Weights:strweights});
      //var obj = JSON.parse(data);
     // console.log(JSON.stringify(data));
 
     //   JSONToCSVConvertor(data);
      
 $("#listo").html('<li><font color="black">'+"Gracias, Información Enviada"+"</li>");
});

    
}); 
      
          }
       

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
function JSONToCSVConvertor(JSONData,headers) {
    
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
        if (headers) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }

    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
       
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
       
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    

    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
   
    
    
    var link = document.createElement("a");    
    link.href = uri;
    
   
    link.style = "visibility:hidden";

    link.download = csv;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);  
    }
}


var defaultDiacriticsRemovalMap = [
    {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
    {'base':'AA','letters':/[\uA732]/g},
    {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
    {'base':'AO','letters':/[\uA734]/g},
    {'base':'AU','letters':/[\uA736]/g},
    {'base':'AV','letters':/[\uA738\uA73A]/g},
    {'base':'AY','letters':/[\uA73C]/g},
    {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
    {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
    {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
    {'base':'DZ','letters':/[\u01F1\u01C4]/g},
    {'base':'Dz','letters':/[\u01F2\u01C5]/g},
    {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
    {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
    {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
    {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
    {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
    {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
    {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
    {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
    {'base':'LJ','letters':/[\u01C7]/g},
    {'base':'Lj','letters':/[\u01C8]/g},
    {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
    {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
    {'base':'NJ','letters':/[\u01CA]/g},
    {'base':'Nj','letters':/[\u01CB]/g},
    {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
    {'base':'OI','letters':/[\u01A2]/g},
    {'base':'OO','letters':/[\uA74E]/g},
    {'base':'OU','letters':/[\u0222]/g},
    {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
    {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
    {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
    {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
    {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
    {'base':'TZ','letters':/[\uA728]/g},
    {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
    {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
    {'base':'VY','letters':/[\uA760]/g},
    {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
    {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
    {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
    {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
    {'base':'aa','letters':/[\uA733]/g},
    {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
    {'base':'ao','letters':/[\uA735]/g},
    {'base':'au','letters':/[\uA737]/g},
    {'base':'av','letters':/[\uA739\uA73B]/g},
    {'base':'ay','letters':/[\uA73D]/g},
    {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
    {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
    {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
    {'base':'dz','letters':/[\u01F3\u01C6]/g},
    {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
    {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
    {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
    {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
    {'base':'hv','letters':/[\u0195]/g},
    {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
    {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
    {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
    {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
    {'base':'lj','letters':/[\u01C9]/g},
    {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
    {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
    {'base':'nj','letters':/[\u01CC]/g},
    {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
    {'base':'oi','letters':/[\u01A3]/g},
    {'base':'ou','letters':/[\u0223]/g},
    {'base':'oo','letters':/[\uA74F]/g},
    {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
    {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
    {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
    {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
    {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
    {'base':'tz','letters':/[\uA729]/g},
    {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
    {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
    {'base':'vy','letters':/[\uA761]/g},
    {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
    {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
    {'base':'y','letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
    {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
];
var changes;
function removeDiacritics (str) {
    if(!changes) {
        changes = defaultDiacriticsRemovalMap;
    }
    for(var i=0; i<changes.length; i++) {
        str = str.replace(changes[i].letters, changes[i].base);
    }
    return str;
}

