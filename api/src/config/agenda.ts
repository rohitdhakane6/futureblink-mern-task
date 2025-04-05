import Agenda from "agenda";

const agenda = new Agenda({
  db: {
    address: process.env.MONGO_URI!,
    collection: "emailJobs",
  },
});

export default agenda;
