import Customer from "./customer";
import Address from "./adress";

describe('Customer unit tests', () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "John");
        }).toThrow("Id must be set");
    })

    it("should throw error when id name empty", () => {
        expect(() => {
            let customer = new Customer("1", "");
        }).toThrow("Name must be at least 3 characters long");
    })

    it("should change name", () => {
        const customer = new Customer("1", "John");

        customer.changeName("Jane");

        expect(customer.name).toBe("Jane");
    })

    it("should activate customer", () => {
        const customer = new Customer("1", "John");
        customer.Address = new Address("Rua dos bobos", 123, "12345-678", "São Paulo");

        customer.activate();

        expect(customer.isActive()).toBe(true);
    })

    it("should deactivate customer", () => {
        const customer = new Customer("1", "John");

        customer.deactivate();

        expect(customer.isActive()).toBe(false);
    })

    it("should throw error when address is undefined and activate a customer", () => {
        expect(() => {
            const customer = new Customer("1", "John");
            customer.activate();
        }).toThrow("Adress must be set to activate a customer");
    })

    it("should add reward points", () => {
        const customer = new Customer("1", "John");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    })
})