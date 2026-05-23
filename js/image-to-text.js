(function() {
  'use strict';

  var dropZone = document.getElementById('dropZone');
  var imagePreview = document.getElementById('imagePreview');
  var langSelect = document.getElementById('langSelect');
  var extractBtn = document.getElementById('extractBtn');
  var progressContainer = document.getElementById('progressContainer');
  var progressBarFill = document.getElementById('progressBarFill');
  var progressText = document.getElementById('progressText');
  var resultBox = document.getElementById('resultBox');
  var resultActions = document.getElementById('resultActions');
  var statusMsg = document.getElementById('statusMsg');

  var selectedFile = null;
  var tesseractWorker = null;

  function showStatus(msg, isErr) {
    statusMsg.style.display = 'block';
    statusMsg.style.background = isErr ? '#fee2e2' : '#dbeafe';
    statusMsg.style.color = isErr ? '#b91c1c' : '#1e40af';
    statusMsg.textContent = msg;
  }
  function hideStatus() { statusMsg.style.display = 'none'; }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function handleFile(file) {
    var isImage = file.type.startsWith('image/');
    if (!isImage) { showStatus('Please select a valid image file (JPG, PNG, etc.).', true); return; }
    if (file.size > 20 * 1024 * 1024) { showStatus('File exceeds 20MB limit.', true); return; }
    selectedFile = file;
    dropZone.style.display = 'none';
    extractBtn.disabled = false;
    hideStatus();

    // Show preview
    var reader = new FileReader();
    reader.onload = function(e) {
      imagePreview.src = e.target.result;
      imagePreview.classList.add('show');
    };
    reader.readAsDataURL(file);
  }

  // === Click to upload ===
  dropZone.addEventListener('click', function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    document.body.appendChild(input);
    input.addEventListener('change', function() {
      if (this.files && this.files.length > 0) handleFile(this.files[0]);
      document.body.removeChild(input);
    });
    input.click();
  });

  // === Drag and drop ===
  dropZone.addEventListener('dragover', function(e) { e.preventDefault(); this.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', function(e) { e.preventDefault(); this.classList.remove('dragover'); });
  dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
  });

  // === Extract Text ===
  extractBtn.addEventListener('click', async function() {
    if (!selectedFile) return;
    if (typeof Tesseract === 'undefined') {
      showStatus('OCR library not loaded. Please refresh the page.', true);
      return;
    }

    extractBtn.disabled = true;
    progressContainer.classList.add('show');
    resultBox.classList.remove('show');
    resultActions.style.display = 'none';
    progressBarFill.style.width = '0%';
    progressText.textContent = 'Initializing OCR engine...';

    try {
      var lang = langSelect.value;

      var result = await Tesseract.recognize(
        selectedFile,
        lang,
        {
          logger: function(m) {
            if (m.status === 'loading tesseract core') {
              progressText.textContent = 'Loading OCR engine...';
              progressBarFill.style.width = '10%';
            } else if (m.status === 'initializing tesseract') {
              progressText.textContent = 'Initializing...';
              progressBarFill.style.width = '20%';
            } else if (m.status === 'loading language traineddata') {
              var pct = Math.round((m.progress || 0) * 30);
              progressBarFill.style.width = (20 + pct) + '%';
              progressText.textContent = 'Downloading language pack (' + lang.split('+')[0] + ')... This happens once.';
            } else if (m.status === 'initializing api') {
              progressText.textContent = 'Starting OCR...';
              progressBarFill.style.width = '55%';
            } else if (m.status === 'recognizing text') {
              var pct = Math.round((m.progress || 0) * 40);
              progressBarFill.style.width = (55 + pct) + '%';
              progressText.textContent = 'Recognizing text... ' + Math.round((m.progress || 0) * 100) + '%';
            }
          }
        }
      );

      progressBarFill.style.width = '100%';
      progressText.textContent = 'Done!';

      var text = result.data.text;
      resultBox.value = text;
      resultBox.classList.add('show');
      resultActions.style.display = 'block';

      setTimeout(function() {
        progressContainer.classList.remove('show');
      }, 500);

    } catch (err) {
      showStatus('Error: ' + (err.message || 'OCR failed'), true);
      progressContainer.classList.remove('show');
      extractBtn.disabled = false;
    }
  });

  // === Global functions for buttons ===
  window.copyResult = function() {
    var text = resultBox.value;
    if (!text) return;
    navigator.clipboard.writeText(text).then(function() {
      showStatus('Text copied to clipboard!');
      setTimeout(hideStatus, 2000);
    }).catch(function() {
      // Fallback
      resultBox.select();
      document.execCommand('copy');
      showStatus('Text copied!');
      setTimeout(hideStatus, 2000);
    });
  };

  window.downloadResult = function() {
    var text = resultBox.value;
    if (!text) return;
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

})();
