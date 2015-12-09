$(document).ready(function ($) {
	attachProdEvents ();
});

function attachProdEvents () {
	// Product detail large arrows - over functionality
	$(".prevArrow, .nextArrow").mouseenter(function() {
		$(this).addClass("over")
	});
	
	$(".prevArrow, .nextArrow").mouseleave(function() {
		$(this).removeClass("over")
	});
	
	$("span.qmark").mouseenter(function() {
		if ($(this).parent('div').attr("class") == "squareTrade") {
			var $info = $(this).attr("link");
			$($info).css("display", "block")
		}
		
		else {
			$("#shipTip").css("display", "block")
		}
	});
			
	$("span.qmark").mouseleave(function() {
		if ($(this).parent('div').attr("class") == "squareTrade") {
			var $info = $(this).attr("link");
			$($info).hide()
		}
		
		else {
			$("#shipTip").hide()
		}
	});
	
	//only for webchannel (priceType field is populated only for webchannel)
	$("div.pricing").mouseenter(function() {
		if($("#priceType").text() != ''){
			showBBoxMessage("Price Type",$("#priceType").text());
			$('#mask').remove();
		}
	});

		
	
	$("div.pricing").mouseleave(function() {
		if($("#priceType").text() != ''){			
			$('.popUpWin').fadeOut(1000, function () {
				$('.popUpWin').remove(); 
			});
		}
	});
	
	
	
	// for upsell scroll item on prod detail page
	if ($('.pt-popup').length) {
		$(document).scroll(function ()  { 
			var y = $(this).scrollTop();
    		if (y > 200) { 
				$('.pt-popup').fadeIn(1000);
			}		
		});// end upsell
	}
	
	
	// get height of first visible container in tab area
	// height for div of ajax progress bar indidcator
	indicatorHt = $("#product_tabs_container #tabActiveId").height();
	
	// for marketplace items on product detail - when no bundles slider exist
	 if ( ($('#details_mp').length) && ($('#popularAddOnsSlider').length <= 0) ) {
		  $('#details_mp').fadeIn(1500);
	 }
	  
}

//close upsell popup
$(document).on('click','span.pt-close', function () {
	//adding gaEvent when closing suggested item popup
	gaEvent('Suggested Product', 'Click', 'No Thanks', 0);
	$('div.pt-popup').animate({bottom:'-232px'});
	$('.pt-popup .pt-ribbon').css('margin-top',0);
	$('.tx-ribbon span.plus').show();
	$(this).hide();
	
});

//reopen upsell popup
$(document).on('click','.pt-popup .pt-ribbon', function () {
	$('div.pt-popup').animate({bottom:'0'});
	$(this).removeAttr('style');
	$('.tx-ribbon span.plus').hide();
	$('span.pt-close').show();
});

// jquery for QA tab "View Answer" button
$(document).on("click", "p.btnViewAns", function () {
	var faqId = $(this).attr("id");
	$("#answer_" + faqId).slideToggle("slow");
	if ($(".btnViewAns span").text() == "+") {
		$(".btnViewAns span").text("-");
	}
	else {
		$(".btnViewAns span").text("+")
	}
})
// jquery for QA tab "View Answer" button


// Customize Pop up
$(document).on("click",".pzhdr", function() {
	$('#plusminus').toggleClass('minus plus');
	$('#PZtoggle').slideToggle()
});	

$(document).on("click", "#pzselect", function(){
	$('#pzselect').change(function(){
		if ($(this).val() == "pzText" ) {
			$('#pzImage').hide();
			$('#pzText').show();   
		}
		if ($(this).val() == "pzImage" ) {
			$('#pzText').hide();
			$('#pzImage').show();   
		}
	});
});
// Customize Pop up


/********* Callback functions for slider movie in prod detail tab *********/
function imageMovie_initCallback(carousel) {
	$(".slider-start").on('click', function() {
		$(".slider-start").toggleClass('pause');
		if ($(this).attr("state") == "playing") {
			carousel.stopAuto();
			$(this).attr("state", "stoped")
		}
		
		else {
			carousel.startAuto();
			$(this).attr("state", "playing")
		}
		return false;
	});

	 $('.controls a').on('click' , function(event) {
		$('.controls a').removeClass("on");
        carousel.scroll($.jcarousel.intval($(this).attr("href")));
		$(this).addClass("on");
		//carousel.stopAuto();
        return false;
    });
}

function imageMovie_itemVisibleInCallbackAfterAnimation(carousel, item, idx, state) {
   	$(".controls a#c" + idx).addClass("on");
};

function imageMovie_itemVisibleOutCallbackAfterAnimation(carousel, item, idx, state) {
   	$(".controls a#c" + idx).removeClass("on");
};
/********* Callback functions for slider movie in prod detail tab *********/


//  ****** Prod detail tabs ******
$(document).on('click', "#product_tabs_container div.tabContainer div", function(e)  { 
	//Get tab's content
	var getTabContent = $(this).attr("id");
	getTabContent = "#" + getTabContent;
	var tabText= getTabContent + "_txt";
	
	//Make Tab Active
	$("div.tab").removeClass('active');
	$(this).addClass('active');
	
	//Show/Hide Tab Content
	params = "type=" + $(this).attr("tabtype") + "&itemKey=" + $(this).attr("itemKey")+ "&picGroupKey=" + $(this).attr("picGrpKey") + "&selectedWarranty="+$("#warranty_selection").val();
	hideShowTabs(tabText, getTabContent, params);
});
	
function openTab( tabid, picGrpKey, itemKey, tabtype) {
	$("div.tabContainer").find("div").each(function(){
		if( tabid != $(this).attr("id") ){
			$(this).removeClass('active');
		} else {
			$(this).addClass('active');
			$('body').scrollTo('#product_tabs_container');
		}
	});
		
	var getTabContent = "#" + tabid;
	var tabText = tabid + "_txt";
	
	$(getTabContent + "_txt").show();
	params = "type=" + tabtype + "&itemKey=" + itemKey+ "&picGroupKey=" + picGrpKey;
	hideShowTabs(tabText, getTabContent, params);
	return;
}
	
