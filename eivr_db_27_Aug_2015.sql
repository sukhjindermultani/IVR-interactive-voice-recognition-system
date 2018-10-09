-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Aug 27, 2015 at 04:32 PM
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
  `USER_NUMBER` bigint(20) NOT NULL,
  `EMAIL_NOTIFICTION` int(1) NOT NULL DEFAULT '0',
  `SMS_NOTIFICATION` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ACCOUNT_USER_ID`),
  UNIQUE KEY `WEB_USER_NAME` (`WEB_USER_NAME`),
  KEY `ACCOUNT_ID` (`ACCOUNT_ID`),
  KEY `WEB_USER_ROLE_ID` (`WEB_USER_ROLE_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=38 ;

--
-- Dumping data for table `account_user`
--

INSERT INTO `account_user` (`ACCOUNT_USER_ID`, `ACCOUNT_ID`, `WEB_USER_NAME`, `WEB_USER_PASSWORD`, `WEB_USER_ROLE_ID`, `IS_BLOCKED`, `LAST_UPDATED_DATETIME`, `ACCOUNT_NAME`, `USER_NUMBER`, `EMAIL_NOTIFICTION`, `SMS_NOTIFICATION`) VALUES
(1, 1, 'superadmin', 'password', 1, 'N', '2015-08-26 16:51:11', 'Superadmin', 0, 0, 0),
(2, 1, 'admin@eivr.com', 'apass', 2, 'N', '2015-04-18 07:56:20', '', 0, 0, 0),
(3, 1, 'user@eivr.com', 'upass', 3, 'N', '2015-04-18 07:56:20', '', 0, 0, 0),
(4, 1, 'admin', 'password', 1, 'N', '2015-08-26 16:53:15', 'admin', 0, 0, 0),
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
(37, 1, 'avi@ymail.com', '123456', 3, 'N', '2015-08-13 20:20:11', 'pushp', 0, 0, 0);

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
  `company_name` varchar(50) NOT NULL,
  `password` varchar(30) NOT NULL,
  `dt_number` bigint(20) NOT NULL,
  `caller_id_number` bigint(20) NOT NULL,
  `mobile_number` bigint(20) NOT NULL,
  `state` varchar(20) NOT NULL,
  `company_phone` bigint(20) NOT NULL,
  `address` varchar(100) NOT NULL,
  `zip_code` varchar(10) NOT NULL,
  `city` varchar(25) NOT NULL,
  `country` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `plan` varchar(30) NOT NULL,
  `plan_valid_from` varchar(20) NOT NULL,
  `plan_valid_upto` varchar(20) NOT NULL,
  `no_of_sms_per_credit` int(11) NOT NULL,
  `date_joining` varchar(20) NOT NULL,
  `contract_valid` date NOT NULL,
  `nature_of_business` varchar(50) NOT NULL,
  `job_title` varchar(30) NOT NULL,
  `number_of_employees` int(10) NOT NULL,
  `annual_turnover` int(11) NOT NULL,
  `number_of_channels` int(5) NOT NULL,
  `credits` int(5) NOT NULL,
  `photo` varchar(100) NOT NULL,
  `id_proof` varchar(30) NOT NULL,
  `id_proof_file` varchar(100) NOT NULL,
  `email_notification` int(1) NOT NULL DEFAULT '0',
  `sms_notification` int(1) NOT NULL DEFAULT '0',
  `pri_number` int(11) NOT NULL,
  `call_forward_enabled` int(1) NOT NULL DEFAULT '0',
  `user_kazoo_id` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=29 ;

--
-- Dumping data for table `registration_detail`
--

