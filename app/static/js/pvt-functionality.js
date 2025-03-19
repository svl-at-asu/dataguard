let sortedDatasets = []
let sortedMetrics = []
let vegaSpec = []
let privacyMethod = []
let privacyParameter = []
const divCache = {};

async function handleAnonymizeData() {
    showOverlay('loading');

const jsonInput = codeMirrorEditor.getValue();
let parsedJSON;

try {
    parsedJSON = JSON.parse(jsonInput);
} catch (error) {
    showOverlay('custom', "Failed to Parse Vega-Lite Specification.")
    console.error("Failed to parse JSON:", error);
    return;
}
if (parsedJSON && parsedJSON.privacy) {
    const privacy = parsedJSON.privacy;

    if (!privacy.method) {
        showOverlay('custom', "Privacy method is missing in Vega-Lite Specification.");
        console.error("Privacy method is missing.");
        return;
    } else if (!privacy.parameter) {
        showOverlay('custom', "Privacy parameter is missing in Vega-Lite Specification.");
        console.error("Privacy parameter is missing.");
        return;
    } else if (!privacy["quasi-identifier"]) {
        showOverlay('custom', "Privacy 'quasi-identifier' is missing in Vega-Lite Specification.");
        console.error("Privacy 'quasi_identifier' is missing.");
        return;
    } else {
        try {
            privacyMethod = privacy.method;
            privacyParameter = privacy.parameter;
            privacyQuasiIdentifier = privacy["quasi-identifier"];
            if (privacyMethod === "l-diversity") {
                if (privacy.hasOwnProperty("sensitive")) {
                    privacySensitive = privacy.sensitive;
                } else {
                    showOverlay('custom', "Privacy 'sensitive' is required for l-diversity method.");
                    console.error("Privacy 'sensitive' is missing for l-diversity method.");
                    return;
                }
            } else {
                privacySensitive = privacy["sensitive"] || null;
            }
        } catch (error) {
            showOverlay('custom', "Error parsing privacy fields.");
            console.error("Error retrieving privacy fields:", error);
            return;
        }
    }
} else {
    showOverlay('no_grammar');
    console.error("Privacy object not found in parsed JSON.");
    return;
}

const specificationData = parsedJSON.data.values;
console.log("Parsed JSON:", parsedJSON.privacy)
const endpointURL = "http://localhost:8080/query_pvt";

vegaSpec = parsedJSON

try {
    const queryParams = new URLSearchParams({
        method: privacyMethod,
        parameter: privacyParameter,
        sensitive: privacySensitive,
        quasi_identifier: privacyQuasiIdentifier
    });

    postData(`${endpointURL}?${queryParams}`, specificationData)
        .then(response => response.json())
        .then(responseBody => {
            sortedDatasets = responseBody.data;
            sortedMetrics = responseBody.metrics;

            createStatPlots(sortedMetrics);
            createPPVisualizations(sortedDatasets, sortedMetrics, parsedJSON);
        });

} catch (error) {
    showOverlay('custom', "An Error Occurred POSTing data.");
    console.error('An error occurred:', error);
} 

}

function getUtilityMeasures(utilityTableParsed) {
    return Object.keys(utilityTableParsed[0]).filter(key => key !== 'DatasetID');
}

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(data)
    });

    return response;
}

anonymizeDataButton.addEventListener("click", handleAnonymizeData);

