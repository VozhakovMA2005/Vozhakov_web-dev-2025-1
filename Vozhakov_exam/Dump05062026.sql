CREATE DATABASE  IF NOT EXISTS `std_1975_exam` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `std_1975_exam`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: std_1975_exam
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alembic_version`
--

DROP TABLE IF EXISTS `alembic_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alembic_version` (
  `version_num` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`version_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alembic_version`
--

LOCK TABLES `alembic_version` WRITE;
/*!40000 ALTER TABLE `alembic_version` DISABLE KEYS */;
INSERT INTO `alembic_version` VALUES ('c0a8a0356975');
/*!40000 ALTER TABLE `alembic_version` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `short_description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` int NOT NULL,
  `publisher` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `volume` int NOT NULL,
  `cover_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cover_id` (`cover_id`),
  CONSTRAINT `books_ibfk_1` FOREIGN KEY (`cover_id`) REFERENCES `covers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'Кот в мешке','Книга для детей от 8 лет/\n**авыа**\n* &gt; # ВАва',1944,'Oil','Степан',200,1),(2,'Принцесса и чудовище','*детская сказка* о красивой принцессе и ужасном чудовище из замка',2001,'Disney',' Бренда Чапман',359,2),(3,'вой','Вой ывв \n* вы \n* выс \n1. ывс \n2. ывс \n3. ысв \n#ААААААААА',1342,'voi','автор воя',2342,3),(4,'день','# **ыв** *ыв* ',2000,'den','автор дня',234242,4),(5,'лес','### цу цу цу',2011,'les','автор леса',1,5),(6,'огниво','Тень на Марсе\n2048 год. Колония на Марсе обнаруживает древний артефакт, способный менять реальность.\n«Они не первые, кто нашёл это. Но они первые, кто выжил.»\n\nАртефакт активируется раз в 100 лет\n\nЗемные корпорации готовят переворот\n\nГлавная героиня — инженер с тёмным прошлым',2011,'voi','автор огнива',350,6),(7,'Сотник','Убийство в тихом переулке\nЧастный детектив расследует смерть профессора, найденного в запертой комнате.\nУлики:\n\nразбитые часы в 3:15\n\nмокрый зонт без хозяина\n\nшифр на полях последней книги\n«Истина где-то рядом… слишком рядом.»',2000,'Oil','автор воя',31231,7),(8,'Cat','Три летних дня\nОна приехала на море забыть прошлое. Он — начать заново.\n~~Вместе им суждено было столкнуться~~\nОни выбрали это сами.\nРоман о том, как одна встреча меняет всё.\n\n«Ты не ищешь любовь. Она находит тебя, когда ты меньше всего готов.»',1944,'les','Степан',14,8),(10,'сом','Шёпот старого дома\nСемейная сага на фоне XX века.\nГлавные темы:\n\nчесть против долга\n\nотцы и дети\n\nлюбовь как проклятие\n\nРекомендуется к прочтению с чашкой чёрного кофе и тихой музыкой.',1973,'omm','ОМНИК_у',413,10),(11,'Сом 2: история пса','Драконий договор\n«Никогда не заключай сделок с драконами. Они помнят всё.»\n\nМолодой маг случайно активирует древний ритуал и становится защитником последнего дракона.\n\nВас ждут:\n1. магические дуэли\n2. полёты над туманными горами\n3. предательство со стороны тех, кому доверял\nalert(\'привет\')',2012,'Oil','автор огнива',3,11),(12,'Котик','Глаза в темноте\n~~Ты не один.~~ Ты никогда не был один.\n\nПсихолог начинает получать записки от пациента, который… исчез три года назад.\nКаждая глава — новый поворот.\n\n«Снимите эту книгу с полки. Но не читайте ночью.»',1566,'lesnik','Корней Иван',432,12),(13,'Путеводитель по шахматам','Соль и пепел\n1943 год. Оккупированная Франция.\n\nДве сестры:\n\nодна вступает в Сопротивление\n\nдругая работает переводчицей у нацистов\n\nСмогут ли они спасти друг друга, когда правда выйдет наружу?\n\nОсновано на реальных свидетельствах.',1912,'Канарейка','Чарли Чаплин',321,13),(14,'Коняшка','**Золото семи ветров**\n*~~Карта~~ ~~Компас~~ Только смелость.*\n\nАвантюристка Эйва отправляется на поиски затерянного храма в джунглях Амазонки.\n\n**В пути:**\n*пираты на Амазонке*\n\nловушки древней цивилизации\n\nнеожиданное открытие, которое перевернёт историю',1943,'les','Доред де Трое',433,14),(15,'Вишневый сад','# **Чей-то голос за стеной**\n**«Тишина. Скрип. Стук. Тишина.»**\n\nСемья переезжает в старый дом. В первую же ночь дочь начинает рисовать одно и то же:\n*фигуру без лица, стоящую в углу спальни родителе*й.\n\nОсторожно: содержатся сцены, нарушающие покой.',1917,'Вишневый сад','Чехов А.П.',541,15),(16,'ЯБЛОНЬКО','# &gt; Стихи о том, что внутри\n«Я пишу тебя на полях своих дней.»\n\n**Темы сборника:**\n\nтишина больших городов\n\nпервая любовь как сердечный приступ\n\nодиночество как искусство\n\nКаждое стихотворение — как вдох. Не выдыхайте.',913,'Валик','Синтей',321,16),(17,'Зимний иней','# **Ступени в никуда**\nОтец теряет работу. Сын поступает в платный вуз.\n**Мать выбирает, кого спасать.**\n\nРоман-катастрофа одной семьи.\n\nПодходит для: тех, кто хочет выплакаться и обняться с книгой.',1934,'Disney',' Бренда Чапман',2001,17),(18,'Варка','## Город, которого нет на картах\nЖурналистское расследование о заброшенных городах России:\n\n# Припять через 40 лет после аварии\n\nпосёлки Крайнего Севера, где до сих пор живут люди\n\n*фантомные станции метро*\n\nСотни фотографий, интервью, архивных данных.\n\n«Они не исчезли. Их просто перестали замечать.»',1934,'varennik','автор леса',111,18),(19,'Вой 2','# Выгорел. Инструкция по перезагрузке\n## Для тех, кто:\n\n**утром не хочет вставать**\n\n*забыл, когда смеялся в последний раз*\n\n*чувствует себя пустым, хотя всё «нормально»*\n\n«Вы не сломаны. Вы просто устали.»',2089,'den','автор воя',213,3),(20,'Синий иний','# тупени в никуда\n## Отец теряет работу. Сын поступает в платный вуз.\n*Мать выбирает, кого спасать.*\n\nРоман-катастрофа одной семьи.\n\nПодходит для: тех, кто хочет выплакаться и обняться с книгой.',1999,'Одк','автор дня',20000,16),(21,'Сонный конь','## Чей-то голос за стеной\n«Тишина. Скрип. Стук. Тишина.»\n\nСемья переезжает в старый дом. В первую же ночь дочь начинает рисовать одно и то же:\nфигуру без лица, стоящую в углу спальни родителей.\n\nОсторожно: содержатся сцены, нарушающие покой.',1231,'den','автор воя',7432,14),(22,'Окунь','одна вступает в Сопротивление\n\n',1953,'voi','Синий рыбак',776,19);
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `books_genres`
--

