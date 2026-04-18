from flask import Flask, render_template, request, make_response, redirect, url_for, session, flash
import re
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

app = Flask(__name__)
app.config['SECRET_KEY'] = 'lab3_secret_key_2026'

login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = "Для доступа к запрашиваемой странице необходимо пройти процедуру аутентификации."
login_manager.login_message_category = "warning"

USERS_DATA = {
    "user": "qwerty",
    "admin": "8951",
    "mike": "8951"
}

class User(UserMixin):
    def __init__(self, id):
        self.id = id

@login_manager.user_loader
def load_user(user_id):
    if user_id in USERS_DATA:
        return User(user_id)
    return None

def validate_phone(num):
    if not re.match(r'^[0-9\s\(\)\-\.\+]+$', num):
        return None, "Недопустимый ввод. В номере телефона встречаются недопустимые символы."
    digits = ''.join(filter(str.isdigit, num))
    raw_stripped = num.strip()
    is_russian_start = raw_stripped.startswith('+7') or raw_stripped.startswith('8')
    if is_russian_start:
        if len(digits) != 11:
            return None, "Недопустимый ввод. Неверное количество цифр."
    else:
        if len(digits) != 10:
            return None, "Недопустимый ввод. Неверное количество цифр."
    d = digits[-10:]
    formatted_phone = f"8-{d[:3]}-{d[3:6]}-{d[6:8]}-{d[8:]}"
    return formatted_phone, None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/form_input', methods=['GET', 'POST'])
def form_input():
    if request.method == 'POST':
        session['last_form_data'] = request.form.to_dict()
        return redirect(url_for('url_params', **request.form))
    return render_template('form_input.html')

@app.route('/url_params')
def url_params():
    return render_template('url_params.html', 
                           full_url=request.url, 
                           params=request.args)

@app.route('/headers')
def headers():
    return render_template('headers.html', headers=request.headers)

@app.route('/cookies')
def cookies():
    target_cookie = 'lab2_test_cookie'
    system_cookies = ['session', 'sessionid', 'csrftoken']
    exists = target_cookie in request.cookies
    filtered_cookies = {
        key: value for key, value in request.cookies.items() 
        if key not in system_cookies
    }
    resp = make_response(render_template('cookies.html', cookies=filtered_cookies))
    if exists:
        resp.delete_cookie(target_cookie)
    else:
        resp.set_cookie(target_cookie, 'Hello_from_Lab2')
    return resp

@app.route('/form_params')
def form_params():
    data = session.get('last_form_data', None)
    return render_template('form_params.html', form_data=data)

@app.route('/phone', methods=['GET', 'POST'])
def phone():
    error, formatted, raw = None, None, ''
    if request.method == 'POST':
        raw = request.form.get('phone_number', '')
        formatted, error = validate_phone(raw)
    return render_template('phone.html', error=error, formatted=formatted, phone_input=raw)

@app.route('/posts')
def posts(): return render_template('index.html')

@app.route('/about')
def about(): return render_template('index.html')

@app.route('/counter')
def counter():
    user_id = current_user.id if current_user.is_authenticated else "guest"
    counter_key = f"visits_{user_id}"
    session[counter_key] = session.get(counter_key, 0) + 1
    return render_template('counter.html', visits=session[counter_key])

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        remember = request.form.get('remember') == 'on'
        if username in USERS_DATA and USERS_DATA[username] == password:
            user = User(username)
            login_user(user, remember=remember)
            flash('Успешный вход!', 'success')
            next_page = request.args.get('next')
            return redirect(next_page or url_for('index'))
        else:
            flash('Неверный логин или пароль.', 'danger')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/secret')
@login_required
def secret():
    return render_template('secret.html')

if __name__ == '__main__':
    app.run(debug=True)