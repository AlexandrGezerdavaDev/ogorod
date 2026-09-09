ALTER TABLE "species" ADD COLUMN "category" text DEFAULT 'vegetable' NOT NULL;--> statement-breakpoint
CREATE INDEX "species_category_idx" ON "species" USING btree ("category");