const User = require("../models/user");
const Earning = require("../models/earning");
const DailyClub = require("../models/daily_club");
const Company = require("../models/company");


const BoostDetails = require("../models/boostDetails");

exports.createcompany = async () =>{
  try{

    const comp = await Company.findAll();

    if(comp.length === 0){

      await Company.create({
        name: 'Digitalmetaone.com'

      })
    }
  }
  catch(err){
    console.log(err);
  }
}

async function updateIncome(per, planType, direct) {
  try {
    const allUser = await User.findAll({
      where: { planType: planType, direct: direct },
    });

    let date = new Date();
    date = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();

    let dailyClub = await DailyClub.findOne({ where: { date: date } });

    let income = ((dailyClub.amount * per) / allUser.length)*0.9;

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
    setInterval( async () =>{

    await updateIncome(0.25, "starter", 2);
    await updateIncome(0.20, "basic", 2);
    await updateIncome(0.15, "star", 4);
    await updateIncome(0.10, "super star", 6);
    await updateIncome(0.08, "prime", 8);
    await updateIncome(0.07, "royal", 10);

    }, 1000*24*60*60);
    
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

// boost board

exports.createBoostBoardDetails = async () => {
  try {
    const plans = ["starter", "basic", "star", "super star", "prime", "royal"];

    for (let i = 0; i < 6; i++) {
      await BoostDetails.create({
        planType: plans[i],
      });
    }
  } catch (err) {
    console.log(err);
  }
};
