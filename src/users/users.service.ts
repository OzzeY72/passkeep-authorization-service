import { Injectable } from '@nestjs/common';

export type User = 
{
  userId: number,
  username: string,
  password: string
};

@Injectable()
export class UsersService {
  private users = [
    {
      userId: 1,
      username: 'john',
      password: '$2b$10$wnjg6Zs59X83uJ3yLa9nf.Q8OXblGan5ko1UA9Hq7x2htrVwijtCe',
      //changme
    },
    {
      userId: 2,
      username: 'maria',
      password: '$2b$10$lTIhKBio2TYXa2Z2oZy14OwcM8yvAex.c/xc3QiI7rC1Tvjaez2SC',
      //guess
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
  async add(username: string,hashpass: string){
    this.users.push({userId:3,username:username,password:hashpass});
  }
  async addGoogle(user){
    if(!await this.findOne(user.firstName)){
      this.users.push({userId:this.users.length+1,username:user.firstName,password:null});
    }
    console.log(this.users);
  }
}     