import type { Lang } from '@/types/nabta';

/* ------------------------------------------------------------------
   12 Nabta — interface text in Arabic (default) and English.
   TypeScript enforces full key parity between `ar` and `en`.
   ------------------------------------------------------------------ */
const ar = {
  'meta.title': '12 نبتة — أبليك يدوي من قصاصات القماش، الإسكندرية',
  'meta.description':
    '12 نبتة — مقالم وحقائب توت وقطع مخصّصة بالأبليك اليدوي من قصاصات القماش، تصنعها سيدات في حوض 12 بالإسكندرية.',
  'brand.name': '12 نبتة',
  'nav.mainLabel': 'التنقل الرئيسي',
  'nav.skip': 'تخطَّ إلى المحتوى',
  'nav.shop': 'القطع',
  'nav.make': 'منتجاتنا',
  'nav.story': 'الحكاية',
  'nav.process': 'طريقة الصنع',
  'nav.impact': 'الأثر',
  'nav.card': 'البطاقة الرقمية',
  'nav.order': 'اطلب',
  'nav.menu': 'القائمة',
  'nav.close': 'إغلاق',
  'lang.switch': 'English',
  'lang.label': 'التبديل إلى الإنجليزية',

  'hero.kicker': 'صُنع يدويًا في حوض 12، الإسكندرية',
  'hero.title': 'قصاصات قماش، تُخاط باليد لتصبح قطعًا تُستعمل كل يوم.',
  'hero.text':
    '«12 نبتة» مبادرة مجتمعية تتعلّم فيها سيدات لديهن خبرة في الحرف اليدوية فنّ الأبليك، ويحوّلن بقايا الأقمشة إلى مقالم وحقائب توت وقطع مخصّصة.',
  'hero.cta': 'شاهد القطع',
  'hero.cta2': 'اطلب الآن',
  'hero.note': 'كل قطعة في هذه الصفحة قُصّت وثُبّتت وخِيطت باليد.',

  'featured.title': 'قطع من الورشة',
  'featured.text':
    'يبدأ كل تصميم بقصاصة قماش وبضعة خطوط من الخيط. اضغط على أي قطعة لتراها عن قرب.',
  'featured.prev': 'القطع السابقة',
  'featured.next': 'المزيد من القطع',
  'card.view': 'عرض القطعة',
  'card.price': 'السعر عند الطلب',

  'make.title': 'منتجاتنا',
  'make.text': 'الأيدي نفسها والتقنيات نفسها، بأشكال مختلفة. اختر فئة لتصفية القطع.',
  'make.all': 'كل القطع',
  'make.soon': 'الصور قريبًا',
  'make.ask': 'اسأل عنها',
  'make.empty': 'لا توجد صور في هذه الفئة بعد، ويمكنك الطلب رغم ذلك: أخبرنا بما تحتاجه.',

  'story.kicker': 'من أين نبدأ',
  'story.title': 'مهارة حقيقية، وفرص قليلة لاستخدامها.',
  'story.p1':
    'تعمل «12 نبتة» في منطقة حوض 12 بحي المنتزه في الإسكندرية. كثير من السيدات هنا يعرفن الخياطة والتطريز، لكن العمل المنتظم والتدريب الذي يقود إلى طلبات حقيقية ليسا متاحين بسهولة.',
  'story.p2':
    'تبني المبادرة على ما تعرفه السيدات بالفعل، وتضيف إليه الأبليك والتشطيب وحساب التكلفة، ثم تربط العمل بأفراد وجهات يرغبون في شرائه.',
  'story.p3':
    'لا شيء هنا يبدأ من خامة جديدة: التصميمات تُبنى من قصاصات القماش والخيوط والألوان التي كان مصيرها الإهمال.',
  'story.caption': 'غرفة الورشة في حوض 12.',

  'process.title': 'كيف تُصنع القطعة',
  'process.text':
    'أربع خطوات، كلها باليد. يتغيّر ترتيبها من قطعة لأخرى، أما الصبر فلا يتغيّر.',

  'impact.title': 'ما تحقّق حتى الآن',
  'impact.text': 'في المرحلة الأولى انتقلت «12 نبتة» من فكرة إلى إنتاج حقيقي.',
  'impact.partners': 'الشركاء',

  'gallery.title': 'من داخل الورشة',
  'gallery.text': 'صُوّرت خلال يوم عمل في حوض 12.',

  'order.title': 'اطلب قطعة، أو صمّم طلبك الخاص',
  'order.text':
    'اختر قطعة من القطع، أو حدّد الكمية، أو صِف فكرتك: أسماء، شعار، هدية لفريق عملك.',
  'order.name': 'الاسم',
  'order.contact': 'رقم الهاتف أو واتساب',
  'order.email': 'البريد الإلكتروني (اختياري)',
  'order.product': 'ماذا تريد؟',
  'order.product.custom': 'طلب مخصّص / غير موجود في القائمة',
  'order.qty': 'الكمية',
  'order.notes': 'التفاصيل والتخصيص',
  'order.notes.ph': 'الألوان، الأسماء، الشعار، موعد التسليم، مكانك…',
  'order.upload': 'أضف تصميمًا أو صورة مرجعية (اختياري)',
  'order.upload.hint':
    'JPG أو PNG، حتى {mb} ميجابايت. تبقى الصورة على جهازك إلى أن تُفعَّل طريقة الإرسال.',
  'order.upload.remove': 'إزالة الصورة',
  'order.submit': 'جهّز طلبي',
  'order.required': 'من فضلك اكتب اسمك ووسيلة للتواصل وما الذي تريده.',
  'order.big': 'حجم الصورة أكبر من {mb} ميجابايت.',
  'order.ready.title': 'طلبك جاهز، لكنه لم يُرسل بعد.',
  'order.ready.text':
    'الطلب الإلكتروني غير مفعّل حتى الآن. انسخ الرسالة التالية وأرسلها إلى «12 نبتة»، أو استخدم واتساب إن ظهر الزر.',
  'order.ready.noContact': 'ستُضاف بيانات التواصل هنا قريبًا.',
  'order.copy': 'نسخ الرسالة',
  'order.copied': 'تم النسخ',
  'order.whatsapp': 'إرسال عبر واتساب',
  'order.email.btn': 'إرسال بالبريد',
  'order.instagram.btn': 'راسلنا على إنستغرام',
  'order.edit': 'تعديل الطلب',
  'order.sending': 'جارٍ الإرسال…',
  'order.sent.title': 'وصلنا طلبك.',
  'order.sent.text': 'شكرًا لك. ستتواصل معك «12 نبتة» لتأكيد التفاصيل والسعر.',
  'order.failed':
    'حدث خطأ أثناء الإرسال. رسالتك بالأسفل، من فضلك انسخها وأرسلها مباشرة.',
  'order.msg.head': 'طلب جديد — موقع 12 نبتة',
  'order.msg.image': 'صورة مرجعية: {name} (سيتم إرسالها بشكل منفصل)',

  'detail.close': 'إغلاق',
  'detail.techniques': 'صُنعت باستخدام',
  'detail.price': 'السعر والمقاس',
  'detail.price.val': 'اسألنا — ستُضاف الأسعار والمقاسات قريبًا.',
  'detail.order': 'اطلب هذه القطعة',
  'detail.made': 'شاهدها أثناء صنعها',
  'detail.prev': 'الصورة السابقة',
  'detail.next': 'الصورة التالية',
  'detail.photo': 'صورة {i} من {n}',

  'footer.navLabel': 'روابط التذييل',
  'footer.tag': 'أبليك يدوي من قصاصات القماش. حوض 12، المنتزه ثان، الإسكندرية.',
  'footer.contact': 'تواصل معنا',
  'footer.nocontact': 'ستُضاف بيانات التواصل قريبًا.',
  'footer.made': 'صور المنتجات والورشة من فريق 12 نبتة.',
  'footer.top': 'العودة إلى الأعلى',

  'contact.whatsapp': 'واتساب',
  'contact.instagram': 'إنستغرام',
  'contact.facebook': 'فيسبوك',

  'cardPage.metaTitle': '12 نبتة — البطاقة الرقمية ثلاثية الأبعاد',
  'cardPage.metaDescription':
    'البطاقة الرقمية التفاعلية ثلاثية الأبعاد لمبادرة 12 نبتة — استعرض وجهي البطاقة ورمز الاستجابة السريعة وتابعنا على إنستغرام.',
  'cardPage.headerLabel': 'ترويسة البطاقة الرقمية لـ 12 نبتة',
  'cardPage.eyebrow': '12 نبتة · مصر',
  'cardPage.hint': 'اسحب لتدوير البطاقة',
  'cardPage.stageLabel':
    'بطاقة 12 نبتة ثلاثية الأبعاد التفاعلية. اسحب لتدوير البطاقة ومعاينة الوجهين الأمامي والخلفي.',
  'cardPage.controlsLabel': 'أدوات التحكم في عرض البطاقة ثلاثية الأبعاد',
  'cardPage.pause': 'إيقاف مؤقت',
  'cardPage.resume': 'استئناف',
  'cardPage.pauseLabel': 'إيقاف الدوران التلقائي مؤقتًا',
  'cardPage.resumeLabel': 'استئناف الدوران التلقائي',
  'cardPage.front': 'الأمام',
  'cardPage.backQr': 'الخلف و QR',
  'cardPage.frontLabel': 'معاينة الوجه الأمامي للبطاقة',
  'cardPage.backLabel': 'معاينة الوجه الخلفي ورمز QR',
  'cardPage.followIg': 'تابعنا على إنستغرام',
  'cardPage.followIgLabel': 'تابعنا على إنستغرام @12nabta (يفتح في تبويب جديد)',
  'cardPage.caption': '@12nabta · مبادرة ١٢ نبتة',
  'cardPage.frontAlt': 'الوجه الأمامي الأصلي لبطاقة 12 نبتة',
  'cardPage.backAlt': 'الوجه الخلفي الأصلي لبطاقة 12 نبتة',
} as const;

