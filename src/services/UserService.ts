import http from "http";
import { isPathnameWithParametr } from "../validators/validateRoute";
import { v4 as uuidV4 } from 'uuid';


class UserService {
  users: UserInterface[];
  constructor() {
    this.users = []
  }

  getUsers(): UserInterface[] {
    return this.users
  }

  getUserById(requestUrlPathname: string) {

  }

  addNewUser(username: string, age: number, hobbies: string[] ) {
    this.users.push({
      id: uuidV4(),
      username: username,
      age: age,
      hobbies: hobbies
    })
  }

  changeUserInfo() {

  }

  deleteUser() {

  }
}

export default new UserService

interface UserInterface {
  id: string,
  username: string,
  age: number,
  hobbies: string[]
}