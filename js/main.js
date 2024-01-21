// Переменные для работы с таблицей и формой редактирования
const tableBody = document.getElementById('table-body');
const editFormContainer = document.getElementById('edit-form-container');
let jsonData = []; // Объявление jsonData в более широкой области видимости

// Переменная для хранения отредактированного элемента
let editedItem = null;

// Функция для загрузки данных из JSON
async function fetchData() {
    try {
        const response = await fetch('data.json');
        jsonData = await response.json(); // Присвоение данных глобальной переменной jsonData

        displayData(jsonData);
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

// Функция для отображения данных в таблице
function displayData(data) {
    tableBody.innerHTML = ''; // Очистка текущих данных

    data.forEach(item => {
        const row = document.createElement('tr');
        row.onclick = (event) => showEditForm(item, event); // Показать форму редактирования при клике на строку

        const columns = ['firstName', 'lastName', 'about', 'eyeColor'];

        columns.forEach(column => {
            const cell = document.createElement('td');
            let value;

            if (column === 'firstName' || column === 'lastName') {
                // Если колонка 'firstName' или 'lastName', используем значение из name
                value = item.name[column];
            } else {
                // Иначе используем значение из данных
                value = column === 'about' ? truncateText(item[column], 50) : item[column];
            }

            // Проверка, определено ли значение, перед использованием
            cell.textContent = value !== undefined ? value : '';
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

// Функция для обрезки текста и добавления многоточия
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

// Функция для сортировки данных в таблице
function sortTable(column) {
    jsonData.sort((a, b) => {
        const aValue = (column === 'firstName' || column === 'lastName') ? a.name[column].toLowerCase() : a[column].toLowerCase();
        const bValue = (column === 'firstName' || column === 'lastName') ? b.name[column].toLowerCase() : b[column].toLowerCase();

        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
    });

    displayData(jsonData);
}


// Функция для отображения данных в форме редактирования
function showEditForm(item, event) {
    editedItem = item;

    // Заполнение полей формы редактирования
    document.getElementById('editFirstName').value = item.name.firstName;
    document.getElementById('editLastName').value = item.name.lastName;
    document.getElementById('editAbout').value = item.about;
    document.getElementById('editEyeColor').value = item.eyeColor;

    // Получение позиции верхнего края выбранной строки относительно страницы
    const selectedRow = event.currentTarget;
    const rowPosition = selectedRow.getBoundingClientRect();
    const topOffset = rowPosition.top + window.scrollY;

    // Установка позиции формы редактирования на против верхнего края выбранной строки
    editFormContainer.style.top = topOffset + 'px';
    editFormContainer.style.left = 'calc(50%)'; // Расстояние от правого края строки

    editFormContainer.style.display = 'block';
}


// Функция для сохранения изменений после редактирования
function saveEdit() {
    if (editedItem) {
        // Обновление данных элемента
        editedItem.name.firstName = document.getElementById('editFirstName').value;
        editedItem.name.lastName = document.getElementById('editLastName').value;
        editedItem.about = document.getElementById('editAbout').value;
        editedItem.eyeColor = document.getElementById('editEyeColor').value;

        // Очистка полей формы
        document.getElementById('editFirstName').value = '';
        document.getElementById('editLastName').value = '';
        document.getElementById('editAbout').value = '';
        document.getElementById('editEyeColor').value = '';

        // Скрытие формы редактирования
        editFormContainer.style.display = 'none';

        // Обновление отображения таблицы
        displayData(jsonData);
    }

}


// Функция для отмены редактирования и закрытия формы
function cancelEdit() {
    // Очистка полей формы
    document.getElementById('editFirstName').value = '';
    document.getElementById('editLastName').value = '';
    document.getElementById('editAbout').value = '';
    document.getElementById('editEyeColor').value = '';

    // Скрытие формы редактирования
    editFormContainer.style.display = 'none';
}


// Вызов функции загрузки данных
fetchData();
