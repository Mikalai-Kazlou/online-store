enum ValidatedFields {
  name,
  phone,
  address,
  email,
  card,
  valid,
  cvv
}

// -------------------------------------------------------------
// Show/Hide purchase form
// -------------------------------------------------------------

function showPurchaseWindow() {
  const uiPurchaseBackground = document.querySelector('.purchase-background');
  uiPurchaseBackground?.classList.remove('no-display');
  document.body.classList.add('no-scroll');

  const uiErrors = document.querySelectorAll('.error');
  uiErrors.forEach((uiError) => uiError.textContent = '');
}

function hidePurchaseWindow(event: Event) {
  const target = event.target as HTMLElement;
  if (!target?.classList.contains("purchase-background")) return;

  target?.classList.add('no-display');
  document.body.classList.remove('no-scroll');
}

if (document.location.pathname.includes('cart')) {
  const uiBuyNow = document.querySelector('.buy-now');
  uiBuyNow?.addEventListener('click', () => showPurchaseWindow());

  const uiPurchaseBackground = document.querySelector('.purchase-background');
  uiPurchaseBackground?.addEventListener('click', (event: Event) => hidePurchaseWindow(event));
}

// -------------------------------------------------------------
// Validation
// -------------------------------------------------------------

function isNameValid(value: string): boolean {
  const words = value.split(' ');
  return words.length >= 2 && words.every((word) => word.length >= 3);
}

function isPhoneValid(value: string): boolean {
  return /^\+[0-9]{9,}$/.test(value);
}

function isAddressValid(value: string): boolean {
  const words = value.split(' ');
  return words.length >= 3 && words.every((word) => word.length >= 5);
}

function isEmailValid(value: string): boolean {
  return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value);
}

function isCardValid(value: string): boolean {
  return /^[0-9]{16}$/.test(value);
}

function isValidValid(value: string): boolean {
  return /^(0[1-9])|(1[0-2])\/[0-9]{2}$/.test(value);
}

function isCvvValid(value: string): boolean {
  return /^[0-9]{3}$/.test(value);
}

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
      break;
  }
}

function validateField(event: Event, field: ValidatedFields, uiValue: HTMLInputElement, uiError: HTMLElement, isValid: (value: string) => boolean): void {
  if (!uiValue.validity.valid) {
    showValidationMessage(uiValue, uiError);
    event.preventDefault();
  } else if (!isValid(uiValue.value)) {
    showValidationMessageCustom(field, uiError);
    event.preventDefault();
  } else {
    uiError.textContent = '';
  }
}

// -------------------------------------------------------------
// Input control
// -------------------------------------------------------------

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
    if (input.value.toString().length >= 5) {
      event.preventDefault();
    }
    if (input.value.toString().length === 2 && event.key !== '/') {
      input.value += '/';
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

if (document.location.pathname.includes('cart')) {
  const uiForm = document.querySelector('.purchase-form') as HTMLFormElement;

  const uiNameValue = document.querySelector('.purchase-name-value') as HTMLInputElement;
  const uiNameError = document.querySelector('.purchase-name-error') as HTMLInputElement;

  const uiPhoneValue = document.querySelector('.purchase-phone-value') as HTMLInputElement;
  const uiPhoneError = document.querySelector('.purchase-phone-error') as HTMLInputElement;

  const uiAddressValue = document.querySelector('.purchase-address-value') as HTMLInputElement;
  const uiAddressError = document.querySelector('.purchase-address-error') as HTMLInputElement;

  const uiEmailValue = document.querySelector('.purchase-email-value') as HTMLInputElement;
  const uiEmailError = document.querySelector('.purchase-email-error') as HTMLInputElement;

  const uiCardValue = document.querySelector('.purchase-card-value') as HTMLInputElement;
  const uiCardError = document.querySelector('.purchase-card-error') as HTMLInputElement;

  const uiValidValue = document.querySelector('.purchase-valid-value') as HTMLInputElement;
  const uiValidError = document.querySelector('.purchase-valid-error') as HTMLInputElement;

  const uiCvvValue = document.querySelector('.purchase-cvv-value') as HTMLInputElement;
  const uiCvvError = document.querySelector('.purchase-cvv-error') as HTMLInputElement;

  function validateFields(event: Event): void {
    validateField(event, ValidatedFields.name, uiNameValue, uiNameError, isNameValid);
    validateField(event, ValidatedFields.phone, uiPhoneValue, uiPhoneError, isPhoneValid);
    validateField(event, ValidatedFields.address, uiAddressValue, uiAddressError, isAddressValid);
    validateField(event, ValidatedFields.email, uiEmailValue, uiEmailError, isEmailValid);

    validateField(event, ValidatedFields.card, uiCardValue, uiCardError, isCardValid);
    validateField(event, ValidatedFields.valid, uiValidValue, uiValidError, isValidValid);
    validateField(event, ValidatedFields.cvv, uiCvvValue, uiCvvError, isCvvValid);
  }

  uiForm.addEventListener('submit', validateFields);

  uiPhoneValue.addEventListener('keypress', onPhoneKeyPress);
  uiCardValue.addEventListener('keypress', onCardKeyPress);
  uiValidValue.addEventListener('keypress', onValidKeyPress);
  uiCvvValue.addEventListener('keypress', onCvvKeyPress);
}