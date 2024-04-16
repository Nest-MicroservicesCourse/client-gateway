import { IsEnum } from "class-validator";
import { OrderStatus, OrderStatusList } from "./enum/order.enum";

export class ChangeOrderStatusDto {
    @IsEnum(OrderStatusList, {
        message: `Status valid are ${ OrderStatusList }`
    })
    status: OrderStatus;
};
