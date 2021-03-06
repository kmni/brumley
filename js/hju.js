// Place any jQuery/helper plugins in here.
jQuery.fn.center = function () { this.css("position","absolute"); this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px"); this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px"); return this; }
jQuery.fn.preload = function() { this.each(function(){ var name = this; $('<img src="'+this+'" />').load(function(){/*console.log(name+' loaded');*/}); }); }

var hju	= {
	pageOverlay:		$('<a class="page_overlay" href="" title="Close it"></a>'),
	dialogBox:			$('<div id="dialog_box"><div class="inside"><img src="/img/ajax-loader.gif" alt="loading ..." width="16" height="16"></div></div>'),
	dialogBoxContent:	$('#dialogBox').children('.inside'),
	initDialogBox:	function(){
		if ($('*[rel="dialog_box"]').length > 0)
		{
			$(document).on('click', '*[rel="dialog_box"]', function(e){
				var a		= $(this),
					rel		= a.attr('rel') || false,
					url		= a.attr('href'),
					source	= a.attr('data-source') || 'href',
					title	= a.attr('title') ? a.attr('title') : false,
					content	= '';

				if (source == 'href')
					$.ajax({type: 'POST', url: url, data: {}}).done(function(data){$('#dialog_box .inside').html(data);hju.dialogBox.center();}).fail(function(){$('#dialog_box .inside').html('<div class="error">Loading failed.<br> Try it later</div>');});
				else if (source == 'image')
				{
					title	= title ? '<span>'+title+'</span>' : '';
					content	= '<div class="image_dialog">'
						+'<div class="top_links clearfix"><a class="close" href="" title="Close it">[X]</a></div>'
						+'<div class="content">'
						+'<img src="'+url+'">'+title
						+'</div> <!--// .content -->'
						+'</div> <!--// .image_dialog -->';
				}
				else
					content	= $(source).html();

				if ($('#dialog_box').length == 0)
				{
					var config = {content: content, position: {x: a.offset().left, y: a.offset().top}, offset: {x: 0, y: 0}};
					hju.showDialogBox(config);
				}
				return false;
			});
		}
	},
	showDialogBox:	function(config){
		console.log(config);
		if (config.cls && config.cls != '')	hju.dialogBox.addClass(config.cls);
		if (config.content && config.content != '') hju.dialogBox.children('.inside').html(config.content);
		
		/*hju.dialogBox.css({
			'position':	'absolute',
			'left':		config.position.x+config.offset.x,
			'top':		config.position.y-hju.dialogBox.outerHeight()+config.offset.y,
			'z-index':	'1000'
		});*/
		hju.showOverlay();
		$('body').append(hju.dialogBox);
		hju.dialogBox.center();
	},
	hideDialogBox:	function(){hju.dialogBoxContent.html(''); $('#dialog_box .inside').html(''); $('#dialog_box').remove();},
	showOverlay:	function(){hju.pageOverlay.css({'width': $(document).width()+'px', 'height': $(document).height()+'px'}); $('body').append(hju.pageOverlay);},
	hideOverlay:	function(){$('.page_overlay').remove();},
	mobileNavi:	function(){
		if ($('.mobile_navi').length)
		{
			$('.mobile_navi').on('change', function(){
				var select		= $(this),
					value		= (select.val() && select.val() != 0) ? select.val() : false;
					
				if (value)
				{
					// console.log(value);
					window.location.href	= value;
				}
			});
		}
	},
	accordion:	function(){
		if ($('.nav-list li.has_children').length)
		{
			$('.nav-list li.has_children > a').on('click', function(){
				var a	= $(this),
					li	= a.parents('.has_children');
				if (li.hasClass('expanded'))
					li.removeClass('expanded');
				else
					li.addClass('expanded');

				return false;
			});
		}
	},
	masonry:	function(){
		if ($('.horses_list .list').length > 0)
		{
			$horses_list	= $('.horses_list .list');
			// once loaded
	        $horses_list.imagesLoaded(function(){
	        	if ($('.slideshow').length > 0)
				{
					// initialize Masonry
		        	$horses_list.masonry({
			            itemSelector: 	'div',
			            'gutter':     	0,
			            isFitWidth:   	false,
			            singleMode:   	false,
			            isAnimated:   	false
		        	});
					$slideshow	= $('.slideshow');
					$slideshow.cycle({timeout: 3000, pauseOnHover: true, log: false});
					setTimeout(function(){
						$horses_list.masonry('layout');
					}, 200);
				}
				else
				{
					// initialize Masonry
		        	$horses_list.masonry({
			            itemSelector: 	'div',
			            'gutter':     	0,
			            isFitWidth:   	false,
			            singleMode:   	false,
			            isAnimated:   	false
		        	});
				}
	        });
		}
	},
	lightbox: function(){
	    $('.colorbox').each(function(){
	    	var a	= $(this),
	    		rel	= a.attr('rel') || false;
	    	a.colorbox({rel:rel, current: '{current} / {total}'});
	    });
    },
    galleryPagination:	function(parent, item_selector){
    	var itemsCount		= $(parent + ' ' + item_selector).size();
		var itemsPerPage	= $(parent).attr('data-items-per-page') ? $(parent).attr('data-items-per-page') : 6;
		var itemsPassed		= 0;
		$(parent + ' ' + item_selector).each(function(){
			if (++itemsPassed > itemsPerPage)
			{
				$(this).addClass('hidden');
			}
		});

		if (itemsCount > itemsPerPage)
			hju.createPagination({parent: '.gallery_pagination', class: 'more_reviews', total: itemsCount, limit: itemsPerPage, title: 'Show more'});

		$('a.more_reviews').on('click', function(){
			itemsPassed		= 0;
			var page		= parseInt($(this).attr('href').replace('#', '')),
				pages		= Math.round(itemsCount/itemsPerPage);
			if (page > 0)
			{
				$('a.more_reviews').removeClass('active');
				console.log($('a[href="#'+page+'"]'));
				$('a[href="#'+page+'"]').addClass('active');
				// prev link
				if (page > 1)
				{
					$('a.prev').removeClass('disabled').attr('href', '#'+(page-1));
				}
				else
					$('a.prev').addClass('disabled').attr('href', '#1');
				// next link
				if (page < pages)
				{
					$('a.next').removeClass('disabled').attr('href', '#'+(page+1));
				}
				else
					$('a.next').addClass('disabled').attr('href', '#'+pages);

				$(parent + ' ' + item_selector).addClass('hidden');
				$(parent + ' ' + item_selector).each(function(){
					++itemsPassed;
					if (itemsPassed > ((page-1)*itemsPerPage) && itemsPassed <= page*itemsPerPage)
					{
						$(this).removeClass('hidden');
					}
				});
			}
			else
				console.log('Invalid page number: '+page);
			return false;
		});
    },
    createPagination:	function(config){
		config.id		= config.id || false;
		config.parent	= config.parent || false;
		config.total	= config.total || 0;
		config.limit	= config.limit || 10;
		config.limit	= Math.max(1, config.limit);
		config.title	= config.title || '';
		config.class	= config.class || '';

		if (!config.parent || !$(config.parent).length)
			console.log('Parental container not found for pagination!');
		else if (config.total <= 0)
			console.log('Total records is lower than or equal zero!');
		else
		{
			var parent	= $(config.parent);
			var pages	= Math.round(config.total/config.limit);
			parent.append('<a class="'+config.class+' prev disabled" href="#1" title="Previous page"><img src="img/s.gif"></a>');
			for (var i=1; i <= pages; i++)
			{
				parent.append('<a class="'+config.class+''+(i == 1 ? ' active' : '')+'" href="#'+i+'" title="'+config.title+'">'+i+'</a>');
			}
			parent.append('<a class="'+config.class+' next" href="#2" title="Next page"><img src="img/s.gif"></a>');
		}
	},
	synchronizeColumnsHeight:	function(){
		$(document).imagesLoaded(function(){
			if ($('body').data('synchronize-columns') == true)
			{
				var	leftcol				= $('.leftcol'),
					contentcol			= $('.contentcol'),
					leftcol_height		= leftcol.height(),
					contentcol_height	= contentcol.height(),			
					diff_height			= leftcol_height - contentcol_height;
				// console.log('leftcol height: '+leftcol_height);
				// console.log('contentcol height: '+contentcol);
				// console.log('height diff leftcol-contencol: '+diff_height);
				if (diff_height < 0)
				{
					leftcol.css({'height': (leftcol_height+Math.abs(diff_height))+'px'});
				}
			}
		});
	},
	handleSidebans:	function(){
		if ($('div.sideban').length > 0)
		{
			var width	= $(window).width();
			if (width < 1158)
			{
				// console.log(width+' mensi jak 1158');
				var ban_width	= Math.min(120, parseInt((width - 918)/2));
				// console.log('banWidth '+ban_width);
				if (ban_width < 50)
					$('div.sideban').addClass('noscreen');
				else
				{
					$('div.sideban').removeClass('noscreen');
					$('div.sideban').css({width: ban_width+'px', marginLeft: -ban_width-9+'px'});
					$('div.sideban.right').css({marginLeft: '0px', marginRight: -ban_width-9+'px'});
					// $('div.sideban a').css({width: (ban_width-20)+'px'});
				}
			}
			else
			{
				$('div.sideban').removeClass('noscreen');
				$('div.sideban').css({width: '120px', marginLeft: '-129px'});
				$('div.sideban.right').css({marginRight: '-129px'});
				// $('div.sideban a').css({width: '100%'});
			}
		}
	},
	productGallery:	function(){
		if ($('div.imagebox').length > 0 && $('div.thumbs a').length > 0)
		{
			var imagebox	= $('div.imagebox'),
				links		= $('div.thumbs a'),
				urls		= Array();

			// preload images
			urls.push('/img/ajax-loader-small.gif');
			links.each(function(){
				var link	= $(this),
					href	= link.attr('href');
				urls.push(href);
			});
			$(urls).preload();
			
			links.on('click', function(){
				var link	= $(this),
					href	= link.attr('href');
				if (imagebox.find('img').length > 0)
				{
					var img	= imagebox.find('img');
					links.removeClass('active');
					link.addClass('loading');
					$('<img src="'+href+'"/>').load(function(){
						link.removeClass('loading').addClass('active');
						img.fadeOut(300, function(){
							img.attr('src', href).fadeIn(300);
						});
					});
				}
				return false;
			});
		}
	},
	init:	function(){
		// dialog boxes
		hju.initDialogBox();
		hju.mobileNavi();
		hju.accordion();
		hju.masonry();
		hju.lightbox();
		hju.handleSidebans();
		hju.productGallery();
		// setTimeout(hju.synchronizeColumnsHeight, 200);
		// hju.galleryPagination('.gallery_list', 'a.colorbox');
		$(document).on('click', '.page_overlay', function(){hju.hideOverlay(); hju.hideDialogBox(); hju.content = ''; return false;});
		$(document).on('click', '#dialog_box a.close', function(){hju.hideOverlay(); hju.hideDialogBox(); hju.content = ''; return false;});
		$(window).on('resize', function(){hju.handleSidebans()});	

		$(document).bind('keydown', function(e) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if ($.inArray(code, [27]) > -1)
			{
				hju.hideOverlay();
				hju.hideDialogBox();
				hju.content = '';
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		});
	}
};
$(window).load(function(){
	hju.init();
});