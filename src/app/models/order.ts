import { Time } from "@angular/common";
import { CartDetails } from "./cart-details";

export class Order {
    userId:number;
    total: number;
    deliveryPrice: number;
    product:CartDetails[];
    scheduledTime: string;
    activeUser: string;
    city:string;
    email:string;
    address:string;
    

}
  