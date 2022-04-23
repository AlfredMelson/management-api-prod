"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const zod_1 = require("zod");
const trpc = __importStar(require("@trpc/server"));
const users_json_1 = __importDefault(require("../model/users.json"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const userDB = {
    allUsers: users_json_1.default,
    setAllUsers: function (data) {
        this.allUsers = data;
    }
};
exports.userRouter = trpc
    .router()
    .query('getAll', {
    resolve() {
        return userDB.allUsers;
    }
})
    .mutation('add', {
    input: zod_1.z.object({
        userId: zod_1.z.string(),
        firstname: zod_1.z.string(),
        lastname: zod_1.z.string(),
        email: zod_1.z.string(),
        street: zod_1.z.string(),
        city: zod_1.z.string(),
        country: zod_1.z.string()
    }),
    async resolve({ input }) {
        userDB.setAllUsers([...userDB.allUsers, input]);
        promises_1.default.writeFile(path_1.default.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.allUsers));
        return { user: input };
    }
})
    .mutation('edit', {
    input: zod_1.z.object({
        userId: zod_1.z.string(),
        firstname: zod_1.z.string(),
        lastname: zod_1.z.string(),
        email: zod_1.z.string(),
        street: zod_1.z.string(),
        city: zod_1.z.string(),
        country: zod_1.z.string()
    }),
    async resolve({ input }) {
        const { userId } = input;
        const foundUser = userDB.allUsers.find((user) => user.userId === userId);
        if (!foundUser)
            return { status: 401 };
        try {
            const otherusers = userDB.allUsers.filter((user) => user.userId !== userId);
            userDB.setAllUsers([...otherusers, input]);
            promises_1.default.writeFile(path_1.default.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.allUsers));
            return input;
        }
        catch (err) {
            console.log(err);
        }
    }
})
    .mutation('delete', {
    input: zod_1.z.object({
        userId: zod_1.z.string()
    }),
    async resolve({ input }) {
        const { userId } = input;
        const founduser = userDB.allUsers.find((user) => user.userId === userId);
        if (!founduser)
            return { status: 401 };
        try {
            const otherusers = userDB.allUsers.filter((user) => user.userId !== userId);
            userDB.setAllUsers([...otherusers]);
            await promises_1.default.writeFile(path_1.default.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.allUsers));
            return input;
        }
        catch (err) {
            console.log(err);
        }
    }
});
