import atari from '$lib/assets/sounds/atari.mp3';
import placeStone from '$lib/assets/sounds/place-stone.mp3';
import killUnit from '$lib/assets/sounds/kill-unit.wav';

export enum Sound {
    Atari, // https://freesound.org/people/CamoMano/sounds/431019/
    PlaceStone, // https://freesound.org/people/el_boss/sounds/546119/
    KillUnit // https://freesound.org/people/NistuGgner/sounds/700535/
}

export function playSound(sound: Sound | undefined, volume = 0.3) {
    let soundPath = undefined;
    switch (sound) {
    case Sound.Atari:
        soundPath = atari;
        break;
    case Sound.PlaceStone:
        soundPath = placeStone;
        break;
    case Sound.KillUnit:
        soundPath = killUnit;
        break;
    }
    if (!soundPath) {
        return;
    }

    const audio = new Audio(soundPath);
    audio.volume = volume;
    audio.play();
}