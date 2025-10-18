// Auto-generated version file
// This file is updated automatically by GitHub Actions on each deployment

export const VERSION = {
    number: '1.0.4',
    commit: '9e4e3c2a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e',
    date: '2025-10-18'
};

// Update version display on page load
function updateVersion() {
    const versionElements = document.querySelectorAll('#app-version');
    const versionString = `${VERSION.number}-${VERSION.commit.substring(0, 7)}`;

    versionElements.forEach(el => {
        if (el) {
            el.textContent = versionString;
            el.title = `Built on ${VERSION.date} | Commit: ${VERSION.commit}`;
        }
    });
}

// Try to update immediately if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateVersion);
} else {
    // DOM already loaded
    updateVersion();
}
