(function () {
  'use strict';

  const ALPHABET_SIZE = 26;
  const A_CODE = 65;
  const Z_CODE = 90;
  const a_CODE = 97;
  const z_CODE = 122;

  const ALGORITHMS = {
    vigenere: {
      title: '5. Vigenere Cipher',
      keyLabel: 'Keyword',
      keyPlaceholder: 'Keyword',
      defaultMessage: 'Attack at dawn',
      defaultKey: 'LEMON',
      description: 'Encrypt or decrypt letters with a repeating keyword while preserving spaces and punctuation.',
      transform(message, key, direction) {
        return transformVigenere(message, key, direction);
      },
    },
    railFence: {
      title: '6. Rail Fence Cipher',
      keyLabel: 'Rails',
      keyPlaceholder: 'Number of rails',
      defaultMessage: 'WEAREDISCOVEREDFLEEATONCE',
      defaultKey: '3',
      description: 'New cryptography algorithm: zig-zag text across multiple rails, then read row by row for a classic transposition cipher.',
      transform(message, key, direction) {
        return direction === 1 ? encryptRailFence(message, key) : decryptRailFence(message, key);
      },
    },
  };

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

  function parseRails(key, messageLength) {
    const rails = Number.parseInt(key, 10);

    if (!Number.isInteger(rails) || rails < 2) {
      return { error: 'Please enter a rail count of 2 or more.' };
    }

    if (messageLength <= 1 || rails >= messageLength) {
      return { rails: Math.max(2, Math.min(rails, Math.max(messageLength, 2))), unchanged: true };
    }

    return { rails };
  }

  function createRailPattern(length, rails) {
    const pattern = [];
    let rail = 0;
    let direction = 1;

    for (let index = 0; index < length; index += 1) {
      pattern.push(rail);

      if (rail === 0) {
        direction = 1;
      } else if (rail === rails - 1) {
        direction = -1;
      }

      rail += direction;
    }

    return pattern;
  }

  function encryptRailFence(message, key) {
    const parsed = parseRails(key, message.length);

    if (parsed.error) {
      return parsed.error;
    }

    if (parsed.unchanged) {
      return message;
    }

    const rows = Array.from({ length: parsed.rails }, () => []);
    const pattern = createRailPattern(message.length, parsed.rails);

    message.split('').forEach((character, index) => {
      rows[pattern[index]].push(character);
    });

    return rows.map((row) => row.join('')).join('');
  }

  function decryptRailFence(message, key) {
    const parsed = parseRails(key, message.length);

    if (parsed.error) {
      return parsed.error;
    }

    if (parsed.unchanged) {
      return message;
    }

    const pattern = createRailPattern(message.length, parsed.rails);
    const railLengths = Array.from({ length: parsed.rails }, () => 0);

    pattern.forEach((rail) => {
      railLengths[rail] += 1;
    });

    const rails = [];
    let cursor = 0;

    railLengths.forEach((length) => {
      rails.push(message.slice(cursor, cursor + length).split(''));
      cursor += length;
    });

    const railPositions = Array.from({ length: parsed.rails }, () => 0);

    return pattern
      .map((rail) => {
        const position = railPositions[rail];
        railPositions[rail] += 1;
        return rails[rail][position];
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
      .extra-crypto select,
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

      .extra-crypto select option {
        color: #09111f;
      }

      .extra-crypto textarea {
        min-height: 72px;
        resize: vertical;
      }

      .extra-crypto input:focus,
      .extra-crypto select:focus,
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
    panel.setAttribute('aria-label', 'Additional cryptography algorithm tool');

    const title = document.createElement('h2');

    const description = document.createElement('p');

    const algorithm = document.createElement('select');
    Object.entries(ALGORITHMS).forEach(([value, config]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = config.title;
      algorithm.append(option);
    });
    algorithm.value = 'railFence';

    const message = document.createElement('textarea');
    message.placeholder = 'Enter message';

    const keyLabel = document.createElement('span');
    const key = document.createElement('input');
    key.type = 'text';

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

    const keyField = document.createElement('label');
    keyField.className = 'extra-crypto__field';
    keyField.append(keyLabel, key);

    function selectedAlgorithm() {
      return ALGORITHMS[algorithm.value];
    }

    function transform(direction) {
      const config = selectedAlgorithm();
      result.textContent = config.transform(message.value, key.value, direction);
    }

    function updateAlgorithmDefaults() {
      const config = selectedAlgorithm();
      title.textContent = config.title;
      description.textContent = config.description;
      message.value = config.defaultMessage;
      keyLabel.textContent = config.keyLabel;
      key.placeholder = config.keyPlaceholder;
      key.value = config.defaultKey;
      transform(1);
    }

    algorithm.addEventListener('change', updateAlgorithmDefaults);

    encrypt.addEventListener('click', () => {
      transform(1);
    });

    decrypt.addEventListener('click', () => {
      transform(-1);
    });

    panel.append(
      title,
      description,
      createField('Algorithm', algorithm),
      createField('Message', message),
      keyField,
      actions,
      result
    );

    document.head.append(style);
    document.body.append(panel);
    updateAlgorithmDefaults();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildPanel);
  } else {
    buildPanel();
  }
})();
