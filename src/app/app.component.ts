import { Component } from '@angular/core';
import { AppService } from './app.service';
import { MatDialog } from '@angular/material/dialog';
import {DialogComponent} from './dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Shopping-cart';
  itemCount:any|number;
  Quantity:any| number;
  Total:any|number;
  Product: any;
  ProductList: any;
  UniqueQuantity: any;
  tempProductList: any;
  constructor(private appservice:AppService, private dialog: MatDialog) { }

ngOnInit() {
    this.itemCount = 0;
    this.Product='';
    this.ProductList=[];
    this.tempProductList=[];
    if(localStorage.getItem('cartDetail') != null){
      const  data = JSON.parse(localStorage.getItem('cartDetail'));
      this.Quantity=data.Quantity;
      this.Total= data.Total;
    }else{
      this.Quantity=0;
      this.Total=0;
    }

    if(localStorage.getItem('ProductList') != null){
      this.ProductList=JSON.parse(localStorage.getItem('ProductList'));
    }else{
      this.getProductList();
    }

}

  addingQuantity(price, Quantity, id) {
    if (Quantity >= 0) {
      this.Quantity = this.Quantity + parseInt(Quantity) + 1;
      this.Total += parseInt(Quantity + 1) * parseInt(price);
      const cartDetails = {
        Quantity: this.Quantity,
        Total: this.Total
      }
      localStorage.setItem('cartDetail', JSON.stringify(cartDetails));
      const Product = this.ProductList;
      this.tempProductList = [];
      for (let i = 0; i < this.ProductList.length; i++) {
        if (Product[i].id == id) {
          const data = {
            id: Product[i].id,
            BrandName: Product[i].BrandName,
            ProductName: Product[i].ProductName,
            Quantity: Product[i].Quantity,
            Price: Product[i].Price,
            MRP: Product[i].MRP,
            ImageUrl: Product[i].ImageUrl,
            OfferText: Product[i].OfferText,
            Count: parseInt(Quantity) + 1
          }
          this.tempProductList.push(data);
        }
        else {
          const data = {
            id: Product[i].id,
            BrandName: Product[i].BrandName,
            ProductName: Product[i].ProductName,
            Quantity: Product[i].Quantity,
            Price: Product[i].Price,
            MRP: Product[i].MRP,
            ImageUrl: Product[i].ImageUrl,
            OfferText: Product[i].OfferText,
            Count: Product[i].Count
          }
          this.tempProductList.push(data);
        }
      }
      this.ProductList = [];
      this.ProductList = this.tempProductList;
      localStorage.setItem('ProductList', JSON.stringify(this.ProductList));

    }
  }

removeQuantity(price,Quantity,id){
  if(Quantity>0){
    this.Quantity=this.Quantity-parseInt(Quantity);
    this.Total -=parseInt(Quantity)*parseInt(price);
    const cartDetails={
      Quantity:this.Quantity,
      Total:this.Total
   }
   localStorage.setItem('cartDetail',JSON.stringify(cartDetails));
    const Product =this.ProductList;
    this.tempProductList=[];
    for(let i=0;i<this.ProductList.length;i++){
      if(Product[i].id == id){
        const data = {
          id: Product[i].id,
          BrandName: Product[i].BrandName,
          ProductName:Product[i].ProductName,
          Quantity:Product[i].Quantity,
          Price:Product[i].Price,
          MRP:Product[i].MRP,
          ImageUrl:Product[i].ImageUrl,
          OfferText:Product[i].OfferText,
          Count:parseInt(Quantity)-1
        }
        this.tempProductList.push(data);
      }
      else{
        const data={
        id: Product[i].id,
        BrandName: Product[i].BrandName,
        ProductName:Product[i].ProductName,
        Quantity:Product[i].Quantity,
        Price:Product[i].Price,
        MRP:Product[i].MRP,
        ImageUrl:Product[i].ImageUrl,
        OfferText:Product[i].OfferText,
        Count:Product[i].Count
      }
      this.tempProductList.push(data);
    }
  }
  this.ProductList=[];
  this.ProductList=this.tempProductList;
  localStorage.setItem('ProductList',JSON.stringify(this.ProductList));
  }
    
}

getProductList(){
this.appservice.getJSON().subscribe((data:any)=>{
  console.log(typeof(data), data, data.products);
   this.ProductList=data.products;
   console.log(this.ProductList);
   localStorage.setItem('ProductList',JSON.stringify(this.ProductList));
},
error=>{
   console.log(error);
})

}

checkOut(){
  this.dialog.open(DialogComponent,{
    width:'80vh',
    height:'40vh',
    data: {Quantity:this.Quantity,Total:this.Total}

  });
}

}

