-- CreateEnum
CREATE TYPE "AuthMethod" AS ENUM ('email', 'google');

-- CreateEnum
CREATE TYPE "QuotationStatus" AS ENUM ('pending', 'accepted', 'canceled');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('firebase');

-- CreateEnum
CREATE TYPE "StoryType" AS ENUM ('image', 'video');

-- CreateEnum
CREATE TYPE "ReviewType" AS ENUM ('service', 'package');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('service', 'package');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'completed');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('sending', 'sent', 'read', 'canceled', 'accepted');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('subject', 'image', 'text', 'quotation');

-- CreateEnum
CREATE TYPE "PackageDocumentType" AS ENUM ('image', 'video', 'file', 'pdf');

-- CreateEnum
CREATE TYPE "WorkerScheduleStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "WorkerBookingStatus" AS ENUM ('available', 'booked');

-- CreateEnum
CREATE TYPE "WorkerEmbeddingType" AS ENUM ('story', 'worker');

-- CreateEnum
CREATE TYPE "CertificateType" AS ENUM ('pdf', 'image');

-- CreateTable
CREATE TABLE "notification" (
    "id" UUID NOT NULL,
    "data" JSONB NOT NULL,
    "is_enabled" BOOLEAN NOT NULL,
    "viewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_config" (
    "id" UUID NOT NULL,
    "data" JSONB NOT NULL,
    "device_token" TEXT NOT NULL,
    "notification_type" "NotificationType" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "notification_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "avatar" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "national_identity" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "country_id" UUID NOT NULL,

    CONSTRAINT "national_identity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speciality" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "speciality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "worker_id" UUID NOT NULL,

    CONSTRAINT "story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_document" (
    "id" UUID NOT NULL,
    "type" "PackageDocumentType" NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "story_id" UUID NOT NULL,

    CONSTRAINT "story_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "specification" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "value_format" TEXT NOT NULL,
    "cover_url" TEXT NOT NULL,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "review_average" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workerId" UUID NOT NULL,

    CONSTRAINT "package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_document" (
    "id" UUID NOT NULL,
    "type" "PackageDocumentType" NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "package_id" UUID NOT NULL,

    CONSTRAINT "package_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotation" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "estimated_time" TIMESTAMPTZ NOT NULL,
    "status" "QuotationStatus" NOT NULL,
    "value_format" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "worker_id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "chat_id" UUID NOT NULL,

    CONSTRAINT "quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotation_detail" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "value" DOUBLE PRECISION NOT NULL,
    "value_format" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quotation_id" UUID NOT NULL,

    CONSTRAINT "quotation_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "service_type" "ReviewType" NOT NULL,
    "description" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_speciality" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "worker_id" UUID NOT NULL,
    "speciality_id" UUID NOT NULL,

    CONSTRAINT "worker_speciality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate" (
    "id" UUID NOT NULL,
    "type" "CertificateType" NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_certificate" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "worker_id" UUID NOT NULL,
    "certificate_id" UUID NOT NULL,

    CONSTRAINT "worker_certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_booking" (
    "id" UUID NOT NULL,
    "status" "WorkerBookingStatus" NOT NULL,
    "date" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "worker_id" UUID NOT NULL,
    "client_id" UUID NOT NULL,

    CONSTRAINT "worker_booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_schedule" (
    "id" UUID NOT NULL,
    "week_day" INTEGER NOT NULL,
    "status" "WorkerScheduleStatus" NOT NULL,
    "start_time" TIMESTAMPTZ NOT NULL,
    "end_time" TIMESTAMPTZ NOT NULL,
    "recurrent_start_time" TIMESTAMPTZ,
    "recurrent_end_time" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "worker_id" UUID NOT NULL,

    CONSTRAINT "worker_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_tax" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "value_format" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "worker_id" UUID NOT NULL,

    CONSTRAINT "worker_tax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Worker" (
    "id" UUID NOT NULL,
    "birth_date" TIMESTAMPTZ NOT NULL,
    "description" TEXT,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "review_average" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "location" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "national_identity" UUID NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report" (
    "id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "from_user_id" UUID NOT NULL,
    "to_user_id" UUID NOT NULL,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_embedding" (
    "id" UUID NOT NULL,
    "type" "WorkerEmbeddingType" NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(1536) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "worker_id" UUID NOT NULL,

    CONSTRAINT "worker_embedding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "region" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "country_id" UUID NOT NULL,

    CONSTRAINT "region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sector" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "region_id" UUID NOT NULL,

    CONSTRAINT "sector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zone" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sector_id" UUID NOT NULL,
    "worker_id" UUID NOT NULL,

    CONSTRAINT "zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" UUID NOT NULL,
    "status" "MessageStatus" NOT NULL,
    "type" "MessageType" NOT NULL,
    "content" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "chat_id" UUID NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat" (
    "id" UUID NOT NULL,
    "subject" TEXT,
    "quotation_accepted" UUID,
    "accepted_date" TIMESTAMPTZ,
    "worker_archived" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "worker_id" UUID NOT NULL,
    "client_id" UUID NOT NULL,

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "service_type" "PaymentType" NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "token" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "value_format" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_roles" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,

    CONSTRAINT "users_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "audit" (
    "audit_id" UUID NOT NULL,
    "table_name" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" JSONB NOT NULL,

    CONSTRAINT "audit_pkey" PRIMARY KEY ("audit_id")
);

-- CreateIndex
CREATE INDEX "notification_user_id_idx" ON "notification"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "notification_config_device_token_key" ON "notification_config"("device_token");

-- CreateIndex
CREATE INDEX "notification_config_user_id_idx" ON "notification_config"("user_id");

-- CreateIndex
CREATE INDEX "notification_config_device_token_idx" ON "notification_config"("device_token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "speciality_name_key" ON "speciality"("name");

-- CreateIndex
CREATE INDEX "story_worker_id_idx" ON "story"("worker_id");

-- CreateIndex
CREATE INDEX "story_document_story_id_idx" ON "story_document"("story_id");

-- CreateIndex
CREATE INDEX "package_document_package_id_idx" ON "package_document"("package_id");

-- CreateIndex
CREATE INDEX "review_user_id_idx" ON "review"("user_id");

-- CreateIndex
CREATE INDEX "review_service_id_idx" ON "review"("service_id");

-- CreateIndex
CREATE INDEX "worker_speciality_worker_id_idx" ON "worker_speciality"("worker_id");

-- CreateIndex
CREATE INDEX "worker_speciality_speciality_id_idx" ON "worker_speciality"("speciality_id");

-- CreateIndex
CREATE INDEX "worker_certificate_worker_id_idx" ON "worker_certificate"("worker_id");

-- CreateIndex
CREATE INDEX "worker_certificate_certificate_id_idx" ON "worker_certificate"("certificate_id");

-- CreateIndex
CREATE INDEX "worker_booking_worker_id_idx" ON "worker_booking"("worker_id");

-- CreateIndex
CREATE INDEX "worker_schedule_worker_id_idx" ON "worker_schedule"("worker_id");

-- CreateIndex
CREATE INDEX "worker_tax_worker_id_idx" ON "worker_tax"("worker_id");

-- CreateIndex
CREATE INDEX "report_from_user_id_idx" ON "report"("from_user_id");

-- CreateIndex
CREATE INDEX "report_to_user_id_idx" ON "report"("to_user_id");

-- CreateIndex
CREATE INDEX "worker_embedding_worker_id_idx" ON "worker_embedding"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "country_name_key" ON "country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "country_code_key" ON "country"("code");

-- CreateIndex
CREATE UNIQUE INDEX "region_name_key" ON "region"("name");

-- CreateIndex
CREATE INDEX "region_country_id_idx" ON "region"("country_id");

-- CreateIndex
CREATE UNIQUE INDEX "sector_name_key" ON "sector"("name");

-- CreateIndex
CREATE INDEX "zone_sector_id_idx" ON "zone"("sector_id");

-- CreateIndex
CREATE INDEX "message_user_id_idx" ON "message"("user_id");

-- CreateIndex
CREATE INDEX "chat_worker_id_idx" ON "chat"("worker_id");

-- CreateIndex
CREATE INDEX "chat_client_id_idx" ON "chat"("client_id");

-- CreateIndex
CREATE INDEX "payment_user_id_idx" ON "payment"("user_id");

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_config" ADD CONSTRAINT "notification_config_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "national_identity" ADD CONSTRAINT "national_identity_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story" ADD CONSTRAINT "story_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_document" ADD CONSTRAINT "story_document_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package" ADD CONSTRAINT "package_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_document" ADD CONSTRAINT "package_document_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation" ADD CONSTRAINT "quotation_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation" ADD CONSTRAINT "quotation_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation" ADD CONSTRAINT "quotation_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_detail" ADD CONSTRAINT "quotation_detail_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_speciality" ADD CONSTRAINT "worker_speciality_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_speciality" ADD CONSTRAINT "worker_speciality_speciality_id_fkey" FOREIGN KEY ("speciality_id") REFERENCES "speciality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_certificate" ADD CONSTRAINT "worker_certificate_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_certificate" ADD CONSTRAINT "worker_certificate_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "certificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_booking" ADD CONSTRAINT "worker_booking_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_booking" ADD CONSTRAINT "worker_booking_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_schedule" ADD CONSTRAINT "worker_schedule_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_tax" ADD CONSTRAINT "worker_tax_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_national_identity_fkey" FOREIGN KEY ("national_identity") REFERENCES "national_identity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_embedding" ADD CONSTRAINT "worker_embedding_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "region" ADD CONSTRAINT "region_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sector" ADD CONSTRAINT "sector_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zone" ADD CONSTRAINT "zone_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sector"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zone" ADD CONSTRAINT "zone_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
