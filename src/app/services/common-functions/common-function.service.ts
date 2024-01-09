import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
@Injectable({
  providedIn: 'root'
})
export class CommonFunctionService {
  public resetSource = new Subject<boolean>();
  public resetPage$ = this.resetSource.asObservable();

  constructor(
    private dialog: MatDialog
  ) {
  }

  resetGrid(rstgrid: boolean): void {
    this.resetSource.next(rstgrid);
  }


  getDataTableHttpParam(searchMap1: Map<string, string>): HttpParams {
    let httpParams = new HttpParams();
    searchMap1.forEach((key: string, value: string) => {
      httpParams = httpParams.set(value, key);
    });
    return httpParams;
  }


  getSimpleBaseParam(): Map<string, string> {
    let searchMap = new Map<string, string>();
    searchMap.set('dataTable', 'false');
    searchMap.set('full', 'false');
    return searchMap;
  }


  getDataTableParam2(dtp: any, sortColum: string): Map<string, string> {
    let searchMap = new Map<string, string>();
    searchMap.set('draw', dtp.draw.toString());
    searchMap.set('start', dtp.start.toString());
    searchMap.set('limit', dtp.length.toString());
    searchMap.set('dataTable', 'true');
    searchMap.set('full', 'true');
    if (dtp.order[0]) {
      searchMap.set('sortBy', dtp.columns[dtp.order[0].column].name);
      if (dtp.order[0].dir) {
        searchMap.set('order', dtp.order[0].dir);
      } else {
        searchMap.set('order', 'desc');
      }
    } else {
      searchMap.set('sortBy', sortColum);
      searchMap.set('order', 'desc');
    }
    if (`${dtp['search']['value']}`) {
      searchMap.set('all', `${dtp['search']['value']}`);
    }
    return searchMap;
  }

  getDataTableParam(paginator: MatPaginator, sort: MatSort): Map<string, any> {
    let searchMap = new Map<string, any>();
    // searchMap.set('draw', dtp.draw.toString());
    searchMap.set('start', paginator.pageIndex.toString());
    searchMap.set('limit', paginator.pageSize.toString());
    searchMap.set('dataTable', 'true');
    searchMap.set('full', 'true');
    return searchMap;
  }


  getEncodePassword(password: string): string {
    return btoa(password);
  }

}
