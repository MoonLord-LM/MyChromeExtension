console.log('DevTools begin to create');

document.addEventListener('DOMContentLoaded', () => {
    chrome.devtools.panels.create(
        'MyChromeExtension',
        chrome.runtime.getURL('img/icon.png'),
        chrome.runtime.getURL('page/options.html'),
        function(panel) {
            console.log('DevTools created successfully', panel);
        }
    );
});
