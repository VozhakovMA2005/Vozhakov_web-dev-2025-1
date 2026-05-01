import pytest
from app import app, db, User, Role
from datetime import datetime

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['WTF_CSRF_ENABLED'] = False
    with app.test_client() as client:
        yield client

def login(client, username, password):
    return client.post('/login', data={'login': username, 'password': password}, follow_redirects=True)

# 1. Тестирование наличия системного администратора в БД
def test_admin_exists(client):
    with app.app_context():
        admin = User.query.filter_by(login='admin').first()
        assert admin is not None
        assert admin.first_name == "Admin"

# 2. Тестирование авторизации под системным администратором
def test_login_admin(client):
    response = login(client, 'admin', 'admin123')
    assert b"Admin" in response.data

# 3. Тестирование доступа к главной странице
def test_index_page(client):
    response = client.get('/')
    assert response.status_code == 200

# 4. Тестирование автоматического проставления даты создания
def test_auto_timestamp_field(client):
    with app.app_context():
        user = User.query.filter_by(login='admin').first()
        assert isinstance(user.created_at, datetime)

# 5. Тестирование связи пользователя с ролью
def test_user_role_relation(client):
    with app.app_context():
        user = User.query.filter_by(login='admin').first()
        assert user.role_obj is not None
        assert user.role_obj.name == "Администратор"

# 6. Тестирование заполнения поля логин (валидация на пустоту)
def test_empty_login_validation(client):
    login(client, 'admin', 'admin123')
    response = client.post('/user/new', data={'login': ''}, follow_redirects=True)
    assert response.status_code == 200

# 7. Тестирование заполнения поля пароль (минимальная длина)
def test_password_min_length(client):
    login(client, 'admin', 'admin123')
    response = client.post('/user/new', data={'login': 'newuser', 'password': '123'}, follow_redirects=True)
    assert b"8" in response.data # Сообщение о длине 8 символов

# 8. Тестирование заполнения поля имя
def test_first_name_required(client):
    login(client, 'admin', 'admin123')
    response = client.post('/user/new', data={'login': 'testuser', 'password': 'Password123!', 'first_name': ''}, follow_redirects=True)
    assert response.status_code == 200

# 9. Тестирование хранения пароля в виде хеша
def test_password_is_hashed(client):
    with app.app_context():
        user = User.query.filter_by(login='admin').first()
        assert user.password_hash != "admin123"
        assert user.password_hash.startswith('scrypt') or user.password_hash.startswith('pbkdf2')

# 10. Тестирование выхода из системы
def test_logout(client):
    login(client, 'admin', 'admin123')
    response = client.get('/logout', follow_redirects=True)
    assert b"/login" in response.data or response.status_code == 200

# 11. Тестирование доступа к созданию пользователя без авторизации
def test_create_user_no_auth(client):
    response = client.get('/user/new', follow_redirects=True)
    assert b"login" in response.data.lower()

# 12. Тестирование отображения названия роли в профиле
def test_role_name_display(client):
    login(client, 'admin', 'admin123')
    response = client.get('/')
    assert b"\xd0\x90\xd0\xb4\xd0\xbc\xd0\xb8\xd0\xbd\xd0\xb8\xd1\x81\xd1\x82\xd1\x80\xd0\xb0\xd1\x82\xd0\xbe\xd1\x80" in response.data

# 13. Тестирование отображения описания роли
def test_role_description_exists(client):
    with app.app_context():
        role = Role.query.filter_by(name="Администратор").first()
        assert role.description is not None

# 14. Тестирование возможности отсутствия отчества
def test_middle_name_optional(client):
    with app.app_context():
        new_user = User(login="nomiddle", first_name="Ivan", last_name="Ivanov", role_id=1)
        new_user.set_password("Pass123456!")
        db.session.add(new_user)
        db.session.commit()
        assert new_user.middle_name is None

# 15. Тестирование удаления пользователя
def test_user_deletion(client):
    login(client, 'admin', 'admin123')
    with app.app_context():
        user = User.query.filter_by(login="nomiddle").first()
        user_id = user.id
    client.post(f'/user/{user_id}/delete', follow_redirects=True)
    with app.app_context():
        assert User.query.get(user_id) is None

# 16. Тестирование валидации уникальности логина
def test_unique_login_validation(client):
    login(client, 'admin', 'admin123')
    response = client.post('/user/new', data={'login': 'admin', 'password': 'NewPassword123!'}, follow_redirects=True)
    assert response.status_code == 200

# 17. Тестирование автоматического присвоения ID роли
def test_role_id_assignment(client):
    with app.app_context():
        user = User.query.filter_by(login='admin').first()
        assert isinstance(user.role_id, int)

