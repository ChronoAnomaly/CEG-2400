//global variables
var screenWidth;
var winHeight;
var clickPos;
var windowResize;
var winResizeHeight;
var currWinWd;
var searchGap;
var longText;
var warrantySelected;
var indicatorHt;
var showMask = false;
var tempZipValue;

// Determine height of banners and use height for top sellers on category pages 
$(window).load(function() {
	if ($(".catbnr").length && $('#toptensell').length) {
		$("#cat_body .topsell_all").fadeIn(50);
		var offset_catbnr = $(".catbnr").offset();
		var offset_topSell = $("#toptensell").offset();
		var offsetList = $("#toptensell .prod").offset();
		
		var top_catbnr = offset_catbnr.top;
		var top_topSell = offset_topSell.top;
		var top_list = offsetList.top;
		
		var topDif = top_catbnr - top_topSell;
		var topDifList = top_list - top_catbnr;
		
		var catbnrHt = $(".catbnr").height();
		var topSellHt = catbnrHt + topDif;
		var listHt = catbnrHt - topDifList;
		
		$(".topsell_all").css("height",topSellHt);
		$("#toptensell .prod").css("height",listHt);
		
		$('#toptensell .prod').jScrollPane({verticalDragMinHeight:70,verticalDragMaxHeight:70,mouseWheelSpeed:30});
	}
	
	var lst = $('#searchBox_Old').val();
	if(lst){
		listBoxClick($('#'+lst),'searchBox');
	}
	
	// home page banner - GEC only
 	$("#gecMainPromo .jcarousel-skin-tango").jcarousel({
        scroll: 1,
		auto: 5,
		vertical: true,
		wrap: 'last',
        initCallback: promoHome_initCallback,
        // Do NOT to autobuild prev/next buttons
        buttonNextHTML: null,
        buttonPrevHTML: null
    });
	
	//FOR HOME PAGE SLIDER
	$(".placeHolderImg").hide();
	$(".mainpromo").show();
	
	if ($("#mainShopByContainer").length > 0) {
			$('.cat_brand').jScrollPane({verticalDragMinHeight:70,verticalDragMaxHeight:70,mouseWheelSpeed:30});
	}

	// custom scroll bar for Prod detail page
	if ($("#prod_search_layout").length > 0) {
		$('.prodDetailContainer .scroll-pane').jScrollPane({verticalDragMinHeight:112,verticalDragMaxHeight:112,mouseWheelSpeed:30});
	}
	
});

jQuery(document).ready(function($) {
	//to get position for pop up window
	screenWidth = $(window).width();
	winHeight = $(window).height();
	currWinWd = screenWidth;
	
	// id/name pre-selected warranty
	warrantySelected = $(".warrantyForm ul li.selected div a").attr("id");

   	// Main navigation menu
	// fuction for main navigation drop down - shop categories
    $('.menu .main_nav').hover(function() {
		$(this).addClass("navsel");
		$(this).children('div.navbbdr').show();
		$(this).children('div.showmenu').show();
	}, function() {
		$(this).removeClass("navsel");
		$(this).children('div.navbbdr').hide();
		$(this).children('div.showmenu').hide();

    });
    
    if (($("#unselectedNav").length > 0) && 
    		!(($.browser.msie) && ($.browser.version == '10.0')) && 
    		!(($.browser.msie) && ($.browser.version == '9.0')) && 
    		!(($.browser.msie) && ($.browser.version == '8.0'))) {
    	initShopCategories();
    }
	
	//** COUNT REMAINING CHARS **//
	$("[class*='charsRemain']").focus(function() {
		var maxChars = ($(this).attr("max-chars"));
		var idName = ($(this).attr("class"));
		charsCountDown(maxChars,idName);
	});
	//** COUNT REMAINING CHARS **//

	//populate zip,city,state values
	var zip = $('#zip').val();
	var bankzip = $('#bank_zip').val();
	if(zip){
		onAddressZipChangeCreditApp(zip, '');		
	}
	if(bankzip){
		onAddressZipChangeCreditApp(bankzip, 'bank_');		
	}
}); // end ready function

// If window resized, get new width
$(window).resize(function() {
	var topPos = $(window).scrollTop();
	windowResize = $(window).width();
	winResizeHeight = $(window).height();
	screenWidth = $(window).width();
	winHeight = $(window).height();
	doStuff(topPos);
	if ((currWinWd >= 1300 && windowResize < 1300) || (currWinWd < 1300 && windowResize >= 1300)) {
		resetSearch();
	}
	currWinWd = windowResize;
});
// If window resized, get new width, height

// Callback functions for home page promo sliding banner
function promoHome_initCallback(carousel) {
  $(document).on('click', '.jcarousel-control img', function() {
	  //event.preventDefault();
	  x= $(this).attr("value");
	  carousel.scroll($.jcarousel.intval(x));
	  //carousel.scroll(jQuery.jcarousel.intval($(this).text()));
	  return false;
  });

  $(".jcarousel-control img").mouseenter(function() {
	  x= $(this).attr("value");
	  carousel.scroll($.jcarousel.intval(x));
	  carousel.stopAuto();
	  return false;
  });

  $(".jcarousel-control img").mouseleave(function() {
	  carousel.startAuto();
	  return false;
  });
}

function doStuff(topPos) {
	if ($(".popUpExist").length > 0) {
		$(".popUpExist").each(function(index) {
			if ($(this).css("display") == "block") {
				var popWinNewPos = $(this).attr("id");
				popWinNewPos = "#" + popWinNewPos;
				windowPlacement(popWinNewPos,topPos);
			}
		});
	}

	if ($(".popUpWin").length> 0) {	
		var popWinNewPos = ".popUpWin"
		windowPlacement(popWinNewPos,topPos);
	}
	
	if ($("#popup_box_zoom").length> 0) {	
		var popWinNewPos = "#popup_box_zoom";
		windowPlacement(popWinNewPos,topPos);
	}
	
	if ($("#prod_search_layout").length > 0) {
			if (windowResize > 1300) {
				$('.prodDetailContainer .scroll-pane').jScrollPane({verticalDragMinHeight:112,verticalDragMaxHeight:112,mouseWheelSpeed:30});
			}
	}
	
	if ($("#mainShopByContainer").length > 0) {
			if (document.getElementById("brand_txt").style.display != "none") {
				$('#brand_col').jScrollPane({verticalDragMinHeight:70,verticalDragMaxHeight:70,mouseWheelSpeed:30})
			}
			else {
				$('#category_col').jScrollPane({verticalDragMinHeight:70,verticalDragMaxHeight:70,mouseWheelSpeed:30});
			}
	}

} // end do stuff


// config drop down and serch drop down
$(document).on("click", "div.listBox span", function()  {
	var parent = $($(this)).parent().attr("id");
	var parentId = "#" + parent;

	if ($(parentId + ' ul').css('display') == 'none') {
		$(parentId + ' ul').css('display','block');
	}
	else {
		$(parentId + ' ul').css('display','none');
	}
	$(parentId + ' li').click(function() {
		listBoxClick($(this),parent);
	});
});

function listBoxClick(lst,parent) {
	var num;
	var shortText;
	var inputWidthSearch;
	var newWidth;
	var optValueSelected
	var hiddenField = parent + "_hidden";
	var parentId = "#" + parent;
	var imgCount = document.getElementById("imgCont");
	
	if (imgCount){
		imgCount.style.display = "block";
	}
	
	$(parentId + ' ul').css('display','none');
	
	longText = ($(lst).text());
	longText = $.trim(longText);
	
	// config drop downs
	if (parent != "searchBox") {
		optValueSelected = $(lst).attr('configLineKey') + ":" + $(lst).attr('configLineSelectKey');
		document.getElementById(hiddenField).value = optValueSelected;
		document.getElementById(parent+"_key_hidden").value = $(lst).attr('itemkey');
	
		$(".price_sel").html($(lst).attr('price'));
		$(".prod_sel img").attr("src", $(lst).attr('imgSrc'));
	}
	
	// search drop down
	else {
		document.getElementById(hiddenField).value = longText;
		$('#'+hiddenField).val($(lst).val());
	}
	
	//config item
	if (parent != "searchBox") {
		num = 40;
	}
	
	//search related items
	else {
		var srchDivWid = $("div.search").width();
		var srchBtnWid = $("div.search .btn").width();
		inputWidthSearch = $("#searchInput").width();
		var searchBoxWidth= $("#searchBox").width();
		var totalWid = inputWidthSearch + searchBoxWidth + srchBtnWid;
		searchGap = srchDivWid-totalWid;
		
		if (($(window).width() < 1300) || ($("div.responsive").length != 1)) { 
			num = 10;
		}
	
		else {
			num = 20;
		}
	}
	
	shortText= longText.substr(0, num);
	
	if (shortText != longText) {
		shortText = shortText + "...";
	}
	
	$(parentId + ' span.selectedItem').text(shortText);
	$('#searchFailSelectedItem').text(longText);
	
	if (parent == "searchBox") {
		searchBoxWidth= $("#searchBox").width();
		newWidth = totalWid  - (searchBoxWidth + srchBtnWid);
		$("#searchInput").width(newWidth +"px");
	}
}

// to reset search area
function resetSearch() {
  var srchDivWid = $("div.search").width();
  var srchBtnWid = $("div.search .btn").width();
  var totalWid = srchDivWid - searchGap;
  var num;
  if (longText != undefined) {
	// look for search results column - #prod_search_layout
	if ((windowResize < 1300) || ($("div.responsive").length != 1)) {
		num = 10;
	}
	else {
		num = 20;
	}

	doReset(num,totalWid,srchBtnWid);
	}
}

function doReset(num,totalWid,srchBtnWid) {
  var inputWidthSearch;
  var newWidth;
	var shortText= longText.substr(0, num);
	if (shortText != longText) {
		shortText = shortText + "...";
	}

	$('#searchBox span:first-child').text(shortText);
	
	searchBoxWidth = $("#searchBox").width();
	newWidth = totalWid - (searchBoxWidth + srchBtnWid);
	//newWidth = inputWidthSearch + 75 - searchBoxWidth;
	$("#searchInput").width(newWidth +"px");
}


// FUNCTION USED FOR PRICE RANGE
//  ****** Tabs code ******

// Tabs for Add to Cart Pop Up
$(document).on('click', ".cartTabs p", function(event) {
    	event.preventDefault();
    	$(this).addClass("active").siblings("p.hdr").removeClass("active");
    	var activeTab = $(this).attr("id");
    	$("div." + activeTab).css("display", "block").siblings("div.tab").hide();
});

// Tabs for Add to Cart Pop Up

// Handle tab selection
$(document).on('click', "#mainShopByContainer div.tabContainer div, #mainTabContainer div.tabContainer div, #sellersContainer div.tabContainer div", function()  {
	//Get tab's content
	var getTabContent = "#" + $(this).attr("id");
	
	if ($(this).attr("id") == "category" && $(this).attr("clicked") == "false") {
		selectCategory('A');
		$(this).attr("clicked", "true");
	}
	
	//Make Tab Active
	$("div.tab").removeClass('active');
	$(this).addClass('active');

	//Show/Hide Tab Content
	$(getTabContent + "_txt").show().siblings().hide();

});

//  ****** End tabs code ******


//Search fail page - "Call us" button
$(document).on("click", "#callUs,.callUs", function () {
	$("#phoneBox").animate({height:"toggle"}, 1000, function() {
	});
});


// Callback function for slider in prod detail tab
function imageMovie_initCallback(carousel) {
    $('.slider-start').bind('click', function() {
        carousel.startAuto();
		$(".slider-start").addClass('active');
		$(".slider-stop").removeClass('active');
        return false;
    });

    $('.slider-stop').bind('click', function() {
        carousel.stopAuto();
		$(".slider-stop").addClass('active');
		$(".slider-start").removeClass('active');
        return false;
    });
}

function shopCategoriesOver(webPrimaryKey){
	if ($("#unselectedNav").html().length ==  0 || $("#unselectedNav").html().indexOf("progressbar_pop") > -1) {
		$("#unselectedNav nav.cat").addClass('hide');
		var obj = new Object();
		obj.url= "/headerTabAll";
		obj.data= "webPrimaryKey=" + webPrimaryKey;
		obj.successFunction= "shopCategoriesOverSuccess";
		createAjaxCall(obj);
	}
}

function shopCategoriesOverSuccess(data){
	$('#unselectedNav').html(data);
}

var switchProductTabTimer = null;
function productTabOver(webPrimaryKey){
	var func = "productTabOverTimeout(" + webPrimaryKey + ")";
	switchProductTabTimer = setTimeout(func, 50);
}

function productTabOut(){
	clearTimeout(switchProductTabTimer);
}

function productTabOverTimeout(webPrimaryKey){
	if ($("#show_maincatdetails_" + webPrimaryKey).html().length ==  0 || $("#show_maincatdetails_" + webPrimaryKey).html().indexOf("progressbar_pop") > -1) {
		$.ajax({
			type: "GET",
			url: "/headerTab",
			data: "webPrimaryKey=" + webPrimaryKey + "&ajaxDate=" + getAjaxDate(),
			cache: false,
			success: function(data){
				$('#show_maincatdetails_' + webPrimaryKey).html(data);

				$('#show_maincatdetails_' + webPrimaryKey).removeClass('hide');

				$('[id^="show_maincatdetails"]').each(function(i, obj) {
					if ($(this).attr('id') != 'show_maincatdetails_' + webPrimaryKey) {
						$(this).addClass('hide');
					}
				});
			},
			error: function(xhr, ajaxOptions, thrownError){
				if(xhr.readyState == 0 || xhr.status == 0) {
					return;  // it's not really an error This happens due to Response already commited 
				}
				if (!(typeof obj.errorFunction === "undefined")){
					window[obj.errorFunction](xhr.responseText);
				} else {
					alert("System Experienced a Failure !" + obj.url + "Need to remove the URL");
				}
			}
		});
	} else {
		$('#show_maincatdetails_' + webPrimaryKey).removeClass('hide');

		$('[id^="show_maincatdetails"]').each(function(i, obj) {
			if ($(this).attr('id') != 'show_maincatdetails_' + webPrimaryKey) {
				$(this).addClass('hide');
			}
		});
	}
}

var captchaRefresh = 0;

function refreshImage(id) {
   captchaRefresh++;	
   $("#"+id).attr("src", "/captchaReset?x=" + captchaRefresh);
}

function captchaRefreshCall(id){
	refreshImage(id);
	return true;
}
 
function createAjaxCall(obj,skipProgressBar, divId, nomask){
	var progressbar = false;
	var withoutMask = false;
	
	if (skipProgressBar) {
		progressbar = skipProgressBar;
	}
	
	if(nomask) {
		withoutMask = nomask;
		progressbar = nomask;
	}
	
	if (progressbar) {
		if ($("#"+divId).length > 0) {
			disableDiv($("#"+divId));
		} else {
			if(withoutMask){
				displayProgressBar(withoutMask);
			} else{
				displayProgressBar();
			}
		}
	}
	var dataObj ="ajaxDate=" + getAjaxDate();
    if(obj.data != undefined){
		if(obj.data instanceof Object)
		{
			dataObj = new Object();
			obj.data.ajaxDate = getAjaxDate();
			dataObj = obj.data;
		}
		else{
			dataObj = obj.data + "&ajaxDate=" + getAjaxDate();
		}
    }
	$.ajax({
		type: "GET",
		url: obj.url,
		data: dataObj,
		cache: false,
		success: function(data){
			if (skipProgressBar) {
				hideProgressBar();
			}
			window[obj.successFunction](data);
		},
		
		error: function(xhr, ajaxOptions, thrownError){
			hideProgressBar();
			if(xhr.readyState == 0 || xhr.status == 0) {
				return;  // it's not really an error This happens due to Response already commited 
			}
			if (!(typeof obj.errorFunction === "undefined")){
				window[obj.errorFunction](xhr.responseText);
			} else {
				//alert("System Experienced a Failure !" + obj.url + "Need to remove the URL");
				console.log("System Experienced a Failure !" + obj.url + "Need to remove the URL");
			}
		}
	});
}
function createAjaxCallPost(obj,skipProgressBar, divId)
{
	var progressbar = false;
	if (skipProgressBar) {
		progressbar = skipProgressBar;
	}
	
	if (progressbar) {
		if ($("#"+divId).length > 0) {
			disableDiv($("#"+divId));
		} else {
			displayProgressBar();
		}
	}
	var dataObj ="ajaxDate=" + getAjaxDate();
    if(obj.data != undefined){
		if(obj.data instanceof Object)
		{
			dataObj = new Object();
			obj.data.ajaxDate = getAjaxDate();
			dataObj = obj.data;
		}
		else{
			dataObj = obj.data + "&ajaxDate=" + getAjaxDate();
		}
    }
	$.ajax({
		type: "post",
		url: obj.url,
		data: dataObj,
		cache: false,
		success: function(data){
			
			hideProgressBar();
			window[obj.successFunction](data);
		},
		error: function(xhr, ajaxOptions, thrownError){
			hideProgressBar();
			if(xhr.readyState == 0 || xhr.status == 0) {
				return;  // it's not really an error This happens due to Response already commited 
			}
			if (!(typeof obj.errorFunction === "undefined")){
				window[obj.errorFunction](xhr.responseText);
			} else {
				//alert("System Experienced a Failure !" + obj.url + "Need to remove the URL");
				console.log("System Experienced a Failure !" + obj.url + "Need to remove the URL");
			}
		}
	});
  }

