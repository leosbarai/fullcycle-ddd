import Customer from './domain/entity/customer';
import Address from "./domain/entity/adress";
import OrderItem from "./domain/entity/order_item";
import Order from "./domain/entity/order";

let customer = new Customer('123', 'Leonardo');
const address = new Address('Rua um', 2, '12345-678', 'Campinas');
customer.Address = address;
customer.activate();

const item1 = new OrderItem("1", "Item1", 10);
const item2 = new OrderItem("2", "Item2", 15);
const order = new Order("1", "123", [item1, item2]);