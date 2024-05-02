import { roles } from "../../middleware/auth.js";
export const endPoint = {
    create: [roles.User],
    getAll: [roles.User],
    cancelOrder: [roles.User],
    changeOrderStatus: [roles.Admin]
}