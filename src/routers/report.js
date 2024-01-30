const express = require("express");
const router = express.Router();

const Role = require("../models/role");
const auth = require("../middelware/auth");
const permissions = require("../middelware/roles");
const Admin = require("../models/admin");
const Collaborator = require("../models/collaborator");
const Convoy = require("../models/convoy");
const Member = require("../models/member");

const collaborators = Collaborator.find({});

// all role
router.get("/reports", auth.admin("reports", "read"), async (req, res) => {
  try {
    const doctors = await Collaborator.find({});
    const convoys = await Convoy.find({});
    const members = await Member.find(
      {},
      {
        name: 1,
        convoys: 1,
      }
    );
    let doctorsReport = [];
    let membersReport = [];
    for (let i = 0; i < doctors.length; i++) {
      let count = convoys.filter((convoy) => {
        return convoy.collaborators.includes(doctors[i]._id);
      }).length;

      doctors[i].convoysCount = count;
      doctorsReport.push({
        name: doctors[i].name,
        count: count,
      });
    }
    for (let i = 0; i < members.length; i++) {
      membersReport.push({
        name: members[i].name.first.ar + " " + members[i].name.last.ar,
        count: members[i].convoys.length,
      });
    }

    res.send({
      doctors: doctorsReport,
      members: membersReport,
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