function  defaultErrorFunction(data){
	hideProgressBar();
	alert("System Experienced a Failure !");
}

function doNothingFun(data){
}


function captchaAjaxCall(){
	var obj = new Object();
	obj.url= "/captcha";
	obj.data= "x=" + captchaRefresh;
	obj.successFunction= "captchaSuccessResponse";
	obj.errorFunction="doNothingFun"
	createAjaxCall(obj);
}
//Captcha success response function
function captchaSuccessResponse(data){
	$(".captcha_image_acct").attr("src","/captcha");
	captchaRefresh++;
}

function createCaptchaImage(){
	$(".captcha_image_acct").attr("src", "/captchaReset?x=" + getAjaxDate());
}



//Feedback save function
var feedbackId = '';
function saveFeedback() {

	var obj = new Object();
	obj.url= $('#feedbackSubmitForm'+feedbackId).attr('action');
	obj.data= $('#feedbackSubmitForm'+feedbackId).serialize();
	obj.successFunction= "feedbackSuccessFun";
	obj.errorFunction= "feedbackErrorFun";
	createAjaxCall(obj);
	return false;
}

//Feedback success function
function feedbackSuccessFun(data) {
	if (data.indexOf('validation-messages') < 0) {
		$('#feedbackSubmitForm'+feedbackId).trigger("reset");
		$('#errorSection'+feedbackId).hide();
		$('#contentsId').hide();
		
		if(feedbackId == '_1'){
			//$().html
			createCaptchaImage();
			$('#successPopupLink').trigger('click');
			$('.error_sec').empty();
		} else {
			$("#feedbackSubmitForm").hide();
			$("#feedbackSuccessPopup").html(data);
			$("#feedbackSuccessPopup").show();
			$('.error_sec').hide();
			if($('#captcha_image_acct_1').length){
				createCaptchaImage();
			}
		}

	} 
	else {
		createCaptchaImage();
		$('#hideErrorOnPopup').show();
		highLightFormField(data);
	}
}

//Feedback Error function
function feedbackErrorFun(data){
	$('#feedbackErrorMessages').html("Error");
}

//ContactUs Save function
function saveContactUs(){
	var obj = new Object();
	obj.url = $("#contactUsSubmitForm").attr('action');
	obj.data = $("#contactUsSubmitForm").serialize();
	obj.successFunction = "contactUsSuccessFun";
	obj.errorFunction = "contactUsErrorFun";
	createAjaxCall(obj);
	return false;
}

//ContactUs success function
function contactUsSuccessFun(data){
	    if (data.indexOf("validation-messages") > -1) {
		highLightFormField(data);
		
	} 
	else{
		$(".error_sec").addClass('hide');
		document.getElementById("contactUsSubmitForm").reset();
	    var topPos = $(window).scrollTop();
		var getFile = "#contactUsSucessPopUp";
		$('#contactUsSucessMsg').show();
		// function in popup.js
		showWindow (getFile,topPos)
	}		
}

//ContactUs Error function
function contactUsErrorFun(data){
	alert("contactUs from error"+data);
}

function subscribeNewsletter(){
	var obj = new Object();
	obj.url = $("#subscribeNewsletterBottom").attr('action');
	obj.data = $("#subscribeNewsletterBottom").serialize();
	obj.successFunction = "subscribeNewsLetterSuccessFun";
	obj.errorFunction = "subscribeNewsLetterErrorFun";
	createAjaxCall(obj);
	return false;
}
function subscribeNewsLetterSuccessFun(data){
	if (data.indexOf("validation-messages") > -1) {
		highLightFormField(data);
		var tmp = data.substring(data.indexOf("{"), data.lastIndexOf('}')+1);
		eval("var jsonStr = " + tmp);
	    var message = jsonStr.hasMessage;
		var ids = message.reqId;
		var errmsg = message.error;
		if(ids!=null){
				if (ids.length > 0){
					//showBBoxMessage("Newsletter Subscription", "Required fields are highlighted");
					showBBoxMessage(newsletter_newsltr_title, req_fields_msg);
				}
		}		
	    var disp = "";
		if(errmsg!=null){
	    	if (errmsg.length > 0) {
				for (var i=0; i<errmsg.length; i++) {
					disp += '<span>' + errmsg[i] + '</span>';
				}
				showBBoxMessage(newsletter_newsltr_title, disp);
			}
		}
		
	} else{
		showBBoxMessage(newsletter_newsltr_title, data);
	}	
}

function subscribeNewsLetterErrorFun(data){
	showBBoxMessage(newsletter_newsltr_title, data);
}

//Chat function
function openChat(){
    gaEvent('Chat', 'Click', '', 0);
	window.open("/chat", "chat", "status=no,toolbar=no,width=440,height=500,resizable=no,scrollbars=no,location=no,directories=no,menubar=no,copyhistory=no");
}

function openChatForProduct(item){
    gaEvent('Chat', 'Click', 'Product Details', 0);
	window.open("/chat?item=" + item, "chat", "status=no,toolbar=no,width=440,height=500,resizable=no,scrollbars=no,location=no,directories=no,menubar=no,copyhistory=no");
}

function openChatForPicGroup(picGroup){
    gaEvent('Chat', 'Click', 'Picture Group', 0);
	window.open("/chat?picGroup=" + picGroup, "chat", "status=no,toolbar=no,width=440,height=500,resizable=no,scrollbars=no,location=no,directories=no,menubar=no,copyhistory=no");
}

function openChatForCart(){
    gaEvent('Chat', 'Click', 'Shopping Cart', 0);
	window.open("/chat?includeCart=true", "chat", "status=no,toolbar=no,width=440,height=500,resizable=no,scrollbars=no,location=no,directories=no,menubar=no,copyhistory=no");
}


function gaEvent(category, action, label, value) {
	if ((typeof dataLayer != 'undefined') && dataLayer) {
		dataLayer.push({
		  'event': 'gaEvent',
		  'eventCategory': category,
		  'eventAction': action,
		  'eventLabel': label,
		  'eventValue': value
		});
	}
}

function toggleBusinessAccountFields(accountType) {
	if((accountType == '0') || (accountType == '2')) {
		$('#businessAccountFields').addClass("hide");
	}
	else {
		if ((accountType == '9') || (accountType == '12') || (accountType == '13') || (accountType == '10') || (accountType == '14')) {
			$('#industryClassTr').addClass("hide");
			$("#kvkNumberReq").hide(); //Added by Nitesh, Ticket- EMEA-245
		}
		else if(accountType == '3'){
			$('#industryClassTr').removeClass("hide");
			$("#kvkNumberReq").hide();
			$("#taxRegNoReq").hide(); 
		} 
		else {
		  $('#industryClassTr').removeClass("hide");
			$("#kvkNumberReq").show(); //Added by Nitesh, Ticket- EMEA-245
			$("#taxRegNoReq").show();
		}
		$('#businessAccountFields').removeClass("hide");
	}
	industryClassSelectFun(accountType);	//Added by Lakshmi: Ticket- EMEA-419
}

// Added By Lakshmi:Ticket- EMEA-419
function industryClassSelectFun(accountType, selectedKey) {
	var selectVal = selectedKey;
	if(accountType == '1') {
	       $("#industryClass").empty();
           $("#industryClass").append('<option value=0>'+msg.selectone+'</option>');
	        for(key in industrialForNLBusiness){
			    if(key == selectVal){
				$("#industryClass").append('<option value="'+key+'" selected="true">'+industrialForNLBusiness[key]+'</option>');
				} else {
				$("#industryClass").append('<option value="'+key+'">'+industrialForNLBusiness[key]+'</option>');
				}              

	        }
	}
	if(accountType == '3') {
	     $("#industryClass").empty();
	     $("#industryClass").append('<option value=0>'+msg.selectone+'</option>');
	      for(key in industrialForNLPublic){
	         if(key == selectVal){
			 $("#industryClass").append('<option value="'+key+'" selected="true">'+industrialForNLPublic[key]+'</option>');
			 } else {
			 $("#industryClass").append('<option value="'+key+'">'+industrialForNLPublic[key]+'</option>');
			 }           
	        
	      }	
	}
}

$(document).on('click', '#emailCompareProductSubmit', function(event) {
	event.preventDefault();
	emailTemplateProductCompareSend()
});

function emailTemplateProductCompareSend(){
	$("#popup").css("visibility", "hidden");
	var obj = new Object();
	obj.url = $("#emailTemplateProductCompareForm").attr('action');
	obj.data = $("#emailTemplateProductCompareForm").serialize();
	obj.successFunction = "processSendCompareEmail";
	obj.errorFunction = "processErrorFun";
	createAjaxCallPost(obj,true);
	return false;
}

function processErrorFun(data){
	$("#popupMessagesSection").html(data);
	$("#popupMessagesSection").show();
}

function processSendCompareEmail(data){
	if (data.indexOf("Error") > -1) {
		ajaxCommonErrorHandling(data);
		
	} 
	
	else {
		$("#htmlData").val(data);
		var obj = new Object();
		obj.url = "/emailProductCompare";
		obj.data = $("#emailTemplateProductCompareForm").serialize();
		obj.successFunction = "sendCompareEmail";
		obj.errorFunction = "processErrorFun";
		createAjaxCallPost(obj);
	}
}


function ajaxCommonErrorHandling(data) {
	var html = data.substr(data.indexOf("Error")+5);
	$("div.error").html(html);
	$("div.error_sec").removeClass("hide");
}


function sendCompareEmail(data){
	$('body').append('<div id="mask"></div>');
	$("#popup").css("visibility", "visible");
	$('#mask').fadeIn(20, function(){
		if (data.indexOf("Error") > -1) {
			ajaxCommonErrorHandling(data);
		} 
		else {
			$("div.error_sec").addClass("hide");
			$(".form_2col ").html(data)
		}
	});
}

function selectBrand(selection){
	var obj = new Object();
	obj.url = "/shopByIndex";
	obj.data = "type=Brand&selection=" + escape(selection);
	obj.successFunction = "selectBrandSuccess";
	createAjaxCall(obj);
}

function selectBrandSuccess(data){
	$("#brand_col .jspPane").html(data);
	$("#brand_col").jScrollPane({verticalDragMinHeight:70,verticalDragMaxHeight:70,maintainPosition:false,mouseWheelSpeed:30});
}

function selectCategory(selection){
	var obj = new Object();
	obj.url = "/shopByIndex";
	obj.data = "type=Category&selection=" + escape(selection);
	obj.successFunction = "selectCategorySuccess";
	createAjaxCall(obj);
}

function selectCategorySuccess(data){
	$("#category_col .jspPane").html(data);
	$("#category_col").jScrollPane({verticalDragMinHeight:70,verticalDragMaxHeight:70,maintainPosition:false,mouseWheelSpeed:30});
}


// Warranty "Add Protection" button
$(document).on("click","#addWarrantyBtn", function() {
	if ($(this).attr("origin") == "Add_To_Cart") {
		//$("#addWarranty").html($("#addToCart_popUp #warrantyForm ul li.selected p:first-child").text().trim());
		$("#addWarranty").html($("#addToCart_popUp #warrantyForm ul li.selected p:first-child").text());
		//$("#warrantyPrice span").html($("#warrantyForm ul li.selected p.price").text().trim());
		// Edited By Lakshmi:IG-630
		$("#warrantyPrice span").html($("#warrantyForm ul li.selected p.price").text().replace("?", ""));
	
		var offsetWarranty = $("p#addWarranty").offset();
		offsetWarranty = offsetWarranty.top;
		var offsetPrice = $("#warrantyPrice").offset();
		offsetPrice  = offsetPrice.top;
		$("#warrantyPrice").css("margin-top", offsetWarranty-offsetPrice);
	
		warrantyAddPlansCart();
	} 
	
		else if ($(this).attr("origin") == "Cart_Warr_Add") {
			warrantyAddPlans('cart','2');
	}
});


//Warranty check box selections
$(document).on("click","#warrantyForm .warrantyBtn", function() {
	$(".warrantyBtn").removeAttr("checked");
	warrantySelected = $(this).attr("id");
	$(this).attr("checked", "checked");
	$("li").removeClass("selected");
	$(this).closest("li").addClass("selected");
	//var $warrantyImgStr = $("div.warrantyBadge").css("background-image");
	var $warrantyImgStr = $("div.warranty_badge.imgSwitch").css("background-image");
	var $warrantyImg = $warrantyImgStr.search("sprite_warranty");
	if ($warrantyImg >= 0) {
		$GEC = "true"
	}
	
	if ($("#addToCart_popUp").length > 0) {
		// warranty in cart pop up
		//put warranty info in the tab
		$("#warrantyCart span.plan").html($("#warrantyForm ul li.selected p#warrantyPlan").text());
		$("#warrantyCart span.tag").html($("#warrantyForm ul li.selected p.price").text().replace("?", ""));
		var warrantyType = $("#warrantyForm ul li.selected p:first-child").text();
		warrantyTypeStr = warrantyType.search(/Yr /i)-2;
		warrantyTypeStr = warrantyType.charAt(warrantyTypeStr);
	}
	
	else {
		// Product Detail page - warranty tab
		//place selected warranty info in the right hand area
		
		$(".rightWarranty p.hdr").html($("#warrantyForm ul li.selected p:first-child").text());
		$(".rightWarranty p:nth-child(2)").html($("#warrantyForm ul li.selected p:nth-child(2)").text());
		$(".rightWarranty p#selPrice").html($("#warrantyForm ul li.selected p:last-child").text());
		var warrantyType = $(".rightWarranty p.hdr").html();
		var warrantyTypeStr = warrantyType.charAt(0);
	}
	
	//replace warranty badges background pos
	if ($GEC == "true") {
		switch(warrantyTypeStr) {
			case "1": // 1 yr replacement
				bgPos = "0 0";
				break;
	
			case "3": // 3 yr accidental
				bgPos = "-340px -150px";
				break;
	
			default:
				if (warrantyType.indexOf("Accident") > 0) { //2 yr accident
					bgPos = "0 -150px";
				}
				else { // 2 yr replacement
					bgPos = "-340px 0";
				}
		} //end switch
	
		$("div.warranty_badge.imgSwitch").css("background-position", bgPos);
	}
});


$(document).on("click", ".rightWarranty a" , function() {
	if (this.id == "noThanks") {
		warrantySelected = "none";
		if ($("#warrantySelected")) {
			$("#warrantySelected").val(warrantySelected);
		}
		if ($(this).attr("rel") == "product_detail") {
			submitProduct();
		}
	}

	if ($("#warrantySelected")) {
		$("#warrantySelected").val(warrantySelected);
	}
});

function submitProductWarrantiesClear(){
	try{
		$("#warranty_selection").val('');
	}catch(err)
	{
	}
}

/*
 * This is called for "Add Protection" under Warranty Tab and AddProtection in Warranty Popup
 * Also submitProduct() is called when "No Thanks" is clicked in WarrantyPopup
 */
function submitProduct(warrantyAvailable, itemKey, picGroupKey){
	if ($('#itemQty_disp').length > 0) {
		var qty = $('#itemQty_disp').val();
		
		if (isNaN(qty) || (qty == '') || (qty < 1) || (qty.indexOf(".") > -1)) {
			//showBBoxMessage('Add To Cart','Please enter a valid quantity');
			showBBoxMessage(add_cart_title, valid_qty_msg);
			return false;
		}
		
		var maxQty = $('#itemQty_disp').attr('maxQty');
			if(maxQty > 0 && parseFloat(qty) > parseFloat(maxQty)){
				qty = maxQty;
			}
		$('#itemQty').val(qty);
	}
	
	  $("#submitProduct").trigger('click');
	  gaEvent('Cart', 'Add', 'Product Details Page', 0); 
	  return false;
  }
  
//for vendor
/*
 * This is called for "Add Protection" under Warranty Tab and AddProtection in Warranty Popup
 * Also submitProduct() is called when "No Thanks" is clicked in WarrantyPopup
 */
