import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if (user && user.password === password) {
            const { password, ...result } = user;
            console.log('***_Test_LOG_*** [return { password, ...result } = user] :::> ', password, result);
            return result;
        }
        return null;
    }

    async register(dto: CreateUserDto) {
        try {
            const userData = await this.usersService.create(dto);
            return this.jwtService.sign({id: userData.id});

        } catch (err) {
            console.error('ERROR register(dto: CreateUserDto) :::> ', err);
            throw new ForbiddenException('Помилка при реєстрації !!!')
        }
    }

    async login(user: UserEntity) {
        return this.jwtService.sign({id: user.id});
    }
}
