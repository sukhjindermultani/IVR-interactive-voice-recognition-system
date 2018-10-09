-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Sep 16, 2015 at 08:39 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `eivr_db`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sproc_AuthenticateUser`(IN p_username VARCHAR(32), IN p_password VARCHAR(32))
BEGIN
   DECLARE v_user_id int(10) unsigned;
   DECLARE v_user_role_name VARCHAR(50);
  -- DELETE FROM user_tokens WHERE date_created < DATE_SUB(NOW(), INTERVAL 30 MINUTE);
   SELECT IFNULL(ACCOUNT_USER.ACCOUNT_USER_ID, 0), 
	       IFNULL(USER_ROLE.USER_ROLE_NAME, 0)
          INTO v_user_id,v_user_role_name 
			 FROM ACCOUNT_USER
			 INNER JOIN USER_ROLE
			 ON  ACCOUNT_USER.WEB_USER_ROLE_ID = USER_ROLE.USER_ROLE_ID
			 WHERE WEB_USER_NAME = p_username 
			 AND WEB_USER_PASSWORD = p_password 
			 LIMIT 1;
			 
			 
  IF v_user_id > 0 THEN
       
        SELECT 1 AS AuthPassed,v_user_role_name as UserRole;
  ELSE
        SELECT 0 AS AuthPassed,0 as UserRole;
  END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sproc_GetRoleGrants`(IN p_rolename VARCHAR(50))
BEGIN		   
				   
	SELECT 
	    URG.MODULE_NAME,
		URG.MODULE_SECTION_NAME,
		URG.CAN_VIEW_FLAG,
		URG.CAN_EDIT_FLAG
	FROM
        USER_ROLE_GRANTS   URG	
		INNER JOIN USER_ROLE  UR  
		   ON (UR.USER_ROLE_ID = URG.USER_ROLE_ID)
	WHERE 
        UR.USER_ROLE_NAME = 	p_rolename;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE IF NOT EXISTS `account` (
  `ACCOUNT_ID` int(11) NOT NULL AUTO_INCREMENT,
  `ACCOUNT_CODE` varchar(50) NOT NULL,
  `KAZOO_USERID` varchar(50) NOT NULL,
  `KAZOO_USER_PASSWORD` varchar(50) NOT NULL,
  `KAZOO_ACCOUNT_NAME` varchar(50) NOT NULL,
  `IS_RESELLER` varchar(1) NOT NULL DEFAULT 'N',
  `LAST_UPDATED_DATETIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ACCOUNT_ID`),
  UNIQUE KEY `ACCOUNT_CODE` (`ACCOUNT_CODE`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`ACCOUNT_ID`, `ACCOUNT_CODE`, `KAZOO_USERID`, `KAZOO_USER_PASSWORD`, `KAZOO_ACCOUNT_NAME`, `IS_RESELLER`, `LAST_UPDATED_DATETIME`) VALUES
(1, 'EIVR-Internal', 'admin', 'password', 'Admin-change', 'Y', '2015-04-18 07:56:20');

-- --------------------------------------------------------

--
-- Table structure for table `account_callflows`
--

