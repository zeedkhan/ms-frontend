"use client";

declare class Highlight {
  constructor(...range: Range[]);
}

declare namespace CSS {
  var highlights: Map<string, Highlight>;
}

function getWordRange(element: Element, charIndex: number, charLength: number) {
  const range = document.createRange();
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
  let currentLength = 0;
  let foundStart = false;
  let foundEnd = false;

  while (walker.nextNode()) {
    const textNode = walker.currentNode;
    const textLength = (textNode.textContent || "").length;

    if (!foundStart && currentLength + textLength >= charIndex) {
      range.setStart(textNode, charIndex - currentLength);
      foundStart = true;
    }

    if (foundStart && currentLength + textLength >= charIndex + charLength) {
      range.setEnd(textNode, charIndex + charLength - currentLength);
      foundEnd = true;
      break;
    }

    currentLength += textLength;
  }

  return range;
}

function wrapWordInSpan(element: Element, charIndex: number, charLength: number) {
  const range = getWordRange(element, charIndex, charLength);
  const highlight = new Highlight(range);
  CSS.highlights.set("speech-word-highlight", highlight);
}

export function killSpeech() {
  window.speechSynthesis.cancel();
  CSS.highlights.clear();
}

export function speech(element: HTMLElement): SpeechSynthesis {
  const speechSynthesis = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(element.textContent || "");

  console.log("element.textContent", element.innerText.replace(/\s+/g, ' '));
  console.log("element.textContent", element.textContent);
  speechSynthesis.cancel();
  CSS.highlights.clear();

  utterance.onboundary = (event) => {
    const startIndex = event.charIndex;
    const endIndex = event.charIndex + event.charLength;
    wrapWordInSpan(element, startIndex, endIndex - startIndex);
    // const wordRange = getWordRange(element, startIndex, endIndex - startIndex);
    // const highlight = new Highlight(wordRange);
    // CSS.highlights.set("speech-word-highlight", highlight);
  };

  utterance.onend = () => {
    CSS.highlights.clear();
  };

  const wholeElementRange = document.createRange();
  wholeElementRange.selectNode(element);
  const highlight = new Highlight(wholeElementRange);
  CSS.highlights.set("speech-paragraph-highlight", highlight);

  speechSynthesis.speak(utterance);

  return speechSynthesis
}
