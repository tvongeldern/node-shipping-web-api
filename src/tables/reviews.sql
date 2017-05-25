CREATE TABLE `reviews` (
  `reviewId` int(11) NOT NULL AUTO_INCREMENT,
  `ts` datetime DEFAULT CURRENT_TIMESTAMP,
  `rating` tinyint(1) DEFAULT NULL,
  `review` varchar(1000) DEFAULT NULL,
  `response` varchar(1000) DEFAULT NULL,
  `resolution` varchar(1000) DEFAULT NULL,
  `response_approval` tinyint(1) DEFAULT NULL,
  `loadId` int(11) DEFAULT NULL,
  `vendor` int(11) DEFAULT NULL,
  `warehouse` int(11) DEFAULT NULL,
  `reviewer` int(11) DEFAULT NULL,
  PRIMARY KEY (`reviewId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8