function submitProduct_vendor(warrantyAvailable, itemKey, picGroupKey) {
	if ($('#itemQty_disp').length > 0) {
		var qty = $('#itemQty_disp').val();
		
		if (isNaN(qty) || (qty == '') || (qty < 1) || (qty.indexOf(".") > -1)) {
			//showBBoxMessage('Add To Cart','Please enter a valid quantity');
			showBBoxMessage(add_cart_title, valid_qty_msg);
			return false;
		}
		
		$('#itemQty').val(qty);
	}
		
 }

//continue link on add to cart pop up..
// for now it closes the pop up
$(document).on("click", "a.continueOnly", function (event) {
	event.preventDefault();
  $('#mask,.popUpWin').fadeOut(10, function() {
	  $('#mask').remove();
	  $('.popUpWin').remove(); // removes any pop up window that was loaded via ajax call
  });

});

//continue link on add to cart pop up..
//for now it closes the pop up
$(document).on("click", "a.continueShop", function (event) {
	
	if($(this).attr('id') == 'frmRecnltyvewd'){
	}else if($(this).attr('id') == 'frmSavdfrltr'){
	}else{
		event.preventDefault();
		$('#mask,.popUpWin').fadeOut(10, function() {
		  $('#mask').remove();
		  $('.popUpWin').remove(); // removes any pop up window that was loaded via ajax call
		});
	}
});


//floatcart_view - now goes to the cart page instead of
// opening float cart
$(document).on("click", "#floatcart_view", function () {
	window.location = "/viewCart";
});



//*** update qty in floating cart ***
$(document).on('click', '#cartUpdateForm .update,#floatingCartForm .update', function(e) {
	//checking for empty cart
	if($(this).attr('id') == 'emptyCart'){
	}else{
	e.preventDefault();
	e.stopPropagation();
	$("div#ajaxEror").hide();
	 if ($(this).attr('id') == 'cartUpd') {
		document.getElementById('scNextAction').value = '';
		
		var obj = new Object();
		var data = $("#cartUpdateForm").serialize();
		data = data + "&ajaxRequest=TRUE";
		
		obj.url = '/updateFloatingCart';
		obj.data = data;
		obj.successFunction = "updateCartSuccessFun";
		obj.errorFunction = "updateFloatingCartError";
		createAjaxCallPost(obj, true);
	 }
	  else if ($(this).attr('id') == 'floatingUpd') {	
		document.getElementById('floatingCartForm').action = '/updateFloatingCart';
		
		var data = $("#floatingCartForm").serialize();
		data = data + "&ajaxRequest=TRUE";
		
		var obj = new Object();
		obj.url = $("#floatingCartForm").attr('action');
		obj.data = data;
		obj.successFunction = "updateFloatingCart";
		obj.errorFunction = "updateFloatingCartError";
		createAjaxCall(obj);
	 }
	 
	}
});

function updateCartSuccessFun(data) {
	// Added By Shabbir. TT Number: T20140407.0034
	if(showMask)
	{
		showMask = false;
		if ($('#mask').length == 0) {
			$('body').append('<div id="mask"></div>');
		}
		$('#mask').fadeIn(10);
	}

	//var jsonStr = $.parseJSON(data);
	eval("var jsonStr = " + data);
	
	if (data.indexOf("fc-error-messages") > -1) {
		$("div#ajaxEror").html(jsonStr.errorMessages);
		$("div#ajaxEror").show();
		
		if ($('div#shopcart table.cart').length > 0) {
			$('div#shopcart table.cart').html(jsonStr.floatingCartBody)
		}
		return;
	}
	
	if (data.indexOf("validation-messages") > -1) {
		$("div#ajaxEror").html(data);
		$("div#ajaxEror").show();
		return;
	}
	
	$("div#ajaxEror").html('');
	$("div#ajaxEror").hide();
	
	document.getElementById('floatingCartHeader').innerHTML = jsonStr.floatingCartHeader;
	
	if ($('div#shopcart table.cart').length > 0) {
		$('div#shopcart table.cart').html(jsonStr.floatingCartBody)
	}
	
	if (jsonStr.emptyCart == 'true') {
		$('div.chkout_sec').html(jsonStr.floatingCartSumary);
	} else {
		if ($('div.chkout_sec div.subtotal').length > 0) {
			if (jsonStr.floatingCartPrice) {
				$('div.chkout_sec div.subtotal').html(jsonStr.floatingCartPrice);
				$('div#itemSubTotal').html(jsonStr.itemSubTotal);
			}
		}
		
		if ($('div.paypal_checkout').length > 0) {
			$('div.paypal_checkout').html(jsonStr.floatingCartPaypal)
		}
	}
	if ($('div.discounts').length > 0) {
		if (jsonStr.floatingCartDiscount != "") {
			$('div.discounts').html(jsonStr.floatingCartDiscount);
		} else {
			$('div.discounts').html('');
			$('div.discounts').removeClass('discounts');
		}
	} else {
		if ($('div.discounts1').length > 0) {
			if (jsonStr.floatingCartDiscount != "") {
				$('div.discounts1').html(jsonStr.floatingCartDiscount);
				$('div.discounts1').addClass('discounts');
			}
		}
	}
	if ($('span#punchoutOrderMsg').length > 0) {
		if (jsonStr.punchOutOrderMessage != "") {
			$('span#punchoutOrderMsg').html(jsonStr.punchOutOrderMessage);
		}		
	}
	
	var zipvalue=$('div.zip span#shipCostZip').html();
	
		//Modified by Sumaiya for IG-397
		if(zipvalue!=undefined && zipvalue != null && zipvalue !=''){
		
		calculateShippingAjax(zipvalue);
		}else{
			calculateShippingAjax(tempZipValue);
		}	
}

// *** update floating cart ***
function updateFloatingCart(data) {
	eval("var jsonStr = " + data);
	document.getElementById('floatingCartHeader').innerHTML = jsonStr.floatingCartHeader;
	// if on addons pop up do not put a mask
	
	if (jsonStr.floatingCartBody) {
		if ($('#mask').length == 0) {
			$('body').append('<div id="mask"></div>');
		}
		if ($('#addToCart_popUp').length == 0) {
			$('body').append('<div id="addToCart_popUp" class="popUpWin"></div>');
		}
		
		$("#addToCart_popUp").html(jsonStr.floatingCartBody);
		//Window placement
		windowPlacement("#addToCart_popUp",clickPos);
		
		$('#mask').fadeIn(10);
	} else {
		if ($('#mask').length > 0) {
			$('#mask').remove();
		}
		if ($('.popUpWin').length > 0) {
			$('.popUpWin').remove();
		}
	}
	
	// see if we are on the shopping cart page
	// if we are, we need to replace
	var pageContentsElem = document.getElementById("midsec");
	var shoppingCartPageElem = document.getElementById("shopcart");
	if(pageContentsElem && shoppingCartPageElem) {
	}
}

function updateFloatingCartError(data) {
	alert("updateFloatingCartError = " + data);
}


$(document).on('click', "#emailCartSubmit", function(e)  {
		e.preventDefault();
		e.stopPropagation();
		$('input:submit').attr("disabled", true);
		emailCartSend();
		gaEvent('Cart', 'Email', '', 0);
});


function emailCartSend(){
	var obj = new Object();
	obj.url = $("#emailCartFormId").attr('action');
	obj.data = $("#emailCartFormId").serialize();
	obj.successFunction = "emailCartSuccess";
	obj.errorFunction = "emailCartError";
	createAjaxCall(obj);
	return false;
}


function emailCartSuccess(data){
	if (data.indexOf("validation-messages") > -1) {
		 $('input:submit').removeAttr('disabled');
		highLightFormField(data);
		
	} 
	else {
		// need to call /emailCart for confirmation
		$('#emailCartPopup').html(data);
		$('emailcart_popup').show();
	}
}

function emailCartError(data) {
	alert("emailCartError = " + data);	
}


function highLightFormField(data) {	
	if (data.indexOf("validation-messages") > -1) {
		if (data.indexOf("hasMessage") >= 0) {
			var tmp = data.substring(data.indexOf("{"), data.lastIndexOf('}')+1);
			$('.error_sec').removeClass("hide");
			
			// this is to check if coming from log-in page
			// no ajax call
             if ($("div.error_sec").attr("origin") == "logIn") {
           		$("div.error_icon").show();
			}
			
			eval("var jsonStr = " + tmp);
			var message = jsonStr.hasMessage;
			var ids = message.reqId;
			var errmsg = message.error;
	
			if (ids == undefined) {
				$("span#reqFldHlt").hide();
			}	
			else {
				$("span#reqFldHlt").css("display", "block");
			}
			
			if (errmsg == undefined) {
				$('span#customErrMsg').hide();
			}
					
			else {
				$('span#customErrMsg').css("display", "block");
			}
			
			if(ids!=null){
				if (ids.length > 0){
					for (var i=0; i<ids.length; i++) {
						$('#'+ids[i]).addClass("highlight");
						if ($('#'+ids[i]+'Label')) {
							$('#'+ids[i]+'Label').addClass("highlight");
						}
					}
				}
			}
				
			var disp = "";
			if(errmsg!=null){
			if (errmsg.length > 0) {
				for (var i=0; i<errmsg.length; i++) {
					disp += '<span>' + errmsg[i] + '</span>';
				}
				$('span#customErrMsg').html(disp);
			}
			}
		} 
		
		else {
			$('.error_sec').removeClass("hide");
			$("span#reqFldHlt").css("display", "none");
			$("div.error_icon").show();
			$('span#customErrMsg').html('<span>' + data + '</span>');
			$('span#customErrMsg').css("display", "block");
		}
	} 
}

function clearHilighted(id){		
	if ($("#"+id).val()!=null && $("#"+id).val()!='' && $("#"+id).val().length>0) {
		var labelId =id + "Label";			  
		$("#"+id).removeClass('highlight');
		$("#"+labelId).removeClass('highlight');
	}
}	

function clearLabel(id) {
	$('label' +"#"+id).removeClass('highlight');
}


// *** save cart ***
$(document).on("click", "#saveCartFormId .submit#saveCartSubmit", function (e) {
	e.preventDefault();
	e.stopPropagation();
	$('input:submit').attr('disabled','disabled');
	$('.error_sec').css("display", "none");
		var obj = new Object();
		obj.url = $("#saveCartFormId").attr('action');
		obj.data = $("#saveCartFormId").serialize();
		obj.successFunction = "saveCartSuccess";
		obj.errorFunction = "saveCartError";
		createAjaxCallPost(obj);
		return false;
});

function saveCartSuccess(data){
	if (data.indexOf("validation-messages") > -1) {
	 $('input:submit').removeAttr('disabled');
		$('.error_sec').css("display", "");
		highLightFormField(data);
	} else {
		gaEvent('Cart', 'Save', '', 0);
	    window.location.href = "/viewCart";
		
	}
}
function saveCartError(data) {
	if (data.indexOf("Error") > -1) {
		$('#saveCartErrors').innerHTML = data;
		$('#saveCartErrorsSection').show();
	}
}

// *** checkout paypal ***
$(document).on('click','.btn_paypal#cartCheckoutPaypal', function(event) {
	event.preventDefault();
	if ($(this).attr('id') == "cartCheckoutPaypal") {
		document.getElementById('scNextAction').value = 'checkoutPayPal';
		document.getElementById('requestForQuote').value = 'false';
		$("#cartUpdateForm").submit();
	}
});

// *** checkout floating cart ***
$(document).on('click','.checkout,.requestQuote', function(e) {
	 var topPos = $(window).scrollTop();
	// For Picture group, onclick will take it to viewCart
	if("pg" != $(this).attr('rel')) {
		e.preventDefault();
		e.stopPropagation();
		
		if ($(this).attr('id') == "cartCheckout") {
			document.getElementById('scNextAction').value = 'checkout';
			document.getElementById('requestForQuote').value = 'false';
			$("#cartUpdateForm").serialize();
			$("#cartUpdateForm").submit();

		} 
		else if ($(this).attr('id') == "floatingCartCheckout") {
			document.getElementById('requestForQuoteFloatingCart').value = 'false';
			document.getElementById("floatingCartForm").action = "/checkoutFloatingCart";
			var obj = new Object();
			obj.url = $("#floatingCartForm").attr('action');
			obj.data = $("#floatingCartForm").serialize();
			obj.successFunction = "checkoutFloatingCart";
			obj.errorFunction = "checkoutFloatingCartErrorFun";
			createAjaxCall(obj);

		} else if ($(this).attr('id') == "cartCheckoutPunchout") {		
			document.getElementById('scNextAction').value = "checkoutCXML";
			$("#cartUpdateForm").serialize();
			$("#cartUpdateForm").submit();	
			
		} else if ($(this).attr('id') == "requestQuote") {
			document.getElementById('scNextAction').value = 'checkout';
			document.getElementById('requestForQuote').value = 'true';
			$("#cartUpdateForm").serialize();
			$("#cartUpdateForm").submit();	
			
		} else if ($(this).attr('id') == "floatingCartCheckoutQuote") {
			document.getElementById('requestForQuoteFloatingCart').value = 'true';
			document.getElementById("floatingCartForm").action = "/checkoutFloatingCart";
			var obj = new Object();
			obj.url = $("#floatingCartForm").attr('action');
			obj.data = $("#floatingCartForm").serialize();
			obj.successFunction = "checkoutFloatingCart";
			obj.errorFunction = "checkoutFloatingCartErrorFun";
			createAjaxCall(obj);
		} else if ($(this).attr('id') == "mapPriceCheckout"){
			$('#itemId').val($('#mapPriceCheckout').attr('href').split('/')[3]);
			
			if($('#mapPriceCheckout').attr('href').split('/').length > 4){
				$('#sellerKey').val($('#mapPriceCheckout').attr('href').split('/')[5]);
			}
			
			$('#mapPriceCheckoutForm').serialize();
			$('#mapPriceCheckoutForm').submit();
		}
		else if($(this).attr('id') == "customizedProductCheckout") {
			var cartForm = $('#addCartForm');
			var numChecked = 0;
			$(".sub_checkbox:checked").each(function() {
				if ($(this).is(':checked')) {
					numChecked++;
					var itemKey = $(this).attr("id").replace('checkboxList_', '');
					var qty = $("#quantityList_"+itemKey).val();
					if(qty <= 0 ){
						qty = 1;
					}
					var itemKeyField = document.createElement("input");
					itemKeyField.setAttribute("type", "hidden");
					itemKeyField.setAttribute("name", "item");
					itemKeyField.setAttribute("value", itemKey);
					$(cartForm).append(itemKeyField);
						
					var qtyField = document.createElement("input");
					qtyField.setAttribute("type", "hidden");
					qtyField.setAttribute("name", "qty");
					qtyField.setAttribute("value", qty);
					$(cartForm).append(qtyField);
				  }
			});

			if (numChecked == 0){
				window.location="/viewCart";
			  } else {
				cartForm.submit();
			  }
		}
	}
});

$(document).on('click','.submitCmt', function(e) {
	e.preventDefault();
	saveFeedback();
});


// the floating cart might have a checkout button which will go
// to the view cart page.  If this button is selected, the
// quantities should be updated with what is in the floating cart.
// This method will make sure the action is correct since it is
// changed by updateFloatingCart.
function checkoutFloatingCart(data){
	if(data.indexOf('pcs-error-messages') < 0){
		eval("var jsonStr = " + data);
		var pageName = jsonStr.pageName;
		window.location.href = pageName;
	}
}

function checkoutFloatingCartErrorFun(data) {
	alert("checkoutFloatingCartErrorFun: " + data);
}

//on the order history search page, if the user searches
// by status, we will show a drop down of the various statuses
// if the user doesn't search by status, we will show a free form text field
function toggleOrderHistorySearchTerm(searchType){
	if(!searchType){
		return;
	}

	var termElem = document.getElementById("orderHistorySearchValue");
	var statusElem = document.getElementById("orderHistorySearchStatusValue");

	if(searchType == "status")
	{
		termElem.style.display = "none";
		statusElem.style.display = "";
	}
	else if (searchType == "myOrders" || searchType == "companyOrders"){
		termElem.disabled = true;
		statusElem.style.display = "none";
		termElem.style.display = "";
	}
	else {
		termElem.disabled = false;
		statusElem.style.display = "none";
		termElem.style.display = "";
	}
}

function hideBBoxClose(){
	$('#mask,.popUpWin,.popUpExist').fadeOut(300, function() {
		$('#mask').remove();
		$('.popUpWin').remove();
	});
}

