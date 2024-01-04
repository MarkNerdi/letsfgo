export async function share(title: string, link: string = window.location.href) {
    if (window.navigator?.share) {
        await window.navigator.share({ title, text: link });
    } else if (window.navigator?.clipboard) {
        navigator.clipboard.writeText(link).then(() => {
            alert('In die Zwischenablage kopiert.');
        });
    }
}