CREATE TABLE IF NOT EXISTS `account_callflows` (
  `account_id` varchar(100) NOT NULL,
  `disa_id` varchar(100) NOT NULL,
  `media_unauthorized_id` varchar(100) NOT NULL,
  `media_disabled_id` varchar(100) NOT NULL,
  `status` int(1) NOT NULL,
  PRIMARY KEY (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `account_callflows`
--

INSERT INTO `account_callflows` (`account_id`, `disa_id`, `media_unauthorized_id`, `media_disabled_id`, `status`) VALUES
('37f40a25b03e80173898acef143de9b4', 'b6fb7c2e55741f7613bd2a13f65ddda9', '432053039ac1c35e26b990177694922b', '549488b72e2978c35eec1fa179bfd9aa', 0),
('59b66aa2168399009045c0a099cf1209', 'b009784f1cbf381469341500dc4728a4', '1ba29b68b5519af749a4cf0ff94aba61', 'b4aba47787cf399ef9cf8103e169c030', 0),
('af41713bee198298e1883c3cb57b8c38', 'a69e3667cd7a561ed78990a67d37c7d0', 'f3cee9802bfface7dcae6e68e2d90d62', 'a27d2b29c1d336d2c5dad14407413d07', 1);

-- --------------------------------------------------------

--
-- Table structure for table `account_numbers`
--

CREATE TABLE IF NOT EXISTS `account_numbers` (
  `account_id` varchar(250) NOT NULL,
  `dt_number` bigint(20) NOT NULL,
  `pri_number` int(11) NOT NULL,
  `caller_id_number` int(11) NOT NULL,
  PRIMARY KEY (`pri_number`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `account_numbers`
--

INSERT INTO `account_numbers` (`account_id`, `dt_number`, `pri_number`, `caller_id_number`) VALUES
('505f8da6d3a822329798b4a1c9f8926c', 0, 710272, 0),
('ea49e96a59e7e34d2275ae6109309f35', 0, 7102722, 0),
('7ed9bf33e6c4eb0948cdabf674948069', 0, 7102726, 0),
('44097d959a70629156b9f0ec6900620e', 0, 7102753, 0),
('2dc7caf9e5e9080218a098e822d1e51f', 0, 7102765, 0),
('2dc7caf9e5e9080218a098e822d1e51f', 0, 7102770, 0),
('2dc7caf9e5e9080218a098e822d1e51f', 0, 7102775, 0);

-- --------------------------------------------------------

--
-- Table structure for table `account_user`
--

CREATE TABLE IF NOT EXISTS `account_user` (
  `ACCOUNT_USER_ID` int(11) NOT NULL AUTO_INCREMENT,
  `ACCOUNT_ID` int(11) NOT NULL,
  `WEB_USER_NAME` varchar(50) NOT NULL,
  `WEB_USER_PASSWORD` varchar(50) NOT NULL,
  `WEB_USER_ROLE_ID` int(11) NOT NULL,
  `IS_BLOCKED` varchar(1) NOT NULL DEFAULT 'N',
  `LAST_UPDATED_DATETIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ACCOUNT_NAME` varchar(100) NOT NULL,
  `MOBILE_NUMBER` bigint(20) NOT NULL,
  `EMAIL_NOTIFICATION` int(1) NOT NULL DEFAULT '0',
  `SMS_NOTIFICATION` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ACCOUNT_USER_ID`),
  UNIQUE KEY `WEB_USER_NAME` (`WEB_USER_NAME`),
  KEY `ACCOUNT_ID` (`ACCOUNT_ID`),
  KEY `WEB_USER_ROLE_ID` (`WEB_USER_ROLE_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=68 ;

--
-- Dumping data for table `account_user`
--

INSERT INTO `account_user` (`ACCOUNT_USER_ID`, `ACCOUNT_ID`, `WEB_USER_NAME`, `WEB_USER_PASSWORD`, `WEB_USER_ROLE_ID`, `IS_BLOCKED`, `LAST_UPDATED_DATETIME`, `ACCOUNT_NAME`, `MOBILE_NUMBER`, `EMAIL_NOTIFICATION`, `SMS_NOTIFICATION`) VALUES
(1, 1, 'superadmin@eivr.com', 'sapass', 1, 'N', '2015-04-18 07:56:20', '', 0, 0, 0),
(2, 1, 'admin@eivr.com', 'apass', 2, 'N', '2015-04-18 07:56:20', '', 0, 0, 0),
(3, 1, 'user@eivr.com', 'upass', 3, 'N', '2015-04-18 07:56:20', '', 0, 0, 0),
(4, 1, 'admin', 'password', 1, 'N', '2015-09-11 15:49:41', 'admin', 0, 0, 0),
(5, 1, 'kk1234', '123456', 3, 'N', '2015-05-25 19:42:49', '', 0, 0, 0),
(6, 1, 'rofl123', '123456', 3, 'N', '2015-05-25 20:37:22', '', 0, 0, 0),
(7, 1, 'deepak13@gmail.com', '123456D', 3, 'N', '2015-05-31 15:15:11', 'deepak.dreamtel.co', 0, 0, 0),
(8, 1, 'deepak1@gmail.com', '123456D', 3, 'N', '2015-05-31 17:03:10', 'deepak', 0, 0, 0),
(9, 1, 'deepak50@gmail.com', '123456D', 3, 'N', '2015-05-31 17:27:04', 'arbin', 0, 0, 0),
(10, 1, 'sandhu1@gmail.com', 'abc123', 3, 'N', '2015-06-01 19:30:44', 'sandhu', 0, 0, 0),
(11, 1, 'arbinder@gmail.com', 'abc123', 2, 'N', '2015-06-02 17:33:43', 'arbinder', 0, 0, 0),
(12, 1, 'demo@gmail.com', 'abc123', 2, 'N', '2015-06-10 02:32:21', 'arbinder', 0, 0, 0),
(13, 1, 'avi@gmail.com', 'abc123', 3, 'N', '2015-06-14 07:28:44', 'avi', 0, 0, 0),
(14, 1, 'avi1@gmail.com', 'abc123', 3, 'N', '2015-06-14 08:52:11', 'avi1', 0, 0, 0),
(15, 1, 'avitest1@gmail.com', 'abc123', 2, 'N', '2015-06-29 23:55:50', 'AviTest', 0, 0, 0),
(16, 1, 'ajaysukhija.drive@gmail.com', 'abc123', 2, 'N', '2015-07-11 10:54:12', 'ajay', 0, 0, 0),
(17, 1, 'newavi1@gmail.com', '123456', 3, 'N', '2015-07-15 18:50:54', 'newAvi', 0, 0, 0),
(18, 1, 'testavi@gmail.com', '1234567', 2, 'N', '2015-07-18 11:18:32', 'test', 0, 0, 0),
(19, 1, 'royal@gmail.com', '123456', 2, 'N', '2015-07-18 11:21:59', 'royal', 0, 0, 0),
(20, 1, 'ajaysukhija@hotmail.com', 'abc123', 3, 'N', '2015-07-18 17:47:34', 'kamlesh', 0, 0, 0),
(21, 1, 'test2@ymail.com', '123456', 2, 'N', '2015-07-19 03:44:01', 'test2', 0, 0, 0),
(22, 1, 'test21@ymail.com', '123456', 2, 'N', '2015-07-19 03:45:20', 'test2', 0, 0, 0),
(23, 1, 'devayur.agency@gmail.com', 'abc123', 3, 'N', '2015-07-21 17:45:08', 'aajay', 0, 0, 0),
(24, 1, 'admin1212@gail.com', '123456', 2, 'N', '2015-07-24 11:20:59', 'Mehma', 0, 0, 0),
(25, 1, 'mhm@gmail.com', '123457', 2, 'N', '2015-07-24 11:40:02', 'Mehma', 0, 0, 0),
(26, 1, 'test1@gmail.com', '123456', 2, 'N', '2015-07-24 17:03:36', 'test1', 0, 0, 0),
(27, 1, 'test3@ymail.com', '123456', 2, 'N', '2015-07-25 09:08:48', 'test3', 0, 0, 0),
(28, 1, 'tes@ymail.com', '123456', 2, 'N', '2015-07-25 14:25:22', 'tes', 0, 0, 0),
(29, 1, 'tes@123.com', '123456', 2, 'N', '2015-07-25 14:33:40', 'tes', 0, 0, 0),
(30, 1, 'tes@yopmail.com', '123', 2, 'N', '2015-07-25 14:42:22', 'tes', 0, 0, 0),
(31, 1, 'tst@gmail.com', '123456', 2, 'N', '2015-07-25 16:56:13', 'tst', 0, 0, 0),
(32, 1, 'nght@ymil.com', '123456', 2, 'N', '2015-07-25 17:50:32', 'Night1', 0, 0, 0),
(33, 1, 'night5@ymail.com', '123', 2, 'N', '2015-07-25 18:52:49', 'night5', 0, 0, 0),
(34, 1, 'arbinder88@gmail.com', '123456', 2, 'N', '2015-07-27 00:53:42', 'morning', 0, 0, 0),
(35, 1, 'avisan@gmail.com', '123456', 3, 'N', '2015-08-01 06:07:24', '', 0, 0, 0),
(36, 1, 'komal@komal.komal', 'abc123', 2, 'N', '2015-08-07 17:59:27', 'komal', 0, 0, 0),
(37, 1, 'avi@ymail.com', '123456', 3, 'N', '2015-08-13 20:20:11', 'pushp', 0, 0, 0),
(38, 1, 'hkg1@gmail.com', '123456', 2, 'N', '2015-08-26 00:52:53', 'hkg', 9878597619, 1, 1),
(39, 1, 'hkgtwo@gmail.com', '23456', 3, 'N', '2015-08-26 01:23:12', 'hkg', 9878597611, 0, 1),
(40, 1, 'tankkleaners@gmail.com', 'abc123', 2, 'N', '2015-08-26 19:38:44', 'tank cleaners', 9878597619, 1, 0),
(41, 1, 'da@da.da', 'abc123', 3, 'N', '2015-08-28 02:09:59', 'tank cleaners', 8146673571, 0, 0),
(42, 1, 'avisg@ymail.com', '123456', 2, 'N', '2015-08-29 10:32:06', 'avi', 0, 0, 0),
(43, 1, 'avi1gs@gmail.com', '123456', 2, 'N', '2015-08-29 11:20:52', 'avi1', 0, 0, 0),
(44, 1, '29auguser@gmail.com', '123456', 3, 'N', '2015-08-29 18:01:33', '29aug', 9803309575, 1, 1),
(45, 1, 'avisan@gmail.co', '123456', 2, 'N', '2015-08-30 19:15:16', 'avi', 0, 0, 0),
(46, 1, 'yashika.malhotra@gmail.com', 'abc123', 2, 'N', '2015-09-03 03:33:21', '2Sept', 0, 0, 0),
(47, 1, 'fname.lname@user.com', 'abc123', 2, 'N', '2015-09-03 03:35:07', '2Sept', 0, 0, 0),
(48, 1, 'test@user.com', 'abc123', 3, 'N', '2015-09-03 03:48:31', '2Sept', 0, 1, 1),
(49, 1, 'a@b.com', 'abc123', 3, 'N', '2015-09-03 05:13:20', '2Sept', 0, 0, 0),
(50, 1, '1@2.com', '123456', 3, 'N', '2015-09-03 05:20:42', '2Sept', 0, 0, 1),
(51, 1, 'aks@abc.com', 'abc123', 2, 'N', '2015-09-03 06:44:38', 'aks', 0, 0, 0),
(52, 1, 'lok@lok.com', 'lok123', 2, 'N', '2015-09-03 06:50:38', 'lok', 0, 0, 0),
(53, 1, '2@w.d', 'ww', 3, 'N', '2015-09-03 06:59:41', '2Sept', 0, 1, 0),
(54, 1, 'f.l@gmail.co', '123456', 2, 'N', '2015-09-08 17:27:37', 'first', 0, 0, 0),
(55, 1, 'y.m@gmail.co', '123456', 3, 'N', '2015-09-08 17:46:22', 'first', 9872218796, 1, 1),
(56, 1, 's@d.com', '123456', 2, 'N', '2015-09-08 22:02:44', 'second', 0, 0, 0),
(57, 1, 't@1.c', '123456', 3, 'N', '2015-09-09 05:01:11', 'second', 0, 1, 1),
(58, 1, 'ad@ei.com', 'apass', 3, 'N', '2015-09-09 16:35:08', 'first', 0, 1, 1),
(59, 1, 'a@abc.com', '123456', 2, 'N', '2015-09-09 17:07:16', 'third', 0, 0, 0),
(60, 1, '1@12.com', '123456', 2, 'N', '2015-09-09 18:03:48', 'fourth', 0, 0, 0),
(61, 1, '4@sept.eivr', 'abc123', 2, 'N', '2015-09-11 16:16:18', '4Sept', 0, 0, 0),
(62, 1, 't@l.eivr', '123456', 3, 'N', '2015-09-11 16:18:59', '4Sept', 9872218796, 0, 1),
(63, 1, 'luck@eivr.com', '123456', 2, 'N', '2015-09-15 00:03:31', 'luck', 0, 0, 0),
(64, 1, 'test@e.com', '123456', 2, 'N', '2015-09-16 17:24:07', 'test', 0, 0, 0),
(65, 1, 'aks@e.com', '123456', 2, 'N', '2015-09-16 17:53:31', 'aks', 0, 0, 0),
(66, 1, '16@s.com', '123456', 2, 'N', '2015-09-16 18:03:16', '16Sept', 1616161616, 0, 0),
(67, 1, 't@t.co', '123456', 2, 'N', '2015-09-16 18:15:47', 'test', 8888888888, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `content_management`
--

CREATE TABLE IF NOT EXISTS `content_management` (
  `id` int(11) DEFAULT '1',
  `email_content` text NOT NULL,
  `sms_content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `content_management`
--

INSERT INTO `content_management` (`id`, `email_content`, `sms_content`) VALUES
(1, 'This i the email to inform you that you have missed call from CALLER_ID . For more details please contact your system Administrator . ', 'You have a missed call from CALLER_ID. For more detail call 9898989898.');

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE IF NOT EXISTS `plans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plan_name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `plan_name`) VALUES
(1, 'Silver'),
(2, 'Gold'),
(3, 'Platinum');

-- --------------------------------------------------------

--
-- Table structure for table `registration_detail`
--

CREATE TABLE IF NOT EXISTS `registration_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account_id` varchar(50) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `username` varchar(50) NOT NULL,
  `company_name` varchar(50) DEFAULT NULL,
  `password` varchar(30) NOT NULL,
  `dt_number` bigint(20) DEFAULT NULL,
  `caller_id_number` bigint(20) DEFAULT NULL,
  `mobile_number` bigint(20) NOT NULL,
  `state` varchar(20) DEFAULT NULL,
  `company_phone` bigint(20) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `city` varchar(25) DEFAULT NULL,
  `country` varchar(20) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `plan` varchar(30) DEFAULT NULL,
  `plan_valid_from` varchar(20) DEFAULT NULL,
  `plan_valid_upto` varchar(20) DEFAULT NULL,
  `no_of_sms_per_credit` int(11) DEFAULT NULL,
  `credit_deduction_for_sms` decimal(20,4) DEFAULT NULL,
  `date_joining` varchar(20) DEFAULT NULL,
  `contract_valid` date DEFAULT NULL,
  `nature_of_business` varchar(50) DEFAULT NULL,
  `job_title` varchar(30) DEFAULT NULL,
  `number_of_employees` int(10) DEFAULT NULL,
  `annual_turnover` int(11) DEFAULT NULL,
  `number_of_channels` int(5) DEFAULT NULL,
  `credits` int(5) DEFAULT NULL,
  `photo` varchar(100) DEFAULT NULL,
  `id_proof` varchar(30) DEFAULT NULL,
  `id_proof_file` varchar(100) DEFAULT NULL,
  `email_notification` int(1) NOT NULL DEFAULT '0',
  `sms_notification` int(1) NOT NULL DEFAULT '0',
  `sms_notification_for_caller` int(1) NOT NULL DEFAULT '0',
  `pri_number` int(11) DEFAULT NULL,
  `call_forward_enabled` int(1) NOT NULL DEFAULT '0',
  `user_kazoo_id` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=43 ;

--
-- Dumping data for table `registration_detail`
--

INSERT INTO `registration_detail` (`id`, `account_id`, `first_name`, `last_name`, `username`, `company_name`, `password`, `dt_number`, `caller_id_number`, `mobile_number`, `state`, `company_phone`, `address`, `zip_code`, `city`, `country`, `email`, `plan`, `plan_valid_from`, `plan_valid_upto`, `no_of_sms_per_credit`, `credit_deduction_for_sms`, `date_joining`, `contract_valid`, `nature_of_business`, `job_title`, `number_of_employees`, `annual_turnover`, `number_of_channels`, `credits`, `photo`, `id_proof`, `id_proof_file`, `email_notification`, `sms_notification`, `sms_notification_for_caller`, `pri_number`, `call_forward_enabled`, `user_kazoo_id`) VALUES
(14, '35b3a0e863f9dc20511cf76f7a487e82', 'mhm', 'ema', 'mhm@gmail.com', 'ABC', '123457', 0, 0, 9878597619, '', 1623434, '#222', '', 'Mohali', '', 'mhm@gmail.com', 'Platinum', '2015-07-15', '2015-07-22', 0, '0.0000', '0000-00-00', '0000-00-00', '', '9', 0, 0, 0, 100, '', '', '', 0, 1, 0, 0, 0, ''),
(15, 'a994ac2c520205b27da4312bc7465662', 'tes', 't1', 'test1@gmail.com', '', '123456', 0, 0, 9878597619, '', 0, '', '', '', '', 'test1@gmail.com', 'Gold', '2015-07-14', '2015-07-17', 0, '0.0000', '0000-00-00', '0000-00-00', '', '9', 0, 0, 0, 27, '', '', '', 1, 1, 0, 0, 1, ''),
(16, '49ffdf9aab0a16130468db8085ff7eff', 'test', '31', 'test3@ymail.coms', '', '123456', 0, 0, 9878597618, '', 0, '', '', '', '', 'test3@ymail.coms', '', '0000-00-00', '0000-00-00', 0, '0.0000', '0000-00-00', '0000-00-00', '', '', 0, 0, 0, 0, '', '', '', 1, 1, 0, 0, 1, '64a43314c1fc3d82364a57718ef82cff'),
(17, '62fae934dd39959d8baeff306f3c3090', 'tes', 'yop', 'tes@yopmail.com', 'SJGA', '123', 0, 0, 9878594318, 'PB', 9999, '#213', '123', 'Moahlo', 'IN', 'tes@yopmail.com', '', '0000-00-00', '0000-00-00', 0, '0.0000', '0000-00-00', '0000-00-00', '2', '2', 2, 4, 0, 0, '', '', '', 1, 1, 0, 0, 1, '3f15d6f95bcec060a974abdc28524ce1'),
(18, 'eca3771e564897e849fa7eb8bc31143e', 'ttt', 'sss', 'tst@gmail.com', 'AviSan', '123456', 0, 0, 9878597619, 'PB', 99999, '#21', '160055', 'mohali', 'IN', 'tst@gmail.com', 'Platinum', '0000-00-00', '0000-00-00', 0, '0.0000', '0000-00-00', '0000-00-00', '1', '12', 2, 3, 0, 150, '', '', '', 1, 1, 0, 0, 1, '2ea3ef735bc874a8c6059ddcbdbb0810'),
(19, '9ec9582ef4133e66fc2fd705529cbe98', 'nght', '1', 'nght@ymil.com', '', '123456', 0, 0, 9898989898, '', 0, '', '', '', '', 'nght@ymil.com', 'Gold', '', '', 0, '0.0000', '07/23/2015', '0000-00-00', '', '', 0, 0, 0, 60, '', '', '', 1, 1, 0, 0, 1, 'fd176ea93e7bb9d0175291c066ce6bc5'),
(20, '63a48e7f09ebd54a24efbe1234ba430f', '', '', '', '', '', 0, 0, 0, '', 0, '', '', '', '', '', 'Gold', '', '', 0, '0.0000', '', '0000-00-00', '', '', 0, 0, 0, 90, '', '', '', 0, 0, 0, 0, 0, ''),
(21, '49b6d3853b555d7fd339204c592d8362', 'night 5', 'arr 44', 'night5@ymail.com', 'abr 5', '123', 0, 0, 9878597619, 'sss', 9999, '#222', '1234', 'abc', 'qq', 'night5@ymail.com', '', '', '', 0, '0.0000', '07/09/2015', '0000-00-00', '2', '7', 3, 4, 0, 0, '', '', '', 1, 1, 0, 0, 1, 'd6ba8f176ecf56f7bf9ff31ef2c56cd6'),
(22, '960e6a50ab6be09e4783734da4ac4fa3', 'hello', 'hello', '', 'AviSan', '12345', 0, 0, 9878597619, '', 0, '', '', '', '', 'arbinder88@gmail.com', 'Gold', '', '', 0, '0.0000', '', '0000-00-00', '', '', 0, 0, 0, 100, '', '', '', 1, 1, 0, 0, 0, ''),
(23, '38f86de91adedec4046c7a1803f1d0e9', '', '', '', '', '', 0, 0, 0, '', 0, '', '', '', '', '', 'Gold', '20/08/2015', '30/08/2015', 0, '0.0000', '', '0000-00-00', '', '', 0, 0, 0, 2000, '', '', '', 0, 0, 0, 0, 0, ''),
(24, 'af41713bee198298e1883c3cb57b8c38', 'avixsxsxsx', 'san', '', 'Avsss', 'abc123', 987888888, 0, 9873397619, '', 0, '', '', '', '', '', 'Gold', '30/08/2015', '31/08/2015', 0, '0.0000', '', '0000-00-00', '', '', 0, 0, 0, 9, '', '', '', 1, 1, 0, 0, 1, ''),
(25, '02c0c88a08da21618daa6a5d3ad510d9', 'avi', 'sg', 'avisg@ymail.com', 'avsg', '123456', 0, 0, 9878597619, 'punjab', 9898, '#234', '160055', 'mohali', 'india', 'avisg@ymail.com', '', '', '', 0, '0.0000', '30/08/2015', '0000-00-00', '1', '10', 5, 7, 0, 0, '', '', '', 1, 1, 0, 0, 1, 'd4310b9a74188051733b74d19f9f0402'),
(26, '59b66aa2168399009045c0a099cf1209', 'avi', 'saga', 'avi1gs@gmail.com', 'avisss', '123456', 0, 0, 9878597619, 'cdcd', 24234, '#33333', '4234', 'gdfd', 'bbbfb', 'avi1gs@gmail.com', '', '', '', 0, '0.0000', '25/08/2015', '0000-00-00', '2', '4', 5, 8, 0, 0, '', '', '', 0, 1, 0, 0, 1, 'ded8e5607c77bfc75e1f1d16454e1b5c'),
(27, 'fa3095bfdbbc2977118fa2c379865c91', '29', 'aug', '29aug@gmail.com', 'Avisg', '123456', 0, 0, 9878597619, '', 0, '', '', '', '', '29aug@gmail.com', 'gold', '15/08/2015', '25/08/2015', 1, '13.0000', '15/08/2015', '2015-08-19', '1', 'ww', 3, 1, 1, 200, '', '', '', 1, 1, 0, 0, 1, '1aeb59537ab73a245d998f68e0df22e2'),
(28, '37f40a25b03e80173898acef143de9b4', 'avi', 'san', 'avisan@gmail.co', '', '123456', 0, 0, 9878597619, '', 0, '', '', '', '', 'avisan@gmail.co', 'Platinum', '06/08/2015', '28/08/2015', 1, '0.0000', '', '0000-00-00', '', '', 0, 0, 0, 123, '', '', '', 1, 1, 0, 0, 1, '801e355f2611086ac94c5d715dbf9bd6'),
(29, '2dc7caf9e5e9080218a098e822d1e51f', 'yashika', 'malhotra', 'yashika.malhotra@gmail.com', 'Ambiente Technologies', 'abc123', 0, 0, 8727937870, '', 0, 'US', '15237', '', '', 'yashika.malhotra@gmail.com', 'Gold', '04/09/2015', '30/09/2015', 1, '0.0000', '', '0000-00-00', '', '5', 0, 0, 0, 560, '', '', '', 1, 0, 0, 0, 0, '5c008f4c90fd31136f0084e98dd00de8'),
(30, 'ef9ef9a94bebde7ad0c201fa99d0141e', 'aks', 'aks', 'aks@abc.com', '', 'abc123', 0, 0, 1234567890, '', 0, '', '', '', '', 'aks@abc.com', 'Gold', '04/09/2015', '24/09/2015', 2, '0.0000', '', '0000-00-00', '', '12', 0, 0, 0, 100, '', '', '', 0, 0, 0, 0, 0, '33d501e1254ebab101f4f75f05a98c40'),
(31, '2577e2ec49a03ea8c51ea6ceea250605', 'lok', 'lok', 'lok@lok.com', '', 'lok123', 0, 0, 123456789, '', 0, '', '', '', '', 'lok@lok.com', 'Platinum', '03/09/2015', '30/09/2015', 1, '0.0000', '', '0000-00-00', '', '12', 0, 0, 0, 200, '', '', '', 0, 0, 0, 0, 0, '2717253fbbc9e0d250a72b379e796105'),
(32, 'ea49e96a59e7e34d2275ae6109309f35', 'first', 'last', 'f.l@gmail.co', '', '123456', 0, 0, 1234567899, '', 0, '', '', '', '', 'f.l@gmail.co', '', '', '', 0, '0.0000', '', '0000-00-00', '', '12', 0, 0, 0, 0, '', '', '', 1, 1, 0, 0, 0, 'e10004561e74a64658ac49a0303cf3e3'),
(33, '847f29fd75ee777da89e503ad96439aa', 'second', 'last', 's@d.com', '', '123456', 0, 0, 9872218796, '', 0, '', '', '', '', 's@d.com', '', '', '', 0, '0.0000', '', '0000-00-00', '', '', 0, 0, 0, 0, '', '', '', 1, 1, 0, 0, 1, 'b6e05a6505b59300052aea34cac907cc'),
(34, '4ddc999521bd667f798a25816fd94c64', 'qwerty', 'asdfgh', 'a@abc.com', '', '123456', 0, 0, 1321456977, '', 0, '', '', '', '', 'a@abc.com', '', '', '', 0, '0.0000', '', '0000-00-00', '', '12', 0, 0, 0, 0, '', '', '', 0, 0, 0, 0, 0, 'dfb6a35c959f496b14ac27dfe3ccca36'),
(35, '62c13e860a2e816918fd300597802abc', 'fourth', 'last', '1@12.com', '', '123456', 0, 0, 9872218796, '', 0, '', '', '', '', '1@12.com', '', '', '', 0, '0.0000', '', '0000-00-00', '', '', 0, 0, 0, 0, '', '', '', 0, 1, 0, 0, 1, 'c24d896467dcef3c102a7d0497651ec5'),
(36, '7ed9bf33e6c4eb0948cdabf674948069', '4', 'sept', '4@sept.eivr', '', 'abc123', 0, 0, 9872218796, '', 0, '', '', '', '', '4@sept.eivr', 'Gold', '17/09/2015', '29/04/2016', 2, '0.0000', '', '0000-00-00', '', '', 0, 0, 0, 600, '', '', '', 0, 1, 1, 0, 1, 'ba271aa9f7ffcedf0b9d0b88d13c66a4'),
(37, '505f8da6d3a822329798b4a1c9f8926c', 'luck', 'last', 'luck@eivr.com', '', '123456', 0, 0, 9872218796, '', 0, '', '', '', '', 'luck@eivr.com', '', '', '', 0, '0.0000', '', '0000-00-00', '', '', 0, 0, 0, 0, '', '', '', 0, 1, 1, 0, 1, 'f7459b37a23b4b382fdbc6f75567ceac'),
(38, '45dd3bffa09c988e2218303a72dafdc0', 'tw', 'la', 'test@e.com', '', '123456', 0, 0, 4535724158, '', 0, '', '', '', '', 'test@e.com', '', '', '', 0, '0.0000', '', '0000-00-00', '', '', 0, 0, 0, 0, '', '', '', 0, 0, 0, 0, 0, '2a75c00350e61d1a466683c70dbaff38'),
(39, 'f09bd981daad85b9453b4d5cbbd80437', 'aks', 'last', 'aks@e.com', '', '123456', 0, 0, 1234567891, '', 0, '', '', '', '', 'aks@e.com', '', '', '', 0, '0.0000', '', '0000-00-00', '', '', 0, 0, 0, 0, '', '', '', 0, 0, 0, 0, 0, '2ccc840cb0ada4375b252d86ee12ce36'),
(40, '006b75e1c38abc6401a37ff2ac8c51b5', '1', '6', '16@s.com', '', '123456', 0, 0, 1616161616, '', 0, '', '', '', '', '16@s.com', '', '', '', 0, '0.0000', '', '0000-00-00', '', '', 0, 0, 0, 0, '', '', '', 0, 0, 0, 0, 0, '35868dbd9dca8a5870963c483560f824'),
(41, '3a425627befad5826ea0207c850754b6', 'a', 'l', 'a@k.com', '', '123456', 0, 0, 1818181818, '', 0, '', '', '', '', 'a@k.com', '', '', '', 0, '0.0000', '', '0000-00-00', '', '', 0, 0, 0, 0, '', '', '', 0, 0, 0, 0, 0, 'acde3322b30d90e45731d15463bb85c3'),
(42, 'b95d5683a6b0917b8abcbbcd4170d2f1', 't', 't', 't@t.co', '', '123456', 0, 0, 8888888888, '', 0, '', '', '', '', 't@t.co', '', '', '', 0, '0.0000', '', '0000-00-00', '', '', 0, 0, 0, 0, '', '', '', 0, 0, 0, 0, 0, 'd6d5c6bbc3cd081f328d54b3d2445afb');

-- --------------------------------------------------------

--
-- Table structure for table `sms_call_ids`
--

CREATE TABLE IF NOT EXISTS `sms_call_ids` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `call_id` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `sms_call_ids`
--

INSERT INTO `sms_call_ids` (`id`, `call_id`) VALUES
(1, '0e89a3075999ea1e434860c203dbcbda@103.28.241.102:5060');

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

CREATE TABLE IF NOT EXISTS `test` (
  `test1` int(5) NOT NULL,
  `test2` varchar(5) NOT NULL,
  `MOBILE_NUMBER` bigint(20) NOT NULL,
  `EMAIL_NOTIFICATION` int(1) NOT NULL DEFAULT '0',
  `SMS_NOTIFICATION` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `test`
--

INSERT INTO `test` (`test1`, `test2`, `MOBILE_NUMBER`, `EMAIL_NOTIFICATION`, `SMS_NOTIFICATION`) VALUES
(1, 'hello', 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_numbers`
--

CREATE TABLE IF NOT EXISTS `user_numbers` (
  `account_id` varchar(100) NOT NULL,
  `phone_number` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_numbers`
--

INSERT INTO `user_numbers` (`account_id`, `phone_number`) VALUES
('af41713bee198298e1883c3cb57b8c38', 9653729673),
('af41713bee198298e1883c3cb57b8c38', 9814061916),
('fff0d50dae90f3a22a90f2a61cab0d15', 9872218796),
('f7b19406c537a57054b305c16824fd9e', 0),
('f7b19406c537a57054b305c16824fd9e', 0),
('fff0d50dae90f3a22a90f2a61cab0d15', 9878597619),
('fff0d50dae90f3a22a90f2a61cab0d15', 9878597666),
('af41713bee198298e1883c3cb57b8c38', 9780001916),
('af41713bee198298e1883c3cb57b8c38', 9878597619),
('af41713bee198298e1883c3cb57b8c38', 9873397619),
('f7b19406c537a57054b305c16824fd9e', 9878597619),
('3df693108c0044d27a5e017fc85a10c8', 9815126666),
('f7b19406c537a57054b305c16824fd9e', 9878597629),
('9a3bcf2adf6744ea179b25fc83b02540', 9878597619),
('9a3bcf2adf6744ea179b25fc83b02540', 9878597611),
('26beb2ee0385b1fcd279fe5abbb23226', 8146673571),
('02c0c88a08da21618daa6a5d3ad510d9', 9878597619),
('59b66aa2168399009045c0a099cf1209', 9878597619),
('37f40a25b03e80173898acef143de9b4', 9878597619),
('2dc7caf9e5e9080218a098e822d1e51f', 8727937870),
('2dc7caf9e5e9080218a098e822d1e51f', 0),
('2dc7caf9e5e9080218a098e822d1e51f', 0),
('2dc7caf9e5e9080218a098e822d1e51f', 0),
('2dc7caf9e5e9080218a098e822d1e51f', 0),
('ef9ef9a94bebde7ad0c201fa99d0141e', 1234567890),
('2577e2ec49a03ea8c51ea6ceea250605', 123456789),
('2dc7caf9e5e9080218a098e822d1e51f', 0),
('2dc7caf9e5e9080218a098e822d1e51f', 0),
('ea49e96a59e7e34d2275ae6109309f35', 1234567899),
('ea49e96a59e7e34d2275ae6109309f35', 9872218796),
('847f29fd75ee777da89e503ad96439aa', 9872218796),
('847f29fd75ee777da89e503ad96439aa', 0),
('ea49e96a59e7e34d2275ae6109309f35', 0),
('4ddc999521bd667f798a25816fd94c64', 1321456977),
('62c13e860a2e816918fd300597802abc', 9872218796),
('7ed9bf33e6c4eb0948cdabf674948069', 9872218796),
('7ed9bf33e6c4eb0948cdabf674948069', 0),
('505f8da6d3a822329798b4a1c9f8926c', 9872218796),
('45dd3bffa09c988e2218303a72dafdc0', 4535724158),
('f09bd981daad85b9453b4d5cbbd80437', 1234567891),
('006b75e1c38abc6401a37ff2ac8c51b5', 1616161616),
('3a425627befad5826ea0207c850754b6', 1818181818),
('b95d5683a6b0917b8abcbbcd4170d2f1', 8888888888);

-- --------------------------------------------------------

--
-- Table structure for table `user_role`
--

CREATE TABLE IF NOT EXISTS `user_role` (
  `USER_ROLE_ID` int(11) NOT NULL AUTO_INCREMENT,
  `USER_ROLE_NAME` varchar(50) NOT NULL,
  `USER_ROLE_DESCRIPTION` varchar(500) DEFAULT NULL,
  `LAST_UPDATED_DATETIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`USER_ROLE_ID`),
  UNIQUE KEY `USER_ROLE_NAME` (`USER_ROLE_NAME`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `user_role`
--

INSERT INTO `user_role` (`USER_ROLE_ID`, `USER_ROLE_NAME`, `USER_ROLE_DESCRIPTION`, `LAST_UPDATED_DATETIME`) VALUES
(1, 'SUPER_ADMIN', 'Super Administrator for Entire Application', '2015-04-18 07:56:20'),
(2, 'ADMIN', 'Administrator for a Particular Account', '2015-04-18 07:56:20'),
(3, 'AGENT', 'Operational User with Restricted Privileges', '2015-04-18 07:56:20');

-- --------------------------------------------------------

--
-- Table structure for table `user_role_grants`
--

CREATE TABLE IF NOT EXISTS `user_role_grants` (
  `USER_ROLE_GRANT_ID` int(11) NOT NULL AUTO_INCREMENT,
  `USER_ROLE_ID` int(11) NOT NULL,
  `MODULE_NAME` varchar(100) NOT NULL,
  `MODULE_SECTION_NAME` varchar(100) NOT NULL,
  `CAN_VIEW_FLAG` varchar(1) NOT NULL DEFAULT 'N',
  `CAN_EDIT_FLAG` varchar(1) NOT NULL DEFAULT 'N',
  `LAST_UPDATED_DATETIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`USER_ROLE_GRANT_ID`),
  UNIQUE KEY `USER_ROLE_ID` (`USER_ROLE_ID`,`MODULE_NAME`,`MODULE_SECTION_NAME`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

--
-- Dumping data for table `user_role_grants`
--

INSERT INTO `user_role_grants` (`USER_ROLE_GRANT_ID`, `USER_ROLE_ID`, `MODULE_NAME`, `MODULE_SECTION_NAME`, `CAN_VIEW_FLAG`, `CAN_EDIT_FLAG`, `LAST_UPDATED_DATETIME`) VALUES
(1, 1, 'SUPER_ADMIN_CONSOLE', 'ALL', 'Y', 'Y', '2015-04-18 07:56:20'),
(2, 1, 'RESOURCES', 'ALL', 'Y', 'Y', '2015-04-18 07:56:20'),
(3, 1, 'CALL_FLOW', 'ALL', 'Y', 'Y', '2015-04-18 07:56:20'),
(4, 1, 'DASHBOARD', 'ALL', 'Y', 'Y', '2015-04-18 07:56:21'),
(5, 2, 'RESOURCES', 'ALL', 'Y', 'Y', '2015-04-18 07:56:21'),
(6, 2, 'CALL_FLOW', 'ALL', 'Y', 'Y', '2015-04-18 07:56:21'),
(7, 2, 'DASHBOARD', 'ALL', 'Y', 'Y', '2015-04-18 07:56:21'),
(8, 3, 'RESOURCES', 'ALL', 'N', 'N', '2015-04-18 07:56:21'),
(9, 3, 'CALL_FLOW', 'ALL', 'N', 'N', '2015-04-18 07:56:21'),
(10, 3, 'DASHBOARD', 'ALL', 'Y', 'N', '2015-04-18 07:56:21'),
(11, 1, 'ACCOUNT', 'ALL', 'Y', 'Y', '2015-05-25 16:54:20'),
(12, 2, 'ACCOUNT', 'ALL', 'Y', 'Y', '2015-06-10 00:57:36'),
(13, 1, 'CLIENT', 'ALL', 'Y', 'Y', '2015-06-24 17:27:47');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account_user`
--
ALTER TABLE `account_user`
  ADD CONSTRAINT `account_user_ibfk_1` FOREIGN KEY (`ACCOUNT_ID`) REFERENCES `account` (`ACCOUNT_ID`),
  ADD CONSTRAINT `account_user_ibfk_2` FOREIGN KEY (`WEB_USER_ROLE_ID`) REFERENCES `user_role` (`USER_ROLE_ID`);

--
-- Constraints for table `user_role_grants`
--
ALTER TABLE `user_role_grants`
  ADD CONSTRAINT `user_role_grants_ibfk_1` FOREIGN KEY (`USER_ROLE_ID`) REFERENCES `user_role` (`USER_ROLE_ID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
