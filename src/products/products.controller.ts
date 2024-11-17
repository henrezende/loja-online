import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductUseCase } from './usecases/create-product.usecase';
import { UpdateProductUseCase } from './usecases/update-product.usecase';

@Controller('products')
export class ProductsController {
  @Inject(CreateProductUseCase)
  private readonly createProductUseCase: CreateProductUseCase;

  @Inject(UpdateProductUseCase)
  private readonly updateProductUseCase: UpdateProductUseCase;

  // constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.createProductUseCase.execute(createProductDto);
  }

  // @Get()
  // findAll() {
  //   return this.productsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productsService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.updateProductUseCase.execute(+id, updateProductDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productsService.remove(+id);
  // }
}
