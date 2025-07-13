"use server"
import OpenAI           from "openai"
import prisma           from "@/lib/prisma"
import {
  PrismaNationalIdentityFormatData
}                       from "@/modules/national_identity_format/infrastructure/prisma_national_identity_format_data"
import {
  AddNationalIdentityFormat
}                       from "@/modules/national_identity_format/application/add_national_identity_format"
import {
  RemoveNationalIdentityFormat
}                       from "@/modules/national_identity_format/application/remove_national_identity_format"
import {
  UpdateNationalIdentityFormat
}                       from "@/modules/national_identity_format/application/update_national_identity_format"
import {
  SearchNationalIdentityFormat
}                       from "@/modules/national_identity_format/application/search_national_identity_format"
import {
  PrismaCountryData
}                       from "@/modules/country/infrastructure/persistance/prisma_country_data"
import {
  AddCountry
}                       from "@/modules/country/application/add_country"
import {
  RemoveCountry
}                       from "@/modules/country/application/remove_country"
import {
  UpdateCountry
}                       from "@/modules/country/application/update_country"
import {
  SearchCountry
}                       from "@/modules/country/application/search_country"
import {
  PrismaCertificateData
}                       from "@/modules/certificate/infrastructure/persistance/prisma_certificate_data"
import {
  GetCertificateByWorker
}                       from "@/modules/certificate/application/get_certificate_by_worker"
import {
  UpsertCertificates
}                       from "@/modules/certificate/application/upsert_certificates"
import {
  PrismaChatData
}                       from "@/modules/chat/infrastructure/prisma_chat_data"
import {
  AddChat
}                       from "@/modules/chat/application/add_chat"
import {
  UpdateChat
}                       from "@/modules/chat/application/update_chat"
import {
  GetChatByUser
}                       from "@/modules/chat/application/get_chat_by_user"
import {
  PrismaCurrencyData
}                       from "@/modules/currency/infrastructure/prisma_currency_data"
import {
  AddCurrency
}                       from "@/modules/currency/application/add_currency"
import {
  RemoveCurrency
}                       from "@/modules/currency/application/remove_currency"
import {
  UpdateCurrency
}                       from "@/modules/currency/application/update_currency"
import {
  SearchCurrency
}                       from "@/modules/currency/application/search_currency"
import {
  PrismaMessageData
}                       from "@/modules/message/infrastructure/prisma_message_data"
import {
  AddMessage
}                       from "@/modules/message/application/add_message"
import {
  UpdateMessage
}                       from "@/modules/message/application/update_message"
import {
  GetMessageByChat
}                       from "@/modules/message/application/get_message_by_chat"
import {
  PrismaNotificationData
}                       from "@/modules/notification/infrastructure/persistance/prisma_notification_data"
import {
  SendNotification
}                       from "@/modules/notification/application/send_notification"
import {
  UpdateNotification
}                       from "@/modules/notification/application/update_notification"
import {
  SearchNotifications
}                       from "@/modules/notification/application/search_notifications"
import {
  PrismaNotificationConfigData
}                       from "@/modules/notification_config/infrastructure/persistance/prisma_notification_config_data"
import {
  AddNotificationConfig
}                       from "@/modules/notification_config/application/add_notification_config"
import {
  RemoveNotificationConfig
}                       from "@/modules/notification_config/application/remove_notification_config"
import {
  UpdateNotificationConfig
}                       from "@/modules/notification_config/application/update_notification_config"
import {
  SearchNotificationConfig
}                       from "@/modules/notification_config/application/search_notification_config"
import {
  PrismaPackageData
}                       from "@/modules/package/infrastructure/prisma_package_data"
import {
  AddPackage
}                       from "@/modules/package/application/add_package"
import {
  RemovePackage
}                       from "@/modules/package/application/remove_package"
import {
  UpdatePackage
}                       from "@/modules/package/application/update_package"
import {
  SearchPackage
}                       from "@/modules/package/application/search_package"
import {
  UpsertPackages
}                       from "@/modules/package/application/upsert_packages"
import {
  PrismaPaymentData
}                       from "@/modules/payment/infrastructure/prisma_payment_data"
import {
  AddPayment
}                       from "@/modules/payment/application/add_payment"
import {
  UpdatePayment
}                       from "@/modules/payment/application/update_payment"
import {
  SearchPayment
}                       from "@/modules/payment/application/search_payment"
import {
  PrismaPhoneFormatData
}                       from "@/modules/phone_format/infrastructure/prisma_phone_format_data"
import {
  AddPhoneFormat
}                       from "@/modules/phone_format/application/add_phone_format"
import {
  RemovePhoneFormat
}                       from "@/modules/phone_format/application/remove_phone_format"
import {
  UpdatePhoneFormat
}                       from "@/modules/phone_format/application/update_phone_format"
import {
  SearchPhoneFormat
}                       from "@/modules/phone_format/application/search_phone_format"
import {
  PrismaQuotationData
}                       from "@/modules/quotation/infrastructure/prisma_quotation_data"
import {
  AddQuotation
}                       from "@/modules/quotation/application/add_quotation"
import {
  UpdateQuotation
}                       from "@/modules/quotation/application/update_quotation"
import {
  SearchQuotation
}                       from "@/modules/quotation/application/search_quotation"
import {
  PrismaRegionData
}                       from "@/modules/region/infrastructure/persistance/prisma_region_data"
import {
  AddRegion
}                       from "@/modules/region/application/add_region"
import {
  RemoveRegion
}                       from "@/modules/region/application/remove_region"
import {
  UpdateRegion
}                       from "@/modules/region/application/update_region"
import {
  SearchRegion
}                       from "@/modules/region/application/search_region"
import {
  PrismaReviewData
}                       from "@/modules/review/infrastructure/persistance/prisma_review_data"
import {
  AddReview
}                       from "@/modules/review/application/add_review"
import {
  GetReviewByUser
}                       from "@/modules/review/application/get_review_by_user"
import {
  PrismaSectorData
}                       from "@/modules/sector/infrastructure/persistance/prisma_sector_data"
import {
  AddSector
}                       from "@/modules/sector/application/add_sector"
import {
  RemoveSector
}                       from "@/modules/sector/application/remove_sector"
import {
  UpdateSector
}                       from "@/modules/sector/application/update_sector"
import {
  SearchSector
}                       from "@/modules/sector/application/search_sector"
import {
  PrismaSpecialityData
}                       from "@/modules/speciality/infrastructure/persistance/prisma_speciality_data"
import {
  AddSpeciality
}                       from "@/modules/speciality/application/add_speciality"
import {
  RemoveSpeciality
}                       from "@/modules/speciality/application/remove_speciality"
import {
  UpdateSpeciality
}                       from "@/modules/speciality/application/update_speciality"
import {
  SearchSpeciality
}                       from "@/modules/speciality/application/search_speciality"
import {
  PrismaStoryData
}                       from "@/modules/story/infrastructure/persistance/prisma_story_data"
import {
  AddStory
}                       from "@/modules/story/application/add_story"
import {
  RemoveStory
}                       from "@/modules/story/application/remove_story"
import {
  UpdateStory
}                       from "@/modules/story/application/update_story"
import {
  GetStoryByWorker
}                       from "@/modules/story/application/get_story_by_worker"
import {
  UpsertStories
}                       from "@/modules/story/application/upsert_stories"
import {
  GetStoryById
}                       from "@/modules/story/application/get_story_by_id"
import {
  PrismaWorkerTaxData
}                       from "@/modules/worker_tax/infrastructure/persistance/prisma_worker_tax_data"
import {
  GetByWorkerTax
}                       from "@/modules/worker_tax/application/get_by_worker_tax"
import {
  UpsertWorkerTax
}                       from "@/modules/worker_tax/application/upsert_worker_tax"
import {
  PrismaUserData
}                       from "@/modules/user/infrastructure/prisma_user_data"
import {
  SupabaseAdminUserData
}                       from "@/modules/user/infrastructure/supabase_admin_user_data"
import {
  AddUser
}                       from "@/modules/user/application/user_use_cases/add_user"
import {
  RegisterAuth
}                       from "@/modules/user/application/auth_use_cases/register_auth"
import {
  GetAuth
}                       from "@/modules/user/application/auth_use_cases/get_auth"
import {
  SearchUser
}                       from "@/modules/user/application/user_use_cases/search_user"
import {
  PrismaWorkerBookingData
}                       from "@/modules/worker_booking/infrastructure/prisma_worker_booking_data"
import {
  RequestWorkerBooking
}                       from "@/modules/worker_booking/application/request_worker_booking"
import {
  CancelWorkerBooking
}                       from "@/modules/worker_booking/application/cancel_worker_booking"
import {
  UpdateWorkerBooking
}                       from "@/modules/worker_booking/application/update_worker_booking"
import {
  SearchWorkerBooking
}                       from "@/modules/worker_booking/application/search_worker_booking"
import {
  PrismaZoneData
}                       from "@/modules/zone/infrastructure/persistance/prisma_zone_data"
import {
  UpsertZones
}                       from "@/modules/zone/application/upsert_zones"
import {
  GetZonesByWorker
}                       from "@/modules/zone/application/get_zones_by_worker"
import { createClient } from "@/utils/supabase/server"
import {
  PrismaWorkerData
}                       from "@/modules/worker/infrastructure/prisma_worker_data"
import {
  AddWorker
}                       from "@/modules/worker/application/add_worker"
import {
  UpdateWorker
}                       from "@/modules/worker/application/update_worker"
import {
  SearchWorker
}                       from "@/modules/worker/application/search_worker"
import {
  OpenaiWorkerEmbeddingData
}                       from "@/modules/worker_embedding/infrastructure/openai_worker_embedding_data"
import {
  PrismaWorkerEmbeddingData
}                       from "@/modules/worker_embedding/infrastructure/prisma_worker_embedding_data"
import {
  SupabaseWorkerEmbeddingData
}                       from "@/modules/worker_embedding/infrastructure/supabase_worker_embedding_data"
import {
  UpsertWorkerEmbedding
}                       from "@/modules/worker_embedding/application/upsert_worker_embedding"
import {
  RemoveWorkerEmbedding
}                       from "@/modules/worker_embedding/application/remove_worker_embedding"
import {
  SearchWorkerEmbedding
}                       from "@/modules/worker_embedding/application/search_worker_embedding"
import {
  UploadRequestWorkerEmbedding
}                       from "@/modules/worker_embedding/application/upload_request_worker_embedding"
import {
  PrismaWorkerScheduleData
}                       from "@/modules/worker_schedule/infrastructure/prisma_worker_schedule_data"
import {
  AddWorkerSchedule
}                       from "@/modules/worker_schedule/application/add_worker_schedule"
import {
  RemoveWorkerSchedule
}                       from "@/modules/worker_schedule/application/remove_worker_schedule"
import {
  UpdateWorkerSchedule
}                       from "@/modules/worker_schedule/application/update_worker_schedule"
import {
  SearchWorkerSchedule
}                       from "@/modules/worker_schedule/application/search_worker_schedule"
import {
  UpsertSchedules
}                       from "@/modules/worker_schedule/application/upsert_schedules"
import {
  PrismaReportData
}                       from "@/modules/report/infrastructure/persistance/prisma_report_data"
import {
  AddReport
}                       from "@/modules/report/application/add_report"
import {
  SearchReport
}                       from "@/modules/report/application/search_report"
import {
  UploadFileRepository
} from "@/modules/shared/domain/upload_file_repository"
import {
  SupabaseFileUploadData
} from "@/modules/shared/infrastructure/supabase_file_upload_data"
import {
  UpdateAuth
}                       from "@/modules/user/application/auth_use_cases/update_auth"

