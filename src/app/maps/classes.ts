export class Information {
    Id: number;
    Name: number;
    Location: string; // Location_wgs84_2
    Description: string;
    Reff: string;
}
export class AllSites {
    sitesArchiology: Site[];
    sitesHistory: Locations[];
}
export class Locations {
    resourceID: number;
    markerLoc: string;
    location: string;
    locationSite: string;
    siteDef: string;
    description: string;
    languageCode: number;
}
export class Site {
    resourceID: number;
    siteDef: string;
    name: string;
    languageID: number;
    description: string;
    markerLoc: string;
    location: string; //Location_wgs84_2
    poliView: boolean;
    locationSite: string;
    perdiocalId: number;
    periodId: number;
    siterNatureId: number;
    yend: number;
    ystart: number;
    color: string;
    pointX: number;
    pointY: number;
    siteFeatureId: number;
}

export class Kad {
    Id: number; //?
    Point: string; //string/number
    Description: string; //?
    Name: string;
}
export class Book {
    Id: number; //?
    Point: string; //string/number
    Description: string; //?
    Name: string;
}
export class Polygon {
    Id: number; //?
    Point1: number;
    Point2: number;
    Point3: number;
    Point4: number;
    Description: string; //?
    Name: string;
}
export class Contact_us {
    Id: number;
    Name: string;
    Email: string;
    Content: string;
}

export class History {
    bibliographicRecord: string;
    Units: Jos[];
    JosBook: Jos[];
}
export class Josif {
    arrayBook: ArrayBook[] = [];
    jos: Jos[] = [];
}
export class Jos {
    bib: string;
    bookName: string;
    unitText: string;
    newSection: number;
    selected: boolean;
    bookNum: number;
    textUnitsCode: number;
    setCode: number;
    essayCode: number;
    desription: string;
    codeUnitsText: number;
    codeConversion: number;
    languageCode: number;
}
export class ArrayBook {
    essayCode: number;
    bookName: string;
}
export class csv {
    wtks: string[];
    code: number;
    message: string;
}