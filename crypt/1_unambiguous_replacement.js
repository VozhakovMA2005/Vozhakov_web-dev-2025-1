//ВебИнтерфейс
document.addEventListener('DOMContentLoaded', () => {
    const executeBtn = document.getElementById('executeBtn');
    const algoSelect = document.getElementById('algorithmSelect');
    const keyContainer = document.getElementById('keyContainer');

    const matrixOptions = document.getElementById('matrixOptions');
    const matrixSizeSelect = document.getElementById('matrixSizeSelect');
    const matrixGridContainer = document.getElementById('matrixGridContainer');

    const cardanoOptions = document.getElementById('cardanoOptions');
    const cardanoGridContainer = document.getElementById('cardanoGridContainer');
    const cardanoCountDisplay = document.getElementById('cardanoCount');

    function renderCardanoGrid() {
        cardanoGridContainer.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'cardano-grid';

        let selectedCount = 0;

        for (let i = 0; i < 6; i++) { // 6 строк
            for (let j = 0; j < 10; j++) { // 10 столбцов
                const cell = document.createElement('div');
                cell.className = 'cardano-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;

                // Обработка клика по клетке
                cell.addEventListener('click', function () {
                    if (this.classList.contains('selected')) {
                        // Если клетка уже выбрана - отменяем выбор
                        this.classList.remove('selected');
                        selectedCount--;
                    } else {
                        // Если не выбрана и выбрано меньше 15 - закрашиваем
                        if (selectedCount < 15) {
                            this.classList.add('selected');
                            selectedCount++;
                        } else {
                            alert('Вы уже выбрали 15 клеток! Чтобы выбрать другую, сначала отмените одну из выбранных.');
                        }
                    }
                    cardanoCountDisplay.textContent = selectedCount;
                });

                grid.appendChild(cell);
            }
        }
        cardanoGridContainer.appendChild(grid);
    }

    renderCardanoGrid();

    function renderMatrixGrid(size) {
        matrixGridContainer.innerHTML = ''; // Очищаем контейнер
        const grid = document.createElement('div');
        grid.className = 'matrix-grid';
        grid.style.gridTemplateColumns = `repeat(${size}, 50px)`; // Задаем колонки

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.className = 'matrix-input';
                input.dataset.row = i; // Сохраняем строку в data-атрибут
                input.dataset.col = j; // Сохраняем столбец в data-атрибут
                input.value = '';
                grid.appendChild(input);
            }
        }
        matrixGridContainer.appendChild(grid);
    }

    renderMatrixGrid(3);

    matrixSizeSelect.addEventListener('change', (e) => {
        renderMatrixGrid(Number(e.target.value));
    });

    // Работа с полем ключ
    algoSelect.addEventListener('change', () => {
        const algo = algoSelect.value;
        const keyContainer = document.getElementById('keyContainer');
        const vizhOptions = document.getElementById('vizhenerOptions');
        const matrixOptions = document.getElementById('matrixOptions');
        const cardanoOptions = document.getElementById('cardanoOptions');
        const shenonOptions = document.getElementById('shenonOptions');
        const magmaOptions = document.getElementById('magmaOptions');
        const a51Options = document.getElementById('a51Options');
        const a52Options = document.getElementById('a52Options');

        // Логика блокировки ключа
        if (algo === 'atbash' || algo === 'polybius' || algo === 'a52' || algo === 'tritemiy' || algo === 'magmat' || algo === 'cardano' || algo === 'a51') {
            keyContainer.style.opacity = '0.5';
            document.getElementById('keyInput').disabled = true;
        } else {
            keyContainer.style.opacity = '1';
            document.getElementById('keyInput').disabled = false;
        }
        // Логика для гаммирование магмы
        if (algo === 'magmaGamma') {
            magmaOptions.style.display = 'block';
        } else {
            magmaOptions.style.display = 'none';
        }

        // Показ специфичных полей для A5/1
        if (algo === 'a51') {
            a51Options.style.display = 'block';
        } else {
            a51Options.style.display = 'none';
        }

        if (algo === 'a52') {
            a52Options.style.display = 'block';
        } else {
            a52Options.style.display = 'none';
        }

        // Показ опций Вижинера
        if (algo === 'vizhener') {
            vizhOptions.style.display = 'block';
        } else {
            vizhOptions.style.display = 'none';
        }

        // Показ опций Матрицы
        if (algo === 'matrix') {
            matrixOptions.style.display = 'block';
        } else {
            matrixOptions.style.display = 'none';
        }

        if (algo === 'cardano') {
            cardanoOptions.style.display = 'block';
        } else {
            cardanoOptions.style.display = 'none';
        }
        // Показ опций Шеннона
        if (algo === 'shenonGamma') {
            shenonOptions.style.display = 'block';
        } else {
            shenonOptions.style.display = 'none';
        }
    });

    executeBtn.addEventListener('click', () => {
        // Получение данных из интерфейса
        const text = document.getElementById('inputText').value;
        const rawValue = document.getElementById('keyInput').value;

        const shift = (!isNaN(rawValue) && rawValue.trim() !== '')
            ? Number(rawValue)
            : rawValue;


        // значение выбранной радио-кнопки "Режим работы"
        const isTextMode = document.querySelector('input[name="workMode"]:checked').value === 'text';

        // значение выбранной радио-кнопки "Операция"
        const isEncrypt = document.querySelector('input[name="operation"]:checked').value === 'encrypt';

        const algorithm = algoSelect.value;
        const errorMsg = document.getElementById('a51ErrorMsg');
        if (errorMsg) errorMsg.textContent = '';
        let result = "";
        const vizhType = document.querySelector('input[name="vizhType"]:checked').value;

        // выбор алгоритма
        if (algorithm === 'atbash') {
            result = atbash(text, isTextMode, isEncrypt);
        } else if (algorithm === 'caesar') {
            result = caesar(text, isTextMode, isEncrypt, shift);
        } else if (algorithm === 'polybius') {
            result = polybius(text, isTextMode, isEncrypt);
        } else if (algorithm === 'tritemiy') {
            result = tritemiy(text, isTextMode, isEncrypt);
        }
        else if (algorithm === 'belazo') {
            result = belazo(text, isTextMode, isEncrypt, rawValue);
        }
        else if (algorithm === 'vizhener') {
            result = vizhener(text, isTextMode, isEncrypt, rawValue, vizhType);
        }
        else if (algorithm === 'magmat') {
            result = magmat(text, isTextMode, isEncrypt);
        }
        else if (algorithm === 'matrix') {
            const matrixSize = Number(document.getElementById('matrixSizeSelect').value);
            const matrixParam = Array.from(Array(matrixSize), () => new Array(matrixSize).fill(0));
            const inputs = document.querySelectorAll('.matrix-input');
            inputs.forEach(input => {
                const r = Number(input.dataset.row);
                const c = Number(input.dataset.col);
                matrixParam[r][c] = input.value === '' ? 0 : Number(input.value);
            });
            result = matrix(text, isTextMode, isEncrypt, shift, matrixSize, matrixParam);
        }
        else if (algorithm === 'playfer') {
            result = playfer(text, isTextMode, isEncrypt, rawValue);
        }
        else if (algorithm === 'vertical') {
            result = vertical(text, isTextMode, isEncrypt, rawValue);
        }
        else if (algorithm === 'cardano') {

            function isValidCardanoGrille(selectedCells) {
                // Решетка обязана содержать ровно 15 прорезей
                if (selectedCells.length !== 15) return false;

                // Множество для хранения уникальных идентификаторов групп
                const seenGroups = new Set();

                for (let i = 0; i < selectedCells.length; i++) {
                    const r = selectedCells[i][0];
                    const c = selectedCells[i][1];

                    // "Сворачиваем" любые координаты в левую верхнюю четверть (размером 3x5)
                    const minR = Math.min(r, 5 - r);
                    const minC = Math.min(c, 9 - c);

                    // Создаем уникальный ключ для этой группы из 4 клеток
                    const groupId = `${minR}-${minC}`;

                    // Если клетка из этой группы уже была вырезана — это ошибка (будет наложение)
                    if (seenGroups.has(groupId)) {
                        return false;
                    }

                    // Запоминаем, что в этой группе уже есть вырез
                    seenGroups.add(groupId);
                }

                // Если цикл прошел без совпадений — решетка идеальна!
                return true;
            }

            const selectedCells = document.querySelectorAll('.cardano-cell.selected');

            if (selectedCells.length !== 15) {
                alert('Для работы алгоритма Кардано необходимо закрасить ровно 15 клеток!');
                return;
            }

            const cardanoArray = [];
            selectedCells.forEach(cell => {
                cardanoArray.push([Number(cell.dataset.row), Number(cell.dataset.col)]);
            });

            if (isValidCardanoGrille(cardanoArray)) {
                result = cardano(text, isTextMode, isEncrypt, cardanoArray);
            } else {
                alert('Неправильная решетка!');
                return;
            }
        }
        else if (algorithm === 'phestel') {
            result = phestel(text, isEncrypt, rawValue);
            console.log(rawValue);
        }
        else if (algorithm === 'shenonGamma') {
            const constA = document.getElementById('shenonConstA').value;
            const constC = document.getElementById('shenonConstC').value;
            const shenonMode = document.querySelector('input[name="shenonMode"]:checked').value;

            // Валидация
            const validationErrors = validateShenonConstants(constA, constC, shenonMode);
            const validationMsg = document.getElementById('shenonValidationMsg');

            if (validationErrors.length > 0) {
                validationMsg.textContent = validationErrors.join('; ');
                result = "Ошибка валидации: " + validationErrors.join('; ');
            } else {
                validationMsg.textContent = '';

                result = shenonGamma(text, isTextMode, isEncrypt, shift, constA, constC, shenonMode);
            }
        }
        else if (algorithm === 'magmaGamma') {
            const syncValue = document.getElementById('magmaSyncInput').value;

            // Простейшая валидация
            if (syncValue.length !== 8) {
                alert("Синхропосылка для Магмы должна содержать ровно 8 HEX-символов.");
                return;
            }

            result = magmaGamma(text, rawValue, syncValue);
        }
        else if (algorithm === 'a51') {
            const rawKey = document.getElementById('a51KeyInput').value.trim();
            const rawCadr = document.getElementById('a51CadrInput').value.trim();
            const errorMsg = document.getElementById('a51ErrorMsg');

            let finalKey, finalCadr;

            try {
                if (!rawKey || !rawCadr) {
                    throw new Error("Оба поля (ключ и кадр) должны быть заполнены.");
                }

                try {

                    const cleanKey = rawKey.toLowerCase().endsWith('n') ? rawKey.slice(0, -1) : rawKey;

                    if (!/^\d+$/.test(cleanKey)) {
                        throw new Error();
                    }

                    finalKey = BigInt(cleanKey);
                } catch (e) {
                    throw new Error("Ключ должен быть целым числом (формат BigInt).");
                }

                if (finalKey < 0n || finalKey > 18446744073709551615n) {
                    throw new Error("Ключ выходит за пределы 64 бит (0 - 18446744073709551615).");
                }

                if (!/^\d+$/.test(rawCadr)) {
                    throw new Error("Номер кадра должен содержать только цифры.");
                }

                finalCadr = Number(rawCadr);

                if (finalCadr < 0 || finalCadr > 4194303) {
                    throw new Error("Номер кадра выходит за пределы 22 бит (0 - 4194303).");
                }

                result = a51(text, isTextMode, isEncrypt, finalKey, finalCadr);

                errorMsg.textContent = "";

            } catch (e) {
                errorMsg.textContent = e.message;
                errorMsg.style.display = "block";
                return;
            }
        }
        else if (algorithm === 'a52') {
            const rawKey = document.getElementById('a52KeyInput').value.trim();
            const rawCadr = document.getElementById('a52CadrInput').value.trim();
            const errorMsg = document.getElementById('a52ErrorMsg');

            if (errorMsg) errorMsg.textContent = '';

            try {
                if (!rawKey || !rawCadr) throw new Error("Заполните ключ и кадр.");

                const cleanKey = rawKey.toLowerCase().endsWith('n') ? rawKey.slice(0, -1) : rawKey;
                const finalKey = BigInt(cleanKey);
                const finalCadr = Number(rawCadr);

                // Валидация границ
                if (finalKey < 0n || finalKey > 18446744073709551615n) throw new Error("Ключ > 64 бит.");
                if (finalCadr < 0 || finalCadr > 4194303) throw new Error("Кадр > 22 бит.");

                const isTextMode = document.querySelector('input[name="workMode"]:checked').value === 'text';
                const isEncrypt = document.querySelector('input[name="operation"]:checked').value === 'encrypt';

                result = a52(text, isTextMode, isEncrypt, finalKey, finalCadr);

            } catch (e) {
                errorMsg.textContent = e.message;
                return;
            }
        }
        else if (algorithm === 'magma') {
            result = magma(text, isTextMode, isEncrypt);
        }
        else if (algorithm === 'gost2814789') {

            function parseHexToUint32(hexStr, expectedLength) {
                // Удаляем всё, кроме символов 0-9, a-f
                const cleanHex = hexStr.replace(/[^0-9a-fA-F]/g, '');
                const result = new Uint32Array(expectedLength);

                for (let i = 0; i < expectedLength; i++) {
                    // Берем по 8 символов (32 бита)
                    const chunk = cleanHex.substring(i * 8, i * 8 + 8);
                    if (chunk) {
                        result[i] = parseInt(chunk, 16) >>> 0;
                    }
                }
                return result;
            }

            /**
             * Преобразует Uint32Array обратно в красивую Hex строку для вывода
             */
            function formatUint32ToHex(uint32Arr) {
                return Array.from(uint32Arr)
                    .map(num => (num >>> 0).toString(16).padStart(8, '0'))
                    .join(' ');
            }

            try {
                // 1. Преобразуем входной блок (64 бита = 2 слова по 32 бита)
                const block = parseHexToUint32(text, 2);

                // 2. Преобразуем ключ (256 бит = 8 слов по 32 бита)
                const key = parseHexToUint32(rawValue, 8);

                // 3. Вызываем вашу функцию
                // Важно: передаем block, key, флаг направления и null для sBox
                const processedBlock = gost2814789(block, key, isEncrypt, null);

                // 4. Форматируем результат обратно в Hex строку
                result = formatUint32ToHex(processedBlock);

            } catch (e) {
                console.error(e);
                result = "Ошибка: Проверьте правильность ввода Hex данных (ключ 64 симв, блок 16 симв)";
            }

        }
        else if (algorithm === 'aes') {
            // Вспомогательная функция для конвертации строки "2b 7e..." в Uint8Array
            const parseHexString = (str) => {
                // Убираем все пробелы и не-hex символы
                const cleanStr = str.replace(/[^0-9a-fA-F]/g, '');
                const bytes = new Uint8Array(cleanStr.length / 2);
                for (let i = 0; i < bytes.length; i++) {
                    bytes[i] = parseInt(cleanStr.substr(i * 2, 2), 16);
                }
                return bytes;
            };

            try {
                // 1. ПОДГОТОВКА ДАННЫХ (Конвертация строк в Uint8Array)
                const inputBytes = parseHexString(text);
                const keyBytes = parseHexString(rawValue);

                // Проверка корректности длин (AES ожидает 16 байт данных)
                if (inputBytes.length !== 16) {
                    throw new Error("Данные должны содержать ровно 16 байт (32 Hex-символа)");
                }

                // Проверка длины ключа (ваша функция поддерживает 16, 24 или 32)
                if (![16, 24, 32].includes(keyBytes.length)) {
                    throw new Error("Ключ должен быть 16, 24 или 32 байта");
                }

                // 2. ВЫЗОВ ФУНКЦИИ
                // Передаем: массив данных, массив ключа, true/false для шифрования, и true для режима текста
                const rawResult = aes(inputBytes, keyBytes, isEncrypt, true);

                // 3. ОБРАБОТКА РЕЗУЛЬТАТА ДЛЯ ВЫВОДА
                // Превращаем Uint8Array обратно в красивую строку Hex для интерфейса
                result = Array.from(rawResult)
                    .map(b => b.toString(16).padStart(2, '0').toUpperCase())
                    .join(' ');

            } catch (e) {
                // Если формат Hex был неверным или длины не совпали
                result = "Ошибка: " + e.message;
            }
        }
        else if (algorithm === 'kuznechick') {
            result = kuznechick(text, rawValue, isEncrypt);
        }
        // Вывод результата
        document.getElementById('outputText').value = result;
    });
});

//Номенклатура
// text - первоначальный текст
// isTextMode - режим работы (текстовый (true) или тестовый (false))
// isEncrypt - шифрование (true) или расшифрованиеc(false)
// shift - ключ для шифра

//S-блоки ГОСТ «Магма»
// const S = [
//     [12, 4, 6, 2, 10, 5, 11, 9, 14, 8, 13, 7, 0, 3, 15, 1],
//     [6, 8, 2, 3, 9, 10, 5, 12, 1, 14, 4, 7, 11, 13, 0, 15],
//     [11, 3, 5, 8, 2, 15, 10, 13, 14, 1, 7, 4, 12, 9, 6, 0],
//     [12, 8, 2, 1, 13, 4, 10, 7, 3, 15, 5, 6, 0, 9, 14, 11],
//     [7, 15, 5, 10, 8, 1, 6, 13, 0, 9, 3, 14, 11, 4, 2, 12],
//     [5, 13, 15, 6, 9, 2, 12, 10, 11, 7, 8, 1, 4, 3, 14, 0],
//     [8, 14, 2, 5, 6, 9, 1, 12, 15, 4, 11, 0, 13, 10, 3, 7],
//     [1, 7, 14, 13, 0, 5, 8, 3, 4, 15, 10, 6, 9, 12, 11, 2]
// ];

// //Вспомогательные функции
// function hexToUint32(h) {
//   return parseInt(h, 16) >>> 0;
// }

// function uint32ToHex(x) {
//   return (x >>> 0).toString(16).padStart(8, "0");
// }

// function rotl11(x) {
//   return ((x << 11) | (x >>> 21)) >>> 0;
// }

// //Преобразование t
// function t(x) {
//   let y = 0;
//   for (let i = 0; i < 8; i++) {
//     const nibble = (x >>> (4 * i)) & 0xF;
//     y |= S[i][nibble] << (4 * i);
//   }
//   return y >>> 0;
// }

// //Преобразование g
// function g(k, a) {
//   const sum = (a + k) >>> 0;
//   const tRes = t(sum);
//   return rotl11(tRes);
// }

// //Развёртывание ключа (A.2.3)
// function expandKey(masterKeyHex) {
//   const K = [];
//   for (let i = 0; i < 8; i++) {
//     K.push(hexToUint32(masterKeyHex.slice(i * 8, (i + 1) * 8)));
//   }

//   const roundKeys = [];
//   for (let i = 0; i < 24; i++) roundKeys.push(K[i % 8]);
//   for (let i = 7; i >= 0; i--) roundKeys.push(K[i]);

//   console.log("Базовые ключи:");
//   K.forEach((k, i) => console.log(`K${i+1} = ${uint32ToHex(k)}`));

