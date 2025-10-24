/**
 * Subscription Provider
 * Manages in-app purchase state and premium features
 */

import React, {createContext, useContext, useState, useEffect} from 'react';
import {SubscriptionStatus, SubscriptionTier} from '@types/index';

interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatus;
  isPremium: boolean;
  checkSubscription: () => Promise<void>;
  purchaseSubscription: (tier: SubscriptionTier) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscriptionStatus: {
    tier: SubscriptionTier.FREE,
    isActive: false,
  },
  isPremium: false,
  checkSubscription: async () => {},
  purchaseSubscription: async () => false,
  restorePurchases: async () => false,
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    tier: SubscriptionTier.FREE,
    isActive: false,
  });

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      // Check subscription status from StoreKit
      // For now, default to free tier
    } catch (error) {
      console.error('Failed to check subscription:', error);
    }
  };

  const purchaseSubscription = async (tier: SubscriptionTier): Promise<boolean> => {
    try {
      // Implement purchase logic with StoreKit
      return true;
    } catch (error) {
      console.error('Purchase failed:', error);
      return false;
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      // Restore purchases from StoreKit
      return true;
    } catch (error) {
      console.error('Restore failed:', error);
      return false;
    }
  };

  const isPremium =
    subscriptionStatus.tier !== SubscriptionTier.FREE && subscriptionStatus.isActive;

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptionStatus,
        isPremium,
        checkSubscription,
        purchaseSubscription,
        restorePurchases,
      }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
