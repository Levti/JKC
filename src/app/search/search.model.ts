import { Injectable } from "@angular/core";
import { SiteType } from "./search-by-kind/siteType.model";
import { period } from "./search-by-period/Period.model";
import { perdiocal } from "./search-by-source/perdiocal.model";

@Injectable()

export class searchDetails
{
id:number;
name:string;
}
export class Timeline{
  end:number;
  start:number;
}
export class ListsSearch {
    id: number;
    nameHe: string;
    nameEn: string;
    perdiocal:perdiocal;
    period:period;
    siternature:SiteType;
    location:string;
    timeline:Timeline;
  }