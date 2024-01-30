const roles = {
  users: {
    title: "المستخدمين",
    permissions: {
      read: {
        name: "قراءة",
        id: 100,
      },
      edit: {
        id: 101,
        name: "تعديل",
      },
      add: {
        id: 102,
        name: "اضافة",
      },
      delete: {
        id: 103,
        name: "حذف",
      },
    },
  },
  members: {
    title: "الاعضاء",
    permissions: {
      read: {
        name: "قراءة",
        id: 104,
      },
      edit: {
        id: 105,
        name: "تعديل",
      },
      add: {
        id: 106,
        name: "اضافة",
      },
      delete: {
        id: 107,
        name: "حذف",
      },
    },
  },
  roles: {
    title: "الصلاحيات",
    permissions: {
      read: {
        name: "قراءة",
        id: 108,
      },
      edit: {
        id: 109,
        name: "تعديل",
      },
      add: {
        id: 110,
        name: "اضافة",
      },
      delete: {
        id: 111,
        name: "حذف",
      },
    },
  },
  collaborators: {
    title: "التعاقدات",
    permissions: {
      read: {
        name: "قراءة",
        id: 112,
      },
      edit: {
        id: 113,
        name: "تعديل",
      },
      add: {
        id: 114,
        name: "اضافة",
      },
      delete: {
        id: 115,
        name: "حذف",
      },
    },
  },
  committees: {
    title: "اللجان",
    permissions: {
      read: {
        name: "قراءة",
        id: 116,
      },
      edit: {
        id: 117,
        name: "تعديل",
      },
      add: {
        id: 118,
        name: "اضافة",
      },
      delete: {
        id: 119,
        name: "حذف",
      },
    },
  },
  gallery: {
    title: "الجاليري",
    permissions: {
      read: {
        name: "قراءة",
        id: 120,
      },
      edit: {
        id: 121,
        name: "تعديل",
      },
      add: {
        id: 122,
        name: "اضافة",
      },
      delete: {
        id: 123,
        name: "حذف",
      },
    },
  },
  convoys: {
    title: "القوافل",
    permissions: {
      read: {
        name: "قراءة",
        id: 124,
      },
      edit: {
        id: 125,
        name: "تعديل",
      },
      add: {
        id: 126,
        name: "اضافة",
      },
      delete: {
        id: 127,
        name: "حذف",
      },
    },
  },
  settings: {
    title: "الاعدادات",
    permissions: {
      read: {
        name: "قراءة",
        id: 128,
      },
      edit: {
        id: 129,
        name: "تعديل",
      },
    },
  },
  reports: {
    title: "التقارير",
    permissions: {
      read: {
        name: "قراءة",
        id: 130,
      },
    },
  },
  projects: {
    title: "المشاريع",
    permissions: {
      read: {
        name: "قراءة",
        id: 131,
      },
      edit: {
        id: 132,
        name: "تعديل",
      },
      add: {
        id: 133,
        name: "اضافة",
      },
      delete: {
        id: 134,
        name: "حذف",
      },
    },
  },
  orders: {
    title: "الطلبات",
    permissions: {
      read: {
        name: "قراءة",
        id: 135,
      },
      edit: {
        id: 136,
        name: "تعديل",
      },
      delete: {
        id: 137,
        name: "حذف",
      },
    },
  },
  specializations: {
    title: "التخصصات",
    permissions: {
      read: {
        name: "قراءة",
        id: 138,
      },
      edit: {
        id: 139,
        name: "تعديل",
      },
      delete: {
        id: 140,
        name: "حذف",
      },
      add: {
        id: 141,
        name: "اضافة",
      },
    },
  },
  media: {
    title: "الميديا",
    permissions: {
      manage: {
        name: "ادارة",
        id: 142,
      },
    },
  },
};

module.exports = roles;
