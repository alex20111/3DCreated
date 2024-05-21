export interface Cart{
    finalPrice: number;
    cartProducts: cartProduct[];
}

export interface cartProduct{
    
        productId: string;
        productName: string;
        productPrice: number;
        productQuantity: number;
        totalPrice?: number;
        imageUrl?:string;
        catgName: string;
        
    }