import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductRepository } from './products.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CreateProductUseCase } from './usecases/create-product.usecase';
import { UpdateProductUseCase } from './usecases/update-product.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    UpdateProductUseCase,
    ProductRepository,
    {
      provide: 'IProductRepository',
      useExisting: ProductRepository,
    },
  ],
})
export class ProductsModule {}