var compareSelectedItemKey = 0;
function removeComparedItem(itemKey) {
	if($("#comparedItems").length > 0) {
		var keys = $("#comparedItems").val();
		var highlight = $("#highlight").val();
		var newKeys = keys.replace(itemKey+";","");
		try{
			compareSelectedItemKey = itemKey;
			$('#checkboxList_'+itemKey).removeProp('checked');
		}
		catch(err){}
		var obj = new Object();
		obj.url = '/productCompareRemove';
		obj.data = 'highlight='+highlight+'&keys='+newKeys;
		obj.successFunction = "highlightSuccessFun";
		createAjaxCall(obj);
	}
}

function highlightDifferences(highlight){
	var obj = new Object();
	obj.url = '/productCompareHighlight';
	if (highlight) {
		obj.data = 'highlight=true&keys='+$("#comparedItems").val();
	}else{
		obj.data = 'keys='+$("#comparedItems").val();
	}
	obj.successFunction = "highlightSuccessFun";
	createAjaxCall(obj);
}

function highlightSuccessFun(data){
	$(".compare_popup").html(data);
	try{
		if(compareSelectedItemKey > 0){
			selectItem(compareSelectedItemKey);
			compareSelectedItemKey = 0;
		}
	}
	catch(err){}
}

function removeItemFromShoppingList(itemKey) {
	var productListKey = $('#listkeyId').val();
	var obj = new Object();
	obj.url = '/account/removeFromList';
	obj.data = 'shoppingListsUIModel.itemKey='+itemKey+'&shoppingListsUIModel.productList.productListKey='+productListKey;
	obj.successFunction = "removeItemFromShoppingListSuccessFun";
	createAjaxCall(obj);
}

function removeItemFromShoppingListSuccessFun(data) {
	document.location.reload();
}

function removeItemFromShoppingListPopUp(itemKey) {
	var productListKey = $('#listkeyId').val();
	var obj = new Object();
	obj.url = '/account/removeItemFromShopListsPopUp';
	obj.data = 'shoppingListsUIModel.itemKey='+itemKey+'&shoppingListsUIModel.productList.productListKey='+productListKey;
	obj.successFunction = "removeItemFromShoppingListPopUpSuccessFun";
	createAjaxCall(obj);
}

function removeItemFromShoppingListPopUpSuccessFun(data) {
	var result = $(data).find('#shoplists_sec_body_content');
	$('#shoplists_sec_body_content').html(result);
}

function toggleMoreHide(div){
	$('#label'+div).hide();
	$('#div'+div).removeClass('hide')
}

function toggleLessHide(div){
	$('#label'+div).show();
	$('#div'+div).addClass('hide')
}

function navigateFacet(checkbox){
	var url = $(checkbox).val();
	window.location.href = url
}

// for left nav facets
$(document).on("click", "#leftnav p.type", function(e){
	e.preventDefault();
	e.stopPropagation();
	var $list = $(this).attr("list");
	if ($list != "none") {
		var $arrow = $(this).children("span");
		var $ulList = "#" + $list;
		$($ulList).slideToggle("fast");
		$($arrow).toggleClass("closed");
	}
})


// for left nav facets - more links
$(document).on("click", "#leftnav li.more_facets a", function(e){
	e.preventDefault();
	e.stopPropagation();
	var $contents = $(this).attr("href");
	var $contentsDiv = "#more" + $contents;
	$($contentsDiv).slideToggle("slow", function () {
		$(".moreLess" + $contents).toggle()
	});
})

function navigateSliderFacet(idx){
	var strPriceTemp = "";
	strPriceTemp=$( "#sliderFacetText_" + idx ).val()+":"+$( "#sliderMinVal_" + idx ).val()+".."+$( "#sliderMaxVal_" + idx ).val();
	var str=$("#sliderFacetValue_" + idx).val();
	var url = str.replace($( "#sliderFacetReplaceText_" + idx ).val(),strPriceTemp);
	window.location.href = url;
}

function search(){
	var map = {};
	// add a item
	$('.psearch').each(function(){
		if($(this).is(':checked') && $(this).val() != '' ){
			var key = $(this).attr('id');
			var valueNew = $(this).val();
			var value = map[key];
			if (value===undefined)
			{
				value = valueNew
			}
			else
			{
				value = value +'|'+ valueNew ;
			}
			map[key] = value;
		}
	});
	var finalUrl = "";
	for (var m in map){
		if(finalUrl != ''){
			finalUrl = finalUrl +',' + m +'=' + map[m];
		}else{
			finalUrl = m +'=' + map[m];
		}
	}
}

function addCartFormErrorFun(html) {
	window.location = "/viewCart";
}

// this function will be called when any addons are added from floating cart
function addCartFormFCNoMarkupSuccessFun(html) {
	eval("var jsonStr = " + html);
	if ($('#mask').length == 0) {
		$('body').append('<div id="mask"></div>');
	}
	itemAdded = jsonStr.itemAdded;
	itemsincart = jsonStr.itemsincart;
	
	$(".viewItems span").html(itemsincart);
	document.getElementById('floatingCartHeader').innerHTML = jsonStr.floatingCartHeader;
	$("#itemadded_"+itemAdded).show();
	$('#mask').fadeIn(10);

	// Added By Shabbir. TT Number: T20140407.0034
	showMask = true;
	var obj = new Object();
	obj.url= "/viewCartJsonForCartPage";
	obj.data= "random=" + getAjaxDate()+"&ajaxRequest=true";
	obj.successFunction= "updateCartSuccessFun";
	createAjaxCall(obj,true);
}


//This method is also called from picGrid.js
//accessories will be true in picGrid Page where we need to show the addOns after adding to cart
function addCartFormFCSuccessFun(html, accessories){
	if(html.indexOf('pcs-error-messages') < 0){
		hideBBoxClose();
		
		if ($("#warranty_selection").length > 0) {
			$("#warranty_selection").val("");
		}
		
		if (accessories) {
			showAddOnForPG(html);
		} 
		else {
			updateFloatingCartPD(html);
		}
	}
}

function updateFloatingCartPD(data) {
	updateFloatingCart(data);
	
	//if the call is originating from enlargeImage Page, then close the page
	if($("#addToCartEnlargeImage").length > 0) {
		if($("#popupBoxClose").length > 0 ) {
			$("#popup_box_zoom").remove();
		}
	}
	
	//if addtoCart(prod component) is called from suggestion lightbox from pg
	if($("#picGroupKey_val").length > 0 && $(".cart_noitems").length > 0) {
		updatePicGroupCart(); // function defined in picGroup.js
	}
	
	if($("#popup_box_zoom").length > 0) {
		if($("#zoomIn").length > 0) {
			$("#zoomIn").removeClass("zoomOn");
		}
		
		if($("div#zoomInPopUp").length > 0) {
			$("div#zoomInPopUp").remove();
		}
		
		if($("#popup_box_zoom").length > 0) {
			$('#popup_box_zoom').remove();
		}
	}
}

// *** pz update qty in review ***
function updatePzMultiQty(oln, minQty){
	var totalQty = 0;
	$('#pzMutltiQtyForm input, #pzMutltiQtyForm select').each(function(inp) {
		var item = $(this);
		var name = item.attr('name');
		var val = item.val();
		if (name && name.indexOf('pzqty') == 0 && val && parseInt(val)  > 0) {
			totalQty += parseInt( val);
		}
	});

	if (totalQty >= minQty ) {
		document.getElementById('qtyOrdered').value = totalQty;
		document.getElementById(oln + '_quantities').value = totalQty;
		document.getElementById(oln + '_pzTotalQty').innerHTML = totalQty;
		document.getElementById('scNextAction').value = '';
		document.getElementById('pzMutltiQtyForm').submit();
	}

}


// updateFcMarkup : true when items are added in floating cart i.e addons
// accessoryTab : 'y' when coming from acccessories tab of product details
function addItemToShoppingCart(itemKey, qty, customize, fc, uom, updateFcMarkup, accessoryTab, vendorKey, conditionKey, recntlyvewd, savdfrltr, savedItemId,sellerSequence) {
	if($('#addCartForm').length == 0) {
		$('body')
        .append('<form id="addCartForm" name="addCartForm"></form>');
	}
	
	var cartForm = $('#addCartForm');
	var inputLengthCut = 0;
	if($('#inputLengthCutField').length > 0){
		inputLengthCut = $('#inputLengthCutField').val();
		if (isNaN(inputLengthCut) || (inputLengthCut == '') || (inputLengthCut <= 0)) {
			//showBBoxMessage('Add To Cart','Please enter a valid length in ' + uom + ' for this product');
			showBBoxMessage(add_cart_title, custom_cut_valid_length_msg + ' ' + uom + ' ' + custom_cut_for_this_prod_msg);
		    return false;
	    }

		if($('#inputLengthCutMin') && $('#inputLengthCutMax')){
			  var minCut = parseFloat($('#inputLengthCutMin').val());
			  var maxCut = parseFloat($('#inputLengthCutMax').val());
			  if (minCut <= 0 && $('#unitLength') && (parseInt($('#unitLength').val())) > 0 ) {
				  minCut = parseInt($('#unitLength').val());
			  }
			  if (minCut > 0 ) {
				  if (maxCut > 0 ){
					  if (inputLengthCut < minCut || inputLengthCut > maxCut) {
						  //showBBoxMessage('Add To Cart','Please specify a custom cut length between ' + minCut + ' ' + uom + ' and ' + maxCut + ' ' + uom + ' ');
						  showBBoxMessage(add_cart_title, custom_cut_between_msg + ' ' + minCut + ' ' + uom + ' ' + custom_cut_and_msg + ' ' + maxCut + ' ' + uom + ' ');
						  return false;
					  }  else if (unitLength && (parseInt(inputLengthCut) % parseInt(unitLength.value)) > 0) {
						 // showBBoxMessage('Add To Cart','Please specify a custom cut length in increments of ' + unitLength.value + ' ' + uom + ' ');
						  showBBoxMessage(add_cart_title, custom_cut_increments_msg + ' ' + unitLength.value + ' ' + uom + ' ');
						  return false;
					  }
				  } else {
					  if (inputLengthCut < minCut) {
						 // showBBoxMessage('Add To Cart','Please specify a custom cut length in minimum ' + minCut + ' ' + uom + ' ');
						  showBBoxMessage(add_cart_title, custom_cut_min_msg + ' ' + minCut + ' ' + uom + ' ');
						  return false;
					  } else if (unitLength && (parseInt(inputLengthCut) % parseInt(unitLength.value)) > 0) {
						  //showBBoxMessage('Add To Cart','Please specify a custom cut length in increments of ' + unitLength.value + ' ' + uom + ' ');
						  showBBoxMessage(add_cart_title, custom_cut_increments_msg + ' ' + unitLength.value + ' ' + uom + ' ');
						  return false;
					  }
				 }
			 }
		}
	}

	var $inputs = $('#addCartForm :input');
	$inputs.each(function() {
        $(this).remove();
    });

	if($('#selectProductRule-'+itemKey).length > 0){
		var values = $('#selectProductRule-'+itemKey).val();
		var arr = values.split("~");
		var selectedProductRuleActionKey = arr[1];

		if(arr.length == 2 && parseInt(selectedProductRuleActionKey) > 0)
		{
			$('<input>').attr({
			    type: 'hidden',
			    id: 'productRuleActionKey',
			    name: 'productRuleActionKey'
			}).appendTo('#addCartForm');
			$('#productRuleActionKey').val(selectedProductRuleActionKey);


			if($('#lockTxt').length > 0 && arr[0] != null && arr[0] != 'null')
			{
				var txtAddDataValue = $('#lockTxt').val();
				if(txtAddDataValue != '') {
					$('<input>').attr({
					    type: 'hidden',
					    id: 'productRuleActionValue',
					    name: 'productRuleActionValue'
					}).appendTo('#addCartForm');
					$('#productRuleActionValue').val(txtAddDataValue);
				} else {
					//showBBoxMessage('Add To Cart','Please enter a value for '+$('#productRuleActionDescription').val()+'.');
					showBBoxMessage(add_cart_title, masterlock_enter_value_msg + ' ' + $('#productRuleActionDescription').val()+'.');
					return false;
				}
			}
		} else {
			//showBBoxMessage('Add To Cart','Please select an option for '+$('#productRuleDescription').val()+'.');
			showBBoxMessage(add_cart_title, masterlock_select_option_msg + ' '+ $('#productRuleDescription').val()+'.');
			return false;
		}
	}
	// this code is included to move the config item from save for later to shopping cart.
    if(sellerSequence!=""){
    	var selectedConfigKey = sellerSequence;
    	var configItemKey = recntlyvewd;
    if ($("#config_"+itemKey+"_"+selectedConfigKey).length > 0) {
            var tmp = $('#config_'+itemKey+'_'+selectedConfigKey).val();
            $('<input>').attr({
                type: 'hidden',
                id: 'configItems',
                name: 'configItems',
                value: tmp
            }).appendTo('#addCartForm');
    }
	
	if(configItemKey >0 ){
        $('<input>').attr({
            type: 'hidden',   
            id: 'configKey',
            name: 'configKey',
            value: configItemKey
        }).appendTo('#addCartForm');  
    	}
    }

	if ($("#configForm").length > 0) {

		var configStr = "";
		var configKey= "";
		$(".confighidden").each(function(){
			if ($(this).val() != ''){
				configStr += $(this).val() + ";"
			}
			else{
				configStr = "";
				//showBBoxMessage('Add To Cart',"Please Select a "+$(this).attr("hdr"));
				showBBoxMessage(add_cart_title, config_please_select_msg + ' ' + $(this).attr("hdr"));
				return false;
			}
		});
		
		$(".confighiddenKey").each(function(){
			if ($(this).val() != ''){
				configKey += $(this).val();
			}
		});

		if(configStr == ""){
			return false;
		}

		$('<input>').attr({
		    type: 'hidden',
		    id: 'configId',
		    name: 'configItems'
		}).appendTo('#addCartForm');
		$('#configId').val(configStr);
		
		$('<input>').attr({
		    type: 'hidden',
		    id: 'configKeyId',
		    name: 'configKey'
		}).appendTo('#addCartForm');
		$('#configKeyId').val(configKey);
	}

	// added for pz items 
	// consider here customize as personalization when we comming from 
	//save for later section
	//making as false after using this
	if(customize && savdfrltr){
		$('<input>').attr({
		    type: 'hidden',
		    id: 'pz',
		    name: 'pz'
		}).appendTo('#addCartForm');
		$('#pz').val("true");
		$('<input>').attr({
		    type: 'hidden',
		    id: 'fromSaveItemForLater',
		    name: 'fromSaveItemForLater'
		}).appendTo('#addCartForm');
		$('#fromSaveItemForLater').val("true");
		customize=false;
	}

	$('<input>').attr({
	    type: 'hidden',
	    id: 'ref',
	    name: 'ref'
	}).appendTo('#addCartForm');
	$('#ref').val("ac/pd");

	$('<input>').attr({
	    type: 'hidden',
	    id: 'item',
	    name: 'item'
	}).appendTo('#addCartForm');
	$('#item').val(itemKey);

	$('<input>').attr({
	    type: 'hidden',
	    id: 'qty',
	    name: 'qty'
	}).appendTo('#addCartForm');
	$('#qty').val(qty);
	
	$('<input>').attr({
	    type: 'hidden',
	    id: 'itemKey',
	    name: 'itemKey'
	}).appendTo('#addCartForm');
	$('#itemKey').val(itemKey);

	$('<input>').attr({
	    type: 'hidden',
	    id: 'addedQty',
	    name: 'addedQty'
	}).appendTo('#addCartForm');
	$('#addedQty').val(qty);
	
	$('<input>').attr({
	    type: 'hidden',
	    id: 'accessories',
	    name: 'accessories'
	}).appendTo('#addCartForm');
	$('#accessories').val(accessoryTab);
	
	//for vendor - vendorKey, conditionKey
	if(vendorKey) {
		$('<input>').attr({
		    type: 'hidden',
		    id: 'slr',
		    name: 'slr'
		}).appendTo('#addCartForm');
		$('#slr').val(vendorKey);
	}
	if(conditionKey) {
		$('<input>').attr({
		    type: 'hidden',
		    id: 'cond',
		    name: 'cond'
		}).appendTo('#addCartForm');
		$('#cond').val(conditionKey);
	}
	
	if (sellerSequence) {
		$('<input>').attr({
		    type: 'hidden',
		    id: 'sellerSeq',
		    name: 'sellerSequence'
		}).appendTo('#addCartForm');
		$('#sellerSeq').val(sellerSequence);
	}
	
	if($('#inputLengthCutField').length > 0) {
		$('<input>').attr({
		    type: 'hidden',
		    id: 'inputLengthCut',
		    name: 'inputLengthCut'
		}).appendTo('#addCartForm');
		$('#inputLengthCut').val(inputLengthCut);
    }else if($('.lengthCut').length > 0){
		inputLengthCut = $('.lengthCut').val();
		$('<input>').attr({
		    type: 'hidden',
		    id: 'inputLengthCut',
		    name: 'inputLengthCut'
		}).appendTo('#addCartForm');
		$('#inputLengthCut').val(inputLengthCut);
    }

	var warrantyAvailable = false;
	if ($("#warranty_selection").length > 0) {
		var warrantySelected = $("#warranty_selection").val();
		if (warrantySelected != "none") {
			if ($('#itemKey_Main').length > 0) {
				//make sure this warranty belongs to main warranty
				var mainItemKey = $('#itemKey_Main').val();
				if( warrantySelected != "" && warrantySelected != "none" && itemKey == mainItemKey) {
					$('<input>').attr({
					    type: 'hidden',
					    id: 'warrantyItem',
					    name: 'warrantyItem'
					}).appendTo('#addCartForm');
					$('#warrantyItem').val(warrantySelected);
					warrantyAvailable = true;
				}
			}
		}
	}
	
	if (!conditionKey && $("#product_condition_selection").length > 0) {
		var productConditionSelected = $("#product_condition_selection").val();
		if (productConditionSelected != "none") {
			if( productConditionSelected != "" && productConditionSelected != "none" ) {
				$('<input>').attr({
				    type: 'hidden',
				    id: 'cond',
				    name: 'cond'
				}).appendTo('#addCartForm');
				$('#cond').val(productConditionSelected);
			}
		}
	}

	$(".addon_checkbox_hidden").each(function(){
		if ($(this).val() != '') {
			$('<input>').attr({
			    type: 'hidden',
			    name: 'item',
			    value: addonItemKey
			}).appendTo('#addCartForm');

			var addOnqty = '1';
			if ($("#quantityList_"+addonItemKey)) {
				addOnqty = $("#quantityList_"+addonItemKey).val();
			}

			$('<input>').attr({
			    type: 'hidden',
			    name: 'qty',
			    value: addOnqty
			}).appendTo('#addCartForm');
		}
	});

	$("#addCartForm").html();
	var $inputs = $('#addCartForm :input');
	$inputs.each(function() {
    });

	if (customize) {
    	displayProgressBar();
		$(addCartForm).append(getAjaxDateElement());
    	$.ajax({
    		type: "GET",
    		url: $("#addCartForm").attr('action'),
    		data: $("#addCartForm").serialize(),
    		cache: false,
    		success: function(data){
    			window.location.href = '/customizeProduct?itemKey=' + itemKey + '&qty=' + qty
    		},
    		error: function(data){
    			hideProgressBar();
    			alert("System Experienced a Failure !");
    		}
    	});
    	
    	return false;

	} 
	else if (fc) {
		$('<input>').attr({
		    type: 'hidden',
		    name: 'fc',
		    value: true
		}).appendTo('#addCartForm');

		if (updateFcMarkup) {
			submitCartForFc("addCartFormFCNoMarkupSuccessFun", "addCartFormErrorFun", $("#addCartForm").serialize())
		} 
		else {
			submitCartForFc("addCartFormFCSuccessFun", "addCartFormErrorFun", $("#addCartForm").serialize(),null,recntlyvewd,savdfrltr,savedItemId)
		}	
		
	} 
	else {
		if (warrantyAvailable) {
			cartForm.attr("action","/addWarrantyToCart");
		} 
		else {
			cartForm.attr("action","/addToCart");
		}
		
		cartForm.attr("method","POST");
		cartForm.submit();
	}
}


