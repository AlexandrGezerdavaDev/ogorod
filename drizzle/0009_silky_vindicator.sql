CREATE TABLE "care_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"species_id" text NOT NULL,
	"image_url" text,
	"growing" jsonb NOT NULL,
	"genetics" jsonb NOT NULL,
	"usage" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "care_profile_species_id_unique" UNIQUE("species_id")
);
--> statement-breakpoint
CREATE TABLE "classification_group" (
	"id" text PRIMARY KEY NOT NULL,
	"name_uk" text NOT NULL,
	"name_en" text,
	"type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classification_value" (
	"id" text PRIMARY KEY NOT NULL,
	"group_id" text NOT NULL,
	"name_uk" text NOT NULL,
	"name_en" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "species_classification" (
	"species_id" text NOT NULL,
	"classification_value_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "species_classification_species_id_classification_value_id_pk" PRIMARY KEY("species_id","classification_value_id")
);
--> statement-breakpoint
CREATE TABLE "species_disease" (
	"species_id" text NOT NULL,
	"disease_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "species_disease_species_id_disease_id_pk" PRIMARY KEY("species_id","disease_id")
);
--> statement-breakpoint
DROP INDEX "species_category_idx";--> statement-breakpoint
ALTER TABLE "care_profile" ADD CONSTRAINT "care_profile_species_id_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classification_value" ADD CONSTRAINT "classification_value_group_id_classification_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."classification_group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "species_classification" ADD CONSTRAINT "species_classification_species_id_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "species_classification" ADD CONSTRAINT "species_classification_classification_value_id_classification_value_id_fk" FOREIGN KEY ("classification_value_id") REFERENCES "public"."classification_value"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "species_disease" ADD CONSTRAINT "species_disease_species_id_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "species_disease" ADD CONSTRAINT "species_disease_disease_id_disease_id_fk" FOREIGN KEY ("disease_id") REFERENCES "public"."disease"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "classification_group_type_idx" ON "classification_group" USING btree ("type");--> statement-breakpoint
CREATE INDEX "classification_value_groupId_idx" ON "classification_value" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "species_classification_valueId_idx" ON "species_classification" USING btree ("classification_value_id");--> statement-breakpoint
CREATE INDEX "species_disease_diseaseId_idx" ON "species_disease" USING btree ("disease_id");--> statement-breakpoint
ALTER TABLE "species" DROP COLUMN "category";