export async function ai() {
  return new OpenAI( {
    apiKey : process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE_URL
  } )
}

const uploader: UploadFileRepository = new SupabaseFileUploadData(
  await createClient() )

export async function aiRepo() {
  return new OpenaiWorkerEmbeddingData( await ai() )
}

const reportData = new PrismaReportData( prisma )

export async function addReport() {
  return new AddReport( reportData, await searchUser() )
}

export async function searchReport() {
  return new SearchReport( reportData )
}

const scheduleData = new PrismaWorkerScheduleData( prisma )

export async function addWorkerSchedule() {
  return new AddWorkerSchedule( scheduleData )
}

export async function removeWorkerSchedule() {
  return new RemoveWorkerSchedule( scheduleData )
}

export async function updateWorkerSchedule() {
  return new UpdateWorkerSchedule( scheduleData )
}

export async function searchWorkerSchedule() {
  return new SearchWorkerSchedule( scheduleData )
}

export async function upsertSchedules() {
  return new UpsertSchedules( scheduleData, await searchWorkerSchedule() )
}

const embeddingPrismaData   = new PrismaWorkerEmbeddingData( prisma,
  await aiRepo() )
const embeddingSupabaseData = new SupabaseWorkerEmbeddingData( await aiRepo(),
  await createClient() )