//   console.log("\nИтерационные ключи:");
//   roundKeys.forEach((k, i) =>
//     console.log(`K${i+1} = ${uint32ToHex(k)}`)
//   );

//   return roundKeys;
// }

// //Один раунд Фейстеля G[Ki]
// function G(a1, a0, k, round) {
//   const res = g(k, a0) ^ a1;
//   console.log(
//     `G[K${round}](${uint32ToHex(a1)}, ${uint32ToHex(a0)}) = ` +
//     `(${uint32ToHex(a0)}, ${uint32ToHex(res)})`
//   );
//   return [a0, res >>> 0];
// }

// Основная рекурсивная функция для нахождения определителя



//

function getDeterminant(matrix) {
    const n = matrix.length;

    // Базовый случай для матрицы 1x1
    if (n === 1) {
        return matrix[0][0];
    }

    // Базовый случай для матрицы 2x2
    if (n === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }

    let det = 0;

    // Проходим по элементам первой строки (индекс строки = 0)
    for (let c = 0; c < n; c++) {
        // Получаем подматрицу без 0-й строки и c-го столбца
        const subMatrix = getSubMatrix(matrix, 0, c);

        // Определяем знак: +, -, +, - и т.д.
        const sign = (c % 2 === 0) ? 1 : -1;

        // Рекурсивно прибавляем к общему определителю
        det += sign * matrix[0][c] * getDeterminant(subMatrix);
    }

    return det;
}

// Преобразует Hex-строку (например, "00 11 ff") в Uint8Array
function hexToBytes(hex) {
    hex = hex.replace(/\s+/g, ''); // убираем пробелы
    if (hex.length % 2 !== 0) hex = '0' + hex;
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
}

// Преобразует Uint8Array обратно в Hex-строку для вывода
function bytesToHex(bytes) {
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0').toUpperCase())
        .join(' ');
}

//Валидация консант в Шенноне
function validateShenonConstants(a, c, mode) {
    a = parseInt(a);
    c = parseInt(c);
    const errors = [];

    if (isNaN(a) || a <= 0) errors.push("Константа a должна быть положительным целым числом");
    if (isNaN(c) || c <= 0) errors.push("Константа c должна быть положительным целым числом");
    if (isNaN(a) || a == 1) errors.push("Измените а, иначе будет шифр цезаря");

    if (errors.length > 0) return errors;

    if (mode === 'chars') { // Посимвольный режим (модуль 32)
        // a - нечетное число
        if (a % 2 === 0) errors.push("a должно быть нечетным числом");

        // c - взаимно просто с 32 (т.е. нечетное и не делится на 2)
        if (c % 2 === 0) errors.push("c должно быть взаимно простым с 32 (нечетным)");

        // b = a - 1 кратно p для каждого простого p, делителя m=32 (простые делители: 2)
        // и b кратно 4
        const b = a - 1;
        if (b % 2 !== 0) errors.push("a-1 должно быть кратно 2");
        if (b % 4 !== 0) errors.push("a-1 должно быть кратно 4");

    } else { // Побитовый режим
        // c - нечетное число
        if (c % 2 === 0) errors.push("c должно быть нечетным числом");

        // a (mod 4) = 1
        if (a % 4 !== 1) errors.push("a должно быть сравнимо с 1 по модулю 4");
    }

    return errors;
}

// Вспомогательная функция для получения минора (вычеркивания строки и столбца)
function getSubMatrix(matrix, rowToRemove, colToRemove) {
    return matrix
        .filter((_, r) => r !== rowToRemove) // Убираем нужную строку
        .map(row => row.filter((_, c) => c !== colToRemove)); // Убираем нужный столбец
}

// Обратная матрица
function matrixInvert(matrix) {
    // 1. Проверка размеров
    const rows = matrix.length;
    const cols = matrix[0].length;
    if (rows !== cols) {
        console.error("Матрица должна быть квадратной");
        return null;
    }

    // 2. Создаем расширенную матрицу [A | I], где I - единичная матрица
    // Мы копируем исходную матрицу, чтобы не менять её
    let M = [];
    for (let i = 0; i < rows; i++) {
        M[i] = [];
        for (let j = 0; j < cols; j++) {
            M[i][j] = matrix[i][j];
        }
        // Дописываем единичную матрицу справа
        for (let j = 0; j < rows; j++) {
            M[i][j + cols] = (i === j) ? 1 : 0;
        }
    }

    // 3. Прямой и обратный ход Гаусса-Жордана
    for (let i = 0; i < rows; i++) {
        // --- Поиск главного элемента (Pivot) ---
        let pivotRow = i;
        for (let k = i + 1; k < rows; k++) {
            if (Math.abs(M[k][i]) > Math.abs(M[pivotRow][i])) {
                pivotRow = k;
            }
        }

        // Если главный элемент равен 0 (или очень близок к нему), матрица вырождена
        if (Math.abs(M[pivotRow][i]) < 1e-10) {
            return null; // Обратной матрицы не существует
        }

        // Меняем местами текущую строку и строку с главным элементом
        [M[i], M[pivotRow]] = [M[pivotRow], M[i]];

        // --- Нормализация строки ---
        // Делим всю строку на главный элемент, чтобы получить 1 на диагонали
        let pivot = M[i][i];
        for (let j = 0; j < 2 * cols; j++) {
            M[i][j] /= pivot;
        }

        // --- Зануление остальных элементов в столбце ---
        for (let k = 0; k < rows; k++) {
            if (k !== i) {
                let factor = M[k][i];
                for (let j = 0; j < 2 * cols; j++) {
                    M[k][j] -= factor * M[i][j];
                }
            }
        }
    }

    // 4. Извлечение обратной матрицы (правая часть расширенной матрицы)
    let result = [];
    for (let i = 0; i < rows; i++) {
        result[i] = [];
        for (let j = 0; j < cols; j++) {
            // Округляем дроби до разумной точности (опционально),
            // чтобы избежать 2.00000000004
            let val = M[i][j + cols];
            // result[i][j] = val; // Если нужна абсолютная точность float
            result[i][j] = Math.round(val * 1000000) / 1000000; // Округление для красоты
        }
    }

    return result;
}

// Вспомогательная функция для XOR двух HEX-строк одинаковой длины
function xorHex(hex1, hex2) {
    let res = "";
    for (let i = 0; i < hex1.length; i++) {
        let val = (parseInt(hex1[i], 16) ^ parseInt(hex2[i], 16)).toString(16);
        res += val;
    }
    return res.toUpperCase();
}

// Функция инкремента счетчика (модуль 2^n)
// Для Магмы (64 бита) это обычно 16 HEX символов
function incrementCounter(ctrHex) {
    // Преобразуем HEX в BigInt для корректной работы с 64-битными числами
    let val = BigInt("0x" + ctrHex);
    val = (val + 1n) % (2n ** 64n);
    return val.toString(16).padStart(16, '0');
}

// Строку цифр разделяет на подстроки длины shift и выдает массив
function splitStringToNumbers(str, shift) {
    let result = [];

    for (let i = 0; i < str.length; i += shift) {
        let substring = str.slice(i, i + shift);
        result.push(Number(substring));
    }

    return result;
}

// Все буквы в слове уникальны
function hasUniqueLetters(str) {
    // Приводим к нижнему регистру, если нужно игнорировать регистр
    const letters = str.toLowerCase();
    const set = new Set(letters);
    return set.size === letters.length;
}

//вставка букв ф в Плэйфер
// function prepareText(text) {

//     let str = text.toLowerCase().replace(/[^а-яё]/g, "");

//     let i = 0;
//     while (i < str.length - 1) {

//         if (str[i] === str[i + 1]) {

//             str = str.slice(0, i + 1) + 'ф' + str.slice(i + 1);

//             i = 0; 
//         } else {

//             i += 2;
//         }
//     }

//     if (str.length % 2 !== 0) {
//         str += 'ф';
//     }

//     return str;
// }
function prepareText(text) {

    let str = text.toLowerCase().replace(/[^а-яё]/g, "");

    let i = 0;
    while (i < str.length - 1) {

        if (str[i] === str[i + 1]) {

            let charToInsert = (str[i] === 'ф') ? 'я' : 'ф';

            str = str.slice(0, i + 1) + charToInsert + str.slice(i + 1);

            i = 0;
        } else {
            i += 2;
        }
    }

    if (str.length % 2 !== 0) {

        let lastChar = str[str.length - 1];
        str += (lastChar === 'ф') ? 'я' : 'ф';
    }

    return str;
}

//Оставляет только первые вхождения букв в слове
function removeDuplicateLetters(word) {
    return [...word].filter((letter, index, arr) =>
        arr.indexOf(letter) === index
    ).join('');
}

//Удаляет из строки буквы, содержащиеся в слове
function removeLettersFromString(word, str) {
    // Создаём регулярное выражение из букв слова
    const letters = word.split('');
    const regex = new RegExp(`[${letters.join('')}]`, 'g');

    // Удаляем все найденные буквы
    return str.replace(regex, '');
}

//В двумерном массиве находит индексы элемента по названию и выдает объект
function findElementIndex(matrix, target) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === target) {
                return { row: i, col: j }; // возвращаем объект с индексами
            }
        }
    }
    return null; // элемент не найден
}

//Замена букв в Плэйфере
function replaceLetters(word, changeMap) {
    let result = '';

    for (let letter of word) {
        // Если буква есть в объекте замен, используем замену, иначе оставляем как есть
        result += changeMap[letter] || letter;
    }

    return result;
}

//Замена undefined на пустую строку в двумерном массиве
function replaceUndefinedIn2DArray(arr) {
    return arr.map(row =>
        row.map(value => value === undefined ? '' : value)
    );
}

//Ключ в вертикальной - замена на цифры
function replaceLettersWithNumbers(str) {
    const alphabet = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'];
    const chars = str.split('');
    const remainingChars = [...chars];
    let counter = 1;
    const result = new Array(chars.length);

    while (remainingChars.some(char => char !== null)) {
        let minChar = null;

        for (let i = 0; i < remainingChars.length; i++) {
            const char = remainingChars[i];
            if (char !== null) {
                if (minChar === null || alphabet.indexOf(char) < alphabet.indexOf(minChar)) {
                    minChar = char;
                }
            }
        }

        for (let i = 0; i < remainingChars.length; i++) {
            if (remainingChars[i] === minChar) {
                result[i] = counter;
                remainingChars[i] = null;
                counter++;
            }
        }
    }

    return result;
}

//Вертикальная, основной алгоритм шифрования
function rearrangeColumnsByArray(array, orderArray) {

    const columnsOrder = orderArray.map((value, index) => ({
        value: value,
        colIndex: index
    }));

    columnsOrder.sort((a, b) => a.value - b.value);

    let result = '';

    for (const item of columnsOrder) {
        const col = item.colIndex;

        for (let row = 0; row < array.length; row++) {
            const char = array[row][col];

            if (char !== undefined && char !== null && char !== '') {
                result += char;
            }
        }
    }

    return result;
}

//Создает пустой массив
function createEmpty2DArray(k, n) {
    return Array.from({ length: k }, () => new Array(n));
}

//Добавление к строке случайных букв до кратности 60
function padStringWithRandomLetters(str) {
    const targetLength = Math.ceil(str.length / 60) * 60;
    const paddingNeeded = targetLength - str.length;

    if (paddingNeeded === 0) return str;

    const alphabet = 'абвгдежзийклмнопрстуфхцчшщъыьэюя';
    let padding = 'ё';

    // Добавляем случайные буквы
    for (let i = 1; i < paddingNeeded; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        padding += alphabet[randomIndex];
    }

    return str + padding;
}

//функция, которая вписывает строку в двумерный массив
function fillArrayWithString(str, rows = 6, cols = 10) {
    // Создаем пустой массив
    const array = Array(rows).fill().map(() => Array(cols));

    // Заполняем массив
    for (let i = 0; i < Math.min(str.length, rows * cols); i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        array[row][col] = str[i];
    }

    return array;
}

//Удаление после ё
function removeAfterYo(str) {
    const index = str.indexOf('ё');
    if (index === -1) return str;
    return str.slice(0, index);
}

//Разделение строки на 2 равных подстроки
function splitStringInHalf(str) {
    const middleIndex = Math.floor(str.length / 2);
    const firstHalf = str.slice(0, middleIndex);
    const secondHalf = str.slice(middleIndex);

    return [firstHalf, secondHalf];
}

//Замена ё на е
function replaceYoWithE(str) {
    return str.replaceAll('ё', 'е').replaceAll('Ё', 'Е');
}

// Функция для генерации гаммы для символьного шифрования (mod 32)
function gammaForShenonLenN(a, c, n, key) {
    let result = [];
    let time = key;

    for (let i = 0; i < n; i++) {
        time = (a * time + c) % 32;
        result.push(time);
    }

    return result;
}

// Функция для генерации гаммы для побитового шифрования (mod m)
function gammaForShenonBits(a, c, n, key, m = 2) {
    let result = [];
    let time = key;

    for (let i = 0; i < n; ++i) {
        time = (a * time + c) % m;
        result.push(time);
    }

    return result;
}

//XOR для двух строк из 0 и 1
function xorBitStrings(str1, str2) {
    // Определяем максимальную длину
    const maxLength = Math.max(str1.length, str2.length);
    let result = '';

    for (let i = 0; i < maxLength; i++) {
        // Получаем бит или '0', если строка короче
        const bit1 = i < str1.length ? str1[i] : '0';
        const bit2 = i < str2.length ? str2[i] : '0';

        // Применяем XOR (0^0=0, 0^1=1, 1^0=1, 1^1=0)
        const xorBit = (parseInt(bit1) ^ parseInt(bit2)).toString();

        result += xorBit;
    }

    return result;
}

//Функция для конвертации текста для текстового режима
function convertingInTextMode(text) {

    const alphabetLow = {
        'а': 'а',
        'б': 'б',
        'в': 'в',
        'г': 'г',
        'д': 'д',
        'е': 'е',
        'ж': 'ж',
        'з': 'з',
        'и': 'и',
        'й': 'й',
        'к': 'к',
        'л': 'л',
        'м': 'м',
        'н': 'н',
        'о': 'о',
        'п': 'п',
        'р': 'р',
        'с': 'с',
        'т': 'т',
        'у': 'у',
        'ф': 'ф',
        'х': 'х',
        'ц': 'ц',
        'ч': 'ч',
        'ш': 'ш',
        'щ': 'щ',
        'ъ': 'ъ',
        'ы': 'ы',
        'ь': 'ь',
        'э': 'э',
        'ю': 'ю',
        'я': 'я',
    };

    const alphabetHigh = {
        'А': 'азглв',
        'Б': 'бзглв',
        'В': 'взглв',
        'Г': 'гзглв',
        'Д': 'дзглв',
        'Е': 'езглв',
        'Ж': 'жзглв',
        'З': 'ззглв',
        'И': 'изглв',
        'Й': 'йзглв',
        'К': 'кзглв',
        'Л': 'лзглв',
        'М': 'мзглв',
        'Н': 'нзглв',
        'О': 'озглв',
        'П': 'пзглв',
        'Р': 'рзглв',
        'С': 'сзглв',
        'Т': 'тзглв',
        'У': 'узглв',
        'Ф': 'фзглв',
        'Х': 'хзглв',
        'Ц': 'цзглв',
        'Ч': 'чзглв',
        'Ш': 'шзглв',
        'Щ': 'щзглв',
        'Ъ': 'ъзглв',
        'Ы': 'ызглв',
        'Ь': 'ьзглв',
        'Э': 'эзглв',
        'Ю': 'юзглв',
        'Я': 'язглв',
    };

    const alphabetSpec = {
        ' ': 'прблф',
        '-': 'тиреф',
        '?': 'впрзн',
        '!': 'вскзн',
        '.': 'тчкпр',
        ',': 'зптпр',
        '\"': 'квчкф',
        ';': 'тчкзп',
        ':': 'двтчф',
        '(': 'крскл',
        ')': 'крскп',
        '...': 'мнгтч',
        '\t': 'таблф',
        '\n': 'энтэр',
        '—': 'тиреф',
        '–': 'тиреф',
        '-': 'тиреф',
        '«': 'квчкф',
        '»': 'квчкф',
        '‘': 'квчкф',
        '’': 'квчкф',
        '“': 'квчкф',
        '”': 'квчкф',
        ' ': 'прблф',
    };

    text = replaceNumbersWithWords(text);
    result = "";

    for (let i of text) {

        if (i in alphabetHigh) {
            result += alphabetHigh[i];

        } else if (i in alphabetSpec) {
            result += alphabetSpec[i];

        } else {
            result += alphabetLow[i];
        }
    }

    return result;
}

//Функция для обратной конвертации текста для текстового режима
function inConvertingInTextMode(text) {

    const alphabetHighD = {
        'азглв': 'А',
        'бзглв': 'Б',
        'взглв': 'В',
        'гзглв': 'Г',
        'дзглв': 'Д',
        'езглв': 'Е',
        'жзглв': 'Ж',
        'ззглв': 'З',
        'изглв': 'И',
        'йзглв': 'Й',
        'кзглв': 'К',
        'лзглв': 'Л',
        'мзглв': 'М',
        'нзглв': 'Н',
        'озглв': 'О',
        'пзглв': 'П',
        'рзглв': 'Р',
        'сзглв': 'С',
        'тзглв': 'Т',
        'узглв': 'У',
        'фзглв': 'Ф',
        'хзглв': 'Х',
        'цзглв': 'Ц',
        'чзглв': 'Ч',
        'шзглв': 'Ш',
        'щзглв': 'Щ',
        'ъзглв': 'Ъ',
        'ызглв': 'Ы',
        'ьзглв': 'Ь',
        'эзглв': 'Э',
        'юзглв': 'Ю',
        'язглв': 'Я'
    };

    const alphabetSpecD = {
        "прблф": " ",
        "тиреф": "-",
        "впрзн": "?",
        "вскзн": "!",
        "тчкпр": ".",
        "зптпр": ",",
        "квчкф": "\"",
        "тчкзп": ";",
        "двтчф": ":",
        "крскл": "(",
        "крскп": ")",
        "мнгтч": "...",
        'таблф': '\t',
        'энтэр': '\n',
    };

    const alphabetLow = {
        'а': 'а',
        'б': 'б',
        'в': 'в',
        'г': 'г',
        'д': 'д',
        'е': 'е',
        'ж': 'ж',
        'з': 'з',
        'и': 'и',
        'й': 'й',
        'к': 'к',
        'л': 'л',
        'м': 'м',
        'н': 'н',
        'о': 'о',
        'п': 'п',
        'р': 'р',
        'с': 'с',
        'т': 'т',
        'у': 'у',
        'ф': 'ф',
        'х': 'х',
        'ц': 'ц',
        'ч': 'ч',
        'ш': 'ш',
        'щ': 'щ',
        'ъ': 'ъ',
        'ы': 'ы',
        'ь': 'ь',
        'э': 'э',
        'ю': 'ю',
        'я': 'я',
    };

    let i = 0;

    let result = "";

    while (i < text.length) {
        if (i < text.length - 4) {
            const substring = text.slice(i, i + 5);

            if (alphabetHighD.hasOwnProperty(substring)) {
                result += alphabetHighD[substring];
                i += 5;
            } else if (alphabetSpecD.hasOwnProperty(substring)) {
                result += alphabetSpecD[substring];
                i += 5;
            } else {
                const char = text[i];
                if (alphabetLow.hasOwnProperty(char)) {
                    result += alphabetLow[char];
                } else {
                    result += char;
                }
                i += 1;
            }
        } else {
            const char = text[i];
            if (alphabetLow.hasOwnProperty(char)) {
                result += alphabetLow[char];
            } else {
                result += char;
            }
            i += 1;
        }
    }

    return result;
}

