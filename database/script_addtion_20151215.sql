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
SELECT 'orwen',	'orwen@umiex.com', 'M', null, 
'253e221036b7b2f454c38d61bfe3f2f9f55c776bccf06caae6b9060bc3e7eb4930fb3a6dd75963076b993ba034254244accc2e629e62cb39fc111ae72c3917d8', null, 5, 3, 'USA', now();