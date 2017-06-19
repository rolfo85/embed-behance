// JSON VIEWER PERMALINK PROJECT LIST: http://codebeautify.org/jsonviewer/cb77941a
// JSON VIEWER PERMALINK DOTCOM RESTYLE DETAIL PROJECT http://codebeautify.org/jsonviewer/cb1d2136, 

$.fn.embedYourBehance = function( options ) {

	// get the HTML selector where the plugin will be initialized
	var behanceContainer = $(this).css({
		'position': 'relative'
	});

	// options allowed
	var settings = $.extend({
		
		// default option values										
		owners: false,
		appreciations: true,
		views: false,
		publishedDate:true,
		projectUrl: false,
		fields: false,
		apiKey: '',
		itemsPerPage: '6',
		userName: '',
		infiniteScrolling: false,
		imageCaption: true,
		ownerLink: true,
		appreciateIt: true

	}, options );
	
	
	// url to connect to behance API
	var urlList = ['https://api.behance.net/v2/users/', settings.userName, '/projects?client_id=', settings.apiKey, '&per_page=', settings.itemsPerPage, '&page=', page];
	
	// global variables
	var urlListNext = [];
	var dataExtracted = [];
	var checkNextPage = 1;
	var page = 1;
	var isDetail = 0;
	var html = '';
	var sidebarData = 0;


	function dateConversion(token) {

    	var fancyDate = new Date(token*1000);
    	fancyDate = fancyDate.toDateString();
    	return fancyDate;

	}

	function printAppreciateButton() {

		var urlProjectAppreciation = $(dataExtracted[0]['rawProjectUrl']).text();

		var iframe = $('<iframe>').attr({'src': urlProjectAppreciation + '?iframe=1#appreciation', 'scrolling': 'no'}).css({'width': 'inherit', 'max-width': 'inherit', 'height': 185, 'position': 'absolute', 'left': 0, 'top': -13, 'right': 0, 'margin': '0 auto'});
		var iframeOuter = '<div style="width: 100%; max-width: 1400px; overflow: hidden; background-color: white; height: 150px; position: relative;">' + iframe[0]['outerHTML'] + '</div>';
		
		return iframeOuter;
		
	}

	function pagination(urlListNext) {

		function paginationButton(action) {

			// check if the pagination button already exists
			if( $('.bh-pagination-button').length > 0 ) {

				// if yes I remove it
				$('.bh-pagination-button').remove();

			}

			// if there are other results to load I build the pagination button (if the infiniteScrolling is set to FALSE)
			if(action == 'show' && settings.infiniteScrolling == false) {

				$(behanceContainer).append('<div class="bh-pagination-button">Load More</div>');

			} else if (action == 'remove') {
				
				// if not I don't do anything
				return checkNextPage = 0;	
			}

		}

		page++;

		// assign the new value of 'page' to the array 'urlListNext'
		urlListNext[urlListNext.length - 1] = page;

		urlList = urlListNext;

		// convert the url for the behance API from array to string
		urlListNext = urlListNext.join('');
		
		$.ajax({

			url: urlListNext,
			dataType: 'jsonp',

			success: function(check) {

				if ( check.projects.length > 0 ) {
					
					paginationButton('show');

				} else {

					paginationButton('remove');

				}

			},
			error: function(error) {
				console.log('Error: ', error);
			}

		});

	}

	// function to load all images before showing the content
	function loadBeforeShow() {

		// when all the images are loaded, I show the content
	    function imageLoaded() { 

	       counter--; 

	       if( counter === 0 ) {
	       		
				// remove the spinner
	       		$('.loadingicon').remove();

	       		// if I'm loading the detail
	       		if(isDetail == true) {

	       			$('div.project-detail-outer').fadeIn();

	       		// if I'm loading the list 
				} else {

					// the content is shown 
		       		$('ul.wrap-projects').fadeIn();

		       		// check if there is another page
					pagination(urlListNext);	

				}

	       }

	    }
	    
	    // find all images coming from the json call 
	    var images = $('.wrap-project img');
	    
		// initialize the counter
	    var counter = images.length;

	    images.each(function() {
	        
	        if(this.complete) {
	            imageLoaded();
	        } else { 
	            $(this).one('load', imageLoaded);
	        }

	    });
			
	}

	function printContentForDetail() {

		html = '';
		
		// main column
		html += '<div class="box-inner-main">';

			dataExtracted[0]['title'];
			html += dataExtracted[0]['works'];
			html += printAppreciateButton();

		html += '</div>';

		// check if one of the sidebar fields is printed
		if(sidebarData == true) {

			// sidebar
			html += '<aside class="box-inner-sidebar">';

				html += dataExtracted[0]['owners'];
				html += dataExtracted[0]['views'];
				html += dataExtracted[0]['appreciations'];
				html += dataExtracted[0]['projectUrl'];
				html += dataExtracted[0]['fields'];
				html += dataExtracted[0]['appreciateIt'];
				html += dataExtracted[0]['publishedDate'];

			html += '</aside>';

		}

		// wrap all the data belongs to one project and append the wrapper
		html = '<div class="box-project">' + html + '</div>';	

		// print all the content into the div
		$('body').append(html);

		// a further wrapper is applied to all the projects
		$('.box-project').wrapAll( $('<div>').addClass('project-detail-outer').css('display', 'none') );

		// before displaying the results, I make sure all the images inside, have been loaded
		loadBeforeShow();

	}


	// projects list: function to design the html template and print the data fetched  
	function printContentForList() {		

		$.each(dataExtracted, function(key, value){

			html = '';

			html += value['rawId'];
			html += value['owners'];
			html += value['appreciations'];
			html += value['views'];
			html += value['cover'];
			html += value['title'];
			html += value['publishedDate'];
			html += value['projectUrl'];
			html += value['fields'];

			// wrap all the data belongs to one project and append the wrapper
			html = '<li class="wrap-project">' + html + '</li>';

			// print all the content into the div
			$(behanceContainer).append(html);

		});

		// if wrap-projects exists already
		if( $('.wrap-projects').length > 0 ) {

			// add another wrap project to the next pagination items
			$('.wrap-project:not(.wrap-projects > .wrap-project)').wrapAll( $('<ul>').addClass('wrap-projects').css('display', 'none') );

		} else {

			// a further wrapper is applied to all the projects
			$('.wrap-project').wrapAll( $('<ul>').addClass('wrap-projects').css('display', 'none') );

		}

		// before displaying the results, I make sure all the images inside, have been loaded
		loadBeforeShow();
		
	}

	// core function to design the fields wrapper around the data across list and detail
	function designTemplate(token, value) {

		var dataWrapper = ''

		switch(token) {

			//id
			case 'rawId':

			dataWrapper = '<div class="raw-project-id" style="display: none;">' + value.id + '</div>';

			break;

			//id
			case 'rawProjectUrl':

			dataWrapper += '<div class="raw-project-url" style="display: none;">' + value.url + '</div>';

			break;

			// owners
			case 'owners':

			if(settings.owners == true) {

				dataWrapper += '<div class="wrap-label">By:</div>';
				dataWrapper += '<ul class="wrap-values">';

					$.each(value.owners, function(key, value) {
						dataWrapper += '<li class="single">';
							
							// check if it's detail to show the profile picture
							if(isDetail == true) {
								
								dataWrapper += '<div class="profile-pic">';
								
								// check if URL on the owner name is enabled (only in the detail)
								if(settings.ownerLink == true) {
									dataWrapper += '<a href="' + value['url'] + '" target="_blank"><img src="' + value['images']['100'] +  '" alt="' + value['display_name'] + ' profile picture" /></a>';	
								} else {
									dataWrapper += '<img src="' + value['images']['100'] +  '" alt="' + value['display_name'] + ' profile picture" />';
								}
								
								dataWrapper += '</div>';
							}

							// print the full name
							dataWrapper += '<div class="owner-full-name">';

								if(settings.ownerLink == true) {
									dataWrapper += '<a href="' + value['url'] + '" target="_blank">' + value['display_name'] + '</a>';
								} else {
									dataWrapper += value['display_name'];
								}
							
							dataWrapper += '</div>';

						dataWrapper += '</li>';
					});

				dataWrapper += '</ul>' ;

				dataWrapper =  '<div class="wrap-owners-outer">' + dataWrapper + '</div>';

				sidebarData = 1;

			}
			
			break;

			// works
			case 'works':

			dataWrapper += '<ul class="wrap-values">';

			// save the title for the image alt
			var imgAlt = value.name;

				// loop through all the projects type (image, text, embed)
				$.each(value.modules, function(key, value) {

					function caption() {
						if ('caption_plain' in value && settings.imageCaption == true) {
							return '<div clsss="caption">' + value['caption_plain'] + '</div>';
						} else {
							return '';
						}
					}

					switch(value['type']) {

						case 'image':
						dataWrapper += '<li class="single-image">';
						dataWrapper += '<img src="' + value['sizes']['original'] + '" alt="' + imgAlt + '" />' + caption() + '</li>';
						break;

						case 'text':
						dataWrapper += '<li class="single-text">' + value['text'] + caption() + '</li>';
						break;

						case 'embed':
						dataWrapper += '<li class="single-embed">' + value['embed'] + caption() + '</li>';
					}

				});

			dataWrapper += '</ul>';
			dataWrapper =  '<div class="wrap-works-outer">' + dataWrapper + '</div>';
			
			break;


			// appreciations
			case 'appreciations':
			
			if(settings.appreciations == true) {

				dataWrapper += '<div class="wrap-label">Appreciations:</div>';
				dataWrapper += '<div class="wrap-value">' + value.stats.appreciations  + '</div>';
				dataWrapper =  '<div class="wrap-appreciations-outer">' + dataWrapper + '</div>';

				sidebarData = 1;

			}

			break;


			// views
			case 'views':

			if(settings.views == true) {
			
				dataWrapper += '<div class="wrap-label">Wiews:</div>';
				dataWrapper += '<div class="wrap-value">' + value.stats['views']  + '</div>';
				dataWrapper =  '<div class="wrap-views-outer">' + dataWrapper + '</div>';

				sidebarData = 1;

			}

			break;


			// cover
			case 'cover':

			dataWrapper += '<div class="wrap-cover"><img src="' + value.covers['404'] + '" alt="' + value.name + '" /></div>';
			
			break;


			// title
			case 'title':

			dataWrapper += '<h2 class="wrap-title">' + value.name + '</h2>';
			
			break;


			// publishedDate
			case 'publishedDate':

			if(settings.publishedDate == true) {

				dataWrapper += '<div class="wrap-label">Published:</div>';
				dataWrapper += '<div class="wrap-value">' + dateConversion(value.published_on) + '</div>';
				dataWrapper =  '<div class="wrap-published-date-outer">' + dataWrapper + '</div>';

				sidebarData = 1;

			}
			
			break;


			// project url
			case 'projectUrl':

			if(settings.projectUrl == true) {

				dataWrapper += '<a href="' + value.url + '" title="' + value.name + '" target="_blank"> Get it on Behance </a>';
				dataWrapper =  '<div class="wrap-project-url">' + dataWrapper + '</div>';

				sidebarData = 1;

			}
			
			break;



			// fields
			case 'fields':

			if(settings.fields == true) {

				dataWrapper += '<div class="wrap-label">Fields:</div>';
				dataWrapper += '<ul class="wrap-values">';

					$.each(value.fields, function(key, value) {
						dataWrapper += '<li class="single">' + value + '</li>';
					});

				dataWrapper += '</ul>';
				dataWrapper =  '<div class="wrap-fields-outer">' + dataWrapper + '</div>';

				sidebarData = 1;

			}

			break;


			// appreciate button on the sidebar
			case 'appreciateIt':

			if(settings.appreciateIt == true) {

				dataWrapper += '<a href="#"> Appreciate it </a>';
				dataWrapper =  '<div class="wrap-appreciateit">' + dataWrapper + '</div>';

				sidebarData = 1;

			}

		}

		return dataWrapper;
	}

	
	function dataExtractedParams(token = false, value = false) {


		dataExtracted[token] = {

			// fetch data from json
			rawId: 			designTemplate('rawId', value),
			rawProjectUrl:	designTemplate('rawProjectUrl', value),
			owners: 		designTemplate('owners', value),
			works: 			designTemplate('works', value),
			appreciations: 	designTemplate('appreciations', value),
			views: 			designTemplate('views', value),
			cover: 			designTemplate('cover', value),
			title: 			designTemplate('title', value),
			publishedDate: 	designTemplate('publishedDate', value),
			projectUrl: 	designTemplate('projectUrl', value),
			fields: 		designTemplate('fields', value),
			appreciateIt: 	designTemplate('appreciateIt', value)
			
		};

		return dataExtracted;

	}

	// ajax call to fetch the behance data to build the projects list
	var callBehanceProjectsList = function() {

		// create urlListNext to check for the next pagination
		urlListNext = urlList;

		// convert url for AJAX calll in a string
		urlList = urlList.join('');

		// reset dataextracted
		dataExtracted = [];

		$.ajax({
		
			url: urlList,
			dataType: 'jsonp',
			success: function(data) {

				$(behanceContainer).append('<div class="loadingicon"></div>');

				// json data fetch for list only
				$.each(data.projects, function(index, value){
					
					dataExtractedParams(index, value, 'template');

				});

				/* template function for printing data extracted */
				printContentForList();

			},
			error: function(error) {
				console.log('ERROR: ', error);
			}

		});

	};


	// ajax call to fetch the behance data to build the project detail
	var callBehanceProjectDetail = function(urlDetail) {

		// reset dataextracted
		dataExtracted = [];

		$.ajax({
		
			url: urlDetail,
			dataType: 'jsonp',
			success: function(data) {
				
				$(behanceContainer).append('<div class="loadingicon"></div>');

				dataExtractedParams(0, data.project, 'template');			

				/* template function for printing data extracted */
				printContentForDetail();

			},
			error: function(error) {
				console.log('ERROR: ', error);
			}

		});

	};

	// if infiniteScrolling is set
	if(settings.infiniteScrolling == true) {

		var timeout;
		$(window).on('scroll', function(){
			
			// the timeout is cleared every time '(window).on.scroll' is triggered			
			clearTimeout(timeout);  
			
			if(checkNextPage == 1) {

				 var	divTop = $(behanceContainer).offset().top,
			       		divHeight = $(behanceContainer).outerHeight(),
			      		wHeight = $(window).height(),
			       		windowScrTp = $(this).scrollTop();

				if (windowScrTp > (divTop+divHeight-wHeight+50)){
					
					timeout = setTimeout(function() {
						
						urlList = urlListNext;
						
						
						//another call to load other projects in the list
						callBehanceProjectsList();

					}, 100);

				}

			}

		});

	}

	// Click on the button pagination to scroll
	$(behanceContainer).on('click', '.bh-pagination-button', function(){
		
		urlList = urlListNext;
		// another call to load other projects in the list
		callBehanceProjectsList();

	});

	

	//detail
	$(behanceContainer).on('click', '.wrap-project', function(){

		var projectId = $(this).find('.raw-project-id').text();
		var urlDetail = 'http://www.behance.net/v2/projects/' + projectId + '?api_key=' + settings.apiKey;
		
		isDetail = 1;

		console.log(urlDetail);

		callBehanceProjectDetail(urlDetail);

	});

	// run the plugin
	callBehanceProjectsList();

};
