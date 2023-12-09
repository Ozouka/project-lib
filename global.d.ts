declare global {
	interface Window {
		Alpine: any;
	}

	var checkout_sunology_datas: {
		shop_locale: string;
		i18n: {
			[key: string]: string;
		};
	}

	var Shopify: ShopifyType;
}

type ShopifyType = {
	country: 'FR' | 'DE' | 'BE' | 'GB'; // Get the data from the Shopify Market Settings
};

export {};
