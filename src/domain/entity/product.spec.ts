import Product from "./product";

describe("Product unit testes", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let order = new Product("", "Product 1", 100);
        }).toThrow("Id must be set");
    });

    it("should throw error when name is empty", () => {
        expect(() => {
            let order = new Product("1", "", 100);
        }).toThrow("Name must be set");
    });

    it("should throw error when price is less than 0", () => {
        expect(() => {
            let order = new Product("1", "Product 1", 0);
        }).toThrow("Price must be greater than 0");
    });

    it("should change name", () => {
        const product = new Product("1", "Product 1", 100);
        product.changeName("Product 2");
        expect(product.name).toBe("Product 2");
    });

    it("should change price", () => {
        const product = new Product("1", "Product 1", 100);
        product.changePrice(150);
        expect(product.price).toBe(150);
    });
});