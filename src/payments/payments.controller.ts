import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create checkout session' })
  @ApiCreatedResponse({ description: 'The checkout session has been created' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'No products provided or empty array' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Request() req: { user: { _id: string } },
  ) {
    return this.paymentsService.createCheckoutSession(
      createPaymentDto,
      req.user._id,
    );
  }

  @Post('checkout-success')
  @ApiOperation({ summary: 'Checkout session success' })
  @ApiCreatedResponse({ description: 'The checkout session has been created' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'No products provided or empty array' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  checkoutSuccess(
    @Body() createPaymentDto: CreatePaymentDto,
    @Request() req: { user: { _id: string } },
  ) {
    return this.paymentsService.createCheckoutSession(
      createPaymentDto,
      req.user._id,
    );
  }
}
