import Customer from "../../entity/customer";
import Address from "../../entity/adress";
import EventDispatcher from "../@shared/event-dispatcher";
import CustomerCreatedEvent from "./customer-created.event";
import EnviaConsoleLog1Handler from "./handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log2.handler";
import CustomerAddressChangedEvent from "./customer-address-changed.event";
import EnviaConsoleLogAddressChangedHandler from "./handler/envia-console-log-address-changed.handler";

describe("Customer events tests", () => {
    it("should notify when customer is created", () => {
        const spyConsoleLog = jest.spyOn(console, "log");
        
        const customer = new Customer("1", "Customer 1");
        
        expect(spyConsoleLog).toHaveBeenCalledWith("Esse é o primeiro console.log do evento: CustomerCreated");
        expect(spyConsoleLog).toHaveBeenCalledWith("Esse é o segundo console.log do evento: CustomerCreated");        
    });
    
    it("should notify when customer address is changed", () => {
        const spyConsoleLog = jest.spyOn(console, "log");
        
        const customer = new Customer("1", "Customer 1");
        
        const address = new Address("Street 1", 123, "12345-678", "City 1");
        customer.changeAddress(address);
        
        expect(spyConsoleLog).toHaveBeenCalledWith(
            `Endereço do cliente: 1, Customer 1 alterado para: Street 1, 123, 12345-678 - City 1`
        );        
    });
    
    it("should register and notify events manually", () => {
        const eventDispatcher = new EventDispatcher();
        
        const enviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
        const enviaConsoleLog2Handler = new EnviaConsoleLog2Handler();
        const enviaConsoleLogAddressChangedHandler = new EnviaConsoleLogAddressChangedHandler();
        
        eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog1Handler);
        eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog2Handler);
        eventDispatcher.register("CustomerAddressChangedEvent", enviaConsoleLogAddressChangedHandler);
        
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(1);
        
        const customerData = {
            id: "1",
            name: "Customer 1"
        };
        
        const address = new Address("Street 1", 123, "12345-678", "City 1");
        
        const spyConsoleLog = jest.spyOn(console, "log");
        
        const customerCreatedEvent = new CustomerCreatedEvent(customerData);
        eventDispatcher.notify(customerCreatedEvent);
        
        expect(spyConsoleLog).toHaveBeenCalledWith("Esse é o primeiro console.log do evento: CustomerCreated");
        expect(spyConsoleLog).toHaveBeenCalledWith("Esse é o segundo console.log do evento: CustomerCreated");
               
        const customerAddressChangedEvent = new CustomerAddressChangedEvent({
            id: "1",
            name: "Customer 1",
            address
        });
        eventDispatcher.notify(customerAddressChangedEvent);
        
        expect(spyConsoleLog).toHaveBeenCalledWith(
            `Endereço do cliente: 1, Customer 1 alterado para: Street 1, 123, 12345-678 - City 1`
        );        
    });
});