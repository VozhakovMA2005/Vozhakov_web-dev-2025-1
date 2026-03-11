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

        // Логика блокировки ключа
        if (algo === 'atbash' || algo === 'polybius' || algo === 'tritemiy' || algo === 'magmat' || algo === 'cardano') {
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
            result = a51(text, isTextMode, isEncrypt, rawValue);
        }
        else if (algorithm === 'a52') {
            result = a52(text, isTextMode, isEncrypt, rawValue);
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

//15. А5/1
function a51(text, isTextMode, isEncrypt, rawValue) {

    let processedText = "";

    if (isTextMode) {

        //TextMode

    }else{

        //TestMode
        processedText = text.replace(/\s/g, '').toLowerCase().replaceAll(',', 'зпт').replaceAll('.', 'тчк');

    }
}

//16. A5/2
function a52(text, isTextMode, isEncrypt, rawValue) {

}















//Скрэмблер
// let keyR1 = constA.toString().padStart(5, '0');
// let keyR2 = constC.toString().padStart(4, '0');

// let bitsString = "";
// for (let i = 0; i < processedText.length; i++) {
//     bitsString += binaryEncoding[processedText[i]];
// }

// let mainLen = bitsString.length;

// let outputBitR1 = [];
// let register1 = keyR1;
// for (let i = 0; i < mainLen; i++) {
//     outputBitR1.push(register1[4]);

//     let appendBit = (Number(register1[0]) ^ Number(register1[2]) ^ Number(register1[3]) ^ Number(register1[4])).toString();
//     register1 = appendBit + register1.slice(0, 4);
// }

// let outputBitR2 = [];
// let register2 = keyR2;
// for (let i = 0; i < mainLen; i++) {
//     outputBitR2.push(register2[3]);

//     let appendBit = (Number(register2[0]) ^ Number(register2[3])).toString();
//     register2 = appendBit + register2.slice(0, 3);
// }

// let gamma = [];
// for (let i = 0; i < mainLen; i++) {
//     gamma.push((Number(outputBitR1[i]) ^ Number(outputBitR2[i])).toString());
// }

// let resultBits = "";
// for (let i = 0; i < mainLen; i++) {
//     resultBits += (Number(bitsString[i]) ^ Number(gamma[i])).toString();
// }

// const invBinaryEncoding = {};
// for (let char in binaryEncoding) {
//     invBinaryEncoding[binaryEncoding[char]] = char;
// }

// for (let i = 0; i < resultBits.length; i += 5) {
//     let chunk = resultBits.substring(i, i + 5);
//     result += invBinaryEncoding[chunk];
// }
