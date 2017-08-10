
jQuery(function($) {'use strict';

	$(window).load(function(){
        $('#newsletter').modal('show');
    });

	//Responsive Nav
	$('li.dropdown').find('.fa-angle-down').each(function(){
		$(this).on('click', function(){
			if( $(window).width() < 768 ) {
				$(this).parent().next().slideToggle();
			}
			return false;
		});
	});

	//Fit Vids
	if( $('#video-container').length ) {
		$("#video-container").fitVids();
	}

	//menu responsivo
	$('a#menu-mobile').on('click', function() {
		$('.main-menu ul.list-inline').slideToggle();
	});
	$('a#currName').on('click', function() {
		$('li.user-menu').toggleClass('active');
	});


	// enviar redaçao
	$('.tipo-correcao div').on('click', function() {
		$('.tipo-correcao div').removeClass('ativo');
		$(this).addClass('ativo');
	});


	// cursos
	$('a.lesson-trigger').on('click', function() {
		$('.lesson-playlist').animate({
			right: '0'
		});
	});
	$('.close-button a').on('click', function() {
		$('.lesson-playlist').animate({
			right: '-100%'
		});
	});



	$(".video-modal").click(function () {
		var theModal = $(this).data("target"),
		videoSRC = $(this).attr("data-video"),
		videoSRCauto = videoSRC + "?modestbranding=1&rel=0&controls=0&showinfo=0&html5=1&autoplay=1";
		$(theModal + ' iframe').attr('src', videoSRCauto);
		$(theModal + ' button.close').click(function () {
			$(theModal + ' iframe').attr('src', videoSRC);
		});
	});

	$("#trailer").on('hidden.bs.modal', function (e) { // on closing the modal
	  // stop the video
	  $("#trailer iframe").attr("src", null);
	});


	

 
});
	

	$('h2.map-trigger').click(function() {
		$(this).next('ul.section-lessons').slideToggle();
		$(this).children('.fa').toggleClass('fa-rotate-90');
	});

	$('#prof, #grat').hide();

	$('.profissional').on('click', function() {
		$('#aviso').slideUp();
		$('#grat').slideUp();
		$('#prof').delay(400).slideDown();
		$('#texto_status_correcao_prof').val(e_t_h_p);
		$('#texto_status_correcao_grat').val('');
	});

	$('.colaborativa').on('click', function() {
		$('#aviso').slideUp();
		$('#prof').slideUp();
		$('#grat').delay(400).slideDown();
		$('#texto_status_correcao_prof').val('');
		$('#texto_status_correcao_grat').val(e_t_h_g);
	});

	$('.keep-calm').on('click', function() {
		$('#aviso').slideUp();
		$('#grat').slideUp();
		$('#prof').delay(400).slideDown();
		$('#texto_status_correcao_prof').val(e_t_h_p);
		$('#texto_status_correcao_grat').val('');
	});


	$('.foto-selected, .texto-selected').hide();

	// profissional
	$('#prof .enviar-foto').on('click', function() {
		$('.enviar-foto, .enviar-texto').removeClass('active');
		$(this).addClass('active');
		$('.foto-selected, .texto-selected').slideUp();
		$('.foto-selected').slideDown();
	});
	$('#prof .enviar-texto').on('click', function() {
		$('.enviar-foto, .enviar-texto').removeClass('active');
		$(this).addClass('active');
		$('.foto-selected, .texto-selected').slideUp();
		$('.texto-selected').slideDown();
	});

	// colaborativa
	$('#grat .enviar-foto').on('click', function() {
		$('.enviar-foto, .enviar-texto').removeClass('active');
		$(this).addClass('active');
		$('.foto-selected, .texto-selected').slideUp();
		$('.foto-selected').slideDown();
	});
	$('#grat .enviar-texto').on('click', function() {
		$('.enviar-foto, .enviar-texto').removeClass('active');
		$(this).addClass('active');
		$('.foto-selected, .texto-selected').slideUp();
		$('.texto-selected').slideDown();
	});

	//Initiat WOW JS
	new WOW().init();

	// portfolio filter
	$(window).load(function(){

		$('.main-slider').addClass('animate-in');
		$('.preloader').remove();
		//End Preloader

		if( $('.masonery_area').length ) {
			$('.masonery_area').masonry();//Masonry
		}

		var $portfolio_selectors = $('.portfolio-filter >li>a');

		if($portfolio_selectors.length) {

			var $portfolio = $('.portfolio-items');
			$portfolio.isotope({
				itemSelector : '.portfolio-item',
				layoutMode : 'fitRows'
			});

			$portfolio_selectors.on('click', function(){
				$portfolio_selectors.removeClass('active');
				$(this).addClass('active');
				var selector = $(this).attr('data-filter');
				$portfolio.isotope({ filter: selector });
				return false;
			});
		}

	});


	$('.timer').each(count);
	function count(options) {
		var $this = $(this);
		options = $.extend({}, options || {}, $this.data('countToOptions') || {});
		$this.countTo(options);
	}

	// Search
	$('.fa-search').on('click', function() {
		$('.field-toggle').fadeToggle(200);
	});

	// Contact form
	var form = $('#main-contact-form');
	form.submit(function(event){
		event.preventDefault();
		var form_status = $('<div class="form_status"></div>');
		$.ajax({
			url: $(this).attr('action'),
			beforeSend: function(){
				form.prepend( form_status.html('<p><i class="fa fa-spinner fa-spin"></i> Email is sending...</p>').fadeIn() );
			}
		}).done(function(data){
			form_status.html('<p class="text-success">Thank you for contact us. As early as possible  we will contact you</p>').delay(3000).fadeOut();
		});
	});

	// Progress Bar
	$.each($('div.progress-bar'),function(){
		$(this).css('width', $(this).attr('data-transition')+'%');
	});

	if( $('#gmap').length ) {
		var map;

		map = new GMaps({
			el: '#gmap',
			lat: -16.6746,
			lng: -49.2445,
			scrollwheel:true,
			zoom: 16,
			zoomControl : false,
			panControl : false,
			streetViewControl : true,
			mapTypeControl: true,
			overviewMapControl: true,
			clickable: true
		});

		map.addMarker({
			lat: -16.674640,
			lng: -49.244546,
			animation: google.maps.Animation.DROP,
			verticalAlign: 'bottom',
			horizontalAlign: 'center',
			backgroundColor: '#3e8bff'
		});
	}





