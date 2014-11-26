var CLIENT_ID = "18f6fc47f1a748578f2ee6860b9dcd93";
var CLIENT_SECRET = "47152836d76c472382629653a88db427";
var ACESS_TOKEN = "904877.18f6fc4.cc572894dfb244ea9273145d54417b1a";

var fotosQnt = 0;

function readMedia(hashtag) {
    jQuery.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: "https://api.instagram.com/v1/tags/"+ hashtag +"/media/recent?client_id="+ CLIENT_ID +"&access_token="+ ACESS_TOKEN +"",
        success: function(data)  {
            jQuery.each(data.data, function(ix, foto) {
                jQuery("#instagram").append(" <figure class='grid2 thumb_instagram'> <a data-href='" + foto.link +"' data-original='"+foto.images.standard_resolution.url+"'> <img alt='"+ foto.user.full_name +"' src='" + foto.images.low_resolution.url +"' > </a> <figcaption class='cor'> <span>@"+ foto.user.full_name +"</span> </figcaption> </figure>");
            });
            jQuery("#next-instagram").attr('href', data.pagination.next_url);
            fotosQnt += data.data.length;
            organizarMedia();
        }
    });
}

function paginationMedia(url) {
    jQuery.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: url,
        success: function(data)  {
            jQuery.each(data.data, function(ix, foto) {
                jQuery("#instagram").append(" <figure class='grid2 thumb_instagram'> <a data-href='" + foto.link +"' data-original='"+foto.images.standard_resolution.url+"'> <img alt='"+ foto.user.full_name +"' src='" + foto.images.low_resolution.url +"' > </a> <figcaption class='cor'> <span>@"+ foto.user.full_name +"</span> </figcaption> </figure>");
            });
            jQuery("#next-instagram").attr('href', data.pagination.next_url);
            fotosQnt += data.data.length;
            organizarMedia();
        }
    });
}

function organizarMedia() {
    var largura = jQuery('#instagram').width();
    var linha = Math.floor(largura / 175);
    var resto = fotosQnt % linha;
    jQuery('.thumb_instagram').show();

    for (var i = 1; i <= resto; i++) {
        jQuery('.thumb_instagram:nth-last-child('+i+')').hide();
    };
}

function autoload() {
    paginationMedia(jQuery('#next-instagram').attr('href'));
    jQuery('#next-instagram').text('PRONTO');
}

jQuery(document).ready(function() {
    readMedia("camboriu");

    jQuery("#next-instagram").on('click', function(event) {
        event.preventDefault();
        paginationMedia(jQuery(this).attr('href'));
    });

    jQuery(window).resize( function() {
        organizarMedia();
    });

    jQuery('html').on('click', '.thumb_instagram a', function() {
        jQuery('#shadow-box').fadeIn('500');
        $shadowImg = jQuery(this).children('img');
        $shadowImg = $shadowImg.clone().appendTo('#shadow-box').addClass('shadow-img').hide();
        var shadowImgUrl = jQuery(this).attr('data-original');

        $shadowImg.attr('src', shadowImgUrl);

        $shadowImg.css({
            'box-sizing'    : 'border-box',
            'position'      : 'relative',
            'border-radius' : '0',
            'border'        : '10px solid #fff',
            'z-index'       : '999999999999',
            'max-width'     : '80%',
            'max-height'    : '80%',
            'top'           : '85px',
            'margin'        : '0 auto',
            'display'       : 'block'
        }).delay(500).fadeIn('500');


    });

    jQuery('#shadow-box').on('click', function() {
        jQuery('#shadow-box').fadeOut('250');
        $shadowImg.fadeOut('100').delay(100).remove();
    });

    jQuery(document).on('scroll', function(event) {
        var altura = jQuery('html').height();
        var footer = jQuery('#autoload').offset().top;
        if (footer == (altura - 100)) {
            jQuery('#next-instagram').text('Carregando...');
            setTimeout(autoload, 2000);
        }
    });
});
