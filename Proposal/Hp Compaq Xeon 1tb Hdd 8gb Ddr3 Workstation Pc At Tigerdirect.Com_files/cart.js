$(document).on("keyup",".qty_update , .lengthCut ", function(e) {
	var tdClass  = $(this).attr("itemDisplay");
	var vendorKey = $(this).attr("vendorKey");
	
	if( ($(this).val() == "") || ($(this).val() == $(this).attr("origVal")) ){
		$('td.'+tdClass+'_'+vendorKey).find('div.updDiv').hide();
	}else{
		$('td.'+tdClass+'_'+vendorKey).find('div.updDiv').show();
	} 		
});
		
  // *** save item for later ***
  $(document).on('click','.keeplater', function(event) {		
		var keys = $(this).attr('id').split('_');
		var itemKey = keys[0];
		
		var olc = keys[1];
		
		if (itemKey > 0 && olc > 0) {
			saveItemForLater(itemKey, olc);
		}
	});
  function saveItemForLater(itemKey, itemLineNumber){
	$.ajax({
		type:"post",
		url:'/saveItemForLater', 
		cache: false,
		data: { 
				'itemKey':itemKey,
				'itemLineNumber':itemLineNumber, 
				'ajaxDate':getAjaxDate()
		},
		success: function(data)
		{ 
			if (data.indexOf('pcs-error-messages') < 0) {
   				window.location.href = '/viewCart';
		
			} else {
				// an error occurred
			}
		}
	});
  }

  // *** delete from cart ***
  //$(document).on('click', '.delete', function(event) {
  $(document).on('click', '[id^="savedDelete_"]', function(event) {
	  	event.preventDefault();
		event.stopPropagation();
		var tmp = $(this).attr('id');
		if (tmp && tmp.indexOf('savedDelete_') >= 0 ) {
			var item_id = $(this).attr('id').replace('savedDelete_','');
			var curFormId = 'addSavedItemForLaterToCart_' + item_id;			
			var itemId = null;	
			if ($('#itemId_'+item_id).val()) {
				itemId = $('#itemId_'+item_id).val();
			}			
			var itemKey = $('#item_'+item_id).val();
			if (!itemKey){
				itemKey = item_id.substr(0,8);
			}
			//in case item id is null then here itemId will be using here as orderlineno 
			// for save later area
			if(itemId == null){
				itemId = $(this).attr('id').replace('savedDelete_'+itemKey+'_','');
				}
			if (itemKey > 0 ) {
				var obj = new Object();
				obj.url= "/removeItemForLater";
				obj.data= "itemKey=" + itemKey;
				if (itemId && itemId > 0) {
					obj.data= "itemKey=" + itemKey + "&itemId=" + itemId;
				}
				obj.successFunction= "cartDisplay"; 
				obj.errorFunction = "cartError";
				createAjaxCall_Post(obj);
			}		
		}
  });
  
  $(document).on('click', '[id^="cartDelete_"]', function(event) {
		event.preventDefault();
		event.stopPropagation();
		var tmp = $(this).attr('id');
	
		if (tmp && tmp.indexOf('cartDelete_') >= 0 ) {	
			var item_id = $(this).attr('id').replace('cartDelete_','');
			if (item_id > 0) {
				var obj = new Object();
				obj.url= "/removeFromFloatingCart";
				obj.data= "i=" + item_id;
				obj.successFunction= "updateCartSuccessFun";
				obj.errorFunction = "cartError";
				createAjaxCall(obj, true);
			}
		}
	}); 
			
	$(document).on('click', '[id^="floatingCartDelete_"]', function(event) {
		event.preventDefault();
		event.stopPropagation();
		var tmp = $(this).attr('id');
		if (tmp && tmp.indexOf('floatingCartDelete_') >= 0 ) {			
			var item_id = $(this).attr('id').replace('floatingCartDelete_','');
			if (item_id > 0) {
				var obj = new Object();
				obj.url= "/removeFromFloatingCart";
				obj.data= "i=" + item_id;
				obj.successFunction= "updateFloatingCart";
				obj.errorFunction = "updateFloatingCartError";
				createAjaxCall(obj);
			}
		}
  });
	
  
  // *** add to cart from saved item area ***
  // ******This is used by PicGroup Page and ProdList Component **********
  //.addtocart and .customize is coming from picgrid page
  $(document).on('click', '.addtocart, .add, .customize, .mainClearanceCont .addcart_medsm.clearance ', function (event) {
	//from QuickView Cutomize
	if($(this).attr('id') == 'quickvwCustomize' || $(this).attr('id') == 'recentlyVw' ){
	}else{
	  	event.preventDefault();
		event.stopPropagation();
		clickPos = $(window).scrollTop();
		
		if ($(this).attr("rel") == "pg") {
			if($(this).attr("class") == "btn customize"){
				gaEvent('Cart', 'Add', 'Picture Group Row', 0);
				window.location.href = $(this).attr("href");
			}else{
				addItemToCartFromPGRow($(this).attr("itemKey"), true);
				var itemKey = $(this).attr("itemKey");
				if( $('#quantityList_disp_'+itemKey).val() > 0){
					$('#pgCheckout').show();
					$('#pgGridCheckout').show();
  				}else{
					$('#pgCheckout').hide();
					$('#pgGridCheckout').hide();
				}
				return false;
			}
		} 
		
		if ($(this).attr("rel") == "pg_customize") {
			addItemToCartFromPGRow($(this).attr("itemKey"), true);
			return false;
		}
		
		if ($(this).attr("rel") == "quickview") {
			addItemToCartFromQuickView($(this).attr("itemKey"));
			return false;
		}
		
		if ($(this).attr("rel") == "prodlist" || $(this).attr("rel") == "prodlistcart" || $(this).attr("rel") == "accessories" || $(this).attr("rel") == "savdfrLtr" || $(this).attr("rel") == "suggestedItemPopup") {
			var itemKey = $(this).attr("itemkey");
			var qty = $('#qty_'+itemKey);
			var fc = $(this).attr("fc");
			var minQty = 1;

			if (fc == 'yes') {
				if( $(this).attr("rel") == "prodlistcart" ) {
					//(itemKey, qty, customize, fc, uom, updateFcMarkup)
					if ($("#itemadded_"+itemKey).length > 0) {
						$("#itemadded_"+itemKey).hide();
					}
					addItemToShoppingCart(itemKey, qty.val(), false , true , false, true);
				} 
				else if ($(this).attr("rel") == "accessories") {
					//not using the arguments uom, updateFcMarkup hence passing empty string
					addItemToShoppingCart(itemKey, qty.val(), false , true,"","",'Y');
				}
				else if ($(this).attr("rel") == "prodlist" && $(this).attr("addonsFrmProductPg") == "true") {
					addItemToShoppingCart(itemKey, qty.val(), false , true);
				} 
				else if($(this).attr("rel") == "prodlist"){
					addItemToShoppingCart(itemKey, qty.val(), false , true , null, null, null,null,null,true);
				}
				else if($(this).attr("rel") == "suggestedItemPopup"){
					addItemToShoppingCart(itemKey, 1, false , true);
				}
				else if ($(this).attr("rel") == "savdfrLtr") {
					var savedItemId = $(this).attr('id');
					var selectedConfigKey = $(this).attr('configKey');
					var qty = $(this).attr('qty');
					var qty = 1;
					if($(this).attr('qty') > 0){
						qty = $(this).attr('qty');
					}
					var configItemKey = $(this).attr('configItemKey');
					var personalization = false;
					if($(this).attr('pz') == 'true'){
						//this variable will be true only in case of PZ item
						personalization = true;
					}

					addItemToShoppingCart(itemKey, qty, personalization , true , null, null, null,null,null,configItemKey,true,savedItemId,selectedConfigKey);
				} else {
					addItemToShoppingCart(itemKey, qty.val(), false , true );
				
				}
			} else {
				addItemToShoppingCart(itemKey, qty.val(), false , false );
			}
			
			return false;
		}
		
		var tmp = $(this).attr('id');
		if (tmp && tmp.indexOf('savedAdd_') >= 0) {
			var key = tmp.replace('savedAdd_','');
			var curFormId = 'addSavedItemForLaterToCart_' + key;
			
			var pz = null;
			var itemId = null;			
			if ($('#pz_'+key).val()) {
				pz = $('#pz_'+key).val();				
			}
			if ($('#itemId_'+key).val()) {
				itemId = $('#itemId_'+key).val();
			}
			var itemKey = $('#item_'+key).val();
			
			if (itemId && itemId > 0) {
				$.ajax({
					type: "post",
					cache: false,
					url: "/removeItemForLater",
					data: { 
						'itemKey':itemKey,
						'itemId':itemId,
						'ajaxDate':getAjaxDate()
						
					},
					success: function(data){
						refreshPage();
					},
					error: function(xhr, ajaxOptions, thrownError){
						if(xhr.readyState == 0 || xhr.status == 0) {
							return;  // it's not really an error This happens due to Response already commited 
						}
						//alert("System Experienced a Failure !");
						showBBoxMessage(we_are_sorry_title, we.are.sorry.text + ' <p style="display:none"> $(document).on(click, .addtocart, .add, .customize , function (event) /removeItemForLater: ' + itemKey + ',' + itemId + '</p>')
					}
				});
			} else {
				$.ajax({
					type: "post",
					cache: false,
					url: "/removeItemForLater", 
					data: { 
						'itemKey'    :itemKey,
						'ajaxDate'   :getAjaxDate()
					},
				
					success: function(data){
						refreshPage();
					},
					error: function(xhr, ajaxOptions, thrownError){
						if(xhr.readyState == 0 || xhr.status == 0) {
							return;  // it's not really an error This happens due to Response already commited 
						}
						//alert("System Experienced a Failure !");
						showBBoxMessage(we_are_sorry_title, we.are.sorry.text + ' <p style="display:none">$(document).on(click, .addtocart, .add, .customize , function (event) /removeItemForLater: ' + itemKey + '</p>')
					}
				});
			}
		} else if (tmp && tmp.indexOf('cartProdDetail') >= 0) {
			gaEvent('Cart', 'Add', 'Product Details', 0);
		}
	}
  }); 
  
