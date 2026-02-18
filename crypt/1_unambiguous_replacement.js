//ВебИнтерфейс
document.addEventListener('DOMContentLoaded', () => {
    const executeBtn = document.getElementById('executeBtn');
    const algoSelect = document.getElementById('algorithmSelect');
    const keyContainer = document.getElementById('keyContainer');

    const matrixOptions = document.getElementById('matrixOptions');
    const matrixSizeSelect = document.getElementById('matrixSizeSelect');
    const matrixGridContainer = document.getElementById('matrixGridContainer');

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

        // Логика блокировки ключа
        if (algo === 'atbash' || algo === 'polybius' || algo === 'tritemiy' || algo === 'magmat') {
            keyContainer.style.opacity = '0.5'; 
            document.getElementById('keyInput').disabled = true;
        } else {
            keyContainer.style.opacity = '1';
            document.getElementById('keyInput').disabled = false;
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
                // Если поле пустое, ставим 0
                matrixParam[r][c] = input.value === '' ? 0 : Number(input.value); 
            });
            result = matrix(text, isTextMode, isEncrypt, shift, matrixSize, matrixParam);
        }
        else if (algorithm === 'playfer') {
            result = playfer(text, isTextMode, isEncrypt, rawValue);
        }

        // Вывод результата
        document.getElementById('outputText').value = result;
    });
});

