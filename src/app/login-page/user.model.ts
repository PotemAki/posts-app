export class User {
  constructor (
    public displayName: string,
    public email: string,
    public expiresIn: number,
    public token: string,
    public userId: string,
    public imagePath?: string) {
    }
  
}

export class UserPhoto {
  constructor (
    public profileUrl: string) { }
  
} 

