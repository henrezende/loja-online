import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from '../cart-items/entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { CartRepository } from './cart.repository';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { UpdateItemQuantityDto } from './dto/update-item-quantity.dto';
import { AddItemToCartUseCase } from './usecases/add-item-to-cart.usecase';
import { CheckoutCartUseCase } from './usecases/checkout-cart.usecase';
import { GetCartUseCase } from './usecases/get-cart.usecase';
import { RemoveItemFromCartUseCase } from './usecases/remove-item-from-cart.usecase';
import { UpdateItemQuantityUseCase } from './usecases/update-item-quantity.usecase';
import { CartItemRepository } from '../cart-items/cart-items.repository';
import { ProductRepository } from '../products/products.repository';

describe('CartController', () => {
  let controller: CartController;
  let cartRepo: CartRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Cart, CartItem, Product],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Cart, CartItem, Product]),
      ],
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
    }).compile();

    controller = module.get<CartController>(CartController);
    cartRepo = module.get<CartRepository>(CartRepository);
  });

  it('should get the cart (success)', async () => {
    const cart = await cartRepo.getOrCreateCart();
    const result = await controller.getCart();
    expect(result).toMatchObject({ id: cart.id, items: [], totalValue: 0 });
  });

  it('should add an item to the cart (success)', async () => {
    const product = await cartRepo['productRepo'].save({
      name: 'Product 1',
      stock: 10,
      price: 100,
    });

    const addItemToCartDto: AddItemToCartDto = { itemId: product.id };
    const result = await controller.addItem(addItemToCartDto);

    expect(result.items).toHaveLength(1);
    expect(result.totalValue).toBe(product.price);
  });

  it('should throw an error when adding a non-existent product to the cart', async () => {
    const addItemToCartDto: AddItemToCartDto = { itemId: 999 };
    await expect(controller.addItem(addItemToCartDto)).rejects.toThrow(
      'Produto não encontrado',
    );
  });

  it('should update item quantity in the cart (success)', async () => {
    const product = await cartRepo['productRepo'].save({
      name: 'Product 1',
      stock: 10,
      price: 100,
    });

    const cart = await cartRepo.addItem(
      product,
      await cartRepo.getOrCreateCart(),
    );
    const updateItemQuantityDto: UpdateItemQuantityDto = { quantity: 5 };
    const result = await controller.updateItemQuantity(
      cart.items[0].product.id,
      updateItemQuantityDto,
    );

    expect(result.items[0].quantity).toBe(5);
    expect(result.totalValue).toBe(product.price * 5);
  });

  it('should throw an error when updating quantity for a non-existent item', async () => {
    const updateItemQuantityDto: UpdateItemQuantityDto = { quantity: 5 };
    await expect(
      controller.updateItemQuantity(999, updateItemQuantityDto),
    ).rejects.toThrow('Produto não encontrado');

    const product = await cartRepo['productRepo'].save({
      name: 'Product 1',
      stock: 10,
      price: 100,
    });

    await expect(
      controller.updateItemQuantity(product.id, updateItemQuantityDto),
    ).rejects.toThrow('Produto não encontrado no carrinho');
  });

  it('should remove an item from the cart (success)', async () => {
    const product = await cartRepo['productRepo'].save({
      name: 'Product 1',
      stock: 10,
      price: 100,
    });

    const cart = await cartRepo.addItem(
      product,
      await cartRepo.getOrCreateCart(),
    );
    const result = await controller.removeItem(cart.items[0].product.id);

    expect(result.items).toHaveLength(0);
    expect(result.totalValue).toBe(0);
  });

  it('should throw an error when removing a non-existent item from the cart', async () => {
    await expect(controller.removeItem(999)).rejects.toThrow(
      'Produto não encontrado no carrinho',
    );
  });

  it('should checkout the cart (success)', async () => {
    const product = await cartRepo['productRepo'].save({
      name: 'Product 1',
      stock: 10,
      price: 100,
    });

    const cart = await cartRepo.addItem(
      product,
      await cartRepo.getOrCreateCart(),
    );
    const result = await controller.checkout();

    expect(result).toBe('Checkout realizado com sucesso!');
    const updatedCart = await cartRepo.getCart();
    expect(updatedCart.items).toHaveLength(0);
    expect(updatedCart.totalValue).toBe(0);

    const updatedProduct = await cartRepo['productRepo'].findOne({
      where: { id: product.id },
    });
    expect(updatedProduct.stock).toBe(9);
  });

  it('should throw an error on checkout when stock is insufficient', async () => {
    const product = await cartRepo['productRepo'].save({
      name: 'Product 1',
      stock: 0,
      price: 100,
    });

    await cartRepo.addItem(product, await cartRepo.getOrCreateCart());
    await expect(controller.checkout()).rejects.toThrow(
      'O produto Product 1 não possui estoque suficiente',
    );
  });
});