$('a.scrollto[href*=#]').on('click', function(event){
	event.preventDefault();
	$('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
});






$("#botaolike").click(function(e){
  e.preventDefault();
	return false;
});

$("#botaocomentario").click(function(e){
	return false;
});

function pushLike(aluno_id, objeto_id){
	$.ajax({
		url: "/like/"+aluno_id+'/'+objeto_id,
		context: document.body,
		type: "GET",
		success: function (data) {
			var result = $('<div />').append(data).find('#botaolike').html();
			$('#botaolike').html(result);
		}
	})
}





//Form Validation
$().ready(function() {
    $("#loginForm").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true
            }
        },
        messages: {
            email: "Entre com um email válido",
            password: {
                required: "Insira uma senha"
            }
        }
    });

    $("#textoForm").validate({
        rules: {
            "texto[titulo]": {
                required: true
            }
        },
        messages: {
            "texto[titulo]": "Atualize a página e escreva um título."
        },
        errorClass: "errorClass"
    });


});

$('form[name="submeterComentario"]').submit(function(){
    $(this).find('input[type="submit"]').attr('disabled','disabled');
    $(this).find('input[type="submit"]').val('Postando comentário...');
});

$('form[name="submeterTexto"]').submit(function(){
    $(this).find('input[type="submit"]').attr('disabled','disabled');
    $(this).find('input[type="submit"]').val('Postando redação...');

});


$('form[name="submeterNota"]').submit(function(){
    $(this).find('input[type="submit"]').attr('disabled','disabled');
    $(this).find('input[type="submit"]').val('Postando nota...');

});

$('form[id="form_nota"]').submit(function(){
	$(this).find('input[type="submit"]').attr('disabled','disabled');
	$(this).find('input[type="submit"]').val('Postando feedback...');
});

$('form[name="formCadastro"]').submit(function(){
	$(this).find('input[type="submit"]').attr('disabled','disabled');
	$(this).find('input[type="submit"]').val('Conta sendo criada...');
});


$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})







var angle = 0;
$('#rodar').on('click', function() {
    angle += 90;
    $("#redacao").rotate(angle);
});



//Smartbanner
var extend = require('xtend/mutable');
var q = require('component-query');
var doc = require('get-doc');
var root = doc && doc.documentElement;
var cookie = require('cookie-cutter');
var ua = require('ua-parser-js');
var userLang = navigator.language.slice(-2) || navigator.userLanguage.slice(-2) || 'us';

// platform deendent functionality
var mixins = {
	ios: {
		appMeta: 'apple-itunes-app',
		iconRels: ['apple-touch-icon-precomposed', 'apple-touch-icon'],
		getStoreLink: function() {
			return 'https://itunes.apple.com/' + this.options.appStoreLanguage + '/app/id' + this.appId;
		}
	},
	android: {
		appMeta: 'google-play-app',
		iconRels: ['android-touch-icon', 'apple-touch-icon-precomposed', 'apple-touch-icon'],
		getStoreLink: function() {
			return 'http://play.google.com/store/apps/details?id=' + this.appId;
		}
	},
	windows: {
		appMeta: 'msApplication-ID',
		iconRels: ['windows-touch-icon', 'apple-touch-icon-precomposed', 'apple-touch-icon'],
		getStoreLink: function() {
			return 'http://www.windowsphone.com/s?appid=' + this.appId;
		}
	}
};

