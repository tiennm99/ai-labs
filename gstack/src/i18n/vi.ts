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
      status: 'sap-ra-mat',
    },
    'lop-8': {
      title: 'Lớp 8',
      hero: 'Tam giác đồng dạng',
      blurb:
        'AA, SAS, SSS đồng dạng. Kéo để xem tỉ số cạnh giữ nguyên khi tam giác phóng to.',
      status: 'sap-ra-mat',
    },
    'lop-9': {
      title: 'Lớp 9',
      hero: 'Góc nội tiếp',
      blurb:
        'Kéo điểm M trên đường tròn — góc nội tiếp giữ nguyên khi M ở cùng cung.',
      status: 'sap-ra-mat',
    },
  },
  status: {
    'sap-ra-mat': 'Sắp ra mắt',
  },
} as const;

export type Locale = typeof vi;
