// src/dialogue.js - Interactive Dialogue System with Hindi-English Authenticity

export class DialogueSystem {
  constructor(ui) {
    this.ui = ui;
    this.currentDialogue = null;
    this.currentLineIndex = 0;
    this.onCompleteCallback = null;
  }

  start(dialogueData, onComplete = null) {
    this.currentDialogue = dialogueData;
    this.currentLineIndex = 0;
    this.onCompleteCallback = onComplete;
    this.showCurrentLine();
  }

  showCurrentLine() {
    if (!this.currentDialogue || this.currentLineIndex >= this.currentDialogue.lines.length) {
      this.close();
      return;
    }

    const line = this.currentDialogue.lines[this.currentLineIndex];
    this.ui.showDialogue({
      speaker: line.speaker,
      role: line.role || '',
      text: line.text,
      avatarColor: line.avatarColor || '#ffd600',
      isLast: this.currentLineIndex === this.currentDialogue.lines.length - 1
    });
  }

  next() {
    if (!this.currentDialogue) return;
    this.currentLineIndex++;
    if (this.currentLineIndex < this.currentDialogue.lines.length) {
      this.showCurrentLine();
    } else {
      this.close();
    }
  }

  close() {
    this.ui.hideDialogue();
    const cb = this.onCompleteCallback;
    this.currentDialogue = null;
    this.currentLineIndex = 0;
    this.onCompleteCallback = null;
    if (cb) cb();
  }

  isActive() {
    return this.currentDialogue !== null;
  }
}
