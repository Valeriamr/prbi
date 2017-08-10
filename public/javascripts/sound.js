(function (window) {

  var recordWavWorker = new Worker('/javascripts/wav/recorderWorker.js');
  var encoderMp3Worker = new Worker('/javascripts/mp3/mp3Worker.js');

  var Recorder = function (source) {

    var bufferLen = 4096;
    var recording = false;

    this.context = source.context;

    /*
     ScriptProcessorNode createScriptProcessor (optional unsigned long bufferSize = 0,
     optional unsigned long numberOfInputChannels = 2, optional unsigned long numberOfOutputChannels = 2 );
     */

    this.node = (this.context.createScriptProcessor || this.context.createJavaScriptNode).call(this.context, bufferLen, 1, 1);
    this.node.connect(this.context.destination); //this should not be necessary

    this.node.onaudioprocess = function (e) {

      if (!recording)
        return;

      var channelLeft = e.inputBuffer.getChannelData(0);

      console.log('onAudioProcess' + channelLeft.length);

      encoderMp3Worker.postMessage({
        command: 'encode',
        buf: channelLeft
      });

      recordWavWorker.postMessage({
        command: 'record',
        buffer: channelLeft
      });

    }

    source.connect(this.node);

    this.record = function () {

      if (recording)
        return false;

      recording = true;

      var sampleRate = this.context.sampleRate;

      console.log("Initializing WAV");
      console.log("Creating Empty WAV");

      recordWavWorker.postMessage({
        command: 'init',
        config: {
          sampleRate: sampleRate
        }
      });

      console.log("Initializing to Mp3");
      console.log("Creating Empty Mp3:" + sampleRate);

      encoderMp3Worker.postMessage({
        command: 'init',
        config: {
          channels: 1,
          mode: 3 /* means MONO*/,
          samplerate: 22050,
          bitrate: 64,
          insamplerate: sampleRate
        }
      });

    }

    this.stop = function () {

      if (!recording)
        return;

      recordWavWorker.postMessage({
        command: 'finish'
      });

      encoderMp3Worker.postMessage({
        command: 'finish'
      });

      recording = false;

    }

    encoderMp3Worker.onmessage = function (e) {

      var command = e.data.command;

      console.log('encoderMp3Worker - onmessage: ' + command);

      switch (command) {
        case 'data':
          var buf = e.data.buf;
          console.log('Receiving data from mp3-Encoder');

          //maybe you want to send to websocket channel, as:
          //https://github.com/akrennmair/speech-to-server

          break;
        case 'mp3':
          var buf = e.data.buf;
          endFile(buf, 'mp3');
          // Removed the terminate of the worker - terminate does not allow multiple recordings
          //encoderMp3Worker.terminate();
          //encoderMp3Worker = null;
          break;
      }

    };

    recordWavWorker.onmessage = function (e) {

      var command = e.data.command;

      console.log('recordWavWorker - onmessage: ' + command);

      switch (command) {
        case 'wav':
          endFile(e.data.buf, 'wav');
          break;
      }

    };

    var __mp3;

    function endFile(blob, extension) {

      console.log("Done converting to " + extension);
      //log.innerHTML += "\n" + "Done converting to " + extension;

      console.log("the blob " + blob + " " + blob.size + " " + blob.type);



      if(extension == 'mp3') {
        recordingslist.innerHTML = '';

        var url = URL.createObjectURL(blob);
        var li = document.createElement('li');
        var hf = document.createElement('a');
        hf.href = url;
        hf.download = new Date().toISOString() + '.' + extension;

        hf.innerHTML = hf.download;
        var au = document.createElement('audio');

        au.controls = true;
        au.src = url;
        li.appendChild(au);
        //li.appendChild(hf);

        //Mensgaem de não esquecer envio
        var msg = document.createElement('p');
        msg.style.cssText = 'color: red';
        msg.innerHTML = "Clique em ENVIAR GRAVAÇÃO";
        li.appendChild(msg);
      }

      if(extension == 'mp3'){
        __mp3 = blob;
      }

      recordingslist.appendChild(li);

    }

    this.uploadAudio = function () {
      mp3Data = __mp3;
      var reader = new FileReader();
      reader.onload = function (event) {
        var fd = new FormData();
        var mp3Name = encodeURIComponent('audio_recording_' + new Date().getTime() + '.mp3');
        console.log("mp3name = " + mp3Name);
        fd.append('texto', texto);
        fd.append('corretor', corretor);
        fd.append('fname', mp3Name);
        fd.append('data', event.target.result);
        $.ajax({
          type: 'POST',
          url: '/votos/sound_upload',
          data: fd,
          processData: false,
          contentType: false
        }).done(function (data) {
          console.log("Envio Finalizado");
          document.getElementById('enviar-nota').disabled = false;
          document.getElementById('enviar-nota').value = 'Enviar Nota';
          document.getElementById('comentario-texto').value = 'Correção enviada por áudio.';
          alert('Envio finalizado');
        });
      };
      reader.readAsDataURL(mp3Data);
    }

    this.uploadComment = function () {
      mp3Data = __mp3;
      var reader = new FileReader();
      reader.onload = function (event) {
        var fd = new FormData();
        var mp3Name = encodeURIComponent('audio_recording_' + new Date().getTime() + '.mp3');
        console.log("mp3name = " + mp3Name);
        fd.append('texto', textoId);
        fd.append('fname', mp3Name);
        fd.append('data', event.target.result);
        $.ajax({
          type: 'POST',
          url: '/votos/comment_upload',
          data: fd,
          processData: false,
          contentType: false
        }).done(function (data) {
          console.log("Envio Finalizado");
          document.getElementById('enviar-nota').disabled = false;
          document.getElementById('enviar-nota').value = 'Enviar Nota';
          alert('Envio finalizado');
        });
      };
      reader.readAsDataURL(mp3Data);
    }

  };



  window.Recorder = Recorder;

})(window);