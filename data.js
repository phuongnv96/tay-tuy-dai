// Tây Tùy Đài — world data (dialogues + quests). G2: data-driven, code chỉ đọc.
window.DATA = {
  quests: [
    { id: 'khoai', name: 'Bữa trưa của sư huynh', desc: 'Tìm 3 củ khoai lang cho Thiết Ngưu.', need: 3 },
    { id: 'cui', name: 'Củi cho Thạch Đầu', desc: 'Nhặt 5 khúc củi khô cho Thạch Đầu.', need: 5 }
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
    ]
  }
};
