// Arquivos back-end:
//var request_essay_image_url = 'test/request_essay_image_url.php';
//var request_essay_annotators = 'test/request_essay_annotators.php';
//var add_annotator = 'test/add_annotator.php';
//var delete_annotator = 'test/delete_annotator.php';

var request_essay_image_url = '/request_essay_image_url/';
var request_essay_annotators = '/request_essay_annotators/';
var add_annotator = '/add_annotator/';
var delete_annotator = '/delete_annotator/';

// Configuracoes:
var annotator_dialog_width = 200;  // OBS: Precisa modificar tambem em essay_correction.css
var annotator_dialog_height = 100; // OBS: Precisa modificar tambem em essay_correction.css
var annotator_dialog_pad = 15;     // OBS: Precisa modificar tambem em essay_correction.css

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

    var textarea = document.createElement('textarea');
    textarea.className = "show-annotator-dialog-textarea";
    textarea.innerHTML = (annotator.text != null) ? annotator.text : "";
    dialog.appendChild(textarea);

//	dialog.appendChild(document.createElement('br'));

    var button_div = document.createElement('div');
    button_div.style.position = "absolute";
    button_div.style.right = annotator_dialog_pad + 'px';
    button_div.style.bottom = annotator_dialog_pad + 'px';

    if (!is_new_annotator) {
        var button_delete = document.createElement('button');
        button_delete.className = "show-annotator-dialog-button delete-button";
        button_delete.innerHTML = "Apagar";
        button_delete.addEventListener('click', (function(essay_id,elem,aid){return function(){remove_annotator(essay_id,elem,aid,true);};})(essay_id,elem,annotator.id), false);
        button_div.appendChild(button_delete);
    }

    var button_save = document.createElement('button');
    button_save.className = "show-annotator-dialog-button save-button";
    button_save.innerHTML = "Salvar";
    var save_x = annotator.ranges.x;
    var save_y = annotator.ranges.y;
    button_save.addEventListener('click', (function(essay_id,elem,x,y,textarea,old_id){return function(){save_annotator(essay_id,elem,x,y,textarea.value,old_id);};})(essay_id,elem,save_x,save_y,textarea,is_new_annotator?null:annotator.id), false);
    button_div.appendChild(button_save);

    var button_close = document.createElement('button');
    button_close.className = "show-annotator-dialog-button";
    button_close.innerHTML = "Fechar";
    button_close.addEventListener('click', close_all_dialogs, false);
    button_div.appendChild(button_close);

    dialog.appendChild(button_div);
    elem.appendChild(dialog);

    opened_dialog = dialog;
}

// Remove an annotator.
// update_after: if true, then update all annotators in the screen after removing.
function remove_annotator(essay_id, elem, annotator_id, update_after) {
    close_all_dialogs();

    var params = "id="+encodeURIComponent(essay_id)+"&annotator="+encodeURIComponent(annotator_id);
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', delete_annotator, true);

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    var statusbar = document.createElement('div');
    statusbar.className = 'load-statusbar';
    statusbar.innerHTML = 'Carregando...';
    elem.appendChild(statusbar);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300 && update_after) {
                var r = JSON.parse(xhr.responseText);
                if (r.error_number != 0) alert(r.error_message?r.error_message:"Erro ao remover marcador. Tente novamente");
                update_essay_annotators(essay_id, elem);
            } else if (xhr.status < 200 || xhr.status >= 300)
                alert('Erro ao remover marcador. Tente novamente.');
        }
    }

    xhr.send(params);
}

// Save an annotator.
// If old_id != null, removes old_id annotator before saving
function save_annotator(essay_id, elem, x, y, text, old_id) {
    close_all_dialogs();

    if (old_id != null) remove_annotator(essay_id, elem, old_id, false);

    var params = "id=" + encodeURIComponent(essay_id) + "&x=" + encodeURIComponent(x) + "&y=" + encodeURIComponent(y) + "&text=" + encodeURIComponent(text);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', add_annotator, true);

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    var statusbar = document.createElement('div');
    statusbar.className = 'load-statusbar';
    statusbar.innerHTML = 'Carregando...';
    elem.appendChild(statusbar);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                var r = JSON.parse(xhr.responseText);
                if (r.error_number != 0) alert(r.error_message?r.error_message:'Erro '+r.error_number+' ao salvar marcador. Tente novamente.');
                update_essay_annotators(essay_id, elem);
            } else
                alert('Erro ao salvar marcador. Tente novamente.');
        }
    }

    xhr.send(params);
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

function essay_onclick_event(e, essay_id, elem) {
    if (close_all_dialogs()) return;
    var pos_x = e.offsetX ? (e.offsetX) : e.pageX - elem.offsetLeft;
    var pos_y = e.offsetY ? (e.offsetY) : e.pageY - elem.offsetTop;
    var rel_x = pos_x / elem.clientWidth;
    var rel_y = pos_y / elem.clientHeight;
    generate_show_annotator_dialog(essay_id, elem, {"ranges":{"x":rel_x,"y":rel_y}},true);
}

function update_essay_image(essay_id, elem, image_url) {
    elem.innerHTML = '';
    var can = document.createElement('canvas');
    can.id = "essay_img_"+essay_id;
    can.classList.add('essay-image');
    can.addEventListener('click',   (function(essay_id,elem) {
        return function(e) {essay_onclick_event(e, essay_id, elem); };
    }) (essay_id,elem), false);
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

// Inicia a correção da redação. Retorna true se n�o houver falhas.
function start_essay_correction(essay_id, elem) {
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

// Finaliza a corre��o da reda��o. As altera��es j� s�o salvas durante a edi��o, ent�o s� � necess�rio
// chamar essa fun��o se for necess�rio continuar na mesma p�gina sem continuar a corre��o.
function stop_essay_correction(elem) {
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
