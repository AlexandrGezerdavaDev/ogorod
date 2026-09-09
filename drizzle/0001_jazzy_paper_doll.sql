CREATE TABLE "device" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sync_receipt" (
	"device_id" uuid NOT NULL,
	"item_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sync_receipt_device_id_item_id_pk" PRIMARY KEY("device_id","item_id")
);
--> statement-breakpoint
CREATE TABLE "farm_change" (
	"seq" bigserial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"entity" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"operation" text NOT NULL,
	"version" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kb_change" (
	"revision" bigserial PRIMARY KEY NOT NULL,
	"entity" text NOT NULL,
	"entity_id" text NOT NULL,
	"operation" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "device" ADD CONSTRAINT "device_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_receipt" ADD CONSTRAINT "sync_receipt_device_id_device_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."device"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "farm_change" ADD CONSTRAINT "farm_change_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "device_userId_idx" ON "device" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sync_receipt_deviceId_idx" ON "sync_receipt" USING btree ("device_id");--> statement-breakpoint
CREATE INDEX "farm_change_org_seq_idx" ON "farm_change" USING btree ("organization_id","seq");--> statement-breakpoint
CREATE INDEX "farm_change_entityId_idx" ON "farm_change" USING btree ("entity","entity_id");--> statement-breakpoint
CREATE INDEX "kb_change_entityId_idx" ON "kb_change" USING btree ("entity","entity_id");