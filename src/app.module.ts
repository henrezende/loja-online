import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { CartModule } from './cart/cart.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { Cart } from './cart/entities/cart.entity';
import { CartItem } from './cart-items/entities/cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [Product, Cart, CartItem],
      synchronize: true,
    }),
    ProductsModule,
    CartModule,
    CartItemsModule,
  ],
})
export class AppModule {}
