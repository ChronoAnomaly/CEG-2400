var scripts = document.getElementsByTagName( 'script' );
var saytDomainId = $('#saytDomainId').val() ;
var saytClient = $('#saytClient').val() ;
var saytSite = $('#saytSite').val() ;
var saytArea = $('#saytArea').val() ;
var saytShowCat1 = $('#saytShowCat1').val() ;
var saytDomainCloudId = $('#saytDomainCloudId').val() ;
var saytCollection = $('#saytCollection').val() ;

var saytProdItems = $('#saytProdItems').val();
var saytNavigationItems = $('#saytNavigationItems').val();
var saytSearchItems = $('#saytSearchItems').val();

var $product;
var $suggestHt;

function searchProduct(searchTerm,path) {
    $.getJSON(saytDomainCloudId + 'products?callback=?', { productItems: saytProdItems, searchItems: 0 , navigationItems: 0, query:searchTerm,collection:saytCollection,area:saytArea }, function(data) {
		//$("#suggest").css('height','');
		// if not product results - move up brands/cats
		if (data.status.code != 200) {
			$("#suggestCat").css('margin-top','10px');
			$('#suggestTopResults').remove();
			
			if ($('#suggestCat').hasClass('ui-menu-divider')) {
				//$("#sayt-menu").width('270px');
				//$("#sayt-menu").height($('#suggest').height())
				$('#suggest').css('border-right-color','white')
			}
		}
	
		else {
			// render products menu and check height against search term height
			$('#suggest').css('border-right-color','');
			$product = data.result.stats.productCount;
			
			switch($product) {
				case 1:
					$("#suggestCat").css('margin-top','105px')
					break;
				case 2:
					$("#suggestCat").css('margin-top','165px')
					break;
				case 3:
					$("#suggestCat").css('margin-top','225px')
					break;
				default:
					$("#suggestCat").css('margin-top','')
			} 
			
			$suggestHt = $('#suggest').innerHeight();
        	
			dust.render('productTemplate.dust', { items:data.result }, function(err, out) {
				$('#suggestTopResults').remove();
            	$('#sayt-menu').append(out);
				if ($('#suggestCat').hasClass('ui-menu-divider')) {
					$('#suggestTopResults').css('border-bottom', 'none');
					$topResultsHt = $('#suggestTopResults').innerHeight();
					if ($topResultsHt > $suggestHt) {
						$("#sayt-menu,#suggest").height($topResultsHt)
					}				
				} 
				
				else {
					$("#sayt-menu").css('height','')
				}
				
				// make sure dotted line is all the way down
				var $catHt = $('#suggestCat').innerHeight();
				$topResultsHt = $('#suggestTopResults').innerHeight();
				var $total = $catHt + $topResultsHt;
				if ($total > $suggestHt) {
					$("#suggest").height($total + 15)
				}
					
			});
		}
    });
}

$.widget('custom.sayt', $.ui.autocomplete, {
    _renderMenu: function( ul, items ) {
      dust.render('autocompleteTemplate.dust', { items:items }, function(err, out) {
	    ul.attr('id', 'sayt-menu');
		$("#sayt-menu").css({'display':'table','border':'','height':'','position':'absolute','top':'129px'});
	    ul.append(out);
      });
	  
	  if (items[1].stats.searchCount > 0){
		searchAlternateKeyword(items[1].searchTerms[0].value);
		
      }
	  else {
		  $("#sayt-menu").css({'display':'none','border':'none'});
		  $("#sayt-menu").height(0);
	  }
		  
    },


	//size autocomplete menu
	_resizeMenu: function() {
		if ( (currWinWd >= 1300) && ($('div.responsive').length) ) {
			this.menu.element.outerWidth($('#searchInput').width() + 7);
		}
		
		else {
			var $searchInput = $('#searchInput').innerWidth();
			var $searchBtn = $('.search_nav').innerWidth();
			this.menu.element.outerWidth($searchInput + $searchBtn)
		}
		
		
	}
});

/* AUTOCOMPLETE STUFF*/

$(document).on('mouseenter', "li .sayt-content, li .sayt-additional", function () {
	$(this).addClass("hover");
		
	if ($(this).attr("type") == 'searchterm') {
        //$('#searchInput').val($(this).attr("value"));
		//ajax call to get alternate keyword
		searchAlternateKeyword($(this).attr("value"));
		//
    }
});
function searchAlternateKeyword(keyword)
{
	var obj = new Object();
	obj.url = "/searchAlternateKeyword";
	obj.data = "searchAlternateKeyword="+keyword;
	obj.successFunction = "searchAlternateKeywordSuccessFunction";
	createAjaxCallPost(obj);
}
function searchAlternateKeywordSuccessFunction(data){
	// console.log("alternate keyword: "+data);
	eval("var jsonResult = " + data);
	// console.log("alternate keyword: "+jsonResult.alternateKeyword +" alternate path: "+jsonResult.path);
	searchProduct(jsonResult.alternateKeyword,jsonResult.path);
}

$(document).on('mouseleave', "li .sayt-content, li .sayt-additional", function () {
	$(this).removeClass("hover");
});


$(document).on('click',"div.sayt-content, div.sayt-additional", function () {
	if ($(this).attr("type") == 'searchterm') {
		// $('#searchInput').val($(this).attr("value"));
		//{term that was clicked, ex. pallet}
		gaEvent('SAYT', 'Search Term', '\'' + $(this).attr("value") + '\'', 0);
			
		//submitting form for search
		// $("#searchForm").submit();    
		var url = "/searchResult?q=" + $(this).attr("value");
		window.location.href = url
	} 
	else if ($(this).attr("type") == 'searchtermWithCategory') {
		// perform navigation here
		var catLevel2 = $(this).attr("value")
		var query = $(this).attr("query")
		// var value =  $('#searchInput').val();
		var url = "";
		if(saytShowCat1 == 'true'){	
			var cat1Id = catLevel2.substring(0,2);
			url = "/searchResult?q=" + query + "&p=category1_id=" + cat1Id + "~category2_id=" + catLevel2;
		}else{
			url = "/searchResult?q=" + query + "&p=category2_id=" + catLevel2;
		}
		
		//{term/category that was clicked, ex. pallet in Containers-Bulk}
		gaEvent('SAYT', 'Search Term In Category', '\'' + query + ' in ' + catLevel2 + '\'', 0);
		window.location.href = url
	
	} 
	else if ($(this).attr("type") == 'navigation') {
		// perform navigation here
		var brand = $(this).attr("value")
		// var value =  $('#searchInput').val();
	
		// {brand that was clicked (brand name and pub code if possible)}
		gaEvent('SAYT', 'Brand', '\'' + brand + '\'', 0);
		var url = "/shopByBrand?p=pcs_mfr_pub_code=" + brand;
		window.location.href = url
	
	} 
	else if ($(this).attr("type") == 'navigationCategory') {
		// perform navigation here
		var category = $(this).attr("value")
		//{category that was clicked (ID and desc if possible}
		gaEvent('SAYT', 'Category', '\'' + category + '\'', 0);
		var url = "/categoryById/categoryId/" + category;
		window.location.href = url
	
	} 
	
	else if ($(this).attr("type") == 'product') {
		// perform redirect here
		// var url = ui.item.url
	}
});

//$( "div.suggestions, div.sayt-additional" ).on( "autocompletefocus", function( event, ui ) {} );