function showOverlay(type, customMessage = '') {
    const outputWindow = document.getElementById('output-window');

    const old_overlay = document.getElementById('loading-overlay');
    if (old_overlay) {
        old_overlay.parentNode.removeChild(old_overlay);
    }

    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.zIndex = '100';
    overlay.style.visibility = 'hidden';

    if (type === 'no_grammar') {
        const mainMessage = document.createElement('div');
        mainMessage.textContent = 'No Privacy Grammar Found';
        mainMessage.style.fontSize = '24px';
        mainMessage.style.fontWeight = 'bold';
        mainMessage.style.color = '#34495e';
        mainMessage.style.marginBottom = '10px';

        const subMessage = document.createElement('div');
        subMessage.innerHTML = 'Please modify your Vega-Lite specification. Click Specification Editor <i class="fas fa-info-circle" style="font-size: inherit; vertical-align: middle; margin: 0; padding: 0; line-height: 1; pointer-events: none;"></i> for help.';
        subMessage.style.fontSize = '14px';
        subMefssage.style.color = '#7f8c8d';

        overlay.appendChild(mainMessage);
        overlay.appendChild(subMessage);

    } else if (type === 'loading') {
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.textContent = 'Loading...';
        loadingText.style.fontSize = '24px';
        loadingText.style.color = '#34495e';
        loadingText.style.marginBottom = '20px';

        const loadingBar = document.createElement('div');
        loadingBar.className = 'loading-bar';
        loadingBar.style.width = '0%';
        loadingBar.style.height = '10px';
        loadingBar.style.backgroundColor = '#34495e';
        loadingBar.style.borderRadius = '5px';
        loadingBar.style.maxWidth = '300px';
        loadingBar.style.transition = 'width 2s ease-in-out';
        loadingBar.style.marginBottom = '20px';

        const timeCounter = document.createElement('div');
        timeCounter.className = 'time-counter';
        timeCounter.style.fontSize = '10px';
        timeCounter.style.color = '#7f8c8d4f';
        timeCounter.textContent = '(0 secs)';
        timeCounter.style.marginBottom = '10px';

        overlay.appendChild(loadingText);
        overlay.appendChild(loadingBar);
        overlay.appendChild(timeCounter);

        setTimeout(() => {
            overlay.style.visibility = 'visible';
            overlay.style.opacity = '1';
            oscillateLoadingBar(loadingBar);
        }, 100);

        let secondsElapsed = 0;
        const timeInterval = setInterval(() => {
            secondsElapsed += 1;
            timeCounter.textContent = `(${secondsElapsed} secs)`;
        }, 1000);

        setTimeout(() => {
            hideOverlay();
            clearInterval(timeInterval);
        }, 600000); 

    } else if (type === 'custom') {
        const customMessageDiv = document.createElement('div');
        customMessageDiv.textContent = customMessage;
        customMessageDiv.style.fontSize = '24px';
        customMessageDiv.style.fontWeight = 'bold';
        customMessageDiv.style.color = '#34495e';
        overlay.appendChild(customMessageDiv);
    }

    outputWindow.appendChild(overlay);
    setTimeout(() => {
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
    }, 500);
}

function hideOverlay(time = 500) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, time);
    }
}

function oscillateLoadingBar(loadingBar) {
    let grow = true;
    setInterval(() => {
        loadingBar.style.width = grow ? '100%' : '0%';
        grow = !grow;
    }, 2000);
}