export type TranslationKey = keyof typeof ar;

const en: Record<TranslationKey, string> = {
  'meta.title': '12 Nabta — handmade appliqué from fabric scraps, Alexandria',
  'meta.description':
    '12 Nabta — handmade appliqué pencil cases, tote bags and custom pieces made from fabric scraps by women in Hod 12, Alexandria.',
  'brand.name': '12 Nabta',
  'nav.mainLabel': 'Main',
  'nav.skip': 'Skip to content',
  'nav.shop': 'Pieces',
  'nav.make': 'What we make',
  'nav.story': 'Story',
  'nav.process': 'Process',
  'nav.impact': 'Impact',
  'nav.card': 'Digital Card',
  'nav.order': 'Order',
  'nav.menu': 'Menu',
  'nav.close': 'Close',
  'lang.switch': 'العربية',
  'lang.label': 'Switch to Arabic',

  'hero.kicker': 'Handmade in Hod 12, Alexandria',
  'hero.title': 'Fabric scraps, stitched by hand into pieces you’ll use every day.',
  'hero.text':
    '12 Nabta is a community initiative where women with craft experience learn appliqué and turn leftover fabric into pencil cases, tote bags and custom pieces.',
  'hero.cta': 'See the pieces',
  'hero.cta2': 'Place an order',
  'hero.note': 'Every piece on this page was cut, placed and stitched by hand.',

  'featured.title': 'Pieces from the workshop',
  'featured.text':
    'Each design starts as a scrap of fabric and a few lines of thread. Tap a piece to see it closer.',
  'featured.prev': 'Previous pieces',
  'featured.next': 'More pieces',
  'card.view': 'View piece',
  'card.price': 'Price on request',

  'make.title': 'What we make',
  'make.text':
    'The same hands and the same techniques, in different shapes. Choose a category to filter the pieces.',
  'make.all': 'All pieces',
  'make.soon': 'Photos coming soon',
  'make.ask': 'Ask about this',
  'make.empty': 'No photos in this category yet. You can still order — tell us what you need.',

  'story.kicker': 'Where it starts',
  'story.title': 'Real skills, few chances to use them.',
  'story.p1':
    '12 Nabta works in Hod 12, in Alexandria’s Montaza district. Many women here already know how to sew and embroider, but steady work and training that leads to real orders are hard to find.',
  'story.p2':
    'The initiative builds on what they already know. It adds appliqué, finishing and costing, and connects the work to people and organisations who want to buy it.',
  'story.p3':
    'Nothing here starts from new material: the designs are built from scraps of fabric, thread and colour that would otherwise be thrown away.',
  'story.caption': 'The workshop room in Hod 12.',

  'process.title': 'How a piece is made',
  'process.text':
    'Four steps, all by hand. The order changes from piece to piece; the patience doesn’t.',

  'impact.title': 'What has happened so far',
  'impact.text': 'The first phase moved 12 Nabta from an idea to real production.',
  'impact.partners': 'Partners',

  'gallery.title': 'Inside the workshop',
  'gallery.text': 'Photographed during a working day in Hod 12.',

  'order.title': 'Order a piece, or something made for you',
  'order.text':
    'Choose one of the pieces, ask for a quantity, or describe your own idea: names, a logo, a gift for your team.',
  'order.name': 'Your name',
  'order.contact': 'Phone or WhatsApp',
  'order.email': 'Email (optional)',
  'order.product': 'What would you like?',
  'order.product.custom': 'Something custom / not listed',
  'order.qty': 'Quantity',
  'order.notes': 'Details and customisation',
  'order.notes.ph': 'Colours, names, a logo, a deadline, where you are…',
  'order.upload': 'Add a design or reference image (optional)',
  'order.upload.hint':
    'JPG or PNG, up to {mb} MB. It stays on your device until a sending method is set up.',
  'order.upload.remove': 'Remove image',
  'order.submit': 'Prepare my request',
  'order.required': 'Please fill in your name, a way to reach you, and what you would like.',
  'order.big': 'Image is larger than {mb} MB.',
  'order.ready.title': 'Your request is ready — it has not been sent yet.',
  'order.ready.text':
    'Online ordering isn’t connected yet. Copy the message below and send it to 12 Nabta, or use WhatsApp if the button is shown.',
  'order.ready.noContact': 'Contact details will be added here soon.',
  'order.copy': 'Copy message',
  'order.copied': 'Copied',
  'order.whatsapp': 'Send on WhatsApp',
  'order.email.btn': 'Send by email',
  'order.instagram.btn': 'Message on Instagram',
  'order.edit': 'Edit request',
  'order.sending': 'Sending…',
  'order.sent.title': 'Request received.',
  'order.sent.text': 'Thank you. 12 Nabta will contact you to confirm details and price.',
  'order.failed':
    'Something went wrong while sending. Your message is below — please copy it and send it directly.',
  'order.msg.head': 'New order request — 12 Nabta website',
  'order.msg.image': 'Reference image: {name} (will be sent separately)',

  'detail.close': 'Close',
  'detail.techniques': 'Made with',
  'detail.price': 'Price and size',
  'detail.price.val': 'Ask us — prices and sizes will be listed soon.',
  'detail.order': 'Order this piece',
  'detail.made': 'See it being made',
  'detail.prev': 'Previous photo',
  'detail.next': 'Next photo',
  'detail.photo': 'Photo {i} of {n}',

  'footer.navLabel': 'Footer',
  'footer.tag': 'Handmade appliqué from fabric scraps. Hod 12, Montaza 2, Alexandria.',
  'footer.contact': 'Contact',
  'footer.nocontact': 'Contact details coming soon.',
  'footer.made': 'Product and workshop photos by the 12 Nabta team.',
  'footer.top': 'Back to top',

  'contact.whatsapp': 'WhatsApp',
  'contact.instagram': 'Instagram',
  'contact.facebook': 'Facebook',

  'cardPage.metaTitle': '12 Nabta — Digital Business Card',
  'cardPage.metaDescription':
    '12 Nabta — Interactive 3D digital business card preserving the original 12 Nabta artwork in realistic 3D.',
  'cardPage.headerLabel': '12 Nabta Digital Card Header',
  'cardPage.eyebrow': '12 Nabta · Egypt',
  'cardPage.hint': 'Drag to inspect',
  'cardPage.stageLabel':
    'Interactive 3D 12 Nabta business card. Drag to rotate and inspect front and back.',
  'cardPage.controlsLabel': '3D card viewing controls',
  'cardPage.pause': 'Pause',
  'cardPage.resume': 'Resume',
  'cardPage.pauseLabel': 'Pause automatic rotation',
  'cardPage.resumeLabel': 'Resume automatic rotation',
  'cardPage.front': 'Front',
  'cardPage.backQr': 'Back & QR',
  'cardPage.frontLabel': 'Inspect front face',
  'cardPage.backLabel': 'Inspect back face and QR code',
  'cardPage.followIg': 'Follow Our Instagram',
  'cardPage.followIgLabel': 'Follow Our Instagram at @12nabta (opens in a new tab)',
  'cardPage.caption': '@12nabta · مبادرة ١٢ نبتة',
  'cardPage.frontAlt': '12 Nabta Original Card Front',
  'cardPage.backAlt': '12 Nabta Original Card Back',
};

export const NABTA_I18N: Record<Lang, Record<TranslationKey, string>> = { ar, en };
