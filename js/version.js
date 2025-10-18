// Auto-generated version file
// This file is updated automatically by GitHub Actions on each deployment

export const VERSION = {
    number: '1.0.2',
    commit: 'de4dc54a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e',
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
