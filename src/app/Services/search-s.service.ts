import { Injectable } from '@angular/core';
import { Observable, throwError, Subject, BehaviorSubject, of, ObservableInput } from 'rxjs';
import { HttpClient, HttpHeaders , HttpErrorResponse} from '@angular/common/http';
import { period } from '../search/search-by-period/Period.model';
import { perdiocal } from '../search/search-by-source/perdiocal.model';
import { AllSites, Site } from '../maps/classes';
import { ListsSearch } from '../search/search.model';
import { SiteType } from '../search/search-by-kind/siteType.model';
import { environment } from 'src/environments/environment';
import { param } from 'jquery';
import { catchError } from 'rxjs/operators';



export class ShowState {
  show: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SearchSService {

  private isSearch = new BehaviorSubject<boolean>(false);
  isSearch$: Observable<boolean>;

  private baseUrl = environment.apiUrl;
  // private baseUrl = 'http://localhost:8080/api/';
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  //  private baseUrl='Dev/webapi/api/';

  private periodsList = this.baseUrl + 'Periods/GetAllPeriods';
  private searchPeriod = this.baseUrl + 'Sites/GetSitesByPeriods?periodIds=';
  private kindList = this.baseUrl + 'Values/GetAllSiteNature';
  private sourceList = this.baseUrl + 'Values/GetAllPeriodicals';
  private email = this.baseUrl + 'Values/GetSendEmail?contactAddress=';
  private searchFreeLocation = this.baseUrl + 'Sites/LocationSearch?locationSearch=';


  list_search_result: ListsSearch[] = [];
  filterPeriod: ListsSearch[] = [];
  filterPerdiocals: ListsSearch[] = [];
  filterNature: ListsSearch[] = [];
  filterLocation: ListsSearch[] = [];
  private showSubject = new Subject<ShowState>();
  showState = this.showSubject.asObservable();
  public Sites: AllSites;
  private result_search = new Subject<AllSites>();
  resultList = this.result_search.asObservable();
  httpCalls = [];
  isLoadingData: boolean;
  constructor(private http: HttpClient) {
    this.isSearch$ = this.isSearch.asObservable();
  }

  allowZoom(value?:boolean): void{
    this.isSearch.next(value || !this.isSearch.getValue());
  }

  //Get sites list from api:
  getList(sitesB: boolean) {
    this.isLoadingData = true;
    console.log(this.list_search_result);
    //Check if user want empty list - empty map or not:
    if (sitesB) {
      this.http.post(this.baseUrl + 'Sites/GetS?searches=', this.list_search_result)
      //this.http.get(this.baseUrl + 'Sites/GetAllSites', )
    .subscribe(x => {
          console.log("123");
          this.Sites = <any>x;
          console.log(this.Sites)
          this.GetSitesList();
          this.isLoadingData = false;
        });
    }
    else {
      this.Sites = null;
      this.GetSitesList();
    }
  }
  //Fill in a search list by category:
  getSearch() {
    this.GetFilterNature();
    this.GetFilterPerdiocals();
    this.GetFilterPeriod();
    this.GetFilterLocation();
    return this.list_search_result;
  }
  //fill period search list:
  GetFilterPeriod(): Observable<ListsSearch[]> {
    return of(this.filterPeriod)
  }
  //fill perdiocals search list:
  GetFilterPerdiocals(): Observable<ListsSearch[]> {
    return of(this.filterPerdiocals)
  }
  //fill nature search list:
  GetFilterNature(): Observable<ListsSearch[]> {
    console.log(this.filterNature)
    return of(this.filterNature)
  }
  //fill location search list:
  GetFilterLocation(): Observable<ListsSearch[]> {
    return of(this.filterLocation)
  }
  //fill result_search in sites:
  GetSitesList() {
    console.log("check time");
    this.result_search.next(<AllSites>this.Sites);
  }

  // show() {
  //   this.showSubject.next(<ShowState>{ show: true });
  // }
  hide() {
    this.showSubject.next(<ShowState>{ show: false });
  }

  searchByLocation(searchStr: string): Observable<any> {
    // let params = new Map<String, any>();
    // params.set('locationSearce', params);
    // return this.http.get<any[]>('Sites', 'LocationSearch', params);
    return this.http.get<any[]>(this.searchFreeLocation + searchStr);
  }

  searchByPeriod(value: any): any {
    return this.http.get<period[]>(this.searchPeriod + value);
  }
  getAllPeriods(): any {
    return this.http.get<any[]>(this.periodsList);
  }
  kindSearch(): any {
    return this.http.get<SiteType[]>(this.kindList);
  }
  // GetSiteFilerByNature(snu: number):any {
  //   return this.http.get<Site[]>(this.baseUrl + 'Sites/GetSiteFilerByNature?snu=' + snu);
  // }
  //?-- not use free search:
  searchByFree() {

  }
  //Search by perdiocals:
  sourceSearch(): any {
    return this.http.get<perdiocal>(this.sourceList);
  }
  // ?
  // searchBySource(): any {
  //   return this.http.get<string>(this.baseUrl + 'Values/Getasa?x=dsd');
  // }
  //Send email to jkcbiu@gmail.com:
  sendEmail(email: any, name: string, comment: string): any {
    return this.http.get<any>(this.email + email + '&subject=' + name + '&body=' + comment);
  }
}
