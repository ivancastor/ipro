/**
 * iPro — GTM + GA4 + Google Ads (Fase 15)
 * Container: GTM-5XGDNMPT | GA4: G-2ZJE5GRPX3 | Ads: AW-17817579491
 *
 * Instalação:
 * 1. snippets/gtm-head.html no <head>
 * 2. snippets/gtm-body.html após <body>
 * 3. Este script após agendamento.js nas páginas com agendamento
 */
(function () {
  "use strict";

  if (window.__iproGtmLoaded) return;
  window.__iproGtmLoaded = true;

  window.dataLayer = window.dataLayer || [];

  var GTM_ID = "GTM-5XGDNMPT";
  var GA4_ID = "G-2ZJE5GRPX3";
  var ADS_ID = "AW-17817579491";

  var _agendamentoFired = false;

  function push(event, params) {
    var payload = Object.assign({ event: event }, params || {});
    window.dataLayer.push(payload);
    if (window.console && window.location.search.indexOf("gtm_debug=1") > -1) {
      console.log("[iPro GTM]", payload);
    }
  }

  function fireAgendamentoConcluido(data) {
    if (_agendamentoFired) return;
    _agendamentoFired = true;
    push("agendamento_concluido", Object.assign({ currency: "BRL", value: 0 }, data || {}));
  }

  window.iproTrack = {
    agendamentoConcluido: fireAgendamentoConcluido,
    cliqueWhatsapp: function (url) {
      push("clique_whatsapp", { link_url: url || "" });
    },
    cliqueTelefone: function (url) {
      push("clique_telefone", { link_url: url || "" });
    },
    cliqueAgendar: function (url, text) {
      push("clique_agendar", { link_url: url || "", click_text: text || "" });
    },
  };

  // ─── Clique WhatsApp / Telefone / Agendar ───────────────────
  var AGENDAR_TEXTS = [
    "agendar",
    "agendar agora",
    "solicitar agendamento",
    "fazer agendamento",
  ];

  function matchesAgendarText(text) {
    var t = (text || "").toLowerCase().replace(/\s+/g, " ").trim();
    for (var i = 0; i < AGENDAR_TEXTS.length; i++) {
      if (t.indexOf(AGENDAR_TEXTS[i]) > -1) return true;
    }
    return false;
  }

  document.addEventListener(
    "click",
    function (e) {
      var target = e.target.closest("a, button");
      if (!target) return;

      var href = target.getAttribute("href") || "";
      var text = (target.textContent || "").trim();

      if (
        href.indexOf("wa.me") > -1 ||
        href.indexOf("api.whatsapp.com") > -1 ||
        href.indexOf("whatsapp.com") > -1
      ) {
        window.iproTrack.cliqueWhatsapp(href);
        return;
      }

      if (href.indexOf("tel:") === 0) {
        window.iproTrack.cliqueTelefone(href);
        return;
      }

      if (matchesAgendarText(text)) {
        window.iproTrack.cliqueAgendar(href, text);
      }
    },
    true
  );

  // ─── agendamento_concluido — somente após sucesso confirmado ─
  // Fluxo Apple: POST /api/agendamentos OK → overlay "Solicitação enviada!"
  // Fluxo Notebook: WhatsApp enviado → mesmo overlay
  // Fluxo PIX: pagamento confirmado → #agend-pix-success visível

  function overlayIsSuccess(el) {
    if (!el || !el.classList.contains("terms-open")) return false;
    var box = document.getElementById("agend-terms-box");
    if (!box) return false;
    return box.textContent.indexOf("Solicitação enviada") > -1;
  }

  function watchAgendamentoSuccess() {
    var termsOvl = document.getElementById("agend-terms-overlay");
    if (termsOvl) {
      var termsObs = new MutationObserver(function () {
        if (overlayIsSuccess(termsOvl)) {
          fireAgendamentoConcluido({ conversion_source: "agendamento_overlay" });
        }
      });
      termsObs.observe(termsOvl, { attributes: true, attributeFilter: ["class"], subtree: true, childList: true });
    }

    var pixSuccess = document.getElementById("agend-pix-success");
    if (pixSuccess) {
      var pixObs = new MutationObserver(function () {
        if (pixSuccess.style.display === "block") {
          fireAgendamentoConcluido({ conversion_source: "pix_pago", value: 0 });
        }
      });
      pixObs.observe(pixSuccess, { attributes: true, attributeFilter: ["style"] });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", watchAgendamentoSuccess);
  } else {
    watchAgendamentoSuccess();
  }
  setTimeout(watchAgendamentoSuccess, 1500);

  window.IPRO_GTM_ID = GTM_ID;
  window.IPRO_GA4_ID = GA4_ID;
  window.IPRO_ADS_ID = ADS_ID;
})();
