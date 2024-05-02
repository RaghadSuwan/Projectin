import { roles } from "../../middleware/auth.js";

export const endPoint = {
    create: [roles.User],
    delete: [roles.User],
    getAll: [roles.User],
    clear: [roles.User],
}