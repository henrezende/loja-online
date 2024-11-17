import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../entities/product.entity';
import { IProductRepository } from '../products.repository';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly repo: IProductRepository,
  ) {}

  async execute(input: CreateProductDto) {
    const product = new Product(input);
    await this.repo.create(product);
    return product;
  }
}
