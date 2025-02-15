-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 15, 2025 at 01:28 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `graden_service_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `service_types`
--

CREATE TABLE `service_types` (
  `service_type_id` int UNSIGNED NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `base_price` decimal(10,2) DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `service_types`
--

INSERT INTO `service_types` (`service_type_id`, `name`, `description`, `base_price`, `type`) VALUES
(17, 'ตัดหญ้า', 'บริการตัดหญ้าและจัดแต่งสนามหญ้าให้เรียบร้อย คิดราคาต่อตารางเมตร', '25.00', 'บริการดูแลสวนพื้นฐาน'),
(18, 'ตัดแต่งพุ่มไม้', 'บริการตัดแต่งทรงพุ่มไม้ประดับให้สวยงาม คิดราคาต่อต้น', '150.00', 'บริการดูแลสวนพื้นฐาน'),
(19, 'รดน้ำต้นไม้', 'บริการรดน้ำและให้ปุ๋ยต้นไม้ คิดราคาต่อครั้ง', '300.00', 'บริการดูแลสวนพื้นฐาน'),
(20, 'กำจัดวัชพืช', 'บริการถอนและกำจัดวัชพืช คิดราคาต่อตารางเมตร', '35.00', 'บริการดูแลสวนพื้นฐาน'),
(21, 'พ่นยากำจัดศัตรูพืช', 'บริการพ่นยากำจัดแมลงและโรคพืช คิดราคาต่อครั้ง', '500.00', 'บริการดูแลต้นไม้เฉพาะทาง'),
(22, 'ใส่ปุ๋ยบำรุงดิน', 'บริการใส่ปุ๋ยและปรับปรุงคุณภาพดิน คิดราคาต่อตารางเมตร', '45.00', 'บริการดูแลต้นไม้เฉพาะทาง'),
(23, 'ตัดแต่งกิ่งไม้ใหญ่', 'บริการตัดแต่งกิ่งไม้ขนาดใหญ่ คิดราคาต่อต้น', '800.00', 'บริการดูแลต้นไม้เฉพาะทาง'),
(24, 'จัดสวนหย่อม', 'บริการออกแบบและจัดสวนหย่อมขนาดเล็ก คิดราคาต่อตารางเมตร', '1200.00', 'บริการจัดสวน'),
(25, 'ปูหญ้า', 'บริการปูหญ้าใหม่ คิดราคาต่อตารางเมตร', '180.00', 'บริการจัดสวน'),
(26, 'ทำระบบรดน้ำอัตโนมัติ', 'ติดตั้งระบบรดน้ำอัตโนมัติ คิดราคาต่อจุด', '2500.00', 'บริการจัดสวน'),
(27, 'ทำความสะอาดสระน้ำในสวน', 'บริการทำความสะอาดและบำรุงรักษาสระน้ำ คิดราคาต่อครั้ง', '3500.00', 'บริการพิเศษ'),
(28, 'จัดแต่งสวนญี่ปุ่น', 'บริการดูแลและจัดแต่งสวนสไตล์ญี่ปุ่น คิดราคาต่อครั้ง', '4500.00', 'บริการพิเศษ'),
(29, 'ตกแต่งสวนตามเทศกาล', 'บริการตกแต่งสวนตามเทศกาลต่างๆ คิดราคาต่อครั้ง', '5000.00', 'บริการพิเศษ'),
(30, 'แพ็คเกจดูแลสวนรายเดือน - เล็ก', 'บริการดูแลสวนขนาดไม่เกิน 100 ตารางเมตร รวมตัดหญ้า ตัดแต่งพุ่มไม้ รดน้ำ และกำจัดวัชพืช เดือนละ 2 ครั้ง', '3500.00', 'แพ็คเกจบริการ'),
(31, 'แพ็คเกจดูแลสวนรายเดือน - กลาง', 'บริการดูแลสวนขนาด 101-300 ตารางเมตร รวมตัดหญ้า ตัดแต่งพุ่มไม้ รดน้ำ และกำจัดวัชพืช เดือนละ 2 ครั้ง', '6500.00', 'แพ็คเกจบริการ'),
(32, 'แพ็คเกจดูแลสวนรายเดือน - ใหญ่', 'บริการดูแลสวนขนาด 301-500 ตารางเมตร รวมตัดหญ้า ตัดแต่งพุ่มไม้ รดน้ำ และกำจัดวัชพืช เดือนละ 2 ครั้ง', '9500.00', 'แพ็คเกจบริการ');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `service_types`
--
ALTER TABLE `service_types`
  ADD PRIMARY KEY (`service_type_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `service_types`
--
ALTER TABLE `service_types`
  MODIFY `service_type_id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
