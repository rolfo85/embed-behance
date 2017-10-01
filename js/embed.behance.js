// JSON VIEWER PERMALINK PROJECT LIST: http://codebeautify.org/jsonviewer/cb77941a
// JSON VIEWER PERMALINK DOTCOM RESTYLE DETAIL PROJECT http://codebeautify.org/jsonviewer/cb1d2136, 

$.fn.embedYourBehance = function( options ) {

	// double wrap the body
	$('body').wrapInner( $('<div>').addClass('eb-total-inner-container') ).wrapInner( $('<div>').addClass('eb-total-outer-container') );


	// get the HTML selector where the plugin will be initialized
	var behanceContainer = $(this).wrap($('<div>').addClass('eb-container').css({'position': 'relative'}));

	// create the main container that hosts the projects list
	$(behanceContainer).html('<ul class="wrap-projects"></ul>');


	// options allowed
	var settings = $.extend({
		
		// default option values										
		owners: true,
		appreciations: true,
		views: true,
		publishedDate: true,
		projectUrl: true,
		fields: true,
		apiKey: '',
		itemsPerPage: '6',
		userName: '',
		infiniteScrolling: true,
		imageCaption: true,
		ownerLink: true,
		description: true,
		tags: true

	}, options );
	
	
	// url to connect to behance API
	var urlList = ['https://api.behance.net/v2/users/', settings.userName, '/projects?client_id=', settings.apiKey, '&per_page=', settings.itemsPerPage, '&page=', page];
	
	// global variables
	var urlListNext = [];
	var dataExtracted = [];
	var styleData = [];
	var checkNextPage = 1;
	var page = 1;
	var isDetail = 0;
	var html = '';
	var sidebarData = 0;
	var scrollPosition;

	// function triggered immediately after the click on a project, before the actual project is loaded
	function openDetailAnimation() {

		$('body').addClass('detail-modal-active');
		
		scrollPosition = $(document).scrollTop();
		
		$('.detail-modal-active .eb-total-outer-container').css('position', 'fixed');
		$('.detail-modal-active .eb-total-outer-container > .eb-total-inner-container').css({'top': -scrollPosition});
	}

	function dateConversion(token) {

    	var fancyDate = new Date(token*1000);
    	fancyDate = fancyDate.toDateString();
    	return fancyDate;

	}

	function pagination(urlListNext) {

		function paginationButton(action) {

			// check if the pagination button already exists
			if( $('.eb-pagination-button').length > 0 ) {

				// if yes I remove it
				$('.eb-pagination-button').remove();

			}

			// if there are other results to load I build the pagination button (if the infiniteScrolling is set to FALSE)
			if(action == 'show' && settings.infiniteScrolling == false) {

				$(behanceContainer).append('<div class="eb-pagination-button">Load More</div>');

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

	// function for closing the detail */
	function closeProject() {

		$('div.project-detail-outer').animate({'opacity': 0, 'top': '10em'}, 700, function(){

			$(this).remove();
			$('.detail-modal-active .eb-total-outer-container').css('position', 'relative');
			$('.detail-modal-active .eb-total-outer-container > .eb-total-inner-container').css('top', 'auto');
			$(window).scrollTop(scrollPosition);
			$('body').removeClass('detail-modal-active');

			// wait 300ms before isDetail becomes false to prevent an infinitePagination
			isDetail = false;
			

		});
		$('.eb-total-inner-container').animate({'opacity': 1}, 500);

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

	       			$('div.project-detail-outer').animate({'opacity': 1, 'top': 0}, 500, function(){
	       				$('.sidebar-desktop').css('position', 'fixed');
	       			});
	       			$('.eb-total-inner-container').animate({'opacity': 0.3}, 500);

	       			var headingHeight = $('.eb-container .wrap-headings').outerHeight(true);
	       			$('.eb-container .box-project main').css('margin-top', headingHeight);
	       			$('.eb-container .box-project aside .wrap-owners-outer').css('min-height', headingHeight);


	       		// if I'm loading the list 
				} else {
					
					// the content is shown 
		       		$('ul.wrap-projects li').animate({'opacity': 1}, 500);

		       		// check if there is another page
					pagination(urlListNext);

					// flag set to off for checking if an infinitePagination request is onGoing
					requestOnGoing = 0;

				}

	       }

	    }
	    

	    if(isDetail == true) {
		    // find all images coming from the json call (in the detail)
		    var images = $('.box-project img');
		} else {

		    // find all images coming from the json call (in the list)
		    var images = $('.wrap-project img');
		}
	    
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

		// print the sidebar
		function printAsideContent() {

			html += '<div class="box-overflow"><div class="box-overflow-inner">';

				html += dataExtracted[0]['owners'];
				html += dataExtracted[0]['views'];
				html += dataExtracted[0]['appreciations'];
				html += dataExtracted[0]['fields'];
				html += dataExtracted[0]['tags'];
				html += dataExtracted[0]['projectUrl'];
				html += dataExtracted[0]['publishedDate'];

			html += '</div></div>';

		}

		html = '';

		html += '<div class="wrap-headings">';

			html += '<div class="close-project"></div>';

			html += dataExtracted[0]['title'];
			html += dataExtracted[0]['description'];
		html += '</div>';
		
		// main column
		html += '<main class="box-inner-main" style="background-color: ' + styleData['backgroundColor'] + ';">';

			html += dataExtracted[0]['works'];

		html += '</main>';

		// check if one of the sidebar fields is printed
		if(sidebarData == true) {

			// sidebar for mobile
			html += '<aside class="box-inner-sidebar sidebar-mobile">';

				printAsideContent();

				html += '<a class="bh-show"><span class="label">Show Info</span><span class="icon-chevron"></span></a>';

			html += '</aside>';

			// sidebar for desktop
			html += '<aside class="box-inner-sidebar sidebar-desktop">';

				printAsideContent();

			html += '</aside>';

		}

		// wrap all the data belongs to one project and append the wrapper
		html = '<div class="box-project">' + html + '</div>';	

		// print all the content into the div
		$(html).insertAfter($('.eb-total-outer-container'));

		// a further wrapper is applied to all the projects
		$('.box-project').wrapAll( $('<div>').addClass('project-detail-outer eb-container'));

		
		// if there is the sidebar
		if(sidebarData == true) {

			// add a class to the wrapper if there's the sidebar
			$('.eb-container .box-project').addClass('has-sidebar');

		}

		// before displaying the results, I make sure all the images inside, have been loaded
		loadBeforeShow();

	}


	// projects list: function to design the html template and print the data fetched  
	function printContentForList() {		

		$.each(dataExtracted, function(key, value){

			html = '';

			html += value['rawId'];
			html += value['appreciations'];
			html += value['views'];
			html += value['cover'];
			html += value['title'];
			html += value['owners'];

			// wrap all the data belongs to one project and append the wrapper
			html = '<li class="wrap-project">' + html + '</li>';

			// print all the content into the div
			$('.wrap-projects').append(html);

		});
		

		// before displaying the results, I make sure all the images inside, have been loaded
		loadBeforeShow();
		
	}

	// core function to design the fields wrapper around the data across list and detail
	function designTemplate(token, value) {

		var dataWrapper = '';

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
							return '<div class="caption">' + value['caption'] + '</div>';
						} else {
							return '';
						}
					}

					switch(value['type']) {

						case 'image':
						dataWrapper += '<li class="single-image">';
							
							dataWrapper += '<picture>';
								dataWrapper += '<source media="(min-width: 30em)" srcset="' + value['sizes']['original'] + '">';
								dataWrapper += '<img src="' + value['sizes']['disp'] + '" alt="' + imgAlt + '" />';
							dataWrapper += '</picture>'; 
						
							dataWrapper += caption();

						dataWrapper + '</li>';
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

			dataWrapper += '<div class="wrap-cover">';
				dataWrapper += '<img src="' + value.covers['404'] + '" alt="' + value.name + '" />';

				if(settings.fields == true) {

					dataWrapper += '<ul class="fields-in-cover">';

					$.each(value.fields, function(key, value) {
						dataWrapper += '<li class="single">' + value + '</li>';
					});

					dataWrapper += '</ul>';

				}

			dataWrapper += '</div>';
			
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

				dataWrapper += '<a href="' + value.url + '" title="' + value.name + '" target="_blank"> Appreciate it in Behance </a>';
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



			// tags
			case 'tags':

			if(settings.tags == true) {

				dataWrapper += '<div class="wrap-label">Tags:</div>';
				dataWrapper += '<ul class="wrap-values">';

					$.each(value.tags, function(key, value) {
						dataWrapper += '<li class="single">' + value + '</li>';
					});

				dataWrapper += '</ul>';
				dataWrapper =  '<div class="wrap-tags-outer">' + dataWrapper + '</div>';

				sidebarData = 1;

			}

			break;



			// description
			case 'description':

			if(settings.description == true && value.description !== '') {

				dataWrapper += '<h3 class="wrap-description">' + value.description + '</h3>';

			}

			break;


		}


		return dataWrapper;


	}

	
	function dataExtractedParams(token = false, value = false) {

		if(isDetail == true) {

			styleData['backgroundColor'] = '#' + value.styles.background.color;
			styleData['captionColor'] = value.styles.text.caption.color;

		}

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
			description: 	designTemplate('description', value),
			tags: 			designTemplate('tags', value)
			
		};

	}

	// ajax call to fetch the behance data to build the projects list
	var callBehanceProjectsList = function() {

		$('body').append('<div class="loadingicon"></div>');

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

		$(behanceContainer).append('<div class="loadingicon"></div>');

		// reset dataextracted
		dataExtracted = [];

		$.ajax({
		
			url: urlDetail,
			dataType: 'jsonp',
			success: function(data) {

				dataExtractedParams(0, data.project, 'template');			

				/* template function for printing data extracted */
				printContentForDetail();

			},
			error: function(error) {
				console.log('ERROR: ', error);
			}

		});

	};

	//flag to check if a infinitePaginationRequst has been already made
	var requestOnGoing = 0;

	// if infiniteScrolling is set
	if(settings.infiniteScrolling == true) {

		var timeout;
		
		$(window).on('scroll', function(){

			// the timeout is cleared every time '(window).on.scroll' is triggered			
			clearTimeout(timeout); 
			
			if(checkNextPage == 1 && isDetail == 0) {

				var	divTop = $(behanceContainer).offset().top,
				   	divHeight = $(behanceContainer).outerHeight(),
				  	wHeight = $(window).height(),
				   	windowScrTp = $(this).scrollTop();

				if (windowScrTp > (divTop+divHeight-wHeight-50) && !requestOnGoing){

					timeout = setTimeout(function() {

						console.log('Il dettaglio è: ' + isDetail);
						
						requestOnGoing = 1;

						urlList = urlListNext;
						
						//another call to load other projects in the list
						callBehanceProjectsList();

					}, 300);
				}

			}

		});

	}

	// Click on the button pagination to scroll
	var isPaging = 0;
	$(behanceContainer).on('click', '.eb-pagination-button:not(.active)', function(event){
		
		$(this).addClass('active');

		if (!isPaging) {

			isPaging = 1;
			urlList = urlListNext;
			// another call to load other projects in the list
			callBehanceProjectsList();

			isPaging = 0;

		}

	});


	//detail
	$(behanceContainer).on('click', '.wrap-project .wrap-cover, .wrap-project .wrap-title', function(){

		var projectId = $(this).parent('.wrap-project').find('.raw-project-id').text();
		var urlDetail = 'http://www.behance.net/v2/projects/' + projectId + '?api_key=' + settings.apiKey;
		
		isDetail = 1;

		console.log(urlDetail);

		callBehanceProjectDetail(urlDetail);

		openDetailAnimation();

	});

	// close detail
	$('body').on('click', '.close-project', function(){

		closeProject();

	});

	// show / hide info on mobile version
	var show = 0;
	$('body').on('click', '.sidebar-mobile .bh-show', function(){

		function showHideInfo(action) {

			// show the info
			if(action == 'show') {

				// get how height the aside has to be in accordin with the room
				var bodyHeight = $('body').height();
				var headingHeight = $('.eb-container .wrap-headings').outerHeight(true);
				var asideHeight = bodyHeight - headingHeight - 20;

				$('.sidebar-mobile .bh-show > .label').text('Hide Info');

				$('.eb-container aside.sidebar-mobile').addClass('open').animate({

					'height': asideHeight,
					'border-radius': 15

				}, 500);

			// hide the info
			} else if (action == 'hide') {
				
				$('.sidebar-mobile .bh-show > .label').text('Show Info');
				
				$('aside.sidebar-mobile').removeClass('open').animate({

					'height': '2.4em',
					'border-radius': 50

				}, 500);

			}

		}

		if(!show) {

			show = 1;

			showHideInfo('show');

		} else {

			show = 0;

			showHideInfo('hide');

		}

	});

	// run the plugin
	callBehanceProjectsList();

};