function createPPVisualizations(sortedDatasets, sortedMetrics, vegaSpec, nShown = 4) {

    const outputWindow = document.getElementById('output-window');
    outputWindow.innerHTML = ''; 
    const selectElement = document.getElementById('visualization-count');
    const maxCount = document.getElementById('visualization-count-max');
    maxCount.innerHTML = ` (of ${(sortedDatasets.length).toLocaleString()}) `;

    for (let i = 0; i < nShown && i < sortedDatasets.length; i++) {
        const vizId = `privacy-preserved-visualization-${i + 1}`;
        
        const vizDiv = document.createElement('div');
        vizDiv.id = vizId; 
        vizDiv.classList.add('privacy-output'); 
        
        outputWindow.appendChild(vizDiv);       
        divCache[vizId] = vizDiv

        const spec = JSON.parse(JSON.stringify(vegaSpec)); 
        spec.data = { values: sortedDatasets[i] }; 

        let textTitle;
        let textSubtitle = ""
        if (privacyMethod === "differential-privacy") {
            textTitle = `Differentially-Private`;
            textSubtitle = `, ε = ${privacyParameter}`;
        } else if (privacyMethod === "k-anonymity") {
            textTitle = `${privacyParameter}-Anonymized`;
        } else if (privacyMethod === "l-diversity") {
            textTitle = `${privacyParameter}-Diverse`;
        } else if (privacyMethod === "t-closeness") {
            textTitle = `${privacyParameter}-Close`;
        } else if (privacyMethod !== "differential-privacy") {
            if (spec.encoding.x && spec.encoding.x.field === vegaSpec.privacy.sensitive) {
                spec.encoding.x.type = "nominal";
            } else if (spec.encoding.y && spec.encoding.y.field === vegaSpec.privacy.sensitive) {
                spec.encoding.y.type = "nominal";
            }
        }

        spec.title = {
            text: [textTitle, "Visualization"],
            subtitle: `Utility: ${sortedMetrics[i].utility.toFixed(3)}${textSubtitle}`
        };

        const privacyOutputs = document.querySelectorAll('.privacy-output');
        const canvasElement = document.querySelector('.marks'); 

        if (privacyOutputs.length > 0 && canvasElement) {
            const canvasWidth = canvasElement.width;

            privacyOutputs.forEach((privacyOutput) => {
                const privacyOutputWidth = privacyOutput.clientWidth;

                console.log("Canvas width:", canvasWidth);
                console.log(".privacy-output width:", privacyOutputWidth);

                if (canvasWidth >= privacyOutputWidth * 1.25) {
                    privacyOutput.style.width = `${privacyOutputWidth * 2.1}px`;
                    console.log(".privacy-output width temporarily doubled:", privacyOutput.style.width);

                    setTimeout(() => {
                        privacyOutput.style.width = `${privacyOutputWidth}px`; // Revert to the original width
                        console.log(".privacy-output width reverted to original:", privacyOutput.style.width);
                    }, 9999999); 
                } else {
                    const canvasHeight = canvasElement.height;
                    const updatedPrivacyOutputWidth = privacyOutput.clientWidth;
                    const privacyOutputHeight = privacyOutput.clientHeight;

                    console.log("Updated .privacy-output width:", updatedPrivacyOutputWidth);
                    console.log(".privacy-output height:", privacyOutputHeight);
                    console.log("spec before adjustment:", spec.width, spec.height);

                    if (canvasWidth > privacyOutputWidth * 0.95) {
                        spec.width = 110;
                    }
                    if (canvasHeight > privacyOutputHeight * 0.95) {
                        spec.height = 165; 
                    }

                    console.log("Adjusted spec dimensions:", spec.width, spec.height);
                }
            });
        }



        vegaEmbed(`#${vizId}`, spec, { actions: { export: true, source: true, compiled: false, editor: false } })
            .then(result => {                
                const vegaView = result.view.container();
                vegaView.classList.add('private-pad-marks'); 

                vegaView.style.paddingLeft = 'clamp(0px, 10px, 30vw)';
                vegaView.style.paddingRight = 'clamp(0px, 10px, 30vw)';

                const numberElement = document.createElement('div');
                numberElement.textContent = `${i + 1}`;
                
                numberElement.style.position = 'absolute';
                numberElement.style.bottom = '10px'; 
                numberElement.style.right = '10px'; 
                numberElement.style.fontSize = '12px';
                numberElement.style.color = '#7f8c8d';
                numberElement.style.opacity = '0.7';  
                numberElement.style.fontWeight = 'bold';  

                const vizContainer = document.getElementById(vizId);
                vizContainer.style.position = 'relative'; 
                vizContainer.appendChild(numberElement);  
            })
            .catch(err => {
                console.error(`Error rendering visualization ${i + 1}:`, err);
            });
    }
}


