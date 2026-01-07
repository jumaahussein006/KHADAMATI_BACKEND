
-- Drop + Create database (wrapper)
DROP DATABASE IF EXISTS `khadamati`;
CREATE DATABASE `khadamati`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `khadamati`;

-- Drop tables safely (so the CREATE TABLE in your dump works cleanly)
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `address`;
DROP TABLE IF EXISTS `admin`;
DROP TABLE IF EXISTS `category`;
DROP TABLE IF EXISTS `certificate`;
DROP TABLE IF EXISTS `customer`;
DROP TABLE IF EXISTS `namechangerequest`;
DROP TABLE IF EXISTS `notification`;
DROP TABLE IF EXISTS `payment`;
DROP TABLE IF EXISTS `provider`;
DROP TABLE IF EXISTS `report`;
DROP TABLE IF EXISTS `review`;
DROP TABLE IF EXISTS `service`;
DROP TABLE IF EXISTS `serviceimage`;
DROP TABLE IF EXISTS `servicerequest`;
DROP TABLE IF EXISTS `status`;
DROP TABLE IF EXISTS `status_history`;
DROP TABLE IF EXISTS `uploads`;
DROP TABLE IF EXISTS `user`;

SET FOREIGN_KEY_CHECKS = 1;

-- (After this line, keep the rest of your original dump as-is)


-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 30, 2025 at 06:45 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `khadamati`
--

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `address_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `building` varchar(50) DEFAULT NULL,
  `floor` varchar(50) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`address_id`, `user_id`, `city`, `street`, `building`, `floor`, `country`, `created_at`) VALUES
(1, 2, 'Beirut', 'Test St', NULL, NULL, 'Lebanon', '2025-12-30 00:22:23'),
(2, 3, 'Beirut', 'Provider St', NULL, NULL, 'Lebanon', '2025-12-30 00:23:14'),
(3, 4, 'Beirut', 'Test Street', NULL, NULL, 'Lebanon', '2025-12-30 00:28:31'),
(4, 5, 'Beirut', 'Test St', NULL, NULL, 'Lebanon', '2025-12-30 00:28:47'),
(5, 6, 'Beirut', 'Test Street', NULL, NULL, 'Lebanon', '2025-12-30 00:39:21'),
(6, 7, 'Baalbek', '82310017@students.liu.edu.lb', NULL, NULL, 'Lebanon', '2025-12-30 01:19:22'),
(7, 8, 'Abu Dhabi', 'ewwd', NULL, NULL, 'Lebanon', '2025-12-30 01:21:34');

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `user_id`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` int(11) NOT NULL,
  `name_ar` varchar(100) NOT NULL,
  `name_en` varchar(100) NOT NULL,
  `description_ar` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `name_ar`, `name_en`, `description_ar`, `description_en`, `icon`, `created_at`) VALUES
(1, 'سباكة', 'Plumbing', 'خدمات السباكة', 'Plumbing services', NULL, '2025-12-26 03:55:53'),
(2, 'كهرباء', 'Electrical', 'خدمات الكهرباء', 'Electrical services', NULL, '2025-12-26 03:55:53'),
(3, 'تنظيف', 'Cleaning', 'خدمات التنظيف', 'Cleaning services', NULL, '2025-12-26 03:55:53'),
(4, 'دهان', 'Painting', 'خدمات الدهان', 'Painting services', NULL, '2025-12-26 03:55:53'),
(5, 'تصليح مكيفات', 'AC Repair', 'خدمات تصليح المكيفات', 'AC Repair services', NULL, '2025-12-26 03:55:53'),
(6, 'نجارة', 'Carpentry', 'خدمات النجارة', 'Carpentry services', NULL, '2025-12-26 03:55:53');

-- --------------------------------------------------------

--
-- Table structure for table `certificate`
--

CREATE TABLE `certificate` (
  `certificate_id` int(11) NOT NULL,
  `provider_id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `issue_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certificate`
--

INSERT INTO `certificate` (`certificate_id`, `provider_id`, `image`, `issue_date`) VALUES
(1, 3, '/uploads/certificate-1767098284615-178951925.jpg', '2025-12-20 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customer_id`, `user_id`) VALUES
(1, 2),
(6, 3),
(2, 4),
(3, 5),
(4, 6),
(5, 7),
(7, 8);

-- --------------------------------------------------------

--
-- Table structure for table `namechangerequest`
--

