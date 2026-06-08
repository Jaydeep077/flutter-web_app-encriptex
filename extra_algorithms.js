(function () {
  'use strict';

  const ALPHABET_SIZE = 26;
  const A_CODE = 65;
  const Z_CODE = 90;
  const a_CODE = 97;
  const z_CODE = 122;

  function keyShifts(key) {
    return key
      .split('')
      .map((character) => character.toUpperCase().charCodeAt(0) - A_CODE)
      .filter((shift) => shift >= 0 && shift < ALPHABET_SIZE);
  }

  function transformVigenere(message, key, direction) {
    const shifts = keyShifts(key);

    if (shifts.length === 0) {
      return 'Please enter a key that contains at least one letter.';
    }

    let keyIndex = 0;

    return message
      .split('')
      .map((character) => {
        const code = character.charCodeAt(0);
        const isUppercase = code >= A_CODE && code <= Z_CODE;
        const isLowercase = code >= a_CODE && code <= z_CODE;

        if (!isUppercase && !isLowercase) {
          return character;
        }

        const base = isUppercase ? A_CODE : a_CODE;
        const normalized = code - base;
        const shift = shifts[keyIndex % shifts.length] * direction;
        keyIndex += 1;

        return String.fromCharCode(base + ((normalized + shift + ALPHABET_SIZE) % ALPHABET_SIZE));
      })
      .join('');
  }

  function createField(labelText, element) {
    const label = document.createElement('label');
    label.className = 'extra-crypto__field';

    const span = document.createElement('span');
    span.textContent = labelText;

    label.append(span, element);
    return label;
  }

  function buildPanel() {
    if (document.getElementById('extra-crypto-panel')) {
      return;
    }

    const style = document.createElement('style');
    style.textContent = `
      .extra-crypto {
        position: fixed;
        right: 18px;
        bottom: 18px;
        width: min(360px, calc(100vw - 36px));
        z-index: 2147483647;
        padding: 16px;
        border-radius: 18px;
        border: 1px solid rgba(255, 255, 255, 0.28);
        background: linear-gradient(145deg, rgba(20, 24, 42, 0.96), rgba(31, 46, 83, 0.94));
        color: #f8fbff;
        box-shadow: 0 16px 45px rgba(0, 0, 0, 0.32);
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        backdrop-filter: blur(14px);
      }

      .extra-crypto h2 {
        margin: 0 0 6px;
        font-size: 18px;
      }

      .extra-crypto p {
        margin: 0 0 12px;
        color: #d5def5;
        font-size: 13px;
        line-height: 1.35;
      }

      .extra-crypto__field {
        display: grid;
        gap: 5px;
        margin-bottom: 10px;
        font-size: 12px;
        color: #e8edff;
      }

      .extra-crypto input,
      .extra-crypto textarea {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid rgba(255, 255, 255, 0.22);
        border-radius: 10px;
        padding: 9px 10px;
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
        font: inherit;
        outline: none;
      }

      .extra-crypto textarea {
        min-height: 72px;
        resize: vertical;
      }

      .extra-crypto input:focus,
      .extra-crypto textarea:focus {
        border-color: #79b8ff;
        box-shadow: 0 0 0 3px rgba(121, 184, 255, 0.2);
      }

      .extra-crypto__actions {
        display: flex;
        gap: 8px;
        margin-bottom: 10px;
      }

      .extra-crypto button {
        flex: 1;
        border: 0;
        border-radius: 10px;
        padding: 9px 10px;
        color: #09111f;
        background: #8fd3ff;
        font-weight: 700;
        cursor: pointer;
      }

      .extra-crypto button:last-child {
        background: #c5f6a4;
      }

      .extra-crypto__result {
        min-height: 38px;
        padding: 10px;
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.22);
        color: #ffffff;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        font-size: 13px;
      }
    `;

    const panel = document.createElement('section');
    panel.id = 'extra-crypto-panel';
    panel.className = 'extra-crypto';
    panel.setAttribute('aria-label', 'Vigenere cipher tool');

    const title = document.createElement('h2');
    title.textContent = '5. Vigenere Cipher';

    const description = document.createElement('p');
    description.textContent = 'New cryptography algorithm: encrypt or decrypt letters with a repeating keyword while preserving spaces and punctuation.';

    const message = document.createElement('textarea');
    message.placeholder = 'Enter message';
    message.value = 'Attack at dawn';

    const key = document.createElement('input');
    key.type = 'text';
    key.placeholder = 'Keyword';
    key.value = 'LEMON';

    const encrypt = document.createElement('button');
    encrypt.type = 'button';
    encrypt.textContent = 'Encrypt';

    const decrypt = document.createElement('button');
    decrypt.type = 'button';
    decrypt.textContent = 'Decrypt';

    const actions = document.createElement('div');
    actions.className = 'extra-crypto__actions';
    actions.append(encrypt, decrypt);

    const result = document.createElement('output');
    result.className = 'extra-crypto__result';
    result.textContent = transformVigenere(message.value, key.value, 1);

    encrypt.addEventListener('click', () => {
      result.textContent = transformVigenere(message.value, key.value, 1);
    });

    decrypt.addEventListener('click', () => {
      result.textContent = transformVigenere(message.value, key.value, -1);
    });

    panel.append(
      title,
      description,
      createField('Message', message),
      createField('Key', key),
      actions,
      result
    );

    document.head.append(style);
    document.body.append(panel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildPanel);
  } else {
    buildPanel();
  }
})();
