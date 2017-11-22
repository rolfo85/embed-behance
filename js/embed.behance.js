// JSON VIEWER PERMALINK PROJECT LIST: http://codebeautify.org/jsonviewer/cb77941a
// JSON VIEWER PERMALINK DOTCOM RESTYLE DETAIL PROJECT http://codebeautify.org/jsonviewer/cb1d2136, 

$.fn.embedYourBehance = function( options ) {


	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::::::::: PLUGIN OPTIONS :::::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://


	// default options
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
		infiniteScrolling: false,
		imageCaption: true,
		ownerLink: true,
		description: true,
		tags: true,
		themeColor: '#2183ee',
		animationDuration: 1000,
		animationEasing: 'easeInOutExpo'

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

	$('body').append(iconsSet('<div class="eb-loadingicon">' + iconsSet('loading') + '</div>'));
	






	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::: AJAX CALLS FOR THE LIST AND THE DETAIL ::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::.:::::::::::::::::::::://
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://


	//:::::::::::::::::: AJAX CALL FOR THE LIST :::::::::::::::::::://

	// ajax call to fetch the behance data to build the projects list
	var callBehanceProjectsList = function() {

		$('body').append('<div class="eb-loadingicon">' + iconsSet('loading') + '</div>');

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

		$('body').append('<div class="eb-loadingicon">' + iconsSet('loading') + '</div>');

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

			
				style['background'] =	'.eb-container .box-inner-main {\n\t' +
									
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

				dataWrapper += '<div class="wrap-label">By: </div>';
				dataWrapper += '<ul class="wrap-values">';

					$.each(value.owners, function(key, value) {
						dataWrapper += '<li class="single">';
							
							// check if it's detail to show the profile picture
							if(isDetail == true) {
								
								dataWrapper += '<div class="profile-pic">';
								
								// check if URL on the owner name is enabled (only in the detail)
								if(settings.ownerLink == true) {
									dataWrapper += '<a style="color: ' + settings.themeColor + '" href="' + value['url'] + '" target="_blank"><img src="' + value['images']['100'] +  '" alt="' + value['display_name'] + ' profile picture" /></a>';	
								} else {
									dataWrapper += '<img src="' + value['images']['100'] +  '" alt="' + value['display_name'] + ' profile picture" />';
								}
								
								dataWrapper += '</div>';
							}

							// print the full name
							dataWrapper += '<div class="owner-full-name">' + iconsSet('owner');

								if(settings.ownerLink == true) {
									dataWrapper += '<a style="color: ' + settings.themeColor + '" href="' + value['url'] + '" target="_blank">' + value['display_name'] + iconsSet('chevronRight') + '</a>';
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

				dataWrapper += '<div class="wrap-label">' + iconsSet('thumbsUp') + '</div>';
				dataWrapper += '<div class="wrap-value">' + value.stats.appreciations  + '</div>';
				dataWrapper =  '<div class="wrap-appreciations-outer">' + dataWrapper + '</div>';

				sidebarData = 1;

			}

			break;


			// views
			case 'views':

			if(settings.views == true) {
			
				dataWrapper += '<div class="wrap-label">' + iconsSet('views') + '</div>';
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

					dataWrapper += '<ul class="fields-in-cover">' + iconsSet('fields');

					$.each(value.fields, function(key, value) {
						dataWrapper += '<li class="single">' + value + '</li>';
					});

					dataWrapper += '</ul>';

				}

			dataWrapper += '</div>';
			
			break;


			// title
			case 'title':

			dataWrapper += '<div class="wrap-title">' + value.name + '</div>';
			
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

				dataWrapper += '<a style="background-color: ' + settings.themeColor + '" href="' + value.url + '" title="' + value.name + '" target="_blank"> Appreciate it in Behance </a>';
				dataWrapper =  '<div class="wrap-project-url">' + dataWrapper + '</div>';

				sidebarData = 1;

			}
			
			break;



			// fields
			case 'fields':

			if(settings.fields == true) {

				dataWrapper += '<div class="wrap-label">' + iconsSet('fields') + 'Fields:</div>';
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

				dataWrapper += '<div class="wrap-label">' + iconsSet('tags') + 'Tags:</div>';
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

				dataWrapper += '<div class="wrap-description">' + value.description + '</div>';

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

				html += '<div class="close-project">' + iconsSet('close') + '</div>';

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

				html += '<a class="bh-show" style="background-color: ' + settings.themeColor + '"><span class="label">Show Info</span><span class="icon-chevron">' + iconsSet('chevronDown') + '</span></a>';

			html += '</aside>';

			// sidebar for desktop
			html += '<aside class="box-inner-sidebar sidebar-desktop">';

				html += '<div class="eb-desktop-info" style="background-color: ' + settings.themeColor + '"><span class="icon">' + iconsSet('chevronRight') + '</span><span class="label">Info</span></div>';

				printAsideContent();

			html += '</aside>';

		}


		// wrap all the data belongs to one project and append the wrapper
		html = '<div class="box-project eb-container">' + html + '</div>';	

		// print all the content into the div
		$(html).insertAfter($('.eb-total-outer-container'));

		
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
					$('ul.wrap-projects li').animate({opacity:1}),

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

		// print overlay
		$('body').append('<div class="eb-project-overlay"></div>');
		//show overlay
		$('.eb-project-overlay').animate({opacity: 1}, settings.animationDuration, settings.animationEasing);
	}


	// function for opening the detail */
	function openProject(){

		$('div.box-project').animate({top: 0, opacity: 1}, settings.animationDuration, settings.animationEasing);
		
		//get the header height
		function getHeaderHeight(){

			var headingHeight = $('.eb-container .wrap-headings').outerHeight(true);
			$('.eb-container .box-inner-main').css('margin-top', headingHeight);
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

	// click on the dark overlay, to close the project
	$('body').on('click', '.box-project.eb-container + .eb-project-overlay', function(e){
		if(e.target == this){
			closeProject();
		}
	});

	// click on close button, to close the project
	$('body').on('click', '.eb-container .close-project', function(){
		closeProject();
	});




	// function for closing the detail */
	function closeProject() {

		$('div.box-project').animate({top: 50, opacity: 0}, settings.animationDuration, settings.animationEasing, function(){

			$(this).remove();

			$('.eb-detail-modal-active .eb-total-outer-container').css('position', 'relative');
			$('.eb-detail-modal-active .eb-total-outer-container > .eb-total-inner-container').css('top', 'auto');
			
			$(window).scrollTop(scrollBarPosition);
			$('body').removeClass('.eb-detail-modal-active');

			$('style[data-css="embed-behance"]').remove();

			isDetail = false;		

		});

		// remove overlay
		$('.eb-project-overlay').animate({opacity: 0}, settings.animationDuration, settings.animationEasing, function(){
			$(this).remove();
		});

		$('.eb-total-inner-container').animate({opacity: 1}, settings.animationDuration, settings.animationEasing);

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
		$(this).children('.icon-loading').html(iconsSet('loading'));

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

				$(behanceContainer).append('<div class="eb-pagination-button" style="background-color: ' + settings.themeColor + '"><span>Load More</span> <span class="icon-loading"></span> </div>');

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
				$('.eb-container aside.sidebar-mobile .icon-chevron').html(iconsSet('chevronUp'));
				
				$('.eb-container aside.sidebar-mobile').animate({height: asideHeight}, settings.animationDuration, settings.animationEasing).css('border-radius', 15);

			// hide the info
			} else if (action == 'hide') {
				
				$('.sidebar-mobile .bh-show > .label').text('Show Info');
				
				$('aside.sidebar-mobile').removeClass('open');
				$('.eb-container aside.sidebar-mobile .icon-chevron').html(iconsSet('chevronDown'));

				$('.eb-container aside.sidebar-mobile').animate({height: 42}, settings.animationDuration, settings.animationEasing).css('border-radius', 50);

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

				$('.eb-container .sidebar-desktop').animate({left: 0}, settings.animationDuration, settings.animationEasing);

				$('.eb-container .sidebar-desktop').addClass('info-open');
				$('.eb-container .sidebar-desktop .eb-desktop-info .icon').html(iconsSet('chevronLeft'));

				// print overlay
				$('<div class="eb-project-overlay"></div>').insertBefore('.eb-container .wrap-headings');
				//show overlay
				$('.box-project.eb-container > .eb-project-overlay').animate({opacity: 1}, settings.animationDuration, settings.animationEasing);

			} else if (action == 'hide') {

				$('.eb-container .sidebar-desktop').animate({left: -320}, settings.animationDuration, settings.animationEasing);

				$('.eb-container .sidebar-desktop').removeClass('info-open');
				$('.eb-container .sidebar-desktop .eb-desktop-info .icon').html(iconsSet('chevronRight'));

				//remove overlay
				$('.box-project.eb-container > .eb-project-overlay').animate({opacity: 0}, settings.animationDuration, settings.animationEasing, function(){
					$(this).remove();
				});

			}

		}

		if(!flagDesktopInfo) {

			flagDesktopInfo = 1;

			showHideDesktopInfo('show');

		} else {

			flagDesktopInfo = 0;

			showHideDesktopInfo('hide');

		}


		// click on the dark overlay, to close the project info
		$('body').on('click', '.box-project.eb-container > .eb-project-overlay', function(e){
			if(e.target == this){

				flagDesktopInfo = 0;
				
				showHideDesktopInfo('hide');
			}
		});

	});






	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::: ICONS ::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://


	function iconsSet(name) {

		switch(name) {

			// icon thumbs up
			case 'thumbsUp':

				var thumbsUp =	'<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 478.2 478.2" style="enable-background:new 0 0 478.2 478.2;" xml:space="preserve"> \n' + 
									'<g> \n' + 
										'<path style="fill: ' + settings.themeColor + '" class="st0" d="M457.6,325.1c9.8-12.5,14.5-25.9,13.9-39.7c-0.6-15.2-7.4-27.1-13-34.4c6.5-16.2,9-41.7-12.7-61.5c-15.9-14.5-42.9-21-80.3-19.2c-26.3,1.2-48.3,6.1-49.2,6.3h-0.1c-5,0.9-10.3,2-15.7,3.2c-0.4-6.4,0.7-22.3,12.5-58.1c14-42.6,13.2-75.2-2.6-97C293.8,1.8,267.3,0,259.5,0c-7.5,0-14.4,3.1-19.3,8.8c-11.1,12.9-9.8,36.7-8.4,47.7c-13.2,35.4-50.2,122.2-81.5,146.3c-0.6,0.4-1.1,0.9-1.6,1.4c-9.2,9.7-15.4,20.2-19.6,29.4c-5.9-3.2-12.6-5-19.8-5h-61c-23,0-41.6,18.7-41.6,41.6v162.5c0,23,18.7,41.6,41.6,41.6h61c8.9,0,17.2-2.8,24-7.6l23.5,2.8c3.6,0.5,67.6,8.6,133.3,7.3c11.9,0.9,23.1,1.4,33.5,1.4c17.9,0,33.5-1.4,46.5-4.2c30.6-6.5,51.5-19.5,62.1-38.6c8.1-14.6,8.1-29.1,6.8-38.3c19.9-18,23.4-37.9,22.7-51.9C461.3,337.1,459.5,330.2,457.6,325.1z M48.3,447.3c-8.1,0-14.6-6.6-14.6-14.6V270.1c0-8.1,6.6-14.6,14.6-14.6h61c8.1,0,14.6,6.6,14.6,14.6v162.5c0,8.1-6.6,14.6-14.6,14.6L48.3,447.3L48.3,447.3z M432,313.4c-4.2,4.4-5,11.1-1.8,16.3c0,0.1,4.1,7.1,4.6,16.7c0.7,13.1-5.6,24.7-18.8,34.6c-4.7,3.6-6.6,9.8-4.6,15.4c0,0.1,4.3,13.3-2.7,25.8c-6.7,12-21.6,20.6-44.2,25.4c-18.1,3.9-42.7,4.6-72.9,2.2c-0.4,0-0.9,0-1.4,0c-64.3,1.4-129.3-7-130-7.1h-0.1l-10.1-1.2c0.6-2.8,0.9-5.8,0.9-8.8V270.1c0-4.3-0.7-8.5-1.9-12.4c1.8-6.7,6.8-21.6,18.6-34.3c44.9-35.6,88.8-155.7,90.7-160.9c0.8-2.1,1-4.4,0.6-6.7c-1.7-11.2-1.1-24.9,1.3-29c5.3,0.1,19.6,1.6,28.2,13.5c10.2,14.1,9.8,39.3-1.2,72.7c-16.8,50.9-18.2,77.7-4.9,89.5c6.6,5.9,15.4,6.2,21.8,3.9c6.1-1.4,11.9-2.6,17.4-3.5c0.4-0.1,0.9-0.2,1.3-0.3c30.7-6.7,85.7-10.8,104.8,6.6c16.2,14.8,4.7,34.4,3.4,36.5c-3.7,5.6-2.6,12.9,2.4,17.4c0.1,0.1,10.6,10,11.1,23.3C444.9,295.3,440.7,304.4,432,313.4z"/> \n' + 
									'</g>' + 
								'</svg>';

				return thumbsUp;

			break;

			// icon chevron down
			case 'chevronDown':

				var chevronDown = 	'<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 311.2 203.3" style="enable-background:new 0 0 311.2 203.3;" xml:space="preserve"> \n ' +
										'<g> \n' +
											'<g> \n' +
												'<path style="fill: ' + settings.themeColor + '" class="st0" d="M155.6,110L263.5,0l47.7,45.6L155.6,203.3L0,47.8L45.6,0.1L155.6,110z"/> \n' +
											'</g> \n' +
										'</g> \n' +
									'</svg>';

				return chevronDown;

			break;

			// icon chevron up
			case 'chevronUp':

				var chevronUp = 	'<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 311.2 203.3" style="enable-background:new 0 0 311.2 203.3;" xml:space="preserve"> \n ' +
										'<g> \n' +
											'<g> \n' +
												'<path style="fill: ' + settings.themeColor + '" class="st0" d="M155.6,93.3l-107.9,110L0,157.7L155.6,0l155.6,155.5l-45.6,47.7L155.6,93.3z"/> \n' +
											'</g> \n' +
										'</g> \n' +
									'</svg>';

				return chevronUp;

			break;

			// icon chevron right
			case 'chevronRight':

				var chevronRight = 	'<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 475.7 316.4" style="enable-background:new 0 0 475.7 316.4;" xml:space="preserve"> \n ' +
										'<g> \n' +
											'<g> \n' +
												'<path style="fill: ' + settings.themeColor + '" class="st0" d="M246.8,158.9L136.8,51l45.6-47.7l157.7,155.6L184.6,314.5l-47.7-45.6L246.8,158.9z"/> \n' +
											'</g> \n' +
										'</g> \n' +
									'</svg>';

				return chevronRight;

			break;

			// icon chevron left
			case 'chevronLeft':

				var chevronLeft = 	'<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 475.7 316.4" style="enable-background:new 0 0 475.7 316.4;" xml:space="preserve"> \n ' +
										'<g> \n' +
											'<g> \n' +
												'<path style="fill: ' + settings.themeColor + '" class="st0" d="M340,268.9l-47.7,45.6L136.8,158.9L294.5,3.3L340.1,51l-110,107.9L340,268.9z"/> \n' +
											'</g> \n' +
										'</g> \n' +
									'</svg>';

				return chevronLeft;

			break;

			// icon field
			case 'fields':

				var fields = 	'<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 570.3 385.6" style="enable-background:new 0 0 570.3 385.6;" xml:space="preserve"> \n ' +
										'<g> \n' +
											'<g> \n' +
												'<path style="fill: ' + settings.themeColor + '" class="st0" d="M544.8,100.4c-2-4.8-6.6-7.7-11.6-7.7h-59.1l68.2-69c3.6-3.7,4.7-9.1,2.7-13.7c-2-4.8-6.6-7.7-11.6-7.7H210.1c-3.3,0-6.6,1.3-9.1,3.8L28.9,180.4c-3.6,3.7-4.7,9.1-2.7,13.7c2,4.8,6.6,7.7,11.6,7.7h59.1l-68,69.1c-3.6,3.7-4.7,9.1-2.7,13.7c2,4.8,6.6,7.7,11.6,7.7h323.1c3.3,0,6.6-1.3,9.1-3.8l79.1-80.2h53.8L355.6,357.8h-287l29.1-28.9c2.5-2.3,3.7-5.5,3.7-9c0-3.4-1.3-6.6-3.7-9c-2.3-2.5-5.5-3.7-9-3.7l0,0c-3.3,0-6.5,1.3-9,3.7L29,361.5c-3.7,3.7-4.8,9.1-2.8,13.9s6.6,7.8,11.6,7.8h323.1c3.3,0,6.6-1.3,9.1-3.8l172.3-174.6c3.6-3.7,4.7-9.1,2.7-13.7c-2-4.8-6.6-7.7-11.6-7.7h-59.2l68.2-69.3C545.8,110.6,546.9,105.2,544.8,100.4z M355.6,267.2H68.2l64.4-65.2H361c3.3,0,6.6-1.3,9.1-3.8l79.1-80.2H503L355.6,267.2zM355.6,176.6H68.2L215.5,27.3H503L355.6,176.6z"/> \n' +
											'</g> \n' +
										'</g> \n' +
									'</svg>';

				return fields;

			break;

			// icon owner
			case 'owner':

				var owner = 	'<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 265.3 311.5" style="enable-background:new 0 0 265.3 311.5;" xml:space="preserve"> \n ' +
									'<g> \n' +
										'<g> \n' +
											'<g> \n' +
												'<path style="fill: ' + settings.themeColor + '" class="st0" d="M132.7,163.8c-35.5,0-64.3-55.7-64.3-92c0-35.4,28.8-64.3,64.3-64.3S197,36.3,197,71.8C196.9,108.1,168.1,163.8,132.7,163.8z M132.7,18.4c-29.5,0-53.4,24-53.4,53.4c0,30.6,25,81.1,53.4,81.1c28.5,0,53.4-50.6,53.4-81.1C186.1,42.3,162.1,18.4,132.7,18.4z"/> \n' +
												'<path style="fill: ' + settings.themeColor + '" class="st0" d="M132.7,171.3c-41,0-71.8-60.3-71.8-99.5C60.9,32.2,93.1,0,132.7,0s71.8,32.2,71.8,71.8C204.4,110.9,173.6,171.3,132.7,171.3z M132.7,25.9c-25.3,0-45.9,20.6-45.9,45.9c0,14,5.9,32.9,15,48.2c9.6,16.2,20.9,25.4,30.9,25.4s21.3-9.3,30.9-25.4c9.1-15.3,15-34.2,15-48.2C178.6,46.5,158,25.9,132.7,25.9z"/> \n' +
											'<g> \n' +
										'</g> \n' +
										'<g> \n' +
											'<g> \n' +
												'<path style="fill: ' + settings.themeColor + '" class="st0" d="M252.4,304c-3,0-5.4-2.4-5.4-5.4c0-58.5-51.3-106.1-114.3-106.1S18.4,240.1,18.4,298.6c0,3-2.4,5.4-5.4,5.4s-5.4-2.4-5.4-5.4c0-64.5,56.1-116.9,125.2-116.9S258,234.2,258,298.6C257.8,301.5,255.4,304,252.4,304z"/> \n' +
												'<path style="fill: ' + settings.themeColor + '" class="st0" d="M252.4,311.5c-7.1,0-12.9-5.8-12.9-12.9c0-54.4-47.9-98.6-106.8-98.6S25.9,244.2,25.9,298.6c0,7.1-5.8,12.9-12.9,12.9s-13-5.8-13-13c0-68.6,59.5-124.4,132.7-124.4c73.1,0,132.7,55.8,132.7,124.4C265.3,305.7,259.5,311.5,252.4,311.5z"/> \n' +
											'<g> \n' +
										'</g> \n' +
									'</g> \n' +
								'</svg>';

				return owner;

			break;

			// icon tag
			case 'tags':

				var tags =	'<svg id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 463.55 463.34"> \n' +
								'<path style="fill: ' + settings.themeColor + '" class="cls-1" d="M445.75,256.35l-179.9-180a50.17,50.17,0,0,0-35.6-14.8c-1.1,0-2.2,0-3.3.1l-130.1,8.6a28.39,28.39,0,0,0-26.4,26.4l-3.1,46.2a89.66,89.66,0,0,1-18.6-14.3c-13.9-13.9-22.5-31.2-24.3-48.8-1.7-16.7,3.1-31.6,13.5-42,22.1-22.1,62.8-17.2,90.9,10.8a12,12,0,0,0,17-17c-37.6-37.3-93.6-42.1-125-10.7C5.25,36.45-1.95,58.15.45,82.25c2.3,23.1,13.4,45.6,31.2,63.4a111.67,111.67,0,0,0,33.9,23.3l-3.8,57.9a50.29,50.29,0,0,0,14.7,39l180,180a59.74,59.74,0,0,0,42.6,17.6h0a60.16,60.16,0,0,0,42.6-17.6L446,341.55A60.11,60.11,0,0,0,445.75,256.35Zm-16.9,68.1-104.4,104.4a36,36,0,0,1-25.6,10.6h0a36,36,0,0,1-25.6-10.6l-180-180a26.35,26.35,0,0,1-7.7-20.4l3.5-52.4c2,0.3,4,.6,6,0.8,3,0.3,6,.5,8.9.5,20.5,0,38.8-7.2,52.4-20.8a12,12,0,0,0-17-17c-10.4,10.4-25.3,15.2-42,13.5-2.3-.2-4.5-0.6-6.7-1l3.6-53.6a4.41,4.41,0,0,1,4.1-4.1l130.1-8.6c0.6,0,1.2-.1,1.8-0.1a26.57,26.57,0,0,1,18.7,7.7l179.9,179.9A36.21,36.21,0,0,1,428.85,324.45Z" transform="translate(0 -0.11)"/> \n' +
							'</svg>';

				return tags;

			break;

			// icon views
			case 'views':

				var views =	'<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 475.7 316.4" style="enable-background:new 0 0 475.7 316.4;" xml:space="preserve"> \n' +
								'<g> \n' +
									'<g> \n' +
										'<path style="fill: ' + settings.themeColor + '" class="st0" d="M237.8,316.4c-70.8,0-130.1-36.6-167.3-67.3C31,216.5,0,176.5,0,158.2s31-58.3,70.5-90.9C107.8,36.6,167,0,237.8,0c70.8,0,130.1,36.6,167.3,67.3c39.5,32.6,70.5,72.5,70.5,90.9s-31,58.3-70.5,90.9C367.9,279.8,308.7,316.4,237.8,316.4z M24.4,158.2C26,165.9,47,198.7,88.2,232c33.8,27.4,87.1,60,149.7,60s115.9-32.6,149.7-60c41.1-33.4,62.2-66.2,63.7-73.8c-1.6-7.7-22.6-40.5-63.7-73.8c-33.8-27.4-87.1-60-149.7-60S121.9,57,88.2,84.4C47,117.7,26,150.5,24.4,158.2z M451.3,158.5L451.3,158.5L451.3,158.5z M451.3,157.8L451.3,157.8L451.3,157.8z"/> \n' +
									'</g> \n' +
									'<g> \n' +
										'<path style="fill: ' + settings.themeColor + '" class="st0" d="M237.8,250c-50.6,0-91.8-41.2-91.8-91.8s41.2-91.8,91.8-91.8s91.8,41.2,91.8,91.8S288.5,250,237.8,250zM237.8,90.7c-37.2,0-67.5,30.3-67.5,67.5c0,37.2,30.3,67.5,67.5,67.5c37.2,0,67.5-30.3,67.5-67.5C305.3,121,275,90.7,237.8,90.7z"/> \n' +
									'</g> \n' +
								'</g> \n' +
							'</svg>';

				return views;

			break;

			// icon close
			case 'close':

				var close =	'<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 470.1 470.1" style="enable-background:new 0 0 470.1 470.1;" xml:space="preserve"> \n' +
								'<g> \n' +
									'<g> \n' +
										'<path id="clse-2" class="st0" d="M337.2,30.7L235,133.2L132.9,30.7C109.3-2.2,63.6-9.9,30.7,13.7S-9.8,83,13.7,115.9c4.7,6.6,10.4,12.3,17,17L132.9,235L30.7,337.2c-32.9,23.5-40.5,69.3-17,102.2s69.3,40.5,102.2,17c6.6-4.7,12.3-10.4,17-17L235,337.2l102.2,102.2c23.5,32.9,69.3,40.5,102.2,17s40.5-69.3,17-102.2c-4.7-6.6-10.4-12.3-17-17L337.2,235l102.2-102.2c32.9-23.5,40.5-69.3,17-102.2s-69.3-40.5-102.2-17C347.7,18.4,341.9,24.1,337.2,30.7z"/> \n' +
									'</g> \n' +
								'</g> \n' +
							'</svg>';

				return close;

			break;

			// icon loading
			case 'loading':

				var loading =	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-default"> \n' +
									'<rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect> \n' +
									'<rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(0 50 50) translate(0 -30)"> \n' +
										'<animate attributeName="opacity" from="1" to="0" dur="1s" begin="-1s" repeatCount="indefinite"/> \n' +
									'</rect> \n' +
									'<rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(30 50 50) translate(0 -30)"> \n' +
										'<animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"/> \n' +
									'</rect> \n' +
									'<rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(60 50 50) translate(0 -30)"> \n' +
										'<animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"/> \n' +
									'</rect> \n' +
									'<rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(90 50 50) translate(0 -30)"> \n' +
										'<animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.75s" repeatCount="indefinite"/> \n' +
									'</rect> \n' +
									'<rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(120 50 50) translate(0 -30)"> \n' +
										'<animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"/> \n' +
									'</rect> \n' +
									'<rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(150 50 50) translate(0 -30)"> \n' +
										'<animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"/> \n' +
									'</rect> \n' +
									'<rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(180 50 50) translate(0 -30)"> \n' +
										'<animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.5s" repeatCount="indefinite"/> \n' +
									'</rect> \n' +
									'<rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(210 50 50) translate(0 -30)"> \n' +
										'<animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"/> \n' +
									'</rect> \n' +
									'<rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(240 50 50) translate(0 -30)"> \n' +
										'<animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"/> \n' +
									'</rect> \n' +
									'<rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(270 50 50) translate(0 -30)"> \n' +
										'<animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.25s" repeatCount="indefinite"/> \n' +
									'</rect> \n' +
									'<rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(300 50 50) translate(0 -30)"> \n' +
										'<animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"/> \n' +
									'</rect> \n' +
									'<rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(330 50 50) translate(0 -30)"> \n' +
										'<animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"/> \n' +
									'</rect> \n' +
								'</svg>';
				return loading;

		}
	}




	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	/* ::::::::::::: */ callBehanceProjectsList(); /* ********* FIRE THE ENTIRE PLUGIN ********** */
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://


	

};





