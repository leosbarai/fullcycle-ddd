import Address from "../value-object/adress";
import CustomerFactory from "./customer.factory";

describe("Customer factory unit test", () => {

    it("should create a customer", () => {
        let customer = CustomerFactory.create("John");

        expect(customer.id).toBeDefined();
        expect(customer.name).toEqual("John");
        expect(customer.address).toBeUndefined();
    });

    it("should create a customer with an address", () => {
        const address = new Address("Rua dos bobos", 123, "12345-678", "São Paulo");
        let customer = CustomerFactory.createWithAddress("John", address);

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("John");
        expect(customer.address).toBe(address);
    });
});