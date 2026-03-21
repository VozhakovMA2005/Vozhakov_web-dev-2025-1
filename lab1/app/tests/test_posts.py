import pytest
from flask import template_rendered
from app import app, posts_list

@pytest.fixture
def captured_templates(app):
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

# попытки получения доступа

# Проверка доступности главной страницы
def test_index_status(client):
    assert client.get("/").status_code == 200

# Проверка доступности страницы со списком постов
def test_posts_status(client):
    assert client.get("/posts").status_code == 200

# Проверка доступности страницы 'Об авторе'
def test_about_status(client):
    assert client.get("/about").status_code == 200

# Проверка доступности страницы одного поста
def test_single_post_status(client):
    assert client.get("/posts/0").status_code == 200

# Проверка возврата 404 при несуществующем ID
def test_post_not_found_404(client):
    assert client.get("/posts/999").status_code == 404

# при рендеринге страниц используются правильные шаблоны

# Проверка использования правильного шаблона для списка постов
def test_posts_template_used(client, captured_templates):
    client.get('/posts')
    template, _ = captured_templates[0]
    assert template.name == 'posts.html'
    
# Проверка использования правильного шаблона для страницы поста
def test_post_detail_template_used(client, captured_templates):
    client.get('/posts/0')
    template, _ = captured_templates[0]
    assert template.name == 'post.html'

# Проверка передачи необходимых данных в шаблон поста
def test_post_context_data(client, captured_templates):
    client.get('/posts/0')
    _, context = captured_templates[0]
    assert 'post' in context
    assert 'title' in context

# в результате рендеринга на странице присутствуют все данные поста и
# дата публикации отображается в правильном формате

# Наличие заголовка поста в HTML
def test_post_content_title(client):
    p = posts_list()[0]
    response = client.get('/posts/0').data.decode('utf-8')
    assert p['title'] in response

# Наличие имени автора в HTML
def test_post_content_author(client):
    p = posts_list()[0]
    response = client.get('/posts/0').data.decode('utf-8')
    assert p['author'] in response

# Наличие текста поста в HTML
def test_post_content_text(client):
    p = posts_list()[0]
    response = client.get('/posts/0').data.decode('utf-8')
    assert p['text'][:100] in response

# Наличие ссылки на изображение
def test_post_content_image(client):
    p = posts_list()[0]
    response = client.get('/posts/0').data.decode('utf-8')
    assert p['image_id'] in response

# Проверка правильного формата даты
def test_date_format_validation(client):
    p = posts_list()[0]
    formatted_date = p['date'].strftime('%d.%m.%Y')
    response = client.get('/posts/0').data.decode('utf-8')
    assert formatted_date in response

# Проверка наличия формы комментариев
def test_comment_form_exists(client):
    response = client.get('/posts/0').data.decode('utf-8')
    assert 'Оставьте комментарий' in response
    assert '<textarea' in response

# Проверка наличия футера с ФИО
def test_footer_presence(client):
    response = client.get('/').data.decode('utf-8')
    assert '<footer' in response
    assert 'Вожаков Михаил Александрович' in response 

# Проверка, что посты отсортированы
def test_posts_list_sorting(client):
    posts = posts_list()
    assert posts[0]['date'] >= posts[-1]['date']