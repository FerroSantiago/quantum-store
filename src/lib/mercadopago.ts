import MercadoPagoConfig, { Payment, Preference } from 'mercadopago';

const config = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
});

export const paymentClient = new Payment(config);
export const preferenceClient = new Preference(config);