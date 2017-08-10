var request_essay_image_url = '/request_essay_image_url/';
var request_essay_annotators = '/request_essay_annotators/';
var add_annotator = '/add_annotator/';
var delete_annotator = '/delete_annotator/';

// Configuracoes:
var annotator_dialog_width = 200; // OBS: Precisa modificar tambem em essay_correction.css
var annotator_dialog_height = 70; // OBS: Precisa modificar tambem em essay_correction.css
var annotator_dialog_pad = 10;    // OBS: Precisa modificar tambem em essay_correction.css

var opened_dialog = null;

// Close all opened dialogs
// Returns true if a dialog was closed
function close_all_dialogs() {
	if (opened_dialog != null) {
		opened_dialog.remove();
		opened_dialog = null;
		return true;
	}
	return false;
}

// Generates a annotators data dialog
function generate_show_annotator_dialog(essay_id, elem, annotator, is_new_annotator) {
	close_all_dialogs();
	var dialog = document.createElement('div');
	dialog.className = "show-annotator-dialog";

	var pos_x = elem.clientWidth * annotator.ranges.x;
	var pos_y = elem.clientHeight * annotator.ranges.y;
	if (pos_x + annotator_dialog_width + 2*annotator_dialog_pad + 10 > elem.clientWidth) pos_x = elem.clientWidth - annotator_dialog_width - 2*annotator_dialog_pad - 10;
	if (pos_y + annotator_dialog_height + 2*annotator_dialog_pad + 10 > elem.clientHeight) pos_y = elem.clientHeight - annotator_dialog_height - 2*annotator_dialog_pad - 10;

	dialog.style.left = pos_x + 'px';
	dialog.style.top = pos_y + 'px';

	var textview = document.createElement('textarea');
	textview.className = "show-annotator-dialog-textarea";
	textview.readOnly = "readOnly";
	textview.innerHTML = (annotator.text != null) ? annotator.text : "";
	dialog.appendChild(textview);

	elem.appendChild(dialog);

	opened_dialog = dialog;
}

// Draw a circle, using x and y as reference from 0 to 1
function draw_annotator(essay_id, elem, annotator) {
	var iDiv = document.createElement('div');
	iDiv.className = "annotator";
	iDiv.style.left = annotator.ranges.x*100+"%";
	iDiv.style.top = annotator.ranges.y*100+"%";
	iDiv.addEventListener('click', (function(essay_id,elem,annotator){return function(){generate_show_annotator_dialog(essay_id, elem, annotator, false);};})(essay_id,elem,annotator), false);
	elem.appendChild(iDiv);
	return iDiv;
}

// Update all annotators data shown in the image
function update_essay_annotators(essay_id, elem) {
	// 1- Delete all annotators and dialogs
	for (i = elem.children.length-1; i >= 0; i--)
		if (elem.children[i].tagName.toUpperCase() != "CANVAS")
			elem.removeChild(elem.children[i]);

	// 2- Load and draw all annotators
	var draw_all_annotators = function(annotators) {
		for (i = 0; i < annotators.length; i++) {
			var annotator = annotators[i];
			var id = annotator.id;
			var x = annotator.ranges.x;
			var y = annotator.ranges.y;
			var text = annotator.text;
			var div = draw_annotator(essay_id, elem,annotator);
		}
	}

	var xhr_ann = new XMLHttpRequest();
	xhr_ann.open('GET', request_essay_annotators + "?id=" + essay_id, true);
	xhr_ann.onreadystatechange = function () {
		if (xhr_ann.readyState == 4) {
			if (xhr_ann.status >= 200 && xhr_ann.status < 300) {
				var data = JSON.parse(xhr_ann.responseText);
				if (data.annotators) {
					draw_all_annotators(data.annotators);
				} else {
					alert(data.error_message?data.error_message:"Erro ao carregar reda��o.");
				}
			} else
				alert('Erro ao carregar informa��es de marcadores da reda��o. Tente novamente.');
		}
	}
	xhr_ann.send(null);
}

function update_essay_image(essay_id, elem, image_url) {
	elem.innerHTML = '';
	var can = document.createElement('canvas');
	can.id = "essay_img_"+essay_id;
	can.classList.add('essay-image');
	can.addEventListener('click', close_all_dialogs, false);
	can.setAttribute('data-image-url', image_url);

	var img = new Image();
	img.onload = function() {
		can.width = img.width;
		can.height = img.height;
		can.getContext('2d').drawImage(img,0,0);
	}
	img.src = image_url;

	elem.appendChild(can);
	elem.classList.add('essay-image-parent');
}

