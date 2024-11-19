import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../products.repository';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly repo: IProductRepository,
  ) {}

  async execute(id: number, input: UpdateProductDto) {
    const product = await this.repo.findById(id);
    input.name && product.changeName(input.name);
    input.description && product.changeDescription(input.description);
    input.price && product.changePrice(input.price);
    input.stock && product.changeStock(input.stock);

    this.repo.update(product);

    return product;
  }
}
