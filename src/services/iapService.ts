/**
 * In-App Purchase Service
 * Handles subscription management and product purchases
 */

import {
  initConnection,
  endConnection,
  getProducts,
  requestPurchase,
  requestSubscription,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  getAvailablePurchases,
  Product,
  Purchase,
  PurchaseError,
  ProductPurchase,
  SubscriptionPurchase,
} from 'react-native-iap';

import {IAP_PRODUCTS} from '../constants';

export class IAPService {
  private static instance: IAPService;
  private purchaseUpdateSubscription: any = null;
  private purchaseErrorSubscription: any = null;

  private constructor() {}

  static getInstance(): IAPService {
    if (!IAPService.instance) {
      IAPService.instance = new IAPService();
    }
    return IAPService.instance;
  }

  /**
   * Initialize IAP connection
   */
  async initialize(): Promise<boolean> {
    try {
      await initConnection();
      console.log('IAP connection initialized');

      // Set up purchase listeners
      this.setupListeners();

      return true;
    } catch (error) {
      console.error('Failed to initialize IAP:', error);
      return false;
    }
  }

  /**
   * Setup purchase event listeners
   */
  private setupListeners(): void => {
    this.purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: ProductPurchase | SubscriptionPurchase) => {
        console.log('Purchase updated:', purchase);

        const receipt = purchase.transactionReceipt;
        if (receipt) {
          try {
            // Validate receipt and grant access
            await this.validatePurchase(purchase);
            await finishTransaction({purchase, isConsumable: false});
          } catch (error) {
            console.error('Purchase validation failed:', error);
          }
        }
      },
    );

    this.purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        console.error('Purchase error:', error);
      },
    );
  }

  /**
   * Get available products
   */
  async getProducts(): Promise<Product[]> {
    try {
      const productIds = [
        IAP_PRODUCTS.MONTHLY,
        IAP_PRODUCTS.ANNUAL,
        IAP_PRODUCTS.LIFETIME,
      ];

      const products = await getProducts({skus: productIds});
      console.log('Available products:', products);

      return products;
    } catch (error) {
      console.error('Failed to get products:', error);
      return [];
    }
  }

  /**
   * Purchase monthly subscription
   */
  async purchaseMonthly(): Promise<boolean> {
    try {
      await requestSubscription({
        sku: IAP_PRODUCTS.MONTHLY,
      });
      return true;
    } catch (error) {
      console.error('Monthly subscription purchase failed:', error);
      return false;
    }
  }

  /**
   * Purchase annual subscription
   */
  async purchaseAnnual(): Promise<boolean> {
    try {
      await requestSubscription({
        sku: IAP_PRODUCTS.ANNUAL,
      });
      return true;
    } catch (error) {
      console.error('Annual subscription purchase failed:', error);
      return false;
    }
  }

  /**
   * Purchase lifetime access
   */
  async purchaseLifetime(): Promise<boolean> {
    try {
      await requestPurchase({
        sku: IAP_PRODUCTS.LIFETIME,
      });
      return true;
    } catch (error) {
      console.error('Lifetime purchase failed:', error);
      return false;
    }
  }

  /**
   * Restore purchases
   */
  async restorePurchases(): Promise<Purchase[]> {
    try {
      const purchases = await getAvailablePurchases();
      console.log('Restored purchases:', purchases);

      for (const purchase of purchases) {
        await this.validatePurchase(purchase);
      }

      return purchases;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      return [];
    }
  }

  /**
   * Validate purchase (simple client-side validation)
   * In production, this should be done server-side
   */
  private async validatePurchase(
    purchase: ProductPurchase | SubscriptionPurchase | Purchase,
  ): Promise<boolean> {
    try {
      // In production, send receipt to your backend for validation
      // For now, we'll just check if the purchase has a valid receipt

      if (!purchase.transactionReceipt) {
        return false;
      }

      // Grant premium access based on product ID
      const productId = purchase.productId;

      if (
        productId === IAP_PRODUCTS.MONTHLY ||
        productId === IAP_PRODUCTS.ANNUAL ||
        productId === IAP_PRODUCTS.LIFETIME
      ) {
        console.log('Premium access granted for:', productId);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Purchase validation error:', error);
      return false;
    }
  }

  /**
   * Check if user has active subscription
   */
  async checkSubscriptionStatus(): Promise<{
    isPremium: boolean;
    subscriptionType: 'monthly' | 'annual' | 'lifetime' | null;
    expiryDate: number | null;
  }> {
    try {
      const purchases = await getAvailablePurchases();

      for (const purchase of purchases) {
        const productId = purchase.productId;

        if (productId === IAP_PRODUCTS.LIFETIME) {
          return {
            isPremium: true,
            subscriptionType: 'lifetime',
            expiryDate: null,
          };
        }

        if (productId === IAP_PRODUCTS.MONTHLY) {
          // Check if subscription is still active
          // In production, validate with server
          return {
            isPremium: true,
            subscriptionType: 'monthly',
            expiryDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
          };
        }

        if (productId === IAP_PRODUCTS.ANNUAL) {
          return {
            isPremium: true,
            subscriptionType: 'annual',
            expiryDate: Date.now() + 365 * 24 * 60 * 60 * 1000, // 365 days
          };
        }
      }

      return {
        isPremium: false,
        subscriptionType: null,
        expiryDate: null,
      };
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      return {
        isPremium: false,
        subscriptionType: null,
        expiryDate: null,
      };
    }
  }

  /**
   * Cleanup and disconnect
   */
  async cleanup(): Promise<void> {
    try {
      if (this.purchaseUpdateSubscription) {
        this.purchaseUpdateSubscription.remove();
      }

      if (this.purchaseErrorSubscription) {
        this.purchaseErrorSubscription.remove();
      }

      await endConnection();
      console.log('IAP connection ended');
    } catch (error) {
      console.error('Failed to cleanup IAP:', error);
    }
  }
}

// Export singleton instance
export const iapService = IAPService.getInstance();
