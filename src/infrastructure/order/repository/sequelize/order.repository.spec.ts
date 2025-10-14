import {Sequelize} from "sequelize-typescript";
import Address from "../../../../domain/customer/value-object/adress";
import Customer from "../../../../domain/customer/entity/customer";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true}
        });

        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        customer.Address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 1);
        const order = new Order("123", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({where: {id: order.id}, include: ["items"]});

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customerId: "123",
            total: order.total(),
            items: [{
                id: orderItem.id,
                name: orderItem.name,
                price: orderItem.price,
                quantity: orderItem.quantity,
                orderId: "123",
                productId: product.id,
            }],
        });
    });

    it ("should update an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        customer.Address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 1);
        const order = new Order("123", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({where: {id: order.id}, include: ["items"]});

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customerId: customer.id,
            total: order.total(),
            items: [{
                id: orderItem.id,
                name: orderItem.name,
                price: orderItem.price,
                quantity: orderItem.quantity,
                orderId: "123",
                productId: product.id,
            }],
        });

        const product2 = new Product("2", "Product 2", 200);
        await productRepository.create(product2);

        const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 2);
        order.items.push(orderItem2);

        await orderRepository.update(order);

        const orderModelUpdated = await OrderModel.findOne({where: {id: order.id}, include: ["items"]});

        expect(orderModelUpdated.toJSON()).toStrictEqual({
            id: order.id,
            customerId: "123",
            total: order.total(),
            items: [{
                id: orderItem.id,
                name: orderItem.name,
                price: orderItem.price,
                quantity: orderItem.quantity,
                orderId: "123",
                productId: product.id,
            }, {
                id: orderItem2.id,
                name: orderItem2.name,
                price: orderItem2.price,
                quantity: orderItem2.quantity,
                orderId: "123",
                productId: product2.id,
            }],
        });
    });

    it ("should find an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        customer.Address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 1);
        const order = new Order("123", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderResult = await orderRepository.find("123");

        expect(order).toStrictEqual(orderResult);
    });

    it("should throw error when order not found", async () => {
        const orderRepository = new OrderRepository();

        await expect(async () => {
            await orderRepository.find("123XXX");
        }).rejects.toThrow("Order not found");
    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const productRepository = new ProductRepository();
        const orderRepository = new OrderRepository();

        const customer1 = new Customer("123", "Customer 1");
        customer1.Address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        await customerRepository.create(customer1);
        
        const product1 = new Product("1", "Product 1", 100);
        await productRepository.create(product1);

        const orderItem1 = new OrderItem("1", product1.name, product1.price, product1.id, 1);
        const order1 = new Order("123", customer1.id, [orderItem1]);
             
        const customer2 = new Customer("456", "Customer 2");
        customer2.Address = new Address("Street 2", 2, "Zipcode 2", "City 2");
        await customerRepository.create(customer2);

        const product2 = new Product("2", "Product 2", 150);
        await productRepository.create(product2);

        const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 1);
        const order2 = new Order("456", customer2.id, [orderItem2]);

        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();

        expect(orders).toHaveLength(2);
        expect(orders[0]).toStrictEqual(order1);
        expect(orders[1]).toStrictEqual(order2);
    });    
});