function hideShowTabs(tabText, getTabContent, params){	
	$('.tabTxtContainer').find('.tabTxt').each(function(){
		 var obj = $(this);
		 if( tabText != $(this).attr("id")){
			 $(this).css("display","none");
		 }
	});
	
	$('.tabTxtContainer').children().each(function(){
		 var obj = $(this);
		 if (obj.attr("class") != "tabTxt" && obj.attr("class") != "tabTxt slvzr-first-child") {
			 $(this).show();
		 }
	 });
	$(getTabContent + "_txt").show();
	$("#tabActiveId").attr("activeTab",getTabContent + "_txt");
	if(getTabContent == "#prodInfo") {
		hideProgressBar();
	}
	
	else {
		tabEventAjax(params)
	}
}
	
function tabEventAjax(params){
	var objId = $("#tabActiveId").attr("activeTab");
	objId = objId.substr(1);
	var obj = new Object();
	obj.url = "/productTab";
	obj.data = params;
	obj.successFunction= "populateResponse";
	createAjaxCall(obj, true, objId);
}

function ReviewSort(itemKey,picGroupKey,type,page,sort){
	params = "type=" + type + "&itemKey=" + itemKey+ "&picGroupKey=" + picGroupKey+ "&paging.currentPage="+page+ "&sort="+sort;
	tabEventAjax(params);
}

function qaSort(itemKey,picGroupKey,type,page,sort){
	params = "type=" + type + "&itemKey=" + itemKey+ "&picGroupKey=" + picGroupKey+ "&paging.currentPage="+page+ "&sort="+sort;
	tabEventAjax(params);
}

function nextReview(itemKey,picGroupKey,type,page){
	params = "type=" + type + "&itemKey=" + itemKey+ "&picGroupKey=" + picGroupKey+ "&paging.currentPage="+(parseFloat(page)+1);
	tabEventAjax(params);
}
	
function prevReview(itemKey,picGroupKey,type,page){
	params = "type=" + type + "&itemKey=" + itemKey+ "&picGroupKey=" + picGroupKey+ "&paging.currentPage="+(parseFloat(page)-1);
	tabEventAjax(params);
}

function goToReview(itemKey,picGroupKey,type,page){
	params = "type=" + type + "&itemKey=" + itemKey+ "&picGroupKey=" + picGroupKey+ "&paging.currentPage="+parseFloat(page);
	tabEventAjax(params);
}
	
function populateResponse(data){
	hideProgressBar();
	var activeTabId = $("#tabActiveId").attr("activeTab");
	$(activeTabId).html(data);
	$(activeTabId).focus();
}

function reviewProduct(itemKey){
	var url = '/reviewProduct?itemKey=' + itemKey;
	openURL(url);
}

function openURL(url){
	window.open(url);
}
	
function calculateBasicShipping(zip,itemKey,carrierServiceKey){	
	if (null == carrierServiceKey || 'undefined' == carrierServiceKey) {
		carrierServiceKey = "3_4";
	}
	var obj = new Object();
	obj.url = "/calculateProductShipping";
	params = "zip="+zip+"&itemKey="+itemKey+"&countryKey=1&carrierServiceKey="+carrierServiceKey;
	obj.data = params;
	obj.successFunction= "calculateProductShippingSuccessFun";
	obj.errorFunction="doNothingFun"
	createAjaxCall(obj, false);
	gaEvent('Shipping', 'Calculate', 'Product Details', 0);
}

function populateBaseShipping(data){
	eval("var jsonResult = " + data);
	var shippingResult=jsonResult.shippingResult;
	var totalPrice=jsonResult.totalPrice;
	if ($(".shipprice").length>0) {
	  $(".shipprice").html(shippingResult+'&nbsp;&nbsp;&nbsp;');
	  $('span#totalprice').html(totalPrice);
	  $("#globalItemTotalPrice").removeClass("hide");
	}
	hideWindow();
}

function closeMapPrice(){
	hideWindow();
	$("#mapPrice1_pop").hide();
}
	
function calculateProductShippingSuccessFun(data){
	if (data.indexOf("validation-messages") > -1) {
		highLightFormField(data);
		$('#hideErrorOnPopup').hide();
	} 
	else {
		populateBaseShipping(data);
	}
}
	
function calculateProductShippingErrorFun(){
	alert("system experienced failure");
}

$(document).on('click', "#emailProductSubmit", function(e)  {
	e.preventDefault();
	e.stopPropagation();
	emailProductSend();
	gaEvent('Product Details', 'Email', '', 0);
});
	
function emailProductSend(){
	var obj = new Object();
	obj.url = $("#emailProductForm").attr('action');
	obj.data = $("#emailProductForm").serialize();
	obj.successFunction = "sendEmailSuccFun";
	obj.errorFunction = "sendEmailErrorFun";
	createAjaxCall(obj);
	return false;
}
	
function sendEmailSuccFun(data){
	if (data.indexOf("validation-messages") > -1) {	
	highLightFormField(data);	
	} 
	else {
		// need to call /emailProductSend for confirmation
		$('.form_2col').html(data);
		$('.error_sec').remove();
		$('.hide').remove();
	}
}
	
function sendEmailErrorFun(data){
  alert("emailProdcutError = " + data);	
}
	
	
	
