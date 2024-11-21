import { Surreal } from 'surrealdb';
import { surrealdbWasmEngines } from '@surrealdb/wasm';
import { jsonify } from "surrealdb";


async function getDb(){
    const db = new Surreal({
    engines: surrealdbWasmEngines(),
    });    
    try {
        await db.connect("indxdb://demo");
        await db.use({ namespace: "hello", database: "demodb" });
        return db;
    } catch (err) {
        console.error("Failed to connect to SurrealDB:", err instanceof Error ? err.message : String(err));
        await db.close();
        throw err;
    }
}



interface User {
  username: string;
  email: string;
  password: string;
}

async function createUser(): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.error("Database not initialized");
    return;
  }
  try {
    const user = await db.create<User>("User", {
      username: "newUser",
      email: "user@example.com",
      password: "securePassword",
    });
    console.log("User created:", jsonify(user));
    const theuser = jsonify(user);
  } catch (err: unknown) {
    console.error("Failed to create user:", err instanceof Error ? err.message : String(err));
  } finally {
    await db.close();
  }
}

createUser();
export async function getAllUsers(): Promise<User[] | undefined> {  
    const db = await getDb();  

    if (!db) {  
        console.error("Database not initialized");  
        return undefined;  
    }  

    try {  
        const users = await db.select<User>("User");  
        console.log("All users:", jsonify(users));  
        displayUsers(jsonify(users));  
        return users;  
    } catch (err) {  
        console.error("Failed to get users:", err);  
        return undefined;  
    } finally {  
        await db.close();  
    }  
}  


function displayUsers(users: User[]) {  
    const container = document.createElement('div');  

    users.forEach(user => {  
        const pElement = document.createElement('p');   
        pElement.textContent = `Email: ${user.email}, ID: ${user.id}, Username: ${user.username}`;  
        container.appendChild(pElement);  
    });  

    document.body.appendChild(container);    
}  

getAllUsers();
 