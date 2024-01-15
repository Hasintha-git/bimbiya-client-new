import { SimpleBase } from "./SimpleBase";

export class Product {
    packageId:number;
    mealName: string;
    description: string;
    price: string;
    portion: string;
    productCategory: string;
    portionDescription: string;
    status: string;
    statusDescription: string;
    ingredientList: number[];
    ingredients: SimpleBase[];
    img: string;
    createdUser:string;
    lastUpdatedUser:string;
    createdTime:Date;
    lastUpdatedTime:Date;
  
    userRole: string;
    userRoleDescription:string;
  
    activeUser:string;
    showIngredients: boolean = false;
  }
  