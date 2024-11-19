import { Injectable } from '@nestjs/common';
import { CartRepository } from '../cart.repository';

@Injectable()
export class GetCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute(): Promise<any> {
    return await this.cartRepository.getCart();
  }
}
