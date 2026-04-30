import { LoginScreen } from '../../../../pages/mobile/android/login.screen';
import { ProductsScreen } from '../../../../pages/mobile/android/products.screen';

describe('Android login', () => {
  it('standard user can log in and see products', async () => {
    const loginScreen = new LoginScreen();
    const productsScreen = new ProductsScreen();

    await loginScreen.loginAsStandardUser();
    await productsScreen.expectLoaded();
  });
});