function customizeProductUpdatePrice() {
	$("#updatePriceForm").html('&nbsp;');
	var numFound = 0;
	$('<input>').attr({
		type: 'hidden',
		id: 'itemKeys0',
		name: 'itemKeys'
	}).appendTo('#updatePriceForm');
	
	$('<input>').attr({
		type: 'hidden',
		id: 'quantities0',
		name: 'quantities'
	}).appendTo('#updatePriceForm');
	
	$("#quantities0").val($("#mainItemQty").val());
	$("#itemKeys0").val($("#mainItemKey").val());
	$(".sub_checkbox").each( function(){
		if ($(this).is(':checked')) {
			numFound++;
			var id = $(this).attr("id");
			var index = "checkboxList_".length;
			var itemKey = id.substr(index);
			var qty = $("#quantityList_"+itemKey).val();
			if (null == qty || '' == qty) {
				qty = '1';
			}
			
			$('<input>').attr({
				type: 'hidden',
				id: 'itemKeys'+numFound,
				name: 'itemKeys'
			}).appendTo('#updatePriceForm');
			
			$('<input>').attr({
				type: 'hidden',
				id: 'quantities'+numFound,
				name: 'quantities'
			}).appendTo('#updatePriceForm');
			
			$("#quantities"+numFound).val(qty);
			$("#itemKeys"+numFound).val(itemKey);
			
		}
	});
		
	var obj = new Object();
	obj.url = $("#updatePriceForm").attr('action');
	obj.data = $("#updatePriceForm").serialize();
	obj.successFunction = "updatePriceFormSuccessFun";
	obj.errorFunction = "updatePriceFormErrorFun";
	createAjaxCall(obj, true, null, true);
	return false;
}
	
function updatePriceFormSuccessFun(data){
	$("#totalPrice").html(data);
	$("#totalPrice2").html(data);
}

function updatePriceFormErrorFun(data){
	alert("Error on Updating Price Total");
}
	
	
function addItemToCart(itemKey, fc, accessories) {
	var qty = $("#quantityList_" + itemKey).val();
	if ((qty == null) || (qty == '') || (qty < 1)){
	   qty = '1';
	}
	
	var minQty = $("#salesQtyMin").val();
	if(typeof minQty != 'undefined'){
		var newQty = Math.floor(minQty);
		if(qty < newQty){
			qty = newQty;
		}
	}
	
	if (fc) {
	  var successFn;
	  dataurl = "item="+itemKey+"&qty="+qty+"&fc=true&itemKey="+itemKey+"&addedQty="+qty;
	  errorFn = "addCartFormErrorFun";
	  if (accessories) {
		  successFn = "addCartFormPGSuccessFun";
	  } 
	  else {
		  successFn = "addCartFormFCSuccessFun";
	  }
	  submitCartForFc(successFn, errorFn, dataurl );
	  return false;
	} 
	
	else {
		var cartForm = document.getElementById('addCartForm');
		if (null == cartForm || 'undefined' == cartForm || 'null' == cartForm) {
			cartForm = document.createElement("form");
			document.body.appendChild(cartForm);
			cartForm.action = "/addToCart";
			cartForm.method = "post";
		} 
		else {
			$("#addCartForm").html('');
		}
		
		if (cartForm.hasChildNodes()){
		  while (cartForm.childNodes.length >= 1){
			cartForm.removeChild(cartForm.firstChild);       
		  } 
		}
		
		var itemKeyField = document.createElement("input");
		itemKeyField.setAttribute("type", "hidden");
		itemKeyField.setAttribute("name", "item");
		itemKeyField.setAttribute("value", itemKey);
		cartForm.appendChild(itemKeyField);
		
		var qtyField = document.createElement("input");
		qtyField.setAttribute("type", "hidden");
		qtyField.setAttribute("name", "qty");
		qtyField.setAttribute("value", qty);
		cartForm.appendChild(qtyField); 
		
		var itemKeyField = document.createElement("input");
		itemKeyField.setAttribute("type", "hidden");
		itemKeyField.setAttribute("name", "itemKey");
		itemKeyField.setAttribute("value", itemKey);
		cartForm.appendChild(itemKeyField);
		
		var qtyField = document.createElement("input");
		qtyField.setAttribute("type", "hidden");
		qtyField.setAttribute("name", "addedQty");
		qtyField.setAttribute("value", qty);
		cartForm.appendChild(qtyField);
		
		cartForm.submit();
	}
}
	
function addCardFormSuccessFun(data){
	window.location.href = "/viewCart";
}

function productAnswer(itemKey, faqKey){
	var url = '/productAnswer?itemKey=' + itemKey + '&faqKey=' + faqKey;
	var obj = new Object();
	obj.url = '/productAnswer';
	obj.data = 'itemKey=' + itemKey + '&faqKey=' + faqKey;
	obj.successFunction = "productAnswerSuccessFun";
	createAjaxCall(obj);
}
	
	
//*** Ask / Answer Product Questions **** ///
$(document).on("click", "#submitQtn, #submitAnswer", function(event) {
	event.preventDefault();
	var obj = new Object();
	obj.url = $(this.form).attr('action');
	obj.data = $(this.form).serialize();
	obj.successFunction = "saveQuestionFormSuccessFun";
	obj.errorFunction = "ajaxCommonErrorHandling";
	createAjaxCall(obj);
});
	
function saveQuestionFormSuccessFun(data){
	if (data.indexOf("validation-messages") < 0) {
		if ($('#saveQuestionForm').length > 0){
			$('#saveQuestionForm').trigger("reset");
		}
		if ($('#saveAnswerForm').length > 0){
			$('#saveAnswerForm').trigger("reset");
		}
		$('.error_sec').hide();
		$(".body").html(data);
	} 
	else {
		$("div#hideErrorOnPopup").hide();
		highLightFormField(data);
	}
}

//*** Ask / Answer Product Questions **** ///	
	
