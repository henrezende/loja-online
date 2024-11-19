import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductUseCase } from './usecases/create-product.usecase';
import { UpdateProductUseCase } from './usecases/update-product.usecase';
import { GetAllProductsUseCase } from './usecases/get-all-products.usecase';

@Controller('produtos')
export class ProductsController {
  @Inject(CreateProductUseCase)
  private readonly createProductUseCase: CreateProductUseCase;

  @Inject(UpdateProductUseCase)
  private readonly updateProductUseCase: UpdateProductUseCase;

  @Inject(GetAllProductsUseCase)
  private readonly getAllProductsUseCase: GetAllProductsUseCase;

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.createProductUseCase.execute(createProductDto);
  }

  @Get()
  findAll() {
    return this.getAllProductsUseCase.execute();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.updateProductUseCase.execute(+id, updateProductDto);
  }
}
