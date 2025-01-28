import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateCheckoutSessionDto } from './dto/create-checout-session.dto';
import { CouponService } from '../coupon/coupon.service';
import { UserService } from '../users/user.service';
import { stripe } from '../config/stripe.config';
import { Payment } from './model/payment.model';
import { PAYMENT_MODEL } from './provider/model.provider';
import { Model } from 'mongoose';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(PAYMENT_MODEL) private readonly paymentModel: Model<Payment>,
    @Inject(forwardRef(() => CouponService))
    private couponService: CouponService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}
  async createCheckoutSession(
    createPaymentDto: CreatePaymentDto,
    userId: string,
  ) {
    try {
      const { products, couponCode } = createPaymentDto;
      if (!Array.isArray(products) || products.length === 0) {
        throw new BadRequestException('No products provided or empty array');
      }
      let totalAmount = 0;
      const lineItems = products.map((product) => {
        const amout = Math.round(product.price * 100);
        totalAmount += amout * product.quantity;
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              images: [product.file],
            },
            unit_amount: amout,
          },
          quantity: product.quantity || 1,
        };
      });
      let coupon;
      if (couponCode) {
        const user = await this.userService.findUserById(userId);
        coupon = await this.couponService.findOne(couponCode, user.id);
        if (coupon) {
          totalAmount = Math.round(
            totalAmount * (1 - coupon.discountPercentage / 100),
          );
        }
      }
      const user = await this.userService.findUserById(userId);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
        discounts: coupon
          ? [
              {
                coupon: await this.createStripeCoupon(
                  coupon.discountPercentage,
                ),
              },
            ]
          : [],
        metadata: {
          userId: user.id,
          couponCode: couponCode || '',
          products: JSON.stringify(
            products.map((p) => ({
              id: p.productId,
              quantity: p.quantity,
              price: p.price,
            })),
          ),
        },
      });
      if (totalAmount >= 20000) {
        await this.createNewCoupon(user.id);
      }
      return {
        id: session.id,
        totalAmount: totalAmount / 100,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async checkoutSuccess(dto: CreateCheckoutSessionDto, userId: string) {
    try {
      const { sessionId } = dto;
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === 'paid') {
        if (session?.metadata?.couponCode) {
          await this.couponService.findOneAndUpdate(userId, {
            code: session?.metadata?.couponCode,
            discountPercentage: 0,
            isActive: false,
          });
        }
        // create a new Order
        const products = JSON.parse(session?.metadata?.products as string);
        const newOrder = await this.paymentModel.create({
          user: session?.metadata?.userId,
          products: products.map((product) => ({
            product: product.id,
            quantity: product.quantity,
            price: product.price,
          })),
          totalAmount: (session?.amount_total as number) / 100, // convert from cents to dollars,
          stripeSessionId: sessionId,
        });

        await newOrder.save();

        return {
          success: true,
          message:
            'Payment successful, order created, and coupon deactivated if used.',
          orderId: newOrder._id,
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createNewOrder(userId: string) {
    try {
      const user = await this.userService.findUserById(userId);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
        discounts: [],
        metadata: {
          userId: user.id,
        },
      });
      return {
        id: session.id,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
      percent_off: discountPercentage,
      duration: 'once',
    });

    return coupon.id;
  }

  async createNewCoupon(userId: string) {
    await this.couponService.findOneAndDelete(userId);

    const newCoupon = await this.couponService.createCoupon(
      {
        code: Math.random().toString(36).substring(2, 9),
        discountPercentage: 50,
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      userId,
    );

    await newCoupon.save();

    return newCoupon;
  }
}