function refreshPage(){
	 window.location.reload(); 
}
  
function addItemSavedForLaterToCartTemp(id){	  
	$('#addSavedItemForLaterToCart_' + id).action = '/addToCart';
	$('#addSavedItemForLaterToCart_' + id).serialize();
	$('#addSavedItemForLaterToCart_' + id).submit();	  
}
  
function addRemoveItemsSavedForLater(obj){
	var tmp = obj.getAttribute('itemId');
	  if (tmp && tmp.indexOf('savedAdd_') >= 0) {
		  var key = tmp.replace('savedAdd_','');
		  var curFormId = 'addSavedItemForLaterToCart_' + key;
		  
		  var pz = null;
		  var itemId = null;			
		  if ($('#pz_'+key).val()) {
			  pz = $('#pz_'+key).val();				
		  }
		  if ($('#itemId_'+key).val()) {
			  itemId = $('#itemId_'+key).val();
		  }
		  var itemKey = $('#item_'+key).val();
		  //in case item id is null then here itemId will be using here as orderlineno 
		  // for save later area
		  if(itemId == null){
			  itemId = tmp.replace('savedAdd_'+itemKey+'_','');
		  }
		  if (itemId && itemId > 0) {
			  $.ajax({
				  type: "post",
				  cache: false,
				  url: "/removeItemForLater",
				  data: { 
					  'itemKey':itemKey,
					  'itemId':itemId,
					  'ajaxDate':getAjaxDate()
					  
				  },
				  success: function(data){
					  refreshPage();						
			  },
				  error: function(xhr, ajaxOptions, thrownError){
					  if(xhr.readyState == 0 || xhr.status == 0) {
						  return;  // it's not really an error This happens due to Response already commited 
					  }
					  //alert("System Experienced a Failure !");
					  showBBoxMessage(we_are_sorry_title, we.are.sorry.text + ' <p style="display:none"> addRemoveItemsSavedForLater /removeItemForLater: ' + itemKey + ',' + itemId + '</p>')
				  }
			  });
		  } else {
			  $.ajax({
				  type: "post",
				  cache: false,
				  url: "/removeItemForLater", 
				  data: { 
					  'itemKey'    :itemKey,
					  'ajaxDate'   :getAjaxDate()
				  },
				  success: function(data){
					  refreshPage();
				  },
				  error: function(xhr, ajaxOptions, thrownError){
					  if(xhr.readyState == 0 || xhr.status == 0) {
						  return;  // it's not really an error This happens due to Response already commited 
					  }
					  //alert("System Experienced a Failure !");
					  showBBoxMessage(we_are_sorry_title, we.are.sorry.text + ' <p style="display:none"> addRemoveItemsSavedForLater /removeItemForLater: ' + itemKey +  '</p>')
				  }
			  });
		  }
	  } 
}
  
  
function cartDisplay() {
	window.location.href = '/viewCart';
}

