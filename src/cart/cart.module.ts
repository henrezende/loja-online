import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';
import { AddItemToCartUseCase } from './usecases/add-item-to-cart.usecase';
import { CheckoutCartUseCase } from './usecases/checkout-cart.usecase';
import { GetCartUseCase } from './usecases/get-cart.usecase';
import { RemoveItemFromCartUseCase } from './usecases/remove-item-from-cart.usecase';
import { UpdateItemQuantityUseCase } from './usecases/update-item-quantity.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from 'src/cart-items/entities/cart-item.entity';
import { Product } from 'src/products/entities/product.entity';
import { CartItemRepository } from 'src/cart-items/cart-items.repository';
import { ProductRepository } from 'src/products/products.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product])],
  controllers: [CartController],
  providers: [
    AddItemToCartUseCase,
    CheckoutCartUseCase,
    GetCartUseCase,
    RemoveItemFromCartUseCase,
    UpdateItemQuantityUseCase,
    CartItemRepository,
    {
      provide: 'ICartItemRepository',
      useExisting: CartItemRepository,
    },
    ProductRepository,
    {
      provide: 'IProductRepository',
      useExisting: ProductRepository,
    },
    CartRepository,
    {
      provide: 'ICartRepository',
      useExisting: CartRepository,
    },
  ],
})
export class CartModule {}
