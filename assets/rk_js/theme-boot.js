/**
 * Theme boot: team/enquiry/career modal placement, captcha refresh, a11y focus fix.
 * Expects <body data-captcha-url="...">.
 */
(function ($) {
  if (typeof $ === 'undefined') return;

  function refreshCaptcha($scope) {
    var base = document.body.getAttribute('data-captcha-url') || '/captcha';
    var url = base + (base.indexOf('?') >= 0 ? '&' : '?') + 'format=json&refresh=1&t=' + Date.now();
    var $root = $scope && $scope.length ? $scope : $(document);
    $.getJSON(url)
      .done(function (data) {
        var prompt = (data && data.prompt) ? String(data.prompt) : '';
        if (!prompt) return;
        $root.find('[data-captcha-prompt]').text(prompt);
        $root.find('input[name="captcha"]').val('').attr('aria-label', 'What is ' + prompt + '?');
      })
      .fail(function () {});
  }

  /** Avoid aria-hidden on a focused descendant (Bootstrap modal hide warning). */
  function blurIfInside(modalEl) {
    var active = document.activeElement;
    if (active && modalEl && modalEl.contains(active) && typeof active.blur === 'function') {
      active.blur();
    }
  }

  $(function () {
    ['#exampleModal', '#enquiry-modal', '#career-modal'].forEach(function (sel) {
      var $m = $(sel);
      if ($m.length) {
        $m.appendTo('body');
      }
    });

    $(document).on('hide.bs.modal', '.modal', function () {
      blurIfInside(this);
    });
    $(document).on('hidden.bs.modal', '.modal', function () {
      // Ensure no leftover focus inside a now aria-hidden modal.
      blurIfInside(this);
    });

    // Single open path: HTML data-bs-toggle handles show; do not also call Modal.show().
    $(document).on('click', '.teamcard .readBlog, .teamcard .eventImg', function (e) {
      // Let Bootstrap data-bs-toggle on .eventImg open the modal; prevent nested <a> navigation.
      if (e.target.closest('a.readBlog')) {
        e.preventDefault();
      }
    });

    $(document).on('show.bs.modal', '#exampleModal', function (e) {
      var trigger = e.relatedTarget;
      var $card = trigger ? $(trigger).closest('.teamcard') : $();
      if (!$card.length) {
        $card = $('.teamcard.is-opening').first();
      }
      if (!$card.length) return;
      var id = $card.data('id');
      if (!id) return;
      var name = ($card.find('.teamName' + id).text() || '').trim();
      var html = $card.find('.teamdescdata' + id).html() || '';
      var src = $card.find('.teamImage' + id).attr('src') || '';
      $(this).find('.teampopupName').text(name);
      $(this).find('.teampopupContent').html(html);
      if (src) {
        $(this).find('.teampopupImage, .teampopupImagesrc').attr('src', src).attr('srcset', src);
      }
    });

    $(document).on('click', '.teamcard', function () {
      $('.teamcard').removeClass('is-opening');
      $(this).addClass('is-opening');
    });

    $(document).on('keydown', '.teamcard .eventImg', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });

    $(document).on('click', '[data-captcha-refresh]', function (e) {
      e.preventDefault();
      refreshCaptcha($(this).closest('.captchaFld, form, .modal'));
    });
    $(document).on('shown.bs.modal', '#enquiry-modal, .career-modal', function () {
      refreshCaptcha($(this));
    });
  });
})(window.jQuery);
