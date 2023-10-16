export default class EmailSenderService {

    readonly ADMIN_EMAIL: string[] = ['admin@example.com', 'test@example.com'];
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly orderRepository: OrderRepository,
    ) {
    }

    async sendSingleEmail(content:string, title:string, to:string): Promise<void> {
        const email = new Email();
        email.content = content;
        email.title = title;
        email.to = to;
        await email.send();
    }
    async sendMultipleEmails(content:string, title:string, to:string[]): Promise<void> {
        const emails = [];
        for (let i = 0; i < to.length; i++) {
            const email = new Email();
            email.content = content;
            email.title = title;
            email.to = to[i];
            emails.push(email);
        }
    }



}