export async function upsertEmbedding() {
  return new UpsertWorkerEmbedding( embeddingPrismaData,
    await searchWorker(),
    await getStory() )

}

export async function removeEmbedding() {
  return new RemoveWorkerEmbedding( embeddingPrismaData )
}

export async function searchEmbedding() {
  return new SearchWorkerEmbedding( embeddingSupabaseData,
    await searchWorker() )
}

export async function uploadRequestWorkerEmbedding() {
  return new UploadRequestWorkerEmbedding( await aiRepo() )
}

const workerData = new PrismaWorkerData( prisma )

export async function addWorker() {
  return new AddWorker( workerData, await searchNationalIdentityFormat(),
    await registerAuth() )
}

export async function updateWorker() {
  return new UpdateWorker( workerData, await searchSpeciality(),
    await upsertEmbedding() )
}

export async function searchWorker() {
  return new SearchWorker( workerData )
}

const zoneData = new PrismaZoneData( prisma )

export async function upsertZones() {
  return new UpsertZones( zoneData, await searchSector() )
}

export async function getZonesWorker() {
  return new GetZonesByWorker( zoneData )
}

const userDao = new PrismaUserData( prisma )
const authDao = new SupabaseAdminUserData( await createClient() )

export async function addUser() {
  return new AddUser( userDao, await getUser() )
}

