import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';

export class Commondatasource implements DataSource<any> {

  public usersSubject = new BehaviorSubject<any[]>([]);
  public countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();
  public datalist: any = [];
  public loadingSubject = new BehaviorSubject<boolean>(false);


  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.usersSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.usersSubject.complete();
    this.countSubject.complete();
  }

  loadData(dataList: any) {
    this.datalist = dataList;
    this.usersSubject.next(this.datalist);
  }
}