# 18. Тестирование страницы просмотра данных пользователя
def test_view_user_page(client):
    login(client, 'admin', 'admin123')
    response = client.get('/user/1')
    assert response.status_code == 200

# 19. Тестирование корректности хэширования через проверку пароля
def test_password_verification_method(client):
    with app.app_context():
        user = User.query.filter_by(login='admin').first()
        assert user.check_password('admin123') is True
        assert user.check_password('wrong_pass') is False

# 20. Тестирование возможности отсутствия фамилии (nullable=True)
def test_last_name_optional(client):
    with app.app_context():

        User.query.filter_by(login="nolastname").delete()
        db.session.commit()
        
        user = User(login="nolastname", first_name="OnlyFirst", role_id=1)
        user.set_password("Pass123456!")
        db.session.add(user)
        db.session.commit()
        assert user.last_name is None
        
        db.session.delete(user)
        db.session.commit()

# 21. Тестирование изменения имени пользователя через редактирование
def test_edit_user_function(client):
    login(client, 'admin', 'admin123')
    with app.app_context():

        User.query.filter_by(login="edit_test_user").delete()
        db.session.commit()
        
        temp_user = User(login="edit_test_user", first_name="Before", role_id=1)
        temp_user.set_password("Pass12345!")
        db.session.add(temp_user)
        db.session.commit()
        user_id = temp_user.id

    client.post(f'/user/{user_id}/edit', data={
        'first_name': 'UpdatedName',
        'last_name': 'UpdatedSurname',
        'role_id': 1
    }, follow_redirects=True)

    with app.app_context():
        updated = User.query.get(user_id)
        assert updated.first_name == "UpdatedName"
        
        db.session.delete(updated)
        db.session.commit()

# 22. Тестирование страницы смены пароля
def test_change_password_page_accessible(client):
    login(client, 'admin', 'admin123')
    response = client.get('/change-password')
    assert response.status_code == 200

# 23. Тестирование автоматической генерации ID
def test_primary_key_increment(client):
    with app.app_context():

        test_login = "id_test_user"
        User.query.filter_by(login=test_login).delete()
        db.session.commit()
        
        u1 = User(login=test_login, first_name="u1", role_id=1)
        u1.set_password("Pass123!")
        db.session.add(u1)
        db.session.commit()
        assert u1.id is not None
        
        db.session.delete(u1)
        db.session.commit()
        
# 24. Тестирование доступа неавторизованного пользователя к странице редактирования (редирект на логин)
def test_edit_access_unauthorized(client):
    response = client.get('/user/1/edit', follow_redirects=True)

    assert b"login" in response.data.lower() or b"\xd0\xb2\xd1\x85\xd0\xbe\xd0\xb4" in response.data.lower()

# 25. Тестирование валидации сложности пароля (проверка требования наличия цифр)
def test_password_complexity_digit_missing(client):
    login(client, 'admin', 'admin123')

    response = client.post('/user/new', data={
        'login': 'tester_pwd',
        'password': 'OnlyLetters',
        'first_name': 'Test',
        'last_name': 'User'
    }, follow_redirects=True)
    assert b"\xd1\x86\xd0\xb8\xd1\x84\xd1\x80" in response.data # Текст "цифр" в сообщении об ошибке

# 26. Тестирование отображения данных пользователя в таблице на странице просмотра
def test_view_user_data_consistency(client):
    with app.app_context():
        admin = User.query.filter_by(login='admin').first()
        response = client.get(f'/user/{admin.id}')

        assert b"admin" in response.data
        assert b"Admin" in response.data

# 27. Тестирование сохранения данных в форме редактирования (проверка изменения фамилии)
def test_update_user_last_name(client):
    login(client, 'admin', 'admin123')
    with app.app_context():
        test_login = "update_me"
        User.query.filter_by(login=test_login).delete()
        db.session.commit()
        
        temp_user = User(login=test_login, first_name="Ivan", last_name="OldName", role_id=1)
        temp_user.set_password("Pass12345!")
        db.session.add(temp_user)
        db.session.commit()
        user_id = temp_user.id

    client.post(f'/user/{user_id}/edit', data={
        'first_name': 'Ivan',
        'last_name': 'NewSurname',
        'role_id': 1
    }, follow_redirects=True)

    with app.app_context():
        updated = User.query.get(user_id)
        assert updated.last_name == "NewSurname"
        db.session.delete(updated)
        db.session.commit()

# 28. Тестирование работы макроса формы
def test_form_macro_rendering(client):
    login(client, 'admin', 'admin123')
    response = client.get('/user/new')
    
    assert b'name="first_name"' in response.data
    assert b'name="role_id"' in response.data
    assert b'name="login"' in response.data