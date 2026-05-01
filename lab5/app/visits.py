import csv
import io
from flask import Blueprint, render_template, request, Response
from flask_login import login_required, current_user
from sqlalchemy import func
from models import db, VisitLog, User
from utils import check_rights

visits_bp = Blueprint('visits', __name__)

@visits_bp.route('/')
@login_required
@check_rights('view_logs')
def logs():
    page = request.args.get('page', 1, type=int)
    is_admin = (current_user.role_obj.name == 'Администратор') if current_user.role_obj else False
    
    query = VisitLog.query
    if not is_admin:
        query = query.filter_by(user_id=current_user.id)
        
    pagination = query.order_by(VisitLog.created_at.desc()).paginate(page=page, per_page=10, error_out=False)
    return render_template('visits/logs.html', pagination=pagination, is_admin=is_admin)

@visits_bp.route('/pages_stat')
@login_required
@check_rights('reports')
def pages_stat():
    stats = db.session.query(
        VisitLog.path, func.count(VisitLog.id).label('count')
    ).group_by(VisitLog.path).order_by(func.count(VisitLog.id).desc()).all()
    return render_template('visits/pages_stat.html', stats=stats)

@visits_bp.route('/pages_stat/csv')
@login_required
@check_rights('reports')
def pages_stat_csv():
    stats = db.session.query(
        VisitLog.path, func.count(VisitLog.id).label('count')
    ).group_by(VisitLog.path).order_by(func.count(VisitLog.id).desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output, delimiter=';')
    writer.writerow(['№', 'Страница', 'Количество посещений'])
    for i, stat in enumerate(stats, 1):
        writer.writerow([i, stat.path, stat.count])
        
    response = Response(output.getvalue(), mimetype='text/csv')
    response.headers["Content-Disposition"] = "attachment;filename=pages_stat.csv"
    response.headers["Content-Type"] = "text/csv; charset=utf-8-sig"
    return response

@visits_bp.route('/users_stat')
@login_required
@check_rights('reports')
def users_stat():
    stats = db.session.query(
        VisitLog.user_id, func.count(VisitLog.id).label('count')
    ).group_by(VisitLog.user_id).order_by(func.count(VisitLog.id).desc()).all()
    
    users_map = {u.id: u for u in User.query.all()}
    data = []
    for s in stats:
        if s.user_id:
            u = users_map.get(s.user_id)
            name = f"{u.last_name or ''} {u.first_name} {u.middle_name or ''}".strip() if u else "Неизвестно"
        else:
            name = "Неаутентифицированный пользователь"
        data.append({'name': name, 'count': s.count})
        
    return render_template('visits/users_stat.html', stats=data)

@visits_bp.route('/users_stat/csv')
@login_required
@check_rights('reports')
def users_stat_csv():
    stats = db.session.query(
        VisitLog.user_id, func.count(VisitLog.id).label('count')
    ).group_by(VisitLog.user_id).order_by(func.count(VisitLog.id).desc()).all()
    
    users_map = {u.id: u for u in User.query.all()}
    output = io.StringIO()
    writer = csv.writer(output, delimiter=';')
    writer.writerow(['№', 'Пользователь', 'Количество посещений'])
    
    for i, s in enumerate(stats, 1):
        if s.user_id:
            u = users_map.get(s.user_id)
            name = f"{u.last_name or ''} {u.first_name} {u.middle_name or ''}".strip() if u else "Неизвестно"
        else:
            name = "Неаутентифицированный пользователь"
        writer.writerow([i, name, s.count])
        
    response = Response(output.getvalue(), mimetype='text/csv')
    response.headers["Content-Disposition"] = "attachment;filename=users_stat.csv"
    response.headers["Content-Type"] = "text/csv; charset=utf-8-sig"
    return response