//Функция заменяет числа на слова до 99
function replaceNumbersWithWords(text) {
    const dictionaries = {
        dateOrdinals: {
            '1': 'первого', '2': 'второго', '3': 'третьего', '4': 'четвертого', '5': 'пятого',
            '6': 'шестого', '7': 'седьмого', '8': 'восьмого', '9': 'девятого', '10': 'десятого',
            '11': 'одиннадцатого', '12': 'двенадцатого', '13': 'тринадцатого', '14': 'четырнадцатого',
            '15': 'пятнадцатого', '16': 'шестнадцатого', '17': 'семнадцатьго', '18': 'восемнадцатого',
            '19': 'девятнадцатого', '20': 'двадцатого', '30': 'тридцатого', '40': 'сорокового',
            '50': 'пятидесятого', '60': 'шестидесятого', '70': 'семидесятого', '80': 'восьмидесятого',
            '90': 'девяностого', '100': 'сотого'
        },
        feminineOrdinals: {
            '1': 'первая', '2': 'вторая', '3': 'третья', '4': 'четвертая', '5': 'пятая',
            '6': 'шестая', '7': 'седьмая', '8': 'восьмая', '9': 'девятая', '10': 'десятая',
            '20': 'двадцатая', '30': 'тридцатая'
        },
        prefixes: {
            '1': 'одно', '2': 'двух', '3': 'трех', '4': 'четырех', '5': 'пяти', '10': 'десяти', '100': 'сто'
        },
        cardinals: {
            '1': 'один', '2': 'два', '3': 'три', '4': 'четыре', '5': 'пять', '6': 'шесть',
            '7': 'семь', '8': 'восемь', '9': 'девять', '10': 'десять', '11': 'одиннадцать',
            '12': 'двенадцать', '13': 'тринадцать', '14': 'четырнадцать', '15': 'пятнадцать',
            '16': 'шестнадцать', '17': 'семнадцать', '18': 'восемнадцать', '19': 'девятнадцать',
            '20': 'двадцать', '30': 'тридцать', '40': 'сорок', '50': 'пятьдесят',
            '60': 'шестьдесят', '70': 'семьдесят', '80': 'восемьдесят', '90': 'девяносто', '100': 'сто'
        }
    };

    const monthNames = "января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря";
    let currentText = text;

    // Вспомогательная функция для сборки составных чисел (21, 32 и т.д.)
    function getCompound(num, dict) {
        if (dict[num]) return dict[num];
        const n = parseInt(num, 10);
        if (n > 20 && n < 100) {
            const tens = Math.floor(n / 10) * 10;
            const units = n % 10;
            // В русском порядковом числе меняется ТОЛЬКО последнее слово
            // Поэтому берем КАРДИНАЛ (тридцать) + ПОРЯДКОВОЕ (второго)
            if (units === 0) return dict[tens];
            return (dictionaries.cardinals[tens] || tens) + ' ' + (dict[units] || units);
        }
        return num;
    }

    // ШАГ 1: Даты (Число + Месяц) - САМЫЙ ВЫСОКИЙ ПРИОРИТЕТ
    const dateRegex = new RegExp(`\\b(\\d+)\\s+(${monthNames})`, 'gi');
    currentText = currentText.replace(dateRegex, (match, num, month) => {
        return getCompound(num, dictionaries.dateOrdinals) + ' ' + month;
    });

    // ШАГ 2: Числа с дефисами (10-го, 27-я, 10-значный)
    currentText = currentText.replace(/(\d+)-([а-яё]+)/gi, (match, num, suffix) => {
        const s = suffix.toLowerCase();
        if (s === 'го' || s === 'ого') return getCompound(num, dictionaries.dateOrdinals);
        if (s === 'я' || s === 'ья' || s === 'тья') return getCompound(num, dictionaries.feminineOrdinals);
        if (dictionaries.prefixes[num]) return dictionaries.prefixes[num] + s;
        return match;
    });

    // ШАГ 3: Обычные числа (19 подарков)
    currentText = currentText.replace(/\b(\d+)\b/g, (match, num) => {
        const n = parseInt(num, 10);
        if (dictionaries.cardinals[num]) return dictionaries.cardinals[num];
        if (n > 20 && n < 100) {
            const tens = Math.floor(n / 10) * 10;
            const units = n % 10;
            return dictionaries.cardinals[tens] + (units > 0 ? ' ' + dictionaries.cardinals[units] : '');
        }
        return match;
    });

    return currentText;
}

// Перевод текста в массив битов (каждая буква = 5 бит)
function textToBits(text) {
    const ALPHABET = "абвгдежзийклмнопрстуфхцчшщъыьэюя";
    let bits = [];
    for (let char of text.toLowerCase()) {
        let index = ALPHABET.indexOf(char);
        if (index === -1) continue;

        for (let i = 4; i >= 0; i--) {
            bits.push((index >> i) & 1);
        }
    }
    return bits;
}

// Перевод битов обратно в текст
function bitsToText(bits) {
    let text = "";
    const ALPHABET = "абвгдежзийклмнопрстуфхцчшщъыьэюя";
    for (let i = 0; i < bits.length; i += 5) {
        let chunk = bits.slice(i, i + 5);
        if (chunk.length < 5) break;
        let index = 0;
        for (let bit of chunk) {
            index = (index << 1) | bit;
        }
        text += ALPHABET[index];
    }
    return text;
}

// .//////////////////////////////////////////////////////////////////////////////////////
// .//////////////////////////////////////////////////////////////////////////////////////
// .//////////////////////////////////////////////////////////////////////////////////////
// .//////////////////////////////////////////////////////////////////////////////////////
// --------------------------------------ШИФРЫ--------------------------------------------
// .//////////////////////////////////////////////////////////////////////////////////////
// .//////////////////////////////////////////////////////////////////////////////////////
// .//////////////////////////////////////////////////////////////////////////////////////
// .//////////////////////////////////////////////////////////////////////////////////////

//1. АТБАШ
function atbash(text, isTextMode, isEncrypt) {

    //переменная для переделанного текста
    let processedText = "";

    if (isTextMode) {
        // ТЕКСТОВЫЙ РЕЖИМ
        processedText = text;

        //Алфавит замены
        const alphabetLow = {
            'а': 'я',
            'б': 'ю',
            'в': 'э',
            'г': 'ь',
            'д': 'ы',
            'е': 'ъ',
            'ж': 'щ',
            'з': 'ш',
            'и': 'ч',
            'й': 'ц',
            'к': 'х',
            'л': 'ф',
            'м': 'у',
            'н': 'т',
            'о': 'с',
            'п': 'р',
            'р': 'п',
            'с': 'о',
            'т': 'н',
            'у': 'м',
            'ф': 'л',
            'х': 'к',
            'ц': 'й',
            'ч': 'и',
            'ш': 'з',
            'щ': 'ж',
            'ъ': 'е',
            'ы': 'д',
            'ь': 'г',
            'э': 'в',
            'ю': 'б',
            'я': 'а',
        }
        const alphabetHigh = {
            'А': 'язглв',
            'Б': 'юзглв',
            'В': 'эзглв',
            'Г': 'ьзглв',
            'Д': 'ызглв',
            'Е': 'ъзглв',
            'Ж': 'щзглв',
            'З': 'шзглв',
            'И': 'чзглв',
            'Й': 'цзглв',
            'К': 'хзглв',
            'Л': 'фзглв',
            'М': 'узглв',
            'Н': 'тзглв',
            'О': 'сзглв',
            'П': 'рзглв',
            'Р': 'пзглв',
            'С': 'озглв',
            'Т': 'нзглв',
            'У': 'мзглв',
            'Ф': 'лзглв',
            'Х': 'кзглв',
            'Ц': 'йзглв',
            'Ч': 'изглв',
            'Ш': 'ззглв',
            'Щ': 'жзглв',
            'Ъ': 'езглв',
            'Ы': 'дзглв',
            'Ь': 'гзглв',
            'Э': 'взглв',
            'Ю': 'бзглв',
            'Я': 'азглв',
        }

        const alphabetHighD = {
            'язглв': 'А',
            'юзглв': 'Б',
            'эзглв': 'В',
            'ьзглв': 'Г',
            'ызглв': 'Д',
            'ъзглв': 'Е',
            'щзглв': 'Ж',
            'шзглв': 'З',
            'чзглв': 'И',
            'цзглв': 'Й',
            'хзглв': 'К',
            'фзглв': 'Л',
            'узглв': 'М',
            'тзглв': 'Н',
            'сзглв': 'О',
            'рзглв': 'П',
            'пзглв': 'Р',
            'озглв': 'С',
            'нзглв': 'Т',
            'мзглв': 'У',
            'лзглв': 'Ф',
            'кзглв': 'Х',
            'йзглв': 'Ц',
            'изглв': 'Ч',
            'ззглв': 'Ш',
            'жзглв': 'Щ',
            'езглв': 'Ъ',
            'дзглв': 'Ы',
            'гзглв': 'Ь',
            'взглв': 'Э',
            'бзглв': 'Ю',
            'азглв': 'Я'
        };

        const alphabetSpec = {
            ' ': 'прблф',
            '−': 'тиреф',
            '?': 'впрзн',
            '!': 'вскзн',
            '.': 'тчкпр',
            ',': 'зптпр',
            '\"': 'квчкф',
            ';': 'тчкзп',
            ':': 'двтчф',
            '(': 'крскл',
            ')': 'крскп',
            '...': 'мнгтч',
            '\n': 'энтэр',
            '—': 'тиреф',
            '–': 'тиреф',
            '-': 'тиреф',
        }

        const alphabetSpecD = {
            "прблф": " ",
            "тиреф": "-",
            "впрзн": "?",
            "вскзн": "!",
            "тчкпр": ".",
            "зптпр": ",",
            "квчкф": "\"",
            "тчкзп": ";",
            "двтчф": ":",
            "крскл": "(",
            "крскп": ")",
            "мнгтч": "...",
            'таблф': '\t',
            'энтэр': '\n',
        }

        let result = "";

        if (isEncrypt) {
            for (let i of processedText) {

                const lowerChar = i.toLowerCase();
                const isUpperCase = i === i.toUpperCase() && i !== i.toLowerCase();

                if (lowerChar in alphabetLow) {
                    let replacement = alphabetLow[lowerChar];
                    result += isUpperCase ? alphabetHigh[i] : replacement;
                }
                else if (lowerChar in alphabetSpec) {
                    result += alphabetSpec[lowerChar];
                }
            }
        } else {

            let i = 0;

            while (i < processedText.length) {
                if (i < processedText.length - 4) {
                    const substring = processedText.slice(i, i + 5);

                    if (alphabetHighD.hasOwnProperty(substring)) {
                        result += alphabetHighD[substring];
                        i += 5;
                    } else if (alphabetSpecD.hasOwnProperty(substring)) {
                        result += alphabetSpecD[substring];
                        i += 5;
                    } else {
                        const char = processedText[i];
                        if (alphabetLow.hasOwnProperty(char)) {
                            result += alphabetLow[char];
                        } else {
                            result += char;
                        }
                        i += 1;
                    }
                } else {
                    const char = processedText[i];
                    if (alphabetLow.hasOwnProperty(char)) {
                        result += alphabetLow[char];
                    } else {
                        result += char;
                    }
                    i += 1;
                }
            }

        }

        return result;

    } else {
        // ТЕСТОВЫЙ РЕЖИМ
        processedText = text.replace(/\s/g, '').toLowerCase().replaceAll(',', 'зпт').replaceAll('.', 'тчк');

        //Алфавит замены
        const alphabet = {
            'а': 'я',
            'б': 'ю',
            'в': 'э',
            'г': 'ь',
            'д': 'ы',
            'е': 'ъ',
            'ж': 'щ',
            'з': 'ш',
            'и': 'ч',
            'й': 'ц',
            'к': 'х',
            'л': 'ф',
            'м': 'у',
            'н': 'т',
            'о': 'с',
            'п': 'р',
            'р': 'п',
            'с': 'о',
            'т': 'н',
            'у': 'м',
            'ф': 'л',
            'х': 'к',
            'ц': 'й',
            'ч': 'и',
            'ш': 'з',
            'щ': 'ж',
            'ъ': 'е',
            'ы': 'д',
            'ь': 'г',
            'э': 'в',
            'ю': 'б',
            'я': 'а',
        }

        let result = "";

        for (let i of processedText) {
            result += alphabet[i];
        }

        return result;
    }

}

// 2. ЦЕЗАРЬ
function caesar(text, isTextMode, isEncrypt, shift) {

    let processedText = "";

    if (shift < 0 || shift > 31) {
        return "ОШИБКА КЛЮЧА!"
    }


    if (isTextMode) {

        // ТЕКСТОВЫЙ РЕЖИМ

        //Алфавит замены
        const alphabet = "абвгдежзийклмнопрстуфхцчшщъыьэюя"

        const alphabetLow = {
            'а': 'а',
            'б': 'б',
            'в': 'в',
            'г': 'г',
            'д': 'д',
            'е': 'е',
            'ж': 'ж',
            'з': 'з',
            'и': 'и',
            'й': 'й',
            'к': 'к',
            'л': 'л',
            'м': 'м',
            'н': 'н',
            'о': 'о',
            'п': 'п',
            'р': 'р',
            'с': 'с',
            'т': 'т',
            'у': 'у',
            'ф': 'ф',
            'х': 'х',
            'ц': 'ц',
            'ч': 'ч',
            'ш': 'ш',
            'щ': 'щ',
            'ъ': 'ъ',
            'ы': 'ы',
            'ь': 'ь',
            'э': 'э',
            'ю': 'ю',
            'я': 'я',
        }

        const alphabetHigh = {
            'А': 'азглв',
            'Б': 'бзглв',
            'В': 'взглв',
            'Г': 'гзглв',
            'Д': 'дзглв',
            'Е': 'езглв',
            'Ж': 'жзглв',
            'З': 'ззглв',
            'И': 'изглв',
            'Й': 'йзглв',
            'К': 'кзглв',
            'Л': 'лзглв',
            'М': 'мзглв',
            'Н': 'нзглв',
            'О': 'озглв',
            'П': 'пзглв',
            'Р': 'рзглв',
            'С': 'сзглв',
            'Т': 'тзглв',
            'У': 'узглв',
            'Ф': 'фзглв',
            'Х': 'хзглв',
            'Ц': 'цзглв',
            'Ч': 'чзглв',
            'Ш': 'шзглв',
            'Щ': 'щзглв',
            'Ъ': 'ъзглв',
            'Ы': 'ызглв',
            'Ь': 'ьзглв',
            'Э': 'эзглв',
            'Ю': 'юзглв',
            'Я': 'язглв',
        }

        const alphabetHighD = {
            'азглв': 'А',
            'бзглв': 'Б',
            'взглв': 'В',
            'гзглв': 'Г',
            'дзглв': 'Д',
            'езглв': 'Е',
            'жзглв': 'Ж',
            'ззглв': 'З',
            'изглв': 'И',
            'йзглв': 'Й',
            'кзглв': 'К',
            'лзглв': 'Л',
            'мзглв': 'М',
            'нзглв': 'Н',
            'озглв': 'О',
            'пзглв': 'П',
            'рзглв': 'Р',
            'сзглв': 'С',
            'тзглв': 'Т',
            'узглв': 'У',
            'фзглв': 'Ф',
            'хзглв': 'Х',
            'цзглв': 'Ц',
            'чзглв': 'Ч',
            'шзглв': 'Ш',
            'щзглв': 'Щ',
            'ъзглв': 'Ъ',
            'ызглв': 'Ы',
            'ьзглв': 'Ь',
            'эзглв': 'Э',
            'юзглв': 'Ю',
            'язглв': 'Я'
        };

        const alphabetSpec = {
            ' ': 'прблф',
            '-': 'тиреф',
            '?': 'впрзн',
            '!': 'вскзн',
            '.': 'тчкпр',
            ',': 'зптпр',
            '\"': 'квчкф',
            ';': 'тчкзп',
            ':': 'двтчф',
            '(': 'крскл',
            ')': 'крскп',
            '...': 'мнгтч',
            '\t': 'таблф',
            '\n': 'энтэр',
            '—': 'тиреф',
            '–': 'тиреф',
            '-': 'тиреф',
        }

        const alphabetSpecD = {
            "прблф": " ",
            "тиреф": "-",
            "впрзн": "?",
            "вскзн": "!",
            "тчкпр": ".",
            "зптпр": ",",
            "квчкф": "\"",
            "тчкзп": ";",
            "двтчф": ":",
            "крскл": "(",
            "крскп": ")",
            "мнгтч": "...",
            'таблф': '\t',
            'энтэр': '\n',
        }

        let result = "";

        if (isEncrypt) {

            for (let i of text) {

                if (i in alphabetHigh) {
                    processedText += alphabetHigh[i];

                } else if (i in alphabetSpec) {
                    processedText += alphabetSpec[i];

                } else {
                    processedText += alphabetLow[i];
                }
            }

            for (let i of processedText) {

                const index = alphabet.indexOf(i);

                if (index !== -1) {

                    let newIndex = (index + shift) % alphabet.length;

                    if (newIndex < 0) {
                        newIndex += alphabet.length;
                    }

                    result += alphabet[newIndex];

                } else {

                    result += i;

                }
            }

        } else {

            processedText = text;

            let caesarResult = '';
            for (let char of processedText) {
                const index = alphabet.indexOf(char);

                if (index !== -1) {
                    let newIndex = (index - shift) % alphabet.length;
                    if (newIndex < 0) {
                        newIndex += alphabet.length;
                    }
                    caesarResult += alphabet[newIndex];
                } else {
                    caesarResult += char;
                }
            }

            let i = 0;
            while (i < caesarResult.length) {
                if (i < caesarResult.length - 4) {
                    const substring = caesarResult.slice(i, i + 5);

                    if (alphabetHighD.hasOwnProperty(substring)) {
                        result += alphabetHighD[substring];
                        i += 5;
                    } else if (alphabetSpecD.hasOwnProperty(substring)) {
                        result += alphabetSpecD[substring];
                        i += 5;
                    } else {
                        const char = caesarResult[i];
                        if (alphabetLow.hasOwnProperty(char)) {
                            result += alphabetLow[char];
                        } else {
                            result += char;
                        }
                        i += 1;
                    }
                } else {
                    const char = caesarResult[i];
                    if (alphabetLow.hasOwnProperty(char)) {
                        result += alphabetLow[char];
                    } else {
                        result += char;
                    }
                    i += 1;
                }
            }

        }

        return result;

    } else {

        // ТЕСТОВЫЙ РЕЖИМ
        processedText = text.replace(/\s/g, '').toLowerCase().replaceAll(',', 'зпт').replaceAll('.', 'тчк');

        const alphabet = "абвгдежзийклмнопрстуфхцчшщъыьэюя";
        let result = "";

        if (isEncrypt) {
            for (let i of processedText) {

                const index = alphabet.indexOf(i);

                if (index !== -1) {

                    let newIndex = (index + shift) % alphabet.length;

                    if (newIndex < 0) {
                        newIndex += alphabet.length;
                    }

                    result += alphabet[newIndex];

                } else {

                    result += i;

                }
            }
        } else {

            for (let i of processedText) {

                const index = alphabet.indexOf(i);

                if (index !== -1) {

                    let newIndex = (index - shift) % alphabet.length;

                    if (newIndex < 0) {
                        newIndex += alphabet.length;
                    }

                    result += alphabet[newIndex];

                } else {

                    result += i;

                }
            }
        }

        return result;
    }
}