document.getElementById('visualization-count').addEventListener('change', function(event) {
    const nSelected = event.target.value === "all" ? sortedDatasets.length: event.target.value;
    const nShown = parseInt(nSelected, 10);
    createPPVisualizations(sortedDatasets, sortedMetrics, vegaSpec, nShown); 
});

function createStatPlots(sortedMetrics) {
const metricDropdown = document.getElementById("metric-select");
const metricKeys = Object.keys(sortedMetrics[0]);


    while (metricDropdown.firstChild) {
        metricDropdown.removeChild(metricDropdown.firstChild);
    }

    const utilityOption = document.createElement('option');
    utilityOption.value = "utility";
    utilityOption.textContent = "utility";
    utilityOption.selected = true; 
    metricDropdown.appendChild(utilityOption);

    metricKeys.forEach((key) => {
        if (key !== "utility") {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            metricDropdown.appendChild(option);
        }
    });

    function updateBarPlot(selectedMetric) {
        const data = sortedMetrics.map((metric, index) => ({
            index: index + 1,
            value: metric[selectedMetric].toFixed(3)
        }));
    
        function toTitleCase(str) {
            return str
                .toLowerCase() 
                .split(' ') 
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))  
                .join(' ');
        }
    
        var spec = {};
        const switchPoint = 15;
    
        if (data.length <= switchPoint) {
            spec = {
                data: { values: data },
                mark: "bar",
                width: "container",
                encoding: {
                    x: {
                        field: "index",
                        type: "nominal",
                        axis: {
                            title: "Visualizations",
                            labelAngle: 0
                        }
                    },
                    y: {
                        field: "value",
                        type: "quantitative",
                        axis: { title: toTitleCase(selectedMetric) }
                    },
                    tooltip: [
                        { field: "index", type: "ordinal", title: "Visualization" },
                        { field: "value", type: "quantitative", title: toTitleCase(selectedMetric) }
                    ]
                },
                selection: {
                    hover: {
                        type: "single",
                        on: "mouseover",
                        empty: "none",
                        clear: "mouseout"
                    }
                },
                background: '#fafafa'
            };
        } else {
            spec = {
                data: { values: data },
                width: "container",
                encoding: {
                    x: { field: "index", type: "nominal", axis: {ticks: false, labels: false, title: false}},
                    tooltip: [
                        { field: "index", type: "ordinal", title: "Visualization" },
                        { field: "value", type: "quantitative", title: toTitleCase(selectedMetric) }
                    ]
                },
                layer: [
                    {
                        mark: { type: "line", point: { size: 10 } },
                        encoding: { y: { field: "value", type: "quantitative", 
                            axis: { title: toTitleCase(selectedMetric) }
                         } }
                    },
                    {
                        mark: "rule",
                        params: [{ name: "hover", select: { type: "point", on: "pointerover" } }],
                        encoding: {
                            color: {
                                condition: { param: "hover", empty: false, value: "black" },
                                value: "transparent"
                            }
                        }
                    }
                ],
                background: '#fafafa'
            };
        }

        vegaEmbed("#metric-plot", spec).then((result) => {
            const view = result.view;
    
            view.addSignalListener('hover', (name, value) => {
                const id = value._vgsid_ !== undefined ? Array.from(value._vgsid_)[0] : -1;
                if (id === -1) {
                    Object.keys(divCache).forEach(key => {
                        const targetDiv = divCache[key];
                        if (targetDiv) {
                            targetDiv.style.border = "2px solid #7f8c8d"; 
                        }
                    });
                } else {
                    const visualizationId = `privacy-preserved-visualization-${id}`;
                    const targetDiv = divCache[visualizationId];
    
                    if (targetDiv) {
                        targetDiv.style.border = "3px dotted #8b8b8b"; 
                    } else {
                        console.error(`No element found with id ${visualizationId}`);
                    }
                }
            });
        });
    }
    

    metricDropdown.addEventListener('change', (event) => {
        const selectedMetric = event.target.value;
        updateBarPlot(selectedMetric); 
    });

    updateBarPlot('utility');

}