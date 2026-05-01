from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from models import db, User, Role, VisitLog
from utils import check_rights
import re
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'lab5_secret_key_2026')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///lab5.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = "Для доступа к запрашиваемой странице необходимо пройти процедуру аутентификации."
login_manager.login_message_category = "warning"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.before_request
def log_visit():
    if request.endpoint and not request.endpoint.startswith('static'):
        user_id = current_user.id if current_user.is_authenticated else None
        log = VisitLog(path=request.path, user_id=user_id)
        db.session.add(log)
        try:
            db.session.commit()
        except Exception:
            db.session.rollback()

def validate_password(pwd):
    if len(pwd) < 8 or len(pwd) > 128: return "Пароль должен содержать от 8 до 128 символов."
    if not re.search(r'[A-ZА-ЯЁ]', pwd): return "Требуется минимум одна заглавная буква."
    if not re.search(r'[a-zа-яё]', pwd): return "Требуется минимум одна строчная буква."
    if not re.search(r'\d', pwd): return "Требуется минимум одна цифра."
    if re.search(r'\s', pwd): return "Пробелы недопустимы."
    allowed = r"^[A-Za-zА-Яа-яЁё0-9\~\!\?\@\#\$\%\^\&\*\_\-\+\(\)\[\]\{\}\>\<\/\\|\"\'\.\,\:\;]+$"
    if not re.match(allowed, pwd): return "Пароль содержит недопустимые символы."
    return None

def validate_login(login):
    if len(login) < 5: return "Логин должен содержать не менее 5 символов."
    if not re.match(r'^[A-Za-z0-9]+$', login): return "Только латинские буквы и цифры."
    return None

from visits import visits_bp
app.register_blueprint(visits_bp, url_prefix='/visits')

@app.route('/')
def index():
    users = User.query.all()
    return render_template('index.html', users=users)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    if request.method == 'POST':
        login_val = request.form.get('login')
        password_val = request.form.get('password')
        user = User.query.filter_by(login=login_val).first()
        if user and user.check_password(password_val):
            login_user(user)
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

@app.route('/user/<int:user_id>')
@login_required
@check_rights('view')
def view_user(user_id):
    user = User.query.get_or_404(user_id)
    return render_template('view.html', user=user)

@app.route('/user/new', methods=['GET', 'POST'])
@login_required
@check_rights('create')
def create_user():
    roles = Role.query.all()
    errors = {}
    form_data = {}
    if request.method == 'POST':
        form_data = request.form.to_dict()
        if not form_data.get('login'): errors['login'] = "Поле не может быть пустым."
        else:
            err = validate_login(form_data.get('login'))
            if err: errors['login'] = err
            elif User.query.filter_by(login=form_data.get('login')).first():
                errors['login'] = "Логин уже занят."
        if not form_data.get('password'): errors['password'] = "Поле не может быть пустым."
        else:
            err = validate_password(form_data.get('password'))
            if err: errors['password'] = err
        if not form_data.get('last_name'): errors['last_name'] = "Поле не может быть пустым."
        if not form_data.get('first_name'): errors['first_name'] = "Поле не может быть пустым."
        
        if not errors:
            new_user = User(
                login=form_data.get('login'),
                last_name=form_data.get('last_name'),
                first_name=form_data.get('first_name'),
                middle_name=form_data.get('middle_name'),
                role_id=form_data.get('role_id') if form_data.get('role_id') else None
            )
            new_user.set_password(form_data.get('password'))
            try:
                db.session.add(new_user)
                db.session.commit()
                flash('Пользователь успешно создан!', 'success')
                return redirect(url_for('index'))
            except Exception as e:
                db.session.rollback()
                flash('Ошибка при сохранении в БД.', 'danger')
    return render_template('create.html', roles=roles, errors=errors, form_data=form_data)

@app.route('/user/<int:user_id>/edit', methods=['GET', 'POST'])
@login_required
@check_rights('edit')
def edit_user(user_id):
    user = User.query.get_or_404(user_id)
    roles = Role.query.all()
    is_admin = current_user.role_obj and current_user.role_obj.name == "Администратор"
    errors = {}
    form_data = {
        'last_name': user.last_name,
        'first_name': user.first_name,
        'middle_name': user.middle_name,
        'role_id': str(user.role_id)
    }
    if request.method == 'POST':
        form_data = request.form.to_dict()
        if not form_data.get('last_name'): errors['last_name'] = "Поле не может быть пустым."
        if not form_data.get('first_name'): errors['first_name'] = "Поле не может быть пустым."
        
        if not errors:
            user.last_name = form_data.get('last_name')
            user.first_name = form_data.get('first_name')
            user.middle_name = form_data.get('middle_name')
            
            if is_admin:
                user.role_id = form_data.get('role_id') if form_data.get('role_id') else None
            
            try:
                db.session.commit()
                flash('Данные успешно обновлены!', 'success')
                return redirect(url_for('index'))
            except Exception as e:
                db.session.rollback()
                flash('Ошибка при обновлении в БД.', 'danger')
    return render_template('edit.html', user=user, roles=roles, errors=errors, form_data=form_data, is_edit=True)

@app.route('/user/<int:user_id>/delete', methods=['POST'])
@login_required
@check_rights('delete')
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    try:
        db.session.delete(user)
        db.session.commit()
        flash('Пользователь удален.', 'success')
    except Exception as e:
        db.session.rollback()
        flash('Ошибка при удалении.', 'danger')
    return redirect(url_for('index'))

@app.route('/change-password', methods=['GET', 'POST'])
@login_required
def change_password():
    errors = {}
    if request.method == 'POST':
        old_pwd = request.form.get('old_password')
        new_pwd = request.form.get('new_password')
        conf_pwd = request.form.get('confirm_password')
        
        if not current_user.check_password(old_pwd):
            errors['old_password'] = "Неверный старый пароль."
        err = validate_password(new_pwd)
        if err: errors['new_password'] = err
        if new_pwd != conf_pwd:
            errors['confirm_password'] = "Пароли не совпадают."
            
        if not errors:
            current_user.set_password(new_pwd)
            db.session.commit()
            flash('Пароль успешно изменен!', 'success')
            return redirect(url_for('index'))
            
    return render_template('change_password.html', errors=errors)

from visits import visits_bp
if not app.blueprints.get('visits'):
    app.register_blueprint(visits_bp, url_prefix='/visits')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        if not Role.query.first():
            admin_role = Role(name="Администратор", description="Полные права")
            user_role = Role(name="Пользователь", description="Базовые права")
            db.session.add(admin_role)
            db.session.add(user_role)
            db.session.commit()
            print("Роли созданы успешно.")

        if not User.query.first():
            admin_role = Role.query.filter_by(name="Администратор").first()
            first_user = User(
                login="admin",
                first_name="Admin",
                last_name="System",
                role_id=admin_role.id
            )
            first_user.set_password("admin123") 
            db.session.add(first_user)
            db.session.commit()
            print("Создан первичный пользователь: login: admin, password: admin123")

    app.run(debug=True)