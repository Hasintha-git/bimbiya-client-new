import { SimpleBase } from "./SimpleBase";

export class Product {
    packageId:number;
    mealName: string;
    description: string;
    toPrice: number;
    fromPrice: number;
    productCategory: string;
    portionDescription: string;
    status: string;
    statusDescription: string;
    portion: string[] = []; 
    ingredientList: number[];
    ingredients: SimpleBase[];
    img: string;
    createdUser:string;
    lastUpdatedUser:string;
    createdTime:Date;
    lastUpdatedTime:Date;
    price:number;
    priceChange:number;
    productBasicPrice: number;
    perPersonPrice: number;
    personCount: number;
  
    userRole: string;
    userRoleDescription:string;
  
    activeUser:string;
    showIngredients: boolean = false;
  }
  