import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService{
  client = new Client()
  account;

  constructor(){
    this.client
        .setProject(conf.appwriteProjectId)
        .setEndpoint(conf.appwriteUrl)
    this.account = new Account(this.client)
  }

  async createAccount({email, password, name}){
    try {
      const userAccount = await this.account.create(ID.unique(), email, password, name);
      if(userAccount){
        //Call login method, actually we want to login also the user after creating account.
        return this.login({email, password})

      } else {
        return userAccount;
      }
      
    } catch (error) {
      console.log("Appwrite Service : CreateAccount :: error :", error);
      throw error
    }
  }

  async login({email, password}){
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.log("Appwrite Service : Login :: error :", error);
      throw error;
    }
  }

  async getCurrentUser(){
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite Service : getCurrentUser :: error :", error);
    }
    return null;
  }

  async logout(){
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite Service : Logout :: error :", error);
    }
  }
}






const authService = new AuthService()
export default authService