export async function registerAuth() {
  return new RegisterAuth( authDao )
}

export async function updateAuth(){
  return new UpdateAuth(authDao)
}

export async function getUser() {
  return new GetAuth( authDao )
}

export async function searchUser() {
  return new SearchUser( userDao )
}

const bookingData = new PrismaWorkerBookingData( prisma )

export async function addBooking() {
  return new RequestWorkerBooking( bookingData )
}

export async function cancelBooking() {
  return new CancelWorkerBooking( bookingData )
}

export async function updateBooking() {
  return new UpdateWorkerBooking( bookingData )
}

export async function searchBooking() {
  return new SearchWorkerBooking( bookingData )
}

const taxData = new PrismaWorkerTaxData( prisma )

export async function getWorkerTax() {
  return new GetByWorkerTax( taxData )
}

export async function upsertWorkerTax() {
  return new UpsertWorkerTax( taxData, await getWorkerTax() )
}

const storyData = new PrismaStoryData( prisma )

export async function addStory() {
  return new AddStory( storyData )
}

export async function removeStory() {
  return new RemoveStory( storyData )
}

export async function updateStory() {
  return new UpdateStory( storyData )
}

export async function getStories() {
  return new GetStoryByWorker( storyData )
}

export async function upsertStories() {
  return new UpsertStories( storyData, await getStories() )
}

export async function getStory() {
  return new GetStoryById( storyData )
}

const specialityData = new PrismaSpecialityData( prisma )

export async function addSpeciality() {
  return new AddSpeciality( specialityData )
}

export async function removeSpeciality() {
  return new RemoveSpeciality( specialityData )
}

export async function updateSpeciality() {
  return new UpdateSpeciality( specialityData )
}

export async function searchSpeciality() {
  return new SearchSpeciality( specialityData )
}

const sectorData = new PrismaSectorData( prisma )

export async function addSector() {
  return new AddSector( sectorData, await searchRegion() )
}

export async function removeSector() {
  return new RemoveSector( sectorData )
}

export async function updateSector() {
  return new UpdateSector( sectorData )
}

export async function searchSector() {
  return new SearchSector( sectorData )
}

const reviewData = new PrismaReviewData( prisma )

export async function addReview() {
  return new AddReview( reviewData )
}

export async function reviewByUser() {
  return new GetReviewByUser( reviewData )
}

const regionData = new PrismaRegionData( prisma )

export async function addRegion() {
  return new AddRegion( regionData, await searchCountry() )
}

export async function removeRegion() {
  return new RemoveRegion( regionData )
}

export async function updateRegion() {
  return new UpdateRegion( regionData )
}

export async function searchRegion() {
  return new SearchRegion( regionData )
}

