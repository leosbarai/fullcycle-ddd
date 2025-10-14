import Order from "./order";
import OrderItem from "./order_item";

describe('Order unit tests', () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let order = new Order("", "123", []);
        }).toThrow("Id must be set");
    })

    it("should throw error when customerId is empty", () => {
        expect(() => {
            let order = new Order("123", "", []);
        }).toThrow("Customer id must be set");
    })

    it("should throw error when item quantity is less than 1", () => {
        expect(() => {
            let order = new Order("123", "123", []);
        }).toThrow("Items must be set");
    })

    it("should calculate total", () => {
        const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
        const order = new Order("o1", "c1", [item]);
        let total = order.total();

        expect(total).toBe(200);

        const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
        const order2 = new Order("o2", "c1", [item, item2]);
        total = order2.total();

        expect(total).toBe(600);
    })

    it("should throw if the item qtd is less or equal 0", () => {
        expect(() => {
            const item = new OrderItem("i1", "Item 1", 100, "p1", 0);
            const order = new Order("o1", "c1", [item]);
        }).toThrow("Quantity must be greater than 0");
    })
})