import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category'

  constructor(private httpClient: HttpClient) { };

  getProductListPaginate(pageNumber: number, pageSize: number, categoryId: number): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}&page=${pageNumber}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(map(response => response._embedded.productCategory));

  }

  searchProductsPaginate(theKeyword: string, pageNumber: number, pageSize: number): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}&page=${pageNumber}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }

  getProduct(id: number): Observable<Product>{

    const searchUrl = `${this.baseUrl}/${id}`;

    return this.httpClient.get<Product>(searchUrl);

  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));
  }

}

interface GetResponseProducts {

  _embedded: {

    products: Product[];

  }

  page : {

    size: number,
    totalElements: number,
    totalPages: number,
    number: number

  }

}

interface GetResponseProductCategory {

  _embedded: {

    productCategory: ProductCategory[];

  }

}
