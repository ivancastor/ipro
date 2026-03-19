(function () {
  var el = document.getElementById('page-hero');
  if (!el) return;

  var title    = el.getAttribute('data-title')    || '';
  var subtitle = el.getAttribute('data-subtitle') || '';
  var img      = el.getAttribute('data-img')      || '';
  var tag      = el.getAttribute('data-tag')      || '';
  var bg       = el.getAttribute('data-bg')       || '';

  var tagHTML      = tag      ? '<p class="text-xs font-mono tracking-[0.2em] uppercase ' + (bg ? 'text-white/60' : 'text-[#86868b]') + ' mb-4" data-aos>' + tag + '</p>' : '';
  var subtitleHTML = subtitle ? '<p class="text-lg md:text-xl lg:text-2xl ' + (bg ? 'text-white/70' : 'text-[#86868b]') + ' leading-relaxed max-w-3xl mx-auto mb-16" data-aos>' + subtitle + '</p>' : '';
  var imgHTML      = img      ? '<div class="max-w-7xl mx-auto rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl shadow-black/10 mt-10" data-aos><img loading="lazy" src="' + img + '" alt="' + title + '" class="w-full h-[220px] sm:h-[400px] md:h-[600px] object-cover hover:scale-105 transition-transform duration-[2s]" /></div>' : '';

  var bgOpen = '';
  var bgClose = '';
  var titleColor = bg ? 'text-white' : '';
  if (bg) {
    bgOpen = '<div class="absolute inset-0"><img loading="lazy" src="' + bg + '" alt="" class="w-full h-full object-cover"><div class="absolute inset-0 bg-black/50"></div></div>';
  }

  var html = '<section class="' + (bg ? 'relative overflow-hidden ' : '') + 'pt-28 md:pt-40 pb-12 md:pb-20 px-6 text-center">'
    + bgOpen
    + '<div class="' + (bg ? 'relative z-10 ' : '') + 'max-w-5xl mx-auto">'
    + tagHTML
    + '<h1 class="text-[30px] sm:text-[44px] md:text-[56px] lg:text-[88px] leading-[1.05] font-semibold tracking-tighter mb-6 ' + titleColor + '" data-aos>' + title + '</h1>'
    + subtitleHTML
    + '</div>'
    + imgHTML
    + '</section>';

  el.insertAdjacentHTML('beforebegin', html);
  el.remove();
})();
