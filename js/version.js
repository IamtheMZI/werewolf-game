// Auto-generated version file
// This file is updated automatically by GitHub Actions on each deployment

export const VERSION = {
    number: '1.0.1',
    commit: 'initial',
    date: new Date().toISOString().split('T')[0]
};

// Update version display on page load
document.addEventListener('DOMContentLoaded', () => {
    const versionElements = document.querySelectorAll('#app-version');
    const versionString = `${VERSION.number}-${VERSION.commit.substring(0, 7)}`;

    versionElements.forEach(el => {
        el.textContent = versionString;
        el.title = `Built on ${VERSION.date} | Commit: ${VERSION.commit}`;
    });
});
