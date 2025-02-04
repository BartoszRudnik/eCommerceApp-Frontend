import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products !: Product[];
  currentCategoryId : number = 1;
  currentCategoryName : string = "Books";
  searchMode !: boolean;
  pageNumber : number = 1;
  pageSize : number = 20;
  totalElements : number = 0;
  previousCategoryId : number = 1;
  previousKeyword : string = '';

  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService : CartService) {
      
   }

  ngOnInit(): void {    
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  updatePageSize(newPageSize: number){

    this.pageSize = newPageSize;
    this.pageNumber = 1;
    this.listProducts();

  }

  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
    
  }

  handleListProducts(){

    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;      
    }
    else{
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    if(this.previousCategoryId != this.currentCategoryId){
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(this.pageNumber -1, this.pageSize, this.currentCategoryId)
      .subscribe(data => {
        this.products = data._embedded.products;
        this.pageNumber = data.page.number + 1;
        this.pageSize = data.page.size;
        this.totalElements = data.page.totalElements
       });    

  }

  handleSearchProducts(){

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if(theKeyword != this.previousKeyword){
      this.pageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    this.productService.searchProductsPaginate(theKeyword, this.pageNumber - 1, this.pageSize).subscribe(
      data => {
        this.products = data._embedded.products;
        this.pageNumber = data.page.number + 1;
        this.pageSize = data.page.size;
        this.totalElements = data.page.totalElements;
      }
    )

  }

  addToCart(product: Product){

    const cartItem = new CartItem(product);

    this.cartService.addToCart(cartItem);

  }

}
