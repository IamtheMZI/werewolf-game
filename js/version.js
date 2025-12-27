// Version configuration
export const VERSION = {
    number: '1.0.14',
    date: '2024-12-27'
};

// Update version display on all pages
function updateVersion() {
    const versionElements = document.querySelectorAll('#app-version');
    versionElements.forEach(el => {
        if (el) {
            el.textContent = VERSION.number;
        }
    });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateVersion);
} else {
    updateVersion();
}
