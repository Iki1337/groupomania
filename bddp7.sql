-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: localhost    Database: bddp7
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `idUser` smallint unsigned NOT NULL,
  `idPost` smallint unsigned NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `date_ecriture` datetime NOT NULL,
  `contenu` text NOT NULL,
  `statut_moderation` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_comments_idUser` (`idUser`),
  KEY `fk_comments_idPost` (`idPost`),
  CONSTRAINT `fk_comments_idPost` FOREIGN KEY (`idPost`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comments_idUser` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES ();
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `idEnvoyeur` smallint unsigned NOT NULL,
  `idDestinataire` smallint unsigned NOT NULL,
  `date_ecriture` datetime NOT NULL,
  `contenu` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_messages_idEnvoyeur` (`idEnvoyeur`),
  KEY `fk_messages_idDestinataire` (`idDestinataire`),
  CONSTRAINT `fk_messages_idDestinataire` FOREIGN KEY (`idDestinataire`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_messages_idEnvoyeur` FOREIGN KEY (`idEnvoyeur`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES ();
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `idUser` smallint unsigned NOT NULL,
  `date_ecriture` datetime NOT NULL,
  `statut_moderation` tinyint(1) NOT NULL,
  `contenu` text NOT NULL,
  `tableau_users_like` json DEFAULT NULL,
  `urls_images` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_users_id` (`idUser`),
  CONSTRAINT `fk_users_id` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES ();
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(200) NOT NULL,
  `sexe` tinyint(1) DEFAULT NULL,
  `derniere_connexion` datetime DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `date_inscription` datetime NOT NULL,
  `droits` tinyint(1) NOT NULL,
  `url_photo_profil` varchar(500) DEFAULT 'http://localhost:3000/images/default.png',
  `url_photo_mur` varchar(500) DEFAULT 'http://localhost:3000/images/milky.jpg',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  FULLTEXT KEY `ind_full_nom` (`nom`),
  FULLTEXT KEY `ind_full_prenom` (`prenom`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Man','Spider','spiderman@gmail.com',0,'2020-11-11 17:52:29','$2b$10$mbPjw8r0Vtwl.j9Un3yHBu9IWIYnccHf3CfqPk0czetGMS2VKQUO2','2020-09-25 13:51:24',0,'http://localhost:3000/images/spiderman.png1601035281103.png','http://localhost:3000/images/newyork.PNG1601035296623.png');
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

-- Dump completed on 2020-11-16 16:21:03