function voteAnswer(faqAnswerKey, grade){
	displayProgressBar();
	$.ajax({
		type: "GET",
		url: '/productAnswerVote',
		data: 'faqAnswerKey=' + faqAnswerKey + '&grade=' + grade + '&ajaxDate=' + getAjaxDate(),
		cache: false,
		success: function(data){
			hideProgressBar();
			$('#answerVotesText_' + faqAnswerKey).html('Thank you for your response.<br />It will be posted shortly.');
			
			var yesSrc = $('#answerVotesYes_' + faqAnswerKey).attr("src");
			yesSrc = yesSrc.replace("answerHelpfulYes.gif", "answerHelpfulYes_dim.gif");
			$('#answerVotesYes_' + faqAnswerKey).attr("src", yesSrc);
			
			var noSrc = $('#answerVotesNo_' + faqAnswerKey).attr("src");
			noSrc = noSrc.replace("answerHelpfulNo.gif", "answerHelpfulNo_dim.gif");
			$('#answerVotesNo_' + faqAnswerKey).attr("src", noSrc);
			
			$('#answerVotesYes_' + faqAnswerKey).unbind('click');
			$('#answerVotesNo_' + faqAnswerKey).unbind('click');

			$('#answerVotesYes_' + faqAnswerKey).css("cursor","default");
			$('#answerVotesNo_' + faqAnswerKey).css("cursor","default");
			
			// code appended IG-569 by Pankaj
			if ((yesSrc.indexOf('answerHelpfulYes_dim.gif') >= 0) || (noSrc.indexOf('answerHelpfulNo_dim.gif') >= 0)) {
				$('#answerVotesYes_' + faqAnswerKey).attr("onclick", "false");
				$('#answerVotesNo_' + faqAnswerKey).attr("onclick", "false");
			}
		},
		error: function(xhr, ajaxOptions, thrownError){
			hideProgressBar();
			if(xhr.readyState == 0 || xhr.status == 0) {
				return;  // it's not really an error This happens due to Response already commited 
			}
			alert("System Experienced a Failure !");
		}
	});
}
	
/* * References from productDetail Page.
 * This method is called when user clicks on AddToCart Main Button.
 * sellerSequence can be 0 */
function addToCart(itemKey, customize, fc, uom, vendorKey, conditionKey, sellerSequence) {
	var qty = $('#itemQty').val();
	if (isNaN(qty) || (qty == '') || (qty < 1)) {
		showBBoxMessage('Add To Cart','Please enter a valid quantity');
		return false;
	}
	addItemToShoppingCart(itemKey, qty, customize, fc, uom, null, null, vendorKey, conditionKey,null,null,null,sellerSequence);
}

function selectAddOn(itemKey, index){
	$("#addOn"+index).val(itemKey);
	$("#addOn"+index+"_add").toggle();
	$("#addOn"+index+"_remove").toggle();
}

function removeAddOn(itemKey, index) {
	$("#addOn"+index).val('');
	$("#addOn"+index+"_add").toggle();
	$("#addOn"+index+"_remove").toggle();
}
	

	
/** This function seems to be not used by anyone. 
* No References. */
function customizeItemsFromPicGroup() {
	var cartForm = $('#addCartForm');
	$("#addCartForm").html('');
	var numItems = 0;
	var itemKey = 0;
	var qty = 0;
	var customCut = false;
	$("#pictureGridContainer").find('.pic_group_qty').each(function(){
		if ($(this).val() != '') {
			if(!isNaN($(this).val())) {
				var idObj = $(this).attr("id");
				var currentItemKey = idObj.substr('quantityList_'.length);
				$('<input>').attr({
					type: 'hidden',
					name: 'item',
					value: currentItemKey
				}).appendTo('#addCartForm');
				
				$('<input>').attr({
					type: 'hidden',
					name: 'qty',
					value: $(this).val()
				}).appendTo('#addCartForm');
				
				$('<input>').attr({
					type: 'hidden',
					name: 'itemKey',
					value: currentItemKey
				}).appendTo('#addCartForm');
				
				$('<input>').attr({
					type: 'hidden',
					name: 'addedQty',
					value: $(this).val()
				}).appendTo('#addCartForm');
				
				if ($("#customCutList_"+itemKey).length > 0) {
					customCut = true;
				}
				numItems++;
				
				if (numItems == 1) {
					itemKey = currentItemKey;
					qty = $(this).val();
				}
			} else {
				showBBoxMessage('Add To Cart','Please enter a valid quantity');
				return;
			}
			
		}
	});
	
	if (numItems == 0) {
		showBBoxMessage('Add To Cart','Please enter at least one quantity');
	} else if (numItems > 1) {
		createModalWindow("customizeConfirmation",$("#customizeConfirmation").html());
	} else if (customCut) {
		createModalWindow("customCutAlert",$("#customCutAlert").html());
	} else {
	
		displayProgressBar();
		$('#addCartForm').append(getAjaxDateElement());
		$.ajax({
			type: "POST",
			url: $("#addCartForm").attr('action'),
			data: $("#addCartForm").serialize(),
			cache: false,
			success: function(data){
				window.location.href = '/customizeProduct?itemKey=' + itemKey + '&qty=' + qty;
			}
			
		});
	}
}
	
function submitCart(){
	$("#addCartForm").submit();
}
	