CREATE TABLE `namechangerequest` (
  `request_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `old_first_name` varchar(50) DEFAULT NULL,
  `old_middle_name` varchar(50) DEFAULT NULL,
  `old_last_name` varchar(50) DEFAULT NULL,
  `new_first_name` varchar(50) NOT NULL,
  `new_middle_name` varchar(50) DEFAULT NULL,
  `new_last_name` varchar(50) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` datetime DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `reviewed_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `title_ar` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `message_ar` text NOT NULL,
  `message_en` text NOT NULL,
  `related_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`notification_id`, `user_id`, `type`, `title_ar`, `title_en`, `message_ar`, `message_en`, `related_id`, `is_read`, `created_at`) VALUES
(1, 9, 'new_request', 'طلب خدمة جديد', 'New Service Request', 'لديك طلب خدمة جديد من العميل لخدمة \"vbdb\"', 'You have a new service request from a customer for \"dfgdf\"', 2, 0, '2025-12-30 16:40:21'),
(2, 9, 'new_request', 'طلب خدمة جديد', 'New Service Request', 'لديك طلب خدمة جديد من العميل لخدمة \"tujytj\"', 'You have a new service request from a customer for \"jtyjyt\"', 3, 0, '2025-12-30 16:57:01'),
(3, 9, 'new_request', 'طلب خدمة جديد', 'New Service Request', 'لديك طلب خدمة جديد من العميل لخدمة \"tujytj\"', 'You have a new service request from a customer for \"jtyjyt\"', 4, 0, '2025-12-30 17:30:28'),
(4, 8, 'request_completed', 'تم إكمال الخدمة', 'Service Completed', 'تم إكمال خدمة \"tujytj\" بنجاح. المبلغ النهائي: 70', 'Service \"jtyjyt\" has been completed successfully. Final amount: 70', 4, 0, '2025-12-30 17:31:09');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `payment_id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `method` varchar(50) DEFAULT NULL,
  `transaction_date` datetime DEFAULT NULL,
  `getaway_response` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`payment_id`, `request_id`, `amount`, `status`, `method`, `transaction_date`, `getaway_response`, `created_at`) VALUES
(1, 4, 70.00, 'pending', 'cash', '2025-12-30 17:31:09', NULL, '2025-12-30 17:31:09');

-- --------------------------------------------------------

--
-- Table structure for table `provider`
--

CREATE TABLE `provider` (
  `provider_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `experience_years` int(11) DEFAULT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT NULL,
  `total_reviews` int(11) DEFAULT 0,
  `is_verified` tinyint(1) DEFAULT 0,
  `verification_document` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `provider`
--

