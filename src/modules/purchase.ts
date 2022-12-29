enum ValidatedFields {
  name,
  phone,
  address,
  email,
  card,
  valid,
  cvv
}

if (document.location.pathname.includes('cart')) {
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

  const uiBuyNow = document.querySelector('.buy-now');
  uiBuyNow?.addEventListener('click', () => showPurchaseWindow());

  const uiPurchaseBackground = document.querySelector('.purchase-background');
  uiPurchaseBackground?.addEventListener('click', (event: Event) => hidePurchaseWindow(event));

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

  function isValidationPassed(field: ValidatedFields, uiValue: HTMLInputElement, uiError: HTMLElement, isValid: (value: string) => boolean): boolean {
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
      isValidationPassed(ValidatedFields.name, uiNameValue, uiNameError, isNameValid) &&
      isValidationPassed(ValidatedFields.phone, uiPhoneValue, uiPhoneError, isPhoneValid) &&
      isValidationPassed(ValidatedFields.address, uiAddressValue, uiAddressError, isAddressValid) &&
      isValidationPassed(ValidatedFields.email, uiEmailValue, uiEmailError, isEmailValid) &&
      isValidationPassed(ValidatedFields.card, uiCardValue, uiCardError, isCardValid) &&
      isValidationPassed(ValidatedFields.valid, uiValidValue, uiValidError, isValidValid) &&
      isValidationPassed(ValidatedFields.cvv, uiCvvValue, uiCvvError, isCvvValid);

    if (!isAllFieldsValid) {
      event.preventDefault();
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
      if (input.value.toString().length === 1) {
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

  const uiForm = document.querySelector('.purchase-form') as HTMLFormElement;
  uiForm.addEventListener('submit', validateFields);

  const uiNameValue = document.querySelector('.purchase-name-value') as HTMLInputElement;
  const uiNameError = document.querySelector('.purchase-name-error') as HTMLInputElement;

  const uiAddressValue = document.querySelector('.purchase-address-value') as HTMLInputElement;
  const uiAddressError = document.querySelector('.purchase-address-error') as HTMLInputElement;

  const uiEmailValue = document.querySelector('.purchase-email-value') as HTMLInputElement;
  const uiEmailError = document.querySelector('.purchase-email-error') as HTMLInputElement;

  const uiPhoneValue = document.querySelector('.purchase-phone-value') as HTMLInputElement;
  const uiPhoneError = document.querySelector('.purchase-phone-error') as HTMLInputElement;
  uiPhoneValue.addEventListener('keypress', onPhoneKeyPress);

  const uiCardValue = document.querySelector('.purchase-card-value') as HTMLInputElement;
  const uiCardError = document.querySelector('.purchase-card-error') as HTMLInputElement;
  uiCardValue.addEventListener('keypress', onCardKeyPress);

  const uiValidValue = document.querySelector('.purchase-valid-value') as HTMLInputElement;
  const uiValidError = document.querySelector('.purchase-valid-error') as HTMLInputElement;
  uiValidValue.addEventListener('keypress', onValidKeyPress);

  const uiCvvValue = document.querySelector('.purchase-cvv-value') as HTMLInputElement;
  const uiCvvError = document.querySelector('.purchase-cvv-error') as HTMLInputElement;
  uiCvvValue.addEventListener('keypress', onCvvKeyPress);

  uiNameValue.addEventListener('focus', () => {
    uiNameError.textContent = '';
    uiNameValue.classList.remove('valid', 'invalid');
  });

  uiPhoneValue.addEventListener('focus', () => {
    uiPhoneError.textContent = '';
    uiPhoneValue.classList.remove('valid', 'invalid');
  });

  uiAddressValue.addEventListener('focus', () => {
    uiAddressValue.textContent = '';
    uiAddressValue.classList.remove('valid', 'invalid');
  });

  uiEmailValue.addEventListener('focus', () => {
    uiEmailError.textContent = '';
    uiEmailValue.classList.remove('valid', 'invalid');
  });

  uiCardValue.addEventListener('focus', () => {
    uiCardError.textContent = '';
    uiCardValue.classList.remove('valid', 'invalid');
  });

  uiValidValue.addEventListener('focus', () => {
    uiValidError.textContent = '';
    uiValidValue.classList.remove('valid', 'invalid');
  });

  uiCvvValue.addEventListener('focus', () => {
    uiCvvError.textContent = '';
    uiCvvValue.classList.remove('valid', 'invalid');
  });
}