// Inicia a visualiza��o da reda��o. Retorna true se n�o houver falhas.
function start_essay_view(essay_id, elem) {
	elem.innerHTML = '';
	var xhr_url = new XMLHttpRequest();
	xhr_url.open('GET', request_essay_image_url + "?id=" + essay_id, true);
	xhr_url.onreadystatechange = function () {
		if (xhr_url.readyState == 4) {
			if (xhr_url.status >= 200 && xhr_url.status < 300) {
				var data = JSON.parse(xhr_url.responseText);
				if (data.image_url) {
					update_essay_image(essay_id, elem, data.image_url);
					update_essay_annotators(essay_id, elem, data.image_url);
				} else {
					alert(data.error_message?data.error_message:"Erro ao carregar redação");
				}
			} else
				alert('Erro ao carregar imagem da redação. Tente novamente.');
		}
	}
	xhr_url.send(null);
}

// Finaliza a visualiza��o da reda��o.
function stop_essay_view(elem) {
	elem.innerHTML = '';
}

// Rotaciona a image
// elem: Elemento DIV que contem a imagem.
// direction: 1 para sentido horario, -1 para sentido anti-horario
function rotate_essay(elem, direction) {
	if (direction != 1 && direction != -1) return;

	var current_angle = elem.getAttribute('data-current-angle');
	if (current_angle == null) current_angle = "0";
	var new_angle = parseInt(current_angle) + 90*direction;
	if (new_angle == -90) new_angle = 270;
	if (new_angle == 360) new_angle = 0;
	if (new_angle != 0 && new_angle != 90 && new_angle != 180 && new_angle != 270) new_angle = 0;
	rotate_essay_to(elem, new_angle);
}

// Rotaciona a imagem.
// elem: Elemento DIV que contem a imagem.
// angle: sentido horario, sendo 0, 90, 180 ou 270
// A reda��o j� deve estar carregada para utilizar essa fun��o.
function rotate_essay_to(elem, direction) {
	var can = null;
	for (i = 0; i < elem.children.length; i++) {
		if (elem.children[i].tagName.toUpperCase() == 'CANVAS') {
			can = elem.children[i];
			break;
		}
	}
	if (can == null) {
		alert('Imagem n�o carregada.');
		return;
	}

	if (direction == 0) {
		var img = new Image();
		img.onload = function() {
			var ctx = can.getContext('2d');
			ctx.clearRect(0, 0, can.width, can.height);
			can.width = img.width;
			can.height = img.height;
			ctx.drawImage(img, 0, 0, img.width, img.height);
		}
		img.src = can.getAttribute('data-image-url');
	} else if (direction == 90) {
		var img = new Image();
		img.onload = function() {
			var ctx = can.getContext('2d');
			ctx.clearRect(0, 0, can.width, can.height);
			can.width = img.height;
			can.height = img.width;
			ctx.translate(img.height, 0);
			ctx.rotate(0.5*Math.PI);
			ctx.drawImage(img, 0, 0, img.width, img.height);
		}
		img.src = can.getAttribute('data-image-url');
	} else if (direction == 180) {
		var img = new Image();
		img.onload = function() {
			var ctx = can.getContext('2d');
			ctx.clearRect(0, 0, can.width, can.height);
			can.width = img.width;
			can.height = img.height;
			ctx.translate(img.width-1, img.height-1);
			ctx.rotate(Math.PI);
			ctx.drawImage(img, 0, 0, img.width, img.height);
		}
		img.src = can.getAttribute('data-image-url');
	} else if (direction == 270) {
		var img = new Image();
		img.onload = function() {
			var ctx = can.getContext('2d');
			ctx.clearRect(0, 0, can.width, can.height);
			can.width = img.height;
			can.height = img.width;
			ctx.translate(0, img.width);
			ctx.rotate(-0.5*Math.PI);
			ctx.drawImage(img, 0, 0, img.width, img.height);
		}
		img.src = can.getAttribute('data-image-url');
	} else {
		console.log('direction must be 0, 90, 180 or 270.');
		return;
	}
	elem.setAttribute('data-current-angle', direction);
}