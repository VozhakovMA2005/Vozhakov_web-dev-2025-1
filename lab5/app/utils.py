from functools import wraps
from flask import flash, redirect, url_for
from flask_login import current_user

def check_rights(action):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated:
                return redirect(url_for('login'))

            user_role = current_user.role_obj.name if current_user.role_obj else None

            if not user_role:
                flash("У вас нет назначенной роли. Доступ к функциям системы ограничен.", "danger")
                return redirect(url_for('index'))

            if action == 'view_logs':
                return f(*args, **kwargs)

            if action == 'reports' and user_role != "Администратор":
                flash("У вас недостаточно прав для просмотра отчетов.", "danger")
                return redirect(url_for('index'))

            if action == 'delete' and user_role != "Администратор":
                flash("Только администратор может удалять пользователей.", "danger")
                return redirect(url_for('index'))

            if action in ['edit', 'view']:
                target_user_id = kwargs.get('user_id')
                if user_role != "Администратор" and str(target_user_id) != str(current_user.id):
                    flash("Вы не можете просматривать или редактировать чужой профиль.", "danger")
                    return redirect(url_for('index'))

            return f(*args, **kwargs)
        return decorated_function
    return decorator