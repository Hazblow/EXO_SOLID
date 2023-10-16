import {Controller, Post} from '@nestjs/common';
import {Exception} from "@src/modules/shared/domain/service/util/exception/exceptions.service";
import {ExceptionTypeEnum} from "@src/modules/shared/domain/const/exception-type.enum";
import ProductToCartAdderService from "@src/modules/order/use-case/productToCartAdder.service";
import EmailSenderService from "@src/modules/order/use-case/emailSender.service";

@Controller('/order')
export default class OrderController {

    constructor(
        private readonly productRepository: ProductRepository,
        private readonly orderRepository: OrderRepository,

        private readonly productToCartAdderService: ProductToCartAdderService,
        private readonly emailSenderService: EmailSenderService,
    ) { }

    @Post()
    async addProductToCart(request: Request): Promise<Order> {

        const productId = request.body.productId;
        const productQuantity = request.body.productQuantity;
        const orderId = request.body.orderId;

        await this.productToCartAdderService.addProductToCart(productId, productQuantity, orderId);
        await this.emailSenderService.sendMultipleEmails('Product added', 'Product added successfully', this.emailSenderService.ADMIN_EMAIL);
    }

}