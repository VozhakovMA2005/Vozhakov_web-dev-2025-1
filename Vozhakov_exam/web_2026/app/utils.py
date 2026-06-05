from functools import wraps
from flask import flash, redirect, url_for
from flask_login import current_user
import bleach

def check_rights(*roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if current_user.role.name not in roles:
                flash('У вас недостаточно прав для выполнения данного действия', 'danger')
                return redirect(url_for('books.index'))
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def sanitize_text(text):
    allowed_tags = ['b', 'i', 'strong', 'em', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'p', 'br', 'a']
    return bleach.clean(text, tags=allowed_tags)