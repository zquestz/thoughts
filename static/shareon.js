/*! shareon v2.0.0 */var Shareon=function(t){"use strict";const e={facebook:t=>`https://www.facebook.com/sharer/sharer.php?u=${t.url}`,linkedin:t=>`https://www.linkedin.com/sharing/share-offsite/?url=${t.url}`,mastodon:t=>`https://toot.kytta.dev/?text=${t.title}%0D%0A${t.url}${t.text?`%0D%0A%0D%0A${t.text}`:""}${t.via?`%0D%0A%0D%0A${t.via}`:""}`,messenger:t=>`https://www.facebook.com/dialog/send?app_id=${t.fbAppId}&link=${t.url}&redirect_uri=${t.url}`,odnoklassniki:t=>`https://connect.ok.ru/offer?url=${t.url}&title=${t.title}${t.media?`&imageUrl=${t.media}`:""}`,pinterest:t=>`https://pinterest.com/pin/create/button/?url=${t.url}&description=${t.title}${t.media?`&media=${t.media}`:""}`,pocket:t=>`https://getpocket.com/edit.php?url=${t.url}`,reddit:t=>`https://www.reddit.com/submit?title=${t.title}&url=${t.url}`,telegram:t=>`https://telegram.me/share/url?url=${t.url}${t.text?`&text=${t.text}`:""}`,twitter:t=>`https://twitter.com/intent/tweet?url=${t.url}&text=${t.title}${t.via?`&via=${t.via}`:""}`,viber:t=>`viber://forward?text=${t.title}%0D%0A${t.url}${t.text?`%0D%0A%0D%0A${t.text}`:""}`,vkontakte:t=>`https://vk.com/share.php?url=${t.url}&title=${t.title}${t.media?`&image=${t.media}`:""}`,whatsapp:t=>`https://wa.me/?text=${t.title}%0D%0A${t.url}${t.text?`%0D%0A%0D%0A${t.text}`:""}`},r=t=>()=>{window.open(t,"_blank","noopener,noreferrer")},o=()=>{const t=document.querySelectorAll(".shareon");for(const o of t)for(const t of o.children)if(t){const a=t.classList.length;for(let i=0;i<a;i+=1){const a=t.classList.item(i);if(Object.prototype.hasOwnProperty.call(e,a)){const i={url:encodeURIComponent(t.dataset.url||o.dataset.url||window.location.href),title:encodeURIComponent(t.dataset.title||o.dataset.title||document.title),media:encodeURIComponent(t.dataset.media||o.dataset.media||""),text:encodeURIComponent(t.dataset.text||o.dataset.text||""),via:encodeURIComponent(t.dataset.via||o.dataset.via||""),fbAppId:encodeURIComponent(t.dataset.fbAppId||o.dataset.fbAppId||"")},n=e[a](i);"a"===t.tagName.toLowerCase()?(t.setAttribute("href",n),t.setAttribute("rel","noopener noreferrer"),t.setAttribute("target","_blank")):t.addEventListener("click",r(n));break}}}},a=document.currentScript;return a&&a.hasAttribute("init")&&o(),t.init=o,Object.defineProperty(t,"__esModule",{value:!0}),t[Symbol.toStringTag]="Module",t}({});