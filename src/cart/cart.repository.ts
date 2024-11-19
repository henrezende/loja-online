import { Repository } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from '../cart-items/entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';

export interface ICartRepository {
  addItem(product: Product, cart: Cart): Promise<Cart>;
  removeItem(cartItem: CartItem, cart: Cart): Promise<Cart>;
  checkout(cart: Cart): Promise<string>;
  updateItemQuantity(
    cart: Cart,
    itemId: number,
    quantity: number,
  ): Promise<Cart>;
  getCart(): Promise<Cart>;
  getOrCreateCart(): Promise<Cart>;
}

@Injectable()
export class CartRepository implements ICartRepository {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private cartItemRepo: Repository<CartItem>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async addItem(product: Product, cart: Cart): Promise<Cart> {
    let cartItem = await this.cartItemRepo.findOne({
      where: { product: { id: product.id }, cart: { id: cart.id } },
      relations: ['product', 'cart'],
    });

    if (cartItem) {
      cartItem.quantity++;
    } else {
      cartItem = this.cartItemRepo.create({
        product,
        quantity: 1,
        cart: { id: cart.id },
      });
    }
    await this.cartItemRepo.save(cartItem);

    cart.items = await this.cartItemRepo.find({
      where: { cart: { id: cart.id } },
      relations: ['product'],
    });
    cart.calculateTotalValue();

    return await this.cartRepo.save(cart);
  }

  async removeItem(cartItem: CartItem, cart: Cart): Promise<Cart> {
    await this.cartItemRepo.remove(cartItem);

    cart.items = await this.cartItemRepo.find({
      where: { cart: { id: cart.id } },
      relations: ['product'],
    });
    cart.calculateTotalValue();

    return await this.cartRepo.save(cart);
  }

  async updateItemQuantity(
    cart: Cart,
    itemId: number,
    quantity: number,
  ): Promise<Cart> {
    const cartItem = await this.cartItemRepo.findOne({
      where: { product: { id: itemId }, cart: { id: cart.id } },
      relations: ['product', 'cart'],
    });

    if (!cartItem) {
      throw new NotFoundException('Produto não encontrado no carrinho');
    }

    cartItem.quantity = quantity;
    await this.cartItemRepo.save(cartItem);

    cart.items = await this.cartItemRepo.find({
      where: { cart: { id: cart.id } },
      relations: ['product'],
    });
    cart.calculateTotalValue();

    await this.cartRepo.save(cart);

    return cart;
  }

  async getCart(): Promise<Cart> {
    return this.getOrCreateCart();
  }

  async checkout(cart: Cart): Promise<string> {
    const queryRunner = this.cartRepo.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      for (const item of cart.items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.product.id },
        });

        if (!product || product.stock < item.quantity) {
          throw new UnprocessableEntityException(
            `O produto ${product?.name ?? ''} não possui estoque suficiente`,
          );
        }

        product.stock -= item.quantity;
        await queryRunner.manager.save(Product, product);
      }

      cart.items = [];
      cart.totalValue = 0;
      await queryRunner.manager.save(Cart, cart);
      await queryRunner.manager.delete(CartItem, { cart: { id: cart.id } });

      await queryRunner.commitTransaction();

      return 'Checkout realizado com sucesso!';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getOrCreateCart(): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: {},
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepo.create({ totalValue: 0, items: [] });
      cart = await this.cartRepo.save(cart);
    }

    return cart;
  }
}