function submitCartForFc(successFn, errorFn, data, url, recntlyvewd, savdfrltr, savedItemId ) {
	var obj = new Object();
	//addToCartAjax
	if (url) {
		obj.url = url;
	} 
	else {
		obj.url = "/addToCart?recntlyvewd="+recntlyvewd+"&savdfrltr="+savdfrltr+"&savedItemId="+savedItemId;
	}
	
	obj.data = data;
	obj.successFunction = successFn;
	obj.errorFunction = errorFn;
	createAjaxCall(obj, true);
	return false;
}


function searchNavigationUsingAjax(url){
	$("#processing").addClass("processing");
	$("#fadeout").addClass("fadeout");
	var obj = new Object();
	obj.url = url;
	obj.data = {
			  'showAdditionalItem':'true',
			  'showAjax':'true'
	};
	obj.successFunction = "searchNavigationUsingAjaxSuccessFun";
	createAjaxCallPost(obj,true);
}
function searchNavigationUsingAjaxSuccessFun(data)
{
	$('#picGroupListingAddionalItems').html(data);
	$("#processing").removeClass();
	$("#fadeout").removeClass();
	$(document.body).scrollTop($('#additionalItems').offset().top);

}

$(document).on("click", "#sec_id_win", function(event) {
	event.preventDefault();
	$("#editPaymentMethod_pop").hide();
});

$(document).on("click", "#goBack", function(event) {
	event.preventDefault();
	$("#editPaymentMethod_pop").show();
	$("#sec_id_win_pop").remove();
});


function submitForgotPasswordForm(){
	$('#forgotPasswordForm').submit();
}

function submitResetPasswordForm(){
	$('#resetPasswordForm').submit();
}

function passwordStrength(passwd)
{
	var desc = new Array();
	desc[0] = "none";
	desc[1] = "weak";
	desc[2] = "good";
	desc[3] = "strong";
	$("#passwordStrength").removeAttr("class");
	$("#passwordStrength").addClass("pw_" + desc[getStrength(passwd)]);
}

