import { Inject, Injectable } from '@nestjs/common';
import { ICartRepository } from '../cart.repository';

@Injectable()
export class CheckoutCartUseCase {
  constructor(
    @Inject('ICartRepository')
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(): Promise<string> {
    const cart = await this.cartRepository.getOrCreateCart();

    return await this.cartRepository.checkout(cart);
  }
}
