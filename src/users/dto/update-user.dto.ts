import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto{
    @ApiProperty({})
    name: string;

    @ApiProperty({})
    document: string;

    @ApiProperty({})
    email: string;
}
