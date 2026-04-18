import pytest
from flask import template_rendered
from app import app

@pytest.fixture
def captured_templates():
    recorded = []
    def record(sender, template, context, **extra):
        recorded.append((template, context))
    template_rendered.connect(record, app)
    try:
        yield recorded
    finally:
        template_rendered.disconnect(record, app)

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# 1. Базовые проверки доступности страниц

def test_index_status(client):
    assert client.get("/").status_code == 200

def test_posts_status(client):
    assert client.get("/posts").status_code == 200

def test_about_status(client):
    assert client.get("/about").status_code == 200

def test_post_not_found_404(client):
    assert client.get("/posts/999").status_code == 404

# 2. Тестирование параметров URL

def test_url_params_displays_args(client):
    #На странице отображаются все переданные в запросе параметры
    response = client.get("/url_params?course=flask&lab=2")
    html = response.data.decode('utf-8')
    assert "course" in html
    assert "flask" in html
    assert "lab" in html
    assert "2" in html

def test_url_params_empty(client):
    #Поведение при отсутствии параметров
    response = client.get("/url_params")
    html = response.data.decode('utf-8')
    assert "Параметры не найдены" in html

# 3. Тестирование заголовков

def test_headers_displays_all(client):
    #На странице отображаются все переданные заголовки запроса
    response = client.get("/headers", headers={"X-Secret-Header": "MySecretValue"})
    html = response.data.decode('utf-8')
    assert "X-Secret-Header" in html
    assert "MySecretValue" in html

# 4. Тестирование Cookie

def test_cookies_set_if_not_exists(client):
    #Корректно устанавливается значение куки, если оно не было установлено ранее
    response = client.get("/cookies")
    set_cookie_headers = response.headers.getlist('Set-Cookie')
    assert any('lab2_test_cookie=Hello_from_Lab2' in c for c in set_cookie_headers)

def test_cookies_delete_if_exists(client):
    #Удаляется куки, если оно было установлено
    
    client.get("/cookies")
    
    response = client.get("/cookies")
    set_cookie_headers = response.headers.getlist('Set-Cookie')

    deleted = any(
        'lab2_test_cookie=;' in c or 
        'Expires=Thu, 01 Jan 1970' in c or 
        'Max-Age=0' in c 
        for c in set_cookie_headers
    )
    
    assert deleted, f"Куки не было удалено. Полученные заголовки Set-Cookie: {set_cookie_headers}"

# 5. Тестирование параметров формы

def test_form_params_empty(client):
    #Если форма не отправлялась, отображается предупреждение
    response = client.get("/form_params")
    assert "Данные не найдены" in response.data.decode('utf-8')

def test_form_params_filled(client):
    #Отображаются введённые пользователем значения после отправки формы
    client.post("/form_input", data={"username": "Mikhail", "group": "241-371"})
    response = client.get("/form_params")
    html = response.data.decode('utf-8')
    assert "Mikhail" in html
    assert "241-371" in html

# 6. Валидация номера телефона

def test_phone_valid_russian_plus7(client):
    #Корректное форматирование для номера, начинающегося с +7
    response = client.post("/phone", data={"phone_number": "+7 (123) 456-78-90"})
    assert "8-123-456-78-90" in response.data.decode('utf-8')

def test_phone_valid_russian_8(client):
    #Корректное форматирование для номера, начинающегося с 8
    response = client.post("/phone", data={"phone_number": "8(123)4567890"})
    assert "8-123-456-78-90" in response.data.decode('utf-8')

def test_phone_valid_no_code(client):
    #Корректное форматирование для номера без кода страны (10 цифр)
    response = client.post("/phone", data={"phone_number": "123.456.78.90"})
    assert "8-123-456-78-90" in response.data.decode('utf-8')

def test_phone_invalid_chars(client):
    #Ошибка: недопустимые символы
    response = client.post("/phone", data={"phone_number": "+7 123 abc 45 67"})
    html = response.data.decode('utf-8')
    assert "Недопустимый ввод. В номере телефона встречаются недопустимые символы." in html

def test_phone_invalid_length_rus(client):
    #Ошибка: неверное количество цифр (начинается с +7, но всего 10 цифр)
    response = client.post("/phone", data={"phone_number": "+7 123 456 78 9"})
    html = response.data.decode('utf-8')
    assert "Недопустимый ввод. Неверное количество цифр." in html

def test_phone_invalid_length_no_code(client):
    #Ошибка: неверное количество цифр (без кода страны, 9 цифр)
    response = client.post("/phone", data={"phone_number": "123 456 78 9"})
    html = response.data.decode('utf-8')
    assert "Недопустимый ввод. Неверное количество цифр." in html
