import {
  CertificateDTO
} from "@/modules/certificate/application/certificate_dto"

export abstract class CertificateAppService {
  abstract add( certificate: CertificateDTO ): Promise<void>

  abstract remove( id: string ): Promise<void>

  abstract getByWorker( workerId: string ): Promise<CertificateDTO[]>

  abstract getById( id: string ): Promise<CertificateDTO>
}
