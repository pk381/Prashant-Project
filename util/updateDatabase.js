const User = require('../models/user');
const Earning = require('../models/earning');
const DailyClub = require('../models/daily_club');


async function updateIncome(per, planType){

    try{
        const allUser = await User.findAll({where: {planType : planType}});

        let date = new Date();
        date = date.getDate() +"/"+ date.getMonth() +"/"+ date.getFullYear();

        let dailyClub = await DailyClub.findOne({where: {date: date}});

        let income = (dailyClub.amount*per)/allUser.length;

        allUser.forEach( async (user) => {
            
            let earning = await Earning.findOne({where: {userId: user.id}});

            earning.dailyClub += income;

            await earning.save();
        });

    }
    catch(err){
        console.log(err);
    }
}

exports.updateDailyClubIncome = async ()=>{
    try{
        await updateIncome(0.3, '20');
        await updateIncome(0.25, '50');
        await updateIncome(0.20, '100');
        await updateIncome(0.15, '200');
        await updateIncome(0.10, '500'); 
    }
    catch(err){
        console.log(err);
    }
}

exports.createDailyClub = async () =>{
    try{
        let date = new Date();

        date = date.getDate() +"/"+ date.getMonth() +"/"+ date.getFullYear();

        const dailyClub = await DailyClub.findOne({where: {date: date}});

        if(dailyClub === null){

            const club = await DailyClub.create({
                date: date
            });

            return club;
        }
        return dailyClub;
    }
    catch(err){
        console.log(err);
    }
}