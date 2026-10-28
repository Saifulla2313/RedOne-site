import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pricing_items_unit" AS ENUM('m2', 'month', 'percent');
  CREATE TYPE "public"."enum_pricing_items_in_full" AS ENUM('gift', 'same');
  CREATE TABLE "pricing_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"service_id" integer,
  	"price" numeric NOT NULL,
  	"unit" "enum_pricing_items_unit" DEFAULT 'm2' NOT NULL,
  	"basis" varchar,
  	"in_full" "enum_pricing_items_in_full" DEFAULT 'same' NOT NULL
  );
  
  CREATE TABLE "pricing" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_title" varchar DEFAULT 'FULL',
  	"example_area" numeric DEFAULT 100,
  	"full_lead" varchar DEFAULT 'Полный комплекс услуг RED ONE: от первых замеров и разработки проекта до комплектации и ведения строительных работ. При заказе пакета FULL пять услуг — в подарок.',
  	"team" varchar DEFAULT 'За ваш ремонт отвечает команда: менеджер проекта, прораб и закупщик. Ведущий дизайнер сопровождает реализацию проектных решений в рамках авторского надзора.',
  	"conditions" varchar DEFAULT 'Комплектация оплачивается по ставке 10% от стоимости закупок.
  Ведение строительных работ — 15% от стоимости работ, погрузки, выгрузки, подъёмов, логистики и уборок. Стоимость строительных материалов в базу расчёта не входит.
  Строительные работы, материалы, мебель, техника и сопутствующие расходы оплачиваются отдельно по согласованным сметам.
  Подарочные условия действуют при заказе полного комплекса услуг и фиксируются в договоре.
  Гарантия на выполненные ремонтно-строительные работы — 5 лет. Условия гарантии закрепляются в договоре.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DROP TABLE "quiz_rates" CASCADE;
  DROP TABLE "quiz_conditions" CASCADE;
  ALTER TABLE "pricing_items" ADD CONSTRAINT "pricing_items_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pricing_items" ADD CONSTRAINT "pricing_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pricing_items_order_idx" ON "pricing_items" USING btree ("_order");
  CREATE INDEX "pricing_items_parent_id_idx" ON "pricing_items" USING btree ("_parent_id");
  CREATE INDEX "pricing_items_service_idx" ON "pricing_items" USING btree ("service_id");
  DROP TYPE "public"."enum_quiz_rates_object_type";
  DROP TYPE "public"."enum_quiz_rates_pkg";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_quiz_rates_object_type" AS ENUM('apartment', 'house', 'commercial');
  CREATE TYPE "public"."enum_quiz_rates_pkg" AS ENUM('planning', 'standard', 'full');
  CREATE TABLE "quiz_rates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"object_type" "enum_quiz_rates_object_type" NOT NULL,
  	"pkg" "enum_quiz_rates_pkg" NOT NULL,
  	"rate" numeric NOT NULL
  );
  
  CREATE TABLE "quiz_conditions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"k" numeric NOT NULL
  );
  
  DROP TABLE "pricing_items" CASCADE;
  DROP TABLE "pricing" CASCADE;
  ALTER TABLE "quiz_rates" ADD CONSTRAINT "quiz_rates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quiz"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quiz_conditions" ADD CONSTRAINT "quiz_conditions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quiz"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "quiz_rates_order_idx" ON "quiz_rates" USING btree ("_order");
  CREATE INDEX "quiz_rates_parent_id_idx" ON "quiz_rates" USING btree ("_parent_id");
  CREATE INDEX "quiz_conditions_order_idx" ON "quiz_conditions" USING btree ("_order");
  CREATE INDEX "quiz_conditions_parent_id_idx" ON "quiz_conditions" USING btree ("_parent_id");
  DROP TYPE "public"."enum_pricing_items_unit";
  DROP TYPE "public"."enum_pricing_items_in_full";`)
}
