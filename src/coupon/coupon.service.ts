import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { UserService } from '../users/user.service';
import { Coupon } from './model/coupon.model';
import { COUPON_MODEL } from './providers/model.provider';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponService {
  constructor(
    @Inject(COUPON_MODEL) private readonly couponModel: Model<Coupon>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async getCoupon(userId: string) {
    try {
      const user = await this.userService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const coupon = await this.couponModel.findOne({
        userId: user._id,
        isActive: true,
      });
      return coupon || null;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(code: string, userId: string) {
    try {
      const coupon = await this.couponModel.findOne({
        code,
        userId,
        isActive: true,
      });
      if (!coupon) {
        throw new NotFoundException('Coupon not found');
      }
      return coupon;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async validateCoupon(dto: CreateCouponDto, userId: string) {
    try {
      const { code } = dto;
      const user = await this.userService.findUserById(userId);
      const coupon = await this.couponModel.findOne({
        code,
        userId: user._id,
        isActive: true,
      });
      if (!coupon) {
        throw new NotFoundException('Coupon not found');
      }
      if (coupon.expirationDate < new Date()) {
        coupon.isActive = false;
        await coupon.save();
        throw new BadRequestException('Coupon expired');
      }
      return {
        code: coupon.code,
        message: 'Coupon is valid',
        discountPercentage: coupon.discountPercentage,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createCoupon(dto: CreateCouponDto, userId: string) {
    try {
      const { code, discountPercentage } = dto;
      const user = await this.userService.findUserById(userId);
      const coupon = await this.couponModel.findOne({ code, userId: user._id });
      if (coupon) {
        throw new BadRequestException('Coupon already exists');
      }
      const newCoupon = await this.couponModel.create({
        code,
        discountPercentage,
        userId: user._id,
      });
      return newCoupon;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneAndUpdate(userId: string, dto: UpdateCouponDto) {
    try {
      const { code, discountPercentage } = dto;
      const user = await this.userService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const coupon = await this.couponModel.findOneAndUpdate(
        { code, userId: user._id, isActive: true },
        { discountPercentage },
        { new: true },
      );
      if (!coupon) {
        throw new NotFoundException('Coupon not found');
      }
      await coupon.save();
      return coupon;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneAndDelete(userId: string) {
    try {
      const coupon = await this.couponModel.findOneAndDelete({ userId });
      if (!coupon) {
        throw new NotFoundException('Coupon with userId not found');
      }
      return coupon;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