function cartError(data) {
	//alert("cartError: " + data);
	showBBoxMessage(we_are_sorry_title, we.are.sorry.text + ' <p style="display:none">cartError: ' + data +  '</p>')
}

function createAjaxCall_Post(obj){
	createAjaxCallPost(obj);
}
  
// *** add add-on item into the cart. *** 
// ******** This method is also being invoked from PicGroup Page...*****************
$(document).on('click', '.addtocart_items', function(event) {
	var topPos = $(window).scrollTop();
	if( $(this).attr("rel") == "pg") {
		var fc = $(this).attr("fc");
		addItemsToCartFromPicGroupAddons(fc);
		return false;
	}
	
	if ($(this).attr('id') == 'addonSubmit') {
		var aform = document.createElement("form");
		document.body.appendChild(aform);
		aform.action = $(this).attr('href');
		aform.method = "post";
		
		var numOfItems = 0;
		$('.addons ul.prod li div.btns, .addonsCartSlider ul.prod li div.btns').each(function() {
			$(this).children(':input').each(function() {
				var inputId = $(this).attr('id');
				if (inputId.indexOf('qty_') == 0) {					  
					var qty = $(this).attr('value');					  
					if (qty && qty > 0) {					
						var itemKey = inputId.replace('qty_','');					 	  
						numOfItems = numOfItems = + 1;
						var itemKeyField = document.createElement("input");						  
						itemKeyField.setAttribute("type", "hidden");
						itemKeyField.setAttribute("name", "item");
						itemKeyField.setAttribute("value", itemKey);
						aform.appendChild(itemKeyField); 
						var qtyField = document.createElement("input");
						qtyField.setAttribute("type", "hidden");
						qtyField.setAttribute("name", "qty");
						qtyField.setAttribute("value", qty);
						aform.appendChild(qtyField);
					}
				}
			});
		});
		if (numOfItems > 0) {
			aform.submit();			  
		}
	}
	
	if($(this).attr('id') == 'addProductsOrdersToCart'){  
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
				  
			  var qtyField = document.createElement("input");
			  qtyField.setAttribute("type", "hidden");
			  qtyField.setAttribute("name", "qty");
			  qtyField.setAttribute("value", "1");
			  $(cartForm).append(qtyField);
			}
	  });
	  
	  if (numChecked == 0) {
		  showWindow("#alertShopCartWarningPop",topPos);
		} else {
		  cartForm.submit();
		}
	}
	return false;
});
  
  // *** add warranty to cart ***
  $(document).on('click','.warrantyBtn', function(event) {	
		var keys = $(this).attr('id');
		if (keys.indexOf("warranty_") >= 0) {
			var len = keys.indexOf('_');
			var key = keys.substring(len + 1);
			if (document.getElementById('selectedWarranty')) {
				document.getElementById('selectedWarranty').value = key;
			}
					
			if($("#warranty_selection").length > 0) {
				$("#warranty_selection").val(key);
			}
		  } 
		  else if ($(this).attr('origin') == "Add_To_Cart"){
				 warrantyAddPlansCart();				 
		  }
  });
	
