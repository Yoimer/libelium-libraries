/* js Cooking-Hacks */


var $j = jQuery.noConflict();
$j(document).ready(function ($) {


    //Tutorials: Show | hide code
    $('.code button').click(function(){

        //Toggle visibility
        $(this).parent().next().toggle('slow');

        //Change button text
        if($(this).text() == 'Show code'){
            //$('.code_tools').next().height('auto');
            //$('.code_tools').next().animate({height : 'auto'}, 500);

            $(this).text('Hide code');
        }
        else{
            $(this).text('Show code');
        }
    });

    //Initial state for collapsed elements
    $('.code_tools').next().hide();

    //Select all the text
    jQuery.fn.selectText = function(){
        var doc = document
                , element = this[0]
                , range, selection
                ;
        if (doc.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        } else if (window.getSelection) {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    //Button for select all
    $('.cms_page').on('click', '.action_all', function(){
        $(this).parent().prev().selectText();
    });

    //Add buttons for copy and select all
    /*
     $('.code').append('<div class="code_tools_bottom">' +
     '<a class="btn btn-info btn-xs action_all">Select all</a>&nbsp;&nbsp;' +
     '<a class="btn btn-info btn-xs action_download">Download</a>' +
     '</div>');
     */
    $('.code').append('<div class="code_tools_bottom">' +
            '<a class="btn btn-info btn-xs action_all">Select all</a>&nbsp;&nbsp;' +
            '</div>');


    /*
     //Lazyload ##########################
     /*
     $('.cms_page img').each(function(index){
     var img_src = $(this).attr('src');
     $(this).attr('data-original', img_src);
     $(this).attr('width', '200px');
     $(this).attr('height', '200px');
     });
     
     $.getScript('//cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min.js',function(){
     $('.cms_page img').lazyload({});
     });
     */



    //Gallery ##########################
    //wrap the img with the code to open the lightbox
    $('.lb').each(function(index){
        //Get big image name
        var photo_small = $(this).attr('data-src') ? $(this).attr('data-src') : $(this).attr('src');
        var photo_big = photo_small.replace('_small','_big');

        //Photo title
        var photo_title = '';
        if($(this).attr('alt')){
            photo_title = $(this).attr('alt');
        }

        //Thumbnail border
        var thumbnail_class = '';
        if($(this).hasClass('border_yes')){
            thumbnail_class = 'thumbnail';
        }

        //Wrap image with a link
        $(this).wrap(function(){
            return '<a id="img_'+ index +'" href="'+ photo_big +'" class="lb_photo '+thumbnail_class+'" rel="set_1" title="'+ photo_title +'"></a>';
        });
    });


    $('.lb_photo').fancybox({
        openEffect: 'fade',
        closeEffect: 'fade',
        beforeShow: function() {
            // Render tweet button
            //console.log(this);
            this.title += '<div><a href="#img_'+ this.index +'" class="btn btn-primary btn-xs" onclick="jQuery.fancybox.close()">Go to image in the document</a></div>';
        },

        helpers: {
            title: {
                type: 'inside'
            }
        }
    });

    $('.lb-gallery a').fancybox({
        openEffect: 'fade',
        closeEffect: 'fade',

        helpers: {
            title: {
                type: 'inside'
            }
        }
    });

    //Go to index ##########################
    $('.section_title h2').each(function(index){
        if(!$(this).hasClass('nogotoindex')){
            var tmp_text;
            tmp_text = $(this).html() +' <a href="#index" class="pull-right goto">Go to index <span class="glyphicon glyphicon-arrow-up"></span></a>';
            $(this).html(tmp_text);
        }
    });

    //Text justified
    $('.cms_page p').not('.no_justify').addClass('text-justify');

    //Code highlight ##########################
    jQuery('.code pre').each(function(i, e) { hljs.highlightBlock(e) });

    //Remove wishlist and compare buttons
    $('.link-compare').remove();
    $('.link-wishlist').remove();

    removeColShoppingCart($('th.cart-edit'));
    removeColShoppingCart($('th.wishlist'));
    function removeColShoppingCart($el) {
        if ($el.length <= 0) {
            return;
        }
        var index = $el.index();
        var $trs = $el.parents('table').find('tbody tr');
        $trs.each(function(i, val) {
            var $tds = $(val).find('td');
            $tds.get(index).remove();
        });
        $el.remove();
    }

    //Megamenu
    //Replace text
    $('#yt_sidenav span:first').text('Shop by Components');

    $('#yt_sidenav li.level0 > a + ul').after ('<span class="touch-item change">open</span>');	//header

    if ($('.is-blog').length > 0) {
        $('#yt_sidenav li.level0 > a + ul').hide();
        $('.touch-item.change').removeClass('change');
        $('.touch-item.change').click();
        //console.log('blog');
        //$('.is-blog').on('click', '#fffff', fumc)
    }

    //Add class parent-item
    $('.icon_appears-parent').addClass('parent-item');

    //Search results
    //$('.note-msg').addClass('<div class="alert alert-warning"></div>');

    //Product page
    // Short Description
    if($('.short-description').html() != null) {
        var read_more = '';
        if($('.short-description').html().length > 1200){
            read_more = ' [...]';
        }
        //console.log(read_more);
        $('.short-description').html($('.short-description').html().substring(0, 1200).split(" ").slice(0, -1).join(" "));
        $('.short-description').html($('.short-description').html() + read_more);
    }


    var bundle_flag = $('.price-as-configured');
    if (bundle_flag.length > 0) {

        $('<p class="price-box items-separately"><span class="old-price">Price of the items separately: <span class="price"></span></span></p>').insertAfter('.product-shop > .price-box');


        var updateBundleRealPrice = function() {

            var total = 0;
            $('#product_addtocart_form :checked').each(function(count, el) {

                var $el = $(el);
                var realprice = $el.data('realprice');
                var multiply_by = $el.parents('dd').find('.qty-holder input').val();
                var multiply_factor = 1;
                if (!isNaN(multiply_by)) {
                    multiply_factor = parseFloat(multiply_by);
                }

                if (realprice && !isNaN(realprice)) {
                    total = +(Math.round( parseFloat(total) + (parseFloat(realprice) * multiply_factor)  + "e+2")  + "e-2");
                }
            });

            $('.old-price .price').text('€' + total);

            if (parseFloat($('.full-product-price .price').first().text().substring(1)) >= total) {
                $('.old-price').hide();
            }

        };

        updateBundleRealPrice();
        $('#product_addtocart_form :input').on('change', updateBundleRealPrice);


    }


    // Discount-kit
    var discount = $('#discount-product');
    if (discount.length > 0) {

        discount.hide();

        var total_discounted = discount.data('discount');
        var target_discounted = $('.price-as-configured .price');

        function calculate_old_price(new_price, discount) {
            var old_price;

            old_price = (parseFloat(new_price) * 100) / (100 - parseFloat(discount));
            return +(Math.round(parseFloat(old_price) + "e+2")  + "e-2");
        };


        $('<span class="old-price"><span class="price"></span></span>').insertAfter('.price-as-configured .full-product-price');

        var updatePrice = function() {
            var new_price_text = target_discounted.text();
            var new_price = new_price_text.substr(1);
            var old_price = calculate_old_price(new_price, total_discounted);
            // target_discounted.text('€' + old_price);
            //console.log(old_price);

            $('.old-price .price').text('€' + old_price);
        };

        $('#product_addtocart_form :input').on('change', updatePrice);

        $('.items-separately').hide();

        updatePrice();

    }

    // Disable stock qty for allow shop on demand
    $('input[name="qty_stock"]').remove();

    //Banners Sec home
    //$('#banner_sec_left').text(zzz);

    //Tutorial Search
    //Clean the tag selector
    $j('.input_tag').attr("checked",false)

    $('#modal-privacy-policy').fancybox({
        maxWidth	: 800,
        maxHeight	: 600,
        fitToView	: false,
        width		: '70%',
        height		: '70%',
        autoSize	: false,
        closeClick	: false,
        openEffect	: 'none',
        closeEffect	: 'none'
    });

    //Newsletter
    $("#newsletter-validate-detail").submit(function(e){
        e.preventDefault();

        if (!$('[name=privacy-accept]').is(':checked')) {
            $("#newsletter_status").text("You have to accept the privacy policy.");
            $("#newsletter_status").css("color", "red");
            return;
        }

        $.post($(this).attr('action'), $(this).serialize(),
            function(data) {
                if(data)
                    {
                    if(data=="Some fields are missing.")
                        {
                            $("#newsletter_status").text("Please fill in your name and email.");
                            $("#newsletter_status").css("color", "red");
                        }
                    else if(data=="Invalid email address.")
                        {
                            $("#newsletter_status").text("Your email address is invalid.");
                            $("#newsletter_status").css("color", "red");
                        }
                    else if(data=="Invalid list ID.")
                        {
                            $("#newsletter_status").text("Your list ID is invalid.");
                            $("#newsletter_status").css("color", "red");
                        }
                    else if(data=="Already subscribed.")
                        {
                            $("#newsletter_status").text("You're already subscribed!");
                            $("#newsletter_status").css("color", "red");
                        }
                        else
                        {
                            $("#newsletter_status").text("You're subscribed!");
                            $("#newsletter_status").css("color", "green");
                        }
                    }
                    else
                    {
                        $("#newsletter_status").text("Sorry, unable to subscribe. Please try again later!");
                        $("#newsletter_status").css("color", "red");
                    }
                }
        );
    });
    $("#newsletter-validate-detail").keypress(function(e) {
        if(e.keyCode == 13) {
            e.preventDefault();
            $(this).submit();
        }
    });
    $("#submit-btn").click(function(e){
        e.preventDefault();
        $("#newsletter-validate-detail").submit();
    });

    // Prevent jump on menu show
    $('a.btn-sambar').attr('href', '#');

    // Responsive
    if ($(window).width() < 990) {
        $('.css-1column-parent.other-toggle.sm_megamenu_lv1.sm_megamenu_drop.parent').removeClass('parent');

        $('.sm_megamenu_wrapper_horizontal_menu.sambar .btn-sambar').on('click', function () {
            if ($('.sm_megamenu_lv1.showSidebar').length === 0) {
                $('.sm_megamenu_lv1:first').clone().insertBefore('.sm_megamenu_lv1:first').addClass('showSidebar');
                $('.showSidebar .sm_megamenu_title').text('Shop');
            }
        });

        $('.sambar-inner').on('click', '.showSidebar', function (e) {
            e.preventDefault();
            $('#yt_wrapper #yt_left').attr('style', 'display: block !important');
            $('a.btn-sambar').click();
            $('.yt-left-wrap .sm_megamenu_wrapper_vertical_menu .btn-sambar:first').attr('style', 'display: block !important').html('<span class="hide-sidebar">X</span>');
            $('.yt-left-wrap .sm_megamenu_wrapper_vertical_menu .btn-sambar:gt(0)').attr('style', 'display: none !important');
        });


        $('.yt-left-wrap').on('click', '.hide-sidebar', function () {
            $('#yt_wrapper #yt_left').attr('style', 'display: none !important');

        });
    }
    // Show child categories on menu
    $(window).on('load', function() {
        $('.level1.parent.active .touch-item').click();
        //
        $('.vp').height("+=15");

        //Remove wishlist and compare buttons
        $('.link-compare').remove();
        $('.link-wishlist').remove();
    });


    /* REMOVE SPACES FROM PRODUCT PAGE IF EMPTY */
    var product_image_slider = $('.more-views.slide-gallery');
    if (product_image_slider.length > 0) {
        var products = product_image_slider.find('a.cloud-zoom-gallery');

        var toRemove = true;
        products.each(function(i, val) {
            //console.log($(val));
           if (!$(val).hasClass('actived')) {
               toRemove = false;
           }
        });

        if (toRemove) {
            product_image_slider.remove();
        }

    }

    var product_review = $('.customer-review');
    if (product_review.length > 0) {
        if (jQuery.trim(product_review.text()) === '') {
            product_review.remove();
        }
    }

    $('.availability.in-stock span').on('click', function() {
        var target = '/skin/frontend/cooking/default/templates/availability.php';
        window.open(target,'_blank','width=400,height=700,30,30');
    });

    $('body').on('change', '#product-options-wrapper .bundle-select', function() {
        $('.bundle-plattform-description').hide();
        var id = $(this).val();
        $('#plattform-' + id).show();

    });



    /* Searchbox navigate with arrows */
    //$('.form-search').on('change', '#query_text', function() {
    //    $('#search').attr('search_item_selected',-1);
    //    console.log('asd');
    //});
    $('#search').keydown(function(e){
        if((e.which != 38) && (e.which != 40)){
            $('#search').attr('search_item_selected',-1);
        }
        else if(e.which == 40 && ($('#search').attr('search_item_selected') < $('.product_suggest li[data-url]').length - 1)) {
            var new_value = $('#search').attr('search_item_selected');
            /* Increase index*/
            $('#search').attr('search_item_selected', parseInt(new_value) + 1);

        }
        else if(e.which == 38 && ($('#search').attr('search_item_selected') > 0)) {
            var new_value = $('#search').attr('search_item_selected');
            /* Decrease index*/
            $('#search').attr('search_item_selected', parseInt(new_value) - 1);

        }
        var selected_item = $('#search').attr('search_item_selected');
        //console.log(selected_item);
        //console.log($('.product_suggest li[data-url]:eq('+selected_item+')').attr('data-url'));

        /* Highlight the element */
        $('.product_suggest li[data-url]').css('border','1px solid #CCCCCC');
        $('.product_suggest li[data-url]:eq('+selected_item+')').css('border','1px solid #e74847');

        /* If key = enter then click() */
        if(e.which == 13 && (selected_item >= 0)){
            window.location.href = $('.product_suggest li[data-url]:eq('+selected_item+')').attr('data-url');
        }

    });

    // Preload last img on slideshow
    var first_slider_img = $('.dynamicslideshow.fullwidthbanner li:last img').attr('src');
    $('.yt-slideshow.yt-slideshow-right').css('background-image', 'url(' + first_slider_img + ')');


    /* Google Analytics Tracking codes */
    /* Product page */
    $('.catalog-product-view .availability.in-stock').on('click', function() {
        // StockInfoText On product page
        ga('send', 'event', 'FichaProducto', 'ClickStockInfoText', $.trim($('h1.product-name').text()));
    });

    /* Grid page */
    // GridCategory

    var grid_item = $('.catalog-category-view .products-grid .item');

    if (grid_item.length > 0) {

        // ClickImgGrid
        $(grid_item).on('click', '.item-image a.rspl-image', function() {
            var product_name = $.trim($(this).parents('.item').find('.item-title a').text());
            ga('send', 'event', 'GridCategory', 'ClickImgGrid', product_name);
        });

        // ClickNombreProdGrid
        $(grid_item).on('click', '.item-title a', function() {
            var product_name = $.trim($(this).text());
            ga('send', 'event', 'GridCategory', 'ClickNombreProdGrid', product_name);
        });

        // ClickAddCart
        $(grid_item).on('click', '.item-addcart a', function() {
            var product_name = $.trim($(this).parents('.item').find('.item-title a').text());
            ga('send', 'event', 'GridCategory', 'ClickAddCart', product_name);
        });

        // ClickStockInfo
        $(grid_item).on('click', '.availability-in-stock', function() {
            var product_name = $.trim($(this).parents('.item').find('.item-title a').text());
            ga('send', 'event', 'GridCategory', 'ClickStockInfo', product_name);
        });

    }


     // Tracking Related Products 
    var grid_item_rp = $('.tab-product-detail'); 
  //  var grid_item_rp = $('#box-bestseller .vpo-wrap .vp .vpi-wrap .item .item-inner');

    if (grid_item_rp.length > 0) {
         $(grid_item_rp).on('click', '#box-bestseller .vpo-wrap .vp .vpi-wrap .item .item-inner .item-info .item-title a', function() {                          
            var product_name = $.trim($(this).text()); 
            ga('send', 'event', 'RelatedProduct', 'ClickNombreProdRP', product_name);
         });

         $(grid_item_rp).on('click', '#box-bestseller .vpo-wrap .vp .vpi-wrap .item .item-inner .w-image-box .item-image a', function() {            
            var product_name = $.trim($(this).parents('.item').find('.item-title a').text());           
            ga('send', 'event', 'RelatedProduct', 'ClickImgGridRP', product_name);
         });

         $(grid_item_rp).on('click', '#box-bestseller .vpo-wrap .vp .vpi-wrap .item .item-inner .item-info .item-addto-wrap .item-addcart a', function() {
            var product_name = $.trim($(this).parents('.item').find('.item-title a').text());            
            ga('send', 'event', 'RelatedProduct', 'ClickAddCartRP', product_name);
         });

         $(grid_item_rp).on('click', '#box-bestseller .vpo-wrap .vp .vpi-wrap .item .item-inner .item-info .stockContainer .in-stock .availability-in-stock', function() {           
           var product_name = $.trim($(this).parents('.item').find('.item-title a').text());           
           ga('send', 'event', 'RelatedProduct', 'ClickStockInfoRP', product_name);
         });

    }

    // Tracking Sliders 
    var slider_show = $('.dynamicslideshow');   
    if (slider_show.length > 0) {
         $(slider_show).on('click', 'ul li .tp-caption a', function() {                          
            var slider_name = $.trim($(this).parents('li').find('div img').attr('alt'));                        
            ga('send', 'event', 'SliderHome', 'ClickSlider', slider_name);            
         });     
    }
    
    /* End Google Analytics Tracking codes */


    /* Hide tutorials from product page */

    $('.catalog-product-view .tutorial_item:gt(1)').wrapAll("<div class='tutorial-list-hidden' />");
    var $tutorial_list = $('.tutorial-list-hidden');
    $tutorial_list.slideUp();
    $tutorial_list.after('<div class="button btn show-more">Show More Tutorials</div>');

    $('.tutorial-list-container').bind('click', '.btn.show-more', function() {
        $('.btn.show-more').remove();
        $('.tutorial-list-hidden').slideDown();
    });


    /* PURECHAT WIDGET ToDo: add static block (excluded from cache for async js download) for backend manage */
    // if ($('.checkout-onepage-index').length == 0) {
    //     (function () {
    //         $(window).load(function () {

    //             var done = false;
    //             var script = document.createElement("script");
    //             script.async = true;
    //             script.type = "text/javascript";
    //             script.src = "https://app.purechat.com/VisitorWidget/WidgetScript";
    //             document.getElementsByTagName("HEAD").item(0).appendChild(script);
    //             script.onreadystatechange = script.onload = function (e) {
    //                 if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
    //                     var w = new PCWidget({c: "c6ef8452-350d-41c6-ac38-a2be994c3de5", f: true});
    //                     done = true;
    //                 }
    //             };
    //         });
    //     })();
    // }




    /*Address limitation*/

    if($(location).attr('href').indexOf('customer/address') >= 0 || $(location).attr('href').indexOf('checkout/onepage') >= 0) {
        $(document).ready(function () {
            if($(location).attr('href').indexOf('checkout/onepage') >= 0){
                $('#shipping\\:street1').attr('maxlength', '80');
                $('#billing\\:street1').attr('maxlength', '80');
            }
            else{
                $('#street_1').attr('maxlength', '80');
            }
        });
    }
});


/* EXTRA VALIDATION FOR EMAIL ADDRESSES */
// Overwrite method to disallow @example.com

Validation.add('validate-email', 'Please enter a valid email address.', function(v) {
    return Validation.get('IsEmpty').test(v) || /^([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*@(?!(example))([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*\.(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]){2,})$/i.test(v)
});