/*! shareon v2.0.0 */ !(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? e(exports)
    : "function" == typeof define && define.amd
      ? define(["exports"], e)
      : e(
          ((t =
            "undefined" != typeof globalThis ? globalThis : t || self).Shareon =
            {}),
        );
})(this, function (t) {
  "use strict";
  const e = {
      facebook: (t) => `https://www.facebook.com/sharer/sharer.php?u=${t.url}`,
      linkedin: (t) =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${t.url}`,
      mastodon: (t) =>
        `https://toot.kytta.dev/?text=${t.title}%0D%0A${t.url}${t.text ? `%0D%0A%0D%0A${t.text}` : ""}${t.via ? `%0D%0A%0D%0A${t.via}` : ""}`,
      messenger: (t) =>
        `https://www.facebook.com/dialog/send?app_id=${t.fbAppId}&link=${t.url}&redirect_uri=${t.url}`,
      odnoklassniki: (t) =>
        `https://connect.ok.ru/offer?url=${t.url}&title=${t.title}${t.media ? `&imageUrl=${t.media}` : ""}`,
      pinterest: (t) =>
        `https://pinterest.com/pin/create/button/?url=${t.url}&description=${t.title}${t.media ? `&media=${t.media}` : ""}`,
      pocket: (t) => `https://getpocket.com/edit.php?url=${t.url}`,
      reddit: (t) =>
        `https://www.reddit.com/submit?title=${t.title}&url=${t.url}`,
      telegram: (t) =>
        `https://telegram.me/share/url?url=${t.url}${t.text ? `&text=${t.text}` : ""}`,
      twitter: (t) =>
        `https://twitter.com/intent/tweet?url=${t.url}&text=${t.title}${t.via ? `&via=${t.via}` : ""}`,
      viber: (t) =>
        `viber://forward?text=${t.title}%0D%0A${t.url}${t.text ? `%0D%0A%0D%0A${t.text}` : ""}`,
      vkontakte: (t) =>
        `https://vk.com/share.php?url=${t.url}&title=${t.title}${t.media ? `&image=${t.media}` : ""}`,
      whatsapp: (t) =>
        `https://wa.me/?text=${t.title}%0D%0A${t.url}${t.text ? `%0D%0A%0D%0A${t.text}` : ""}`,
    },
    o = (t) => () => {
      window.open(t, "_blank", "noopener,noreferrer");
    },
    r = () => {
      const t = document.querySelectorAll(".shareon");
      for (const r of t)
        for (const t of r.children)
          if (t) {
            const i = t.classList.length;
            for (let a = 0; a < i; a += 1) {
              const i = t.classList.item(a);
              if (Object.prototype.hasOwnProperty.call(e, i)) {
                const a = {
                    url: encodeURIComponent(
                      t.dataset.url || r.dataset.url || window.location.href,
                    ),
                    title: encodeURIComponent(
                      t.dataset.title || r.dataset.title || document.title,
                    ),
                    media: encodeURIComponent(
                      t.dataset.media || r.dataset.media || "",
                    ),
                    text: encodeURIComponent(
                      t.dataset.text || r.dataset.text || "",
                    ),
                    via: encodeURIComponent(
                      t.dataset.via || r.dataset.via || "",
                    ),
                    fbAppId: encodeURIComponent(
                      t.dataset.fbAppId || r.dataset.fbAppId || "",
                    ),
                  },
                  n = e[i](a);
                "a" === t.tagName.toLowerCase()
                  ? (t.setAttribute("href", n),
                    t.setAttribute("rel", "noopener noreferrer"),
                    t.setAttribute("target", "_blank"))
                  : t.addEventListener("click", o(n));
                break;
              }
            }
          }
    },
    i = document.currentScript;
  i && i.hasAttribute("init") && r(),
    (t.init = r),
    Object.defineProperty(t, "__esModule", { value: !0 }),
    (t[Symbol.toStringTag] = "Module");
});
