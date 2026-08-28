CREATE TABLE `clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`address` text,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `job_completions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quote_id` integer NOT NULL,
	`quote_item_id` integer,
	`job_id` text NOT NULL,
	`job_name` text NOT NULL,
	`estimated_time` real,
	`actual_time` real,
	`estimated_cost` real NOT NULL,
	`actual_labour_cost` real,
	`actual_material_cost` real,
	`actual_total_cost` real,
	`variance` real,
	`variance_percent` real,
	`notes` text,
	`completed_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`quote_item_id`) REFERENCES `quote_items`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quote_id` integer,
	`completion_id` integer,
	`filename` text NOT NULL,
	`filepath` text NOT NULL,
	`caption` text,
	`type` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`completion_id`) REFERENCES `job_completions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quote_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quote_id` integer NOT NULL,
	`job_id` text NOT NULL,
	`job_name` text NOT NULL,
	`job_category` text NOT NULL,
	`quantity` integer NOT NULL,
	`condition_id` text NOT NULL,
	`condition_label` text NOT NULL,
	`condition_amount` real NOT NULL,
	`material_cost` real DEFAULT 0 NOT NULL,
	`material_markup_percent` real DEFAULT 0 NOT NULL,
	`material_pickup_fee` real DEFAULT 0 NOT NULL,
	`selected_add_on_ids` text DEFAULT '[]' NOT NULL,
	`line_subtotal` real NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quote_number` text NOT NULL,
	`client_id` integer,
	`client_name` text NOT NULL,
	`client_address` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`pricing_mode` text NOT NULL,
	`travel_amount` real DEFAULT 0 NOT NULL,
	`parking_amount` real DEFAULT 0 NOT NULL,
	`access_amount` real DEFAULT 0 NOT NULL,
	`urgency_type` text DEFAULT 'flat' NOT NULL,
	`urgency_amount` real DEFAULT 0 NOT NULL,
	`hst_percent` real DEFAULT 0 NOT NULL,
	`subtotal` real NOT NULL,
	`tax` real NOT NULL,
	`total` real NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `quotes_quote_number_unique` ON `quotes` (`quote_number`);