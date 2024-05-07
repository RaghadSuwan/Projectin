import { roles } from "../../middleware/auth.js";

export const endPoint = {
    uploadUserExcel: [roles.Admin],
    getUsers: [roles.Admin],
}