$(document).on('click', '#addWarrantyBtn', function(event) {
	if ($(this).attr("origin") == "Add_Product_Details") {
		if ($("#warranty_selection").val() == ""){
			$("#warranty_selection").val($(this).attr("itemKey"));
		}

		addItemToShoppingCart($('#itemKey_Main').val(), $('#itemQty').val(), false, false);
		return false;
		
	} else if ($(this).attr("origin") == "Add_To_Cart") {
		  warrantyAddPlansCart();
	} else if ($(this).attr("origin") == "Checkout_Cart_Warr_Add") {
		warrantyAddPlans('checkout','2');
	} else {
		warrantyAddPlans('cart','2');
	}
});
  
function warrantyNoThanks(action){
	var cartForm = document.getElementById('cartUpdateForm');
	if(!cartForm){
		window.location.href = "/viewCart";
		return;
	}
	
	if(action == "cart"){
		hideBBox();
	}
	else if(action == "paypal"){
		cartForm.action='/updateCart';
		document.getElementById('scNextAction').value = 'checkoutPayPal';
		cartForm.submit();
	}
	else if(action == "checkout"){
		cartForm.action='/updateCart';
		document.getElementById('scNextAction').value = 'checkout';
		cartForm.submit();
	}
	else if(action == "checkoutMember"){
		cartForm.action='/updateCart';
		document.getElementById('scNextAction').value = 'checkoutMember';
		cartForm.submit();
	}
}

function warrantyAddPlans(action,checkoutVersion){	
	$('warrantyButtonsEnabled').hide();
	$('warrantyButtonsDisabled').show();
	$.ajax({
		type: "get",
		url: '/warrantySave?ajaxDate='+getAjaxDate(), 
		cache: false,
		data: $("#warrantyForm").serialize(),
		success: function(data){
			if (data.indexOf('pcs-error-messages') < 0) {
				//warrantyAddPlansAfterSubmit(action, checkoutVersion);	
				if(action == "checkout"){
					var aform = document.createElement("form");
					  document.body.appendChild(aform);
					  aform.action = "/updateCart";
					  aform.method = "post";
					  var itemKeyField = document.createElement("input");						  
					  itemKeyField.setAttribute("type", "hidden");
					  itemKeyField.setAttribute("name", "nextAction");
					  itemKeyField.setAttribute("value", action);
					  aform.appendChild(itemKeyField);
					  aform.submit();
				}else{
				window.location.href = "/updateCart";
				}
			} else {
				warrantyNoThanks(action);
			}
		},
		error: function(xhr, ajaxOptions, thrownError){
			if(xhr.readyState == 0 || xhr.status == 0) {
				return;  // it's not really an error This happens due to Response already commited 
			}
			warrantyNoThanks(action);
		}
	});  
}

