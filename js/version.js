// Auto-generated version file
// This file is updated automatically by GitHub Actions on each deployment

export const VERSION = {
    number: '1.0.1',
    commit: 'b7a517d82a3c2e4f1b6d9a8c5e7f3a1b2c4d6e8f',
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
