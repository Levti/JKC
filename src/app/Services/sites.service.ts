import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArchSiteModel, geography, HazalaRecordModel, Sites } from '../maps/arch-site-model';
import { History, Site } from '../maps/classes';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SitesService {
  private baseUrl = environment.apiUrl;//'http://localhost:8080/api/';
  //for proxy.conf.json  /*"target": "http://jkc.biu.ac.il",*/ "target": "http://localhost:8080/api/",
  // private baseUrl='Dev/webapi/api/';
  //private siteId= this.baseUrl+'sites/GetSiteInfo?siteId=';

  public ArchSites: ArchSiteModel[];

  constructor(private http: HttpClient) {
  }
//TO Remember to change
  getGeojson(x, y, height, radius) {
    return this.http.get<any>(this.baseUrl + 'sites/ViewShed?x=' + x + '&y=' + y + '&height=' + height + '&radius=' + radius);
  }
  getWalkingPath(wkt) {
    return this.http.get<any>(this.baseUrl+ 'sites/WalkingPath?wkt=' + wkt);
  }
  getAllArchSites() {
    return this.http.get<ArchSiteModel[]>(this.baseUrl + 'sites/GetArchSites');
    //return this.ArchSites;
    //    return this.http.get(url).pipe(map((response: ArchSiteModel[]) => response));
  }
  getAllHazalaRecords() {
    return this.http.get<HazalaRecordModel[]>(this.baseUrl + 'sites/GetHazalaRecords');
    //return this.ArchSites;
    //    return this.http.get(url).pipe(map((response: ArchSiteModel[]) => response));
  }

  GetAllSites() {
    return this.http.get<Site[]>(`${this.baseUrl}sites/GetAllSites`);
  }
  GetSitesDefault() {
    return this.http.get<Site[]>(this.baseUrl + 'Sites/GetSites');
  }
  GetSiteId(id: number) {
    return this.http.get<any>(this.baseUrl + 'sites/GetSiteInfo?siteId=' + id);
  }
  GetJUnits(siteID: number) {
    return this.http.get<any>(this.baseUrl + 'sites/GetJUnits?locationID=' + siteID);
  }
  getvalues(textUnitsCode: number, essayCode: number, bookNum: number, codeConversion: number) {
    return this.http.get<any>(this.baseUrl + 'Sites/GetValues?textUnitsCode=' + textUnitsCode + '&essayCode=' + essayCode + '&bookNum=' + bookNum + '&codeConversion=' + codeConversion);
  }
  GetClosetsSites(wgS84_Info: geography) {
    return this.http.get<Site[]>(this.baseUrl + 'Sites/GetclosestSites?wellKnownText=' + wgS84_Info.wellKnownText + '&coordinateSystemId=' + wgS84_Info.coordinateSystemId);
  }
}
