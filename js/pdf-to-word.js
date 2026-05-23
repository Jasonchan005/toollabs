(function() {
  'use strict';

  var dropZone = document.getElementById('dropZone');
  var fileInfo = document.getElementById('fileInfo');
  var fileName = document.getElementById('fileName');
  var fileSize = document.getElementById('fileSize');
  var convertBtn = document.getElementById('convertBtn');
  var progressContainer = document.getElementById('progressContainer');
  var progressBarFill = document.getElementById('progressBarFill');
  var progressText = document.getElementById('progressText');
  var resultContainer = document.getElementById('resultContainer');
  var downloadBtn = document.getElementById('downloadBtn');
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
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function showFileInfo(file) {
    fileName.textContent = file.name;
    fileSize.textContent = formatSize(file.size);
    fileInfo.classList.add('show');
    dropZone.style.display = 'none';
    convertBtn.disabled = false;
    hideStatus();
  }

  // Check libraries
  if (typeof pdfjsLib === 'undefined' || typeof docx === 'undefined') {
    showStatus('Required libraries failed to load. Please refresh the page.', true);
  }
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/lib/pdf.worker.min.js';
  }

  // === Click to upload ===
  dropZone.addEventListener('click', function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,application/pdf';
    input.style.display = 'none';
    document.body.appendChild(input);
    input.addEventListener('change', function() {
      if (this.files && this.files.length > 0) {
        handleFile(this.files[0]);
      }
      document.body.removeChild(input);
    });
    input.click();
  });

  // === Drag and drop ===
  dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', function(e) {
    e.preventDefault();
    this.classList.remove('dragover');
  });
  dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  // === File Handler ===
  function handleFile(file) {
    var isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPDF) { showStatus('Please select a valid PDF file.', true); return; }
    if (file.size > 100 * 1024 * 1024) { showStatus('File size exceeds 100MB limit.', true); return; }
    selectedFile = file;
    showFileInfo(file);
    resultContainer.classList.remove('show');
  }

  // === Convert ===
  convertBtn.addEventListener('click', async function() {
    if (!selectedFile) return;
    if (typeof pdfjsLib === 'undefined' || typeof docx === 'undefined') {
      showStatus('Libraries not loaded. Refresh the page.', true);
      return;
    }

    convertBtn.disabled = true;
    progressContainer.classList.add('show');
    resultContainer.classList.remove('show');
    progressBarFill.style.width = '0%';
    progressText.textContent = 'Reading PDF file...';

    try {
      var arrayBuffer = await selectedFile.arrayBuffer();
      var pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      var totalPages = pdf.numPages;
      var fullText = '';

      for (var i = 1; i <= totalPages; i++) {
        progressBarFill.style.width = Math.round((i / totalPages) * 40) + '%';
        progressText.textContent = 'Reading page ' + i + ' of ' + totalPages + '...';
        var page = await pdf.getPage(i);
        var textContent = await page.getTextContent();
        for (var j = 0; j < textContent.items.length; j++) {
          fullText += textContent.items[j].str + ' ';
        }
        fullText += '\n\n';
      }

      progressText.textContent = 'Generating Word document...';
      progressBarFill.style.width = '70%';

      var paragraphs = fullText.split('\n').filter(function(p) { return p.trim(); });
      var children = paragraphs.map(function(p) {
        return new docx.Paragraph({
          children: [new docx.TextRun({ text: p.trim(), size: 24 })],
          spacing: { after: 120 }
        });
      });

      var doc = new docx.Document({ sections: [{ children: children }] });
      var blob = await docx.Packer.toBlob(doc);

      progressBarFill.style.width = '100%';
      progressText.textContent = 'Done!';

      // Prepare download
      var docxBlob = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      var url = URL.createObjectURL(docxBlob);
      var filename = selectedFile.name.replace(/\.pdf$/i, '') + '.docx';

      downloadBtn.href = url;
      downloadBtn.download = filename;

      setTimeout(function() {
        progressContainer.classList.remove('show');
        resultContainer.classList.add('show');
      }, 500);

    } catch (err) {
      showStatus('Error: ' + (err.message || 'Conversion failed'), true);
      progressContainer.classList.remove('show');
      convertBtn.disabled = false;
    }
  });

})();
