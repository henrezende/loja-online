import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

export interface IProductRepository {
  create(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product>;
}

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private typeOrmRepo: Repository<Product>,
  ) {}

  async create(product: Product): Promise<void> {
    await this.typeOrmRepo.save(product);
  }

  async update(product: Product): Promise<void> {
    await this.typeOrmRepo.update(product.id, product);
  }

  findAll(): Promise<Product[]> {
    return this.typeOrmRepo.find();
  }

  findById(id: number): Promise<Product> {
    return this.typeOrmRepo.findOneOrFail({ where: { id } });
  }
}
