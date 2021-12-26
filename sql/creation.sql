CREATE TABLE `marital_statuses` (
  `id` increments,
  `marital_status` string,
  `code` string,
  PRIMARY KEY (`id`),
  KEY `REQ` (`marital_status`, `code`),
  KEY `UNIQ` (`marital_status`, `code`)
);

CREATE TABLE `municipalities` (
  `id` increments,
  `municipality_string` string,
  `google_code_id` string,
  PRIMARY KEY (`id`),
  KEY `REQ` (`municipality_string`, `google_code_id`),
  KEY `UNIQ` (`municipality_string`, `google_code_id`)
);

CREATE TABLE `doc_types` (
  `id` increments,
  `doc_type` string,
  `code` string,
  PRIMARY KEY (`id`),
  KEY `REQ` (`doc_type`, `code`),
  KEY `UNIQ` (`doc_type`, `code`)
);

CREATE TABLE `organization_types` (
  `id` increments,
  `organization_type` string,
  PRIMARY KEY (`id`),
  KEY `REQ` (`organization_type`),
  KEY `UNIQ` (`organization_type`)
);

CREATE TABLE `organizations` (
  `id` increments,
  `organization_name` string,
  `organization_doc` string,
  `doc_type_id` integer,
  `phone_number` string,
  `address` string,
  `email` string,
  `website` string,
  `parent_organization_id` integer,
  `municipality_id` integer,
  `organization_type_id` integer,
  `` timestamps,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`municipality_id`) REFERENCES `municipalities`(`id`),
  FOREIGN KEY (`doc_type_id`) REFERENCES `doc_types`(`id`),
  FOREIGN KEY (`parent_organization_id`) REFERENCES `organizations`(`id`),
  FOREIGN KEY (`organization_type_id`) REFERENCES `organization_types`(`id`),
  KEY `REQ` (`organization_name`, `organization_doc`, `doc_type_id`, `phone_number`, `address`, `email`, `organization_type_id`),
  KEY `UNIQ` (`organization_name`)
);

CREATE TABLE `users` (
  `id` increments,
  `doc` string,
  `doc_type_id` integer,
  `first_name` string,
  `last_name` string,
  `` timestamps,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`doc_type_id`) REFERENCES `doc_types`(`id`),
  KEY `REQ` (`doc`, `doc_type_id`, `first_name`, `last_name`),
  KEY `UNIQ` (`doc`)
);

CREATE TABLE `census` (
  `id` increments,
  `year` date,
  `organization_id` integer,
  `reporter_user_id` integer,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`),
  FOREIGN KEY (`reporter_user_id`) REFERENCES `users`(`id`),
  KEY `REQ` (`year`, `organization_id`, `reporter_user_id`)
);

CREATE TABLE `information_categories` (
  `id` increments,
  `information_category` string,
  PRIMARY KEY (`id`),
  KEY `REQ` (`information_category`),
  KEY `UNIQ` (`information_category`)
);

CREATE TABLE `genders` (
  `id` increments,
  `gender` string,
  `code` string,
  PRIMARY KEY (`id`),
  KEY `REQ` (`gender`, `code`),
  KEY `UNIQ` (`gender`, `code`)
);

CREATE TABLE `adresses` (
  `id` increments,
  `adress` string,
  PRIMARY KEY (`id`),
  KEY `REQ` (`adress`),
  KEY `UNIQ` (`adress`)
);

CREATE TABLE `roles` (
  `id` increments,
  `role` string,
  PRIMARY KEY (`id`),
  KEY `REQ` (`role`),
  KEY `UNIQ` (`role`)
);

CREATE TABLE `users_roles_organizations` (
  `id` increments,
  `user_id` integer,
  `rol_id` integer,
  `organization_id` integer,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`),
  FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`),
  KEY `REQ` (`user_id`, `rol_id`, `organization_id`)
);

CREATE TABLE `login` (
  `id` increments,
  `user_id` integer,
  `email` string,
  `digest_password` string,
  `phone_number` string,
  `` timestamps,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  KEY `REQ` (`user_id`, `email`, `digest_password`, `phone_number`),
  KEY `UNIQ` (`user_id`, `email`)
);

CREATE TABLE `education_levels` (
  `id` increments,
  `education_level` string,
  `code` string,
  PRIMARY KEY (`id`),
  KEY `REQ` (`education_level`, `code`),
  KEY `UNIQ` (`education_level`, `code`)
);

CREATE TABLE `proceedings` (
  `id` increments,
  `proceeding_name` string,
  `file_url` text,
  `start_date` date,
  `end_date` date,
  PRIMARY KEY (`id`),
  KEY `REQ` (`proceeding_name`, `file_url`, `start_date`)
);

CREATE TABLE `agreements` (
  `id` increments,
  `agreement` text,
  `proceeding_id` integer,
  `responsible` text,
  `budget` decimal(13,2),
  `compliance_date` date,
  `advance` integer,
  `milestones` text,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`proceeding_id`) REFERENCES `proceedings`(`id`),
  KEY `REQ` (`agreement`, `proceeding_id`, `responsible`)
);

CREATE TABLE `organizations_proceedings` (
  `id` increments,
  `proceeding_id` integer,
  `organization_id` integer,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`),
  FOREIGN KEY (`proceeding_id`) REFERENCES `proceedings`(`id`),
  KEY `REQ` (`proceeding_id`, `organization_id`)
);