/** called from addToCart.jsp. **/
function warrantyAddPlansCart() {
	var tmp = $('#newQty').text();
	var qty = 0;
	if (!isNaN(parseInt(tmp))) {
		qty = parseInt(tmp);
	}
	if (qty > 0){
		$('#added_qty').val(tmp);
		$.ajax({
			  type: "get",
			  url: '/warrantySave?ajaxDate='+getAjaxDate(),
			  cache: false,
			  data: $("#warrantyForm").serialize(),
			  success: function(data){
				  //
			  },
			  error: function(xhr, ajaxOptions, thrownError){
				  if(xhr.readyState == 0 || xhr.status == 0) {
					  return;  // it's not really an error This happens due to Response already commited 
				  }
			  }
		  });
	}
}

function warrantyAddPlansAfterSubmit(action, checkoutVersion){	
	var cartForm = document.getElementById('cartUpdateForm');
	if(!cartForm){
		if(action == "checkout"){
			if (checkoutVersion=="v2"){
				window.location.href = "/checkout/signin";
			} 
			else {
				window.location.href = "/checkout/guest";
			}
		}
		else if(action == "checkoutMember"){
			if (checkoutVersion=="v2"){
				window.location.href = "/checkout/signin";
			}
			else { 			
				window.location = "/checkout/member";
			}
		}
		else if(action == "cart"){
			window.location.href = "/checkout/view";
		}
		return;
	}
		
	cartForm.action='/updateCart';	
	if(action == "cart"){
		document.getElementById('scNextAction').value = '';
	}
	else if(action == "paypal"){
		document.getElementById('scNextAction').value = 'checkoutPayPal';
	}
	else if(action == "checkout"){
		document.getElementById('scNextAction').value = 'checkout';
	}
	else if(action == "checkoutMember"){
		document.getElementById('scNextAction').value = 'checkoutMember';
	}
	
	cartForm.submit();
}

function showWarrantyDescriptionOfCoverage(){
	document.getElementById("fadeBg").style.zIndex = 200;
	document.getElementById("bbox").style.display = "none";
	var warrantyPopup = document.getElementById('warrantyCoveragePopup');
	warrantyPopup.style.display = "";
	centerBBox('warrantyCoveragePopup');
}
	
function hideWarrantyDescriptionOfCoverage(){
	$('warrantyCoveragePopup').hide();
	document.getElementById("bbox").style.display = "";
	document.getElementById("fadeBg").style.zIndex = 10;	
  }

//for cart: warranty checkbox click
$(document).on("change",'#cartUpdateForm :checkbox', function(e) {
	 var id = $(this).attr('id');
	 if (id.indexOf("cartSelectedWarranty_") >= 0 ) {
		   var tmp = id.indexOf('_');
		   var idStr = id.substring(tmp+1);
		   var idTokens = id.split('_');
		   var olnStr = idTokens[1];
		   
		   if ($('#'+id).is(':checked')) { 
			   $(this).attr('disabled',false);
			   $('#warrantyCartList_'+olnStr+' div.warrantyOpts .warrChkBox').not(this).attr('checked', false);
			   $('#warrantyCartList_'+olnStr+' div.warrantyOpts .warrChkBox').not(this).attr('disabled',true);	  
			   $('#warrantyCartList_'+olnStr+'div.warrantyOpts div input').each(function(index){
					var inputId = $(this).attr('id');
					if (inputId.indexOf("cartSelectedWarranty_" + olnStr +"_") >= 0) {
						if (inputId == id) {
							$(this).attr('checked', true);
						} else {
							$(this).attr('checked',false);
							$(this).attr('disabled',true);
						}
					}
			  });
			   		      
			  if($('#warrantyForm').length <= 0) {
					$('body')
			        .append('<form id="warrantyForm" name="warrantyForm"></form>');
			  } 
			  $('#warrantyForm').empty();
		  	  var warrantySelected = $('#' +id).val();  //$('#cartSelectedWarranty_' + idstr).val(); 
		  	  
			  $('<input>').attr({
				type: 'hidden',
				id: 'selectedWarranty',
				name: 'warranties'
			  }).appendTo('#warrantyForm');
			  $('#selectedWarranty').val(warrantySelected);		
			  
			  var obj = new Object();
			  obj.url = '/warrantySave';			 
			  obj.data = $("#warrantyForm :input[value!='']").serialize() + '&location=fromDeskCart&ajaxDate='+getAjaxDate();			  
			  obj.successFunction = "updateCartSuccessFun";
			  obj.errorFunction = "cartError";
			  createAjaxCallPost(obj, true);
	   } 
	   else {
			 $("#warrantyCartList_"+olnStr+" div.warrantyOpts .warrChkBox").not(this).attr('disabled', false);
	   }
	 } 
});

