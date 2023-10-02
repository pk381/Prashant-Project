const User = require("../models/user");
const Earning = require("../models/earning");
const DailyClub = require("../models/daily_club");

async function updateIncome(per, planType, direct) {
  try {
    const allUser = await User.findAll({ where: { planType: planType, direct: direct } });

    let date = new Date();
    date = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();

    let dailyClub = await DailyClub.findOne({ where: { date: date } });

    let income = (dailyClub.amount * per) / allUser.length;

    allUser.forEach(async (user) => {
      let earning = await Earning.findOne({ where: { userId: user.id } });

      earning.dailyClub += income;

      await earning.save();
    });
  } catch (err) {
    console.log(err);
  }
}

exports.updateDailyClubIncome = async () => {
  try {
    await updateIncome(0.3, "basic", 2);
    await updateIncome(0.25, "star", 4);
    await updateIncome(0.2, "super star", 6);
    await updateIncome(0.15, "prime", 8);
    await updateIncome(0.1, "royal", 10);
  } catch (err) {
    console.log(err);
  }
};

exports.createDailyClub = async () => {
  try {
    let date = new Date();
    date = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();

    const dailyClub = await DailyClub.findOne({ where: { date: date } });

    if (dailyClub === null) {
      const club = await DailyClub.create({
        date: date,
      });

      return club;
    }
    return dailyClub;
  } catch (err) {
    console.log(err);
  }
};