CREATE TABLE `phone_numbers` (
  `id` increments,
  `phone_number` string,
  PRIMARY KEY (`id`),
  KEY `REQ` (`phone_number`),
  KEY `UNIQ` (`phone_number`)
);

CREATE TABLE `professions` (
  `id` increments,
  `profession` string,
  `code` string,
  PRIMARY KEY (`id`),
  KEY `REQ` (`profession`, `code`),
  KEY `UNIQ` (`profession`, `code`)
);

CREATE TABLE `organization_information_label` (
  `id` increments,
  `information_category_id` integer,
  `label` integer,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`information_category_id`) REFERENCES `information_categories`(`id`),
  KEY `REQ` (`information_category_id`, `label`)
);

CREATE TABLE `organization_information` (
  `id` increments,
  `organization_id` integer,
  `label_id` integer,
  `value` string,
  `` timestamps,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`label_id`) REFERENCES `organization_information_label`(`id`),
  FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`),
  KEY `REQ` (`organization_id`, `label_id`, `value`)
);

CREATE TABLE `relationships` (
  `id` increments,
  `relationship` string,
  `code` string,
  PRIMARY KEY (`id`),
  KEY `REQ` (`relationship`, `code`),
  KEY `UNIQ` (`relationship`, `code`)
);

CREATE TABLE `census_persons` (
  `id` increments,
  `census_id` integer,
  `doc` string,
  `doc_type_id` integer,
  `first_name` string,
  `last_name` string,
  `family_id` integer,
  `bith_date` date,
  `relationship_id` integer,
  `gender_id` integer,
  `marital_status_id` integer,
  `profession_id` integer,
  `education_level_id` integer,
  `adress_id` integer,
  `phone_number` integer,
  `` timestamps,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`relationship_id`) REFERENCES `relationships`(`id`),
  FOREIGN KEY (`profession_id`) REFERENCES `professions`(`id`),
  FOREIGN KEY (`gender_id`) REFERENCES `genders`(`id`),
  FOREIGN KEY (`census_id`) REFERENCES `census`(`id`),
  FOREIGN KEY (`phone_number`) REFERENCES `phone_numbers`(`id`),
  FOREIGN KEY (`education_level_id`) REFERENCES `education_levels`(`id`),
  FOREIGN KEY (`doc_type_id`) REFERENCES `doc_types`(`id`),
  FOREIGN KEY (`marital_status_id`) REFERENCES `marital_statuses`(`id`),
  FOREIGN KEY (`adress_id`) REFERENCES `adresses`(`id`),
  KEY `REQ` (`census_id`, `doc`, `doc_type_id`, `first_name`, `bith_date`, `relationship_id`, `gender_id`, `marital_status_id`, `profession_id`, `education_level_id`, `adress_id`, `phone_number`),
  KEY `UNIQ` (`doc`)
);

