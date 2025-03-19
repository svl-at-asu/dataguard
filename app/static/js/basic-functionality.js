
const resizer = document.getElementById('center-resizer');
const topPanel = document.getElementById('center-top-panel');
const bottomPanel = document.getElementById('center-bottom-panel');
const container = document.querySelector('.center-container');
const anonymizeDataButton = document.getElementById('apply-pv-button');
const editor = document.getElementById("editor-window"); 
const codeMirrorEditor = CodeMirror(editor, {
  mode: "application/json",  
  theme: "default", 
  lineNumbers: true, 
  indentUnit: 2,
  tabSize: 2, 
  viewportMargin: Infinity
});
codeMirrorEditor.setSize('100%', '100%'); 

function resizeCodeMirrorEditor() {
  codeMirrorEditor.refresh();
}

let isResizing = false;

topPanel.style.height = '50%';
bottomPanel.style.height = '50%';

resizer.addEventListener('mousedown', function (e) {
  isResizing = true;
  document.body.style.cursor = 'row-resize';
  document.body.style.userSelect = 'none'; 
});

document.addEventListener('mousemove', function (e) {
  if (!isResizing) return; 

  const containerRect = container.getBoundingClientRect();
  const newTopHeight = ((e.clientY - containerRect.top) / containerRect.height) * 100;

  if (newTopHeight < 7.5 || newTopHeight > 92.5) return;

  topPanel.style.height = `${newTopHeight}%`;
  bottomPanel.style.height = `${100 - newTopHeight}%`;
  
  resizeCodeMirrorEditor();
});

document.addEventListener('mouseup', function () {
  isResizing = false;
  document.body.style.cursor = ''; 
  document.body.style.userSelect = '';
});

resizer.addEventListener('dblclick', function () {
  topPanel.style.height = '50%';
  bottomPanel.style.height = '50%';

  resizeCodeMirrorEditor();
});

function toggleMenu(header) {
  header.classList.toggle('collapsed');
}

function toggleMessage(elementId) {
  const messageElement = document.getElementById(elementId);

  messageElement.classList.toggle('show-message');

  if (messageElement.classList.contains('show-message')) {
    document.addEventListener('click', (event) => outsideClickListener(event, elementId));
  } else {
    document.removeEventListener('click', (event) => outsideClickListener(event, elementId));
  }
}

function outsideClickListener(event, elementId) {
  const messageElement = document.getElementById(elementId);
  const iconId = elementId === 'infoMessage' ? 'editor-info' : 'metric-info';

  if (!messageElement.contains(event.target) && event.target.id !== iconId) {
    messageElement.classList.remove('show-message'); 
    document.removeEventListener('click', (event) => outsideClickListener(event, elementId));
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const fileInput = document.getElementById('file-input');
  const fileNameDisplay = document.getElementById('file-name');
  const loadButton = document.getElementById('load-file-button');

  loadButton.addEventListener("click", () => {
    const outputWindow = document.getElementById('output-window');
    outputWindow.innerHTML = ''; 
    hideOverlay();
    fileInput.click(); 
  });

  fileInput.addEventListener("change", event => {
    const reader = new FileReader();
    
    reader.onload = e => codeMirrorEditor.setValue(e.target.result);
    
    if (event.target.files.length > 0) {
      reader.readAsText(event.target.files[0]);
      updateFileName(event.target.files[0].name);
    } else {
      updateFileName(null); 
    }
  });
   
  function updateFileName(fileName) {
    fileNameDisplay.textContent = fileName ? fileName : 'No file selected';
  }
});

function handleSaveClick() {
  const promptMessage = "You can now save this Vega-Lite specification.\n\nEnter your desired file name:";
  let fileName = prompt(promptMessage, "vega-lite-spec.json");

  if (fileName === null) {
      console.log("[handleSaveClick()] Save action was canceled by the user.");
      return; 
  }

  fileName = fileName.trim();

  if (!fileName) {
      fileName = "vega-lite-spec.json";
  } else if (!fileName.endsWith('.json')) {
      fileName += ".json"; 
  }

  const spec = codeMirrorEditor.getValue(); 
  const blob = new Blob([spec], { type: "application/json" });
  const url = URL.createObjectURL(blob); 

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = fileName; 
  downloadLink.style.display = "none"; 
  document.body.appendChild(downloadLink); 

  downloadLink.click(); 
  document.body.removeChild(downloadLink); 
}


document.addEventListener("DOMContentLoaded", () => {
	const loadSampleDataButton = document.getElementById("load-example"); 
    const fileInput = document.getElementById("file-input"); 
    const urlInput = document.getElementById("url-input"); 
    const loadFromURLButton = document.getElementById("url-button");
    const saveButton = document.getElementById("save-button");

	saveButton.addEventListener("click", handleSaveClick);
codeMirrorEditor.on("change", function (instance) {
  const spec = instance.getValue();        

  try {
      let jsonSpec = JSON.parse(spec);
      jsonSpec.background = '#fafafa'; 

      vegaEmbed("#original-plot", jsonSpec, { 
          actions: { 
              export: true, 
              source: false, 
              compiled: false, 
              editor: false 
          } 
      })
      .catch(error => {
          console.error("[CodeMirrorEditor] Error rendering visualization:", error);
      });

  } catch (error) {
      console.error("[CodeMirrorEditor] Error parsing JSON:", error);
  }
});

    loadSampleDataButton.addEventListener("click", function () {
    const outputWindow = document.getElementById('output-window');
    outputWindow.innerHTML = ''; 
    hideOverlay();
        codeMirrorEditor.setValue(randomExample()); 
    }); 
    loadFromURLButton.addEventListener("click", () => {  
        const outputWindow = document.getElementById('output-window');
        outputWindow.innerHTML = ''; 
        hideOverlay();      
        fetch(urlInput.value)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                var urlData = (response.type === 'basic') ? "" : response.text();
                return urlData;
            })
            .then(urlData => {
                if (urlData === "") {
                  urlData = `// The URL you entered appears to be empty or invalid. Please try again, or you may explore one of the following example URLs: 
//    1. [Bar Chart]: https://raw.githubusercontent.com/vega/vega-lite/refs/heads/main/examples/specs/bar_column_pivot.vl.json
//    2. [Histogram]: https://raw.githubusercontent.com/vega/vega-lite/refs/heads/main/examples/specs/histogram_log.vl.json
//    3. [Trellis]: https://raw.githubusercontent.com/vega/vega-lite/refs/heads/main/examples/specs/trellis_cross_sort_array.vl.json
//    4. [Waterfall Chart]: https://raw.githubusercontent.com/vega/vega-lite/refs/heads/main/examples/specs/waterfall_chart.vl.json
//    5. [Scatterplot with Brush Interaction]: https://raw.githubusercontent.com/vega/vega-lite/refs/heads/main/examples/specs/selection_brush_timeunit.vl.json
//    6. [Pie Chart with Tooltip]: https://raw.githubusercontent.com/vega/vega-lite/refs/heads/main/examples/specs/arc_pie_normalize_tooltip.vl.json

// Note: Please be aware that these examples do not include privacy grammar. For additional information, you can explore the info button at the top right of the editor.`;                  
                }
                codeMirrorEditor.setValue(urlData);
            })
            .catch(error => console.error(`[loadFromURLButton] Error: ${error.message}`));
    });
});