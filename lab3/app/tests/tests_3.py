import pytest
from app import app, USERS_DATA

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['WTF_CSRF_ENABLED'] = False
    with app.test_client() as client:
        yield client
# 1
def test_counter_guest(client):
    response = client.get("/counter")
    assert response.status_code == 200
    assert "1" in response.data.decode('utf-8')
    
    response = client.get("/counter")
    assert "2" in response.data.decode('utf-8')
# 2
def test_individual_user_counters(client):
    client.post("/login", data={"username": "user", "password": "qwerty"})
    client.get("/counter")
    response = client.get("/counter")
    assert "2" in response.data.decode('utf-8')
    client.get("/logout")

    client.post("/login", data={"username": "admin", "password": "8951"})
    response = client.get("/counter")
    assert "1" in response.data.decode('utf-8')
# 3
def test_login_success(client):
    response = client.post("/login", data={"username": "mike", "password": "8951"}, follow_redirects=True)
    assert response.status_code == 200
    assert "Успешный вход!" in response.data.decode('utf-8')
    assert "Задание к лабораторной работе" in response.data.decode('utf-8')
# 4
def test_login_failure(client):
    response = client.post("/login", data={"username": "user", "password": "wrong_password"}, follow_redirects=True)
    assert response.status_code == 200
    assert "Неверный логин или пароль." in response.data.decode('utf-8')
    assert "Вход в систему" in response.data.decode('utf-8')
# 5
def test_secret_page_access_authenticated(client):
    client.post("/login", data={"username": "user", "password": "qwerty"})
    response = client.get("/secret")
    assert response.status_code == 200
    assert "Секретная страница" in response.data.decode('utf-8')
# 6
def test_secret_page_redirect_anonymous(client):
    response = client.get("/secret", follow_redirects=True)
    assert "Для доступа к запрашиваемой странице необходимо пройти процедуру аутентификации." in response.data.decode('utf-8')
    assert "Вход в систему" in response.data.decode('utf-8')
# 7
def test_login_next_redirect(client):
    response = client.get("/secret")
    assert response.status_code == 302
    assert "/login?next=%2Fsecret" in response.location

    response = client.post("/login?next=/secret", data={"username": "admin", "password": "8951"}, follow_redirects=True)
    assert response.status_code == 200
    assert "Секретная страница" in response.data.decode('utf-8')
# 8
def test_remember_me_functionality(client):
    response = client.post("/login", data={"username": "user", "password": "qwerty", "remember": "on"})
    assert "remember_token" in response.headers.get("Set-Cookie", "")
# 9
def test_navbar_visibility_anonymous(client):
    response = client.get("/")
    html = response.data.decode('utf-8')
    assert "Войти" in html
    assert "Выйти" not in html
    assert "Секретная страница" not in html
# 10
def test_navbar_visibility_authenticated(client):
    client.post("/login", data={"username": "user", "password": "qwerty"})
    response = client.get("/")
    html = response.data.decode('utf-8')
    assert "Выйти" in html
    assert "Секретная страница" in html
    assert "Войти" not in html
# 11
def test_logout_redirect(client):
    client.post("/login", data={"username": "user", "password": "qwerty"})
    response = client.get("/logout", follow_redirects=True)
    assert "Задание к лабораторной работе" in response.data.decode('utf-8')
    assert "Секретная страница" not in response.data.decode('utf-8')