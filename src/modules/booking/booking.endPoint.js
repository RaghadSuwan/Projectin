import { roles } from "../../middleware/auth.js";

export const endPoint = {
    create: [roles.User],
    delete: [roles.User,roles.Admin],
    getAll: [roles.User],
    update:[roles.User],
}