// 3. ПОЛИБИЯ
function polybius(text, isTextMode, isEncrypt) {

    //переменная для переделанного текста
    let processedText = "";

    //Алфавит замены
    const alphabet = {
        'а': '11',
        'б': '12',
        'в': '13',
        'г': '14',
        'д': '15',
        'е': '16',
        'ж': '21',
        'з': '22',
        'и': '23',
        'й': '24',
        'к': '25',
        'л': '26',
        'м': '31',
        'н': '32',
        'о': '33',
        'п': '34',
        'р': '35',
        'с': '36',
        'т': '41',
        'у': '42',
        'ф': '43',
        'х': '44',
        'ц': '45',
        'ч': '46',
        'ш': '51',
        'щ': '52',
        'ъ': '53',
        'ы': '54',
        'ь': '55',
        'э': '56',
        'ю': '61',
        'я': '62',
    }
    const alphabetD = {
        '11': 'а',
        '12': 'б',
        '13': 'в',
        '14': 'г',
        '15': 'д',
        '16': 'е',
        '21': 'ж',
        '22': 'з',
        '23': 'и',
        '24': 'й',
        '25': 'к',
        '26': 'л',
        '31': 'м',
        '32': 'н',
        '33': 'о',
        '34': 'п',
        '35': 'р',
        '36': 'с',
        '41': 'т',
        '42': 'у',
        '43': 'ф',
        '44': 'х',
        '45': 'ц',
        '46': 'ч',
        '51': 'ш',
        '52': 'щ',
        '53': 'ъ',
        '54': 'ы',
        '55': 'ь',
        '56': 'э',
        '61': 'ю',
        '62': 'я'
    };

    if (isTextMode) {

        //алфавиты

        const alphabetLow = {
            'а': 'а',
            'б': 'б',
            'в': 'в',
            'г': 'г',
            'д': 'д',
            'е': 'е',
            'ж': 'ж',
            'з': 'з',
            'и': 'и',
            'й': 'й',
            'к': 'к',
            'л': 'л',
            'м': 'м',
            'н': 'н',
            'о': 'о',
            'п': 'п',
            'р': 'р',
            'с': 'с',
            'т': 'т',
            'у': 'у',
            'ф': 'ф',
            'х': 'х',
            'ц': 'ц',
            'ч': 'ч',
            'ш': 'ш',
            'щ': 'щ',
            'ъ': 'ъ',
            'ы': 'ы',
            'ь': 'ь',
            'э': 'э',
            'ю': 'ю',
            'я': 'я',
        }

        const alphabetHigh = {
            'А': 'азглв',
            'Б': 'бзглв',
            'В': 'взглв',
            'Г': 'гзглв',
            'Д': 'дзглв',
            'Е': 'езглв',
            'Ж': 'жзглв',
            'З': 'ззглв',
            'И': 'изглв',
            'Й': 'йзглв',
            'К': 'кзглв',
            'Л': 'лзглв',
            'М': 'мзглв',
            'Н': 'нзглв',
            'О': 'озглв',
            'П': 'пзглв',
            'Р': 'рзглв',
            'С': 'сзглв',
            'Т': 'тзглв',
            'У': 'узглв',
            'Ф': 'фзглв',
            'Х': 'хзглв',
            'Ц': 'цзглв',
            'Ч': 'чзглв',
            'Ш': 'шзглв',
            'Щ': 'щзглв',
            'Ъ': 'ъзглв',
            'Ы': 'ызглв',
            'Ь': 'ьзглв',
            'Э': 'эзглв',
            'Ю': 'юзглв',
            'Я': 'язглв',
        }

        const alphabetHighD = {
            'азглв': 'А',
            'бзглв': 'Б',
            'взглв': 'В',
            'гзглв': 'Г',
            'дзглв': 'Д',
            'езглв': 'Е',
            'жзглв': 'Ж',
            'ззглв': 'З',
            'изглв': 'И',
            'йзглв': 'Й',
            'кзглв': 'К',
            'лзглв': 'Л',
            'мзглв': 'М',
            'нзглв': 'Н',
            'озглв': 'О',
            'пзглв': 'П',
            'рзглв': 'Р',
            'сзглв': 'С',
            'тзглв': 'Т',
            'узглв': 'У',
            'фзглв': 'Ф',
            'хзглв': 'Х',
            'цзглв': 'Ц',
            'чзглв': 'Ч',
            'шзглв': 'Ш',
            'щзглв': 'Щ',
            'ъзглв': 'Ъ',
            'ызглв': 'Ы',
            'ьзглв': 'Ь',
            'эзглв': 'Э',
            'юзглв': 'Ю',
            'язглв': 'Я'
        };

        const alphabetSpec = {
            ' ': 'прблф',
            '-': 'тиреф',
            '?': 'впрзн',
            '!': 'вскзн',
            '.': 'тчкпр',
            ',': 'зптпр',
            '\"': 'квчкф',
            ';': 'тчкзп',
            ':': 'двтчф',
            '(': 'крскл',
            ')': 'крскп',
            '...': 'мнгтч',
            '\t': 'таблф',
            '\n': 'энтэр',
            '—': 'тиреф',
            '–': 'тиреф',
            '-': 'тиреф',
        }

        const alphabetSpecD = {
            "прблф": " ",
            "тиреф": "-",
            "впрзн": "?",
            "вскзн": "!",
            "тчкпр": ".",
            "зптпр": ",",
            "квчкф": "\"",
            "тчкзп": ";",
            "двтчф": ":",
            "крскл": "(",
            "крскп": ")",
            "мнгтч": "...",
            'таблф': '\t',
            'энтэр': '\n',
        }

        let result = "";

        if (isEncrypt) {

            for (let i of text) {

                if (i in alphabetHigh) {
                    processedText += alphabetHigh[i];

                } else if (i in alphabetSpec) {
                    processedText += alphabetSpec[i];

                } else {
                    processedText += alphabetLow[i];
                }
            }

            for (let i of processedText) {
                result += alphabet[i];
            }

        } else {

            processedText = text;
            let polybiusResult = '';

            let i = 0;

            while (i < processedText.length) {

                const substring = processedText.slice(i, i + 2);

                if (alphabetD.hasOwnProperty(substring)) {

                    polybiusResult += alphabetD[substring];
                    i += 2;

                } else {

                    return "ОШИБКА ВВОДА!";

                }

            }

            i = 0;

            while (i < polybiusResult.length) {
                if (i < polybiusResult.length - 4) {
                    const substring = polybiusResult.slice(i, i + 5);

                    if (alphabetHighD.hasOwnProperty(substring)) {
                        result += alphabetHighD[substring];
                        i += 5;
                    } else if (alphabetSpecD.hasOwnProperty(substring)) {
                        result += alphabetSpecD[substring];
                        i += 5;
                    } else {
                        const char = polybiusResult[i];
                        if (alphabetLow.hasOwnProperty(char)) {
                            result += alphabetLow[char];
                        } else {
                            result += char;
                        }
                        i += 1;
                    }
                } else {
                    const char = polybiusResult[i];
                    if (alphabetLow.hasOwnProperty(char)) {
                        result += alphabetLow[char];
                    } else {
                        result += char;
                    }
                    i += 1;
                }
            }

        }

        return result;

    } else {

        processedText = text.replace(/\s/g, '').toLowerCase().replaceAll(',', 'зпт').replaceAll('.', 'тчк');

        let result = "";

        if (isEncrypt) {

            for (let i of processedText) {
                result += alphabet[i];
            }

        } else {

            let i = 0;

            while (i < processedText.length) {

                const substring = processedText.slice(i, i + 2);

                if (alphabetD.hasOwnProperty(substring)) {

                    result += alphabetD[substring];
                    i += 2;

                } else {

                    return "ОШИБКА ВВОДА!";

                }

            }

        }

        return result;

    }

}

// 4. ТРИТЕМИЯ
function tritemiy(text, isTextMode, isEncrypt) {

    let processedText = "";

    if (isTextMode) {

        // ТЕКСТОВЫЙ РЕЖИМ
        const alphabet = "абвгдежзийклмнопрстуфхцчшщъыьэюя";

        const alphabetLow = {
            'а': 'а',
            'б': 'б',
            'в': 'в',
            'г': 'г',
            'д': 'д',
            'е': 'е',
            'ж': 'ж',
            'з': 'з',
            'и': 'и',
            'й': 'й',
            'к': 'к',
            'л': 'л',
            'м': 'м',
            'н': 'н',
            'о': 'о',
            'п': 'п',
            'р': 'р',
            'с': 'с',
            'т': 'т',
            'у': 'у',
            'ф': 'ф',
            'х': 'х',
            'ц': 'ц',
            'ч': 'ч',
            'ш': 'ш',
            'щ': 'щ',
            'ъ': 'ъ',
            'ы': 'ы',
            'ь': 'ь',
            'э': 'э',
            'ю': 'ю',
            'я': 'я',
        }

        const alphabetHigh = {
            'А': 'азглв',
            'Б': 'бзглв',
            'В': 'взглв',
            'Г': 'гзглв',
            'Д': 'дзглв',
            'Е': 'езглв',
            'Ж': 'жзглв',
            'З': 'ззглв',
            'И': 'изглв',
            'Й': 'йзглв',
            'К': 'кзглв',
            'Л': 'лзглв',
            'М': 'мзглв',
            'Н': 'нзглв',
            'О': 'озглв',
            'П': 'пзглв',
            'Р': 'рзглв',
            'С': 'сзглв',
            'Т': 'тзглв',
            'У': 'узглв',
            'Ф': 'фзглв',
            'Х': 'хзглв',
            'Ц': 'цзглв',
            'Ч': 'чзглв',
            'Ш': 'шзглв',
            'Щ': 'щзглв',
            'Ъ': 'ъзглв',
            'Ы': 'ызглв',
            'Ь': 'ьзглв',
            'Э': 'эзглв',
            'Ю': 'юзглв',
            'Я': 'язглв',
        }

        const alphabetHighD = {
            'азглв': 'А',
            'бзглв': 'Б',
            'взглв': 'В',
            'гзглв': 'Г',
            'дзглв': 'Д',
            'езглв': 'Е',
            'жзглв': 'Ж',
            'ззглв': 'З',
            'изглв': 'И',
            'йзглв': 'Й',
            'кзглв': 'К',
            'лзглв': 'Л',
            'мзглв': 'М',
            'нзглв': 'Н',
            'озглв': 'О',
            'пзглв': 'П',
            'рзглв': 'Р',
            'сзглв': 'С',
            'тзглв': 'Т',
            'узглв': 'У',
            'фзглв': 'Ф',
            'хзглв': 'Х',
            'цзглв': 'Ц',
            'чзглв': 'Ч',
            'шзглв': 'Ш',
            'щзглв': 'Щ',
            'ъзглв': 'Ъ',
            'ызглв': 'Ы',
            'ьзглв': 'Ь',
            'эзглв': 'Э',
            'юзглв': 'Ю',
            'язглв': 'Я'
        };

        const alphabetSpec = {
            ' ': 'прблф',
            '-': 'тиреф',
            '?': 'впрзн',
            '!': 'вскзн',
            '.': 'тчкпр',
            ',': 'зптпр',
            '\"': 'квчкф',
            ';': 'тчкзп',
            ':': 'двтчф',
            '(': 'крскл',
            ')': 'крскп',
            '...': 'мнгтч',
            '\t': 'таблф',
            '\n': 'энтэр',
            '—': 'тиреф',
            '–': 'тиреф',
            '-': 'тиреф',
        }

        const alphabetSpecD = {
            "прблф": " ",
            "тиреф": "-",
            "впрзн": "?",
            "вскзн": "!",
            "тчкпр": ".",
            "зптпр": ",",
            "квчкф": "\"",
            "тчкзп": ";",
            "двтчф": ":",
            "крскл": "(",
            "крскп": ")",
            "мнгтч": "...",
            'таблф': '\t',
            'энтэр': '\n',
        }

        let result = "";

        if (isEncrypt) {

            for (let char of text) {
                if (char in alphabetHigh) {
                    processedText += alphabetHigh[char];
                } else if (char in alphabetSpec) {
                    processedText += alphabetSpec[char];
                } else if (char in alphabetLow) {
                    processedText += alphabetLow[char];
                } else {
                    processedText += char;
                }
            }

            let j = 1;
            for (let char of processedText) {
                const index = alphabet.indexOf(char);

                if (index === -1) {
                    result += char;
                    j += 1;
                    continue;
                }

                let newIndex = (index + j - 1) % 32;
                result += alphabet[newIndex];
                j += 1;
            }

            return result;

        } else {

            processedText = text;
            tritemiyResult = "";
            j = 1;

            for (let char of processedText) {
                const index = alphabet.indexOf(char);

                if (index === -1) {
                    tritemiyResult += char;
                    continue;
                }

                if (isEncrypt) {

                } else {

                    let newIndex = (index - (j - 1)) % 32;

                    if (newIndex < 0) newIndex += 32;
                    tritemiyResult += alphabet[newIndex];
                }

                j += 1;
            }

            let i = 0;

            while (i < tritemiyResult.length) {
                if (i < tritemiyResult.length - 4) {
                    const substring = tritemiyResult.slice(i, i + 5);

                    if (alphabetHighD.hasOwnProperty(substring)) {
                        result += alphabetHighD[substring];
                        i += 5;
                    } else if (alphabetSpecD.hasOwnProperty(substring)) {
                        result += alphabetSpecD[substring];
                        i += 5;
                    } else {
                        const char = tritemiyResult[i];
                        if (alphabetLow.hasOwnProperty(char)) {
                            result += alphabetLow[char];
                        } else {
                            result += char;
                        }
                        i += 1;
                    }
                } else {
                    const char = tritemiyResult[i];
                    if (alphabetLow.hasOwnProperty(char)) {
                        result += alphabetLow[char];
                    } else {
                        result += char;
                    }
                    i += 1;
                }
            }

            return result;

        }

    } else {

        // ТЕСТОВЫЙ РЕЖИМ
        processedText = text.replace(/\s/g, '').toLowerCase().replaceAll(',', 'зпт').replaceAll('.', 'тчк');

        const alphabet = "абвгдежзийклмнопрстуфхцчшщъыьэюя"
        let result = "";
        let j = 1;

        for (let char of processedText) {
            const index = alphabet.indexOf(char);

            if (index === -1) {
                result += char;
                continue;
            }

            if (isEncrypt) {

                let newIndex = (index + j - 1) % 32;
                result += alphabet[newIndex];
            } else {

                let newIndex = (index - (j - 1)) % 32;

                if (newIndex < 0) newIndex += 32;
                result += alphabet[newIndex];
            }

            j += 1;
        }

        return result;
    }
}

