import Address from "../value-object/adress";
import CustomerCreatedEvent from "../event/customer/customer-created.event";
import EnviaConsoleLog1Handler from "../event/customer/handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "../event/customer/handler/envia-console-log2.handler";
import CustomerAddressChangedEvent from "../event/customer/customer-address-changed.event";
import EnviaConsoleLogAddressChangedHandler from "../event/customer/handler/envia-console-log-address-changed.handler";
import EventDispatcher from "../../@shared/event/event-dispatcher";

export default class Customer {

    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;
    private eventDispatcher: EventDispatcher;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this.eventDispatcher = new EventDispatcher();
        this.validate();
        
        const enviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
        const enviaConsoleLog2Handler = new EnviaConsoleLog2Handler();
        this.eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog1Handler);
        this.eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog2Handler);
        
        const enviaConsoleLogAddressChangedHandler = new EnviaConsoleLogAddressChangedHandler();
        this.eventDispatcher.register("CustomerAddressChangedEvent", enviaConsoleLogAddressChangedHandler);
        
        const customerCreatedEvent = new CustomerCreatedEvent({
            id: this._id,
            name: this._name
        });
        this.eventDispatcher.notify(customerCreatedEvent);
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    get address(): Address {
        return this._address;
    }

    isActive(): boolean {
        return this._active;
    }

    validate() {
        if (this._id.length === 0) {
            throw new Error("Id must be set");
        }

        if (this._name.length < 3) {
            throw new Error("Name must be at least 3 characters long");
        }
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    changeAddress(address: Address) {
        this._address = address;
        
        const customerAddressChangedEvent = new CustomerAddressChangedEvent({
            id: this._id,
            name: this._name,
            address: this._address
        });
        this.eventDispatcher.notify(customerAddressChangedEvent);
    }

    activate() {
        if (this._address === undefined) {
            throw new Error("Adress must be set to activate a customer");
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }

    set Address(address: Address) {
        this._address = address;
    }
}