function updateCart(){
	var obj = new Object();
	obj.url = '/viewCartJsonForCartPage?ajaxDate='+getAjaxDate();
	obj.successFunction = "updateCartSuccessFun";
	obj.errorFunction = "cartError";
	createAjaxCall(obj);
}

  
// *** cart calculate shipping ***
$(document).on("click", "a.shipping", function(event) {
	event.preventDefault();
	var myId = $(this).attr('id');
	$('#totalzip').hide();
	if (myId == 'cartCalShip') {
		$.ajax({
			url: '/calculateShippingPage?ajaxDate='+getAjaxDate(), 
			cache: false,
			success: function(returnData) {
				$("#enterzip").html(returnData);
				$("#enterzip").css("display", "block");
			},
			error: function(xhr, ajaxOptions, thrownError){
				if(xhr.readyState == 0 || xhr.status == 0) {
					return;  // it's not really an error This happens due to Response already commited 
				}
				//alert("error in calculate shipping: " + e);
				showBBoxMessage(we_are_sorry_title, calc_shipping_msg + ' <p style="display:none">/calculateShippingPage: </p>')
			}
		});
	}		
});

function calculateShippingFromCart(){
	var obj = new Object();
	obj.url = $("#shipCalcCartForm").attr('action');
	obj.data = $("#shipCalcCartForm").serialize();
	obj.successFunction = "updateShippingPrice";
	obj.errorFunction = "calculateShippingErrorFun";
	createAjaxCall(obj);
	return false;
}

function getSelectedCountry(){
	var country = $(".cntry");
	var countryKey = 0;
	if(country.length == 1 && country[0].id == "countryKey") {
		countryKey = country[0].value;
	} 
	else {
		country = document.getElementById("countryKey");
		countryKey = country.options[country.selectedIndex].value;
	}
	return countryKey;
}

var shipDesc = "";
function getSelectedShippingMethod(){
	var countryKey = getSelectedCountry();
	var ship = document.getElementById("shipMet_"+countryKey);
	var shipSel = "";
	shipDesc = "";
	if (ship) {
		shipSel = $("#shipMetCsKey_"+countryKey).attr("value");
		shipDesc = document.getElementById("shipMet_"+countryKey).innerHTML;

	} 
	else {
		shipSel = $("#shippingMethods_"+countryKey+" option:selected").attr("value");
		var ar = document.getElementById("shippingMethods_"+countryKey);
		shipDesc = ar.options[ar.selectedIndex].text;
	}
	return shipSel;
}

$(document).on('click', '#calculateBtn_cart', function(event) {
	event.preventDefault();
	if (document.getElementById("shippingCostZip").value == "") {
	  $("#shippingCostZip").addClass("highlight");
	  $("div.error_sec").removeClass("hide");
  	} 
  	else {
	  $("#ajaxIndicator").show();
	  $(".disableMask").show();
	  $("#enterzip").hide();
	
	var zip = $("#shippingCostZip").attr('value');
	
	if (zip) {
		var shipSel = getSelectedShippingMethod();
		var countryKey = getSelectedCountry();
		
		$.ajax({
			url : '/calculateShipping',
			type: 'post',
			cache: false,
			data: { 
				  'zip'				    : zip,
				  'countryKey'	        : countryKey,
				  'carrierServiceKey'		: shipSel,
				  'ajaxDate'              : getAjaxDate()
						 
			 },
			success: function(returnData) {
				$("#ajaxIndicator").hide();
				$(".disableMask").hide();
			if (returnData.indexOf("validation-messages") > -1) {
					highLightFormField(returnData);
					$("#enterzip").show();
				} 
				
				else {
					
					document.getElementById("shipMethod").innerHTML = shipDesc;
					document.getElementById("shipCostZip").innerHTML = zip.toUpperCase();
					updateShippingPrice(returnData);
				}
			},
		  error: function(xhr, ajaxOptions, thrownError) {
			  if(xhr.readyState == 0 || xhr.status == 0) {
				  return;  // it's not really an error This happens due to Response already commited 
			  }
			  calculateShippingErrorFun(xhr.responseText);
		  }
		});
	}
  }
});
  
