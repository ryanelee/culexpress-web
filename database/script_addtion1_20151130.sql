INSERT INTO `culexpress`.`system_user`
(`userName`,
`emailAddress`,
`gender`,
`photo`,
`password`,
`customerNumber`,
`userTypeID`,
`roleID`,
`countryCode`,
`registerDate`
)
SELECT 'or_cs',	'or_cs@umiex.com', 'M', null, 
'3a83f7f1290c2e8a8ef5f28007e76a68a7734f7785a0f8a0e88426cee164c37767784c42e717f5950001fe3ea4510c5ccdb797300a53d4f4abff6147c6002f9f', null, 6, 3, 'USA', now();

INSERT INTO `culexpress`.`system_user`
(`userName`,
`emailAddress`,
`gender`,
`photo`,
`password`,
`customerNumber`,
`userTypeID`,
`roleID`,
`countryCode`,
`registerDate`
)
SELECT 'or_admin',	'or_admin@umiex.com', 'M', null, 
'3a83f7f1290c2e8a8ef5f28007e76a68a7734f7785a0f8a0e88426cee164c37767784c42e717f5950001fe3ea4510c5ccdb797300a53d4f4abff6147c6002f9f', null, 5, 3, 'USA', now();

INSERT INTO `system_usertype` VALUES (5,'or_admin',3,'2015-10-10 20:41:30','super_admin'),(6,'or_cs',3,'2015-10-10 20:41:30','super_admin');
