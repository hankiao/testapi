import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersService } from './users.service'
import { User } from './entities/user.entity'
import { Role } from './entities/role.entity'
import { UsersController } from './users.controller'

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule { }
