import { CartDetails } from "./cart-details";

export class Cart {
    userId:number;
    email: string;
    address: string;
    city: string;
    userName: string;
    fullName: string;

    activeUser: string;
    
    cartList:Array<CartDetails>
}
  