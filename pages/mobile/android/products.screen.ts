import { $, expect } from '@wdio/globals';

export class ProductsScreen {
  async expectLoaded() {
    await expect(this.title).toBeDisplayed();
    await expect(this.title).toHaveText('PRODUCTS');
  }

  private get title() {
    return $('android=new UiSelector().text("PRODUCTS")');
  }
}
