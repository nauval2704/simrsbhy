const JasaDokterModel = require("../../models/keuangan/jasaDokter");
const moment = require("moment");


module.exports = {
    create: async (req, res) => {
        try {
            const { noCheckin, ...data } = req.body;

            let upsertJasaDokter = await JasaDokterModel.findOneAndUpdate(
                { noCheckin },
                { $setOnInsert: { createdAt: moment() }, $set: data },
                { new: true, upsert: true }
            );

            // If the document already exists, update it without modifying the createdAt field
            if (!upsertJasaDokter.createdAt) {
                upsertJasaDokter.createdAt = moment();
                await upsertJasaDokter.save();
            }

            return res.status(200).send({
                status: "200",
                message: "Ok!",
                data: [upsertJasaDokter],
            });

        } catch (error) {
            return res.status(400).send({
                status: "400",
                message: error,
                data: null,
            });
        }
    },

    getJasaDokter: async (req, res) => {
        try {

            const { start, end } = req.query;
            const startOfDayUnix = moment(start).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            const endOfDayUnix = moment(end).endOf('day').format('YYYY-MM-DD HH:mm:ss');

            let pipeline = [
                {
                    $match: {
                        tglInput: { $gte: startOfDayUnix },
                        tglOut: { $lte: endOfDayUnix }
                    }
                },
            ];

            const getJasaDokter = await JasaDokterModel.aggregate(pipeline);


            return res.status(200).send({
                status: "200",
                message: "Ok!.",
                data: getJasaDokter,
            });

        } catch (error) {
            return res.status(400).send({
                status: "400",
                message: error,
                data: null,
            });
        }
    }

}