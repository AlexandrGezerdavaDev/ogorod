ALTER TABLE "planting" ALTER COLUMN "cultivar_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "planting" ADD COLUMN "species_id" text;--> statement-breakpoint
ALTER TABLE "planting" ADD CONSTRAINT "planting_species_id_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "planting_speciesId_idx" ON "planting" USING btree ("species_id");