function updateShippingPrice(data) {
	if((data.indexOf('pcs-error-messages') < 0) && (data.indexOf('canada-postal-alert') < 0) && (data.indexOf('usa-postal-alert') < 0)){
		if (data.indexOf("{") > 0) {
			eval("var jsonStr = " + data);
			var shippingCostZipSection = document.getElementById("shippingCostZipSection");
			var shippingCostZip = document.getElementById("shippingCostZip");
			var zipToDisplay = jsonStr.zip;
			var shippingOnCartPage = document.getElementById("shippingOnCartPage");
			
			if(shippingOnCartPage){
				shippingOnCartPage.innerHTML = jsonStr.shippingText;
			}
		
			var totalOnCartPage = document.getElementById("totalOnCartPage");
		
			if(totalOnCartPage){
				totalOnCartPage.innerHTML = jsonStr.cartTotal;
			}
		
			var totalOnCartPageWithTax = document.getElementById("totalOnCartPageWithTax");
			if(totalOnCartPageWithTax){
				totalOnCartPageWithTax.innerHTML = jsonStr.cartTotalWithTax;
			}
		
			var shipMethod = jsonStr.shipMethod;
			if (shipMethod) {
				document.getElementById("shipMethod").innerHTML = shipMethod;
			}
			var calculationDetailsSection = document.getElementById("calculationDetailsSection");
			if(calculationDetailsSection){
				calculationDetailsSection.innerHTML = jsonStr.calculationDetails;
			}
			gaEvent('Shipping', 'Calculate', 'Shopping Cart', 0);
		
			if(jsonStr.showQuoteAlert){
				$('#calculateshippingpopupid').trigger( "click" );
			}
			
			$("span.enter").hide();
			$('#enterzip').hide();
			$("#totalzip").css("display", "block");
			$('ziploading').css("display", "none");
		} 
	} 

	else {
		// error
		$('#shippingCalcResult').hide();
		$('#calcShippingErrors').innerHTML = data;
		$('#calcShippingErrorsSection').show();	
	}
}
	
function calculateShippingErrorFun(data){
	//alert("error: " + data);
	$("#calcShippingErrors").html(data);
	$("#calcShippingErrorsSection").show();
}

function toggleShippingMethodList(countryKey){
	if(countryKey == 2){
		document.getElementById("shippingMethods").style.display = "none";
		document.getElementById("shippingMethodsCanada").style.display = "";
	}
	else {
		document.getElementById("shippingMethodsCanada").style.display = "none";
		document.getElementById("shippingMethods").style.display = "";
	}
}
  
function toggleShippingMethodList_New(countryKey){
  	$('.shippingMethods_New').each(function(){
		$(this).hide();
	});
	$('#divShippingMethods_'+countryKey).show();
}

function setShipMethodDesc(){
	var ship = $("#shipMet");
	var shipSel = "";
	
	if (ship) {
		shipSel = $("#shipMet").innerHTML;
	} else {
		var keySel = $("#shippingMethods option:selected").attr("value");
		shipSel = $('#'+keySel).innerHTML;
		var ar = document.getElementById("shippingMethods");
		var tmp = ar.options[ar.selectedIndex].text;
	}
	document.getElementById("shipMethod").innerHTML = shipSel;
}
  
function calculateShippingAjax(zip){
	if (zip != null && zip != '') {
		tempZipValue = zip;
		$('#shippingOnCartPage, #totalOnCartPage, #totalOnCartPageWithTax, #calculationDetailsSection, #shipMethod').text('');	
		$.ajax({
			url : '/calculateShippingAjax',
			type: 'get',
			cache: false,
			data: { 
				 'zip'				: zip,
				 'ajaxDate'           : getAjaxDate()					
			},		  	
		  success: function(returnData) {
				$("#ajaxIndicator").hide();
				$(".disableMask").hide();
				if (returnData.indexOf("validation-messages") > -1) {
					  if ($("#enterzip").length > 0) {
						  $("#enterzip")
								  .append(
										  "<div class='error_sec' origin='logIn'><div class='error_icon'></div><div class='error'><span id='reqFldHlt' style='display: none;'>Required fields are highlighted.</span><span id='customErrMsg' style='display: block;'></span></div></div>");
					  }
						highLightFormField(returnData);
						$("#enterzip").show();
				} 
				else {
					document.getElementById("shipCostZip").innerHTML = zip;
					updateShippingPrice(returnData);
				}
			},
			error: function(returnData) {
			  //calculateShippingErrorFun(returnData);
			}
		});
		}
	
}
  
