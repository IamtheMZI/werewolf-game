// Version configuration
export const VERSION = {
    number: '1.0.11',
    date: '2024-12-27'
};

// Update version display on all pages
// Modules are deferred, so DOM is ready when this runs
const versionElements = document.querySelectorAll('#app-version');
versionElements.forEach(el => {
    if (el) {
        el.textContent = VERSION.number;
    }
});
