(function() {
  'use strict';

  // GA event helper
  function trackEvent(action, params) {
    if (typeof gtag === 'function') gtag('event', action, params || {});
  }

  var dropZone = document.getElementById('dropZone');
  var imageList = document.getElementById('imageList');
  var imageCount = document.getElementById('imageCount');
  var convertBtn = document.getElementById('convertBtn');
  var progressContainer = document.getElementById('progressContainer');
  var progressBarFill = document.getElementById('progressBarFill');
  var progressText = document.getElementById('progressText');
  var resultContainer = document.getElementById('resultContainer');
  var downloadBtn = document.getElementById('downloadBtn');
  var pageCount = document.getElementById('pageCount');
  var statusMsg = document.getElementById('statusMsg');

  var selectedFiles = [];

  function showStatus(msg, isErr) { statusMsg.style.display = 'block'; statusMsg.style.background = isErr ? '#fee2e2' : '#dbeafe'; statusMsg.style.color = isErr ? '#b91c1c' : '#1e40af'; statusMsg.textContent = msg; }
  function hideStatus() { statusMsg.style.display = 'none'; }

  function updateUI() {
    imageList.innerHTML = '';
    for (var i = 0; i < selectedFiles.length; i++) {
      (function(idx) {
        var img = document.createElement('img');
        img.className = 'image-thumb';
        var reader = new FileReader();
        reader.onload = function(e) { img.src = e.target.result; };
        reader.readAsDataURL(selectedFiles[idx]);
        imageList.appendChild(img);
      })(i);
    }
    imageCount.textContent = selectedFiles.length + ' image(s) selected';
    convertBtn.disabled = selectedFiles.length === 0;
  }

  function handleFiles(files) {
    for (var i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) {
        selectedFiles.push(files[i]);
      }
    }
    if (selectedFiles.length > 0) {
      dropZone.style.display = 'none';
      hideStatus();
    }
    updateUI();
    trackEvent('files_selected', { tool: 'image_to_pdf', file_count: selectedFiles.length, total_size: selectedFiles.reduce(function(s,f){return s+f.size},0) });
  }

  dropZone.addEventListener('click', function() {
    var input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.multiple = true; input.style.display = 'none';
    document.body.appendChild(input);
    input.addEventListener('change', function() { if (this.files && this.files.length > 0) handleFiles(this.files); document.body.removeChild(input); });
    input.click();
  });
  dropZone.addEventListener('dragover', function(e) { e.preventDefault(); this.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', function(e) { e.preventDefault(); this.classList.remove('dragover'); });
  dropZone.addEventListener('drop', function(e) {
    e.preventDefault(); this.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  });

  convertBtn.addEventListener('click', async function() {
    if (selectedFiles.length === 0) return;
    trackEvent('convert_start', { tool: 'image_to_pdf', file_count: selectedFiles.length });
    convertBtn.disabled = true;
    progressContainer.classList.add('show'); resultContainer.classList.remove('show');
    progressBarFill.style.width = '0%'; progressText.textContent = 'Creating PDF...';

    try {
      var pdfDoc = await PDFLib.PDFDocument.create();
      var total = selectedFiles.length;

      for (var i = 0; i < total; i++) {
        progressBarFill.style.width = Math.round((i / total) * 80) + '%';
        progressText.textContent = 'Processing image ' + (i + 1) + ' of ' + total + '...';

        var arrayBuffer = await selectedFiles[i].arrayBuffer();
        var imgType = selectedFiles[i].type;

        var image;
        if (imgType === 'image/png') {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else if (imgType === 'image/jpeg' || imgType === 'image/jpg') {
          image = await pdfDoc.embedJpg(arrayBuffer);
        } else {
          // Convert other formats (WebP, BMP, etc.) to PNG via Canvas
          var img = await loadImage(selectedFiles[i]);
          var canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          var pngData = canvas.toDataURL('image/png');
          var pngBytes = dataURLToArrayBuffer(pngData);
          image = await pdfDoc.embedPng(pngBytes);
        }

        var page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }

      progressBarFill.style.width = '95%';
      progressText.textContent = 'Finalizing...';

      var pdfBytes = await pdfDoc.save();
      var blob = new Blob([pdfBytes], { type: 'application/pdf' });
      var url = URL.createObjectURL(blob);
      downloadBtn.href = url;
      downloadBtn.download = 'images.pdf';
      pageCount.textContent = total;

      progressBarFill.style.width = '100%';
      progressText.textContent = 'Done!';
      setTimeout(function() { progressContainer.classList.remove('show'); resultContainer.classList.add('show'); }, 500);
      trackEvent('convert_success', { tool: 'image_to_pdf', file_count: total });

    } catch (err) {
      showStatus('Error: ' + (err.message || 'Failed to create PDF'), true);
      trackEvent('convert_fail', { tool: 'image_to_pdf', error: (err.message || '').substring(0, 100) });
      progressContainer.classList.remove('show'); convertBtn.disabled = false;
    }
  });

  function loadImage(file) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.onload = function() { resolve(img); };
      img.onerror = function() { reject(new Error('Failed to load image')); };
      img.src = URL.createObjectURL(file);
    });
  }

  function dataURLToArrayBuffer(dataURL) {
    var parts = dataURL.split(',');
    var binary = atob(parts[1]);
    var array = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) { array[i] = binary.charCodeAt(i); }
    return array.buffer;
  }

})();
