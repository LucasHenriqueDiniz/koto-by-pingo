export function speakJapanese(
  text: string,
  rate: number,
  onStart: () => void,
  onEnd: () => void,
): void {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  const jaVoice = voices.find(v => v.lang.startsWith('ja'));

  if (window.speechSynthesis && jaVoice) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ja-JP';
    utter.rate = rate;
    utter.voice = jaVoice;
    onStart();
    utter.onend = onEnd;
    utter.onerror = onEnd;
    window.speechSynthesis.speak(utter);
  } else {
    // Fallback: Google Translate TTS (no API key required, audio element bypasses CORS)
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ja&client=tw-ob`;
    const audio = new Audio(url);
    onStart();
    audio.onended = onEnd;
    audio.onerror = onEnd;
    audio.play().catch(onEnd);
  }
}
