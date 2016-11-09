jQuery(document).ready(function() {

    jQuery(".move-to-top").appendTo("#top-and-first-wrapper");
    jQuery(".move-into-top").appendTo("section#about > div.container > div.row");

    jQuery("#search-api-page-search-form").wrap("<div class='col-md-10 col-md-offset-1'></div>");
    jQuery("#block-workbench-block").addClass("container");
    jQuery("ul.tabs.primary").addClass("nav nav-tabs").removeClass("tabs").removeClass("primary");
  // Conditional form logic
    // Set initial state, hide it...
    jQuery('.drupal-version-list').toggleClass('sr-only');
    jQuery('.drupal-version-checkbox').change(function() {
        // toggle on change
        jQuery('.drupal-version-list').toggleClass('sr-only');
        // TODO: fade in rather than just appear/hide
    });

  // Add extra sites btn functionality
    jQuery('.site-info-add').click(function() {
        // duplicate .site-info form element
        var htmlToInsert = jQuery('.site-info')[0].outerHTML;
        // increment the id number
        var numItems = jQuery('.site-info').length;
        var numItemsNext = numItems + 1;
        htmlToInsert = htmlToInsert.replace(/1\"/g, numItemsNext+'"');
        // append
        jQuery('.site-info').last().after( htmlToInsert );
        return false;
    });

  // Make left and right split same height, noting the either may be shorter
    jQuery( ".split" ).each(function() {
        if(jQuery(window).width() > 993) {
            height1 = jQuery('.section-one', this).height();
            height2 = jQuery('.section-two', this).height();
            if (height1 > height2) {
                rightHeight = jQuery('.section-one', this).height();
                jQuery('.section-two', this).height(rightHeight);
            } else {
                rightHeight = jQuery('.section-two', this).height();
                jQuery('.section-one', this).height(rightHeight);
            }
        }
    });
    jQuery('.fancyCounter').each(function () {
        var isInView = isElementVisible(jQuery(this));
        if(isInView && !jQuery(this).hasClass('counted') && !jQuery(this).hasClass('counting')){
            jQuery(this).addClass('counting');
            startCounter(this);
        }
    });

    jQuery('div.region-content [class^="icon-"], div.region-content .fancyCounter').each(function () {
        jQuery(this).addClass("do-fade")
        var isInView = isElementVisible(jQuery(this));
        if(isInView && !jQuery(this).hasClass('faded')){
            jQuery(this).addClass('faded');
        }
    });

    jQuery('a').filter(function () {
        return this.hostname && this.hostname !== location.hostname;
    }).append('<span class="sr-only"> external resource</span>');

    jQuery(window).scroll(function () {
        jQuery('.fancyCounter').each(function () {
            var isInView = isElementVisible(jQuery(this));
            if (isInView && !jQuery(this).hasClass('counted') && !jQuery(this).hasClass('counting')) {
                jQuery(this).addClass('counting');
                startCounter(this);
            }
        });

        jQuery('div.region-content [class^="icon-"], div.region-content .fancyCounter').each(function () {
            var isInView = isElementVisible(jQuery(this));
            if (isInView && !jQuery(this).hasClass('faded')) {
                jQuery(this).addClass('faded');
            }
        });

    });




    // stripe style menu
  	function morphDropdown( element ) {
  		this.element = element;
  		this.mainNavigation = this.element.find('.main-nav');
  		this.mainNavigationItems = this.mainNavigation.find('.has-dropdown');
  		this.dropdownList = this.element.find('.dropdown-list');
  		this.dropdownWrappers = this.dropdownList.find('.dropdown');
  		this.dropdownItems = this.dropdownList.find('.content');
  		this.dropdownBg = this.dropdownList.find('.bg-layer');
  		this.mq = this.checkMq();
  		this.bindEvents();
  	}

    morphDropdown.prototype.checkMq = function() {
    	// check screen size
    	var self = this;
    	return window.getComputedStyle(self.element.get(0), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "").split(', ');
    };

    morphDropdown.prototype.bindEvents = function() {
    	var self = this;
    	// hover over an item in the main navigation
    	this.mainNavigationItems.mouseenter(function(event){
    		// hover over one of the nav items -> show dropdown
    		self.showDropdown(jQuery(this));
    	}).mouseleave(function(){
    		setTimeout(function(){
    			// if not hovering over a nav item or a dropdown -> hide dropdown
    			if( self.mainNavigation.find('.has-dropdown:hover').length == 0 && self.element.find('.dropdown-list:hover').length == 0 ) self.hideDropdown();
    		}, 50);
    	});

    	// hover over the dropdown
    	this.dropdownList.mouseleave(function(){
    		setTimeout(function(){
    			// if not hovering over a dropdown or a nav item -> hide dropdown
    			(self.mainNavigation.find('.has-dropdown:hover').length == 0 && self.element.find('.dropdown-list:hover').length == 0 ) && self.hideDropdown();
    		}, 50);
    	});

    	// click on an item in the main navigation -> open a dropdown on a touch device
    	this.mainNavigationItems.on('touchstart', function(event){
    		var selectedDropdown = self.dropdownList.find('#'+jQuery(this).data('content'));
    		if( !self.element.hasClass('is-dropdown-visible') || !selectedDropdown.hasClass('active') ) {
    			event.preventDefault();
    			self.showDropdown(jQuery(this));
    		}
    	});

    	// on small screens, open navigation clicking on the menu icon
    	this.element.on('click', '.nav-trigger', function(event){
    		event.preventDefault();
    		self.element.toggleClass('nav-open');
    	});
    };

    morphDropdown.prototype.showDropdown = function(item) {
    	this.mq = this.checkMq();
    	if( this.mq == 'desktop') {
    		var self = this;
    		var selectedDropdown = this.dropdownList.find('#'+item.data('content')),
    			selectedDropdownHeight = selectedDropdown.innerHeight(),
    			selectedDropdownWidth = selectedDropdown.children('.content').innerWidth(),
    			selectedDropdownLeft = item.offset().left + item.innerWidth()/2 - selectedDropdownWidth/2;

    		// update dropdown position and size
    		this.updateDropdown(selectedDropdown, parseInt(selectedDropdownHeight), selectedDropdownWidth, parseInt(selectedDropdownLeft));
    		// add active class to the proper dropdown item
    		this.element.find('.active').removeClass('active');
    		selectedDropdown.addClass('active').removeClass('move-left move-right').prevAll().addClass('move-left').end().nextAll().addClass('move-right');
    		item.addClass('active');
    		// show the dropdown wrapper if not visible yet
    		if( !this.element.hasClass('is-dropdown-visible') ) {
    			setTimeout(function(){
    				self.element.addClass('is-dropdown-visible');
    			}, 10);
    		}
    	}
    };

    morphDropdown.prototype.updateDropdown = function(dropdownItem, height, width, left) {
    	this.dropdownList.css({
    	    '-moz-transform': 'translateX(' + left + 'px)',
    	    '-webkit-transform': 'translateX(' + left + 'px)',
    		'-ms-transform': 'translateX(' + left + 'px)',
    		'-o-transform': 'translateX(' + left + 'px)',
    		'transform': 'translateX(' + left + 'px)',
    		'width': width+'px',
    		'height': height+'px'
    	});

    	this.dropdownBg.css({
    		'-moz-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
    	    '-webkit-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
    		'-ms-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
    		'-o-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
    		'transform': 'scaleX(' + width + ') scaleY(' + height + ')'
    	});
    };

    morphDropdown.prototype.hideDropdown = function() {
    	this.mq = this.checkMq();
    	if( this.mq == 'desktop') {
    		this.element.removeClass('is-dropdown-visible').find('.active').removeClass('active').end().find('.move-left').removeClass('move-left').end().find('.move-right').removeClass('move-right');
    	}
    };

    morphDropdown.prototype.resetDropdown = function() {
    	this.mq = this.checkMq();
    	if( this.mq == 'mobile') {
    		this.dropdownList.removeAttr('style');
    	}
    };

    var morphDropdowns = [];
    if( jQuery('.cd-morph-dropdown').length > 0 ) {
    	jQuery('.cd-morph-dropdown').each(function(){
    		// create a morphDropdown object for each .cd-morph-dropdown
    		morphDropdowns.push(new morphDropdown(jQuery(this)));
    	});

    	var resizing = false;

    	// on resize, reset dropdown style property
    	updateDropdownPosition();
    	jQuery(window).on('resize', function(){
    		if( !resizing ) {
    			resizing =  true;
    			(!window.requestAnimationFrame) ? setTimeout(updateDropdownPosition, 300) : window.requestAnimationFrame(updateDropdownPosition);
    		}
    	});

    	function updateDropdownPosition() {
    		morphDropdowns.forEach(function(element){
    			element.resetDropdown();
    		});

    		resizing = false;
    	};
    }



}); // end document ready


function startCounter(theObject) {
    jQuery(theObject).prop('Counter',0).animate({
        Counter: jQuery(theObject).text()
    }, {
        duration: 1300,
        easing: 'swing',
        step: function (now) {
            jQuery(theObject).text(Math.ceil(now));
        },
        complete: function () {
            jQuery(theObject).addClass("counted");
            jQuery(theObject).removeClass("counting");
        }
    });
}



function isElementVisible(theElement) {
    var TopView = jQuery(window).scrollTop();
    var BotView = TopView + jQuery(window).height();
    var TopElement = jQuery(theElement).offset().top;
    var BotElement = TopElement + jQuery(theElement).height();
    // return ((BotElement <= BotView) && (TopElement >= TopView));
    return (((BotElement <= BotView) && (TopElement >= TopView)) || (!(BotElement <= TopView) && !(TopElement >= BotView)));
}



// Not used atm
// function priceCalc() {
//   // Setup vars
//   pageViews = jQuery('#page-views').val();
//   siteCount = jQuery('#number-of-sites').val();
//
//   // Calculate it:
//   totalAnnualCost = 199; // for now.....
//   totalSetupCost = 88;  // for now.....
//
//   // Display it
//   jQuery('#calcForm').addClass('fade-out');
//   jQuery('#calcResults #totalAnnualCost').text(totalAnnualCost);
//   jQuery('#calcResults #totalSetupCost').text(totalSetupCost);
//   jQuery('#calcResults #calcHeading').text('Your estimated total costs are');
//   jQuery('#calcResults').removeClass('sr-only');
//   jQuery('#calcResults').removeClass('fade-out');
//   jQuery('#calcResults').addClass('fade-in');
//
//   // Stop form submission
//   return false;
//   e.preventDefault();
// }
//
// function priceReCalc() {
//   // Display it
//   jQuery('#calcForm').removeClass('fade-out');
//   jQuery('#calcResults').removeClass('fade-in');
//   jQuery('#calcResults').addClass('fade-out');
//   jQuery('#calcResults #calcHeading').text('Calculate your costs');
//   jQuery('#calcForm').addClass('fade-in');
//   jQuery('#calcResults').addClass('sr-only');
//
//   // Stop anchor link loading
//   return false;
//   e.preventDefault();
// }