// 5. БЕЛАЗО
function belazo(text, isTextMode, isEncrypt, shift) {

    let processedText = "";

    const alphabet = "абвгдежзийклмнопрстуфхцчшщъыьэюя";

    const alphabetNumbers = {
        'а': 1,
        'б': 2,
        'в': 3,
        'г': 4,
        'д': 5,
        'е': 6,
        'ж': 7,
        'з': 8,
        'и': 9,
        'й': 10,
        'к': 11,
        'л': 12,
        'м': 13,
        'н': 14,
        'о': 15,
        'п': 16,
        'р': 17,
        'с': 18,
        'т': 19,
        'у': 20,
        'ф': 21,
        'х': 22,
        'ц': 23,
        'ч': 24,
        'ш': 25,
        'щ': 26,
        'ъ': 27,
        'ы': 28,
        'ь': 29,
        'э': 30,
        'ю': 31,
        'я': 32
    }

    const alphabetLow = {
        'а': 'а',
        'б': 'б',
        'в': 'в',
        'г': 'г',
        'д': 'д',
        'е': 'е',
        'ж': 'ж',
        'з': 'з',
        'и': 'и',
        'й': 'й',
        'к': 'к',
        'л': 'л',
        'м': 'м',
        'н': 'н',
        'о': 'о',
        'п': 'п',
        'р': 'р',
        'с': 'с',
        'т': 'т',
        'у': 'у',
        'ф': 'ф',
        'х': 'х',
        'ц': 'ц',
        'ч': 'ч',
        'ш': 'ш',
        'щ': 'щ',
        'ъ': 'ъ',
        'ы': 'ы',
        'ь': 'ь',
        'э': 'э',
        'ю': 'ю',
        'я': 'я',
    }

    const alphabetHigh = {
        'А': 'азглв',
        'Б': 'бзглв',
        'В': 'взглв',
        'Г': 'гзглв',
        'Д': 'дзглв',
        'Е': 'езглв',
        'Ж': 'жзглв',
        'З': 'ззглв',
        'И': 'изглв',
        'Й': 'йзглв',
        'К': 'кзглв',
        'Л': 'лзглв',
        'М': 'мзглв',
        'Н': 'нзглв',
        'О': 'озглв',
        'П': 'пзглв',
        'Р': 'рзглв',
        'С': 'сзглв',
        'Т': 'тзглв',
        'У': 'узглв',
        'Ф': 'фзглв',
        'Х': 'хзглв',
        'Ц': 'цзглв',
        'Ч': 'чзглв',
        'Ш': 'шзглв',
        'Щ': 'щзглв',
        'Ъ': 'ъзглв',
        'Ы': 'ызглв',
        'Ь': 'ьзглв',
        'Э': 'эзглв',
        'Ю': 'юзглв',
        'Я': 'язглв',
    }

    const alphabetHighD = {
        'азглв': 'А',
        'бзглв': 'Б',
        'взглв': 'В',
        'гзглв': 'Г',
        'дзглв': 'Д',
        'езглв': 'Е',
        'жзглв': 'Ж',
        'ззглв': 'З',
        'изглв': 'И',
        'йзглв': 'Й',
        'кзглв': 'К',
        'лзглв': 'Л',
        'мзглв': 'М',
        'нзглв': 'Н',
        'озглв': 'О',
        'пзглв': 'П',
        'рзглв': 'Р',
        'сзглв': 'С',
        'тзглв': 'Т',
        'узглв': 'У',
        'фзглв': 'Ф',
        'хзглв': 'Х',
        'цзглв': 'Ц',
        'чзглв': 'Ч',
        'шзглв': 'Ш',
        'щзглв': 'Щ',
        'ъзглв': 'Ъ',
        'ызглв': 'Ы',
        'ьзглв': 'Ь',
        'эзглв': 'Э',
        'юзглв': 'Ю',
        'язглв': 'Я'
    }

    const alphabetSpec = {
        ' ': 'прблф',
        '-': 'тиреф',
        '?': 'впрзн',
        '!': 'вскзн',
        '.': 'тчкпр',
        ',': 'зптпр',
        '\"': 'квчкф',
        ';': 'тчкзп',
        ':': 'двтчф',
        '(': 'крскл',
        ')': 'крскп',
        '...': 'мнгтч',
        '\t': 'таблф',
        '\n': 'энтэр',
        '—': 'тиреф',
        '–': 'тиреф',
        '-': 'тиреф',
    }

    const alphabetSpecD = {
        "прблф": " ",
        "тиреф": "-",
        "впрзн": "?",
        "вскзн": "!",
        "тчкпр": ".",
        "зптпр": ",",
        "квчкф": "\"",
        "тчкзп": ";",
        "двтчф": ":",
        "крскл": "(",
        "крскп": ")",
        "мнгтч": "...",
        'таблф': '\t',
        'энтэр': '\n',
    }

    if (isTextMode) {

        // ТЕКСТОВЫЙ РЕЖИМ
        let result = "";
        let key = String(shift).toLowerCase();

        if (isEncrypt) {

            processedText = convertingInTextMode(text);

            let j = 0;

            for (let char of processedText) {
                const index = alphabet.indexOf(char);
                if (index === -1) continue;

                let currentShift;
                if (!isNaN(key)) {
                    currentShift = parseInt(key);
                } else {

                    currentShift = alphabet.indexOf(key[j % key.length]);
                }

                let newIndex;
                if (isEncrypt) {
                    newIndex = (index + currentShift) % alphabet.length;
                } else {
                    newIndex = (index - currentShift + alphabet.length) % alphabet.length;
                }

                result += alphabet[newIndex];
                j++;
            }

        } else {

            let j = 0;

            processedText = text;

            for (let char of processedText) {
                const index = alphabet.indexOf(char);
                if (index === -1) continue;

                let currentShift;
                if (!isNaN(key)) {
                    currentShift = parseInt(key);
                } else {

                    currentShift = alphabet.indexOf(key[j % key.length]);
                }

                let newIndex;
                if (isEncrypt) {
                    newIndex = (index + currentShift) % alphabet.length;
                } else {
                    newIndex = (index - currentShift + alphabet.length) % alphabet.length;
                }

                result += alphabet[newIndex];
                j++;
            }

            result = inConvertingInTextMode(result);

        }

        return result;

    } else {

        // ТЕСТОВЫЙ РЕЖИМ
        processedText = text.replace(/\s/g, '').toLowerCase().replaceAll(',', 'зпт').replaceAll('.', 'тчк');

        let result = "";
        let key = String(shift).toLowerCase();
        let j = 0;

        for (let char of processedText) {
            const index = alphabet.indexOf(char);
            if (index === -1) continue;

            let currentShift;
            if (!isNaN(key)) {
                currentShift = parseInt(key);
            } else {

                currentShift = alphabet.indexOf(key[j % key.length]);
            }

            let newIndex;
            if (isEncrypt) {
                newIndex = (index + currentShift) % alphabet.length;
            } else {
                newIndex = (index - currentShift + alphabet.length) % alphabet.length;
            }

            result += alphabet[newIndex];
            j++;
        }

        return result;
    }
}

// 6. ВИЖЕНЕРА
function vizhener(text, isTextMode, isEncrypt, shift, vizhType) {

    let processedText = "";

    let keyString = String(shift);

    const alphabetMap = {
        'а': 0,
        'б': 1,
        'в': 2,
        'г': 3,
        'д': 4,
        'е': 5,
        'ж': 6,
        'з': 7,
        'и': 8,
        'й': 9,
        'к': 10,
        'л': 11,
        'м': 12,
        'н': 13,
        'о': 14,
        'п': 15,
        'р': 16,
        'с': 17,
        'т': 18,
        'у': 19,
        'ф': 20,
        'х': 21,
        'ц': 22,
        'ч': 23,
        'ш': 24,
        'щ': 25,
        'ъ': 26,
        'ы': 27,
        'ь': 28,
        'э': 29,
        'ю': 30,
        'я': 31
    };

    const numberMap = {
        0: 'а', 1: 'б', 2: 'в', 3: 'г', 4: 'д', 5: 'е', 6: 'ж', 7: 'з', 8: 'и',
        9: 'й', 10: 'к', 11: 'л', 12: 'м', 13: 'н', 14: 'о', 15: 'п', 16: 'р',
        17: 'с', 18: 'т', 19: 'у', 20: 'ф', 21: 'х', 22: 'ц', 23: 'ч', 24: 'ш',
        25: 'щ', 26: 'ъ', 27: 'ы', 28: 'ь', 29: 'э', 30: 'ю', 31: 'я',
    };

    if (isTextMode) {

        // ТЕКСТОВЫЙ РЕЖИМ
        let result = "";

        if (vizhType === "sm") {

            if (isEncrypt) {

                processedText = convertingInTextMode(text);
                key = keyString + processedText.slice(0, -1);

                for (let i = 0; i < processedText.length; i++) {
                    result += numberMap[(alphabetMap[processedText[i]] + alphabetMap[key[i]]) % 32];
                }

            } else {

                processedText = text;
                key = keyString + processedText.slice(0, -1);

                let param = alphabetMap[keyString];

                for (let i = 0; i < processedText.length; i++) {
                    if (alphabetMap[processedText[i]] - param < 0) {
                        result += numberMap[alphabetMap[processedText[i]] - param + 32];
                        param = alphabetMap[processedText[i]] - param + 32;
                    } else {
                        result += numberMap[alphabetMap[processedText[i]] - param];
                        param = alphabetMap[processedText[i]] - param;
                    }
                }

                result = inConvertingInTextMode(result);
            }

        } else {

            if (isEncrypt) {

                processedText = convertingInTextMode(text);

                let param = alphabetMap[keyString];

                for (let i = 0; i < processedText.length; i++) {
                    result += numberMap[(alphabetMap[processedText[i]] + param) % 32];
                    param = (alphabetMap[processedText[i]] + param) % 32;
                }

            } else {

                processedText = text;

                key = keyString + processedText.slice(0, -1);

                for (let i = 0; i < processedText.length; i++) {
                    if (alphabetMap[processedText[i]] - alphabetMap[key[i]] < 0) {
                        result += numberMap[alphabetMap[processedText[i]] - alphabetMap[key[i]] + 32];

                    } else {
                        result += numberMap[alphabetMap[processedText[i]] - alphabetMap[key[i]]];
                    }
                    console.log(result);
                }

                result = inConvertingInTextMode(result);
            }
        }

        return result;

    } else {

        // ТЕСТОВЫЙ РЕЖИМ
        processedText = text.replace(/\s/g, '').toLowerCase().replaceAll(',', 'зпт').replaceAll('.', 'тчк');

        let result = "";

        if (vizhType === "sm") {

            key = keyString + processedText.slice(0, -1);

            if (isEncrypt) {

                for (let i = 0; i < processedText.length; i++) {
                    result += numberMap[(alphabetMap[processedText[i]] + alphabetMap[key[i]]) % 32];
                }

            } else {

                let param = alphabetMap[keyString];

                for (let i = 0; i < processedText.length; i++) {
                    if (alphabetMap[processedText[i]] - param < 0) {
                        result += numberMap[alphabetMap[processedText[i]] - param + 32];
                        param = alphabetMap[processedText[i]] - param + 32;
                    } else {
                        result += numberMap[alphabetMap[processedText[i]] - param];
                        param = alphabetMap[processedText[i]] - param;
                    }
                }
            }

        } else {

            if (isEncrypt) {

                let param = alphabetMap[keyString];

                for (let i = 0; i < processedText.length; i++) {
                    result += numberMap[(alphabetMap[processedText[i]] + param) % 32];
                    param = (alphabetMap[processedText[i]] + param) % 32;
                }

            } else {

                key = keyString + processedText.slice(0, -1);

                for (let i = 0; i < processedText.length; i++) {
                    if (alphabetMap[processedText[i]] - alphabetMap[key[i]] < 0) {
                        result += numberMap[alphabetMap[processedText[i]] - alphabetMap[key[i]] + 32];

                    } else {
                        result += numberMap[alphabetMap[processedText[i]] - alphabetMap[key[i]]];
                    }
                    console.log(result);
                }
            }
        }

        return result;
    }

}

// t(fdb97531) = 2a196f34,
// t(2a196f34) = ebd9f03a,
// t(ebd9f03a) = b039bb3d,
// t(b039bb3d) = 68695433.

// 7. МАГМА
function magmat(text, isTextMode, isEncrypt) {
    // Таблица замен
    const pi = [
        [12, 4, 6, 2, 10, 5, 11, 9, 14, 8, 13, 7, 0, 3, 15, 1],
        [6, 8, 2, 3, 9, 10, 5, 12, 1, 14, 4, 7, 11, 13, 0, 15],
        [11, 3, 5, 8, 2, 15, 10, 13, 14, 1, 7, 4, 12, 9, 6, 0],
        [12, 8, 2, 1, 13, 4, 15, 6, 7, 0, 10, 5, 3, 14, 9, 11],
        [7, 15, 5, 10, 8, 1, 6, 13, 0, 9, 3, 14, 11, 4, 2, 12],
        [5, 13, 15, 6, 9, 2, 12, 10, 11, 7, 8, 1, 4, 3, 14, 0],
        [8, 14, 2, 5, 6, 9, 1, 12, 15, 4, 11, 0, 13, 10, 3, 7],
        [1, 7, 14, 13, 0, 5, 8, 3, 4, 15, 10, 6, 9, 12, 11, 2]
    ];

    if (isTextMode) {
        return "Для функции Магма (преобразование t) доступен только Тестовый режим (ввод HEX).";
    } else {
        // ТЕСТОВЫЙ РЕЖИМ

        // убираем пробелы и возможный префикс 0x
        let hexInput = text.trim().toLowerCase();
        if (hexInput.startsWith('0x')) {
            hexInput = hexInput.slice(2);
        }

        // Валидация
        if (hexInput.length !== 8 || !/^[0-9a-f]{8}$/.test(hexInput)) {
            return "Ошибка: Введите 32-битное число в HEX формате (ровно 8 символов, например: ffffffff)";
        }

        // Преобразование строки в число
        let x = parseInt(hexInput, 16);
        let y = 0;

        // Логика преобразования t
        for (let i = 7; i >= 0; i--) {

            let shiftAmount = i * 4;
            let j = (x >>> shiftAmount) & 0xF;

            // Берем значение из таблицы замены
            let s_value = pi[i][j];

            // Записываем результат в y
            y = (y << 4) | s_value;
        }

        let resultHex = (y >>> 0).toString(16).toUpperCase();

        // Дополняем нулями слева до 8 символов, если результат короткий
        while (resultHex.length < 8) {
            resultHex = "0" + resultHex;
        }

        return resultHex;
    }
}

// 8. МАТРИЧНЫЙ
function matrix(text, isTextMode, isEncrypt, shift, matrixSize, matrixParam) {

    if (getDeterminant(matrixParam) == 0) {
        return "Матрица не может быть ключом";
    }

    let processedText = "";

    const alphabetMap = {
        'а': 1,
        'б': 2,
        'в': 3,
        'г': 4,
        'д': 5,
        'е': 6,
        'ж': 7,
        'з': 8,
        'и': 9,
        'й': 10,
        'к': 11,
        'л': 12,
        'м': 13,
        'н': 14,
        'о': 15,
        'п': 16,
        'р': 17,
        'с': 18,
        'т': 19,
        'у': 20,
        'ф': 21,
        'х': 22,
        'ц': 23,
        'ч': 24,
        'ш': 25,
        'щ': 26,
        'ъ': 27,
        'ы': 28,
        'ь': 29,
        'э': 30,
        'ю': 31,
        'я': 32,
        '0': 0,
    };
    const reversedMap = {
        1: 'а', 2: 'б', 3: 'в', 4: 'г', 5: 'д', 6: 'е', 7: 'ж', 8: 'з', 9: 'и',
        10: 'й', 11: 'к', 12: 'л', 13: 'м', 14: 'н', 15: 'о', 16: 'п', 17: 'р',
        18: 'с', 19: 'т', 20: 'у', 21: 'ф', 22: 'х', 23: 'ц', 24: 'ч', 25: 'ш',
        26: 'щ', 27: 'ъ', 28: 'ы', 29: 'ь', 30: 'э', 31: 'ю', 32: 'я', 0: '',
    };

    if (isTextMode) {

        // ТЕКСТОВЫЙ РЕЖИМ
        let result = "";
        let arr = [];

        if (isEncrypt) {

            processedText = convertingInTextMode(text);

            let index = 0;

            while (processedText.length % matrixSize != 0) {
                processedText += "0";
            }

            while (index < processedText.length - matrixSize + 1) {

                for (let i = 0; i < matrixSize; i++) {

                    let sum = 0;

                    for (let j = 0; j < matrixSize; j++) {
                        sum += alphabetMap[processedText[index + j]] * matrixParam[i][j];
                    }

                    arr.push(sum);
                }

                index += matrixSize;
            }

            let maxNumber = Math.max(...arr);
            let maxNumberLength = maxNumber.toString().length;

            for (let numb of arr) {
                let item = numb.toString();
                while (item.length < maxNumberLength) {
                    item = "0" + item;
                }
                result += item;
            }

        } else {

            processedText = text;

            if (processedText.length % shift != 0) {
                return "Ошибка ввода ключа или текста";
            }

            let index = 0;
            let processedTextArr = splitStringToNumbers(processedText, shift);
            let invertMatrix = matrixInvert(matrixParam);

            while (index < processedTextArr.length - matrixSize + 1) {

                for (let i = 0; i < matrixSize; i++) {

                    let sum = 0;

                    for (let j = 0; j < matrixSize; j++) {
                        sum += processedTextArr[index + j] * invertMatrix[i][j];
                    }

                    arr.push(Math.round(sum));
                }

                index += matrixSize;
            }

            for (let numb of arr) {
                result += reversedMap[numb];
            }

            result = inConvertingInTextMode(result);
        }

        return result;

    } else {

        // ТЕСТОВЫЙ РЕЖИМ
        processedText = text.replace(/\s/g, '').toLowerCase().replaceAll(',', 'зпт').replaceAll('.', 'тчк');


        let result = "";
        let arr = [];

        if (isEncrypt) {

            let index = 0;

            while (processedText.length % matrixSize != 0) {
                processedText += "0";
            }

            while (index < processedText.length - matrixSize + 1) {

                for (let i = 0; i < matrixSize; i++) {

                    let sum = 0;

                    for (let j = 0; j < matrixSize; j++) {
                        sum += alphabetMap[processedText[index + j]] * matrixParam[i][j];
                    }

                    arr.push(sum);
                }

                index += matrixSize;
            }

            let maxNumber = Math.max(...arr);
            let maxNumberLength = maxNumber.toString().length;

            for (let numb of arr) {
                let item = numb.toString();
                while (item.length < maxNumberLength) {
                    item = "0" + item;
                }
                result += item;
            }

        } else {

            if (processedText.length % shift != 0) {
                return "Ошибка ввода ключа или текста";
            }

            let index = 0;
            let processedTextArr = splitStringToNumbers(processedText, shift);
            let invertMatrix = matrixInvert(matrixParam);

            while (index < processedTextArr.length - matrixSize + 1) {

                for (let i = 0; i < matrixSize; i++) {

                    let sum = 0;

                    for (let j = 0; j < matrixSize; j++) {
                        sum += processedTextArr[index + j] * invertMatrix[i][j];
                    }

                    arr.push(Math.round(sum));
                }

                index += matrixSize;
            }

            for (let numb of arr) {
                result += reversedMap[numb];
            }
        }

        return result;
    }
}

// 9. ПЛЭЙФЕРА - не реализован тектовый режим
function playfer(text, isTextMode, isEncrypt, shift) {

    const alphabetChange = {
        'а': 'а',
        'б': 'б',
        'в': 'в',
        'г': 'г',
        'д': 'д',
        'е': 'е',
        'ё': 'е',
        'ж': 'ж',
        'з': 'з',
        'и': 'и',
        'й': 'и',
        'к': 'к',
        'л': 'л',
        'м': 'м',
        'н': 'н',
        'о': 'о',
        'п': 'п',
        'р': 'р',
        'с': 'с',
        'т': 'т',
        'у': 'у',
        'ф': 'ф',
        'х': 'х',
        'ц': 'ц',
        'ч': 'ч',
        'ш': 'ш',
        'щ': 'щ',
        'ъ': 'ь',
        'ы': 'ы',
        'ь': 'ь',
        'э': 'э',
        'ю': 'ю',
        'я': 'я',
    }

    shift = replaceLetters(shift, alphabetChange);


    if (!hasUniqueLetters(shift)) {
        return "Неправильный лозунг!"
    }

    //shift = removeDuplicateLetters(shift);

    let processedText = "";
    const alphabet = "абвгдежзиклмнопрстуфхцчшщьыэюя"

    if (isTextMode) {

        //ТЕКСТОВЫЙ РЕЖИМ

    } else {

        //ТЕСТОВЫЙ РЕЖИМ
        processedText = text.replace(/\s/g, '').toLowerCase().replaceAll(',', 'зпт').replaceAll('.', 'тчк');
        processedText = replaceLetters(processedText, alphabetChange);

        let result = "";
        let mainString = "";

        mainString = removeLettersFromString(shift, alphabet);
        mainString = shift + mainString;
        losungArr = [];
        let index = 0;
        for (let i = 0; i < 5; i++) {
            losungArr[i] = [];
            for (let j = 0; j < 6; j++) {
                losungArr[i].push(mainString[index]);
                index++;
            }
        }

        if (isEncrypt) {

            processedText = prepareText(processedText);

            for (let count = 0; count < processedText.length - 1;) {

                let a1 = findElementIndex(losungArr, processedText[count]);
                let a2 = findElementIndex(losungArr, processedText[count + 1]);

                if (a1['row'] == a2['row']) {
                    result += (losungArr[a1['row']][(a1['col'] + 1) % 6] + losungArr[a2['row']][(a2['col'] + 1) % 6]);
                } else if (a1['col'] == a2['col']) {
                    result += (losungArr[(a1['row'] + 1) % 5][a1['col']] + losungArr[(a2['row'] + 1) % 5][a2['col']]);
                } else {
                    result += (losungArr[a1['row']][a2['col']] + losungArr[a2['row']][a1['col']]);
                }

                count += 2;
            }

        } else {
            for (let count = 0; count < processedText.length - 1;) {

                let a1 = findElementIndex(losungArr, processedText[count]);
                let a2 = findElementIndex(losungArr, processedText[count + 1]);

                if (a1['row'] == a2['row']) {
                    if (a1['col'] - 1 < 0) {
                        result += (losungArr[a1['row']][a1['col'] + 5] + losungArr[a2['row']][a2['col'] - 1]);
                    } else if (a2['col'] - 1 < 0) {
                        result += (losungArr[a1['row']][a1['col'] - 1] + losungArr[a2['row']][a2['col'] + 5]);
                    } else {
                        result += (losungArr[a1['row']][a1['col'] - 1] + losungArr[a2['row']][a2['col'] - 1]);
                    }
                } else if (a1['col'] == a2['col']) {
                    if (a1['row'] - 1 < 0) {
                        result += (losungArr[a1['row'] + 4][a1['col']] + losungArr[a2['row'] - 1][a2['col']]);
                    } else if (a2['row'] - 1 < 0) {
                        result += (losungArr[a1['row'] - 1][a1['col']] + losungArr[a2['row'] + 4][a2['col']]);
                    } else {
                        result += (losungArr[a1['row'] - 1][a1['col']] + losungArr[a2['row'] - 1][a2['col']]);
                    }
                } else {
                    result += (losungArr[a1['row']][a2['col']] + losungArr[a2['row']][a1['col']]);
                }

                count += 2;
            }
        }

        return result;
    }
}

