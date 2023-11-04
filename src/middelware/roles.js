const roles = {
  users: {
    title: "المستخدمين",
    permissions: {
      manage: {
        id: 100,
        name: "ادارة",
      },
      add: {
        id: 101,
        name: "اضافة",
      },
      delete: {
        id: 102,
        name: "حذف",
      },
    },
  },
  roles: {
    title: "الصلاحيات",
    permissions: {
      manage: {
        id: 103,
        name: "ادارة",
      },
      add: {
        id: 104,
        name: "اضافة",
      },
      delete: {
        id: 105,
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
  settings: {
    title: "الاعدادات",
    permissions: {
      upgrade: {
        id: 117,
        name: "تحديث",
      },
    },
  },
};

module.exports = roles;
