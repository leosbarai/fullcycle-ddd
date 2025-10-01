import RepositoryInterface from "../../domain/repository/repository-interface";
import Customer from "../../domain/entity/customer";

export default interface CustomerRepositoryInterface extends RepositoryInterface<Customer> {
}