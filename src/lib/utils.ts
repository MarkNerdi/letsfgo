export async function share(title: string, link: string = window.location.href) {
    if (window.navigator?.share) {
        await window.navigator.share({ title, text: link });
    } else if (window.navigator?.clipboard) {
        navigator.clipboard.writeText(link).then(() => {
            alert('In die Zwischenablage kopiert.');
        });
    }
}

export function goBack() {
    history.back();
}

export function playSound(sound: string, volume = 0.2) {
    const audio = new Audio(sound);
    audio.volume = volume;
    audio.play();
}
