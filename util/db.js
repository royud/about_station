const { default: mongoose } = require("mongoose");

// 스키마 등록
const usersSchema = new mongoose.Schema(
  {
    lineName: {
      type: String,
      required: true,
    },
    toiletId: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    inAndOut: {
      type: String,
      required: true,
    },
    MaleOrFemale: {
      type: String,
      required: true,
    },
    etc: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false, // "__v" 항목이 생기지 않도록 설정
  }
);
const usersModel = mongoose.model("toilet", usersSchema);

const db = mongoose.connect(
  "mongodb+srv://jaejeonglee:royud@cluster0.tpa4iyw.mongodb.net/"
);

app.get("/add_1", (req, res) => {
  newUsers = new usersModel();
  newUsers.username = "cocoon";
  newUsers.password = "asd123";
  newUsers.age = 27;
  newUsers.save((err) => {
    if (err) throw err;
    console.log("Add Success!");
    res.send("Add Success!");
  });
});
