from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app
from flask_login import login_required, current_user
from app.models import Book, Genre, Cover, db
from app.utils import check_rights, sanitize_text
import os
import hashlib
import markdown

books_bp = Blueprint('books', __name__)

@books_bp.route('/')
def index():
    page = request.args.get('page', 1, type=int)
    
    # Параметры поиска
    title = request.args.get('title', '')
    genres_ids = request.args.getlist('genre')
    years = request.args.getlist('year')
    vol_from = request.args.get('volume_from', '')
    vol_to = request.args.get('volume_to', '')
    author = request.args.get('author', '')

    query = Book.query

    if title:
        query = query.filter(Book.title.ilike(f'%{title}%'))
    if author:
        query = query.filter(Book.author.ilike(f'%{author}%'))
    if genres_ids:
        query = query.filter(Book.genres.any(Genre.id.in_(genres_ids)))
    if years:
        query = query.filter(Book.year.in_(years))
    if vol_from.isdigit():
        query = query.filter(Book.volume >= int(vol_from))
    if vol_to.isdigit():
        query = query.filter(Book.volume <= int(vol_to))

    # Сортировка - сначала новые
    query = query.order_by(Book.year.desc())
    pagination = query.paginate(page=page, per_page=10)
    
    all_genres = Genre.query.all()
    all_years = [y[0] for y in db.session.query(Book.year).distinct().order_by(Book.year.desc()).all()]

    return render_template('index.html', pagination=pagination, books=pagination.items, 
                           genres=all_genres, years=all_years)

@books_bp.route('/book/<int:book_id>')
def view(book_id):
    book = Book.query.get_or_404(book_id)
    html_desc = markdown.markdown(book.short_description)
    user_review = None
    if current_user.is_authenticated:
        from app.models import Review
        user_review = Review.query.filter_by(book_id=book.id, user_id=current_user.id).first()
        
    return render_template('books/view.html', book=book, html_desc=html_desc, user_review=user_review)

@books_bp.route('/book/add', methods=['GET', 'POST'])
@login_required
@check_rights('Администратор')
def add():
    genres = Genre.query.all()
    if request.method == 'POST':
        title = request.form.get('title')
        short_description = sanitize_text(request.form.get('short_description'))
        year = request.form.get('year')
        publisher = request.form.get('publisher')
        author = request.form.get('author')
        volume = request.form.get('volume')
        selected_genres = request.form.getlist('genres')
        cover_file = request.files.get('cover')

        try:
            # Обработка обложки (MD5 проверка)
            file_data = cover_file.read()
            md5_hash = hashlib.md5(file_data).hexdigest()
            cover = Cover.query.filter_by(md5_hash=md5_hash).first()
            
            if not cover:
                cover = Cover(file_name=cover_file.filename, mime_type=cover_file.mimetype, md5_hash=md5_hash)
                db.session.add(cover)
                db.session.commit()
                # Сохраняем физически используя ID
                cover.file_name = f"{cover.id}_{cover_file.filename}"
                db.session.commit()
                cover_file.seek(0)
                cover_file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], cover.file_name))

            book = Book(title=title, short_description=short_description, year=year,
                        publisher=publisher, author=author, volume=volume, cover_id=cover.id)
            book.genres = Genre.query.filter(Genre.id.in_(selected_genres)).all()
            db.session.add(book)
            db.session.commit()
            flash('Книга успешно добавлена!', 'success')
            return redirect(url_for('books.view', book_id=book.id))
        except Exception as e:
            db.session.rollback()
            flash('При сохранении данных возникла ошибка. Проверьте корректность введённых данных.', 'danger')

    return render_template('books/form.html', genres=genres, book=None)

@books_bp.route('/book/<int:book_id>/edit', methods=['GET', 'POST'])
@login_required
@check_rights('Администратор', 'Модератор')
def edit(book_id):
    book = Book.query.get_or_404(book_id)
    genres = Genre.query.all()
    if request.method == 'POST':
        try:
            book.title = request.form.get('title')
            book.short_description = sanitize_text(request.form.get('short_description'))
            book.year = request.form.get('year')
            book.publisher = request.form.get('publisher')
            book.author = request.form.get('author')
            book.volume = request.form.get('volume')
            book.genres = Genre.query.filter(Genre.id.in_(request.form.getlist('genres'))).all()
            
            db.session.commit()
            flash('Книга успешно обновлена!', 'success')
            return redirect(url_for('books.view', book_id=book.id))
        except Exception as e:
            db.session.rollback()
            flash('При сохранении данных возникла ошибка.', 'danger')
            
    return render_template('books/form.html', genres=genres, book=book)

@books_bp.route('/book/<int:book_id>/delete', methods=['POST'])
@login_required
@check_rights('Администратор')
def delete(book_id):
    book = Book.query.get_or_404(book_id)
    cover = book.cover
    try:
        db.session.delete(book)
        db.session.commit()
        # Проверяем, используется ли обложка другими книгами
        if not Book.query.filter_by(cover_id=cover.id).first():
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], cover.file_name)
            if os.path.exists(file_path):
                os.remove(file_path)
            db.session.delete(cover)
            db.session.commit()
        flash(f'Книга "{book.title}" успешно удалена.', 'success')
    except:
        db.session.rollback()
        flash('Ошибка при удалении книги.', 'danger')
    return redirect(url_for('books.index'))