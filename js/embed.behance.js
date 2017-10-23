// JSON VIEWER PERMALINK PROJECT LIST: http://codebeautify.org/jsonviewer/cb77941a
// JSON VIEWER PERMALINK DOTCOM RESTYLE DETAIL PROJECT http://codebeautify.org/jsonviewer/cb1d2136, 

$.fn.embedYourBehance = function( options ) {


	$.getScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.2/TweenMax.min.js");


	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::::::::: PLUGIN OPTIONS :::::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://


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







	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::: VARIABLES :::::::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://


	//:::::::::::::::::::::::::::::: Behance API call ::::::::::::::::::::::::::::::: //
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://

	var urlList = ['https://api.behance.net/v2/users/', settings.userName, '/projects?client_id=', settings.apiKey, '&per_page=', settings.itemsPerPage, '&page=', page];

	
	// ::::::::::: PAGINATION ::::::::::::::://

	var urlListNext = []; // it makes an ajax call for checking if another pagination is available
	var page = 1; // it stores how many elements have to be shown for any pagination


	// ::::::::::: DATA-STORAGE ::::::::::::::://

	var dataExtracted = []; // the data extracted from the json call, already wrapped into divs
	var html = ''; // it wraps all the data with outer containers and make the actual layout structure
	var scrollBarPosition; // it stores the scrollbar position
	var style = [];

	// ::::::::::: FLAGS ::::::::::::::://

	var hasAnotherPage = 1; // if true, there is another page to paginate
	var isDetail = 0; // it checks if the detail has been opened
	var sidebarData = 0; // it checks whether the sidebar is printed or not
	var infinitePaginationOnGoing = 0; // it checks if an infinitePagination request has been already made







	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::: DOM MANIPULATIONS on PAGE LOAD :::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://



	// double wrap the body
	$('body').wrapInner( $('<div>').addClass('eb-total-inner-container') ).wrapInner( $('<div>').addClass('eb-total-outer-container') );


	// get the HTML selector where the plugin will be initialized
	var behanceContainer = $(this).wrap($('<div>').addClass('eb-container').css({'position': 'relative'}));

	// create the main container that hosts the projects list
	$(behanceContainer).html('<ul class="wrap-projects"></ul>');
	






	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::: AJAX CALLS FOR THE LIST AND THE DETAIL ::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::.:::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://


	//:::::::::::::::::: AJAX CALL FOR THE LIST :::::::::::::::::::://

	// ajax call to fetch the behance data to build the projects list
	var callBehanceProjectsList = function() {

		$('body').append('<div class="eb-loadingicon"></div>');

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

	//::::::::::::::: AJAX CALL FOR THE DETAIL :::::::::::::::::::://

	// ajax call to fetch the behance data to build the project detail
	var callBehanceProjectDetail = function(urlDetail) {

		$(behanceContainer).append('<div class="eb-loadingicon"></div>');

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
	


	//:::::::::::::::::::: DATA EXTRACTOR :::::::::::::::::::://

	function dataExtractedParams(token = false, value = false) {

		//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
		//:::::::::::: CONTENT DATA EXTRACTOR for PROJECT DETAIL and LIST ::::::::::://
		//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://

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

		//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
		//:::::::::::::::::: STYLE DATA EXTRACTOR for PROJECT DETAIL :::::::::::::::://
		//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://

		if(isDetail == true) {

			function applyCSS(){	

				style['title'] = 	'.eb-container .box-inner-main .title {\n\t' +
											
											'font-family: ' 	+ 	value.styles.text.title.font_family 		+ ';\n\t' +
											'font-weight: ' 	+ 	value.styles.text.title.font_weight 		+ ';\n\t' +
											'color: '			+	value.styles.text.title.color 				+ ';\n\t' +
											'text-align: ' 		+	value.styles.text.title.text_align 			+ ';\n\t' +
											'line-height:  '	+	value.styles.text.title.line_height 		+ ';\n\t' +
											'font-size: '		+	value.styles.text.title.font_size 			+ ';\n\t' +
											'text-decoration: ' +	value.styles.text.title.text_decoration 	+ ';\n\t' +
											'font-style: ' 		+	value.styles.text.title.font_style 			+ ';\n\t' +
											'text-transform: ' 	+	value.styles.text.title.text_transform 		+ ';\n'   +
									'}',		

				
				style['subtitle'] = '.eb-container .box-inner-main .sub-title {\n\t' +

											'font-family: ' 	+ 	value.styles.text.subtitle.font_family 		+ ';\n\t' +
											'font-weight: ' 	+ 	value.styles.text.subtitle.font_weight 		+ ';\n\t' +
											'color: '			+	value.styles.text.subtitle.color 			+ ';\n\t' +
											'text-align: ' 		+	value.styles.text.subtitle.text_align 		+ ';\n\t' +
											'line-height:  '	+	value.styles.text.subtitle.line_height 		+ ';\n\t' +
											'font-size: '		+	value.styles.text.subtitle.font_size 		+ ';\n\t' +
											'text-decoration: ' +	value.styles.text.subtitle.text_decoration 	+ ';\n\t' +
											'font-style: ' 		+	value.styles.text.subtitle.font_style 		+ ';\n\t' +
											'text-transform: ' 	+	value.styles.text.subtitle.text_transform 	+ ';\n'   +
									'}',


				style['paragraph'] = '.eb-container .box-inner-main .main-text {\n\t' +

											'font-family: ' 	+ 	value.styles.text.paragraph.font_family 	+ ';\n\t' +
											'font-weight: ' 	+ 	value.styles.text.paragraph.font_weight 	+ ';\n\t' +
											'color: '			+	value.styles.text.paragraph.color 			+ ';\n\t' +
											'text-align: ' 		+	value.styles.text.paragraph.text_align 		+ ';\n\t' +
											'line-height:  '	+	value.styles.text.paragraph.line_height 	+ ';\n\t' +
											'font-size: '		+	value.styles.text.paragraph.font_size 		+ ';\n\t' +
											'text-decoration: ' +	value.styles.text.paragraph.text_decoration + ';\n\t' +
											'font-style: ' 		+	value.styles.text.paragraph.font_style 		+ ';\n\t' +
											'text-transform: ' 	+	value.styles.text.paragraph.text_transform 	+ ';\n'   +
									'}',


				style['caption'] = '.eb-container .box-inner-main .caption {\n\t' +

											'font-family: ' 	+ 	value.styles.text.caption.font_family 		+ ';\n\t' +
											'font-weight: ' 	+ 	value.styles.text.caption.font_weight 		+ ';\n\t' +
											'color: '			+	value.styles.text.caption.color 			+ ';\n\t' +
											'text-align: ' 		+	value.styles.text.caption.text_align 		+ ';\n\t' +
											'line-height:  '	+	value.styles.text.caption.line_height 		+ ';\n\t' +
											'font-size: '		+	value.styles.text.caption.font_size 		+ ';\n\t' +
											'text-decoration: ' +	value.styles.text.caption.text_decoration 	+ ';\n\t' +
											'font-style: ' 		+	value.styles.text.caption.font_style 		+ ';\n\t' +
											'text-transform: ' 	+	value.styles.text.caption.text_transform 	+ ';\n'   +
									'}',


				style['link'] = '.eb-container .box-inner-main a {\n\t' +

											'font-family: ' 	+ 	value.styles.text.link.font_family 			+ ';\n\t' +
											'font-weight: ' 	+ 	value.styles.text.link.font_weight 			+ ';\n\t' +
											'color: '			+	value.styles.text.link.color 				+ ';\n\t' +
											'text-align: ' 		+	value.styles.text.link.text_align 			+ ';\n\t' +
											'line-height:  '	+	value.styles.text.link.line_height 			+ ';\n\t' +
											'font-size: '		+	value.styles.text.link.font_size 			+ ';\n\t' +
											'text-decoration: ' +	value.styles.text.link.text_decoration 		+ ';\n\t' +
											'font-style: ' 		+	value.styles.text.link.font_style 			+ ';\n\t' +
											'text-transform: ' 	+	value.styles.text.link.text_transform 		+ ';\n'   +
									'}',	

			
				style['background'] =	'.eb-container .box-inner-main .wrap-works-outer {\n\t' +
									
											'background-color: #' + value.styles.background.color 					+ ';\n\t' +
										'}',


				style['bottom_margin'] ='.eb-container .box-inner-main .spacer {\n\t' +
									
											'height: ' + value.styles.spacing.modules.bottom_margin			+ 'px;\n\t' +
										'}',

				style['top_margin']	  ='.eb-container .box-inner-main .wrap-works-outer {\n\t' +
									
											'padding-top: ' + value.styles.spacing.project.top_margin			+ 'px;\n\t' +
										'}',

				style['dividers'] = '.eb-container .box-inner-main .spacer .divider {\n\t' +

											'font-size: '   	+ 	value.styles.dividers.font_size				+ ';\n\t' +
											'line-height: '   	+ 	value.styles.dividers.line_height			+ ';\n\t' +
											'height: '   		+ 	value.styles.dividers.height				+ ';\n\t' +
											'border-color: '   	+ 	value.styles.dividers.border_color			+ ';\n\t' +
											'margin: '   		+ 	value.styles.dividers.margin				+ ';\n\t' +
											'position: '   		+ 	value.styles.dividers.position				+ ';\n\t' +
											'top: '   			+ 	value.styles.dividers.top					+ ';\n\t' +
											'border-width: '   	+ 	value.styles.dividers.border_width			+ ';\n\t' +
											'border-style: '   	+ 	value.styles.dividers.border_style			+ ';\n\t' +
									'}',

				
				//:::::::::::::::::: PRINT THE STYLES :::::::::::::::://

				$('head').append(	'<style type="text/css" data-css="embed-behance">' 	+ '\n\t' + 

										style['title'] 			+ '\n' +
										style['subtitle'] 		+ '\n' +
										style['paragraph']		+ '\n' +
										style['link']			+ '\n' +
										style['caption']		+ '\n' +
										style['background']		+ '\n' +
										style['bottom_margin']	+ '\n' +
										style['top_margin']		+ '\n' +
										style['dividers']		+ '\n\t' +
									
									'</style>');

			}

			applyCSS(); // fire the function that applys the dynamic CSS styles to projects

		}

	}
	







	//////////////////////////////////// TEMPLATE FUNCTION ///////////////////////////////////////
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::: MAIN FUNCTION THAT EXTRACTS THE RAW DATA AND WRAP THEM ::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://


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
						if ('caption' in value && settings.imageCaption == true) {
							return '<li class="caption">' + value['caption'] + '</li>';
						} else {
							return '';
						}
					}

					function fullBleed(){

						if( value.full_bleed == 1 ){
							return ' full-bleed';
						} else {
							return '';
						}
					}

					switch(value['type']) {

						case 'image':

							dataWrapper += '<li class="single-image' + fullBleed() + '">';
					
							dataWrapper += '<picture>';
								dataWrapper += '<source media="(min-width: 30em)" srcset="' + value['sizes']['original'] + '">';
								dataWrapper += '<img src="' + value['sizes']['disp'] + '" alt="' + imgAlt + '" />';
							dataWrapper += '</picture>'; 

						dataWrapper += '</li>';

						// behance spacer (mandatory on after any project module)
						dataWrapper += caption();

						// behance spacer (mandatory on after any project module)
						dataWrapper += '<li class="spacer"><div class="divider"></div></li>';

						break;

						case 'text':
						dataWrapper += '<li class="single-text">' + value['text'] + '</li>';

						// behance spacer (mandatory on after any project module)
						dataWrapper += caption();

						// behance spacer (mandatory on after any project module)
						dataWrapper += '<li class="spacer"><div class="divider"></div></li>';

						break;

						case 'embed':
						dataWrapper += '<li class="single-embed' + fullBleed() + '"><div class="inner">' + value['embed'] + '</div></li>';

						// behance spacer (mandatory on after any project module)
						dataWrapper += caption();

						// behance spacer (mandatory on after any project module)
						dataWrapper += '<li class="spacer"><div class="divider"></div></li>';
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

			function dateConversion(token) {

		    	var fancyDate = new Date(token*1000);
		    	fancyDate = fancyDate.toDateString();
		    	return fancyDate;

			}

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







	//::::::::::::::::::::::: OUTER STRUCTURE FOR THE DETAIL :::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::: INDIVIDUAL DATA ARE NEWLY WRAPPED IN OUTER CONTAINERS :::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::.:::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://

	

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

			html += '<div class="inner">';

				html += '<div class="close-project"></div>';

				html += dataExtracted[0]['title'];
				html += dataExtracted[0]['description'];

			html += '</div>';	

		html += '</div>';
		
		// main column
		html += '<main class="box-inner-main">';

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

				html += '<div class="eb-desktop-info"><span class="icon"></span><span class="label">Info</span></div>';

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

		// before displaying the results, all the images inside, have to be loaded
		loadBeforeShow();

	}
	






	//::::::::::::::::::::::: OUTER STRUCTURE FOR THE LIST :::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::: INDIVIDUAL DATA ARE NEWLY WRAPPED IN OUTER CONTAINERS :::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::.:::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://

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






	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::: DISPLAY ALL THE CONTENT GOT AFTER ALL THE IMAGES HAVE BEEN LOADED ::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://

	// function to load all images before showing the content
	function loadBeforeShow() {

		// when all the images are loaded, I show the content
	    function imageLoaded() { 

	       counter--; 

	       if( counter === 0 ) {
	       		
				// remove the spinner
	       		$('.eb-loadingicon').remove();

	       		// if I'm loading the detail
	       		if(isDetail == true) {

	       			openProject(); // ******** SHOW THE DETAIL *********

	       		// if I'm loading the list 
				} else {
					
					// the content is shown 
		       		TweenMax.to('ul.wrap-projects li', 1,{alpha:1});

		       		// check if there is another page
					pagination(urlListNext);

					// flag set to off for checking if an infinitePagination request is onGoing
					infinitePaginationOnGoing = 0;

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







	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::: FUNCTIONS RESPONSIBLE FOR OPENING/CLOSING THE PROJECT DETAIL ::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://



	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	// ::::::::::::::::::trigger for opening the project detail :::::::::::::::::: //
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	$(behanceContainer).on('click', '.wrap-project .wrap-cover, .wrap-project .wrap-title', function(){

		var projectId = $(this).parent('.wrap-project').find('.raw-project-id').text();
		var urlDetail = 'http://www.behance.net/v2/projects/' + projectId + '?api_key=' + settings.apiKey;
		
		isDetail = 1;

		console.log(urlDetail);

		callBehanceProjectDetail(urlDetail);

		projectOpeningAnimation();

	});

	// function triggered immediately after the click on a project, before the actual project is loaded
	function projectOpeningAnimation() {

		$('body').addClass('eb-detail-modal-active');
		
		scrollBarPosition = $(document).scrollTop();

		$('.eb-detail-modal-active .eb-total-outer-container > .eb-total-inner-container').css({'top': -scrollBarPosition});
		$('.eb-detail-modal-active .eb-total-outer-container').css('position', 'fixed');
	}


	// function for opening the detail */
	function openProject(){

		TweenMax.to('div.project-detail-outer', 1.5,{'top': 0, alpha:1, ease:Strong.easeOut});
		
		//get the header height
		function getHeaderHeight(){

			var headingHeight = $('.eb-container .wrap-headings').outerHeight(true);
			$('.eb-container .box-project main').css('margin-top', headingHeight);
			$('.eb-desktop-info').css('height', headingHeight);
			$('.eb-container .box-project aside .wrap-owners-outer').css('min-height', headingHeight);

		}

		// get the header height on resize
		$(window).resize(function(){
			setTimeout(getHeaderHeight, 500);
		});

		// get the header height on page load
		getHeaderHeight();

	}



	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	// ::::::::::::::::::trigger for closing the project detail :::::::::::::::::: //
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://

	$('body').on('click', '.close-project', function(){

		closeProject();

	});


	// function for closing the detail */
	function closeProject() {

		TweenMax.to('div.project-detail-outer', 0.5,{'top': '10em', alpha:0, ease:Strong.easeIn, onComplete: function(){

			$('div.project-detail-outer').remove();
			$('.eb-detail-modal-active .eb-total-outer-container').css('position', 'relative');
			$('.eb-detail-modal-active .eb-total-outer-container > .eb-total-inner-container').css('top', 'auto');
			$(window).scrollTop(scrollBarPosition);
			$('body').removeClass('.eb-detail-modal-active');

			$('style[data-css="embed-behance"]').remove();

			isDetail = false;		

		}});

		TweenMax.to('.eb-total-inner-container', 0.5,{alpha:1});

	}
	

	


	

	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::: PAGINATION ::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://


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
				return hasAnotherPage = 0;	
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


	


	

	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::: INFINITE SCROLLING ::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	

	// if infiniteScrolling is set
	if(settings.infiniteScrolling == true) {

		var timeout;
		
		$(window).on('scroll', function(){

			// the timeout is cleared every time '(window).on.scroll' is triggered			
			clearTimeout(timeout); 
			
			// fire the pagination only if I'm scolling at the bottom of the page and I'm NOT scrolling the detail
			if(hasAnotherPage == 1 && isDetail == 0) {

				var	divTop = $(behanceContainer).offset().top,
				   	divHeight = $(behanceContainer).outerHeight(),
				  	wHeight = $(window).height(),
				   	scrollBarPosition = $(this).scrollTop();

				if (scrollBarPosition > (divTop+divHeight-wHeight-50) && !infinitePaginationOnGoing){

					timeout = setTimeout(function() {
						
						// request on going, so other requests can not overlap
						infinitePaginationOnGoing = 1;

						urlList = urlListNext;
						
						//another call to load other projects in the list
						callBehanceProjectsList();

					}, 300);
				}
			}

		});

	}









	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::::::::::::: TOGGLE INFO INSIDE A PROJECT - MOBILE :::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://

	// show / hide info on mobile version
	var flagMobileInfo = 0;

	$('body').on('click', '.sidebar-mobile .bh-show', function(){

		function showHideMobileInfo(action) {

			// show the info
			if(action == 'show') {

				// get how height the aside has to be in accordin with the room
				var bodyHeight = $('body').height();
				var headingHeight = $('.eb-container .wrap-headings').outerHeight(true);
				var asideHeight = bodyHeight - headingHeight - 20;

				$('.sidebar-mobile .bh-show > .label').text('Hide Info');

				$('.eb-container aside.sidebar-mobile').addClass('open');
				
				TweenMax.to('.eb-container aside.sidebar-mobile', 0.7,{css: {'border-radius': 15, 'height': asideHeight}, ease:Strong.easeOut});

			// hide the info
			} else if (action == 'hide') {
				
				$('.sidebar-mobile .bh-show > .label').text('Show Info');
				
				$('aside.sidebar-mobile').removeClass('open');

				TweenMax.to('.eb-container aside.sidebar-mobile', 0.7,{css: {'border-radius': 50, 'height': '2.4em'}, ease:Strong.easeOut});

			}

		}

		if(!flagMobileInfo) {

			flagMobileInfo = 1;

			showHideMobileInfo('show');

		} else {

			flagMobileInfo = 0;

			showHideMobileInfo('hide');

		}

	});





	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::::::::::::: TOGGLE INFO INSIDE A PROJECT - DESKTOP ::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://

	// show / hide info on desktop version
	var flagDesktopInfo = 0;

	$('body').on('click', '.sidebar-desktop .eb-desktop-info', function(){
	
		function showHideDesktopInfo(action) {

			// show the info
			if(action == 'show') {

				TweenMax.set('.eb-container .wrap-headings, .eb-container .box-inner-main',{ 'width': 'calc(100% - 0px)', 'margin-left': 0});

				TweenMax.to('.eb-container .sidebar-desktop', 0.7,{'left': 0, ease:Strong.easeOut});
				TweenMax.to('.eb-container .wrap-headings, .eb-container .box-inner-main', 0.7,{ 'width': 'calc(100% - 320px)', 'margin-left': 320, ease:Strong.easeOut});

				$('.eb-container .sidebar-desktop').addClass('info-open');

			} else if (action == 'hide') {
				console.log(flagDesktopInfo);
				TweenMax.to('.eb-container .sidebar-desktop', 0.7,{'left': -320, ease:Strong.easeOut});
				TweenMax.to('.eb-container .wrap-headings, .eb-container .box-inner-main', 0.7,{ 'width': 'calc(100% - 0px)', 'margin-left': 0, ease:Strong.easeOut});

				$('.eb-container .sidebar-desktop').removeClass('info-open');

			}

		}

		if(!flagDesktopInfo) {

			flagDesktopInfo = 1;

			showHideDesktopInfo('show');

		} else {

			flagDesktopInfo = 0;

			showHideDesktopInfo('hide');

		}

	});






	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	/* ::::::::::::: */ callBehanceProjectsList(); /* ********* FIRE THE ENTIRE PLUGIN ********** */
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://

	

};
