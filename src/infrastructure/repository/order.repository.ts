import Order from "../../domain/entity/order";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItem from "../../domain/entity/order_item";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
                id: entity.id,
                customerId: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            },
            {
                include: [{model: OrderItemModel}],
            });
    }

    async update(entity: Order): Promise<void> {
        await OrderModel.update(
            {
                customerId: entity.customerId,
                total: entity.total()
            },
            {
                where: { id: entity.id }
            }
        );

        await OrderItemModel.destroy({ 
            where: { orderId: entity.id }
        });

        const items = entity.items.map((item) =>({
            id: item.id,
            name: item.name,
            price: item.price,
            productId: item.productId,
            quantity: item.quantity,
            orderId: entity.id,
        }));

        await OrderItemModel.bulkCreate(items);
    }

    async find(id: string): Promise<Order> {
        let orderModel;

        try {
            orderModel = await OrderModel.findOne({ 
                where: { id },
                rejectOnEmpty: true,
                include: ["items"]
            });
        } catch (error) {
            throw new Error("Order not found"); 
        }

        const orderItems = orderModel.items.map(
            (item) => new OrderItem(
                item.id,
                item.name,
                item.price,
                item.productId,
                item.quantity
            )
        )

        return new Order(orderModel.id, orderModel.customerId, orderItems);
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({ include: ["items"] });
        
        return orderModels.map(orderModel => {
            const orderItems = orderModel.items.map(
                item => new OrderItem(
                    item.id, 
                    item.name, 
                    item.price, 
                    item.productId, 
                    item.quantity
                )
            );

            return new Order(orderModel.id, orderModel.customerId, orderItems);
        });
    }
}