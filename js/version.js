// Auto-generated version file
// This file is updated automatically by GitHub Actions on each deployment

export const VERSION = {
    number: '1.0.11',
    commit: 'fe9652f2df5333e159b4a4251ac143565fb1763e',
    date: '2024-12-27'
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
