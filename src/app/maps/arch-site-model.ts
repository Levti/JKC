import { Xliff } from '@angular/compiler';

export class ArchSiteModel {

  id: number;
  ResourceIDint: number;
  id_PMA: number;
  name: string;
  alt_names: string;
  location_wgs84: string;
  location_wgs84_2: string;
  location_nig: string;
  polygon_wgs84: string;
  polygon_wgs84_2: string;
  polygon_nig: string;
  type: string;
  description: string;
  reff: string;
  long: number;
  lat: number;
  GeoData: any;
  // tslint:disable-next-line: variable-name
  niG_Data: string;
  area: number;
  siteDef: boolean;
}

export class HazalaRecordModel {
  iD: number;
  idOldTable: number;
  siteId: number;
  excavationId: number;
  siteName: string;
  landmarks: string;
  region: string;
  excavatorName: string;
  excavationDate: number;
  period: string;
  periodId: number;
  findingDate: string;
  siteType: string;
  siteNature: string;
  siteSize: string;
  excavationSize;
  findingType;
  comment;
  bibliography: string;
  coins: string;
  locX1: number;
  locX2: string;
  locY1: number;
  locY2: string;
  itmLocX1: number;
  itmLocY1: number;
  itmLocX2: number;
  itmLocY2: number;
}
export class Sites {
  labelX: number;
  labelY: number;
  lstFinding: lstFinding[];
  lst_src: lst_src[];
  niG_Info: string;
  periods: string[];
  siteId: number;
  siteNames: string[];
  wgS84_Info: geography;
  fullbib: string;
  locationSite: string;
  description: string;
  siteDef: any;
  images: Images[];
}
export class Images {
  Id: number;
  ImageName: string;
  ImagePath: string;
  SiteId: number;
  fullPath: string;
}
export class lst_src {
  abstract: any[];
  articleTitle: string;
  authorName: string[];
  bibliography: string;
  excavationID: number;
  excavationName: string[];
  fdfName: string;
  lstFinding: lstFinding[];
  periodical: string[];
  publicationType: string[];
  url: any;
  year: any;
  fullbib: string;
}
export class lstFinding {
  descriptionEn: string;
  descriptionHe: string
  findingID: number;
  findingSiteNature: string[];
  findingType: string[];
  periodNameEn: string;
  periodNameHe: string;
}

export class geography {
  coordinateSystemId: number;
  wellKnownText: string;
}
