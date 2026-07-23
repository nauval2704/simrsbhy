const checkinModel = require("../../models/checkin");
const moment = require("moment");


module.exports = {
    pasien: async (req, res) => {
        try {
            const { start, end } = req.body
            const startOfDay = moment(start).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            const endOfDay = moment(end).endOf('day').format('YYYY-MM-DD HH:mm:ss');

            let pipeline = [
                // Match documents within the date range and criteria
                {
                    $match: {
                        tglInput: { $gte: startOfDay },
                        tglOut: { $lte: endOfDay },
                        jnsPelayanan: 'R.Inap',
                        status: '1'
                    }
                },
                {
                    $sort: { noCheckin: 1 }
                },
                // Lookup rincian and tariff details within the same stage
                {
                    $lookup: {
                        from: "rincians",
                        let: { noCheckin: "$noCheckin" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$noCheckin", "$$noCheckin"] } } },
                            {
                                $lookup: {
                                    from: "tarifs",
                                    localField: "noTarif",
                                    foreignField: "noTarif",
                                    as: "tarifDetails"
                                }
                            },
                            { $unwind: { path: "$tarifDetails", preserveNullAndEmptyArrays: true } }
                        ],
                        as: "dataRincian"
                    }
                },
                // Lookup pharmacy details within the same stage
                {
                    $lookup: {
                        from: "reseps",
                        localField: "noCheckin",
                        foreignField: "noCheckin",
                        as: "dataFarmasi"
                    }
                },
                // Add the joined fields to the root document
                {
                    $addFields: {
                        dataRincian: {
                            $map: {
                                input: "$dataRincian",
                                as: "rincian",
                                in: {
                                    noCheckin: "$$rincian.noCheckin",
                                    qty: "$$rincian.qty",
                                    noTarif: "$$rincian.noTarif",
                                    tarifDetails: "$$rincian.tarifDetails"
                                }
                            }
                        },
                        dataFarmasi: {
                            $map: {
                                input: "$dataFarmasi",
                                as: "farmasi",
                                in: "$$farmasi"
                            }
                        }
                    }
                }
            ];

            const getFilteredPasien = await checkinModel.aggregate(pipeline);

            return res.status(200).send({
                status: "200",
                message: "Enjoy!.",
                data: getFilteredPasien,
            });

        } catch (error) {
            return res.status(400).send({
                status: "400",
                message: error,
                data: null,
            });
        }
    },
};