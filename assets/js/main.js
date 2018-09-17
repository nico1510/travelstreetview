"use strict";
jQuery(document).ready(function ($) {

//for Preloader

    $(window).load(function () {
        $("#loading").fadeOut(500);
    });

    var counter = 0;
    setInterval(() => {
        $("#image").fadeTo(1000,0.30, function() {
            $("#image").attr("src",'assets/images/hello-phone' + counter % 3 + '.png');
        }).fadeTo(500,1);
        counter++;
    }, 4000);


    /*---------------------------------------------*
     * Mobile menu
     ---------------------------------------------*/
    $('#navbar-menu').find('a[href*=#]:not([href=#])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            var hash = this.hash;
            $.find('#home, #features, #product').forEach(function (section) {
                hash === "#privacy" ? $(section).hide() : $(section).show();
            });
            $.find('#privacy').forEach(function (section) {
                hash === "#privacy" ? $(section).show() : $(section).hide();
            });
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: (target.offset().top - 70)
                }, 1000);
                if ($('.navbar-toggle').css('display') != 'none') {
                    $(this).parents('.container').find(".navbar-toggle").trigger("click");
                }
                return false;
            }
        }
    });



    /*---------------------------------------------*
     * WOW
     ---------------------------------------------*/

    var wow = new WOW({
        mobile: false // trigger animations on mobile devices (default is true)
    });
    wow.init();

// magnificPopup

    $('.popup-img').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        }
    });

    $('.video-link').magnificPopup({
        type: 'iframe'
    });


//---------------------------------------------
// Scroll Up 
//---------------------------------------------

    $('.scrollup').click(function () {
        $("html, body").animate({scrollTop: 0}, 1000);
        return false;
    });

    if (location.hash) $(`a[href$="${location.hash}"]`).trigger('click');


    //End

});



