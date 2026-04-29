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
        'AA, SAS, SSS đồng dạng. Kéo để xem tỉ số cạnh giữ nguyên khi tam giác phóng to.',
      status: 'sap-ra-mat',
      href: null,
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
} as const;

export type Locale = typeof vi;