// 10. ВЕРТИКАЛЬНАЯ
function vertical(text, isTextMode, isEncrypt, shift) {

    let processedText = "";

    if (isTextMode) {

        //TEXT MODE
        let result = '';

        if (isEncrypt) {

            processedText = convertingInTextMode(text);

            let mapArr = [];
            let index = 0;

            for (let i = 0; i < Math.floor(processedText.length / shift.length) + 1; i++) {
                mapArr[i] = [];
                for (let j = 0; j < shift.length; j++) {
                    mapArr[i].push(processedText[index]);
                    index++;
                }
            }

            let verArr = mapArr.filter(row => row[0] !== undefined);

            verArr = replaceUndefinedIn2DArray(verArr);

            console.log(verArr);

            let key = replaceLettersWithNumbers(shift);

            console.log(key);

            result = rearrangeColumnsByArray(verArr, key);

        } else {

            processedText = text;

            let key = replaceLettersWithNumbers(shift);

            let longColumn = processedText.length % shift.length;

            let rowCount = Math.floor(processedText.length / shift.length) + 1;
            let mapArr = createEmpty2DArray(rowCount, shift.length);

            let index = 0;
            let count = 0;

            for (let j = 1; j < (shift.length + 1); j++) {

                index = key.indexOf(j);

                if (index < longColumn) {

                    for (let i = 0; i < rowCount; i++) {

                        mapArr[i][index] = processedText[count];
                        count += 1;
                    }

                } else {

                    for (let i = 0; i < rowCount - 1; i++) {
                        mapArr[i][index] = processedText[count];
                        count += 1;
                    }
                }

            }

            result = mapArr.flat().join('');

            result = inConvertingInTextMode(result);
        }

        return result;

    } else {

        //TEST MODE
        processedText = text.replace(/\s/g, '').toLowerCase().replaceAll(',', 'зпт').replaceAll('.', 'тчк');

        let result = '';

        if (processedText.length < shift.length) {
            return "Измените текст или ключ";
        }

        if (isEncrypt) {

            let mapArr = [];
            let index = 0;

            for (let i = 0; i < Math.floor(processedText.length / shift.length) + 1; i++) {
                mapArr[i] = [];
                for (let j = 0; j < shift.length; j++) {
                    mapArr[i].push(processedText[index]);
                    index++;
                }
            }

            let verArr = mapArr.filter(row => row[0] !== undefined);

            verArr = replaceUndefinedIn2DArray(verArr);

            console.log(verArr);

            let key = replaceLettersWithNumbers(shift);

            console.log(key);

            result = rearrangeColumnsByArray(verArr, key);

        } else {

            let key = replaceLettersWithNumbers(shift);

            let longColumn = processedText.length % shift.length;

            let rowCount = Math.floor(processedText.length / shift.length) + 1;
            let mapArr = createEmpty2DArray(rowCount, shift.length);

            let index = 0;
            let count = 0;

            for (let j = 1; j < (shift.length + 1); j++) {

                index = key.indexOf(j);

                if (index < longColumn) {

                    for (let i = 0; i < rowCount; i++) {

                        mapArr[i][index] = processedText[count];
                        count += 1;
                    }

                } else {

                    for (let i = 0; i < rowCount - 1; i++) {
                        mapArr[i][index] = processedText[count];
                        count += 1;
                    }
                }

            }

            result = mapArr.flat().join('');
        }

        return result;

    }


}

// 11. КАРДАНО
function cardano(text, isTextMode, isEncrypt, cardanoArray) {

    let processedText = "";

    const [
        [a1, b1], [a2, b2], [a3, b3], [a4, b4], [a5, b5],
        [a6, b6], [a7, b7], [a8, b8], [a9, b9], [a10, b10],
        [a11, b11], [a12, b12], [a13, b13], [a14, b14], [a15, b15]
    ] = cardanoArray;

    if (isTextMode) {

        //text
        let cardanoArr = createEmpty2DArray(6, 10);
        let result = '';

        if (isEncrypt) {

            processedText = convertingInTextMode(text);
            processedText = replaceYoWithE(processedText);
            processedText = padStringWithRandomLetters(processedText);

            let count = 0;

            for (let i = 0; i < processedText.length; i += 60) {

                const chunk = processedText.slice(i, i + 60);

                cardanoArr[a1][b1] = chunk[count];
                count++;

                cardanoArr[a2][b2] = chunk[count];
                count++;

                cardanoArr[a3][b3] = chunk[count];
                count++;

                cardanoArr[a4][b4] = chunk[count];
                count++;

                cardanoArr[a5][b5] = chunk[count];
                count++;

                cardanoArr[a6][b6] = chunk[count];
                count++;

                cardanoArr[a7][b7] = chunk[count];
                count++;

                cardanoArr[a8][b8] = chunk[count];
                count++;

                cardanoArr[a9][b9] = chunk[count];
                count++;

                cardanoArr[a10][b10] = chunk[count];
                count++;

                cardanoArr[a11][b11] = chunk[count];
                count++;

                cardanoArr[a12][b12] = chunk[count];
                count++;

                cardanoArr[a13][b13] = chunk[count];
                count++;

                cardanoArr[a14][b14] = chunk[count];
                count++;

                cardanoArr[a15][b15] = chunk[count];
                count++;

                //1 поворот

                cardanoArr[a1][9 - b1] = chunk[count];
                count++;

                cardanoArr[a2][9 - b2] = chunk[count];
                count++;

                cardanoArr[a3][9 - b3] = chunk[count];
                count++;

                cardanoArr[a4][9 - b4] = chunk[count];
                count++;

                cardanoArr[a5][9 - b5] = chunk[count];
                count++;

                cardanoArr[a6][9 - b6] = chunk[count];
                count++;

                cardanoArr[a7][9 - b7] = chunk[count];
                count++;

                cardanoArr[a8][9 - b8] = chunk[count];
                count++;

                cardanoArr[a9][9 - b9] = chunk[count];
                count++;

                cardanoArr[a10][9 - b10] = chunk[count];
                count++;

                cardanoArr[a11][9 - b11] = chunk[count];
                count++;

                cardanoArr[a12][9 - b12] = chunk[count];
                count++;

                cardanoArr[a13][9 - b13] = chunk[count];
                count++;

                cardanoArr[a14][9 - b14] = chunk[count];;
                count++;

                cardanoArr[a15][9 - b15] = chunk[count];
                count++;

                //2 поворот

                cardanoArr[5 - a1][9 - b1] = chunk[count];
                count++;

                cardanoArr[5 - a2][9 - b2] = chunk[count];
                count++;

                cardanoArr[5 - a3][9 - b3] = chunk[count];
                count++;

                cardanoArr[5 - a4][9 - b4] = chunk[count];
                count++;

                cardanoArr[5 - a5][9 - b5] = chunk[count];
                count++;

                cardanoArr[5 - a6][9 - b6] = chunk[count];
                count++;

                cardanoArr[5 - a7][9 - b7] = chunk[count];
                count++;

                cardanoArr[5 - a8][9 - b8] = chunk[count];
                count++;

                cardanoArr[5 - a9][9 - b9] = chunk[count];
                count++;

                cardanoArr[5 - a10][9 - b10] = chunk[count];
                count++;

                cardanoArr[5 - a11][9 - b11] = chunk[count];
                count++;

                cardanoArr[5 - a12][9 - b12] = chunk[count];
                count++;

                cardanoArr[5 - a13][9 - b13] = chunk[count];
                count++;

                cardanoArr[5 - a14][9 - b14] = chunk[count];
                count++;

                cardanoArr[5 - a15][9 - b15] = chunk[count];
                count++;

                //3 поворот

                cardanoArr[5 - a1][b1] = chunk[count];
                count++;

                cardanoArr[5 - a2][b2] = chunk[count];
                count++;

                cardanoArr[5 - a3][b3] = chunk[count];
                count++;

                cardanoArr[5 - a4][b4] = chunk[count];
                count++;

                cardanoArr[5 - a5][b5] = chunk[count];
                count++;

                cardanoArr[5 - a6][b6] = chunk[count];
                count++;

                cardanoArr[5 - a7][b7] = chunk[count];
                count++;

                cardanoArr[5 - a8][b8] = chunk[count];
                count++;

                cardanoArr[5 - a9][b9] = chunk[count];
                count++;

                cardanoArr[5 - a10][b10] = chunk[count];
                count++;

                cardanoArr[5 - a11][b11] = chunk[count];
                count++;

                cardanoArr[5 - a12][b12] = chunk[count];
                count++;

                cardanoArr[5 - a13][b13] = chunk[count];
                count++;

                cardanoArr[5 - a14][b14] = chunk[count];
                count++;

                cardanoArr[5 - a15][b15] = chunk[count];
                count++;

                result += cardanoArr.flat().join('');

                if (count == 60) {
                    count = 0;
                }
            }

        } else {

            processedText = text;

            for (let i = 0; i < processedText.length; i += 60) {

                const chunk = processedText.slice(i, i + 60);
                cardanoArr = fillArrayWithString(chunk, 6, 10);
                result += cardanoArr[a1][b1];
                result += cardanoArr[a2][b2];
                result += cardanoArr[a3][b3];
                result += cardanoArr[a4][b4];
                result += cardanoArr[a5][b5];
                result += cardanoArr[a6][b6];
                result += cardanoArr[a7][b7];
                result += cardanoArr[a8][b8];
                result += cardanoArr[a9][b9];
                result += cardanoArr[a10][b10];
                result += cardanoArr[a11][b11];
                result += cardanoArr[a12][b12];
                result += cardanoArr[a13][b13];
                result += cardanoArr[a14][b14];
                result += cardanoArr[a15][b15];
                //1 поворот
                result += cardanoArr[a1][9 - b1];
                result += cardanoArr[a2][9 - b2];
                result += cardanoArr[a3][9 - b3];
                result += cardanoArr[a4][9 - b4];
                result += cardanoArr[a5][9 - b5];
                result += cardanoArr[a6][9 - b6];
                result += cardanoArr[a7][9 - b7];
                result += cardanoArr[a8][9 - b8];
                result += cardanoArr[a9][9 - b9];
                result += cardanoArr[a10][9 - b10];
                result += cardanoArr[a11][9 - b11];
                result += cardanoArr[a12][9 - b12];
                result += cardanoArr[a13][9 - b13];
                result += cardanoArr[a14][9 - b14];
                result += cardanoArr[a15][9 - b15];
                //2 поворот
                result += cardanoArr[5 - a1][9 - b1];
                result += cardanoArr[5 - a2][9 - b2];
                result += cardanoArr[5 - a3][9 - b3];
                result += cardanoArr[5 - a4][9 - b4];
                result += cardanoArr[5 - a5][9 - b5];
                result += cardanoArr[5 - a6][9 - b6];
                result += cardanoArr[5 - a7][9 - b7];
                result += cardanoArr[5 - a8][9 - b8];
                result += cardanoArr[5 - a9][9 - b9];
                result += cardanoArr[5 - a10][9 - b10];
                result += cardanoArr[5 - a11][9 - b11];
                result += cardanoArr[5 - a12][9 - b12];
                result += cardanoArr[5 - a13][9 - b13];
                result += cardanoArr[5 - a14][9 - b14];
                result += cardanoArr[5 - a15][9 - b15];
                //3 поворот
                result += cardanoArr[5 - a1][b1];
                result += cardanoArr[5 - a2][b2];
                result += cardanoArr[5 - a3][b3];
                result += cardanoArr[5 - a4][b4];
                result += cardanoArr[5 - a5][b5];
                result += cardanoArr[5 - a6][b6];
                result += cardanoArr[5 - a7][b7];
                result += cardanoArr[5 - a8][b8];
                result += cardanoArr[5 - a9][b9];
                result += cardanoArr[5 - a10][b10];
                result += cardanoArr[5 - a11][b11];
                result += cardanoArr[5 - a12][b12];
                result += cardanoArr[5 - a13][b13];
                result += cardanoArr[5 - a14][b14];
                result += cardanoArr[5 - a15][b15];
            }

            result = removeAfterYo(result);

            result = inConvertingInTextMode(result);
        }

        return result;

    } else {

        //test
        processedText = text.replace(/\s/g, '').toLowerCase().replaceAll(',', 'зпт').replaceAll('.', 'тчк');

        let cardanoArr = createEmpty2DArray(6, 10);
        let result = '';

        if (isEncrypt) {

            processedText = replaceYoWithE(processedText);

            processedText = padStringWithRandomLetters(processedText);

            let count = 0;

            for (let i = 0; i < processedText.length; i += 60) {

                const chunk = processedText.slice(i, i + 60);

                cardanoArr[a1][b1] = chunk[count];
                count++;

                cardanoArr[a2][b2] = chunk[count];
                count++;

                cardanoArr[a3][b3] = chunk[count];
                count++;

                cardanoArr[a4][b4] = chunk[count];
                count++;

                cardanoArr[a5][b5] = chunk[count];
                count++;

                cardanoArr[a6][b6] = chunk[count];
                count++;

                cardanoArr[a7][b7] = chunk[count];
                count++;

                cardanoArr[a8][b8] = chunk[count];
                count++;

                cardanoArr[a9][b9] = chunk[count];
                count++;

                cardanoArr[a10][b10] = chunk[count];
                count++;

                cardanoArr[a11][b11] = chunk[count];
                count++;

                cardanoArr[a12][b12] = chunk[count];
                count++;

                cardanoArr[a13][b13] = chunk[count];
                count++;

                cardanoArr[a14][b14] = chunk[count];
                count++;

                cardanoArr[a15][b15] = chunk[count];
                count++;

                //1 поворот

                cardanoArr[a1][9 - b1] = chunk[count];
                count++;

                cardanoArr[a2][9 - b2] = chunk[count];
                count++;

                cardanoArr[a3][9 - b3] = chunk[count];
                count++;

                cardanoArr[a4][9 - b4] = chunk[count];
                count++;

                cardanoArr[a5][9 - b5] = chunk[count];
                count++;

                cardanoArr[a6][9 - b6] = chunk[count];
                count++;

                cardanoArr[a7][9 - b7] = chunk[count];
                count++;

                cardanoArr[a8][9 - b8] = chunk[count];
                count++;

                cardanoArr[a9][9 - b9] = chunk[count];
                count++;

                cardanoArr[a10][9 - b10] = chunk[count];
                count++;

                cardanoArr[a11][9 - b11] = chunk[count];
                count++;

                cardanoArr[a12][9 - b12] = chunk[count];
                count++;

                cardanoArr[a13][9 - b13] = chunk[count];
                count++;

                cardanoArr[a14][9 - b14] = chunk[count];;
                count++;

                cardanoArr[a15][9 - b15] = chunk[count];
                count++;

                //2 поворот

                cardanoArr[5 - a1][9 - b1] = chunk[count];
                count++;

                cardanoArr[5 - a2][9 - b2] = chunk[count];
                count++;

                cardanoArr[5 - a3][9 - b3] = chunk[count];
                count++;

                cardanoArr[5 - a4][9 - b4] = chunk[count];
                count++;

                cardanoArr[5 - a5][9 - b5] = chunk[count];
                count++;

                cardanoArr[5 - a6][9 - b6] = chunk[count];
                count++;

                cardanoArr[5 - a7][9 - b7] = chunk[count];
                count++;

                cardanoArr[5 - a8][9 - b8] = chunk[count];
                count++;

                cardanoArr[5 - a9][9 - b9] = chunk[count];
                count++;

                cardanoArr[5 - a10][9 - b10] = chunk[count];
                count++;

                cardanoArr[5 - a11][9 - b11] = chunk[count];
                count++;

                cardanoArr[5 - a12][9 - b12] = chunk[count];
                count++;

                cardanoArr[5 - a13][9 - b13] = chunk[count];
                count++;

                cardanoArr[5 - a14][9 - b14] = chunk[count];
                count++;

                cardanoArr[5 - a15][9 - b15] = chunk[count];
                count++;

                //3 поворот

                cardanoArr[5 - a1][b1] = chunk[count];
                count++;

                cardanoArr[5 - a2][b2] = chunk[count];
                count++;

                cardanoArr[5 - a3][b3] = chunk[count];
                count++;

                cardanoArr[5 - a4][b4] = chunk[count];
                count++;

                cardanoArr[5 - a5][b5] = chunk[count];
                count++;

                cardanoArr[5 - a6][b6] = chunk[count];
                count++;

                cardanoArr[5 - a7][b7] = chunk[count];
                count++;

                cardanoArr[5 - a8][b8] = chunk[count];
                count++;

                cardanoArr[5 - a9][b9] = chunk[count];
                count++;

                cardanoArr[5 - a10][b10] = chunk[count];
                count++;

                cardanoArr[5 - a11][b11] = chunk[count];
                count++;

                cardanoArr[5 - a12][b12] = chunk[count];
                count++;

                cardanoArr[5 - a13][b13] = chunk[count];
                count++;

                cardanoArr[5 - a14][b14] = chunk[count];
                count++;

                cardanoArr[5 - a15][b15] = chunk[count];
                count++;

                console.log(cardanoArr);

                result += cardanoArr.flat().join('');

                if (count == 60) {
                    count = 0;
                }
            }

        } else {

            for (let i = 0; i < processedText.length; i += 60) {

                const chunk = processedText.slice(i, i + 60);
                cardanoArr = fillArrayWithString(chunk, 6, 10);
                result += cardanoArr[a1][b1];
                result += cardanoArr[a2][b2];
                result += cardanoArr[a3][b3];
                result += cardanoArr[a4][b4];
                result += cardanoArr[a5][b5];
                result += cardanoArr[a6][b6];
                result += cardanoArr[a7][b7];
                result += cardanoArr[a8][b8];
                result += cardanoArr[a9][b9];
                result += cardanoArr[a10][b10];
                result += cardanoArr[a11][b11];
                result += cardanoArr[a12][b12];
                result += cardanoArr[a13][b13];
                result += cardanoArr[a14][b14];
                result += cardanoArr[a15][b15];
                //1 поворот
                result += cardanoArr[a1][9 - b1];
                result += cardanoArr[a2][9 - b2];
                result += cardanoArr[a3][9 - b3];
                result += cardanoArr[a4][9 - b4];
                result += cardanoArr[a5][9 - b5];
                result += cardanoArr[a6][9 - b6];
                result += cardanoArr[a7][9 - b7];
                result += cardanoArr[a8][9 - b8];
                result += cardanoArr[a9][9 - b9];
                result += cardanoArr[a10][9 - b10];
                result += cardanoArr[a11][9 - b11];
                result += cardanoArr[a12][9 - b12];
                result += cardanoArr[a13][9 - b13];
                result += cardanoArr[a14][9 - b14];
                result += cardanoArr[a15][9 - b15];
                //2 поворот
                result += cardanoArr[5 - a1][9 - b1];
                result += cardanoArr[5 - a2][9 - b2];
                result += cardanoArr[5 - a3][9 - b3];
                result += cardanoArr[5 - a4][9 - b4];
                result += cardanoArr[5 - a5][9 - b5];
                result += cardanoArr[5 - a6][9 - b6];
                result += cardanoArr[5 - a7][9 - b7];
                result += cardanoArr[5 - a8][9 - b8];
                result += cardanoArr[5 - a9][9 - b9];
                result += cardanoArr[5 - a10][9 - b10];
                result += cardanoArr[5 - a11][9 - b11];
                result += cardanoArr[5 - a12][9 - b12];
                result += cardanoArr[5 - a13][9 - b13];
                result += cardanoArr[5 - a14][9 - b14];
                result += cardanoArr[5 - a15][9 - b15];
                //3 поворот
                result += cardanoArr[5 - a1][b1];
                result += cardanoArr[5 - a2][b2];
                result += cardanoArr[5 - a3][b3];
                result += cardanoArr[5 - a4][b4];
                result += cardanoArr[5 - a5][b5];
                result += cardanoArr[5 - a6][b6];
                result += cardanoArr[5 - a7][b7];
                result += cardanoArr[5 - a8][b8];
                result += cardanoArr[5 - a9][b9];
                result += cardanoArr[5 - a10][b10];
                result += cardanoArr[5 - a11][b11];
                result += cardanoArr[5 - a12][b12];
                result += cardanoArr[5 - a13][b13];
                result += cardanoArr[5 - a14][b14];
                result += cardanoArr[5 - a15][b15];
            }

            result = removeAfterYo(result);
        }

        return result;
    }
}

