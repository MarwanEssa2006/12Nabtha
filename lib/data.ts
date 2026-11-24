import type { ImageSpec, NabtaData, Product } from '@/types/nabta';

/* ------------------------------------------------------------------
   12 Nabta — content data (products, categories, facts, gallery)
   Every text field has { en, ar }. Edit freely; the page re-renders from this file.

   Conventions
   - `todo` lists facts that are NOT known yet. They are never shown as facts on the site.
   - `confirm: true` marks content taken from the internal grant document that the team
     should approve before the site goes public.
   - `imageNote` flags images whose origin should be checked (see docs/CONTENT-CHECKLIST.md).
   - `views` is reserved for the future "preview your artwork" feature (docs/CUSTOM-PREVIEW.md).
   ------------------------------------------------------------------ */

const img = (base: string, widths: readonly number[]): ImageSpec => ({ base, widths });
const P = [480, 900, 1300] as const;
const W = [640, 1280] as const;

export const NABTA_DATA: NabtaData = {
  categories: [
    {
      id: 'pouches',
      name: { en: 'Pencil cases & pouches', ar: 'مقالم وحافظات' },
      blurb: {
        en: 'Zip pouches on canvas with a wrist loop, each with its own appliqué design.',
        ar: 'حافظات بسوستة من القماش مع علّاقة لليد، لكلٍّ منها تصميم أبليك خاص.',
      },
    },
    {
      id: 'totes',
      name: { en: 'Tote bags', ar: 'حقائب توت' },
      blurb: {
        en: 'Everyday tote bags. Photos coming soon.',
        ar: 'حقائب توت للاستخدام اليومي. الصور قريبًا.',
      },
    },
    {
      id: 'laptop',
      name: { en: 'Laptop bags', ar: 'حقائب لابتوب' },
      blurb: {
        en: 'Padded laptop bags. Photos coming soon.',
        ar: 'حقائب لابتوب. الصور قريبًا.',
      },
    },
    {
      id: 'makeup',
      name: { en: 'Makeup bags', ar: 'حقائب مكياج' },
      blurb: {
        en: 'Makeup bags with appliqué and embroidery. Photos coming soon.',
        ar: 'حقائب مكياج بالأبليك والتطريز. الصور قريبًا.',
      },
    },
    {
      id: 'custom',
      name: { en: 'Custom & corporate orders', ar: 'طلبات مخصّصة وهدايا الشركات' },
      blurb: {
        en: 'Gifts and giveaways made for you: your names, your logo, your quantities.',
        ar: 'هدايا وتوزيعات تُصنع خصيصًا لكم: بأسمائكم وشعاركم وبالكمية التي تحتاجونها.',
      },
    },
  ],

  // Product names and descriptions describe what is visible in the photos.
  // Sizes, prices, exact fabrics and availability are unknown → listed in `todo`, shown as "ask us".
  products: [
    {
      slug: 'tic-tac-toe-hearts',
      category: 'pouches',
      featured: true,
      name: { en: 'Tic‑Tac‑Toe Hearts', ar: 'إكس‑أو بالقلوب' },
      summary: {
        en: 'A hand-drawn game of noughts and crosses, won by three red appliqué hearts.',
        ar: 'لعبة إكس-أو مرسومة باليد، تفوز فيها ثلاثة قلوب حمراء من الأبليك.',
      },
      details: {
        en: 'Black painted grid on cream canvas. The hearts are cut from red fabric and finished by hand with a red blanket stitch.',
        ar: 'شبكة مرسومة باللون الأسود على قماش كريمي، والقلوب مقصوصة من قماش أحمر ومثبّتة يدويًا بغرزة البطانية بخيط أحمر.',
      },
      techniques: ['applique', 'embroidery', 'paint'],
      images: [img('tic-tac-toe-hearts', P)],
      imageNote: 'Supplied as 222.jpg (plain phone photo).',
      todo: ['size', 'price', 'fabric composition', 'availability'],
    },
    {
      slug: 'denim-turtle',
      category: 'pouches',
      featured: true,
      name: { en: 'Denim Turtle', ar: 'سلحفاة الجينز' },
      summary: {
        en: 'Two shades of denim scraps become a turtle, outlined in mustard chain stitch.',
        ar: 'درجتان من قصاصات الجينز تصبحان سلحفاة، محدّدة بغرزة السلسلة بخيط خردلي.',
      },
      details: {
        en: 'Dark and light denim pieces, a pale-blue blanket stitch on the shell, and small fabric legs outlined in brown. You can see this design being stitched in the workshop photos.',
        ar: 'قطعتان من الجينز الداكن والفاتح، وغرزة بطانية بلون أزرق فاتح على الصدفة، وأرجل صغيرة من القماش محدّدة بالبني. يمكنكم رؤية هذا التصميم أثناء تطريزه في صور الورشة.',
      },
      techniques: ['applique', 'embroidery', 'upcycled'],
      images: [img('denim-turtle', P)],
      madeIn: 'stitching-turtle',
      imageNote: 'Original file name suggests Gemini processing — confirm.',
      todo: ['size', 'price', 'availability'],
    },
    {
      slug: 'red-bloom',
      category: 'pouches',
      featured: true,
      name: { en: 'Red Bloom', ar: 'الزهرة الحمراء' },
      summary: {
        en: 'A five-petal flower cut from red fabric, traced in violet running stitch.',
        ar: 'زهرة بخمس بتلات مقصوصة من قماش أحمر، ومحدّدة بغرزة جارية بلون بنفسجي.',
      },
      details: {
        en: 'One fabric scrap, one colour of thread, and a lot of patience around each petal.',
        ar: 'قصاصة قماش واحدة، ولون خيط واحد، وصبر طويل حول كل بتلة.',
      },
      techniques: ['applique', 'embroidery'],
      images: [img('red-flower-in-hand', P), img('red-flower-flat', P)],
      imageNote: 'Both photos: original file names suggest Gemini processing — confirm.',
      todo: ['size', 'price', 'availability'],
    },
    {
      slug: 'potted-cactus',
      category: 'pouches',
      featured: true,
      name: { en: 'Potted Cactus', ar: 'صبّارة في أصيص' },
      summary: {
        en: 'A green appliqué cactus with chain-stitched ribs, in a hand-painted spotted pot.',
        ar: 'صبّارة خضراء من الأبليك بخطوط من غرزة السلسلة، في أصيص منقّط مرسوم باليد.',
      },
      details: {
        en: 'The cactus is fabric, stitched down with bright green thread; the pot is painted in blues and plum with white dots.',
        ar: 'الصبّارة من القماش ومثبّتة بخيط أخضر زاهٍ، والأصيص مرسوم بدرجات الأزرق والبرقوقي مع نقاط بيضاء.',
      },
      techniques: ['applique', 'embroidery', 'paint'],
      images: [img('cactus', P)],
      imageNote: 'Original file name suggests Gemini processing — confirm.',
      todo: ['size', 'price', 'availability'],
    },
    {
      slug: 'little-house',
      category: 'pouches',
      featured: true,
      name: { en: 'Little House', ar: 'البيت الصغير' },
      summary: {
        en: 'A mint-green patch becomes a house, with an embroidered tree and three red birds.',
        ar: 'رقعة بلون النعناع تصبح بيتًا، مع شجرة مطرّزة وثلاثة طيور حمراء.',
      },
      details: {
        en: 'Textured mint fabric outlined in blue, a door with a French-knot handle, and a tree in black chain stitch.',
        ar: 'قماش بلون النعناع محدّد بالأزرق، وباب بمقبض من غرزة العقدة الفرنسية، وشجرة بغرزة السلسلة السوداء.',
      },
      techniques: ['applique', 'embroidery'],
      images: [img('little-house', P)],
      imageNote: 'Original file name suggests Gemini processing — confirm.',
      todo: ['size', 'price', 'availability'],
    },
    {
      slug: 'two-alliums',
      category: 'pouches',
      featured: false,
      name: { en: 'Two Alliums', ar: 'زهرتان' },
      summary: {
        en: 'Two round burgundy blooms in pink blanket stitch, on stitched green stems.',
        ar: 'زهرتان مستديرتان بلون العنّابي بغرزة بطانية وردية، على سيقان خضراء مطرّزة.',
      },
      details: {
        en: 'Fabric circles for the flowers; the stems and leaves are drawn entirely in thread.',
        ar: 'دوائر من القماش للزهور، أما السيقان والأوراق فمرسومة بالكامل بالخيط.',
      },
      techniques: ['applique', 'embroidery'],
      images: [img('twin-alliums', P)],
      imageNote: 'Original file name suggests Gemini processing — confirm.',
      todo: ['size', 'price', 'availability'],
    },
    {
      slug: 'red-sun',
      category: 'pouches',
      featured: false,
      name: { en: 'Red Sun', ar: 'الشمس الحمراء' },
      summary: {
        en: 'A painted red circle with black embroidered rays, each ending in a French knot.',
        ar: 'دائرة حمراء مرسومة مع أشعة مطرّزة بالأسود، تنتهي كلٌّ منها بعقدة فرنسية.',
      },
      details: {
        en: 'Paint for the colour, thread for the drawing: a filled black centre and fourteen stitched rays.',
        ar: 'اللون بالرسم، والخطوط بالخيط: مركز أسود ممتلئ وأشعة مطرّزة حوله.',
      },
      techniques: ['embroidery', 'paint'],
      images: [img('red-sun-rays', P)],
      imageNote: 'Original file name suggests Gemini processing — confirm.',
      todo: ['size', 'price', 'availability'],
    },
    {
      slug: 'violet-daisy',
      category: 'pouches',
      featured: false,
      name: { en: 'Violet Daisy', ar: 'الأقحوانة البنفسجية' },
      summary: {
        en: 'Half a daisy in pink and violet, painted to fade into the edge of the pouch.',
        ar: 'نصف أقحوانة بالوردي والبنفسجي، مرسومة لتختفي عند حافة الحافظة.',
      },
      details: {
        en: 'Hand-painted petals blended from pink to violet around a deep teal centre, outlined in black.',
        ar: 'بتلات مرسومة باليد تتدرّج من الوردي إلى البنفسجي حول مركز فيروزي داكن، ومحدّدة بالأسود.',
      },
      techniques: ['paint'],
      images: [img('painted-daisy', P)],
      imageNote: 'Original file name suggests Gemini processing — confirm.',
      todo: ['size', 'price', 'availability'],
    },
  ],

  techniques: {
    applique: { en: 'Appliqué from fabric scraps', ar: 'أبليك من قصاصات القماش' },
    embroidery: { en: 'Hand embroidery', ar: 'تطريز يدوي' },
    paint: { en: 'Hand-painted details', ar: 'تفاصيل مرسومة باليد' },
    upcycled: { en: 'Reused denim', ar: 'جينز مُعاد استخدامه' },
  },

  // The making process, as described in the initiative's own training plan.
  process: [
    {
      photo: img('table-pieces-and-tags', W),
      title: { en: 'Choose the design and the fabric', ar: 'اختيار التصميم والخامات' },
      text: {
        en: 'Each piece starts on the worktable: a sketch, a base of canvas, and scraps chosen for colour and texture.',
        ar: 'تبدأ كل قطعة على طاولة العمل: رسمة، وقاعدة من القماش، وقصاصات تُختار حسب اللون والملمس.',
      },
    },
    {
      photo: img('pinned-applique-bird', W),
      title: { en: 'Cut and assemble', ar: 'القص والتجميع' },
      text: {
        en: 'Shapes are cut from the scraps and pinned in place, so the composition can be checked before a single stitch.',
        ar: 'تُقصّ الأشكال من القصاصات وتُثبَّت بالدبابيس، ليُراجَع التكوين قبل الغرزة الأولى.',
      },
    },
    {
      photo: img('stitching-turtle', W),
      title: { en: 'Appliqué and embroidery', ar: 'الأبليك والتطريز' },
      text: {
        en: 'The pieces are stitched down by hand. The stitch is part of the drawing: blanket, chain, running stitch, French knots.',
        ar: 'تُخاط القطع يدويًا، والغرزة جزء من الرسم: غرزة البطانية والسلسلة والغرزة الجارية والعقدة الفرنسية.',
      },
    },
    {
      photo: img('hands-denim-yellow-thread', W),
      title: { en: 'Sew and finish', ar: 'الخياطة والتشطيب' },
      text: {
        en: 'The work is sewn into its final shape and checked. Costing materials and reducing waste are part of the training too.',
        ar: 'تُخاط القطعة في شكلها النهائي وتُراجَع. ويشمل التدريب أيضًا حساب تكلفة الخامات وتقليل الهدر.',
      },
    },
  ],

  // Facts from "أسئلة نموذج منحة 12 نبتة وإجاباتها" (Aug 2026). confirm:true → approve before publishing.
  milestones: [
    {
      figure: '5',
      confirm: true,
      label: { en: 'women in the first workshop', ar: 'سيدات في الورشة الأولى' },
      text: {
        en: 'Five sessions on fabrics, threads and stitches. Each participant finished her own appliqué prototype.',
        ar: 'خمس جلسات عن الأقمشة والخيوط والغرز، وأنجزت كل مشاركة نموذجها الأول بالأبليك.',
      },
    },
    {
      figure: '450',
      confirm: true,
      label: { en: 'pencil cases in one week', ar: 'مقلمة في أسبوع واحد' },
      text: {
        en: 'Made by four women for Life Makers Association in Alexandria, and delivered on time.',
        ar: 'نفّذتها أربع سيدات لصالح جمعية صُنّاع الحياة بالإسكندرية، وسُلّمت في موعدها.',
      },
    },
    {
      figure: '250',
      confirm: true,
      label: { en: 'pencil cases for the British Council', ar: 'مقلمة للمجلس الثقافي البريطاني' },
      text: {
        en: 'Produced by six women and one man for the closing event of the British Council’s IYE programme.',
        ar: 'أنتجتها ست سيدات ورجل لحفل ختام برنامج IYE التابع للمجلس الثقافي البريطاني.',
      },
    },
  ],

  next: {
    confirm: true,
    title: { en: 'Next: ten women, six months', ar: 'الخطوة التالية: عشر سيدات خلال ستة أشهر' },
    text: {
      en: 'The next phase trains ten women from Hod 12 in appliqué, sewing, embroidery, costing and quality, then brings them gradually into paid orders. Part of what the products earn goes back into materials, equipment and training the next group.',
      ar: 'تدرّب المرحلة القادمة عشر سيدات من حوض 12 على الأبليك والخياطة والتطريز وحساب التكلفة وضبط الجودة، ثم تُشركهن تدريجيًا في تنفيذ طلبات مدفوعة. ويُعاد استثمار جزء من عائد المنتجات في الخامات والمعدات وتدريب مجموعات جديدة.',
    },
  },

  partners: {
    confirm: true,
    en: 'Working alongside the Dei initiative, which teaches reading and writing, and Life Makers Association in Alexandria, which hosts training and production.',
    ar: 'بالتعاون مع مبادرة «ضي» التي تعلّم القراءة والكتابة، وجمعية صُنّاع الحياة بالإسكندرية التي تستضيف التدريب والإنتاج.',
  },

  // The story section uses the workshop-room photo; the gallery opens with the ring-stitching shot.
  storyPhoto: {
    photo: img('workshop-room', W),
    alt: {
      en: 'Women working together around a table in the workshop room',
      ar: 'سيدات يعملن معًا حول طاولة في غرفة الورشة',
    },
  },

  gallery: [
    {
      photo: img('hands-ring-stitching', W),
      alt: { en: 'Stitching a teal appliqué piece onto canvas', ar: 'تثبيت قطعة أبليك فيروزية على القماش' },
      wide: true,
    },
    {
      photo: img('embroidery-hoop', W),
      alt: { en: 'Hands embroidering appliqué shapes in a hoop', ar: 'يدان تطرّزان أشكال أبليك داخل طارة' },
    },
    {
      photo: img('pinned-leaves', W),
      alt: { en: 'Leaves and petals pinned onto canvas before stitching', ar: 'أوراق وبتلات مثبّتة بالدبابيس قبل الخياطة' },
    },
    {
      photo: img('workshop-room', W),
      alt: { en: 'Women working together around a table in the workshop room', ar: 'سيدات يعملن معًا حول طاولة في غرفة الورشة' },
    },
    {
      photo: img('table-pieces-and-tags', W),
      alt: { en: 'Finished appliqué work and 12 Nabta tags on the worktable', ar: 'أعمال أبليك منتهية وبطاقات 12 نبتة على طاولة العمل' },
    },
  ],
};

export const PRODUCTS_BY_SLUG: Record<string, Product> = Object.fromEntries(
  NABTA_DATA.products.map((p) => [p.slug, p])
);

export const HERO_PRODUCT_SLUGS = ['tic-tac-toe-hearts', 'denim-turtle', 'red-bloom'] as const;
