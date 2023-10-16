import {Controller, Post} from '@nestjs/common';
import {Exception} from "@src/modules/shared/domain/service/util/exception/exceptions.service";
import {ExceptionTypeEnum} from "@src/modules/shared/domain/const/exception-type.enum";

@Controller('/order')
export default class ProductToCartAdderService {

    private maxProductsInOrder = 10;

    constructor(
        private readonly productRepository: ProductRepository,
        private readonly orderRepository: OrderRepository,
        private readonly emailSenderService: EmailSenderService,
    ) {
    }

    @Post()
    async addProductToCart(productId: number, productQuantity: number, orderId: number): Promise<Order> {
        const order = await this.getOrderFromDb(orderId);

        const product = await this.getProductFromDb(productId);

        if (productQuantity > this.maxProductsInOrder) {
            throw new Exception(ExceptionTypeEnum.BadRequest, 'You can not order more than ${this.maxProductsInOrder} products');
        }

        if (product.quantityMax > productQuantity) {
            throw new Exception(ExceptionTypeEnum.BadRequest, 'Not enough products in stock');
        }

        const saveOrder = await this.saveProductInOrder(productQuantity, product, order);

        return saveOrder;
    }

    private async saveProductInOrder(productQuantity: number, product: Product, order: Order): Promise<Order> {
        product.quantityMax -= productQuantity;
        order.products.push(product);
        return await this.orderRepository.save(order);
    }

    private async getOrderFromDb(orderId: number): Order {
        const order = await this.orderRepository.find({id: orderId});

        if (!order) {
            throw new Exception(ExceptionTypeEnum.NotFound, 'Order not found');
        }

        return order;
    }

    private async getProductFromDb(productId: number): Product {
        const product = await this.productRepository.find({id: productId});

        if (!product) {
            throw new Exception(ExceptionTypeEnum.NotFound,'Product not found');
        }

        return product;
    }

}