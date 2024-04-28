import { roles } from "../../middleware/auth.js";
export const endPoint = {
    create: [roles.User],
   // getAll: [roles.Admin],
    //gatActive: [roles.User],
    // update: [roles.Admin],
    // specific: [roles.Admin, roles.User]
}