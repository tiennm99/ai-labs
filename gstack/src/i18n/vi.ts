export const vi = {
  site: {
    title: 'Hình Học Sống',
    tagline: 'Học hình bằng cách kéo',
    description:
      'Trang web tương tác giúp học sinh THCS (lớp 7–9) hiểu hình học bằng cách kéo và quan sát các định lý sống động.',
  },
  hub: {
    intro:
      'Mỗi định lý là một hình động. Kéo các điểm và xem định lý vẫn đúng. Đã chuẩn theo sách giáo khoa.',
    chooseGrade: 'Chọn lớp của bạn:',
  },
  grade: {
    'lop-7': {
      title: 'Lớp 7',
      hero: 'Tam giác bằng nhau',
      blurb: 'SSS, SAS, ASA — kéo hai tam giác để xem khi nào chúng bằng nhau.',
      status: 'live',
      href: '/lop-7/tam-giac-bang-nhau/',
    },
    'lop-8': {
      title: 'Lớp 8',
      hero: 'Tam giác đồng dạng',
      blurb:
        'Kéo thanh trượt phóng/thu — tỉ số ba cạnh tương ứng giữ nguyên, các góc cũng không đổi.',
      status: 'live',
      href: '/lop-8/tam-giac-dong-dang/',
    },
    'lop-9': {
      title: 'Lớp 9',
      hero: 'Góc nội tiếp',
      blurb:
        'Kéo điểm M trên đường tròn — góc nội tiếp giữ nguyên khi M ở cùng cung.',
      status: 'live',
      href: '/lop-9/goc-noi-tiep/',
    },
  },
  status: {
    'sap-ra-mat': 'Sắp ra mắt',
    live: 'Khám phá',
  },
  module3: {
    title: 'Góc nội tiếp',
    grade: 'Lớp 9',
    intro:
      'Định lý góc nội tiếp nói rằng: khi M chạy trên cùng một cung của đường tròn, góc nội tiếp ∠AMB không đổi và bằng nửa góc ở tâm cùng chắn cung. Hãy kéo điểm M trên đường tròn để tự kiểm chứng.',
    instruction: 'Kéo điểm M (đỏ) quanh đường tròn',
    inscribedLabel: 'Góc nội tiếp ∠AMB',
    centralLabel: 'Góc ở tâm ∠AOB',
    theoremTitle: 'Định lý',
    theoremStatement:
      'Trong một đường tròn, số đo của góc nội tiếp bằng nửa số đo của góc ở tâm cùng chắn một cung.',
    exampleTitle: 'Ví dụ',
    exampleBody:
      'Cho đường tròn (O) với hai điểm A, B cố định sao cho góc ở tâm ∠AOB = 120°. Theo định lý, mọi điểm M nằm trên cung lớn AB đều cho ∠AMB = 60° (= 120° / 2). Khi M chuyển sang cung nhỏ, ∠AMB = 120° vì khi đó góc nội tiếp chắn cung lớn (240°), một nửa của nó là 120°. Hãy kéo điểm M để kiểm tra.',
    backToHub: '← Về trang chủ',
    nextTeaser: 'Bài tiếp theo: Tứ giác nội tiếp (sắp ra mắt)',
  },
  module1: {
    title: 'Tam giác bằng nhau (SSS)',
    grade: 'Lớp 7',
    intro:
      'Hai tam giác bằng nhau khi cả ba cặp cạnh tương ứng có độ dài bằng nhau (trường hợp Cạnh – Cạnh – Cạnh). Hãy kéo từng đỉnh để xem khi nào hai tam giác trùng khớp.',
    instruction: 'Kéo bất kỳ đỉnh nào của hai tam giác',
    congruentBadge: 'Hai tam giác bằng nhau (c.c.c)',
    lengthsTitle: 'Độ dài cạnh',
    tabSide: 'Cặp cạnh',
    theoremTitle: 'Định lý (cạnh – cạnh – cạnh)',
    theoremStatement:
      'Nếu ba cạnh của tam giác này lần lượt bằng ba cạnh của tam giác kia thì hai tam giác đó bằng nhau.',
    exampleTitle: 'Ví dụ',
    exampleBody:
      'Cho hai tam giác △ABC và △A′B′C′ với AB = A′B′ (cùng có một dấu gạch đỏ), BC = B′C′ (cùng có hai dấu gạch xanh), CA = C′A′ (cùng có ba dấu gạch cam). Theo trường hợp c.c.c, △ABC = △A′B′C′ — và do đó các góc tương ứng cũng bằng nhau. Hãy kéo các đỉnh để các cặp cạnh có cùng độ dài, huy hiệu xanh sẽ bật lên.',
    backToHub: '← Về trang chủ',
    nextTeaser: 'Sắp ra mắt: SAS / ASA / cạnh huyền – góc nhọn / cạnh huyền – cạnh góc vuông',
  },
  module2: {
    title: 'Tam giác đồng dạng',
    grade: 'Lớp 8',
    intro:
      'Hai tam giác đồng dạng có các góc tương ứng bằng nhau và các cạnh tương ứng tỉ lệ. Hãy kéo thanh trượt phóng/thu △A′B′C′ — tỉ số AB/A′B′ luôn bằng BC/B′C′ và CA/C′A′, dù tam giác lớn hay nhỏ. Các góc thì không đổi.',
    instruction: 'Kéo thanh trượt để phóng to hoặc thu nhỏ △A′B′C′',
    kLabel: 'Hệ số phóng',
    sidesTitle: 'Cạnh tương ứng',
    tabSide: 'Cặp cạnh',
    tabT1: '△ABC',
    tabT2: '△A′B′C′',
    tabRatio: 'Tỉ số AB/A′B′',
    anglesNote:
      'Khi △A′B′C′ phóng/thu theo hệ số k, các cạnh nhân với k nhưng các góc tại A, B, C không thay đổi — đó chính là định nghĩa của hai tam giác đồng dạng.',
    theoremTitle: 'Định nghĩa',
    theoremStatement:
      'Hai tam giác gọi là đồng dạng khi các góc tương ứng bằng nhau và các cạnh tương ứng tỉ lệ. Tỉ số đó được gọi là tỉ số đồng dạng k.',
    exampleTitle: 'Ví dụ',
    exampleBody:
      'Ở hệ số k = 2, tam giác △A′B′C′ to gấp đôi △ABC: mỗi cạnh A′B′ = 2 · AB. Khi đó tỉ số AB/A′B′ = 1/2 = 0,50, đúng bằng BC/B′C′ và CA/C′A′. Khi k = 0,5, tam giác A′B′C′ nhỏ bằng nửa: tỉ số AB/A′B′ = 2,00. Hãy kéo thanh trượt để xác nhận.',
    backToHub: '← Về trang chủ',
    nextTeaser: 'Sắp ra mắt: kéo từng đỉnh tự do (AA / SAS / SSS đồng dạng)',
  },
} as const;

export type Locale = typeof vi;
