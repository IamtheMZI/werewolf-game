// Auto-generated version file
// This file is updated automatically by GitHub Actions on each deployment

export const VERSION = {
    number: '1.0.5',
    commit: 'c035d4b8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4',
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