DROP TABLE IF EXISTS `books_genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books_genres` (
  `book_id` int NOT NULL,
  `genre_id` int NOT NULL,
  PRIMARY KEY (`book_id`,`genre_id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `books_genres_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  CONSTRAINT `books_genres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books_genres`
--

LOCK TABLES `books_genres` WRITE;
/*!40000 ALTER TABLE `books_genres` DISABLE KEYS */;
INSERT INTO `books_genres` VALUES (3,1),(5,1),(11,1),(12,1),(13,1),(14,1),(15,1),(17,1),(3,2),(6,2),(7,2),(13,2),(14,2),(15,2),(16,3),(11,4),(10,5),(2,6),(5,6),(1,7),(3,7),(5,7),(12,7),(18,7),(20,7),(3,8),(8,8),(10,8),(15,8),(19,8),(14,9),(16,9),(1,10),(5,10),(10,10),(12,10),(14,10),(17,10),(4,11),(11,11),(16,11),(2,12),(4,12),(6,12),(7,12),(11,12),(15,12),(19,12),(21,12),(1,13),(7,13),(10,13),(17,13),(21,13),(22,13),(13,14),(16,14),(11,15);
/*!40000 ALTER TABLE `books_genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `covers`
--

DROP TABLE IF EXISTS `covers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `covers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mime_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `md5_hash` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `covers`
--

LOCK TABLES `covers` WRITE;
/*!40000 ALTER TABLE `covers` DISABLE KEYS */;
INSERT INTO `covers` VALUES (1,'1_Снимок экрана (2408).png','image/png','a4d5f087a2f8a4d8c99e8decffeef8b4'),(2,'2_Принцесса.jpg','image/jpeg','50491d303342744876afd14a8eab6bba'),(3,'3_вой.jpg','image/jpeg','b7a0699aec5b6c4f73a42cc8cc86cce0'),(4,'4_день.jpg','image/jpeg','4424e0694da17f13c292dd7a01145160'),(5,'5_лес.jpg','image/jpeg','0be4b426beb7347b5f085f232ffafd9f'),(6,'6_огниво.jpg','image/jpeg','2f2ba62947c32f4361e893856970101e'),(7,'7_сотник.jpg','image/jpeg','01ee53dfcd898c470c2ac9b86581af4d'),(8,'8_кошка.jpg','image/jpeg','57142b34175fba9ce4ec38f79d9c3630'),(10,'10_сом.jpg','image/jpeg','0c9391f6da592850eed113fccbd2fd16'),(11,'11_пес.jpg','image/jpeg','a2a6fda6cfadd5afc5f2431e2808eab9'),(12,'12_ондатра.jpg','image/jpeg','7b82bafedf0721cccf749dd709eba6de'),(13,'13_шахмата.jpg','image/jpeg','60294d4fa995d0574ed1e659a3d0fe57'),(14,'14_конь.jpg','image/jpeg','490d62a4da2f47cad21ff388cde83ef2'),(15,'15_вишня.jpg','image/jpeg','1b5ec802cd8a662ff0f2787e16782b57'),(16,'16_яблоко.jpg','image/jpeg','db853e78d2d3836f2eadfcf8b64933ee'),(17,'17_иней.jpg','image/jpeg','4bf1653ad3021b5b42c9e73287e5db55'),(18,'18_варенник.jpg','image/jpeg','e3aa1a62a2c3d738f489a8802d5f66a2'),(19,'19_окунь.jpg','image/jpeg','729af3a970370b9be062c886c98273d3');
/*!40000 ALTER TABLE `covers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
INSERT INTO `genres` VALUES (13,'Биография и мемуары'),(2,'Детектив'),(12,'Драма'),(8,'Исторический роман'),(5,'Классика'),(4,'Научная литература'),(15,'Нон-фикшн (публицистика)'),(11,'Поэзия'),(9,'Приключения'),(14,'Психология и саморазвитие'),(3,'Роман'),(7,'Триллер'),(10,'Ужасы'),(1,'Фантастика'),(6,'Фэнтези');
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` int NOT NULL,
  `text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `book_id` (`book_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,1,2,'Не соответствует отзывам','2026-06-05 12:40:52'),(2,1,3,5,'Книга про дружбу мир и котов','2026-06-05 13:24:29');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Администратор','Полный доступ к управлению книгами, рецензиями и пользователями'),(2,'Модератор','Возможность редактировать рецензии и модерировать контент'),(3,'Пользователь','Возможность оставлять рецензии на книги');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `login` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `middle_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','scrypt:32768:8:1$BeuYic9djacHgA6M$1aafd6f728faa523664becb27aa92c5384c185b11e6dda5f2bf58a098b48ca1d9591062956b20095401f4aefade9147a647bf80ac9e2c1957be7f82978da8975','Вожаков','Михаил','Александрович',1),(2,'mod','scrypt:32768:8:1$obZaQ0Mrug12WHnC$27f509770fd6cbf5eaf77e55b63e6088dded7d3d126668082ebef33b12a1fb53e5af45716b1f5da66eec74e2c7c0561484d2efe7a06bda0ea78b913aa4ebf60c','Модератор','Петр','Иванов',2),(3,'user','scrypt:32768:8:1$t20DwRLVAV0yIc6J$314556c2906f6d07d5e5e69ccceef4c07b033ba0d9a25756784a55b89417ba1ffa2f02cb4bdde52beca813b95c672afcbff0e0f34ba280c8b32238d74ef904d7','Пользователь','Сергей','Кошкин',3);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-05 17:49:19
