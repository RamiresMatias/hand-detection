const { GestureDescription, Finger, FingerCurl } = window.fp;

const ScrollDownGesture = new GestureDescription("scroll-down"); // ✊️
const ScrollUpGesture = new GestureDescription("scroll-up"); // 🖐
const ClickGesture = new GestureDescription("click"); // 🤏

/**
 * O Código abaixo configura os gestos e sua porcentagem de confiança para a lib identificar
 * ao realizar um gesto ela tenta identificar de acordo com o que foi definido nas coordenadas abaixo
 */

// Scroll Down
// -----------------------------------------------------------------------------

// thumb: half curled
// accept no curl with a bit lower confidence
ScrollDownGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
ScrollDownGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);

// all other fingers: curled
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  ScrollDownGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
  ScrollDownGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

// Scroll Up
// -----------------------------------------------------------------------------

// no finger should be curled
for (let finger of Finger.all) {
  ScrollUpGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

// Click
// -----------------------------------------------------------------------------

ClickGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.8)
ClickGesture.addCurl(Finger.Index, FingerCurl.FullCurl, 0.5)

ClickGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0)
ClickGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.4)

ClickGesture.addCurl(Finger.Middle, FingerCurl.HalfCurl, 1.0)
ClickGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 0.9)

ClickGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 1.0)
ClickGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 0.9)

ClickGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 1.0)
ClickGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 0.9)

const knownGestures = [ScrollDownGesture, ScrollUpGesture, ClickGesture]

const gesturesString = {
  'scroll-up': '🖐',
  'scroll-down': '✊️',
  'click': '🤏'
}

export { knownGestures, gesturesString };