function getStrength(passwd) {
	if (passwd.length == 0){
		return "0";
	}

	if (passwd.length < 6){
		return "1";
	}
	
	if (!passwd.match(/[a-zA-Z]/) || !passwd.match(/[1-9]/)){
		return "1";
	}
	
	if ((passwd.length >= 8) && passwd.match(/([1-9!,@#$%^&*?_~].*[1-9!,@#$%^&*?_~])/)){
		return "3";
	}
	
	return "2";
}

/*
 * References searchResults.jsp in prodmaster.
 */
function addItemsToCart() {
	var cartForm = $('#addCartForm');
	var numChecked = 0;
	$(cartForm).empty();
	$('.sub_checkbox').each(function(){
		if($(this).is(':checked')){
			numChecked++;
			var itemKey = $(this).attr('id').replace('checkboxList_', '');
			var qty = $('#qty_' + itemKey).val();
			if ((qty == null) || qty == ''){
				qty = '1';
			}
			$('<input>').attr({
				type: 'hidden',
				id: 'item'+itemKey,
				name: 'item'
			}).appendTo('#addCartForm');
			$('#item'+itemKey).val(itemKey);
			
			$('<input>').attr({
				type: 'hidden',
				id: 'qty'+itemKey,
				name: 'qty'
			}).appendTo('#addCartForm');
			$('#qty'+itemKey).val(qty);
		}
	});
	
	$('<input>').attr({
			    type: 'hidden',
			    name: 'fc',
			    value: true
			}).appendTo('#addCartForm');
			
	if (numChecked < 1) {
		//showBBoxMessage('Add To Cart',"Please select at least one item.");
		showBBoxMessage(add_cart_title, sel_one_item_msg);
	}
	else {
		submitCartForFc("addCartFormFCSuccessFun", "addCartFormErrorFun", $("#addCartForm").serialize() );
	}
	return false;
}

function submitPunchoutForm(){
	var obj = new Object();
	obj.url = "/savePunchoutCart";
	obj.successFunction = "submitPunchoutFormSuccessFun";
	createAjaxCall(obj);
}

function submitPunchoutFormSuccessFun(data){
	// changed punchout form id bcz maintain same id for all punchout forms
	var punchoutFormLength = $('#orderForm').length;
	if(punchoutFormLength > 0) {
		$('#orderForm').submit();
	} else {
		$("#punchoutForm").submit();
	}
}

//add list functionality start.
function addProductToList(newList){
  var formId;
  if (newList != 'true') {
	  formId = 'addToProductListForm';
  } 
  else {
	  formId = 'addToNewProductListForm';
  }
  
  var obj = new Object();
    $(formId).append(getAjaxDateElement());
	obj.url = $('#'+formId).attr('action');
	obj.data = $('#'+formId).serialize();
	$.ajax({
		type: "POST",
		url: obj.url,
		data: obj.data,
		success: function(data){
			if (data.indexOf("validation-messages") > -1) {
				highLightFormField(data);		
			}
			else{
	          $('div.error_sec').addClass('hide');
			if (newList == 'true') {
		    	  gaEvent('Shopping List', 'Create', '', 0);
		      }
		      gaEvent('Shopping List', 'Add', '', 0);
		      $('#addlistconform').html(data);
		   }   
		}
	});
	return false;
}

function showSavedLists() {
	$( '#list_new' ).hide();
	$( '#list_exist' ).show();
	  
	}

function showNewList() {
	$( '#list_exist' ).hide();
	$( '#list_new' ).show();
			
	}


var productListKeyForAction = "";
function viewListItems(productListKey) {
	productListKeyForAction = productListKey;
	var obj = new Object();
	obj.url = '/account/viewListItemsOnPopUp';
	obj.data = 'shoppingListsUIModel.productList.productListKey='+productListKey;
	obj.successFunction = "viewListItemsSuccessFunc";
	createAjaxCall(obj);
	return false;
}

function viewListItemsSuccessFunc(data) {
	$('#shopLists_pop').html(data);
}

function removeItemFromShoppingListPopUp(itemKey) {
	var productListKey = $('#listkeyId').val();
	var obj = new Object();
	obj.url = '/account/removeItemFromShopListsPopUp';
	obj.data = 'shoppingListsUIModel.itemKey='+itemKey+'&shoppingListsUIModel.productList.productListKey='+productListKey;
	obj.successFunction = "removeItemFromShoppingListPopUpSuccessFun";
	createAjaxCall(obj);
	
}
function removeItemFromShoppingListPopUpSuccessFun(data) {
	var result = $(data).find('#shoplists_sec_body_content');
	$('#shoplists_sec_body_content').html(result);
}

// Add Entire Product list to Cart
function addEntireListToCart(){
	if(productListKeyForAction == ''){
		var productListKeyVal = $('li .sel').attr('onclick') ;
		var productListKeyVal1 =  productListKeyVal.split('(')[1].split(')')[0];
		location.href = "/account/addListFromCart?product_List_Key=" + productListKeyVal1;
	}
	else{
		location.href = "/account/addListFromCart?product_List_Key=" + productListKeyForAction;
	}
}

// Add Seleted Items button - From Shopping List page and Shopping List pop up - 
$(document).on("click", ".shoplists_popup .add_items_cart, #actinfo_list .add_items_cart", function () {
	if(this.className=="btn add_items_cart") {
		//Add Seleted Items button - From Shopping List page and Shopping List pop up - 
		//TO:DO : Adding to shopping cart the shopping list Item
		//From the Action AddListToCartAction
		//sending Param ListKey ItemKeys Qtys
		var topPos = $(window).scrollTop();
			var shoppingListForm = $('#addShoppingListForm');
			var numChecked = 0;
			$(".sub_checkbox:checked").each(function() {
				if ($(this).is(':checked')) {
					numChecked++;
					//To take the itemKey which is appended as checkboxList_itemKey
				  	var itemKey = $(this).attr("id").replace('checkboxList_', '');
				    var itemKeyField = document.createElement("input");
				  	itemKeyField.setAttribute("type", "hidden");
				  	itemKeyField.setAttribute("name", "item");
				  	itemKeyField.setAttribute("value", itemKey);
				  	$(shoppingListForm).append(itemKeyField);
				  	var qty = $('#qty_'+itemKey).val(); 	
				  	var qtyField = document.createElement("input");
				  	qtyField.setAttribute("type", "hidden");
				  	qtyField.setAttribute("name", "qty");
				  	qtyField.setAttribute("value", qty);
				  	$(shoppingListForm).append(qtyField);
				  }
			});
			if($('#listkeyId').val() > 0){
				var listKeyId = document.createElement("input");
				listKeyId.setAttribute("type", "hidden");
				listKeyId.setAttribute("name", "product_List_Key");
				listKeyId.setAttribute("value", $('#listkeyId').val());
			  	$(shoppingListForm).append(listKeyId);
			}
			
			if (numChecked == 0) {
				showWindow("#alertShopCartWarningPop",topPos);
				$("#shopLists_pop").hide();			
			  } 
			  else {
			    shoppingListForm.submit();
			  }
			} 
			else {
				var topPos = $(window).scrollTop();
				var cartForm = $('#addCartForm');
				var numChecked = 0;
				$(".sub_checkbox:checked").each(function() {
					if ($(this).is(':checked')) {
						numChecked++;
					  	var itemKey = $(this).attr("id").replace('checkboxList_', '');
					    var itemKeyField = document.createElement("input");
					  	itemKeyField.setAttribute("type", "hidden");
					  	itemKeyField.setAttribute("name", "item");
					  	itemKeyField.setAttribute("value", itemKey);
					  	$(cartForm).append(itemKeyField);
					  	var qty = $('#qty_'+itemKey).val(); 	
					  	var qtyField = document.createElement("input");
					  	qtyField.setAttribute("type", "hidden");
					  	qtyField.setAttribute("name", "qty");
					  	qtyField.setAttribute("value", qty);
					  	$(cartForm).append(qtyField); 	
					  	var currentitemKeyField = document.createElement("input");
					  	currentitemKeyField.setAttribute("type", "hidden");
					  	currentitemKeyField.setAttribute("name", "itemKey");
					  	currentitemKeyField.setAttribute("value", itemKey);
					  	$(cartForm).append(currentitemKeyField);	
					  	var currentqtyField = document.createElement("input");
					  	currentqtyField.setAttribute("type", "hidden");
					  	currentqtyField.setAttribute("name", "addedQty");
				  		currentqtyField.setAttribute("value", qty);
				  		$(cartForm).append(currentqtyField);
		  }
	});
	
	if (numChecked == 0) {
		showWindow("#alertShopCartWarningPop",topPos);
		$("#shopLists_pop").hide();			
	  } 
	  else {
	    cartForm.submit();
	  }
	}
});
//shopping lists popup on header end


///review Save function
$(document).on("click", "form #saveReview", function () {
	var formName = $(this.form);
	var obj = new Object();
	obj.url = $(formName).attr('action');
	obj.data = $(formName).serialize();
	obj.successFunction = "saveProductReviewSuccessFun";
	obj.errorFunction = "saveProductReviewFailureFun";
	createAjaxCall(obj);
	return false;
});

function emptyCheck(){
	var check = false;
	$("form :input[name=item]").each(function(){
		if($(this).val() != ''){
		check = true;
		}
	});
	
	if(check == false){
		//showBBoxMessage("Quick Order", "Please enter at least one entry for this submission");
		showBBoxMessage(quick_order_title, enter_one_item_msg);
	}
	
	else{
		gaEvent('Cart', 'Add', 'Quick Order - Footer', 0);
		$("#quick_order").submit();
	}
	return check;
}

function addToCartFromQuickOrder(id){
	var obj = new Object();
	obj.url = $("#quick_order_"+id).attr('action');
	obj.data = $("#quick_order_"+id).serialize();
	obj.successFunction = "addToCartSuccessFun";
	obj.errorFunction = "addToCartFailureFun";
	createAjaxCall(obj);
	return false;
}

function addToCartSuccessFun(data){
	if (data.indexOf("validation-messages") > -1) {
		$("#quickOrderDiv").hide();
		//showBBoxMessage("Quick Order", data);
		showBBoxMessage(quick_order_title, data);
	}
	else{
		hideBBoxClose();
		window.location.href = "/viewCart";
	}
}
	
//review Save success function
function saveProductReviewSuccessFun(data){
	if (data.indexOf('validation-messages') < 0) {
		  $("#writeReviewPop .body").html(data);
		  getWinPos();		    
	} else {
		saveProductReviewFailureFun(data);
	}
}
// review Save Error Function
function saveProductReviewFailureFun(data){
		highLightFormField(data);
}

function showBBoxMessage(title, content) {
	// if a mask does not already exist, create one
	if( $("#mask").length == 0) {
		$('body').append('<div id="mask"></div>'); 
	}
	
	// check to see if another pop up exists..
	// if so push under mask
	if ($(".popUpExist").css('display') == "block" || $(".popUpWin ").length) {
		$(".popUpExist, .popUpWin").css('z-index', 13000);
		$(".popUpExist a.closeBtn, .popUpWin a.closeBtn").attr('id', 'do-not-close')
	}
		
	var topPos = $(window).scrollTop();
	
	$('<div>').attr({id: 'bb_pop'}).appendTo('body');
	$("#bb_pop").addClass("popUpWin");
	
	var $title = '<div class="closeBtn">'+title+'<a class="closeBtn"></a></div>';
	var msg = '<div class="body"><div class="contents msg"><p>';
	msg = msg + content + '</p></div></div></div>';
	msg = $title + msg;
	$("#bb_pop").html(msg);
	$('#mask').fadeIn("fast");
	//Window placement
	windowPlacement("#bb_pop",topPos);
}

function forgetPassword(){
	var usrName = $('input[name="loginUsername"]').val();
	if(usrName.length > 0){
		$("#forgetPwd").attr('href', "/account/forgetPassword?u=" + usrName );
	}
	else{
		$("#forgetPwd").attr('href', "/account/forgetPassword");
	}
}


$(document).on("click", "#emailPop1", function (event) {	
	$("#emailPop").trigger('click');
	if($('#picGroupCompare_pop').length > 0) {
		$('#picGroupCompare_pop').remove();
	}
	
	if($('#productCompare_pop').length > 0) {
		$('#productCompare_pop').remove();
	}
});

//*********** Parts Filter ************
function onLoadKey(theKey) {
	
	var origStr = document.getElementById(theKey);
	var text;
	if (origStr) {
		for(var i=0; i<origStr.length; i++)
		{
			text = origStr.options[i].value;
			var len = text.length;
		
			if (text == theKey ) {
				origStr.options[i].checked = true;	
			} 
		}
	}
}

function changePartsFilterField(fid){
	var id = "field_" + fid;
	var selectBox = document.getElementById(id);
	var fieldName = $('#'+id).attr('name');
	$('#fieldId').val(fid);
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  
	var formName = $('#partsSearchForm');
	$('#partsSearchForm select').each(function() {
		var tmpId = $(this).attr('id').replace('field_','');
		if (!isNaN(parseInt(tmpId)) && tmpId > fid) {
			clearPartsFilterField(tmpId);
		}
	});
	processPartsFilterUpdate(fid, selectedValue);
}

function clearPartsFilterField(id) {
	var newId = 'field_'+id;
	var newOptEle = document.getElementById(newId).options;
	if (newOptEle.length > 1) {
		$('#'+newId).children('option:not(:first)').remove();
	}
}

function processPartsFilterUpdate(ind, selectedValue){
	var id = 'field_'+ind;
	var newId = ind + 1;	
	var nextEle = document.getElementById('field_' + newId);
	if (nextEle) {
	   var title = $('#field_'+newId).parent().attr('id');
	   var dispHead = $('#field_'+newId+' option:first').text();
  
	   $.ajax({
			type: "post",
			url : '/partsFilterUpdate?ajaxDate='+getAjaxDate(),
			data: $("#partsSearchForm").serialize(),
			success: function(data){	   
				if(data.indexOf('pcs-error-messages') < 0){		
					eval("var jsonResult = " + data);
					if (jsonResult.keyDescList) {
						var jsonLength = jsonResult.keyDescList.length;
						
						if ( jsonLength > 0) 
						{
							dispStr = "<select id=\"field_"+newId+"\" name=\"partsFilterField_"+newId+"\" onchange=\"changePartsFilterField(" + newId + ");\"><option>"+dispHead+"</option>";
							for (var ii=0; ii<jsonLength; ii++)
							{
								var keydesc = jsonResult.keyDescList[ii];
								
								dispStr +=  " <option value=\""+keydesc.key+"\">" + keydesc.desc +"</option>";							
							}
							dispStr += "</select>";
							if (document.getElementById(title)) {
								document.getElementById(title).innerHTML = dispStr;
							}
						}
					}
		  		}
			},
			error: function(data){
					updateNextFieldError(data);
			}
		});
	} 
	else {
		$.ajax({
			type: "post",
			url: '/partsFilterUpdate?ajaxDate='+getAjaxDate(),
			data: $("#partsSearchForm").serialize(),
			success: function(data){
			},
			error: function(data){
				updateNextFieldError(data);
			}
		});
	}		
}

function updateNextFieldError(data) {
	   //alert("err");
}

$(document).on("click", "#partsFilterButton", function (event) {
	event.preventDefault();
	var numOfSels = 0;
	var i = 0;
	$('#partsSearchForm select').each(function() {
		var id = "field_" + i;
		if ($('#field_' + i +' option:selected') && $('#' + id).val() > 0) {
			numOfSels++;
		}
		i++;
	});

	if (numOfSels >= $('#numMust').val()) {
		document.getElementById("partsSearchForm").action="/partsFilter";
		document.getElementById("partsActionType").value = "getCategory";
		$('#partsSearchForm').serialize();
		document.getElementById("partsSearchForm").submit();
		return true;
	} 
	return false;
});

function getSubcategory(catkey) {
	var numOfSels = 0;
	var i = 0;
	$('#partsSearchForm select').each(function() {
		var id = "field_" + i;
		if ($('#field_' + i +' option:selected') ) {
			numOfSels++;
		}
		i++;
	});
	if (numOfSels >= $('#numMust').val()) {	
		document.getElementById("partsSearchForm").action="/partsFilterListing";
		document.getElementById("partsActionType").value = "getSubcategory";
		document.getElementById("catParentKey").value = catkey;
		document.getElementById("categoryKey").value = 0;
		$('#partsSearchForm').serialize();
		document.getElementById("partsSearchForm").submit();
	}
}

function getProducts(key1, key2) {
	document.getElementById("partsSearchForm").action="/partsFilterListing";
	document.getElementById("catParentKey").value = key1;
	document.getElementById("categoryKey").value = key2;
	document.getElementById("partsActionType").value = "getProduct";
	$('#partsSearchForm').serialize();
	document.getElementById("partsSearchForm").submit();	
}

function getFilter(keys){
	var size = 0;
	var tmp = new Array();
	if (keys.indexOf('_') >= 0) {
		tmp = keys.split('_');
		size = tmp.length;
	} 
	if (size > 0) {
		document.getElementById("partsSearchForm").action="/partsFilter";
		var i = 0;
		document.getElementById("fieldId").value = size-1;		
		document.getElementById("partsActionType").value = "getFilter";
		
		var type = document.getElementById("filterTypeKey").value;
		var primKey = document.getElementById("catPrimKey").value;
		var linkstr = "/partsFilter?w="+primKey+"&t=getFilter&ft="+type;
		if (size > 4) {
			if (parseInt(tmp[4]) > 0) {
				window.location.href = linkstr + "&yearKey="+tmp[0]+"&makeKey="+tmp[1]+"&modelKey="+tmp[2]+"&submodelKey="+tmp[3]+"&engineKey="+tmp[4];
			} else {
				window.location.href = linkstr + "&yearKey="+tmp[0]+"&makeKey="+tmp[1]+"&modelKey="+tmp[2]+"&submodelKey="+tmp[3];
			}
		} else if (size == 4){
			window.location.href = linkstr + "&yearKey="+tmp[0]+"&makeKey="+tmp[1]+"&modelKey="+tmp[2]+"&submodelKey="+tmp[3];
		} else if (size == 3 && type == 2) {
			window.location.href = linkstr + "&makeKey="+tmp[0]+"&modelKey="+tmp[1]+"&submodelKey="+tmp[2];
		}
	}
}


function catalogLogin(){
	if($('#promptLoginForm').length == 0) {
		$('body')
        .append('<form id="promptLoginForm" name="promptLoginForm" action="/account/promptLogin" method="post"></form>');
	}
	
	var promptLoginForm = $('#promptLoginForm');
	
	$('<input>').attr({
	    type: 'hidden',
	    id: 'redirectUrl',
	    name: 'redirectUrl'
	}).appendTo('#promptLoginForm');
	$('#redirectUrl').val("/account/catalogRequest");
	promptLoginForm.submit();
}

//product finder functions
function populateProductFinder(elem, facetInfo) {
	  if (elem == null) {
	    // initialization
	    var firstFacet = document.getElementById(facetInfo[1][0]);
	    var path = firstFacet.value;
	    var facetSystemNames = facetInfo[0];
	    var facetFormIds = facetInfo[1];
	    var facetDefaultValues = facetInfo[2];
	  } 
	  
	  else {
	    var facetIndex = facetInfo[1].indexOf(elem.id) + 1;
	    var path = elem.value;
	    if (path == '')
	    {
	      var remainingFacetIds = facetInfo[1].slice(facetIndex);
	      for (var index = 0; index < remainingFacetIds.length; index++)
	      {
	        var facet = document.getElementById(remainingFacetIds[index]);
	        facet.selectedIndex = 0;
	        facet.disabled = true;
	      }
	      return;
	    } 
		else {
	      var facetSystemNames = facetInfo[0];
	      var facetFormIds = facetInfo[1];
	      var facetDefaultValues = facetInfo[2];
	    }
	  }
	  var escapePath=escape(path);
	  var escapeFacetSystemNames=escape(facetSystemNames);
	  var escapeFacetFormIds=escape(facetFormIds);
	  var escapeFacetDefaultValues=escape(facetDefaultValues);
	  var productFinderUrl ="/productFinder?p=" +escapePath+ "&searchUIModel.facetSystemNames=" +escapeFacetSystemNames+ "&searchUIModel.facetFormIds=" +escapeFacetFormIds+ "&searchUIModel.facetDefaultValues=" +escapeFacetDefaultValues+ "&ajaxDate=" +getAjaxDate();
	
	var obj = new Object();
	obj.url= productFinderUrl;
	obj.successFunction= "populateProductFinderSuccessFunc";
	createAjaxCallPost(obj,false);
}

function populateProductFinderSuccessFunc(data){
	if(data.indexOf('validation-messages') < 0){
		eval("var jsonResult = " + data);
		var dropdownList = jsonResult.dropdownList;
		var lastResult='';
		for(var i=0; i<dropdownList.length; i++){
			// get dropdown element
			var dropdownElement = document.getElementById(dropdownList[i].id);
			// remove existing options
			for(var count = dropdownElement.options.length - 1; count >= 0; count--){
				dropdownElement.options[count] = null;
			}
			var options = dropdownList[i].option;
			for(var j=0; j<options.length; j++){
				// create the option
				var newOption = new Option(options[j].displayText,options[j].value);
				newOption.title = options[j].displayText;
				newOption.alt = options[j].displayText;
				dropdownElement.options[j] = newOption;
				if(options[j].selected == "true") {
					dropdownElement.selectedIndex = j;					
				}
			}
		}
	}
}

function populateVariationProductFinderRadioBtns(elem, facetInfo, init, showResults) {
    var ie7 = isInternetExplorer7();
    var facetIndex = facetInfo[1].indexOf(elem.id);		   	            
    var path = elem.value;
    $('#loadingWireShelving').show();
    
    if (init == true){
    	path = elem;
    }

    if (path=="categorySelected"){
    	path = $('#searchPath').val();
    } 
    
    var facetSystemNames='';
    var facetFormIds='';
    var facetDefaultValues='';
    var sepIndex = 0;
             
    for (var i = 0; i < facetInfo[1].length; i++){
    	if (i!=facetIndex){
    		var tmpFacetId = facetInfo[1][i];    		
    		var radioGrp = document['forms']['finder'][tmpFacetId];
    		
    		var valueNotSet=true;
    		for(j=0; j < radioGrp.length; j++){
    		    if (radioGrp[j].checked == true) {
    		    	valueNotSet = false; 
    		    }
    		}  
     		
    		if (init || valueNotSet){    	   			
    			facetSystemNames  += appendSeperator(sepIndex) + facetInfo[0][i];
    			facetFormIds	  += appendSeperator(sepIndex) + facetInfo[1][i];
    			facetDefaultValues+= appendSeperator(sepIndex) + facetInfo[2][i];
    			sepIndex++;
    		} 
    	}
    }
 
    $('#searchPath').val(path);
    
   
    var categoriesSelected;
    if (init){
    	categoriesSelected = getAllProductFinderCategories("false");
    } 
	else {
    	categoriesSelected = getCategoriesSelected();
    }
	
	var obj = new Object();
	obj.url= '/productFinder';
	obj.data = {
	  'searchUIModel.searchModel.path':path,
	  'searchUIModel.facetSystemNames':facetSystemNames+',<category_facet>',
	  'searchUIModel.facetFormIds':facetFormIds+',category',
	  'searchUIModel.facetDefaultValues':facetDefaultValues+',--',
	  'searchUIModel.categoriesSelected':categoriesSelected
	};

	$.ajax({
		type: "post",
		url: obj.url,
		data: obj.data,
		cache: false,
		success: function(html){
			hideProgressBar();
			if(html.indexOf('validation-messages') < 0){
				eval("var jsonResult = " + html);
				if (init==true){
					initPopulateDefaultFinderValues(jsonResult);
				}
				
				var dropdownList = jsonResult.dropdownList;
				for(var i=0; i<dropdownList.length; i++){
					if (dropdownList[i].id == "category"){
						var categories = dropdownList[i].option;

						for (var i=0; i<categoryNames.length; i++){
							var tmpCategory = document.getElementById('category_' + categoryNames[i]);
							if (tmpCategory!=null){
								tmpCategory.innerHTML = "0";
							}
						}
						
						for (var j=0; j<categories.length; j++){
							var elementString = 'category_' + categories[j].displayText;
							var categoryElement = document.getElementById(elementString.toLowerCase());

							if (categoryElement!=null){
								categoryElement.innerHTML = categories[j].count;
							}
						}
					} 
					else if (dropdownList[i].id !=''){
						var dropdownElement = document.getElementById(dropdownList[i].id);
						var options = dropdownList[i].option;				          				        
						var allOptions = facetSizes[dropdownList[i].id];

						for(var k=0; k<allOptions.length; k++){
							var optionValue = allOptions[k];		        	  		    
							var j = indexOfProductFinder(options, optionValue);
							if (j!=-1){
								var radioElement =  document.getElementById(dropdownList[i].id+"_"+optionValue);  
								var radioLabel =  document.getElementById("label_"+dropdownList[i].id+"_"+optionValue);
								if (radioElement!=null && radioElement!=''){
									radioElement.value= options[j].value;
									radioLabel.className = "";
									radioElement.disabled=false;
									radioElement.checked=false;
								}
							}
							else {
								var radioElement =  document.getElementById(dropdownList[i].id+"_"+optionValue);  
								var radioLabel =  document.getElementById("label_"+dropdownList[i].id+"_"+optionValue);

								if (radioElement!=null && radioElement!=''){
									radioLabel.className = "disableRadioBtn";
									radioElement.disabled=true;
								} else {
								}
							}
						}
					}
				}
				if (showResults==true){
					getProductFinderResultsForRadioBtns();
				}		

				clearFacetsWhenNoCatsSelected();
				$('#loadingWireShelving').hide();
			}
		},
		error: function(xhr, ajaxOptions, thrownError){
			hideProgressBar();
			if(xhr.readyState == 0 || xhr.status == 0) {
				return;  // it's not really an error This happens due to Response already commited 
			}
			if (!(typeof obj.errorFunction === "undefined")){
				window[obj.errorFunction](xhr.responseText);
			} else {
				alert("System Experienced a Failure !" + obj.url + "Need to remove the URL");
			}
		}
	});
}
 
function populateVariationProductFinder(elem, facetInfo, init, showResults) {
    var ie7 = isInternetExplorer7();
    var facetIndex = facetInfo[1].indexOf(elem.id);		   	    
    var path = elem.value;
    if (init == true){
    	path = elem;
    }
    
    if (path=="categorySelected"){
    	path = $('#searchPath').val();
    } 
    
    var facetSystemNames='';
    var facetFormIds='';
    var facetDefaultValues='';
    var sepIndex = 0;
            
    for (var i = 0; i < facetInfo[1].length; i++){       		        		        	
    	if (i!=facetIndex){
    		var tmpFacetId = facetInfo[1][i];
    		var tmpFacetVal = $('#'+tmpFacetId).val(); 
    		if (init || (tmpFacetVal==null || tmpFacetVal=='' || tmpFacetVal=='--' || tmpFacetVal=='Any')){
    			facetSystemNames  += appendSeperator(sepIndex) + facetInfo[0][i];
    			facetFormIds	  += appendSeperator(sepIndex) + facetInfo[1][i];
    			facetDefaultValues+= appendSeperator(sepIndex) + facetInfo[2][i];
    			sepIndex++;
    		} 
    	}      	
    }

    $('#searchPath').val(path);
    
    var categoriesSelected;
    if (init){
    	categoriesSelected = getAllProductFinderCategories("true");
    } else {
    	categoriesSelected = getCategoriesSelected();
    }
    
	var obj = new Object();
	obj.url= '/productFinder';
	obj.data = {
		'searchUIModel.searchModel.path':path,
		'searchUIModel.facetSystemNames':facetSystemNames+',<category_facet>',
		'searchUIModel.facetFormIds':facetFormIds+',category',
		'searchUIModel.facetDefaultValues':facetDefaultValues+',--',
		'searchUIModel.categoriesSelected':categoriesSelected
	};

	$.ajax({
		type: "post",
		url: obj.url,
		data: obj.data,
		cache: false,
		success: function(html){
			hideProgressBar();
			if(html.indexOf('validation-messages') < 0){
				eval("var jsonResult = " + html);
			  if (init==true){
				  initPopulateDefaultFinderValues(jsonResult);
			  }			        	        		        			      			   
			  
			  if (facetIndex!=-1){			    	  
				  var selected = elem.options[elem.selectedIndex].text;
				  for(var k=0; k<elem.options.length; k++){
					  var options = elem.options[k];
					  if (options.text!=selected){
						if (ie7)
						{
						  options.style.color = '#A4A4A4';
						} else {
						  options.disabled = true;
						}
					  } 
				  }
				 
			  }
			  
			var dropdownList = jsonResult.dropdownList;
			for(var i=0; i<dropdownList.length; i++){

			  if (dropdownList[i].id == "category"){
				  var categories = dropdownList[i].option;
				  
				  for (var i=0; i<categoryNames.length; i++){
					var tmpCategory = document.getElementById('category_' + categoryNames[i]);
					if (tmpCategory!=null){
						tmpCategory.innerHTML = "0";
					}
				  }		        	  
				  
				  for(var j=0; j<categories.length; j++){
					  var elementString = 'category_' + categories[j].displayText;
					  var categoryElement = document.getElementById(elementString.toLowerCase());
					  
					  if (categoryElement!=null){
						 categoryElement.innerHTML = categories[j].count;
					  }
				  }
				  
			  } else if (dropdownList[i].id !=''){
					  var dropdownElement = document.getElementById(dropdownList[i].id);

					  var options = dropdownList[i].option;				          				        

					  var allOptions = facetSizes[dropdownList[i].id];
					  for(var k=0; k<allOptions.length; k++){
						  var optionValue = allOptions[k];
						  
						  var j = indexOfProductFinder(options, optionValue);
						  if (j!=-1){
								var newOption = new Option(options[j].displayText,options[j].value);
								newOption.name = options[j].count;
								newOption.title = options[j].displayText;
								newOption.alt = options[j].displayText;				            			            
								dropdownElement.options[k] = newOption;			  							
						  }	else {
								var newOption = new Option(optionValue, "disabled");
								newOption.title = optionValue;
								newOption.alt = optionValue;				            
								if (ie7)
								{
									newOption.style.color = '#A4A4A4';
								} else {
									newOption.disabled = true;
								}
								dropdownElement.options[k] = newOption;				  						  
						  }		        	  
					  }

					  dropdownElement.selectedIndex = 0;
			  }		          	          
			}

			  if (showResults==true){
				  getProductFinderResults();
			  }			        

			}
		},
		error: function(xhr, ajaxOptions, thrownError){
			hideProgressBar();
			if(xhr.readyState == 0 || xhr.status == 0) {
				return;  // it's not really an error This happens due to Response already commited 
			}
			if (!(typeof obj.errorFunction === "undefined")){
				window[obj.errorFunction](xhr.responseText);
			} else {
				alert("System Experienced a Failure !" + obj.url + "Need to remove the URL");
			}
		}
	});
}
	

function executeProductFinderSearch(elem, pageTitle, ref) {
	executeProductFinderSearchWithPath(elem.value, pageTitle, ref);
}

function executeProductFinderSearchWithPath(path, pageTitle, ref) {
  if (path == '') {
  	//showBBoxMessage(pageTitle, 'Please make all selections first');
	showBBoxMessage(pageTitle, make_sel_first_msg);
  	return;
  }

  var form = document.createElement("form");
  document.body.appendChild(form);
  form.method = "post";
  form.action = '/productFinder';

  if ((ref != null) && (ref != '')) {
	  var refField = document.createElement("input");
	  refField.setAttribute("type", "hidden");
	  refField.setAttribute("name", "ref");
	  refField.setAttribute("value", ref);
	  form.appendChild(refField);
  }

  var pathField = document.createElement("input");
  pathField.setAttribute("type", "hidden");
  pathField.setAttribute("name", "searchUIModel.searchModel.path");
  pathField.setAttribute("value", path);
  form.appendChild(pathField);

  var pageTitleField = document.createElement("input");
  pageTitleField.setAttribute("type", "hidden");
  pageTitleField.setAttribute("name", "searchUIModel.pageTitle");
  pageTitleField.setAttribute("value", pageTitle);
  form.appendChild(pageTitleField);

  var finderUrlField = document.createElement("input");
  finderUrlField.setAttribute("type", "hidden");
  finderUrlField.setAttribute("name", "searchUIModel.finderUrl");
  finderUrlField.setAttribute("value", location.href);
  form.appendChild(finderUrlField);

  var finderViewField = document.createElement("input");
  finderViewField.setAttribute("type", "hidden");
  finderViewField.setAttribute("name", "searchUIModel.productFinderView");
  finderViewField.setAttribute("value", "default");
  form.appendChild(finderViewField);

  form.submit();
}


function createModalWindow(getFile,content,nomask) {
	if ( $("#mask").length == 0) {
		$('body').append('<div id="mask"></div>'); 
	}
	
	$('<div>').attr({id: getFile + '_pop'}).appendTo('body');
	
	if(nomask){
		$('#mask').hide(); 
	} else{
		$('#mask').fadeIn('fast'); 
	}
	$("#"+getFile+"_pop").html(content);
	
	// window placement
	var popWidth = $("#" + getFile + "_pop").width();
	var popHt = $("#" + getFile + "_pop").height();
	var popLeftPos = (screenWidth - popWidth ) / 2;
	var popTopPos = ((winHeight - popHt) / 2) + clickPos;
	$("#" + getFile + "_pop").css({"top":popTopPos,"left":popLeftPos});
	
	if (getFile != "progressbar") {
		$("#" + getFile + "_pop").draggable({ handle: "div.closeBtn" });
	}
}

function hideWindow(){
	$('#mask,.popUpWin,.popUpExist').fadeOut(10, function() {
		  $('#mask').remove();
		  $('.popUpWin').remove();
	  });
}

function displayProgressBar(nomask){
	clickPos = $(window).scrollTop();
	var content = '<div><span></span></div>'
	createModalWindow("progressbar",content,nomask);
}

// for product detail tabs and picgrid infinite scroll - ajax indicator
function disableDiv(elm) {
	$("#ajaxIndicator,.disableMask").show();
	$("#ajaxIndicator").height(indicatorHt);
}

function hideProgressBar(){
	if($("#progressbar_pop").length > 0) {
		$("#progressbar_pop").remove();
		$('#mask').remove();
	}
	
	// product detail tabs, customize page more links and picgrid infinite scroll - remove ajax indicator
	if($("#ajaxIndicator").length > 0 || $(".ajaxIndicator").length > 0) {
		$("#ajaxIndicator,.ajaxIndicator,.disableMask").hide();
	}
}

// FUNCTION TO  CENTER SUCESS/CONFIRM POP UP WINDOW
function getWinPos() { 
	var topPos = $(window).scrollTop();
	
	//stop write review confirmation from being too far down the screen
	if ($('#writereview_pop').length || $('#writereviewmain_pop').length) {
		topPos = 0;
	}
	
	var popWidth = $(".popUpWin").width();
	var popHt = $(".popUpWin").height();
	var popLeftPos = (screenWidth - popWidth) / 2
	var popTopPos = ((winHeight - popHt) / 2) + topPos;
	$(".popUpWin").css({"top":popTopPos,"left":popLeftPos})
}

function submitSearchForm(elName){
	if (elName == 'q') {
		$('#searchForm').submit();
	} 
	else if(elName == 'pnf') {
		$('#searchResult').submit();
	}

}

/**** CHARS REMAINING *****/
function charsCountDown(maxChars,idName) {
	$("textarea." + idName).keyup(function() {
			countChars(maxChars,idName);
		});
		
	$("textarea." + idName).keydown(function() {
			countChars(maxChars,idName);
		});
}

function countChars(maxChars,idName) {
	var maxChars = maxChars;
	var str = $("textarea." + idName).val();
	var len = str.length;
	
	if (len <= maxChars) {
		$("#" + idName).val(maxChars-len);
	} 
	else {
		$("textarea." + idName).val(str.substr(0, maxChars));
	}
}
/**** CHARS REMAINING *****/

function orderQuoteCheckout(){
	window.location.href = $('#orderQuoteCheckout').attr('href');
}

function redirectUrlForCredit(){
	window.location.href = "/creditApplication";
}

function submitApproveOrDeny(id) {
	$('#' + id).submit();
}

function getAjaxDate(){
	return (new Date()).getTime();
}


function getAjaxDateElement(){
    var ajaxDateField = document.createElement("input");
    ajaxDateField.setAttribute("type", "hidden");
	ajaxDateField.setAttribute("name", "ajaxDate");
	ajaxDateField.setAttribute("value", getAjaxDate());
	return ajaxDateField;
}

//allow only numeric vaues 
//added cartQty class for IG-317.
//added e.keyCode != 9 for IG-998
$(document).on("keydown",".qty , .itemQty_disp , .pic_group_qty , .qty_update , .lengthCut, .quantity, .cartQty", function(e) { 
    if((e.shiftKey  || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105) && (e.keyCode != 8) && (e.keyCode != 46) && e.keyCode != 9) {
          e.preventDefault();
     }
});

function isInternetExplorer7() {
	var appVer = navigator.appVersion;
	var version = parseFloat(appVer.split("MSIE")[1]);
	appVer = appVer.split(';');
	if ((String(appVer[1]).indexOf('MSIE') > -1) && (version <= 7)) {
		return true;
	}
	return false;
}

function appendSeperator(index){
	if (index!=0){
		return ",";
	}
	return "";
}

function getAllProductFinderCategories(isChecked){
	var categoryCheckboxes = $('.category');
	var categories = '';

	var j=0;
	for(i=0;i<categoryCheckboxes.length;i++) {
		if (j++>0){
			categories = categories + ",";
		} 
		categories = categories + (categoryCheckboxes[i]).id;
		
		if (isChecked=='false'){
			categoryCheckboxes[i].checked=false;
		} else {
			categoryCheckboxes[i].checked=true;
		}
			
	}	
	return categories;			
}	
	
function getCategoriesSelected(){
	var categoryCheckboxes = $('.category');
	var categories = '';
	var j=0;
	for(i=0;i<categoryCheckboxes.length;i++) {
		if (categoryCheckboxes[i].checked) {
			if (j++>0){
				categories = categories + ",";
			}
			categories = categories + (categoryCheckboxes[i]).id;
		}					
	}

	return categories;			
}

function initPopulateDefaultFinderValues(jsonResult){
    var dropdownList = jsonResult.dropdownList;
    for(var i=0; i<dropdownList.length; i++)
    {
    	  var tmpString = '';
    	  var facet = dropdownList[i].id;	        	  
    	  var options = dropdownList[i].option;
    	  var tmpArray = new Array();
          for(var j=0; j<options.length; j++){
        	  tmpArray[j] = options[j].displayText;
          }		          
    	  facetSizes[facet] = tmpArray;	
    }   	        
}

function indexOfProductFinder(options, elementName){
	
    for(var j=0; j<options.length; j++)
    {
      if (options[j].displayText == elementName){
      	return j;
      }
    }			
    
    return -1;
}

function getProductFinderResults(){			
	  var display = "";	
	  var optCount = 0;
	  for (var j=0; j<facetFormIds.length; j++){
		  var facet = document.getElementById(facetFormIds[j]);				  
		  if (facet!=null && facet!='' && facet!='--' && facet!='Any'){
			  var facetDescValue = facetDesc[j];
			  var facetMeasurementValue = facetMeasurement[j];
			  var text = facet.options[facet.selectedIndex].text
			  if (text!=null  && text!='' && text!='--' && text!='Any'){
					if(!isNaN(facet.options[facet.selectedIndex].name)){
						if(optCount>0){
							optCount = Math.min(parseInt(facet.options[facet.selectedIndex].name),optCount);
						}
						else{
							optCount = parseInt(facet.options[facet.selectedIndex].name);
						}
					}
				  if (display!=""){
					  display = display + ', ' + text +  facetMeasurementValue + ' ' + facetDescValue;
				  } else {
					  display = display + ' ' + text +  facetMeasurementValue + ' ' + facetDescValue;
				  }
			  }
		  }
	  }
	  
	  if (display!=""){
		  var counter=0;
        for (var i=0; i<categoryNames.length; i++){
	        	var tmpCategory = document.getElementById('category_' + categoryNames[i]);
	        	if (tmpCategory!=null && tmpCategory!=''){
	        		counter=counter + Number(tmpCategory.innerHTML);
	        	}
	      }
		if(counter==0){
			counter = optCount;
		}
        display = counter + ' results for' + display; 
	  }
	  
	  if (display!=""){
		  $('#resultsDisplayContent').html(display);
		  $('#resultsDisplay').fadeIn(100);
	  } else {
			$('#resultsDisplay').fadeOut(100);
	  }
	  
	  uncheckCategoryAttributes();          	          
}

function uncheckCategoryAttributes() {
    for (var i=0; i<categoryNames.length; i++){
    	var tmpCategory = document.getElementById('category_' + categoryNames[i]);
    	if (tmpCategory!=null && tmpCategory!=''){
    		var counter = tmpCategory.innerHTML;
    		if (counter==0){
    			var tmpCategoryID = document.getElementById('category_' + categoryNames[i] + '_checkbox');
    			var tmpCategoryCheckbox = document.getElementById(tmpCategoryID.value);
    			tmpCategoryCheckbox.checked = false;
    		}
    	}
  }			
}

function executeVariationProductFinderSearchWithPath(path, pageTitle, ref, view) {
	  if (path == '') {
	  	//showBBoxMessage(pageTitle, 'Please make all selections first');
		showBBoxMessage(pageTitle, make_sel_first_msg);
	  	return;
	  }

	  var form = document.createElement("form");
	  document.body.appendChild(form);
	  form.method = "post";
	  form.action = '/productFinder';

	  if ((ref != null) && (ref != '')) {
		  var refField = document.createElement("input");
		  refField.setAttribute("type", "hidden");
		  refField.setAttribute("name", "ref");
		  refField.setAttribute("value", ref);
		  form.appendChild(refField);
	  }

	  var pathField = document.createElement("input");
	  pathField.setAttribute("type", "hidden");
	  pathField.setAttribute("name", "searchUIModel.searchModel.path");
	  pathField.setAttribute("value", path);
	  form.appendChild(pathField);

	  var pageTitleField = document.createElement("input");
	  pageTitleField.setAttribute("type", "hidden");
	  pageTitleField.setAttribute("name", "searchUIModel.pageTitle");
	  pageTitleField.setAttribute("value", pageTitle);
	  form.appendChild(pageTitleField);

	  var finderUrlField = document.createElement("input");
	  finderUrlField.setAttribute("type", "hidden");
	  finderUrlField.setAttribute("name", "searchUIModel.finderUrl");
	  finderUrlField.setAttribute("value", location.href);
	  form.appendChild(finderUrlField);
	  		  		  
	  var finderUrlField = document.createElement("input");
	  finderUrlField.setAttribute("type", "hidden");
	  finderUrlField.setAttribute("name", "searchUIModel.productFinderView");
	  finderUrlField.setAttribute("value", view);
	  form.appendChild(finderUrlField);
	  
	  var finderUrlField = document.createElement("input");
	  finderUrlField.setAttribute("type", "hidden");
	  finderUrlField.setAttribute("name", "searchUIModel.categoriesSelected");
	  finderUrlField.setAttribute("value", getCategoriesSelected());
	  form.appendChild(finderUrlField);			  

	  if ($('sortByHighToLow') != null && $('sortByHighToLow').checked){
		  var finderUrlField = document.createElement("input");
		  finderUrlField.setAttribute("type", "hidden");
		  finderUrlField.setAttribute("name", "searchUIModel.searchModel.sort");
		  finderUrlField.setAttribute("value", "1-2");
		  form.appendChild(finderUrlField);			  			  
	  } else {
		  var finderUrlField = document.createElement("input");
		  finderUrlField.setAttribute("type", "hidden");
		  finderUrlField.setAttribute("name", "searchUIModel.searchModel.sort");
		  finderUrlField.setAttribute("value", "1-1");
		  form.appendChild(finderUrlField);				  			  
	  }
	  form.submit();
}

function getProductFinderResultsForRadioBtns(){			
	  var display = "";	
	  for (var facetIndex=0; facetIndex<facetFormIds.length; facetIndex++){
			var facetId = facetFormIds[facetIndex];	
			var radioGrp = document['forms']['finder'][facetId];
	  
			for(j=0; j < radioGrp.length; j++){
						
			    if (radioGrp[j].checked == true) {   	
			    	var radioLabel = document.getElementById("label_"+radioGrp[j].id);
				    var facetDescValue = facetDesc[facetIndex];
				    var facetMeasurementValue = facetMeasurement[facetIndex];
				    var text = radioLabel.innerHTML;
				    if (display!=""){
					    display = display + ', ' + text +  facetMeasurementValue + ' ' + facetDescValue;
				    } else {
					    display = display + ' ' + text +  facetMeasurementValue + ' ' + facetDescValue;
				    }		    				    	
			    } 			    
			 }				  
	  }
	  
	  if (display!=""){
		  var counter=0;
	      for (var i=0; i<categoryNames.length; i++){
		      	var tmpCategory = document.getElementById('category_' + categoryNames[i]);
		       	if (tmpCategory!=null && tmpCategory!=''){
		       		counter=counter + Number(tmpCategory.innerHTML);
		       	}
		  }	
	      display = counter + ' results for' + display;	      
	   }	  
	  
	  if (display!=""){
		  $('#resultsDisplayContent').html(display);
		  $('#resultsDisplay').fadeIn(10);
	  } else {
		  $('#resultsDisplayContent').html("Please make a selection.");
		  $('#resultsDisplay').fadeIn(10);
	  }	   
	  
	  uncheckCategoryAttributes();       
 }
 
 
 /******** Open/close chat  ******/
$(document).on("click", "div#chatclose", function () {
	if (typeof(Storage) != "undefined"){
		if (localStorage.chatStatus == 1) {
			$("#chaticon").animate({bottom: 0},100);
			$(this).animate({bottom: "74px"},100);
			localStorage.chatStatus=0; // open chat
			
		}
		else {
			$("#chaticon").animate({bottom: "-73px"},100);
			$(this).animate({bottom: "0"},100);
			localStorage.chatStatus=1; // close chat
		}
	}
	
	else {
  			//alert("Sorry, your browser does not support Web Storage");
  		}
});

//For "searchInput" input box
function validateSearchKeywords() {
	if (document.getElementById('searchInput').value == '') {
		return false;
	} else {
		return true;
	}
}

function defaultHideAndShow() {
		$("#AC_ON").hide();
		$("#MC_ON").hide();
		$("#DC_ON").hide();
		$("#DN_ON").hide();
		$("#VC_ON").hide();
		$("#AC_OFF").show();
		$("#MC_OFF").show();
		$("#DC_OFF").show();
		$("#DN_OFF").show();
		$("#VC_OFF").show();
		$("#ccErrMsg").html("");
}

function validateKeyPress(ccNumber, typeKey) {
	if($('#creditCardNumber').attr('readonly') == 'readonly') {
		return false;
	}
	validateCCType(ccNumber, typeKey);
}

function validateCCType(ccNumber, typeKey){
	
	var ccTypeVal;
	
	var cur_val = ccNumber.replace(/\s/g, '');
	if((typeKey == '' || typeof typeKey == 'undefined') && cur_val == '') {
	defaultHideAndShow();
		
	$('#creditCardType').val("0");
	return false;
	
	}

	var str = $('#creditCardTypes').val();
	    // the regular expressions check for possible matches as you type, hence the OR operators based on the number of chars
	    // Visa
		var visa_regex = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;  
	    // MasterCard
		var mastercard_regex = /^(?:5[1-5][0-9]{14})$/; 
	    // American Express
		var amex_regex = /^(?:3[47][0-9]{13})$/;  
	    // Diners Club
	    //diners_regex = new RegExp('^3[068]$|^3(?:0[0-5]|[68][0-9])[0-9]{0,11}$');//^3(?:0[0-5]|[68][0-9])[0-9]{11}$
		var diners_regex = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/;  
	    //Discover
		var discover_regex = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;  
	
	    // get rid of spaces and dashes before using the regular expression
	    cur_val = cur_val.replace(/ /g, '').replace(/-/g, '');
	
	    // checks per each, as their could be multiple hits
		defaultHideAndShow();
	    if (cur_val.match(visa_regex) || typeKey == '3') {
			if (str != '' && str.toLowerCase().indexOf('3') < 0) {
				$('#creditCardType').val("0");
				$("#ccErrMsg").html("Invalid credit card number");
				return false;
			}
	       
			ccTypeVal="3";
			
			$("#VC_OFF").hide();
			$("#VC_ON").show();
			
			$("#creditCardType").val("3");
	    } else if (cur_val.match(mastercard_regex) || typeKey == '2') {
			if (str != '' && str.toLowerCase().indexOf('2') < 0) {
				$('#creditCardType').val("0");
				$("#ccErrMsg").html("Invalid credit card number");
				return false;
			}
	       
			ccTypeVal="2";
			
			
			$("#MC_OFF").hide();
			$("#MC_ON").show();
			
			$("#creditCardType").val("2");
	    }
		else if (cur_val.match(amex_regex) || typeKey == '1') {
			if (str != '' && str.toLowerCase().indexOf('1') < 0) {
				$('#creditCardType').val("0");
				$("#ccErrMsg").html("Invalid credit card number");
				return false;
			}
	        
			ccTypeVal="1";
			
			$("#AC_OFF").hide();
			$("#AC_ON").show();
			
			$("#creditCardType").val("1");
	    } else if (cur_val.match(diners_regex) || typeKey == '5') {
			if (str != '' && str.toLowerCase().indexOf('5') < 0) {
				$('#creditCardType').val("0");
				$("#ccErrMsg").html("Invalid credit card number");
				return false;
			}
	       
			ccTypeVal="5";
			
			$("#DN_OFF").hide();
			$("#DN_ON").show();
			
			$("#creditCardType").val("5");
	    } else if (cur_val.match(discover_regex) || typeKey == '4') {
			if (str != '' && str.toLowerCase().indexOf('4') < 0) {
				$('#creditCardType').val("0");
				$("#ccErrMsg").html("Invalid credit card number");
				return false;
			}
	       
			ccTypeVal="4";
			
			$("#DC_OFF").hide();
			$("#DC_ON").show();
			
			$("#creditCardType").val("4");
	    }
		else {
	        $("#creditCardType").val("0");
	        $("#ccErrMsg").html("Invalid credit card number");
	    }
}

function loadCurrentMonthAndYear(selectedYr, selectedMnth){
}

//autofills the state and city based on the country and zip
//if the zip is invalid, then an error icon will display
function onAddressZipChangeCreditApp(zip, prefix, canadaCheck){
	canadaCheck = typeof(canadaCheck) != 'undefined' ? canadaCheck : false;
	var countryKey = $('#' + prefix + 'country').val();
	
	try{
		zip = $.trim(zip);
	}
	catch(err){}
	if(zip == ""){
		hideZipErrorIconCreditApp(prefix);
		clearAddressAutoFillCreditApp(prefix);
		return;
	}
	 
	$.ajax({
		type: "GET",
		url: '/checkout/addressAutoFill',
		data: 
			{
				'postal':zip,
				'countryKey':countryKey,
				'ajaxDate':getAjaxDate()
			},
		success: function(data){
			processAutoFillResponseCreditApp(data, prefix, canadaCheck);
	
		
		},
		error: function(data){
		}
	});
}

//processes the response from onAddressZipChange
//this will either show an error icon or fill in the address values
function processAutoFillResponseCreditApp(html, prefix, canadaCheck){

	if((html.indexOf('validation-messages') < 0) && (html.indexOf('canada-postal-alert') < 0) && (html.indexOf('usa-postal-alert') < 0)){
		// there were no errors
		eval("var jsonResult = " + html);
		hideZipErrorIconCreditApp(prefix);

		// set the state name
		$('#' + prefix + 'state').val(jsonResult.state);

		// remove the options already in the city select box
		var citySelect = $('#' + prefix + 'city');
		$(citySelect).empty();
		
	    // add the cities to the city select box with keys as postal keys and values as the city name
		var cities = jsonResult.cities;
		var postalKeys = jsonResult.postalKeys;
		for(var i=0; i<cities.length; i++){
			$(citySelect).find('option').end().append('<option value="'+postalKeys[i]+'">'+cities[i]+'</option>').val(postalKeys[i])
		}

		// select the default city which is the first one in the list
		citySelect.selectedIndex = 0;
		try{
		$(citySelect).selectmenu('refresh', true);;
		}catch(err){}
		citySelect.selectedIndex = 0;
	}
	else if (canadaCheck && html.indexOf('canada-postal-alert') >= 0){
		showZipErrorIconCreditApp(prefix);
	}
	else if (canadaCheck && html.indexOf('usa-postal-alert') >= 0){
		showZipErrorIconCreditApp(prefix);
	}	
	else{
		showZipErrorIconCreditApp(prefix);
		clearAddressAutoFillCreditApp(prefix);
	}
}

//when entering an address and the zip code is invalid for
//domestic addresses, an error icon will appear and the
//input box will have a red border
function showZipErrorIconCreditApp(prefix){	
	var zipErrorIcon = $('#' + prefix + 'zipErrorIcon');	
	var zipElem = $('#' + prefix + 'zip');
	if (zipErrorIcon && zipElem) {
		$(zipErrorIcon).show();
		$(zipErrorIcon).fadeIn("fast");
		$(zipElem).css({"border-color": "#FF0000", "border-weight":"2px", "border-style":"solid"});
	}
}

//this method removes the effect that occurs when the zip
//is wrong for domestic address forms. See showZipErrorIcon() above.
function hideZipErrorIconCreditApp(prefix){
	
	var zipErrorIcon = $('#' + prefix + 'zipErrorIcon');
	
	var zipElem = $('#' + prefix +'zip');
	
	if(zipErrorIcon && zipElem) {
		$(zipErrorIcon).fadeOut("fast");
		$(zipElem).css({"border-color": "", "border-weight":"", "border-style":""});
	}
}

//clears the fields involved in autofilling based on zip
function clearAddressAutoFillCreditApp(prefix){
	// set the state name
	$('#' + prefix + 'state').value = "";
	$('#' + prefix + 'city').empty();
}

function saveTermsAndCondtions(ele){
	var obj = new Object();
		if($(ele).is(":checked")) {
			obj.url = '/checkout/saveTermsAndConditions?enableCheckBox=true';
	} 
	else {
			obj.url = '/checkout/saveTermsAndConditions?enableCheckBox=false';
	}
		obj.successFunction = "saveTermsAndCondtionsSuccess";
		createAjaxCallPost(obj);
}

function saveTermsAndCondtionsSuccess(data) {
	//empty because the data is coming as blank.
}


function changeLocalization(language,country){ 
	var obj = new Object();
	if(language == null || country == null){
	obj.url = '/changeLocale?language=' + nl + '&country=' + NL;
	}else{
	obj.url = '/changeLocale?language=' + language + '&country=' + country;
	}
	obj.successFunction = "changeLocalizationSuccessFun";
	createAjaxCall(obj);
}

function changeLocalizationSuccessFun() {
	window.location.reload();
}

function setFlagSubscribeEmail(isChecked){
	if(isChecked){
		$("#flagSubscribeEmail").val("true");
		$("#flagSubscribeEmail").prop('checked',true);
	} else {
		$("#flagSubscribeEmail").prop('checked',false);
		$("#flagSubscribeEmail").val("false");
	}

}

//webchannel calculation details, freightvalue popup
function showBBoxStatic(title,divId){
	showBBoxMessage(title, $("#" + divId).html());
}

// Function added by Nitesh for the Ticket EMEA-56
function changePriceDisplay(type){  
	var obj = new Object();
	if(type == null){
		obj.url = '/changePriceDisplay?type=' + 0;
	}
	else{
		obj.url = '/changePriceDisplay?type=' + type;
	}
	obj.successFunction = "changePriceDisplaySuccess";
	createAjaxCall(obj);
  
}

// Added by Lakshmi:IG-751 UI changes
function floatingCartChangePriceDisplay(type){
    $('#vat').text('');
    $('#vat').append(document.getElementById('vat_'+type).value);
	var obj = new Object();
	if(type == null){
		obj.url = '/changePriceDisplay?type=' + 0;
	}
	else{
		obj.url = '/changePriceDisplay?type=' + type;
	}
	obj.successFunction = "changePriceDisplaySuccess";
	createAjaxCall(obj);
}

function floatingCartChangedVatDisplay(){
	document.getElementById('priceTaxList').style.display = "block";
}

// Function added by Nitesh for the Ticket EMEA-56
function changePriceDisplaySuccess() {
	window.location.reload();
}

/* References from StyleVariableProcessors.
 * This method is called when user clicks on Buy Style Variable Button. */
function addToCartFromStyleVariableProcessors(itemKey, customize, fc, uom, vendorKey, conditionKey, sellerSequence,itemQty) {
	// calling of generic add to cart method
	addItemToShoppingCart(itemKey, itemQty, customize, fc, uom, null, null, vendorKey, conditionKey,null,null,null,sellerSequence);	
}

//visa checkout
function visaCheckoutSuccessFun(payment){
	if($('#visaCheckoutForm').length == 0) {
		$('body')
        	.append('<form id="visaCheckoutForm" name="visaCheckoutForm"></form>');
	}
	var vform = $('#visaCheckoutForm');
	vform.attr("method", "post");
	vform.attr("action", '/checkout/VisaCheckout');
	$('<input>').attr({
		type: 'hidden',
		name: 'data',
		value: JSON.stringify(payment)
	}).appendTo('#visaCheckoutForm');
	vform.submit(); 
}


function positionAmazonWidget() {
	$("#accordionWrapper").addClass("popUpWin");
	windowPlacement("#accordionWrapper",$(window).scrollTop() - 100);
	$("#accordion").show();
    var popWidth = $("#accordionWrapper").width();
	var popHt = $("#accordionWrapper").height();
	var popLeftPos = (screenWidth - popWidth ) / 2;
	var popTopPos = ((winHeight - popHt) / 2) + clickPos;
	$("#accordionWrapper").css({"top":popTopPos,"left":popLeftPos});
	$("#accordionWrapper").show();
}
function emailArchivePaging(currentPage, pageSize){
	var obj = new Object();
	obj.url = "/emailArchivePage";
	
	var emailArchiveType="";
	if ($('#BC').length)
	{
		emailArchiveType = emailArchiveType +"&emailArchiveType=bc"
	
	}
	if ($('#BB').length)
	{
		emailArchiveType = emailArchiveType + "~bb"
	}
	
	obj.data = 'cp=' + currentPage + '&items=' + pageSize+''+emailArchiveType;
	obj.successFunction = "emailArchivePagingSuccessFun";
	createAjaxCall(obj, true, "emailArchive");
	return false;
}

function emailArchivePagingSuccessFun(data){
	if (data.indexOf('Error') < 0) {
		 $("#BC").html($(data).children('#BC').html());
		 $("#BB").html($(data).children('#BB').html());
		attachEvents();
	} else {
		//alert("Error Sorting");
	}
}
//lexisnexis
function invokeLNService(type) {
	var obj = new Object();
	if (type == 'pf') {
		obj.url = '/checkout/lnProofing';
		obj.successFunction = "invokeLNIdSuccessFun";
		obj.data = $('#lnProofingForm').serialize();
	}
	else if (type == 'quiz'){
		obj.url = '/checkout/lnProofingQuiz';
		obj.successFunction = "invokeLNQuizSuccessFun";
		obj.data = $('#lnQuizForm').serialize();
	}
	obj.errorFunction = "invokeLNErrorFun";
	createAjaxCall(obj); 
}
function invokeLNIdSuccessFun(data) {
	if (data.indexOf('validation-messages') < 0) {
		$('#lnResult').html(data);
	}
}
function invokeLNQuizSuccessFun(data) {
	if (data.indexOf('validation-messages') < 0) {
		$('#lnResult').html(data);
	}
}
function invokeLNErrorFun(data) {
	$('#lnResult').html(data);
}

function setSelectedChoice(qid, cid, ele) {	
	var tmp = $('#Questions_' + qid).val();
	if (ele.is(':checked')) {		
		var newTmp = $('#question_' + qid + '_' + cid).val();
		$('#Questions_' + qid).val(tmp + newTmp);
	} else {
		var tmp2 = tmp.substring(0,tmp.indexOf('_')+1);
		if (tmp.indexOf('_') > 0) {
			$('#Questions_' + qid).val(tmp2);
		}
	}
}

function expandFaq(a){
	var b=document.getElementsByClassName("expandedFaq");
	if(b){
		for(i=0;i<b.length;i++){
			b[i].style.display="none"
		}
	}
	var c=document.getElementById("faq"+a);
	c.style.display="block"
}

function addCartSlider() {
	$('.cartSlider ul').jcarousel({
		scroll: 4,
	});
	if ($('.cartSlider ul li').length < 5) {
		$('.cartSlider .jcarousel-prev, .cartSlider .jcarousel-next').hide();
	}
}    