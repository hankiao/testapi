import {
    Controller,
    Get,
    Patch,
    Body,
    UseGuards,
    Req,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger'

import { UsersService } from './users.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { UpdateUserDto } from './dtos/update-user.dto'
import { Logger } from '@nestjs/common'

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    private readonly logger = new Logger(UsersController.name)

    constructor(private readonly usersService: UsersService) { }

    @Get('me/profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Kullanıcının profil bilgilerini getirir' })
    async getProfile(@Req() req) {
        this.logger.log(`GET /users/me/profile çağrıldı - userId: ${req.user?.id}`)

        const user = await this.usersService.findById(req.user.id)

        if (!user) {
            this.logger.warn(`Kullanıcı bulunamadı - userId: ${req.user?.id}`)
            return { message: 'Kullanıcı bulunamadı' }
        }

        this.logger.log(`Profil bilgileri getirildi - userId: ${req.user?.id}`)
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            avatarUrl: user.avatar || null,
            activeTheme: user.activeTheme,
            roles: user.roles?.map((role) => role.name) ?? [],
        }
    }

    // Avatar yükleme
    @Post('me/avatar')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Kullanıcı avatarını yükler' })
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: join(
                    __dirname,
                    '..',
                    '..',
                    'public',
                    'uploads',
                    'avatars'
                ),
                filename: (req, file, callback) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9)
                    callback(null, `${uniqueSuffix}${extname(file.originalname)}`)
                },
            }),
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return callback(
                        new BadRequestException('Geçersiz dosya türü!'),
                        false
                    )
                }
                callback(null, true)
            },
        })
    )
    async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Dosya yüklenemedi.')
        }

        const avatarPath = `/uploads/avatars/${file.filename}`
        await this.usersService.updateAvatar(req.user.id, avatarPath)

        return { message: 'Avatar başarıyla yüklendi.', avatar: avatarPath }
    }

    @Patch('me/profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Kullanıcının profilini günceller' })
    async updateProfile(@Req() req, @Body() data: UpdateUserDto) {
        const userId = req.user.id
        const updatedUser = await this.usersService.updateProfile(userId, data)
        return updatedUser
    }

    @Get('me/theme')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Kullanıcının aktif temasını getirir' })
    getMyTheme(@Req() req) {
        console.log(
            `[UsersController] GET /users/me/theme called by userId=${req.user?.id}`
        )
        console.log(
            `[UsersController] User activeTheme from token: ${req.user?.activeTheme}`
        )

        const user = req.user
        return { activeTheme: user?.activeTheme ?? 'system' }
    }

    @Patch('me/theme')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Kullanıcının aktif temasını günceller' })
    @ApiBody({
        schema: {
            properties: { activeTheme: { type: 'string', example: 'dark' } },
        },
    })
    async updateMyTheme(@Req() req, @Body('activeTheme') activeTheme: string) {
        console.log(
            `[UsersController] PATCH /users/me/theme called by userId=${req.user?.id} with activeTheme=${activeTheme}`
        )

        const user = req.user

        await this.usersService.updateTheme(user.id, activeTheme)

        console.log(`[UsersService] User theme updated to: ${activeTheme}`)

        return { activeTheme }
    }
}
