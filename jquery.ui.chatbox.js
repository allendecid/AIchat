!function(t){t.widget("ui.chatbox",{options:{id:null,title:null,user:null,hidden:!1,offset:0,width:300,messageSent:function(t,i,o){this.boxManager.addMsg(i.first_name,o)},boxClosed:function(){},boxManager:{init:function(t){this.elem=t},addMsg:function(i,o){var e=this,n=e.elem.uiChatboxLog,a=document.createElement("div");n.append(a),t(a).hide();var s=!1;if(i){var u=document.createElement("b");t(u).text(i+": "),a.appendChild(u)}else s=!0;var h=document.createElement(s?"i":"span");t(h).text(o),a.appendChild(h),t(a).addClass("ui-chatbox-msg"),t(a).css("maxWidth",t(n).width()),t(a).fadeIn(),e._scrollToBottom(),e.elem.uiChatboxTitlebar.hasClass("ui-state-focus")||e.highlightLock||(e.highlightLock=!0,e.highlightBox())},highlightBox:function(){var t=this;t.elem.uiChatboxTitlebar.effect("highlight",{},300),t.elem.uiChatbox.effect("bounce",{times:3},300,function(){t.highlightLock=!1,t._scrollToBottom()})},toggleBox:function(){this.elem.uiChatbox.toggle()},_scrollToBottom:function(){var t=this.elem.uiChatboxLog;t.scrollTop(t.get(0).scrollHeight)}}},toggleContent:function(){this.uiChatboxContent.toggle(),this.uiChatboxContent.is(":visible")&&this.uiChatboxInputBox.focus()},widget:function(){return this.uiChatbox},_create:function(){var i=this,o=i.options,e=o.title||"No Title",n=(i.uiChatbox=t("<div></div>")).appendTo(document.body).addClass("ui-widget ui-corner-top ui-chatbox").attr("outline",0).focusin(function(){i.uiChatboxTitlebar.addClass("ui-state-focus")}).focusout(function(){i.uiChatboxTitlebar.removeClass("ui-state-focus")}),a=(i.uiChatboxTitlebar=t("<div></div>")).addClass("ui-widget-header ui-corner-top ui-chatbox-titlebar ui-dialog-header").click(function(t){i.toggleContent(t)}).appendTo(n),s=((i.uiChatboxTitle=t("<span></span>")).html(e).appendTo(a),(i.uiChatboxTitlebarClose=t('<a href="#"></a>')).addClass("ui-corner-all ui-chatbox-icon ").attr("role","button").hover(function(){s.addClass("ui-state-hover")},function(){s.removeClass("ui-state-hover")}).click(function(){return n.hide(),i.options.boxClosed(i.options.id),!1}).appendTo(a)),u=(t("<span></span>").addClass("ui-icon ui-icon-closethick").text("close").appendTo(s),(i.uiChatboxTitlebarMinimize=t('<a href="#"></a>')).addClass("ui-corner-all ui-chatbox-icon").attr("role","button").hover(function(){u.addClass("ui-state-hover")},function(){u.removeClass("ui-state-hover")}).click(function(t){return i.toggleContent(t),!1}).appendTo(a)),h=(t("<span></span>").addClass("ui-icon ui-icon-minusthick").text("minimize").appendTo(u),(i.uiChatboxContent=t("<div></div>")).addClass("ui-widget-content ui-chatbox-content ").appendTo(n)),c=((i.uiChatboxLog=i.element).addClass("ui-widget-content ui-chatbox-log").appendTo(h),(i.uiChatboxInput=t("<div></div>")).addClass("ui-widget-content ui-chatbox-input").click(function(){}).appendTo(h)),d=(i.uiChatboxInputBox=t("<textarea></textarea>")).addClass("ui-widget-content ui-chatbox-input-box ui-corner-all").appendTo(c).keydown(function(o){return o.keyCode&&o.keyCode==t.ui.keyCode.ENTER?(msg=t.trim(t(this).val()),msg.length>0&&i.options.messageSent(i.options.id,i.options.user,msg),t(this).val(""),!1):void 0}).focusin(function(){d.addClass("ui-chatbox-input-focus");var i=t(this).parent().prev();i.scrollTop(i.get(0).scrollHeight)}).focusout(function(){d.removeClass("ui-chatbox-input-focus")});a.find("*").add(a).disableSelection(),h.children().click(function(){i.uiChatboxInputBox.focus()}),i._setWidth(i.options.width),i._position(i.options.offset),i.options.boxManager.init(i),i.options.hidden||n.show()},_setOption:function(i,o){if(null!=o)switch(i){case"hidden":o?this.uiChatbox.hide():this.uiChatbox.show();break;case"offset":this._position(o);break;case"width":this._setWidth(o)}t.Widget.prototype._setOption.apply(this,arguments)},_setWidth:function(t){this.uiChatboxTitlebar.width(t+"px"),this.uiChatboxLog.width(t+"px"),this.uiChatboxInput.css("maxWidth",t+"px"),this.uiChatboxInputBox.css("width",t-18+"px")},_position:function(t){this.uiChatbox.css("right",t)}})}(jQuery);
