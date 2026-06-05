from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required
from app.models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        login = request.form.get('login')
        password = request.form.get('password')
        remember = request.form.get('remember') == 'on'

        user = User.query.filter_by(login=login).first()
        # В СУБД пароли должны храниться в виде хэшей (werkzeug.security.generate_password_hash)
        if user and user.check_password(password):
            login_user(user, remember=remember)
            flash('Вы успешно вошли в систему.', 'success')
            return redirect(url_for('books.index'))
        else:
            flash('Невозможно аутентифицироваться с указанными логином и паролем', 'danger')

    return render_template('auth/login.html')

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('books.index'))