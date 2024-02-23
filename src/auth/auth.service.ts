import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(data: UserDto) {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    await this.userModel.create({
      email: data.email,
      password: hashedPassword,
    });
  }

  async signIn(data: UserDto) {
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user._id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return {
      token,
    };
  }
}