// 12. СЕТЬ ФЕЙСТЕЛЯ
function phestel(text, isEncrypt, shift) {
    // Таблица замен (S-блоки по ГОСТ)
    const pi = [
        [12, 4, 6, 2, 10, 5, 11, 9, 14, 8, 13, 7, 0, 3, 15, 1],
        [6, 8, 2, 3, 9, 10, 5, 12, 1, 14, 4, 7, 11, 13, 0, 15],
        [11, 3, 5, 8, 2, 15, 10, 13, 14, 1, 7, 4, 12, 9, 6, 0],
        [12, 8, 2, 1, 13, 4, 15, 6, 7, 0, 10, 5, 3, 14, 9, 11],
        [7, 15, 5, 10, 8, 1, 6, 13, 0, 9, 3, 14, 11, 4, 2, 12],
        [5, 13, 15, 6, 9, 2, 12, 10, 11, 7, 8, 1, 4, 3, 14, 0],
        [8, 14, 2, 5, 6, 9, 1, 12, 15, 4, 11, 0, 13, 10, 3, 7],
        [1, 7, 14, 13, 0, 5, 8, 3, 4, 15, 10, 6, 9, 12, 11, 2]
    ];

    let hexInput = text.trim().toLowerCase().replace(/^0x/, '');
    let keyHex = shift.trim().toLowerCase().replace(/^0x/, '');

    // Валидация
    if (hexInput.length !== 16 || !/^[0-9a-f]{16}$/.test(hexInput)) {
        return "Ошибка: Текст должен быть 64-битным числом в HEX (ровно 16 символов, например: fedcba9876543210)";
    }
    if (keyHex.length !== 64 || !/^[0-9a-f]{64}$/.test(keyHex)) {
        return "Ошибка: Ключ должен быть 256-битным числом в HEX (ровно 64 символа)";
    }

    // Разбиваем 64-битный блок на левую и правую половины по 32 бита
    let a1 = parseInt(hexInput.slice(0, 8), 16);
    let a0 = parseInt(hexInput.slice(8, 16), 16);

    // Разбиваем 256-битный ключ на 8 подключей по 32 бита
    let keys = [];
    for (let i = 0; i < 8; i++) {
        keys.push(parseInt(keyHex.slice(i * 8, (i + 1) * 8), 16));
    }

    let roundKeys = [];
    if (isEncrypt) {
        // Шифрование
        for (let i = 0; i < 24; i++) roundKeys.push(keys[i % 8]);
        for (let i = 0; i < 8; i++) roundKeys.push(keys[7 - i]);
    } else {
        // Расшифрование
        for (let i = 0; i < 24; i++) roundKeys.push(keys[7 - (i % 8)]);
        for (let i = 0; i < 8; i++) roundKeys.push(keys[i]);
    }

    // Выполнение 32 раундов сети Фейстеля
    for (let r = 0; r < 32; r++) {
        let k = roundKeys[r];

        // Сложение правой части и раундового ключа по модулю 2^32
        let sum = (a0 + k) >>> 0;

        // логика t-преобразования (S-блоки)
        let y = 0;
        for (let i = 7; i >= 0; i--) {
            let shiftAmount = i * 4;
            let j = (sum >>> shiftAmount) & 0xF;
            let s_value = pi[i][j];
            y = (y << 4) | s_value;
        }
        y = (y >>> 0);

        // Циклический сдвиг влево на 11 бит
        let fResult = ((y << 11) | (y >>> 21)) >>> 0;

        // Логика Сети Фейстеля
        if (r < 31) {
            // меняем половины местами
            let next_a1 = a0;
            let next_a0 = (a1 ^ fResult) >>> 0;
            a1 = next_a1;
            a0 = next_a0;
        } else {
            // 32-й раунд
            let next_a1 = (a1 ^ fResult) >>> 0;
            let next_a0 = a0;
            a1 = next_a1;
            a0 = next_a0;
        }
    }

    // Склеиваем результат и форматируем в HEX
    let leftHex = a1.toString(16).padStart(8, '0');
    let rightHex = a0.toString(16).padStart(8, '0');

    return (leftHex + rightHex).toUpperCase();
}

//13. ШЕННОН ГАММИРОВНАИЕ
function shenonGamma(text, isTextMode, isEncrypt, shift, constA, constC, shenonMode) {

    // constA, constC - константы для генерации гаммы
    // shenonMode - 'bits' или 'chars'

    constA = Number(constA);
    constC = Number(constC);
    shift = Number(shift);

    let processedText = "";

    const rAlphabet = {
        а: 1, б: 2, в: 3, г: 4, д: 5, е: 6, ж: 7, з: 8, и: 9, й: 10,
        к: 11, л: 12, м: 13, н: 14, о: 15, п: 16, р: 17, с: 18, т: 19,
        у: 20, ф: 21, х: 22, ц: 23, ч: 24, ш: 25, щ: 26, ъ: 27, ы: 28,
        ь: 29, э: 30, ю: 31, я: 32
    };

    const rInvAlphabet = {
        1: 'а', 2: 'б', 3: 'в', 4: 'г', 5: 'д', 6: 'е', 7: 'ж', 8: 'з',
        9: 'и', 10: 'й', 11: 'к', 12: 'л', 13: 'м', 14: 'н', 15: 'о',
        16: 'п', 17: 'р', 18: 'с', 19: 'т', 20: 'у', 21: 'ф', 22: 'х',
        23: 'ц', 24: 'ч', 25: 'ш', 26: 'щ', 27: 'ъ', 28: 'ы', 29: 'ь',
        30: 'э', 31: 'ю', 0: 'я'
    };

    if (isTextMode) {

        //text
        let result = '';

        if (shenonMode === 'chars') {
            // СИМВОЛЬНОЕ ШИФРОВАНИЕ

            if (isEncrypt) {

                // Шифрование
                processedText = convertingInTextMode(text);

                let resultArr = [];
                let arrGamma = gammaForShenonLenN(constA, constC, processedText.length, shift);

                for (let i = 0; i < processedText.length; ++i) {
                    resultArr.push((rAlphabet[processedText[i]] + arrGamma[i]) % 32);
                }
                console.log('Зашифрованные индексы:', resultArr);

                for (let i = 0; i < processedText.length; ++i) {
                    result += rInvAlphabet[resultArr[i]];
                }

            } else {

                processedText = text;

                // Расшифрование
                let resultArr = [];
                let arrGamma = gammaForShenonLenN(constA, constC, processedText.length, shift);

                for (let i = 0; i < processedText.length; ++i) {
                    let encryptedIndex = rAlphabet[processedText[i]];
                    let decryptedIndex = (encryptedIndex - arrGamma[i] + 32) % 32;
                    resultArr.push(decryptedIndex);
                }
                console.log('Расшифрованные индексы:', resultArr);

                for (let i = 0; i < processedText.length; ++i) {
                    result += rInvAlphabet[resultArr[i]];
                }

                result = inConvertingInTextMode(result);
            }

        } else if (shenonMode === 'bits') {


        }

        return result;

    } else {

        //test
        processedText = text.replace(/\s/g, '').toLowerCase().replaceAll(',', 'зпт').replaceAll('.', 'тчк');

        let result = '';

        if (shenonMode === 'chars') {
            // СИМВОЛЬНОЕ ШИФРОВАНИЕ
            let resultArr = [];
            let arrGamma = gammaForShenonLenN(constA, constC, processedText.length, shift);

            if (isEncrypt) {
                // Шифрование
                for (let i = 0; i < processedText.length; ++i) {
                    resultArr.push((rAlphabet[processedText[i]] + arrGamma[i]) % 32);
                }
                console.log('Зашифрованные индексы:', resultArr);

                for (let i = 0; i < processedText.length; ++i) {
                    result += rInvAlphabet[resultArr[i]];
                }

            } else {
                // Расшифрование
                for (let i = 0; i < processedText.length; ++i) {
                    let encryptedIndex = rAlphabet[processedText[i]];
                    let decryptedIndex = (encryptedIndex - arrGamma[i] + 32) % 32;
                    resultArr.push(decryptedIndex);
                }
                console.log('Расшифрованные индексы:', resultArr);

                for (let i = 0; i < processedText.length; ++i) {
                    result += rInvAlphabet[resultArr[i]];
                }
            }

        } else if (shenonMode === 'bits') {


        }

        return result;
    }
}

// --- ПРИМЕР ИСПОЛЬЗОВАНИЯ ---
// let key = "ffeeddccbbaa99887766554433221100f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff";
// let iv = "12345678"; // Начальный счетчик
// 92def06b3c130a59db54c704f8189d204a98fb2e67a8024c8912409b17b57e41

//14. МАГМА ГАММИРОВНАИЕ
function magmaGamma(plaintext, key, iv) {

    iv = String(iv).padEnd(16, 0);
    console.log(iv);
    let blocks = [];
    // Разбиваем текст на блоки по 64 бита
    for (let i = 0; i < plaintext.length; i += 16) {
        blocks.push(plaintext.slice(i, i + 16));
    }

    let ciphertext = "";
    let ctr = iv;

    for (let i = 0; i < blocks.length; i++) {
        // Зашифровываем текущее значение счетчика базовым алгоритмом

        let gamma = phestel(ctr, true, key);
        // Если последний блок неполный, обрезаем гамму
        let currentBlock = blocks[i];
        let currentGamma = gamma.slice(0, currentBlock.length);

        // Складываем блок текста с гаммой (XOR)
        ciphertext += xorHex(currentBlock, currentGamma);

        // Вычисляем следующее значение счетчика CTR_{i+1} = Inc(CTR_i)
        ctr = incrementCounter(ctr);
    }

    return ciphertext;
}

// Расшифрование в режиме гаммирования идентично зашифрованию
function UnencryptCTR(text, key) {
    return encryptCTR(text, key);
}

//Параметры для а5/1
//K = 9223372036854775807n
//f = 12345

//15. А5/1
function a51(text, isTextMode, isEncrypt, key, cadr) {

    let processedText = "";

    if (isTextMode) {

        processedText = convertingInTextMode(text);

    } else {

        processedText = text.replace(/\s/g, '').toLowerCase().replaceAll(',', 'зпт').replaceAll('.', 'тчк');

    }

    let inputBits = textToBits(processedText);
    let outputBits = [];

    const clock = (reg, feedback, inputBit = 0) => {

        let newBit = feedback ^ inputBit;

        reg.unshift(newBit);

        return reg.pop();
    };

    for (let frameStart = 0; frameStart < inputBits.length; frameStart += 114) {

        let r1 = new Array(19).fill(0);
        let r2 = new Array(22).fill(0);
        let r3 = new Array(23).fill(0);

        const getFb1 = () => r1[18] ^ r1[17] ^ r1[16] ^ r1[13];
        const getFb2 = () => r2[21] ^ r2[20];
        const getFb3 = () => r3[22] ^ r3[21] ^ r3[20] ^ r3[7];

        let currentCadr = (cadr + Math.floor(frameStart / 114)) % 4194304;

        // ЭТАП 1
        for (let i = 0; i < 64; i++) {

            let bit = (key >> BigInt(i)) & 1n;

            clock(r1, getFb1(), Number(bit));
            clock(r2, getFb2(), Number(bit));
            clock(r3, getFb3(), Number(bit));
            console.log(r2.join().replaceAll(',', ''));

        }

        // ЭТАП 2
        for (let i = 0; i < 22; i++) {

            let bit = (currentCadr >> i) & 1;

            clock(r1, getFb1(), bit);
            clock(r2, getFb2(), bit);
            clock(r3, getFb3(), bit);

        }

        // ЭТАП 3
        for (let i = 0; i < 100; i++) {

            let f = (r1[8] & r2[10]) | (r1[8] & r3[10]) | (r2[10] & r3[10]);

            if (r1[8] === f) clock(r1, getFb1());
            if (r2[10] === f) clock(r2, getFb2());
            if (r3[10] === f) clock(r3, getFb3());

        }

        // ЭТАП 4
        let frameEnd = Math.min(frameStart + 114, inputBits.length);

        for (let i = frameStart; i < frameEnd; i++) {

            let f = (r1[8] & r2[10]) | (r1[8] & r3[10]) | (r2[10] & r3[10]);

            if (r1[8] === f) clock(r1, getFb1());
            if (r2[10] === f) clock(r2, getFb2());
            if (r3[10] === f) clock(r3, getFb3());

            let keystreamBit = r1[18] ^ r2[21] ^ r3[22];

            outputBits.push(inputBits[i] ^ keystreamBit);
        }

        console.log(`Кадр ${Math.floor(frameStart / 114) + 1} обработан с Fn: ${currentCadr}`);
    }

    if (isTextMode) {
        return inConvertingInTextMode(bitsToText(outputBits));
    } else {
        return bitsToText(outputBits);
    }
}

//16. A5/2
function a52(text, isTextMode, isEncrypt, key, cadr) {

    let processedText = "";

    if (isTextMode) {
        processedText = convertingInTextMode(text);
    } else {
        processedText = text.replace(/\s/g, '').toLowerCase().replaceAll(',', 'зпт').replaceAll('.', 'тчк');
    }

    let inputBits = textToBits(processedText);
    let outputBits = [];

    const clock = (reg, feedback, inputBit = 0) => {

        let newBit = feedback ^ inputBit;

        reg.unshift(newBit);

        return reg.pop();

    };

    const maj = (x, y, z) => (x & y) | (x & z) | (y & z);

    for (let frameStart = 0; frameStart < inputBits.length; frameStart += 114) {

        let r1 = new Array(19).fill(0);
        let r2 = new Array(22).fill(0);
        let r3 = new Array(23).fill(0);
        let r4 = new Array(17).fill(0);

        const getFb1 = () => r1[18] ^ r1[17] ^ r1[16] ^ r1[13];
        const getFb2 = () => r2[21] ^ r2[20];
        const getFb3 = () => r3[22] ^ r3[21] ^ r3[20] ^ r3[7];
        const getFb4 = () => r4[16] ^ r4[11];

        let currentCadr = (cadr + Math.floor(frameStart / 114)) % 4194304;

        // ЭТАП 1
        for (let i = 0; i < 64; i++) {

            let bit = Number((key >> BigInt(i)) & 1n);

            clock(r1, getFb1(), bit);
            clock(r2, getFb2(), bit);
            clock(r3, getFb3(), bit);
            clock(r4, getFb4(), bit);

        }

        // ЭТАП 2
        for (let i = 0; i < 22; i++) {

            let bit = (currentCadr >> i) & 1;

            clock(r1, getFb1(), bit);
            clock(r2, getFb2(), bit);
            clock(r3, getFb3(), bit);
            clock(r4, getFb4(), bit);

        }

        r4[3] = 1;
        r4[7] = 1;
        r4[10] = 1;

        // ЭТАП 3
        for (let i = 0; i < 99; i++) {

            let f = maj(r4[3], r4[7], r4[10]);

            if (r4[10] === f) clock(r1, getFb1());
            if (r4[3] === f) clock(r2, getFb2());
            if (r4[7] === f) clock(r3, getFb3());

            clock(r4, getFb4());

        }

        // ЭТАП 4
        let frameEnd = Math.min(frameStart + 114, inputBits.length);

        for (let i = frameStart; i < frameEnd; i++) {

            let f = maj(r4[3], r4[7], r4[10]);

            if (r4[10] === f) clock(r1, getFb1());
            if (r4[3] === f) clock(r2, getFb2());
            if (r4[7] === f) clock(r3, getFb3());

            clock(r4, getFb4());

            let keystreamBit =
                r1[18] ^ maj(r1[12], r1[14], r1[15]) ^
                r2[21] ^ maj(r2[9], r2[13], r2[16]) ^
                r3[22] ^ maj(r3[13], r3[16], r3[18]);

            outputBits.push(inputBits[i] ^ (keystreamBit & 1));
        }
    }

    if (isTextMode) {
        return inConvertingInTextMode(bitsToText(outputBits));
    } else {
        return bitsToText(outputBits);
    }
}

//16. Магма
function magma(text, isTextMode, isEncrypt) {

}

