(function() {
  'use strict';

  // GA event helper
  function trackEvent(action, params) {
    if (typeof gtag === 'function') gtag('event', action, params || {});
  }

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
  var customFontLoaded = false;

  function showStatus(msg, isErr) { statusMsg.style.display = 'block'; statusMsg.style.background = isErr ? '#fee2e2' : '#dbeafe'; statusMsg.style.color = isErr ? '#b91c1c' : '#1e40af'; statusMsg.textContent = msg; }
  function hideStatus() { statusMsg.style.display = 'none'; }
  function formatSize(bytes) { if (bytes < 1024) return bytes + ' B'; if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'; return (bytes / (1024 * 1024)).toFixed(1) + ' MB'; }

  function handleFile(file) {
    if (!file.name.toLowerCase().endsWith('.docx')) { showStatus('Please select a .docx file.', true); return; }
    if (file.size > 50 * 1024 * 1024) { showStatus('File exceeds 50MB limit.', true); return; }
    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatSize(file.size);
    fileInfo.classList.add('show'); dropZone.style.display = 'none'; convertBtn.disabled = false; hideStatus(); resultContainer.classList.remove('show');
    trackEvent('file_selected', { tool: 'word_to_pdf', file_size: file.size });
  }

  dropZone.addEventListener('click', function() {
    var input = document.createElement('input'); input.type = 'file'; input.accept = '.docx'; input.style.display = 'none';
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

  convertBtn.addEventListener('click', async function() {
    if (!selectedFile) return;
    trackEvent('convert_start', { tool: 'word_to_pdf', file_size: selectedFile.size });
    convertBtn.disabled = true;
    progressContainer.classList.add('show'); resultContainer.classList.remove('show');
    progressBarFill.style.width = '0%'; progressText.textContent = 'Reading Word document...';

    try {
      var arrayBuffer = await selectedFile.arrayBuffer();
      progressBarFill.style.width = '20%';

      // Convert DOCX to HTML using mammoth
      progressText.textContent = 'Parsing document...';
      var result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
      var html = result.value;

      // Extract text
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      var paragraphs = tempDiv.textContent.split('\n').filter(function(p) { return p.trim(); });

      progressBarFill.style.width = '40%';
      progressText.textContent = 'Loading font...';

      // Load Chinese font
      var fontResp = await fetch('/lib/NotoSansSC.otf');
      var fontBuffer = await fontResp.arrayBuffer();

      progressBarFill.style.width = '60%';
      progressText.textContent = 'Generating PDF...';

      // Create PDF with jsPDF
      var doc = new jspdf.jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
      doc.addFileToVFS('NotoSansSC.otf', btoa(String.fromCharCode.apply(null, new Uint8Array(fontBuffer))));
      doc.addFont('NotoSansSC.otf', 'NotoSansSC', 'normal');
      doc.setFont('NotoSansSC');

      var pageW = doc.internal.pageSize.getWidth();
      var margin = 50;
      var maxW = pageW - margin * 2;
      var y = 60;
      var lineH = 18;
      var fontSize = 11;

      doc.setFontSize(fontSize);

      for (var i = 0; i < paragraphs.length; i++) {
        var text = paragraphs[i].trim();
        if (!text) { y += lineH / 2; continue; }

        // Check if we need a new page
        if (y > 780) {
          doc.addPage();
          y = 60;
        }

        // Detect headings
        var isHeading = text.length < 60 && text.length > 5 && !/[.!?:，。？]$/.test(text);
        if (isHeading) {
          doc.setFontSize(14);
          doc.setFont('NotoSansSC', 'bold');
          doc.text(text, margin, y, { maxWidth: maxW });
          doc.setFont('NotoSansSC', 'normal');
          doc.setFontSize(fontSize);
          y += lineH + 8;
        } else {
          var lines = doc.splitTextToSize(text, maxW);
          for (var li = 0; li < lines.length; li++) {
            if (y > 780) { doc.addPage(); y = 60; }
            doc.text(lines[li], margin, y);
            y += lineH;
          }
        }
      }

      var pdfBlob = doc.output('blob');
      var url = URL.createObjectURL(pdfBlob);
      downloadBtn.href = url;
      downloadBtn.download = selectedFile.name.replace(/\.docx$/i, '') + '.pdf';

      progressBarFill.style.width = '100%';
      progressText.textContent = 'Done!';
      setTimeout(function() { progressContainer.classList.remove('show'); resultContainer.classList.add('show'); }, 500);
      trackEvent('convert_success', { tool: 'word_to_pdf', file_size: selectedFile.size });

    } catch (err) {
      showStatus('Error: ' + (err.message || 'Conversion failed'), true);
      trackEvent('convert_fail', { tool: 'word_to_pdf', error: (err.message || '').substring(0, 100) });
      progressContainer.classList.remove('show'); convertBtn.disabled = false;
    }
  });

})();