// Основная рекурсивная функция для нахождения определителя
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
function prepareText(text) {

    let str = text.toLowerCase().replace(/[^а-яё]/g, "");

    let i = 0;
    while (i < str.length - 1) {
        
        if (str[i] === str[i + 1]) {
            
            str = str.slice(0, i + 1) + 'ф' + str.slice(i + 1);
            
            i = 0; 
        } else {
 
            i += 2;
        }
    }

    if (str.length % 2 !== 0) {
        str += 'ф';
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

// text - первоначальный текст
// isTextMode - режим работы (текстовый (true) или тестовый (false))
// isEncrypt - шифрование (true) или расшифрованиеc(false)
// shift - ключ для шифра


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
        } else{

            let i = 0;

            while (i < processedText.length){
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

    if (shift < 0 || shift > 31){
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

        if (isEncrypt){

            for (let i of text){

                if (i in alphabetHigh){
                    processedText += alphabetHigh[i];

                } else if (i in alphabetSpec){
                    processedText += alphabetSpec[i];

                } else {
                    processedText += alphabetLow[i];
                }     
            }

            for (let i of processedText){

                const index = alphabet.indexOf(i);

                if (index !== -1) {

                    let newIndex = (index + shift) % alphabet.length;

                    if (newIndex < 0){
                        newIndex += alphabet.length;
                    }

                    result += alphabet[newIndex];

                } else {

                    result += i;

                }
            }

        } else{

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

        if (isEncrypt){
            for (let i of processedText){

                const index = alphabet.indexOf(i);

                if (index !== -1) {

                    let newIndex = (index + shift) % alphabet.length;

                    if (newIndex < 0){
                        newIndex += alphabet.length;
                    }

                    result += alphabet[newIndex];

                } else {

                    result += i;

                }
            }
        } else{

            for (let i of processedText){

                const index = alphabet.indexOf(i);

                if (index !== -1) {

                    let newIndex = (index - shift) % alphabet.length;

                    if (newIndex < 0){
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

        if (isEncrypt){

            for (let i of text){

                if (i in alphabetHigh){
                    processedText += alphabetHigh[i];

                } else if (i in alphabetSpec){
                    processedText += alphabetSpec[i];

                } else {
                    processedText += alphabetLow[i];
                }     
            }

            for (let i of processedText){
                result += alphabet[i];
            }

        } else{

            processedText = text;
            let polybiusResult = '';

            let i = 0;

            while (i < processedText.length) {

                const substring = processedText.slice(i, i + 2);

                if (alphabetD.hasOwnProperty(substring)){

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

    } else{

        processedText = text.replace(/\s/g, '').toLowerCase().replaceAll(',', 'зпт').replaceAll('.', 'тчк');

        let result = "";

        if (isEncrypt){

            for (let i of processedText){
                result += alphabet[i];
            }

        } else {

            let i = 0;

            while (i < processedText.length) {

                const substring = processedText.slice(i, i + 2);

                if (alphabetD.hasOwnProperty(substring)){

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
function tritemiy(text, isTextMode, isEncrypt){

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

        if (isEncrypt){

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

        } else{

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

    } else{
        
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
function belazo(text, isTextMode, isEncrypt, shift){

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

    } else{

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
function vizhener(text, isTextMode, isEncrypt, shift, vizhType){

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

    } else{

        // ТЕСТОВЫЙ РЕЖИМ
        processedText = text.replace(/\s/g, '').toLowerCase().replaceAll(',', 'зпт').replaceAll('.', 'тчк');

        let result = "";

        if (vizhType === "sm"){

            key = keyString + processedText.slice(0, -1);

            if (isEncrypt){
                
                for (let i = 0; i < processedText.length; i++){
                    result += numberMap[(alphabetMap[processedText[i]] + alphabetMap[key[i]]) % 32];
                }

            }else{

                let param = alphabetMap[keyString];

                for (let i = 0; i < processedText.length; i++){
                    if (alphabetMap[processedText[i]] - param < 0){
                        result += numberMap[alphabetMap[processedText[i]] - param + 32];
                        param = alphabetMap[processedText[i]] - param + 32;
                    }else{
                        result += numberMap[alphabetMap[processedText[i]] - param];
                        param = alphabetMap[processedText[i]] - param;
                    }
                }
            }

        }else{

            if (isEncrypt){

                let param = alphabetMap[keyString];

                for (let i = 0; i < processedText.length; i++){
                    result += numberMap[(alphabetMap[processedText[i]] + param) % 32];
                    param = (alphabetMap[processedText[i]] + param) % 32;
                }

            }else{

                key = keyString + processedText.slice(0, -1);

                for (let i = 0; i < processedText.length; i++){
                    if (alphabetMap[processedText[i]] - alphabetMap[key[i]] < 0){
                        result += numberMap[alphabetMap[processedText[i]] - alphabetMap[key[i]] + 32];
                        
                    }else{
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
function magmat(text, isTextMode, isEncrypt){
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
function matrix(text, isTextMode, isEncrypt, shift, matrixSize, matrixParam){

    if (getDeterminant(matrixParam) == 0){
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
        26: 'щ', 27: 'ъ', 28: 'ы', 29: 'ь', 30: 'э', 31: 'ю', 32: 'я', 0:'',
    };

    if (isTextMode) {

        // ТЕКСТОВЫЙ РЕЖИМ

    } else{

        // ТЕСТОВЫЙ РЕЖИМ
        processedText = text.replace(/\s/g, '').toLowerCase().replaceAll(',', 'зпт').replaceAll('.', 'тчк');


        let result = "";
        let arr = [];

        if (isEncrypt){

            let index = 0;

            while (processedText.length % matrixSize != 0){
                processedText += "0";
            }

            while (index < processedText.length - matrixSize + 1){

                for (let i = 0; i < matrixSize; i++){

                    let sum = 0;

                    for (let j = 0; j < matrixSize; j++){
                        sum += alphabetMap[processedText[index + j]] * matrixParam[i][j];
                    }
                    
                    arr.push(sum);
                }

                index += matrixSize;
            }

            let maxNumber = Math.max(...arr);
            let maxNumberLength = maxNumber.toString().length;

            for (let numb of arr){
                let item = numb.toString();
                while (item.length <  maxNumberLength){
                    item = "0" + item;
                }
                result += item;
            }

        }else{

            if (processedText.length % shift != 0){
                return "Ошибка ввода ключа или текста";
            }

            let index = 0;
            let processedTextArr = splitStringToNumbers(processedText, shift);
            let invertMatrix = matrixInvert(matrixParam);

            while (index < processedTextArr.length - matrixSize + 1){

                for (let i = 0; i < matrixSize; i++){

                    let sum = 0;

                    for (let j = 0; j < matrixSize; j++){
                        sum += processedTextArr[index + j] * invertMatrix[i][j];
                    }
                    
                    arr.push(Math.round(sum));
                }

                index += matrixSize;
            }

            for (let numb of arr){
                result += reversedMap[numb];
            }
        }

        return result;
    }
}

// 9. ПЛЭЙФЕРА
function playfer(text, isTextMode, isEncrypt, shift){

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
    console.log(shift);

    // if (!hasUniqueLetters(shift)){
    //     return "Неправильный лозунг!"
    // }
    
    shift = removeDuplicateLetters(shift);

    let processedText = "";
    const alphabet = "абвгдежзиклмнопрстуфхцчшщьыэюя"

    if (isTextMode){

        //ТЕКСТОВЫЙ РЕЖИМ

    }else{

        //ТЕСТОВЫЙ РЕЖИМ
        processedText = text.replace(/\s/g, '').toLowerCase().replaceAll(',', 'зпт').replaceAll('.', 'тчк');
        processedText = replaceLetters(processedText, alphabetChange);

        let result = "";
        let mainString = "";

        mainString = removeLettersFromString(shift, alphabet);
        mainString = shift + mainString;
        losungArr = [];
        let index = 0;
        for (let i = 0; i < 5; i++){
            losungArr[i] = [];
            for (let j = 0; j < 6; j++){
                losungArr[i].push(mainString[index]);
                index++;
            }
        }

        if (isEncrypt){

            processedText = prepareText(processedText);

            for (let count = 0; count < processedText.length - 1;){

                let a1 = findElementIndex(losungArr, processedText[count]);
                let a2 = findElementIndex(losungArr, processedText[count + 1]);

                if (a1['row'] == a2 ['row']){
                    result += (losungArr[a1['row']][(a1['col'] + 1) % 6] + losungArr[a2['row']][(a2['col'] + 1) % 6]);
                }else if(a1['col'] == a2 ['col']){
                    result += (losungArr[(a1['row'] + 1) % 5][a1['col']] + losungArr[(a2['row'] + 1) % 5][a2['col']]);
                }else{
                    result += (losungArr[a1['row']][a2['col']] + losungArr[a2['row']][a1['col']]);
                }

                count += 2;
            }

        }else{
            for (let count = 0; count < processedText.length - 1;){
        
                let a1 = findElementIndex(losungArr, processedText[count]);
                let a2 = findElementIndex(losungArr, processedText[count + 1]);

                if (a1['row'] == a2 ['row']){
                    if (a1['col'] - 1 < 0){
                        result += (losungArr[a1['row']][a1['col'] + 5] + losungArr[a2['row']][a2['col'] - 1]);
                    } else if (a2['col'] - 1 < 0){
                        result += (losungArr[a1['row']][a1['col'] - 1] + losungArr[a2['row']][a2['col'] + 5]);
                    }else{
                        result += (losungArr[a1['row']][a1['col'] - 1] + losungArr[a2['row']][a2['col'] - 1]);
                    }
                }else if(a1['col'] == a2 ['col']){
                    if (a1['row'] - 1 < 0){
                        result += (losungArr[a1['row'] + 4][a1['col']] + losungArr[a2['row'] - 1][a2['col']]);
                    } else if (a2['row'] - 1 < 0){
                        result += (losungArr[a1['row'] - 1][a1['col']] + losungArr[a2['row'] + 4][a2['col']]);
                    }else{
                        result += (losungArr[a1['row'] - 1][a1['col']] + losungArr[a2['row'] - 1][a2['col']]);
                    }
                }else{
                    result += (losungArr[a1['row']][a2['col']] + losungArr[a2['row']][a1['col']]);
                }
            
                count += 2;
            }
        }

        return result;
    }
}