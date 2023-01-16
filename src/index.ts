import http from "http";
import url from "url";
import { cpus } from "os";
import UserService from "./services/UserService";
import { isPathnameWithParametr } from "./validators/validateRoute";
import { validate as uuidValidate } from 'uuid';
import { getParametrFromPath } from "./utils/utils";
import ApiError from "./exeptions/api-error";

const processorThreads = cpus();
const servers = processorThreads.map((_thread, index) => "http://localhost:300" + index);


try {
  const server = http.createServer((request, response) => {
    try {
      if (!request.url) {
        return;
      }
      const requestUrlPathname = url.parse(request.url).pathname;

      if (requestUrlPathname === "/users" && request.method === "GET") {
        const users = UserService.getUsers();
        if (!users) {
          throw new Error("Error when trying to get users")
        }

        response.setHeader('Content-Type', 'application/json');
        response.statusCode = 200;
        response.write(JSON.stringify(users));

        return response.end();
      }

      if (requestUrlPathname?.includes("/users/") && request.method === "GET") {
        const routeIsValid = isPathnameWithParametr(requestUrlPathname);
        if (!routeIsValid) {
          throw new Error(JSON.stringify({ message: "Route is invalid", status: 400 }))
        }

        const id = getParametrFromPath(requestUrlPathname);
        const isValidId = uuidValidate(id);
        if (!isValidId) {
          throw new Error(JSON.stringify({ message: "Id is invalid", status: 400 }))
        }

        return UserService.getUserById(requestUrlPathname);
      }

      if (requestUrlPathname === ("/users") && request.method === "POST") {
        request.on('data', data => {
          const bodyBuf = Buffer.from(data).toString()
          const body = JSON.parse(bodyBuf)
          const { username, age, hobbies } = body

          if (!username || !age || !hobbies) {
            throw new Error(JSON.stringify({ message: "Not all data provided", status: 400 }))
          }

          UserService.addNewUser(username, age, hobbies)
          response.setHeader('Content-Type', 'application/json');
          response.statusCode = 201;
          response.write(JSON.stringify({ message: `User ${username} succesfully added` }));

          return response.end();
        })
      }

      if (requestUrlPathname?.includes("/users/") && request.method === "PUT") {
        const routeIsValid = isPathnameWithParametr(requestUrlPathname)
        if (!routeIsValid) {
          throw new Error(JSON.stringify({ message: "Route is invalid", status: 400 }))
        }

        const id = getParametrFromPath(requestUrlPathname)
        const isIdValid = uuidValidate(id)
        if (!isIdValid) {
          throw new Error(JSON.stringify({ message: "Id is invalid", status: 400 }))
        }

        return UserService.changeUserInfo()
      }

      if (requestUrlPathname?.includes("/users/") && request.method === "DELETE") {
        const routeIsValid = isPathnameWithParametr(requestUrlPathname)
        if (!routeIsValid) {
          throw new Error(JSON.stringify({ message: "Route is invalid", status: 400 }))
        }

        return UserService.deleteUser()
      }
    } catch (e: any) {
      const errorInfo = JSON.parse(e.message);
      const { status, message } = errorInfo;

      response.statusCode = status;
      response.setHeader('Content-Type', 'application/json');
      response.write(JSON.stringify({ message }));

      return response.end();
    }
  });

  server.listen(3000);
} catch {
  console.log("Server was crushed");
};