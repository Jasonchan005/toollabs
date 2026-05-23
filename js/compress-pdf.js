(function() {
  'use strict';

  var dropZone = document.getElementById('dropZone');
  var fileInfo = document.getElementById('fileInfo');
  var fileName = document.getElementById('fileName');
  var fileSize = document.getElementById('fileSize');
  var compressBtn = document.getElementById('compressBtn');
  var compressLevel = document.getElementById('compressLevel');
  var progressContainer = document.getElementById('progressContainer');
  var progressBarFill = document.getElementById('progressBarFill');
  var progressText = document.getElementById('progressText');
  var resultContainer = document.getElementById('resultContainer');
  var downloadBtn = document.getElementById('downloadBtn');
  var compressResultText = document.getElementById('compressResultText');
  var statusMsg = document.getElementById('statusMsg');

  var selectedFile = null;

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
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  function handleFile(file) {
    if (!file.name.toLowerCase().endsWith('.pdf')) { showStatus('Please select a PDF file.', true); return; }
    if (file.size > 100 * 1024 * 1024) { showStatus('File exceeds 100MB limit.', true); return; }
    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatSize(file.size);
    fileInfo.classList.add('show');
    dropZone.style.display = 'none';
    compressBtn.disabled = false;
    hideStatus();
  }

  dropZone.addEventListener('click', function() {
    var input = document.createElement('input');
    input.type = 'file'; input.accept = '.pdf'; input.style.display = 'none';
    document.body.appendChild(input);
    input.addEventListener('change', function() { if (this.files && this.files.length > 0) handleFile(this.files[0]); document.body.removeChild(input); });
    input.click();
  });

  dropZone.addEventListener('dragover', function(e) { e.preventDefault(); this.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', function(e) { e.preventDefault(); this.classList.remove('dragover'); });
  dropZone.addEventListener('drop', function(e) {
    e.preventDefault(); this.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
  });

  compressBtn.addEventListener('click', async function() {
    if (!selectedFile) return;

    compressBtn.disabled = true;
    progressContainer.classList.add('show');
    resultContainer.classList.remove('show');
    progressBarFill.style.width = '0%';
    progressText.textContent = 'Reading PDF...';

    try {
      var originalSize = selectedFile.size;
      var arrayBuffer = await selectedFile.arrayBuffer();
      progressBarFill.style.width = '30%';
      progressText.textContent = 'Compressing...';

      // Load with pdf-lib
      var pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
        updateMetadata: false
      });

      progressBarFill.style.width = '50%';
      progressText.textContent = 'Optimizing structure...';

      // Remove metadata to save space
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('ToolLabs PDF Compressor');
      pdfDoc.setCreator('ToolLabs');

      // Get compression settings
      var level = compressLevel.value;

      progressBarFill.style.width = '70%';
      progressText.textContent = 'Writing compressed PDF...';

      // Save with compression options
      var compressedBytes = await pdfDoc.save({
        useObjectStreams: level !== 'low',
        addDefaultPage: false,
        objectsPerTick: level === 'high' ? 10 : 50
      });

      progressBarFill.style.width = '90%';
      progressText.textContent = 'Done!';

      var compressedSize = compressedBytes.length;
      var savings = Math.round((1 - compressedSize / originalSize) * 100);

      // Prepare download
      var blob = new Blob([compressedBytes], { type: 'application/pdf' });
      var url = URL.createObjectURL(blob);
      downloadBtn.href = url;
      downloadBtn.download = selectedFile.name.replace(/\.pdf$/i, '') + '-compressed.pdf';

      compressResultText.textContent = 'Reduced from ' + formatSize(originalSize) + ' to ' + formatSize(compressedSize) + ' (' + savings + '% reduction)';

      progressBarFill.style.width = '100%';
      setTimeout(function() {
        progressContainer.classList.remove('show');
        resultContainer.classList.add('show');
      }, 500);

    } catch (err) {
      showStatus('Error: ' + (err.message || 'Compression failed'), true);
      progressContainer.classList.remove('show');
      compressBtn.disabled = false;
    }
  });

})();
