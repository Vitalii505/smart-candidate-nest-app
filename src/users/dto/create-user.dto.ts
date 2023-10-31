import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({
        default: 'test@icloud.com',
    })
    email: string;
    @ApiProperty({
        default: 'User Test',
    })
    fullName: string;
    @ApiProperty({
        default: '123123',
    })
    password: string;
}
