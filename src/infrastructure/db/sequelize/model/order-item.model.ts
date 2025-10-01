import {Table, Model, PrimaryKey, Column, ForeignKey, BelongsTo} from "sequelize-typescript";
import CustomerModel from "./customer.model";


@Table({
    tableName: "orders",
    timestamps: false,
})
export default class OrderModel extends Model {
    @PrimaryKey
    @Column
    declare id: string;

    @ForeignKey(() => CustomerModel)
    @Column({allowNull: false})
    declare customerId: string;

    @BelongsTo(() => CustomerModel)
    declare customer: CustomerModel;

    @Column({allowNull: false})
    declare total: number;
}