/**
 * Client-side enquiry form validation (jquery.validate).
 * Server-side ContactService remains authoritative.
 */
(function ($) {
  'use strict';

  if (!$ || !$.validator) {
    return;
  }

  $.validator.addMethod(
    'person_name',
    function (value, element) {
      return this.optional(element) || /^[A-Za-z][A-Za-z\s.'-]{1,148}$/.test($.trim(value));
    },
    'Please enter a valid name.'
  );

  $.validator.addMethod(
    'place_name',
    function (value, element) {
      return this.optional(element) || /^[A-Za-z][A-Za-z\s.'-]{1,98}$/.test($.trim(value));
    },
    'Please enter a valid value.'
  );

  $.validator.addMethod(
    'indian_mobile',
    function (value, element) {
      return this.optional(element) || /^[6-9]\d{9}$/.test($.trim(value));
    },
    'Please enter a valid 10-digit mobile no.'
  );

  function fieldName($el) {
    return $el.attr('name') || '';
  }

  function ensureErrorSlot($field) {
    var name = fieldName($field);
    var $slot = $field.closest('.inpFld, .captchaFld, .col-md-12, .col-md-6').find('[data-error-for="' + name + '"]').first();
    if ($slot.length) {
      return $slot;
    }
    $slot = $('<p class="error field-error mrg-t-10" data-error-for="' + name + '" hidden></p>');
    if ($field.closest('.captchaFld').length) {
      $field.closest('.captchaFld').append($slot);
    } else if ($field.closest('.inpFld').length) {
      $field.closest('.inpFld').append($slot);
    } else {
      $field.after($slot);
    }
    return $slot;
  }

  function bindForm($form) {
    if ($form.data('enquiry-validate-bound')) {
      return;
    }
    $form.data('enquiry-validate-bound', true);

    $form.validate({
      ignore: '.honeypot :input, [type="hidden"]',
      errorClass: 'is-invalid',
      validClass: 'is-valid',
      focusInvalid: true,
      errorElement: 'p',
      errorPlacement: function (error, element) {
        var $slot = ensureErrorSlot(element);
        $slot.removeAttr('hidden').text(error.text()).addClass('error field-error');
      },
      success: function (label, element) {
        var $slot = ensureErrorSlot($(element));
        $slot.text('').attr('hidden', 'hidden');
        $(element).attr('aria-invalid', 'false');
      },
      highlight: function (element) {
        $(element).addClass('is-invalid').attr('aria-invalid', 'true');
      },
      unhighlight: function (element) {
        $(element).removeClass('is-invalid').attr('aria-invalid', 'false');
      },
      rules: {},
      messages: {}
    });

    var validator = $form.data('validator');
    if (!validator) {
      return;
    }

    $form.find('input, textarea').each(function () {
      var $el = $(this);
      var name = fieldName($el);
      if (!name || $el.closest('.honeypot').length) {
        return;
      }
      var rules = {};
      var messages = {};

      if ($el.is('[required]') || name === 'captcha') {
        rules.required = true;
      }

      if (name === 'Last Name' || name === 'First Name' || name === 'name') {
        rules.person_name = true;
        rules.maxlength = 150;
        messages.required = 'Please provide a name.';
        messages.person_name = 'Please enter a valid name.';
      } else if (name === 'Email' || name === 'email') {
        rules.email = true;
        rules.maxlength = 191;
        messages.required = 'Please enter email address.';
        messages.email = 'Please enter a valid email address.';
      } else if (name === 'Phone' || name === 'phone_national') {
        rules.indian_mobile = true;
        rules.minlength = 10;
        rules.maxlength = 10;
        messages.required = 'Please provide a mobile no.';
        messages.indian_mobile = 'Please enter a valid 10-digit mobile no.';
        messages.minlength = 'Please enter a valid 10-digit mobile no.';
        messages.maxlength = 'Please enter a valid 10-digit mobile no.';
      } else if (name === 'City' || name === 'city') {
        rules.place_name = true;
        rules.maxlength = 100;
        messages.required = 'Please provide your city name.';
        messages.place_name = 'Please enter a valid city name.';
      } else if (name === 'State' || name === 'state') {
        rules.place_name = true;
        rules.maxlength = 100;
        messages.required = 'Please provide your state name.';
        messages.place_name = 'Please enter a valid state name.';
      } else if (name === 'Country' || name === 'country') {
        rules.place_name = true;
        rules.maxlength = 100;
        messages.required = 'Please provide your country name.';
        messages.place_name = 'Please enter a valid country name.';
      } else if (name === 'Description' || name === 'message') {
        rules.minlength = 10;
        rules.maxlength = 5000;
        messages.required = 'Please provide your query.';
        messages.minlength = 'Please enter at least 10 characters in your query.';
      } else if (name === 'captcha') {
        rules.digits = true;
        rules.minlength = 1;
        rules.maxlength = 2;
        messages.required = 'Please solve the captcha (e.g. 2 + 3).';
        messages.digits = 'Please enter the numeric answer.';
        messages.minlength = 'Please enter the captcha answer.';
        messages.maxlength = 'Please enter the captcha answer.';
      }

      if (Object.keys(rules).length) {
        $el.rules('add', $.extend({}, rules, { messages: messages }));
      }
    });

    $form.on('keyup blur change', 'input, textarea', function () {
      var $el = $(this);
      if ($el.val()) {
        $el.valid();
      }
    });

    $form.on('input', 'input[name="Phone"], input[name="phone_national"]', function () {
      this.value = this.value.replace(/\D+/g, '').slice(0, 10);
    });

    $form.on('input', 'input[name="captcha"]', function () {
      this.value = this.value.replace(/\D+/g, '').slice(0, 2);
    });
  }

  function init() {
    $('.js-enquiry-form').each(function () {
      bindForm($(this));
    });

    var $serverError = $('.js-enquiry-form .error.field-error:not([hidden]), .js-enquiry-form .captcha-error').filter(function () {
      return $.trim($(this).text()) !== '';
    }).first();
    if ($serverError.length) {
      $('html, body').animate({ scrollTop: Math.max(0, $serverError.offset().top - 120) }, 300);
    }
  }

  $(init);
  $(document).on('shown.bs.modal', '.modal', function () {
    $(this).find('.js-enquiry-form').each(function () {
      bindForm($(this));
    });
  });
})(window.jQuery);