function updateCustomCutPrice(){
	var qty = $("#itemQty").val();
	var lengthCut = $("#inputLengthCutField").val();
	var inputPricePerUom = $("#inputPricePerUom").val();
	
	if (isNaN(qty) || qty == '' || qty <= 0) {
		$("#customCutPrice").html("N/A");
		return;
	}
	
	if (isNaN(lengthCut) || lengthCut == '' || lengthCut <= 0) {
		$("#customCutPrice").html("N/A");
		return;
	}
	
	var isInt = /^\d{1,3}(\.0*)?$/.test(lengthCut);
	if(!isInt){
		$("#customCutPrice").html("N/A");
		return;
	}
	
	qty = parseInt(qty);
	inputPricePerUom = parseFloat(inputPricePerUom);
	lengthCut = parseInt(lengthCut);
	
	var totalPrice = qty * lengthCut * inputPricePerUom;
	totalPrice = Math.round(totalPrice * 100) / 100;
	if(totalPrice.toFixed) {
		totalPrice = totalPrice.toFixed(2)
	}
	$("#customCutPrice").html("$" + totalPrice);
}
		
	
$(document).on('click', "#addToCartEnlargeImage", function(e)  {
	e.preventDefault();
	e.stopPropagation();
	var itemKey = $(this).attr("itemKey");
	var fc = $(this).attr("fc");
	addItemToCart(itemKey, fc );
});
	
	
$(document).on('click', "#pd_soldby #pd_soldbymp", function(e)  { 
	e.preventDefault();
	e.stopPropagation();
	var sellerKey = $(this).attr("sellerKey");
	window.open('/sellerInfo?vendorKey='+sellerKey,'miniwin', 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=800');
});

$(document).on('click', "#pd_soldbymp_return", function(e)  { 
	e.preventDefault();
	e.stopPropagation();
	var sellerKey = $(this).attr("sellerKey");
	window.open('/sellerInfo?vendorKey='+sellerKey+'#mp_return','miniwin', 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=800');
});

function mphide(el) {
	el_obj = document.getElementById(el)
	el_obj.style.display = 'none';
}
		
function mpshow(el) {
	el_obj = document.getElementById(el)
	el_obj.style.display = 'block';
}

// *** personalization (pz) functions  *** 
function addPzItemToCart(itemKey) {
	var cartForm = document.getElementById('pzForm');
	var mqty = document.getElementById('minPzQty').value;
	var qty = document.getElementById('qty').value;
	if(Math.floor(qty) != qty || qty.split('.') != qty){
		$("#warning").text("Check Your Quantity");
		return false;
	}
	cartForm.action = '/addToCart';
	cartForm.method = 'get';
	var testValue=  $("#fromApp").val();
	if(testValue === 'true'){
		var obj = new Object();
		obj.url = $("#pzForm").attr('action');
		obj.data = $("#pzForm").serialize();
		obj.successFunction = "addPzItemToCartFromAppSuccFunc";
		createAjaxCall(obj);
	}
	else {
		if (checkFileStatus() == false) {
		  cartForm.submit();
		  gaEvent('Cart', 'Add', 'Product Details Page', 0);
		}
	}
}
	
function addPzItemToCartFromAppSuccFunc(data){
	$('#jasonStream').val(data);
	$('#pzFromApp').submit();
}
	
function showAccountTab(tabName, hdrName){
	var tabDisplay = document.getElementById(tabName).style.display;      
	if (tabDisplay == 'none') {			
		var tabs = document.getElementsByClassName('account_tab');
		if(tabs) {
			for(i=0;i<tabs.length;i++)
			{
				tabs[i].hide();
				var tabHdrName = tabs[i].id+'Header';
				$(tabHdrName).removeClassName('accordion_toggle_active');
			}
		}                              
								
		Effect.SlideDown(tabName, { queue: { position: 'end', scope: 'accountSettings', limit: 1 }});          
		$(hdrName).addClassName('accordion_toggle_active');                               
	} 
	else {
		Effect.SlideUp(tabName, { queue: { position: 'end', scope: 'accountSettings', limit: 1 } });
		$(hdrName).removeClassName('accordion_toggle_active');
	}              
				
	return false;
}

function fileUpload(form, action_url, divId,logoId, gid, mkey){
	var itemKey = document.getElementById('itemKey').value;
	var iframe = document.createElement("iframe");
	iframe.setAttribute("id", "upload_iframe");
	iframe.setAttribute("name", "upload_iframe");
	iframe.setAttribute("width", "0");
	iframe.setAttribute("height", "0");
	iframe.setAttribute("border", "0");
	iframe.setAttribute("style", "width: 0; height: 0; border: none;");
	
	// Add to document...
	form.parentNode.appendChild(iframe);
	window.frames['upload_iframe'].name = "upload_iframe";
	iframeId = document.getElementById("upload_iframe");
		
	// Add event...
	var eventHandler = function () {
		if (iframeId.detachEvent) {
			iframeId.detachEvent("onload", eventHandler);
		} else {
			iframeId.removeEventListener("load", eventHandler, false);
		}
		
		// Message from server...
		if (iframeId.contentDocument) {
			content = iframeId.contentDocument.body.innerHTML;
		} else if (iframeId.contentWindow) {
			content = iframeId.contentWindow.document.body.innerHTML;
		} else if (iframeId.document) {
			content = iframeId.document.body.innerHTML;
		}
		
		var content2 = content;
		if (content2.indexOf('<pre>') >= 0 ) {
			content = content2.substring(content2.indexOf('>')+1);
		}
	
		document.getElementById(divId).innerHTML =  content;
		
		if (content.indexOf('|') > 0) {
			document.getElementById(divId).innerHTML = content.substring(0,content.indexOf("|"));
			var iname = content.substring(content.indexOf("|")+1);
			
			if (iname.indexOf('<') > 0) {
				document.getElementById(logoId).value = iname.substring(0,iname.indexOf('<'));				
			}
			else {
				document.getElementById(logoId).value = iname;
			}
			
			$('#btn_preview_'+gid).attr("class", "btn preview");
			document.getElementById('image_'+gid).value="true";
			form.setAttribute("target", "_self");
			
		} else {
		// Del the iframe...
			setTimeout('iframeId.parentNode.removeChild(iframeId)', 250);
		}
	}
	
	if (iframeId.addEventListener) {
		iframeId.addEventListener("load", eventHandler, true);
	}
	if (iframeId.attachEvent) {
		iframeId.attachEvent("onload", eventHandler);
	}
	
	// Set properties of form...
	form.setAttribute("target", "upload_iframe");
	form.setAttribute("action", action_url);
	form.setAttribute("method", "post");
	form.setAttribute("enctype", "multipart/form-data");
	form.setAttribute("encoding", "multipart/form-data");
	// Submit the form...
	form.submit();
	document.getElementById(divId).innerHTML = "Uploading...";	
}

function changePzOptionType(thisSel, optionKey,gKey,gid) {
	var optLkup = thisSel.options[thisSel.selectedIndex].value;
	var optLkName = thisSel.options[thisSel.selectedIndex].label;
	
	var lineAttrDiv = "pzlineAttrDiv_"+optionKey+"_"+optLkup;
	var lineOpts = document.getElementById("option_"+optionKey);
	if (lineOpts && lineOpts.options.length > 0) {	
		for (var i=0; i< lineOpts.options.length; i++) {
			var tmpAttrDiv = "pzlineAttrDiv_"+optionKey+"_"+lineOpts.options[i].value;
			var tmpKey = lineOpts.options[i].value;			
			if (optLkup == tmpKey && document.getElementById(lineAttrDiv) ) {
				document.getElementById(lineAttrDiv).style.display = 'block';
			} else if (document.getElementById(tmpAttrDiv)) {
				document.getElementById(tmpAttrDiv).style.display = 'none';
			}
		}
	}
	document.getElementById("pzAttr_"+gKey).value=gKey;
	if (optLkName.indexOf("Image") >=0 && document.getElementById('image_'+gid) && document.getElementById('image_'+gid).value=="false") {
		$('#btn_preview_' + gid).attr("class", "btn disablePreview");
	} else {
		$('#btn_preview_' + gid).attr("class", "btn preview");
		var iFiles = document.getElementsByName('pickF');
		if (iFiles != null && iFiles.length > 0) {
			for (var i=0; i<iFiles.length; i++) {
				if (iFiles[i].value == "true") {
					document.getElementById(iFiles[i].id).value=false;
					var fId =(iFiles[i].id);
					var id = fId.substring(fId.lastIndexOf('_')+1);
					var pzFile = document.getElementById("image_location");	
					
					if (pzFile.value ) {						
						var ele = document.createElement("input");
						ele.id = pzFile.id; //"image_location";
						ele.name = pzFile.name; //"pzFile";
						ele.type = "file";
						ele.style.cssText = pzFile.style.cssText; //"width:250px;";
						ele.value="";
						ele.onchange = pzFile.onchange;
						pzFile.parentNode.replaceChild(ele, pzFile);			    		
						//Element.replace('image_location',ele);					    							    
					}
				
					document.getElementById('uploadPz_'+id).disabled=true;
					document.getElementById('upload_result_'+id).innerHTML = "";
					document.getElementById('image_'+gid).value = "false";
				}
			}
		}
	}
}

function validateFileExt(fname,key,extstr){
	var eid = "uploadPz_"+key;
	var gotIt = false; 
	var exts = extstr.split('/');
	var fileExt = fname.substring(fname.lastIndexOf('.')+1);
	var ftype = fileExt.toUpperCase();
	if (ftype == "JPG") {
		ftype = "JPEG";
	}
	var fres = 1;
	var fht = 1;
	var fwd = 1;
	var fse = 0;
	var tmpId = ftype + "_" + key;
	for (var i=0; i < exts.length; i++) {
		if (exts[i].toUpperCase() == ftype) {
			gotIt = true;			
			fres = document.getElementById(tmpId + "_res").value;
			fht = document.getElementById(tmpId + "_ht").value;
			fwd = document.getElementById(tmpId + "_wd").value;
			fse = document.getElementById(tmpId + "_se").value;
			break;
		}
	}
	var msg='';
	if (gotIt && fse > 0) {
		var pzFile = document.getElementById("image_location");		
		var size=0;
		if(navigator.appName=="Microsoft Internet Explorer"){
			  if(pzFile.value){
				 var oas=new ActiveXObject("Scripting.FileSystemObject");
				 var e=oas.getFile(pzFile.value);
				 size=e.size;
			  }
		 }
		 else{
			  if(pzFile.files[0]!=undefined){
				 size = pzFile.files[0].size;
			  }
		 }

		if (fse < (size / 1024) ) {
			msg = "The size of image file must less than " + fse + "(KB)";
			gotIt = false;
		}
	}
	else if (!gotIt){
		msg = "The image file has unacceptable format.";
	}
	
	var submitEle = document.getElementById(eid);
	if (gotIt == true) {
		submitEle.disabled = false;
		document.getElementById("pickF_" + key).value="true";
		document.getElementById("imgRt_" + key).value = fres;
		document.getElementById("imgHt_" + key).value = fht;
		document.getElementById("imgWd_" + key).value = fwd;
		return true;
	} else {
		document.getElementById("upload_result_" + key).innerHTML = msg;
		submitEle.disabled = true;
		return false;
	}
}
	
		
//******* Preview button click from Product Customization popup //*******
$(document).on("click", "#pzForm input.preview", function () {
	var actionName = '/pzPreview';
	document.getElementById('pzForm').action = actionName;
	document.getElementById('previewId').value = $(this).attr("modelKey");
  
	var iFiles = document.getElementsByName('pickF');
	
	if (checkFileStatus() == false)  {
		$("#ajaxIndicator, .disableMask").show();
	}
    $('#pzForm').append(getAjaxDateElement());
	$.ajax({
		type: "post",
		url: actionName,
		data: $('#pzForm').serialize(),
		cache: false,
		success: function(data){
			if (data.indexOf('pcs-error-messages') < 0) {
				var prodImage = document.getElementById("colortemp");
				if(prodImage) {
					if (prodImage.src.indexOf(data) != -1) {
						$("#ajaxIndicator, .disableMask").hide();
				} 
				else {
					prodImage.src = data;
					$("#ajaxIndicator, .disableMask").hide();
				}
			}
		}
			},
		error: function(data){
			
		}
	});
});

// Added by Praveen Kumar for this ticket T20150105.0057
function checkSpecChar(ele,e){
    var eId = ele.id;
    var curValue = document.getElementById(eId).value;
    if(e.keyCode==220){
		var updatedCurValue=curValue.replace(/[\\]/g,'');
		document.getElementById(eId).value=updatedCurValue;
		document.getElementById(eId).focus();
		return false;
  	}
}

function setPzText(ele, numLines){
	var lineValue = ele.value;
	var eId = ele.id;
	var attrId = eId.substring(4,eId.indexOf('_'));	
	var lineId = eId.substring(eId.indexOf('_')+1);	
	var line = document.getElementById('pzAttr_'+attrId);
	line.value = "";
	if (numLines > 1) {
		for (var i=1; i<=numLines; i++) {
			var curValue = document.getElementById('line'+attrId+'_'+i).value;
			if (curValue == null || curValue.length <= 0 || curValue == "null"){
				continue;
			}
			if (i == 1) {
				line.value = curValue;
			} else {
				line.value += '\\\\n' + curValue;
			}			
		}
		
	} else {
		if (ele.value != null && ele.value != "" && ele.value != "null") {
			line.value = ele.value;
		} else {
			line.value = "";
		}
	}
	if (line.value == "null" || line.value == null)	{
		line.value = "";
	}

	updatePzPrice(document.getElementById('itemKey').value);
}

function updatePzPrice(itemKey){
	var actionName = '/pzUpdatePrice';
	document.getElementById('pzForm').action = actionName;
	$('#pzForm').append(getAjaxDateElement());
	$.ajax({
		type: "post",
		cache: false,
		url: actionName,
		data: $('#pzForm').serialize(),
		cache: false,
		success: function(data){
			
			if (data.indexOf('pcs-error-messages') < 0) {	
				eval("var jsonResult = " + data);
				var price = jsonResult.price;	
				var priceDiv = document.getElementById("price");
				if(priceDiv){
					priceDiv.innerHTML = price.total;		   				
				}
				var priceDiv2 = document.getElementById("priceTotal");
				if(priceDiv2){
					priceDiv2.innerHTML = price.total;		   				
				}
				var pzPrice = document.getElementById("pzPrice");
				if(pzPrice){
					pzPrice.innerHTML = price.pzAddlCharge;		   				
				}
				var itemPrice = document.getElementById("itemPrice");
				if(itemPrice){
					itemPrice.innerHTML = price.itemPrice;		   				
				}
			}
		},
		error: function(xhr, ajaxOptions, thrownError){
			if(xhr.readyState == 0 || xhr.status == 0) {
				return;  // it's not really an error This happens due to Response already commited 
			}
			alert("System Experienced a Failure !");
		}
	});
}
	
function checkFileStatus() {
	var foundErr = false;
	var iFiles = document.getElementsByName('pickF');
	
	if (iFiles != null && iFiles.length > 0) {
		for (var i=0; i<iFiles.length; i++) {
			if (iFiles[i].value == "true") {
				var fId =(iFiles[i].id);
				var id = fId.substring(fId.lastIndexOf('_')+1);
				
				if (document.getElementById('pzAttr_' + id) && 
						(document.getElementById('pzAttr_' + id).value == null ||
								document.getElementById('pzAttr_' + id).value == "")) {
					foundErr = true;
				}
			}
		}
	}
	return foundErr;
}

function checkMinQty(){
	if (document.getElementById('minQty') && document.getElementById('itemQty') && (parseInt(document.getElementById('minQty').value) > parseInt(document.getElementById('itemQty').value))) {
		document.getElementById('itemQty').value = document.getElementById('minQty').value;	
	} 
}

function checkPzQty(itemKey) {
	if (document.getElementById('minPzQty') && document.getElementById('qty') && (parseInt(document.getElementById('minPzQty').value) > parseInt(document.getElementById('qty').value))) {
		var min = document.getElementById('minPzQty').value;
		document.getElementById('qty').value = document.getElementById('minPzQty').value;	
	} 
	if (parseInt(document.getElementById('qty').value) >= parseInt(document.getElementById('minPzQty').value) ) {
		updatePzPrice(itemKey);
		document.getElementById('warning').innerHTML = "";
	}
}

function pzUpdateAttrQty(itemKey, key, size) {
	var currId = "attrQty_" + key;
	var sumOfQty = 0;
	for (var i=1; i <= size; i++) {
		var tmpId = currId + "_" + i;
		if (document.getElementById(tmpId).value != "" && document.getElementById(tmpId).value != "null" ) {
			sumOfQty += parseInt(document.getElementById(tmpId).value);
		} else {
			document.getElementById(tmpId).value = 0;
		}
	}
	if (document.getElementById('qty')) {
		document.getElementById('qty').value = sumOfQty;
	}
	if (document.getElementById('tqty')) {
		document.getElementById('tqty').innerHTML = sumOfQty;
	}
	//checkPzQty(itemKey);
	if (sumOfQty > 0) {
		updatePzPrice(itemKey);
	}
}
	
function checkSels() {
	var mqty = document.getElementById('minPzQty').value;
	var qty = document.getElementById('qty').value;		
	var flag = true;
	var totalQty = 0;
	var warning = '';
	var gotValue = '';
	
	$('#pzForm input, #pzForm select').each(function(inp) {			
		var ins = $(this);
		var name = ins.attr('name');
		var id = ins.attr('id');
		if (name && name.indexOf("pzAttr_") >= 0) {
			if (id && id.indexOf("pzAttr_") >= 0 && flag) {
				if (ins.val() != null && ins.val() != '' && ins.val() != "null") {
					gotValue = ins.val();
				} 					
			} else if (id && id.indexOf("attrQty_") >= 0 && parseInt( ins.val()) > 0) {
				totalQty += parseInt( ins.val());
			} 
		}
	});
	if (totalQty == 0 ) {
		totalQty = parseInt(qty);
	} else if (totalQty > 0 && parseInt(qty) == 0) {
		qty = totalQty;
		document.getElementById('warning').innerHTML = "";
	}
	if (parseInt(mqty) > parseInt(qty) ) {
		warning = "The quantity of the order must meet the minimum quantity requirement. ";		
		flag = false;
		document.getElementById('first').value = "0";
	} else if (gotValue == '' && document.getElementById('first').value == "0") {
		warning = "You are adding a customizable item to your shopping cart WITHOUT customization.  Click 'add to cart' to proceed.";
		document.getElementById('first').value = "1";
		flag = false;	
	} else if (gotValue == '' && document.getElementById('first').value == "1") { //}(gotValue == '' && $('first').value == "1") {
		flag = true;
	}
	if (warning != '') {
		document.getElementById('warning').innerHTML = warning;
	}
	return flag; 
}
	
$(document).on('click', '#calculateBtn', function() {
	var obj = new Object();
	obj.url = $("#calculateProductShippingForm").attr('action');
	obj.data = $("#calculateProductShippingForm").serialize();
	obj.successFunction = "calculateProductShippingSuccessFun";
	obj.errorFunction = "calculateProductShippingErrorFun";
	createAjaxCall(obj, true);
	return false;
});
	
   
   
function voteOnProductReview(productReviewKey, grade) {
	var url = '/productReviewVote?productReviewKey=' + productReviewKey + '&grade=' + grade;
	$.ajax({
		type: "GET",
		url: "/productReviewVote",
		cache: false,
		data: "productReviewKey=" + productReviewKey + "&grade=" + grade + "&ajaxDate=" + getAjaxDate(),
		success: function(data){
			$('#answerVotesText_' + productReviewKey).html('Thank you for your response. It will be posted shortly.');
			$('#answerVotesYes_' + productReviewKey).attr("onClick","alreadyVoted()");
			$('#answerVotesNo_' + productReviewKey).attr("onClick","alreadyVoted()");
			$('#answerVotesYes_' + productReviewKey).css("cursor","default");
			$('#answerVotesNo_' + productReviewKey).css("cursor","default");
		}
	});
}

function alreadyVoted() {
   alert("Already Voted..");
   return false;
}
   
function onSellerListingTabClick(url){
	var obj = new Object();
	obj.url = url;
	obj.successFunction= "onSellerListingTabClickSuccessFunc";
	createAjaxCall(obj);
}

function onSellerListingTabClickSuccessFunc(data) {
	var element = document.getElementById('sellersContainer');
	$(element).html(data);
}


function addOnSlider() {	
	if ($('#details_mp').length > 0) {
		$('#details_mp').fadeIn(1500, function () {
			sliderStuff()
		});
	}
	else {
		sliderStuff()
	}
}

function sliderStuff() {	
	var cart_mpHt = $("div.cart_mp").height();
	var cart_mpBot = $("div.cart_mp").offset();
	cart_mpBot = cart_mpBot.top;
	cart_mpBot= cart_mpBot + cart_mpHt;
	
	var slider = $("#popularAddOnsSlider").offset();
	slider =slider.top;
	  
	if (slider > cart_mpBot) {
	    var slide = 4;
	    $("#popularAddOnsSlider").addClass("slide-4");
	}
	  
	else {
	    var slide = 3;
	    $("#popularAddOnsSlider").addClass("slide-3");
	}
	//Add-ons slider - product detail page
	$("#popularAddOnsSlider .jcarousel-container").fadeIn("fast");
	$('#popularAddOnsSlider ul#addOnSlider').jcarousel({
	  //wrap: 'circular',
	  scroll: slide
	});
	  
	// if items shown are 3 or less, do not show arrows
	if ($("#popularAddOnsSlider ul#addOnSlider li").length < (slide + 1)) {
		$("#popularAddOnsSlider .jcarousel-next, #popularAddOnsSlider .jcarousel-prev").css("display", "none");
	}
}

function popupVideo(itemKey, videoId){
	var obj = new Object();
	obj.url = "/productVideo";
	params = "itemKey=" + itemKey + "&prodImageKey=" + videoId;
	obj.data = params;
	obj.successFunction= "popupVideoSuccessFun";
	obj.errorFunction="doNothingFun";
	createAjaxCall(obj);	
}

function popupVideoSuccessFun(data){	
	$('body').append('<div id="emailVid_pop" class="popUpWin"></div>');
	$('body').append('<div id="mask"></div>');
	$("#mask").fadeIn("fast", function(){ 
		$('#emailVid_pop').html(data).fadeIn("fast");
		windowPlacement("#emailVid_pop",topPos);
	})
}

// warranty list under "Add TO Cart" button in PD page.
$(document).on("change",'div.cart_mp div.extra div.warranty_sec div.warrantyOpts .warrChkBox', function(e) {   
	   var id = $(this).attr('id');
	   if ($('#'+id).is(':checked')) {
		   if ($(this).hasClass("disabled")) {
			   $(this).removeClass("disabled");
		   }
		   if (id.indexOf("warranty_AddCart_") >= 0) {
			   var tmp = id.split('_');
			   var itemkey = tmp[2];
			   $('#warranty_selection').val(itemkey);
			   $('div.extra div.warranty_sec .warrantyOpts div input').each(function(index){
				   var inputId = $(this).attr('id');				   
				   if (inputId.indexOf("warranty_AddCart_") >= 0) {
					   if (inputId == id) {
						   $('#warranty_selection').val(itemkey);
						   $(this).attr('checked', true);					   
					   } else {
						   $(this).attr('checked',false);
						   $(this).addClass('disabled');
					   }
					}
			});
		   }
	   } else {
		   $("div.extra div.warranty_sec div.warrantyOpts .warrChkBox").not(this).removeClass('disabled');
		   $('#warranty_selection').val('');
	   }
});


// Filter drop down boxes pic grid and cat search page
$(document).on("click", "div.selectBox span", function(event) {
	event.preventDefault();
	var filter = $(this).parent().siblings('ul');
	if(filter.css('display') == "none") {
		$("div.selectBox ul").css('display','none');
		filter.slideDown(100)
	}
		else {
			filter.slideUp(100);
		}
});