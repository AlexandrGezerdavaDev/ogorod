ALTER TABLE "seed_lot" ALTER COLUMN "cultivar_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "seed_lot" ADD COLUMN "species_id" text;--> statement-breakpoint
ALTER TABLE "seed_lot" ADD COLUMN "name" text;--> statement-breakpoint
UPDATE "seed_lot" AS s
SET
  "name" = c."name",
  "species_id" = c."species_id"
FROM "cultivar" AS c
WHERE s."cultivar_id" = c."id";--> statement-breakpoint
UPDATE "seed_lot" SET "name" = '—' WHERE "name" IS NULL;--> statement-breakpoint
ALTER TABLE "seed_lot" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "seed_lot" ADD CONSTRAINT "seed_lot_species_id_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "seed_lot_speciesId_idx" ON "seed_lot" USING btree ("species_id");