INSERT INTO `registration_detail` (`id`, `account_id`, `first_name`, `last_name`, `username`, `company_name`, `password`, `dt_number`, `caller_id_number`, `mobile_number`, `state`, `company_phone`, `address`, `zip_code`, `city`, `country`, `email`, `plan`, `plan_valid_from`, `plan_valid_upto`, `no_of_sms_per_credit`, `date_joining`, `contract_valid`, `nature_of_business`, `job_title`, `number_of_employees`, `annual_turnover`, `number_of_channels`, `credits`, `photo`, `id_proof`, `id_proof_file`, `email_notification`, `sms_notification`, `pri_number`, `call_forward_enabled`, `user_kazoo_id`) VALUES
(14, '35b3a0e863f9dc20511cf76f7a487e82', 'mhm', 'ema', 'mhm@gmail.com', 'ABC', '123457', 0, 0, 9878597619, '', 1623434, '#222', '', 'Mohali', '', 'mhm@gmail.com', 'Platinum', '2015-07-15', '2015-07-22', 0, '0000-00-00', '0000-00-00', '', '9', 0, 0, 0, 100, '', '', '', 0, 1, 0, 0, ''),
(15, 'a994ac2c520205b27da4312bc7465662', 'tes', 't1', 'test1@gmail.com', '', '123456', 0, 0, 9878597619, '', 0, '', '', '', '', 'test1@gmail.com', 'Gold', '2015-07-14', '2015-07-17', 0, '0000-00-00', '0000-00-00', '', '9', 0, 0, 0, 27, '', '', '', 1, 1, 0, 1, ''),
(16, '49ffdf9aab0a16130468db8085ff7eff', 'test', '31', 'test3@ymail.coms', '', '123456', 0, 0, 9878597618, '', 0, '', '', '', '', 'test3@ymail.coms', '', '0000-00-00', '0000-00-00', 0, '0000-00-00', '0000-00-00', '', '', 0, 0, 0, 0, '', '', '', 1, 1, 0, 1, '64a43314c1fc3d82364a57718ef82cff'),
(17, '62fae934dd39959d8baeff306f3c3090', 'tes', 'yop', 'tes@yopmail.com', 'SJGA', '123', 0, 0, 9878594318, 'PB', 9999, '#213', '123', 'Moahlo', 'IN', 'tes@yopmail.com', '', '0000-00-00', '0000-00-00', 0, '0000-00-00', '0000-00-00', '2', '2', 2, 4, 0, 0, '', '', '', 1, 1, 0, 1, '3f15d6f95bcec060a974abdc28524ce1'),
(18, 'eca3771e564897e849fa7eb8bc31143e', 'ttt', 'sss', 'tst@gmail.com', 'AviSan', '123456', 0, 0, 9878597619, 'PB', 99999, '#21', '160055', 'mohali', 'IN', 'tst@gmail.com', 'Platinum', '0000-00-00', '0000-00-00', 0, '0000-00-00', '0000-00-00', '1', '12', 2, 3, 0, 150, '', '', '', 1, 1, 0, 1, '2ea3ef735bc874a8c6059ddcbdbb0810'),
(19, '9ec9582ef4133e66fc2fd705529cbe98', 'nght', '1', 'nght@ymil.com', '', '123456', 0, 0, 9898989898, '', 0, '', '', '', '', 'nght@ymil.com', 'Gold', '', '', 0, '07/23/2015', '0000-00-00', '', '', 0, 0, 0, 60, '', '', '', 1, 1, 0, 1, 'fd176ea93e7bb9d0175291c066ce6bc5'),
(20, '63a48e7f09ebd54a24efbe1234ba430f', '', '', '', '', '', 0, 0, 0, '', 0, '', '', '', '', '', 'Gold', '', '', 0, '', '0000-00-00', '', '', 0, 0, 0, 90, '', '', '', 0, 0, 0, 0, ''),
(21, '49b6d3853b555d7fd339204c592d8362', 'night 5', 'arr 44', 'night5@ymail.com', 'abr 5', '123', 0, 0, 9878597619, 'sss', 9999, '#222', '1234', 'abc', 'qq', 'night5@ymail.com', '', '', '', 0, '07/09/2015', '0000-00-00', '2', '7', 3, 4, 0, 0, '', '', '', 1, 1, 0, 1, 'd6ba8f176ecf56f7bf9ff31ef2c56cd6'),
(22, '960e6a50ab6be09e4783734da4ac4fa3', 'hello', 'hello', '', 'AviSan', '12345', 0, 0, 9878597619, '', 0, '', '', '', '', 'arbinder88@gmail.com', 'Gold', '', '', 0, '', '0000-00-00', '', '', 0, 0, 0, 100, '', '', '', 1, 1, 0, 0, ''),
(23, '38f86de91adedec4046c7a1803f1d0e9', '', '', '', '', '', 0, 0, 0, '', 0, '', '', '', '', '', 'Gold', '20/08/2015', '30/08/2015', 0, '', '0000-00-00', '', '', 0, 0, 0, 2000, '', '', '', 0, 0, 0, 0, ''),
(24, 'af41713bee198298e1883c3cb57b8c38', 'avixsxsxsx', 'san', '', 'Avsss', 'abc123', 987888888, 0, 9873397619, '', 0, '', '', '', '', '', 'Gold', '30/08/2015', '31/08/2015', 0, '', '0000-00-00', '', '', 0, 0, 0, 9, '', '', '', 1, 1, 0, 1, ''),
(25, 'a44f91de277d93a644f667aa5c70aff4', '', '', '', '', '', 0, 0, 0, '', 0, '', '', '', '', '', 'Platinum', '27/08/2015', '31/08/2015', 0, '', '0000-00-00', '', '', 0, 0, 0, 100, '', '', '', 0, 0, 0, 0, ''),
(26, '26beb2ee0385b1fcd279fe5abbb23226', '', '', '', '', '', 0, 0, 0, '', 0, '', '', '', '', '', 'Gold', '28/08/2015', '31/10/2016', 0, '', '0000-00-00', '', '', 0, 0, 0, 1000, '', '', '', 0, 0, 0, 0, ''),
(27, '3b8b5d7085dbad87cae037c44b6260ea', '', '', '', '', '', 0, 0, 0, '', 0, '', '', '', '', '', 'Gold', '29/08/2015', '31/08/2015', 0, '', '0000-00-00', '', '', 0, 0, 0, 500, '', '', '', 0, 0, 0, 0, ''),
(28, '7f070bb665f4dc14a3b40233bcdfb4ba', '', '', '', '', '', 0, 0, 0, '', 0, '', '', '', '', '', 'Gold', '28/08/2015', '20/02/2016', 3, '', '0000-00-00', '', '', 0, 0, 0, 1420, '', '', '', 0, 0, 0, 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `sms_call_ids`
--

CREATE TABLE IF NOT EXISTS `sms_call_ids` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `call_id` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

CREATE TABLE IF NOT EXISTS `test` (
  `test1` int(5) NOT NULL,
  `test2` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `test`
--

INSERT INTO `test` (`test1`, `test2`) VALUES
(1, 'hello');

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
('3df693108c0044d27a5e017fc85a10c8', 9815126666);

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
