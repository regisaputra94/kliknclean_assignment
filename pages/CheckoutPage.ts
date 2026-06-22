import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * The checkout journey spans three saucedemo routes (info -> overview ->
 * complete). They share state and are usually exercised together, so a
 * single page object models the whole flow rather than forcing every spec
 * to juggle three separate objects for what is, behaviourally, one step
 * in the user journey. Each section below is clearly delimited.
 */
export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // --- Step One: customer information -------------------------------
  private readonly firstNameInput = this.page.locator('[data-test="firstName"]');
  private readonly lastNameInput = this.page.locator('[data-test="lastName"]');
  private readonly postalCodeInput = this.page.locator('[data-test="postalCode"]');
  private readonly continueButton = this.page.locator('[data-test="continue"]');
  private readonly cancelButton = this.page.locator('[data-test="cancel"]');
  private readonly stepOneError = this.page.locator('[data-test="error"]');

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async getStepOneError(): Promise<string> {
    return (await this.stepOneError.textContent())?.trim() ?? '';
  }

  // --- Step Two: order overview ---------------------------------------
  private readonly finishButton = this.page.locator('[data-test="finish"]');
  readonly summarySubtotal = this.page.locator('.summary_subtotal_label');
  readonly summaryTax = this.page.locator('.summary_tax_label');
  readonly summaryTotal = this.page.locator('.summary_total_label');
  readonly overviewItems = this.page.locator('.cart_item');

  async finishOrder() {
    await this.finishButton.click();
  }

  async getTotals() {
    const parseMoney = (text: string) => Number(text.replace(/[^0-9.]/g, ''));
    return {
      subtotal: parseMoney((await this.summarySubtotal.textContent()) ?? ''),
      tax: parseMoney((await this.summaryTax.textContent()) ?? ''),
      total: parseMoney((await this.summaryTotal.textContent()) ?? ''),
    };
  }

  // --- Complete ---------------------------------------------------------
  readonly completeHeader = this.page.locator('.complete-header');
  readonly backToProductsButton = this.page.locator('[data-test="back-to-products"]');

  async getCompletionMessage(): Promise<string> {
    return (await this.completeHeader.textContent())?.trim() ?? '';
  }

  async backToProducts() {
    await this.backToProductsButton.click();
  }
}
