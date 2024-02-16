import { CartDetails } from "./cart-details";

export class Cart {
    userId:number;
    email: string;
    address: string;
    city: string;
    userName: string;
    fullName: string;
    subTotal:number;
    deliveryPrice:number;
    total:number;
    activeUser: string;
    
    cartList:CartDetails[];
}
  