const quotationData = new PrismaQuotationData( prisma )

export async function addQuotation() {
  return new AddQuotation( quotationData )
}

export async function updateQuotation() {
  return new UpdateQuotation( quotationData )
}

export async function searchQuotation() {
  return new SearchQuotation( quotationData )
}

const phoneFormatData = new PrismaPhoneFormatData( prisma )

export async function addPhoneFormat() {
  return new AddPhoneFormat( phoneFormatData, await searchCountry() )
}

export async function removePhoneFormat() {
  return new RemovePhoneFormat( phoneFormatData )
}

export async function updatePhoneFormat() {
  return new UpdatePhoneFormat( phoneFormatData, await searchCountry() )
}

export async function searchPhoneFormat() {
  return new SearchPhoneFormat( phoneFormatData )
}

const paymentData = new PrismaPaymentData( prisma )

export async function addPayment() {
  return new AddPayment( paymentData )
}

export async function updatePayment() {
  return new UpdatePayment( paymentData )
}

export async function searchPayment() {
  return new SearchPayment( paymentData )
}

const packageData = new PrismaPackageData( prisma )

export async function addPackage() {
  return new AddPackage( packageData )
}

export async function removePackage() {
  return new RemovePackage( packageData )
}

export async function updatePackage() {
  return new UpdatePackage( packageData )
}

export async function searchPackage() {
  return new SearchPackage( packageData )
}

export async function upsertPackages() {
  return new UpsertPackages( packageData, await searchPackage() )
}

const notificationConfigData = new PrismaNotificationConfigData( prisma )

export async function addNotificationConfig() {
  return new AddNotificationConfig( notificationConfigData )
}

export async function removeNotificationConfig() {
  return new RemoveNotificationConfig( notificationConfigData )
}

export async function updateNotificationConfig() {
  return new UpdateNotificationConfig( notificationConfigData )
}

export async function searchNotificationConfig() {
  return new SearchNotificationConfig( notificationConfigData )
}

const notificationData = new PrismaNotificationData( prisma )

export async function sendNotification() {
  return new SendNotification( notificationData )
}

export async function updateNotification() {
  return new UpdateNotification( notificationData )
}

export async function searchNotifications() {
  return new SearchNotifications( notificationData )
}

const messageData = new PrismaMessageData( prisma )

export async function addMessage() {
  return new AddMessage( messageData )
}

export async function updateMessage() {
  return new UpdateMessage( messageData )
}

export async function getMessageByChat() {
  return new GetMessageByChat( messageData )
}

const currencyData = new PrismaCurrencyData( prisma )

export async function addCurrency() {
  return new AddCurrency( currencyData )
}

export async function removeCurrency() {
  return new RemoveCurrency( currencyData )
}

export async function updateCurrency() {
  return new UpdateCurrency( currencyData )
}

export async function searchCurrency() {
  return new SearchCurrency( currencyData )
}

const chatData = new PrismaChatData( prisma )

export async function addChat() {
  return new AddChat( chatData, await searchUser() )
}

export async function updateChat() {
  return new UpdateChat( chatData )
}

export async function chatByUser() {
  return new GetChatByUser( chatData )
}

const certificateData = new PrismaCertificateData( prisma )

export async function getCertificateByWorker() {
  return new GetCertificateByWorker( certificateData )
}

export async function upsertCertificates() {
  return new UpsertCertificates( certificateData,
    await getCertificateByWorker() )
}

const countryData = new PrismaCountryData( prisma )

export async function addCountry() {
  return new AddCountry( countryData )
}

export async function removeCountry() {
  return new RemoveCountry( countryData )
}

export async function updateCountry() {
  return new UpdateCountry( countryData )
}

export async function searchCountry() {
  return new SearchCountry( countryData )
}

const identityFormatData = new PrismaNationalIdentityFormatData( prisma )

export async function addNationalIdentity() {
  return new AddNationalIdentityFormat( identityFormatData,
    await searchCountry() )
}

export async function removeNationalIdentity() {
  return new RemoveNationalIdentityFormat( identityFormatData )
}

export async function updateNationalIdentity() {
  return new UpdateNationalIdentityFormat( identityFormatData,
    await searchCountry() )
}

export async function searchNationalIdentityFormat() {
  return new SearchNationalIdentityFormat( identityFormatData )
}
