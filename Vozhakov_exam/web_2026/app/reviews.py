from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required, current_user
from app.models import Review, Book, db
from app.utils import check_rights, sanitize_text

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/book/<int:book_id>/review', methods=['GET', 'POST'])
@login_required
@check_rights('Администратор', 'Модератор', 'Пользователь')
def add_review(book_id):
    book = Book.query.get_or_404(book_id)
    
    # Проверка: писал ли уже пользователь рецензию на эту книгу
    existing_review = Review.query.filter_by(book_id=book_id, user_id=current_user.id).first()
    if existing_review:
        flash('Вы уже оставили рецензию на эту книгу.', 'warning')
        return redirect(url_for('books.view', book_id=book_id))

    if request.method == 'POST':
        rating = request.form.get('rating')
        text = sanitize_text(request.form.get('text'))

        try:
            review = Review(book_id=book_id, user_id=current_user.id, rating=int(rating), text=text)
            db.session.add(review)
            db.session.commit()
            flash('Рецензия успешно добавлена!', 'success')
            return redirect(url_for('books.view', book_id=book_id))
        except Exception as e:
            db.session.rollback()
            flash('При сохранении данных возникла ошибка. Проверьте корректность введённых данных.', 'danger')

    return render_template('reviews/form.html', book=book)