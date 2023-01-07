import * as validations from './validations';

enum ValidatedFields {
  name,
  phone,
  address,
  email,
  card,
  valid,
  cvv,
}

if (document.location.pathname.includes('cart')) {
  const paymentSystems: Map<string, string> = new Map();
  paymentSystems.set('4', 'Visa');
  paymentSystems.set('5', 'MasterCard');
  paymentSystems.set('6', 'UnionPay');

  // -------------------------------------------------------------
  // Show/Hide purchase form
  // -------------------------------------------------------------

  const search = document.location.search;
  const searchParams = new URLSearchParams(search);

  if (searchParams.get('action') === 'buy') {
    showPurchaseWindow();
  }

  function showPurchaseWindow() {
    const uiPurchaseBackground = document.querySelector('.purchase-background');
    uiPurchaseBackground?.classList.remove('no-display');
    document.body.classList.add('no-scroll');

    const uiErrors = document.querySelectorAll('.error');
    uiErrors.forEach((uiError) => (uiError.textContent = ''));
  }

  function hidePurchaseWindow(event: Event) {
    const target = event.target as HTMLElement;
    if (!target?.classList.contains('purchase-background')) return;

    target?.classList.add('no-display');
    document.body.classList.remove('no-scroll');

    if (searchParams.has('action')) {
      searchParams.delete('action');
      document.location.search = searchParams.toString();
    }
  }

  const uiBuyNow = document.querySelector('.buy-now');
  uiBuyNow?.addEventListener('click', () => showPurchaseWindow());

  const uiPurchaseBackground = document.querySelector('.purchase-background');
  uiPurchaseBackground?.addEventListener('click', (event: Event) => hidePurchaseWindow(event));

  // -------------------------------------------------------------
  // Validation
  // -------------------------------------------------------------

  const uiForm = document.querySelector('.purchase-form') as HTMLFormElement;
  uiForm.addEventListener('submit', validateFields);

  const uiNameValue = document.querySelector('.purchase-name-value') as HTMLInputElement;
  const uiNameError = document.querySelector('.purchase-name-error') as HTMLElement;

  const uiAddressValue = document.querySelector('.purchase-address-value') as HTMLInputElement;
  const uiAddressError = document.querySelector('.purchase-address-error') as HTMLElement;

  const uiEmailValue = document.querySelector('.purchase-email-value') as HTMLInputElement;
  const uiEmailError = document.querySelector('.purchase-email-error') as HTMLElement;

  const uiPhoneValue = document.querySelector('.purchase-phone-value') as HTMLInputElement;
  const uiPhoneError = document.querySelector('.purchase-phone-error') as HTMLElement;
  uiPhoneValue.addEventListener('keypress', onPhoneKeyPress);

  const uiPaymentSystem = document.querySelector('.payment-system') as HTMLElement;
  const uiCardValue = document.querySelector('.purchase-card-value') as HTMLInputElement;
  const uiCardError = document.querySelector('.purchase-card-error') as HTMLElement;
  uiCardValue.addEventListener('keypress', onCardKeyPress);
  uiCardValue.addEventListener('input', onCardInput);

  const uiValidValue = document.querySelector('.purchase-valid-value') as HTMLInputElement;
  const uiValidError = document.querySelector('.purchase-valid-error') as HTMLElement;
  uiValidValue.addEventListener('keypress', onValidKeyPress);

  const uiCvvValue = document.querySelector('.purchase-cvv-value') as HTMLInputElement;
  const uiCvvError = document.querySelector('.purchase-cvv-error') as HTMLElement;
  uiCvvValue.addEventListener('keypress', onCvvKeyPress);

  function showValidationMessage(uiValue: HTMLInputElement, uiError: HTMLElement) {
    uiError.textContent = uiValue.validationMessage;
  }

  function showValidationMessageCustom(field: ValidatedFields, uiError: HTMLElement): void {
    switch (field) {
      case ValidatedFields.name:
        uiError.textContent = 'Validation: contains at least 2 words, each word is at least 3 characters long.';
        break;
      case ValidatedFields.phone:
        uiError.textContent = 'Validation: must start with "+", contains at least 9 digits.';
        break;
      case ValidatedFields.address:
        uiError.textContent = 'Validation: contains at least 3 words, each word is at least 5 characters long.';
        break;
      case ValidatedFields.email:
        uiError.textContent = 'Validation: must be an email (xxx@yyy.zz).';
        break;
      case ValidatedFields.card:
        uiError.textContent = 'Validation: contains exactly 16 digits.';
        break;
      case ValidatedFields.valid:
        uiError.textContent = 'Validation: must be a valid card period (MM/YY).';
        break;
      case ValidatedFields.cvv:
        uiError.textContent = 'Validation: contains exactly 3 digits.';
        break;
      default:
        uiError.textContent = '';
        break;
    }
  }

  function isValidationPassed(
    field: ValidatedFields,
    uiValue: HTMLInputElement,
    uiError: HTMLElement,
    isValid: (value: string) => boolean
  ): boolean {
    switch (false) {
      case uiValue.validity.valid:
        showValidationMessage(uiValue, uiError);
        uiValue.classList.remove('valid');
        uiValue.classList.add('invalid');
        return false;
      case isValid(uiValue.value):
        showValidationMessageCustom(field, uiError);
        uiValue.classList.remove('valid');
        uiValue.classList.add('invalid');
        return false;
      default:
        uiError.textContent = '';
        uiValue.classList.remove('invalid');
        uiValue.classList.add('valid');
        return true;
    }
  }

  function validateFields(event: Event): void {
    const isAllFieldsValid =
      isValidationPassed(ValidatedFields.name, uiNameValue, uiNameError, validations.isNameValid) &&
      isValidationPassed(ValidatedFields.phone, uiPhoneValue, uiPhoneError, validations.isPhoneValid) &&
      isValidationPassed(ValidatedFields.address, uiAddressValue, uiAddressError, validations.isAddressValid) &&
      isValidationPassed(ValidatedFields.email, uiEmailValue, uiEmailError, validations.isEmailValid) &&
      isValidationPassed(ValidatedFields.card, uiCardValue, uiCardError, validations.isCardValid) &&
      isValidationPassed(ValidatedFields.valid, uiValidValue, uiValidError, validations.isValidValid) &&
      isValidationPassed(ValidatedFields.cvv, uiCvvValue, uiCvvError, validations.isCvvValid);

    if (!isAllFieldsValid) {
      event.preventDefault();
    }
  }

  // -------------------------------------------------------------
  // Input control
  // -------------------------------------------------------------

  function definePaymentSystem(digit: string) {
    const system = paymentSystems.get(digit);
    return system ? system : '';
  }

  function onCardInput(event: Event) {
    const input = event.target as HTMLInputElement;
    uiPaymentSystem.textContent = definePaymentSystem(input.value.toString()[0]);
  }

  function onPhoneKeyPress(event: KeyboardEvent) {
    const allowedCharacters = '0123456789+'.split('');
    if (!allowedCharacters.includes(event.key)) {
      event.preventDefault();
    }
  }

  function onCardKeyPress(event: KeyboardEvent) {
    const allowedCharacters = '0123456789'.split('');
    const input = event.target as HTMLInputElement;

    if (input.value != undefined && input.value.toString().length >= 16) {
      event.preventDefault();
    }
    if (!allowedCharacters.includes(event.key)) {
      event.preventDefault();
    }
  }

  function onValidKeyPress(event: KeyboardEvent) {
    const allowedCharacters = '0123456789/'.split('');
    const input = event.target as HTMLInputElement;

    if (input.value != undefined) {
      if (input.value.length >= 5) {
        event.preventDefault();
      }
      if (input.value.length === 1) {
        input.value += `${event.key}/`;
        event.preventDefault();
      }
    }
    if (!allowedCharacters.includes(event.key)) {
      event.preventDefault();
    }
  }

  function onCvvKeyPress(event: KeyboardEvent) {
    const allowedCharacters = '0123456789'.split('');
    const input = event.target as HTMLInputElement;

    if (input.value != undefined && input.value.toString().length >= 3) {
      event.preventDefault();
    }
    if (!allowedCharacters.includes(event.key)) {
      event.preventDefault();
    }
  }

  function clearValidationStyles(event: Event): void {
    const uiField = event.target as HTMLElement;
    uiField.classList.remove('valid', 'invalid');

    const uiLabel = uiField.closest('.purchase-label') as HTMLElement;
    const uiError = uiLabel.querySelector('.error') as HTMLElement;
    uiError.textContent = '';
  }

  const uiPurchaseFields = document.querySelectorAll('.purchase-field');
  uiPurchaseFields.forEach((field) => field.addEventListener('focus', clearValidationStyles));
}
