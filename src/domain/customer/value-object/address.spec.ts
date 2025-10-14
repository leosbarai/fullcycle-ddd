import Address from "./adress";

describe('Address unit tests', () => {

    it("should throw error when street is empty", () => {
        expect(() => {
            let address = new Address("", 123, "12345-678", "São Paulo");
        }).toThrow("Street is required")
    })

    it("should throw error when number is empty", () => {
        expect(() => {
            let address = new Address("Rua dos bobos", 0, "12345-678", "São Paulo");
        }).toThrow("Number is required")
    })

    it("should throw error when city is empty", () => {
        expect(() => {
            let address = new Address("Rua dos bobos", 123, "12345-678", "");
        }).toThrow("City is required")
    })


});