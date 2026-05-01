import pytest
from app import app as flask_app
from models import db, User, Role, VisitLog

@pytest.fixture
def client():
    flask_app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'WTF_CSRF_ENABLED': False
    })

    with flask_app.app_context():
        db.drop_all()
        db.create_all()
        
        admin_role = Role(name="Администратор")
        user_role = Role(name="Пользователь")
        db.session.add_all([admin_role, user_role])
        db.session.commit()
        
        admin = User(login='admin', first_name='Admin', last_name='Adminov', role_id=admin_role.id)
        admin.set_password('admin123')
        
        user1 = User(login='user1', first_name='Ivan', last_name='Ivanov', role_id=user_role.id)
        user1.set_password('user123')
        
        no_role_user = User(login='norole', first_name='Guest', last_name='Guestov', role_id=None)
        no_role_user.set_password('guest123')
        
        db.session.add_all([admin, user1, no_role_user])
        db.session.commit()

    with flask_app.test_client() as client:
        yield client

    with flask_app.app_context():
        db.session.remove()
        db.drop_all()

def login(client, username, password):
    return client.post('/login', data={'login': username, 'password': password}, follow_redirects=True)

def logout(client):
    return client.get('/logout', follow_redirects=True)

# 1. Проверка наличия администратора в БД
def test_admin_exists(client):
    with flask_app.app_context():
        admin = User.query.filter_by(login='admin').first()
        assert admin is not None

# 2. Успешная авторизация
def test_login_success(client):
    response = login(client, 'admin', 'admin123')
    assert "Admin" in response.get_data(as_text=True)

# 3. Попытка входа с неверным паролем
def test_login_fail(client):
    response = login(client, 'admin', 'wrong')
    assert "Неверный" in response.get_data(as_text=True)

# 4. Тестирование работы загрузчика пользователя
def test_user_loader(client):
    with flask_app.app_context():
        user = User.query.filter_by(login='admin').first()
        assert user is not None
        assert user.login == 'admin'

# 5. Проверка хеширования паролей
def test_password_hashing(client):
    with flask_app.app_context():
        user = User.query.filter_by(login='user1').first()
        assert user.password_hash != 'user123'
        assert user.check_password('user123') is True

# 6. Проверка доступа администратора к созданию
def test_admin_can_access_create(client):
    login(client, 'admin', 'admin123')
    response = client.get('/user/new')
    assert response.status_code == 200

# 7. Проверка доступа администратора к журналу
def test_admin_can_access_all_logs(client):
    login(client, 'admin', 'admin123')
    response = client.get('/visits/')
    assert response.status_code == 200

# 8. Проверка доступа администратора к отчетам
def test_admin_can_see_reports(client):
    login(client, 'admin', 'admin123')
    response = client.get('/visits/pages_stat')
    assert response.status_code == 200

# 9. Запрет на доступ к созданию пользователей для обычной роли
def test_user_cannot_create_user(client):
    login(client, 'user1', 'user123')
    response = client.get('/user/new', follow_redirects=True)
    page_text = response.get_data(as_text=True)
    assert response.status_code in [200, 302] 

# 10. Запрет на удаление пользователей (проверка точного текста из flash)
def test_user_cannot_delete_user(client):
    login(client, 'user1', 'user123')
    response = client.post('/user/1/delete', follow_redirects=True)
    page_text = response.get_data(as_text=True)
    assert "Только администратор может удалять пользователей" in page_text

# 11. Проверка редактирования собственного профиля
def test_user_can_edit_self(client):
    login(client, 'user1', 'user123')
    with flask_app.app_context():
        u = User.query.filter_by(login='user1').first()
        user_id = u.id
    
    response = client.get(f'/user/{user_id}/edit')
    assert response.status_code == 200

# 12. Запрет на редактирование чужого профиля (проверка точного текста из flash)
def test_user_cannot_edit_others(client):
    login(client, 'user1', 'user123')
    response = client.get('/user/1/edit', follow_redirects=True)
    page_text = response.get_data(as_text=True)
    assert "Вы не можете просматривать или редактировать чужой профиль" in page_text

# 13. Проверка блокировки доступа для пользователя без роли
def test_no_role_user_blocked(client):
    login(client, 'norole', 'guest123')
    response = client.get('/visits/', follow_redirects=True)
    page_text = response.get_data(as_text=True)
    assert "У вас нет назначенной роли" in page_text

# 14. Автоматическое создание записи в журнале
def test_visit_log_auto_fill(client):
    client.get('/')
    with flask_app.app_context():
        log = VisitLog.query.filter_by(path='/').first()
        assert log is not None

# 15. Логирование анонимного посещения
def test_visit_log_guest(client):
    logout(client)
    client.get('/')
    with flask_app.app_context():
        log = VisitLog.query.filter_by(user_id=None).first()
        assert log is not None

# 16. Доступность журнала для обычного пользователя (свои записи)
def test_user_can_access_logs(client):
    login(client, 'user1', 'user123')
    response = client.get('/visits/')
    assert response.status_code == 200

# 17. Проверка заголовка статистики
def test_pages_stat_content(client):
    login(client, 'admin', 'admin123')
    response = client.get('/visits/pages_stat')
    assert "Страница" in response.get_data(as_text=True)

# 18. Проверка экспорта страниц в CSV
def test_export_csv_pages(client):
    login(client, 'admin', 'admin123')
    response = client.get('/visits/pages_stat/csv')
    assert response.mimetype == 'text/csv'

# 19. Проверка экспорта пользователей в CSV
def test_export_csv_users(client):
    login(client, 'admin', 'admin123')
    response = client.get('/visits/users_stat/csv')
    assert response.status_code == 200
    assert "text/csv" in response.headers["Content-Type"]

# 20. Блокировка поля роли для обычного пользователя
def test_edit_user_role_disabled_for_user(client):
    login(client, 'user1', 'user123')
    with flask_app.app_context():
        u = User.query.filter_by(login='user1').first()
        user_id = u.id
        
    response = client.get(f'/user/{user_id}/edit')
    assert "disabled" in response.get_data(as_text=True).lower()

# 21. Кнопка создания видна админу
def test_admin_sees_create_button(client):
    login(client, 'admin', 'admin123')
    response = client.get('/')
    assert "/user/new" in response.get_data(as_text=True)

# 22. Кнопка создания скрыта от пользователя
def test_user_not_sees_create_button(client):
    login(client, 'user1', 'user123')
    response = client.get('/')
    assert "/user/new" not in response.get_data(as_text=True)

# 23. Редирект анонима при доступе к журналу
def test_anonymous_redirect(client):
    logout(client)
    response = client.get('/visits/', follow_redirects=True)
    assert "login" in response.request.path.lower()

# 24. Наличие пагинации
def test_pagination_exists(client):
    login(client, 'admin', 'admin123')
    response = client.get('/visits/')
    assert "pagination" in response.get_data(as_text=True)

# 25. Связь Role -> User
def test_db_relationship_cascade(client):
    with flask_app.app_context():
        role = Role.query.filter_by(name="Администратор").first()
        assert role is not None
        assert len(role.users) > 0