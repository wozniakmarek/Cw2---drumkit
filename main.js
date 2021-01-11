window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

let sciezka = [[]], record = [], time = [], sound= [];

let soundList = {
    a: "boom",
    b: "clap",
    c: "hihat",
    d: "kick",
    e: "openhat",
    f: "ride",
    g: "snare",
    h: "tink",
    i: "tom"
}

function loadAudio() { //wczytanie d�wi�k�w
    Object.values(soundList).forEach((e) => sound[e] = new Audio('./sounds/' + e + '.wav'));
}

function keyDown(ev) { // nacisniecie klawisza
    if (document.getElementById(ev.key)) {
        document.getElementById(ev.key).classList.add('key-pressed') //jesli element istnieje, to dodaje do niego klase
        playKey(ev);
    }
}

function keyUp(ev) { // puszczenie klawisza
    if (document.getElementById(ev.key)) {
        document.getElementById(ev.key).classList.remove('key-pressed')
    }
}





function startRecord(numer_sciezki) { // nagrywanie sciezki
    if (!record[numer_sciezki]) { // jesli nie ma sciezki o danym numerze, tworzy j� z aktualnym czasem, zaczyna nagrywa� i zmienia napis na przycisku
        record[numer_sciezki] = true;
        time[numer_sciezki] = Date.now();
        sciezka[numer_sciezki] = [];
        document.getElementById("rButton" + numer_sciezki).innerText = "Stop recording";

    }
    else { // jesli istnieje sciezka, to przestaje j� nagrywa� i wyswietla informacje o sciezce.
        record[numer_sciezki] = false;
        document.getElementById("rButton" + numer_sciezki).innerText = "Record track " + numer_sciezki;
        document.getElementById("status" + numer_sciezki).innerText = sciezka[numer_sciezki].length + " Sounds recorded in " + Math.round(sciezka[numer_sciezki][sciezka[numer_sciezki].length-1].delay/100)/10+"sec";
    }
}
function playKey(ev) { // funkcja grania muzyki
    sound[soundList[ev.key]].currentTime = 0; // zeruje czas dzwieku
    sound[soundList[ev.key]].play();
    console.log(soundList[ev.key]);

    for (i = 1; i <= sciezka.length; i++){ // sprawdza, czy w��czone jest nagrywanie dla ka�dej �cie�ki
        if (record[i]) {
            if (Object.keys(soundList).indexOf(ev.key) > -1) { //je�li naciskany jest poprawny klawisz, dodaje go do sciezki z czasem nagrania
                sciezka[i].push(
                    {
                        delay: Date.now() - time[i],
                        key: ev.key
                    })
            }
        }
    }
}
let timeout = [], koniec = [];

function playRecord(numer_sciezki) { //odtwarzanie sciezki
    if (!timeout[numer_sciezki] && sciezka[numer_sciezki][0]) { // je�li nie ma timeout dla sciezki, tworzy go dla ka�dego elementu sciezki z odpowiadaj�cym mu op�nieniem.
        sciezka[numer_sciezki].forEach((ev) => {
            timeout[numer_sciezki] = setTimeout(() => { playKey(ev) }, ev.delay);
        })
        document.getElementById("playButton" + numer_sciezki).innerText = "Stop playing";
        koniec[numer_sciezki] = setTimeout(() => playRecord(numer_sciezki), sciezka[numer_sciezki][sciezka[numer_sciezki].length - 1].delay + 10) // gdy sko�czy si� sciezka, przycisk automatycznie zmienia si� ponownie na "play"
    }
    else { // je�li naci�ni�ty b�dzie przycisk podczas grania sciezki, usuwa si� wszystkie timeouty i przywraca przycisk do "Play"
        clearTimeout(koniec[numer_sciezki]);
        do {
            clearTimeout(timeout[numer_sciezki]);
        }
        while (timeout[numer_sciezki]--)
        timeout[numer_sciezki] = false;
        document.getElementById("playButton" + numer_sciezki).innerText = "Play track " + numer_sciezki;
    }
}


/*const channel = [];
const recordStart = Date.now();
function onKeyPress(ev) {
    let sound;
    let soundName;
    switch (ev.code) {
        case 'KeyA':
            soundName = 'boom';
            sound = document.querySelector('#boom');
            break;
        case 'KeyS':
            soundName = 'clap';
            sound = document.querySelector('#clap');
            break;
        case 'KeyD':
            soundName = 'hihat';
            sound = document.querySelector('#hihat');
            break;
        case 'KeyF':
            soundName = 'kick';
            sound = document.querySelector('#kick');
            break;
    }
    if (sound) {
        const keyPressTime = Date.now() - recordStart;
        const recordedSound = {
            sound: soundName,
            time: keyPressTime
        };
        channel.push(recordedSound);
        sound.play();
    }
}
function playChannel() {
    for (let index = 0; index < channel.length; index++) {
        const soundObject = channel[index];
        setTimeout(
            () => {
                playSound(soundObject.sound);
            },
            soundObject.time
        );
    }

}
function playSound(soundName) {
    const sound = document.querySelector('#' + soundName);
    sound.play();
}
*/