// *** product rule key change ***/
var productRuleActionValuesInputBox
function onProdRuleActionChange(selectBox, tdClass) {	
	$('td.'+tdClass).find('div.updDiv').hide();	
	if (selectBox){	
		var id = selectBox.id;
		var productRuleActionKeysInputBox = document.getElementById('productRuleActionKeys_'+selectBox.id);
		productRuleActionValuesInputBox = document.getElementById('productRuleActionValues_'+selectBox.id);
		var tmpVal = selectBox[selectBox.selectedIndex].value;
		divProductRuleAction =  document.getElementById('divProductRuleAction_'+selectBox.id);
		var selectedProductRuleActionKey =  tmpVal;
		var actionResp = '';
		if (tmpVal.indexOf('_') > 0) {
			selectedProductRuleActionKey = tmpVal.substring(0, tmpVal.indexOf('_')); //selectBox[selectBox.selectedIndex].value;
			actionResp = tmpVal.substring(tmpVal.indexOf('_') + 1);
			divProductRuleAction.innerHTML = "<label>"+actionResp+":</label> <input id=\""+id+"\" type=\"text\" value=\"\" onkeyup=\"showHideUpdateLink(this.value,\'"+ tdClass + "\');\" onchange=\"getKeyCode(this.value,id);\" />";
		} else {
			divProductRuleAction.innerHTML = '';
			if (selectBox.selectedIndex > 0){
				$('td.'+tdClass).find('div.updDiv').show();
			}
		}		
		productRuleActionKeysInputBox.value = selectedProductRuleActionKey;
		productRuleActionValuesInputBox.value = '';
	}
  }
	
function getKeyCode(tvalue, id) {
	if(productRuleActionValuesInputBox == undefined){        
        productRuleActionValuesInputBox = document.getElementById('productRuleActionValues_'+id); 
	}
	productRuleActionValuesInputBox.value = tvalue;
	document.getElementById('productRuleActionValues_'+id).value = tvalue;
}

function showHideUpdateLink(tvalue,tdClass){
	tvalue = tvalue.trim();
	if(tvalue != "") {
		$('td.'+tdClass).find('div.updDiv').show(); 
	} else {
		$('td.'+tdClass).find('div.updDiv').hide();
	}
}
  
var applyingCartPromotion = false;
function applyCartDiscount() {
	if(applyingCartPromotion){
		return false;
	}
applyingCartPromotion = true;

	var discountCode = $("#discountCode").val();
	if(!discountCode || discountCode == null || discountCode == undefined || discountCode == '' || discountCode == 'key code'){
		applyingCartPromotion = false;
		return false;
	}

	var obj = new Object();
	obj.url = $("#applyCartDiscountForm").attr('action');
	obj.data = $("#applyCartDiscountForm").serialize();
	obj.successFunction = "applyCartDiscountSuccessFunc";
	createAjaxCall_Post(obj);
	return false;
}
  
function applyCartDiscountSuccessFunc(data){
	if (data.indexOf("validation-messages") > -1) {
		$("#cartApplyDiscountMsgDiv").html( data);
		applyingCartPromotion = false;
		setTimeout(function() {
			$("#cartApplyDiscountMsgDiv").fadeIn(250);
			$("#cartApplyDiscountMsgDiv").hide('blind', {}, 250);}, 3000);
	}
	else{
		eval("var jsonResult = " + data);
		$("#cartApplyDiscountMsgDiv").html( jsonResult.promoResultText);
		$("#cartApplyDiscountMsgDiv").fadeIn(250);
	}
}
  
 // from viewSavedCarts page
function deleteCartConfirm(cartKey){
  	document.getElementById('deleteCartId').value = cartKey;
}

function deleteCart(){
	$.ajax({
		type: "GET",
		url: "/deleteSavedCart",
		data: {			
		'cartId'   : document.getElementById('deleteCartId').value,
		'ajaxDate' : getAjaxDate()		
		},
	
		success: function(data){
			document.location.reload();
		},
		error: function(xhr, ajaxOptions, thrownError) {
			if(xhr.readyState == 0 || xhr.status == 0) {
				return;  // it's not really an error This happens due to Response already commited 
			}
		}
	  });
}
  
//customzie redirect url from search results and picgrid quickview  
function redirectUrlForCustomize(url){
  window.location.href = url;
}

function reloadCart(reload) {
	if (reload) {
		$("#populateCartFromQuote_reloadCart").val(reload)
	}
	$("#populateCartFromQuote").submit();
}
  
  
//this method is page specific. one in checkout-mobile
function maskedWalletSuccess(response) {
  var responseObj = response.response;
  document.getElementById('scNextAction').value = 'checkoutGoogleWallet';
  document.getElementById('requestForQuote').value = 'false';
  document.getElementById('gwMaskedResponse').value = JSON.stringify(responseObj);
  $("#cartUpdateForm").serialize();
  $("#cartUpdateForm").submit();
}