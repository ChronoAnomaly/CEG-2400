// handles all pop up boxes except for zoom and warranty pop up from Add to Cart
$(document).on("click", ".popUpWindowLink", function (event) {
	event.preventDefault();
	var topPos = $(window).scrollTop();
	getFileHref = $(this).attr("href");
	
	if (getFileHref == ""){
		return false;
	}
	
	// if attribute indicator="true" in link
	var showIndicator = $(this).attr("indicator");
	if (showIndicator == "true") {
		showIndicator = true
	}
	else {
		showIndicator = false
	}
	
	//get href of popups that are already on the page
	//no ajax calls
	if (getFileHref.indexOf("#") != -1) {
		getFile = getFileHref;
		showWindow(getFile,topPos);
	}
	
	else {
		//look for warranty file
		//warranty.jsp is being used as a pop up and in warranty tab
		//remove left column for pop up
		var findWarranty = getFileHref.indexOf("warranty");
		if (findWarranty != -1) {
			getFile = "warranty"
		}
		else {
			var getFile = $(this).attr("id"); //getFile is used to create a pop up window with a unique id
			// if "COMPARE" button is clicked from "Quick View" popup or email is clicked on compare pop up
			//close quick view or compare window
			if (getFile == "picGroupCompare" || getFile =="emailPop") {
				$("#quickViewButton_pop").remove();
				$("#picGroupCompare_pop").remove();
				$("#searchCompare_pop").remove();
				if( $("#prevView_pop").length > 0) {
					$("#prevView_pop").remove();
				}
				if( $("#nextView_pop").length > 0) {
					$("#nextView_pop").remove();
				}
				
			}
			
			if (getFile == "prevView" || getFile =="nextView") {
				$("#quickViewButton_pop").remove();
			}
		}
		createWindow(getFile,getFileHref,topPos,showIndicator);
	}
});
	
// function for content already on page
function showWindow (getFile,topPos) {
	if ( $("#mask").length == 0) {
		$('body').append('<div id="mask"></div>'); 
	}
	$("#mask").fadeIn(50, function(){ 
		$(getFile).fadeIn(50);
		// window placement
		windowPlacement(getFile,topPos);
		// window placement
	});
}

// function to get file via ajax call
function createWindow(getFile,getFileHref,topPos,showIndicator) {
	var fileId = "#" + getFile + "_pop";
	$('body').append('<div id="' + getFile + '_pop" class="popUpWin"></div>');
	
	// if #mask already exists - do not create another one
	if ( $("#mask").length == 0) {
		$('body').append('<div id="mask"></div>'); 
	}
	
	$('#mask').fadeIn(20, function(){ 
	
	if (showIndicator) {
		displayProgressBar();
	}
		//ajax call
	 	$.ajax({url:getFileHref,
		        data: { 
					'ajaxDate': getAjaxDate()				   
		         },
	 		cache: false,
			success: function(returnData) {
				if (returnData.indexOf("In Login Page") > -1) {
					//$('#mask').css("opacity", 0);
					$('#mask').remove();
					window.location.href="/account/promptLogin";
				} 
				
				else {
					$("#progressbar_pop").remove();
					$(fileId).html(returnData);
	
					// window placement
					windowPlacement(fileId,topPos);
				
					if (getFile == "warranty") {
						$("#" + getFile + "_pop div.leftWarranty").remove();
					}
				}
			},
			error: function(e) {
				$('#mask').remove();
				$('.popUpWin').remove();
				
				if(getFileHref.indexOf('/checkout/') != -1){
					window.location.href = "/account/promptLogin?redirectUrl=/viewCart";//window.location.pathname
				} else if(getFileHref.indexOf('/account/') != -1){
					window.location.href = "/account/promptLogin?redirectUrl="+window.location.pathname;//window.location.pathname
				}
			}
		});
	});
}


function windowPlacement(theFile,topPos) {
	var popWidth = $(theFile).width();
	var popHt = $(theFile).height();
	var popLeftPos = (screenWidth - popWidth) / 2;
	var popTopPos = (winHeight - popHt) / 2;
	var theFileBtm =  popHt + popTopPos;
		
	if (popTopPos <= 2) {
		popTopPos = 2;
	}
	
	if (theFile == "#shopLists_pop") {
		popTopPos = 10;
	}
	
	//find out the bottom of the pop up
	// deterime if is below the window bottom
	// if below the window bottom set position to absolute
	if (theFileBtm > winHeight) {
		winPos = "absolute";
		$(window).scrollTop(0);
	}
	
	else {
		winPos = "fixed";
	}
	
	// window placement
	$(theFile).css({"left":popLeftPos,"top":popTopPos,"position":winPos});
	$(theFile).draggable({ cancel: ".body, #imgContainer" , scroll:true});
	// window placement
}

//close pop up window
$(document).on("click", "a.closeBtn,.popUpExist span#no, .cancel, .nothanks", function (event) {
	var attr = $(this).attr('allowDefault');
	if (typeof attr == typeof undefined || attr == false) {
		event.preventDefault();
	} 

 	// if another window is open and under the mask
	if ($('#do-not-close').length) {	
		if ($(this).attr('id') != 'do-not-close') {
			if ($(this).parents('div.popUpExist').attr('id') != undefined) {
				var $closeWin = $(this).parents('div.popUpExist').attr('id')
			}
			
			if ($(this).parents('div.popUpWin').attr('id') != undefined) {
				var $closeWin = $(this).parents('div.popUpWin').attr('id')
			}
			
			if ($('#' + $closeWin).hasClass('popUpWin')) {
				$('#' + $closeWin).remove();
			}
			
			if ($('#' + $closeWin).hasClass('popUpExist')) {
				$('#' + $closeWin).removeAttr("style");
			}
		}
		
			// after above window is closed - other open win comes above mask
			if ($('#do-not-close').parents('div.popUpExist').attr('id') != undefined) {
				var unMaskWin = $('#do-not-close').parents('div.popUpExist').attr('id')
			}
			if ($('#do-not-close').parents('div.popUpWin').attr('id') != undefined) {
				var unMaskWin = $('#do-not-close').parents('div.popUpExist').attr('id')
			}
			
			$('#' + unMaskWin).css('z-index', 50000);
			$('#' + unMaskWin + ' a.closeBtn').removeAttr('id');
	}
	
	else {
		$('.popUpExist,.popUpWin').fadeOut('fast', function() {
			$('#mask').remove();
	 		$('.popUpExist').removeAttr("style");
	  		$('.popUpWin').remove();
		})
	}
  
  	// will see about this later - ajax pop ups - get removed not hidden
  	 // if($(this).attr('id') == "editAddress_pop") {

})


// close warning pop up.
$(document).on("click", ".closeBtnWarning a", function (event) {
	event.preventDefault();
	$(".warning").hide();
	$(".warning").removeAttr("style");
	if ($("#shopLists_pop").length > 0) {
		$("#shopLists_pop").show();	
	}
	else {
		$('#mask').remove();
	}
});

function closePopup(){
	 $('#mask,.popUpWin,.popUpExist').fadeOut(20, function() {
		  $('#mask').remove();
		  $('.popUpExist').removeAttr("style");
		  $('.popUpWin').remove(); // removes any pop up window that was loaded via ajax call
	  });
}
