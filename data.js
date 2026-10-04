// Tây Tùy Đài — world data (dialogues + quests). G2: data-driven, code chỉ đọc.
window.DATA = {
  quests: [
    { id: 'khoai', name: 'Bữa trưa của sư huynh', desc: 'Tìm 3 củ khoai lang cho Thiết Ngưu.', need: 3, type: 'collect' },
    { id: 'cui', name: 'Củi cho Thạch Đầu', desc: 'Nhặt 5 khúc củi khô cho Thạch Đầu.', need: 5, type: 'collect' },
    { id: 'la_phong', name: 'Lá phong đỏ', desc: 'Hái 5 lá phong cổ thụ ở Rừng Phong Đỏ (cổng phía đông) cho sư phụ luyện đan.', need: 5, type: 'collect' },
    { id: 'sao_truc', name: 'Tiếng sáo trong trúc', desc: 'Tìm người thổi sáo trong Rừng Trúc (cổng phía tây).', need: 1, type: 'talk', target: 'linh_nhi' },
    { id: 'ho_tong', name: 'Thương đội sa mạc', desc: 'Gặp thương nhân Hồ Lão ở Sa Mạc Vàng (cổng phía nam).', need: 1, type: 'talk', target: 'ho_lao' },
    { id: 'tuyet_lien', name: 'Thí luyện Tuyết Sơn', desc: 'Hái Tuyết Liên nghìn năm trên đỉnh Núi Tuyết (cổng phía bắc).', need: 1, type: 'collect' }
  ],
  dialogues: {
    master: [
      { who: 'master', name: 'Sư Phụ Yixuan', text: 'Ừm, ta nghe đây, đồ nhi.' },
      { who: 'master', name: 'Sư Phụ Yixuan', text: 'Ngươi đã vượt rừng phong đỏ, qua cầu đá bắc ngang suối, đến được Tây Tùy Đài… quả là có duyên.' },
      { who: 'master', name: 'Sư Phụ Yixuan', text: 'Từ hôm nay, ngươi chính thức là đệ tử của ta. Cứ đi dạo quanh đây cho quen đường, rồi quay lại gặp ta.' },
      { who: 'player', name: 'Nguyên', text: 'Đệ tử bái kiến sư phụ!' }
    ],
    thiet_nguu_idle: [
      { who: 'npc', name: 'Thiết Ngưu', text: 'Sư đệ! Đói meo râu rồi… ngươi tìm giúp ta 3 củ khoai lang được không?',
        choices: [{ label: 'Để đệ lo!', goto: 1 }, { label: 'Để sau nhé', goto: -1 }] },
      { who: 'npc', name: 'Thiết Ngưu', text: 'Khoai mọc quanh bìa rừng phong, đi về phía đông ấy. Cảm ơn sư đệ trước nhé!' }
    ],
    thiet_nguu_thanks: [
      { who: 'npc', name: 'Thiết Ngưu', text: 'Ngon quá! Đa tạ sư đệ! Sau này đói cứ tìm ta!' }
    ],
    thiet_nguu_done: [
      { who: 'npc', name: 'Thiết Ngưu', text: 'No nê rồi… giờ chỉ muốn ngủ một giấc!' }
    ],
    linh_nhi_idle: [
      { who: 'npc', name: 'Linh Nhi', text: 'Hi hi, sư đệ mới hả? Tỷ đang tập bài sáo mới nè.',
        choices: [{ label: 'Tỷ thổi thử đi!', goto: 1 }, { label: 'Để khi khác', goto: -1 }] },
      { who: 'npc', name: 'Linh Nhi', text: '…♪ ♫ … Nghe được không? Sư phụ bảo tỷ thổi còn phô lắm!' }
    ],
    thach_dau_idle: [
      { who: 'npc', name: 'Thạch Đầu', text: 'Cậu là đồ đệ mới của Yixuan tiên sinh hả? Chào cậu!',
        choices: [{ label: 'Bác cần giúp gì không?', goto: 1 }, { label: 'Chào bác!', goto: -1 }] },
      { who: 'npc', name: 'Thạch Đầu', text: 'Mùa này củi khô hiếm lắm. Cậu nhặt giúp bác 5 khúc củi quanh bìa rừng nhé!',
        choices: [{ label: 'Để cháu lo!', goto: 2 }, { label: 'Để sau nhé', goto: -1 }] },
      { who: 'npc', name: 'Thạch Đầu', text: 'Cảm ơn cháu trước nhé! Củi khô nằm rải rác quanh đây đó.' }
    ],
    thach_dau_thanks: [
      { who: 'npc', name: 'Thạch Đầu', text: 'Đủ củi rồi! Tối nay cả nhà ấm. Cảm ơn cháu nhiều!' }
    ],
    thach_dau_done: [
      { who: 'npc', name: 'Thạch Đầu', text: 'Rừng phong mùa này đẹp lắm, cậu đi dạo đi!' }
    ],
    linh_nhi_thanks: [
      { who: 'npc', name: 'Linh Nhi', text: 'Hi hi, đệ tìm được tỷ rồi! Để tỷ thổi một bài nè… ♪ ♫' }
    ],
    linh_nhi_done: [
      { who: 'npc', name: 'Linh Nhi', text: 'Rừng trúc này vui lắm, đệ ghé chơi nhé!' }
    ],
    ho_lao_idle: [
      { who: 'npc', name: 'Hồ Lão', text: 'Ôi chà, khách quý! Lão là Hồ Lão, thương nhân chạy khắp Cửu Châu đây!',
        choices: [{ label: 'Hàng của lão có gì hay?', goto: 1 }, { label: 'Để sau nhé', goto: -1 }] },
      { who: 'npc', name: 'Hồ Lão', text: 'Tơ lụa, đan dược, tin tức giang hồ — thứ gì cũng có! Cậu cần gì cứ nói với lão.' }
    ],
    ho_lao_thanks: [
      { who: 'npc', name: 'Hồ Lão', text: 'Hân hạnh! Hân hạnh! Đi đường cẩn thận nhé, sa mạc bão cát ghê lắm!' }
    ],
    ho_lao_done: [
      { who: 'npc', name: 'Hồ Lão', text: 'Lão sắp dong thuyền ra Đảo Núi Lửa buôn chuyến nữa đây. Cậu có dám đi cùng không?' }
    ],
    ba_ba_idle: [
      { who: 'npc', name: 'Tuyết Sơn Bà Bà', text: '…Ai đó? Lên tận Tuyết Sơn này ắt có việc.',
        choices: [{ label: 'Bà bà khỏe không ạ?', goto: 1 }, { label: 'Cháu đi ngang qua thôi', goto: -1 }] },
      { who: 'npc', name: 'Bà Bà', text: 'Trên đỉnh núi có đóa Tuyết Liên nghìn năm. Nếu có duyên, cứ hái đi.' }
    ],
    ba_ba_thanks: [
      { who: 'npc', name: 'Tuyết Sơn Bà Bà', text: 'Tuyết Liên đã nhận chủ. Giữ gìn cho tốt, đừng để rơi vào tay kẻ xấu.' }
    ],
    ba_ba_done: [
      { who: 'npc', name: 'Tuyết Sơn Bà Bà', text: 'Tuyết Sơn quanh năm lạnh lẽo, hiếm khách lắm. Ở lại uống chén trà nóng nhé.' }
    ]
  }
};
