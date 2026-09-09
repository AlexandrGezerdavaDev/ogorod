CREATE TABLE "seed_lot" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"cultivar_id" text NOT NULL,
	"quantity" double precision NOT NULL,
	"unit" text DEFAULT 'шт' NOT NULL,
	"packed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "seed_lot" ADD CONSTRAINT "seed_lot_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seed_lot" ADD CONSTRAINT "seed_lot_cultivar_id_cultivar_id_fk" FOREIGN KEY ("cultivar_id") REFERENCES "public"."cultivar"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "seed_lot_organizationId_idx" ON "seed_lot" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "seed_lot_cultivarId_idx" ON "seed_lot" USING btree ("cultivar_id");