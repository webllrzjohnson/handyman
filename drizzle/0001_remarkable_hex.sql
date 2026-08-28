ALTER TABLE `quote_items` ADD `material_id` text DEFAULT 'client' NOT NULL;--> statement-breakpoint
ALTER TABLE `quote_items` ADD `location` text DEFAULT 'Other' NOT NULL;