var SmartBanner = function(options) {
	var agent = ua(navigator.userAgent);
	this.options = extend({}, {
		daysHidden: 15,
		daysReminder: 90,
		appStoreLanguage: userLang, // Language code for App Store
		button: 'OPEN', // Text for the install button
		store: {
			ios: 'On the App Store',
			android: 'In Google Play',
			windows: 'In the Windows Store'
		},
		price: {
			ios: 'FREE',
			android: 'FREE',
			windows: 'FREE'
		},
		force: false // put platform type (ios, android, etc.) here for emulation
	}, options || {});

	if (this.options.force) {
		this.type = this.options.force;
	} else if (agent.os.name === 'Windows Phone' || agent.os.name === 'Windows Mobile') {
		this.type = 'windows';
		//iOS >= 6 has native support for SmartAppBanner
	} else if (agent.os.name === 'iOS' && parseInt(agent.os.version) < 6) {
		this.type = 'ios';
	} else if (agent.os.name === 'Android') {
		this.type = 'android';
	}

	// Don't show banner if device isn't iOS or Android, website is loaded in app, user dismissed banner, or we have no app id in meta
	if (!this.type
		|| navigator.standalone
		|| cookie.get('smartbanner-closed')
		|| cookie.get('smartbanner-installed')) {
		return;
	}

	extend(this, mixins[this.type]);

	if (!this.parseAppId()) {
		return;
	}

	this.create();
	this.show();
};

SmartBanner.prototype = {
	constructor: SmartBanner,

	create: function() {
		var link = this.getStoreLink();
		var inStore = this.options.price[this.type] + ' - ' + this.options.store[this.type];
		var icon;
		for (var i = 0; i < this.iconRels.length; i++) {
			var rel = q('link[rel="'+this.iconRels[i]+'"]');
			if (rel) {
				icon = rel.getAttribute('href');
				break;
			}
		}

		var sb = doc.createElement('div');
		sb.className = 'smartbanner smartbanner-' + this.type;

		sb.innerHTML = '<div class="smartbanner-container">' +
			'<a href="javascript:void(0);" class="smartbanner-close">&times;</a>' +
			'<span class="smartbanner-icon" style="background-image: url('+icon+')"></span>' +
			'<div class="smartbanner-info">' +
			'<div class="smartbanner-title">'+this.options.title+'</div>' +
			'<div>'+this.options.author+'</div>' +
			'<span>'+inStore+'</span>' +
			'</div>' +
			'<a href="'+link+'" class="smartbanner-button">' +
			'<span class="smartbanner-button-text">'+this.options.button+'</span>' +
			'</a>' +
			'</div>';

		//there isn’t neccessary a body
		if (doc.body) {
			doc.body.appendChild(sb);
		}
		else if (doc) {
			doc.addEventListener('DOMContentLoaded', function(){
				doc.body.appendChild(sb);
			});
		}

		q('.smartbanner-button', sb).addEventListener('click', this.install.bind(this), false);
		q('.smartbanner-close', sb).addEventListener('click', this.close.bind(this), false);

	},
	hide: function() {
		root.classList.remove('smartbanner-show');
	},
	show: function() {
		root.classList.add('smartbanner-show');
	},
	close: function() {
		this.hide();
		cookie.set('smartbanner-closed', 'true', {
			path: '/',
			expires: +new Date() + this.options.daysHidden * 1000 * 60 * 60 * 24
		});
	},
	install: function() {
		this.hide();
		cookie.set('smartbanner-installed', 'true', {
			path: '/',
			expires: +new Date() + this.options.daysReminder * 1000 * 60 * 60 * 24
		});
	},
	parseAppId: function() {
		var meta = q('meta[name="' + this.appMeta + '"]');
		if (!meta) {
			return;
		}

		if (this.type === 'windows') {
			this.appId = meta.getAttribute('content');
		} else {
			this.appId = /app-id=([^\s,]+)/.exec(meta.getAttribute('content'))[1];
		}

		return this.appId;
	}
};

module.exports = SmartBanner;


//Menu - curso de capacitacao

function chooseVideo(id){
    $( "ul.aulas li" ).click(function() {
        $('ul.aulas li').removeClass('active');
        $(this).addClass('active');
    });

    switch (id){
        case 1:
            $("#description").html('<p class="lead">Vídeo 1</p>');
            $("#NomeVideo").html('Aula I - Apresentação e apontamentos nas correções');
            $("#VideoVimeo").html('<iframe src="https://player.vimeo.com/video/176758809" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> <p>I - Apresenta&ccedil;&atilde;o e coment&aacute;rios/apontamentos nas corre&ccedil;&otilde;es from <a href="https://vimeo.com/user54267445">Projeto Reda&ccedil;&atilde;o</a> on <a href="https://vimeo.com">Vimeo</a>.</p>');
            break;
        case 2:
            $("#description").html('<p class="lead">Vídeo 2</p>');
            $("#NomeVideo").html('Aula II - Resposta dos Feedbacks');
            $("#VideoVimeo").html('<iframe src="https://player.vimeo.com/video/176768500" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
            break;
        case 3:
            $("#NomeVideo").html('Aula III - Características e estrutura do gênero dissertativo-argumentativo');
            $("#VideoVimeo").html('<iframe src="https://player.vimeo.com/video/176772861" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
            break;
        case 4:
            $("#NomeVideo").html('Aula IV - Posicionamento e critérios');
            $("#VideoVimeo").html('<iframe src="https://player.vimeo.com/video/176778197" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
            break;

    }

}












