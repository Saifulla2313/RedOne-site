import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "leads" ADD COLUMN "consent" boolean;
  ALTER TABLE "leads" ADD COLUMN "consent_version" varchar;
  ALTER TABLE "contacts" ADD COLUMN "legal_address" varchar;
  ALTER TABLE "contacts" ADD COLUMN "privacy_email" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "leads" DROP COLUMN "consent";
  ALTER TABLE "leads" DROP COLUMN "consent_version";
  ALTER TABLE "contacts" DROP COLUMN "legal_address";
  ALTER TABLE "contacts" DROP COLUMN "privacy_email";`)
}
