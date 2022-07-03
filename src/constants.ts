/**
 * RegExes build by chilean civil registration specifications.<br>
 * [«Instructivo para Validación de Patentes - Servicio de Registro Civil e Identificación»](https://www.registrocivil.cl/PortalOI/Manuales/ValidacionPatentes.pdf)
 */
export const REGEX_LIST = [
  { name: 'OLD_PLATE', regex: /^(?=.{6}$)[A-Z]{2}\d{4}[^s]*$/ },
  { name: 'NEW_VEHICLE_PLATE', regex: /^(?=.{6}$)[B-DF-HJ-LPR-TV-Z]{4}[1-9]\d[^s]*$/ },
  { name: 'NEW_MOTORCYCLE_PLATE', regex: /^(?=.{6}$)[B-DF-HJ-LPR-TV-Z]{3}\d{3}[^s]*$/ },
  { name: 'POLICE', regex: /^(?=.{5}$)[BCJMZ]\d{4}[^s]*$/ },
  { name: 'AMBULANCE', regex: /^(?=.{5}$)A\d{4}[^s]*$/ },
]

/**
 * Source [Wikipedia: Matrículas automovilísticas de Chile](https://es.wikipedia.org/wiki/Matrículas_automovilísticas_de_Chile)
 */
export const SPECIAL_PLATES = [
  { combination: 'AG', name: 'GRÚA' },
  { combination: 'AP', name: 'CAMIONETA_APOYO_POLICIAL' },
  { combination: 'AT', name: 'ASISTENCIA_TÉCNICA_PERSONAL' },
  { combination: 'CB', name: 'CARRO_BLINDADO' },
  { combination: 'CC', name: 'CUERPO_CONSULAR' },
  { combination: 'CD', name: 'CUERPO_DIPLOMÁTICO' },
  { combination: 'CH', name: 'CÓNSUL_HONORARIO' },
  { combination: 'CR', name: 'CARRO_RODANTE' },
  { combination: 'LA', name: 'CARRO_LANZA_AGUA' },
  { combination: 'LC', name: 'LANCHA' },
  { combination: 'OI', name: 'ORGANISMO_INTERNACIONAL' },
  { combination: 'PR', name: 'PATENTE_PROVISORIA' },
  { combination: 'RP', name: 'RADIOPATRULLA' },
  { combination: 'TC', name: 'TRANSPORTE_ESCUELA_CABALLERÍA' }
]
