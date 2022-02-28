import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { ProductServices } from "./products.service";

import * as bcrypt from 'bcrypt';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductServices) { }

    @Post()
    async addProduct(
        @Body('title') prodTitle: string,
        @Body('description') prodDesc: string,
        @Body('price') prodPrice: number,
    ) {
        // insertProduct also returning a promise
        const hashedTitle = await bcrypt.hash(prodTitle, 12);
        const generatedId = await this.productsService.insertProduct(
            hashedTitle,
            prodDesc,
            prodPrice,
        );

        return { id: generatedId };
    }

    @Get()
    async getAllProducts() {
        return await this.productsService.getProducts();
    }

    @Get(':id')
    getProduct(@Param('id') prodId: string) {
        return this.productsService.getSingleProduct(prodId);
    }

    @Patch(':id')
    async updateProduct(
        @Param('id') prodId: string,
        @Body('title') prodTitle: string,
        @Body('description') prodDesc: string,
        @Body('price') prodPrice: number,
    ) {
        await this.productsService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
        return null;
    }

    @Delete(':id')
    async deleteProduct(@Param('id') prodId: string,) {
        await this.productsService.deleteProduct(prodId);
        return null;
    }

}