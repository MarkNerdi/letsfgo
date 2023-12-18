import atari from '$lib/assets/sounds/atari.mp3';
import placeStone from '$lib/assets/sounds/place-stone.mp3';
import killUnit from '$lib/assets/sounds/kill-unit.wav';
import { Sound } from '$lib/game/enums';

export function playSound(sound: Sound, volume = 0.3) {
    const soundMap: Record<Sound, string> = {
        [Sound.Atari]: atari,
        [Sound.PlaceStone]: placeStone,
        [Sound.KillUnit]: killUnit,
    };

    const audio = new Audio(soundMap[sound]);
    audio.volume = volume;
    audio.play();
}