INSERT INTO `provider` (`provider_id`, `user_id`, `experience_years`, `specialization`, `rating`, `total_reviews`, `is_verified`, `verification_document`) VALUES
(1, 3, NULL, 'Plumbing', NULL, 0, 0, NULL),
(2, 8, NULL, 'hvhvhv', NULL, 0, 0, NULL),
(3, 9, NULL, NULL, 0.00, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `report_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `report_type` varchar(50) DEFAULT NULL,
  `target_type` varchar(50) DEFAULT NULL,
  `target_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `admin_reply` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `review_id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `service_id` int(11) NOT NULL,
  `provider_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name_ar` varchar(100) NOT NULL,
  `name_en` varchar(100) NOT NULL,
  `description_ar` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`service_id`, `provider_id`, `category_id`, `name_ar`, `name_en`, `description_ar`, `description_en`, `price`, `created_at`, `duration_minutes`) VALUES
(1, 2, 3, 'ef', 'asd', NULL, NULL, NULL, '2025-12-30 01:39:10', NULL),
(2, 3, 5, 'vbdb', 'dfgdf', 'gdgdfg', 'gdgdfg', 12.00, '2025-12-30 12:38:35', NULL),
(3, 3, 5, 'tujytj', 'jtyjyt', 'jytjtyj', 'jytjtyj', 12.00, '2025-12-30 14:13:35', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `serviceimage`
--

CREATE TABLE `serviceimage` (
  `image_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `provider_id` int(11) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `servicerequest`
--

CREATE TABLE `servicerequest` (
  `request_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `provider_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `scheduled_date` datetime DEFAULT NULL,
  `details` text DEFAULT NULL,
  `problem_type` varchar(100) DEFAULT NULL,
  `request_date` datetime DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','accepted','rejected','in_progress','on_the_way','completed','cancelled') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `servicerequest`
--

INSERT INTO `servicerequest` (`request_id`, `customer_id`, `provider_id`, `service_id`, `scheduled_date`, `details`, `problem_type`, `request_date`, `price`, `status`) VALUES
(1, 5, 2, 1, '2025-12-30 03:47:00', 'jjjj', NULL, '2025-12-30 01:49:41', NULL, 'pending'),
(2, 7, 3, 2, '2025-12-18 16:40:00', 'kjghg', NULL, '2025-12-30 16:40:21', 12.00, 'completed'),
(3, 7, 3, 3, '2025-12-30 16:58:00', 'gggggg', NULL, '2025-12-30 16:57:01', 12.00, 'completed'),
(4, 7, 3, 3, '2025-12-14 21:32:00', 'nnnn', 'AC not cooling', '2025-12-30 17:30:28', 70.00, 'completed');

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `status_id` int(11) NOT NULL,
  `values` varchar(50) NOT NULL,
  `completed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `status_history`
--

CREATE TABLE `status_history` (
  `id` int(11) NOT NULL,
  `service_request_id` int(11) NOT NULL,
  `old_status_id` int(11) DEFAULT NULL,
  `new_status_id` int(11) DEFAULT NULL,
  `changed_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `status_history`
--

INSERT INTO `status_history` (`id`, `service_request_id`, `old_status_id`, `new_status_id`, `changed_by`, `created_at`) VALUES
(1, 2, NULL, NULL, 8, '2025-12-30 16:40:21'),
(2, 2, NULL, NULL, 9, '2025-12-30 16:40:40'),
(3, 2, NULL, NULL, 9, '2025-12-30 16:40:44'),
(4, 3, NULL, NULL, 8, '2025-12-30 16:57:01'),
(5, 3, NULL, NULL, 9, '2025-12-30 16:57:41'),
(6, 3, NULL, NULL, 9, '2025-12-30 17:08:30'),
(7, 4, NULL, NULL, 8, '2025-12-30 17:30:28'),
(8, 4, NULL, NULL, 9, '2025-12-30 17:30:45'),
(9, 4, NULL, NULL, 9, '2025-12-30 17:30:53'),
(10, 4, NULL, NULL, 9, '2025-12-30 17:30:58'),
(11, 4, NULL, NULL, 9, '2025-12-30 17:31:09');

-- --------------------------------------------------------

--
-- Table structure for table `uploads`
--

CREATE TABLE `uploads` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `related_type` varchar(50) DEFAULT NULL,
  `related_id` int(11) DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('admin','customer','provider') NOT NULL DEFAULT 'customer',
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `email`, `password`, `first_name`, `middle_name`, `last_name`, `phone`, `role`, `created_at`) VALUES
(1, 'admin@khadamati.com', '$2b$10$5nhBslLkuhGWFLtW.Znv2.ob0DAkB3kHMkzBto/JxyeLs4LeoOuTq', 'Admin', NULL, 'User', '70000000', 'admin', '2025-12-26 03:55:53'),
(2, 'test@customer.com', '$2a$12$1R2z.2g0gvUhtdIqQdy5tuBzuOezgxPnitfS7xHR28ElmoDbOQyCC', 'Test', NULL, 'Customer', '12345678', 'customer', '2025-12-30 00:22:23'),
(3, 'test@provider.com', '$2a$12$sh5k59ukAhNiMUjt.Aek/OQakhLwCY0xhLPTHKmdO39yooafpx1mq', 'Test', NULL, 'Provider', '87654321', 'customer', '2025-12-30 00:23:14'),
(4, 'testuser@customer.com', '$2a$12$LZXdQBKFL7aqsZzfyKN17egKkbHBufDmZTYhUFDZmFt2fbRkJCiAO', 'Test', NULL, 'User', '12345678', 'customer', '2025-12-30 00:28:31'),
(5, 'newuser@test.com', '$2a$12$OhNC.84pM7TMdwD2GmmALeoHbcYX8MUrkUe4LbRLM2d1etHYktKOW', 'New', NULL, 'User', '12345678', 'customer', '2025-12-30 00:28:47'),
(6, 'finaltest@customer.com', '$2a$12$6cpsQTILyF.IrUQFI7nscOncKa0H09kfstnPsRR8IR0kUOQZk0EYm', 'Final', NULL, 'Test', '12345678', 'customer', '2025-12-30 00:39:21'),
(7, '82310017@students.liu.edu.lb', '$2a$12$ZrJm9eTtAqGTgc9ku498queFiPCmKX3CIJ9HN/GzTmL.UDLlWzbje', 'hussein', NULL, 'joumaa', '79158955', 'customer', '2025-12-30 01:19:22'),
(8, 'hjhp@gmail.com', '$2a$12$UrGhrhqSGRH2b4XrVMuITewW3oNtDLXJ7h7L4uUkztaHdhvnkp.Sm', 'ahmad karzon', NULL, 'hussein', '56747367', 'customer', '2025-12-30 01:21:34'),
(9, 'assal@gmail.com', '$2b$10$JOJ2q12BR9jzu3EnNO4oY.0U8VWjgkB15jOFEsKGSm7kGLAO0U2V2', 'Khaled', NULL, 'assal', '79158955', 'provider', '2025-12-30 12:38:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`address_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_address_city` (`city`),
  ADD KEY `idx_address_street` (`street`),
  ADD KEY `idx_address_user` (`user_id`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `idx_category_names` (`name_ar`,`name_en`);

--
-- Indexes for table `certificate`
--
ALTER TABLE `certificate`
  ADD PRIMARY KEY (`certificate_id`),
  ADD KEY `provider_id` (`provider_id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customer_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `namechangerequest`
--
ALTER TABLE `namechangerequest`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `reviewed_by` (`reviewed_by`),
  ADD KEY `idx_namechange_status` (`status`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_notification_user_read` (`user_id`,`is_read`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `request_id` (`request_id`),
  ADD KEY `idx_payment_status` (`status`);

--
-- Indexes for table `provider`
--
ALTER TABLE `provider`
  ADD PRIMARY KEY (`provider_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `request_id` (`request_id`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`service_id`),
  ADD KEY `provider_id` (`provider_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `idx_service_names` (`name_ar`,`name_en`);

--
-- Indexes for table `serviceimage`
--
ALTER TABLE `serviceimage`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `provider_id` (`provider_id`);

--
-- Indexes for table `servicerequest`
--
ALTER TABLE `servicerequest`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `provider_id` (`provider_id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `idx_servicerequest_status` (`status`),
  ADD KEY `idx_servicerequest_customer` (`customer_id`),
  ADD KEY `idx_servicerequest_provider` (`provider_id`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`status_id`);

--
-- Indexes for table `status_history`
--
ALTER TABLE `status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status_history_request` (`service_request_id`),
  ADD KEY `old_status_id` (`old_status_id`),
  ADD KEY `new_status_id` (`new_status_id`),
  ADD KEY `changed_by` (`changed_by`);

--
-- Indexes for table `uploads`
--
ALTER TABLE `uploads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_uploads_user` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD KEY `idx_user_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `certificate`
--
ALTER TABLE `certificate`
  MODIFY `certificate_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `namechangerequest`
--
ALTER TABLE `namechangerequest`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `provider`
--
ALTER TABLE `provider`
  MODIFY `provider_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service`
--
ALTER TABLE `service`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `serviceimage`
--
ALTER TABLE `serviceimage`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `servicerequest`
--
ALTER TABLE `servicerequest`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `status_history`
--
ALTER TABLE `status_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `uploads`
--
ALTER TABLE `uploads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `address_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `certificate`
--
ALTER TABLE `certificate`
  ADD CONSTRAINT `certificate_ibfk_1` FOREIGN KEY (`provider_id`) REFERENCES `provider` (`provider_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `namechangerequest`
--
ALTER TABLE `namechangerequest`
  ADD CONSTRAINT `namechangerequest_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `namechangerequest_ibfk_4` FOREIGN KEY (`reviewed_by`) REFERENCES `admin` (`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `servicerequest` (`request_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `provider`
--
ALTER TABLE `provider`
  ADD CONSTRAINT `provider_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `report_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `report_ibfk_4` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `servicerequest` (`request_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `service`
--
ALTER TABLE `service`
  ADD CONSTRAINT `service_ibfk_3` FOREIGN KEY (`provider_id`) REFERENCES `provider` (`provider_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `service_ibfk_4` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `serviceimage`
--
ALTER TABLE `serviceimage`
  ADD CONSTRAINT `serviceimage_ibfk_3` FOREIGN KEY (`service_id`) REFERENCES `service` (`service_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `serviceimage_ibfk_4` FOREIGN KEY (`provider_id`) REFERENCES `provider` (`provider_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `servicerequest`
--
ALTER TABLE `servicerequest`
  ADD CONSTRAINT `servicerequest_ibfk_4` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `servicerequest_ibfk_5` FOREIGN KEY (`provider_id`) REFERENCES `provider` (`provider_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `servicerequest_ibfk_6` FOREIGN KEY (`service_id`) REFERENCES `service` (`service_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `status_history`
--
ALTER TABLE `status_history`
  ADD CONSTRAINT `status_history_ibfk_1` FOREIGN KEY (`service_request_id`) REFERENCES `servicerequest` (`request_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `status_history_ibfk_2` FOREIGN KEY (`old_status_id`) REFERENCES `status` (`status_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `status_history_ibfk_3` FOREIGN KEY (`new_status_id`) REFERENCES `status` (`status_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `status_history_ibfk_4` FOREIGN KEY (`changed_by`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `uploads`
--
ALTER TABLE `uploads`
  ADD CONSTRAINT `uploads_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
