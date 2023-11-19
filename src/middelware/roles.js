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
  roles: {
    title: "الصلاحيات",
    permissions: {
      add: {
        id: 104,
        name: "ادارة",
      },
      delete: {
        id: 105,
        name: "اضافة",
      },
      manage: {
        id: 106,
        name: "حذف",
      },
    },
  },
  gallery: {
    title: "الجاليري",
    permissions: {
      manage: {
        id: 106,
        name: "ادارة",
      },
      add: {
        id: 107,
        name: "اضافة",
      },
      delete: {
        id: 108,
        name: "حذف",
      },
    },
  },
  collaporator: {
    title: "الاطباء",
    permissions: {
      manage: {
        id: 109,
        name: "ادارة",
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
  convoys: {
    title: "القوافل",
    permissions: {
      manage: {
        id: 111,
        name: "ادارة",
      },
      add: {
        id: 112,
        name: "اضافة",
      },
      delete: {
        id: 113,
        name: "حذف",
      },
    },
  },
  members: {
    title: "الاعضاء",
    permissions: {
      manage: {
        id: 114,
        name: "ادارة",
      },
      add: {
        id: 115,
        name: "اضافة",
      },
      delete: {
        id: 116,
        name: "حذف",
      },
    },
  },
  specialization: {
    title: "التخصصات",
    permissions: {
      manage: {
        id: 117,
        name: "ادارة",
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
  settings: {
    title: "الاعدادات",
    permissions: {
      upgrade: {
        id: 120,
        name: "تحديث",
      },
    },
  },
};

module.exports = roles;
