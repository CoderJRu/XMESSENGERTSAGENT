import { InsertUser, User } from "@shared/schema";

export interface IStorage {
  insertUser(user: InsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
}

class MemStorage implements IStorage {
  private users: User[] = [];
  private idCounter = 1;

  async insertUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: String(this.idCounter++),
      username: user.username,
      password: user.password,
    };
    this.users.push(newUser);
    return newUser;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.users.find(user => user.username === username) || null;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }
}

export const storage = new MemStorage();