import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  constructor(private router: Router,
              private storage: StorageService) { }

  ngOnInit(): void {
  }

  routeToProduct(type: any) {
    this.storage.setCategory(type);
    this.router.navigate(['/post-login/product']);
  }
}