//16. ГОСТ 28147-89
function gost2814789(block, key, isEncrypt, sBox) {
    if (!sBox) {
        sBox = [
            [12, 4, 6, 2, 10, 5, 11, 9, 14, 8, 13, 7, 0, 3, 15, 1],
            [6, 8, 2, 3, 9, 10, 5, 12, 1, 14, 4, 7, 11, 13, 0, 15],
            [11, 3, 5, 8, 2, 15, 10, 13, 14, 1, 7, 4, 12, 9, 6, 0],
            [12, 8, 2, 1, 13, 4, 15, 6, 7, 0, 10, 5, 3, 14, 9, 11],
            [7, 15, 5, 10, 8, 1, 6, 13, 0, 9, 3, 14, 11, 4, 2, 12],
            [5, 13, 15, 6, 9, 2, 12, 10, 11, 7, 8, 1, 4, 3, 14, 0],
            [8, 14, 2, 5, 6, 9, 1, 12, 15, 4, 11, 0, 13, 10, 3, 7],
            [1, 7, 14, 13, 0, 5, 8, 3, 4, 15, 10, 6, 9, 12, 11, 2]
        ];
    }

    // загрузка половинок (N1 - младшая, N2 - старшая)
    let n1 = block[1] >>> 0;
    let n2 = block[0] >>> 0;

    for (let i = 0; i < 32; i++) {
        let keyIndex;

        if (isEncrypt) {
            keyIndex = (i < 24) ? (i % 8) : (7 - (i % 8));
        } else {
            keyIndex = (i < 8) ? (i % 8) : (7 - (i % 8));
        }

        let currentKey = key[keyIndex] >>> 0;

        // Сложение по модулю 2^32
        let s = (n1 + currentKey) >>> 0;

        let sBoxSubstituted = 0;
        for (let j = 0; j < 8; j++) {
            let chunk = (s >>> (j * 4)) & 0x0F;
            sBoxSubstituted = (sBoxSubstituted | ((sBox[j][chunk] << (j * 4)) >>> 0)) >>> 0;
        }

        // Циклический сдвиг влево на 11 шагов
        let shifted = ((sBoxSubstituted << 11) | (sBoxSubstituted >>> 21)) >>> 0;

        // XOR
        let f = (shifted ^ n2) >>> 0;

        if (i < 31) {
            n2 = n1;
            n1 = f;
        } else {
            n2 = f;
        }
    }

    // Возвращение
    return new Uint32Array([n2, n1]);
}

// // Данные из ГОСТ Р 34.12-2015 Приложение А.2
// const key = new Uint32Array([
//     0xffeeddcc, 0xbbaa9988, 0x77665544, 0x33221100,
//     0xf0f1f2f3, 0xf4f5f6f7, 0xf8f9fafb, 0xfcfdfeff
// ]);

// const plainText = new Uint32Array([0xfedcba98, 0x76543210]);

// // 1. Шифруем
// console.log("Шифрование...");
// const cipherText = gost2814789(plainText, key, true);
// console.log("Результат (HEX):",
//     cipherText[0].toString(16).padStart(8, '0'),
//     cipherText[1].toString(16).padStart(8, '0')
// );
// // Ожидается: 4ee901e5 c2d8ca3d

// // 2. Расшифровываем полученный результат
// console.log("Расшифрование...");
// const decryptedText = gost2814789(cipherText, key, false);
// console.log("Результат (HEX):",
//     decryptedText[0].toString(16).padStart(8, '0'),
//     decryptedText[1].toString(16).padStart(8, '0')
// );
// // Ожидается исходный текст: fedcba98 76543210

//16. AES
function aes(inputBytes, keyBytes, mode, isTextMode) {

    // S-блок (Таблица замен)
    const SBOX = [
        0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
        0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
        0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
        0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
        0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
        0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
        0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
        0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
        0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
        0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
        0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
        0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
        0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
        0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
        0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
        0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
    ];

    // Константы раундов (Rcon). 
    const RCON = [
        0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1B, 0x36, 0x6C, 0xD8, 0xAB, 0x4D, 0x9A
    ];

    const RSBOX = [
        0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
        0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
        0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
        0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
        0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
        0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
        0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
        0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
        0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
        0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
        0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
        0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
        0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
        0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
        0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
        0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
    ];

    //замена байтов слова через S-блок
    function SubWord(word) {
        return [SBOX[word[0]], SBOX[word[1]], SBOX[word[2]], SBOX[word[3]]];
    }

    //циклический сдвиг байтов слова влево
    function RotWord(word) {
        return [word[1], word[2], word[3], word[0]];
    }

    //генерация ключей aes
    function KeyExpansion(keyBytes, Nk, Nr, Nb) {

        const w = new Array(Nb * (Nr + 1));
        let temp;

        // Первые Nk слов
        for (let i = 0; i < Nk; i++) {
            w[i] = [keyBytes[4 * i], keyBytes[4 * i + 1], keyBytes[4 * i + 2], keyBytes[4 * i + 3]];
        }

        // Генерация остальных слов
        for (let i = Nk; i < Nb * (Nr + 1); i++) {
            temp = [...w[i - 1]];

            if (i % Nk === 0) {
                temp = SubWord(RotWord(temp));
                temp[0] ^= RCON[i / Nk];
            }
            // правило для 256-битных ключей (Nk = 8)
            else if (Nk > 6 && i % Nk === 4) {
                temp = SubWord(temp);
            }

            // Текущее слово = (предыдущее слово) XOR (слово на Nk позиций раньше)
            w[i] = [
                w[i - Nk][0] ^ temp[0],
                w[i - Nk][1] ^ temp[1],
                w[i - Nk][2] ^ temp[2],
                w[i - Nk][3] ^ temp[3]
            ];
        }

        return w;
    }

    function SubBytes(state) {
        for (let i = 0; i < 16; i++) {
            state[i] = SBOX[state[i]];
        }
    }

    function InvSubBytes(state) {
        for (let i = 0; i < 16; i++) {
            state[i] = RSBOX[state[i]];
        }
    }

    //Процедура шифрования
    function Cipher(input, out, w, Nr, Nb) {
        let state = new Uint8Array(input); // Копирование входа в матрицу состояния

        AddRoundKey(state, w, 0, Nb); // Первичное сложение с ключом

        for (let round = 1; round <= Nr - 1; round++) {
            SubBytes(state);
            ShiftRows(state);
            MixColumns(state);
            AddRoundKey(state, w, round * Nb, Nb);
        }

        // Последний раунд (без MixColumns)
        SubBytes(state);
        ShiftRows(state);
        AddRoundKey(state, w, Nr * Nb, Nb);

        for (let i = 0; i < 16; i++) {
            out[i] = state[i];
        }
    }

    //Процедура расшифрования
    function InvCipher(input, out, w, Nr, Nb) {
        let state = new Uint8Array(input);

        AddRoundKey(state, w, Nr * Nb, Nb);

        for (let round = Nr - 1; round >= 1; round--) {
            InvShiftRows(state);
            InvSubBytes(state);
            AddRoundKey(state, w, round * Nb, Nb);
            InvMixColumns(state);
        }

        InvShiftRows(state);
        InvSubBytes(state);
        AddRoundKey(state, w, 0, Nb);

        for (let i = 0; i < 16; i++) {
            out[i] = state[i];
        }
    }

    function ShiftRows(state) {
        let t;

        // Строка 1: сдвиг влево на 1
        t = state[1];
        state[1] = state[5];
        state[5] = state[9];
        state[9] = state[13];
        state[13] = t;

        // Строка 2: сдвиг влево на 2
        t = state[2];
        state[2] = state[10];
        state[10] = t;
        t = state[6];
        state[6] = state[14];
        state[14] = t;

        // Строка 3: сдвиг влево на 3
        t = state[15];
        state[15] = state[11];
        state[11] = state[7];
        state[7] = state[3];
        state[3] = t;
    }

    function InvShiftRows(state) {
        let t;

        // Строка 1: вправо на 1
        t = state[13];
        state[13] = state[9];
        state[9] = state[5];
        state[5] = state[1];
        state[1] = t;

        // Строка 2: вправо на 2
        t = state[2];
        state[2] = state[10];
        state[10] = t;
        t = state[6];
        state[6] = state[14];
        state[14] = t;

        // Строка 3: вправо на 3
        t = state[3];
        state[3] = state[7];
        state[7] = state[11];
        state[11] = state[15];
        state[15] = t;
    }

    function AddRoundKey(state, w, wordOffset, Nb) {
        for (let col = 0; col < Nb; col++) {
            let word = w[wordOffset + col];
            state[col * 4 + 0] ^= word[0];
            state[col * 4 + 1] ^= word[1];
            state[col * 4 + 2] ^= word[2];
            state[col * 4 + 3] ^= word[3];
        }
    }

    //выполняет умножение на {02} в поле GF(2^8).
    function xtime(a) {
        return ((a << 1) ^ (((a >> 7) & 1) * 0x1b)) & 0xff;
    }

    //Обобщенное умножение в поле GF(2^8) для расшифрования.
    function multiply(a, b) {
        let p = 0;
        for (let i = 0; i < 8; i++) {
            if ((b & 1) !== 0) {
                p ^= a;
            }
            let hiBitSet = (a & 0x80) !== 0;
            a <<= 1;
            if (hiBitSet) {
                a ^= 0x1b;
            }
            b >>= 1;
        }
        return p & 0xff;
    }

    function InvMixColumns(state) {
        for (let i = 0; i < 4; i++) {
            let s0 = state[i * 4 + 0];
            let s1 = state[i * 4 + 1];
            let s2 = state[i * 4 + 2];
            let s3 = state[i * 4 + 3];

            state[i * 4 + 0] = multiply(s0, 0x0e) ^ multiply(s1, 0x0b) ^ multiply(s2, 0x0d) ^ multiply(s3, 0x09);
            state[i * 4 + 1] = multiply(s0, 0x09) ^ multiply(s1, 0x0e) ^ multiply(s2, 0x0b) ^ multiply(s3, 0x0d);
            state[i * 4 + 2] = multiply(s0, 0x0d) ^ multiply(s1, 0x09) ^ multiply(s2, 0x0e) ^ multiply(s3, 0x0b);
            state[i * 4 + 3] = multiply(s0, 0x0b) ^ multiply(s1, 0x0d) ^ multiply(s2, 0x09) ^ multiply(s3, 0x0e);
        }
    }

    function MixColumns(state) {
        for (let i = 0; i < 4; i++) {
            let s0 = state[i * 4 + 0];
            let s1 = state[i * 4 + 1];
            let s2 = state[i * 4 + 2];
            let s3 = state[i * 4 + 3];

            // Формулы из раздела 5.1.3
            state[i * 4 + 0] = xtime(s0) ^ (xtime(s1) ^ s1) ^ s2 ^ s3;
            state[i * 4 + 1] = s0 ^ xtime(s1) ^ (xtime(s2) ^ s2) ^ s3;
            state[i * 4 + 2] = s0 ^ s1 ^ xtime(s2) ^ (xtime(s3) ^ s3);
            state[i * 4 + 3] = (xtime(s0) ^ s0) ^ s1 ^ s2 ^ xtime(s3);
        }
    }

    const Nb = 4;
    let Nk, Nr;

    //Nk и Nr в зависимости от длины ключа
    if (keyBytes.length === 16) { Nk = 4; Nr = 10; }
    else if (keyBytes.length === 24) { Nk = 6; Nr = 12; }
    else if (keyBytes.length === 32) { Nk = 8; Nr = 14; }
    else { throw new Error("Неверная длина ключа. Ожидается 16, 24 или 32 байта."); }

    // Процедура расширения ключа для создания массива из подключей
    const w = KeyExpansion(keyBytes, Nk, Nr, Nb);

    let outBytes = new Uint8Array(16);

    if (mode === true) {
        Cipher(inputBytes, outBytes, w, Nr, Nb);
    } else if (mode === false) {
        InvCipher(inputBytes, outBytes, w, Nr, Nb);
    }

    return outBytes;
}

//16. КУЗНЕЧИК
function kuznechick(dataInput, keyInput, mode) {
    // 1. КОНВЕРТАЦИЯ ВХОДНЫХ ДАННЫХ

    // Преобразуем данные из строки '11 22 33...' в Uint8Array
    let data;
    if (typeof dataInput === 'string') {
        data = new Uint8Array(
            dataInput.trim().split(/\s+/).map(byte => parseInt(byte, 16))
        );
    } else {
        data = new Uint8Array(dataInput);
    }

    // Преобразуем ключ из hex-строки в Uint8Array (если это строка)
    let key;
    if (typeof keyInput === 'string') {
        const hex = keyInput.replace(/\s+/g, ''); // убираем пробелы, если есть
        key = new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    } else {
        key = keyInput;
    }

    // Приводим mode к понятному для логики виду
    const isEncrypt = (mode === true || mode === 'encrypt');

    // Валидация размеров
    if (data.length !== 16) {
        throw new Error("Неверный размер блока данных (должно быть 16 байт)");
    }

    // 2. ВНУТРЕННИЕ КОНСТАНТЫ И ТАБЛИЦЫ
    const PI = new Uint8Array([
        252, 238, 221, 17, 207, 110, 49, 22, 251, 196, 250, 218, 35, 197, 4, 77,
        233, 119, 240, 219, 147, 46, 153, 186, 23, 54, 241, 187, 20, 205, 95, 193,
        249, 24, 101, 90, 226, 92, 239, 33, 129, 28, 60, 66, 139, 1, 142, 79,
        5, 132, 2, 174, 227, 106, 143, 160, 6, 11, 237, 152, 127, 212, 211, 31,
        235, 52, 44, 81, 234, 200, 72, 171, 242, 42, 104, 162, 253, 58, 206, 204,
        181, 112, 14, 86, 8, 12, 118, 18, 191, 114, 19, 71, 156, 183, 93, 135,
        21, 161, 150, 41, 16, 123, 154, 199, 243, 145, 120, 111, 157, 158, 178, 177,
        50, 117, 25, 61, 255, 53, 138, 126, 109, 84, 198, 128, 195, 189, 13, 87,
        223, 245, 36, 169, 62, 168, 67, 201, 215, 121, 214, 246, 124, 34, 185, 3,
        224, 15, 236, 222, 122, 148, 176, 188, 220, 232, 40, 80, 78, 51, 10, 74,
        167, 151, 96, 115, 30, 0, 98, 68, 26, 184, 56, 130, 100, 159, 38, 65,
        173, 69, 70, 146, 39, 94, 85, 47, 140, 163, 165, 125, 105, 213, 149, 59,
        7, 88, 179, 64, 134, 172, 29, 247, 48, 55, 107, 228, 136, 217, 231, 137,
        225, 27, 131, 73, 76, 63, 248, 254, 141, 83, 170, 144, 202, 216, 133, 97,
        32, 113, 103, 164, 45, 43, 9, 91, 203, 155, 37, 208, 190, 229, 108, 82,
        89, 166, 116, 210, 230, 244, 180, 192, 209, 102, 175, 194, 57, 75, 99, 182
    ]);

    const PI_INV = new Uint8Array(256);
    for (let i = 0; i < 256; i++) PI_INV[PI[i]] = i;

    const L_VEC = [148, 32, 133, 16, 194, 192, 1, 251, 1, 192, 194, 16, 133, 32, 148, 1];

    // 3. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (Математика)
    function gfMul(a, b) {
        let p = 0;
        for (let i = 0; i < 8; i++) {
            if ((b & 1) !== 0) p ^= a;
            let hi_bit_set = (a & 0x80) !== 0;
            a <<= 1;
            if (hi_bit_set) a ^= 0xC3;
            b >>= 1;
        }
        return p & 0xFF;
    }

    function X(a, b) {
        let res = new Uint8Array(16);
        for (let i = 0; i < 16; i++) res[i] = a[i] ^ b[i];
        return res;
    }

    function S(state) {
        let res = new Uint8Array(16);
        for (let i = 0; i < 16; i++) res[i] = PI[state[i]];
        return res;
    }

    function S_inv(state) {
        let res = new Uint8Array(16);
        for (let i = 0; i < 16; i++) res[i] = PI_INV[state[i]];
        return res;
    }

    function R(state) {
        let a_15 = 0;
        for (let i = 0; i < 16; i++) a_15 ^= gfMul(state[i], L_VEC[i]);
        let res = new Uint8Array(16);
        res[0] = a_15;
        for (let i = 1; i < 16; i++) res[i] = state[i - 1];
        return res;
    }

    function R_inv(state) {
        let a_0 = state[0];
        let res = new Uint8Array(16);

        for (let i = 0; i < 15; i++) {
            res[i] = state[i + 1];
        }

        for (let i = 0; i < 15; i++) {
            a_0 ^= gfMul(res[i], L_VEC[i]);
        }

        res[15] = a_0;
        return res;
    }

    function L(state) {
        let res = new Uint8Array(state);
        for (let i = 0; i < 16; i++) res = R(res);
        return res;
    }

    function L_inv(state) {
        let res = new Uint8Array(state);
        for (let i = 0; i < 16; i++) res = R_inv(res);
        return res;
    }

    // 4. РАЗВЕРТКА КЛЮЧА
    function keyExpansion(masterKey) {
        const roundKeys = [];
        roundKeys[0] = masterKey.slice(0, 16);
        roundKeys[1] = masterKey.slice(16, 32);

        function feistelRound(a1, a0, k) {
            let res = X(a1, k);
            res = S(res);
            res = L(res);
            return X(res, a0);
        }

        for (let i = 1; i <= 4; i++) {
            let a1 = roundKeys[2 * i - 2];
            let a0 = roundKeys[2 * i - 1];
            for (let j = 1; j <= 8; j++) {
                const cVector = new Uint8Array(16);
                cVector[15] = 8 * (i - 1) + j;
                const C = L(cVector);
                const nextA1 = feistelRound(a1, a0, C);
                const nextA0 = a1;
                a1 = nextA1;
                a0 = nextA0;
            }
            roundKeys[2 * i] = a1;
            roundKeys[2 * i + 1] = a0;
        }
        return roundKeys;
    }

    // 5. ОСНОВНОЙ ЦИКЛ
    let finalRoundKeys;
    if (key.length === 32) {
        finalRoundKeys = keyExpansion(key);
    } else {
        throw new Error("Мастер-ключ должен быть 32 байта");
    }

    let state = new Uint8Array(data);

    if (isEncrypt) {
        // Шифрование
        for (let i = 0; i < 9; i++) {
            state = X(state, finalRoundKeys[i]);
            state = S(state);
            state = L(state);
        }
        state = X(state, finalRoundKeys[9]);
    } else {
        // Расшифрование
        state = X(state, finalRoundKeys[9]);
        for (let i = 8; i >= 0; i--) {
            state = L_inv(state);
            state = S_inv(state);
            state = X(state, finalRoundKeys[i]);
        }
    }

    // Возвращаем результат в виде HEX-строки для удобства чтения
    return Array.from(state).map(b => b.toString(16).padStart(2, '0')).join(' ').toUpperCase();
}

// const myData = '11 22 33 44 55 66 77 00 ff ee dd cc bb aa 99 88';
// const myKey = '8899aabbccddeeff0011223344556677fedcba98765432100123456789abcdef';

// // Зашифровать
// const encrypted = kuznechick(myData, myKey, true);
// console.log('Encrypted:', encrypted);

// // Расшифровать
// const decrypted = kuznechick(encrypted, myKey, false);
// console.log('Decrypted:', decrypted);