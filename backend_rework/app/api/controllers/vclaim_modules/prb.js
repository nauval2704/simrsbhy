const axios = require('axios');
const { ConsId, UserKey, BaseUrl, getBpjsAuth, decryptResponse } = require('../../utils/vclaim/auth');

module.exports = {
  vclaimApiObatPrb: async (req, res) => {
    const { tmStamp, password, encodedSigna } = getBpjsAuth();
    try {
      const getList = await axios.get(BaseUrl + 'referensi/obatprb/' + req.params.nama, {
        headers: { 'x-cons-id': ConsId, 'x-timestamp': tmStamp, 'x-signature': encodedSigna, user_key: UserKey },
      });
      if (getList.data.metaData.code !== '200') {
        res.json({ response: getList.data.metaData.message });
      } else {
        res.json(JSON.parse(decryptResponse(getList.data.response, password)));
      }
    } catch (err) {
      res.json({ metadata: { message: 'Jadwal Tidak Ditemukan', code: 201 } });
    }
  },
  vclaimApiDiagnosaPrb: async (req, res) => {
    const { tmStamp, password, encodedSigna } = getBpjsAuth();
    try {
      const getList = await axios.get(BaseUrl + 'referensi/diagnosaprb', {
        headers: { 'x-cons-id': ConsId, 'x-timestamp': tmStamp, 'x-signature': encodedSigna, user_key: UserKey },
      });
      if (getList.data.metaData.code !== '200') {
        res.json({ response: getList.data.metaData.message });
      } else {
        res.json(JSON.parse(decryptResponse(getList.data.response, password)));
      }
    } catch (err) {
      res.json({ metadata: { message: 'Jadwal Tidak Ditemukan', code: 201 } });
    }
  },
  vclaimApiPrbInsert: async (req, res) => {
    const { tmStamp, password, encodedSigna } = getBpjsAuth();
    try {
      const formData = {
        request: {
          t_prb: {
            noSep: req.body.noSep, noKartu: req.body.noKartu, alamat: req.body.alamat,
            email: req.body.email, programPRB: req.body.programPRB, kodeDPJP: req.body.kodeDPJP,
            keterangan: req.body.keterangan, saran: req.body.saran, user: req.body.user, obat: req.body.obat,
          },
        },
      };
      const getList = await axios.post(BaseUrl + 'PRB/insert', formData, {
        headers: {
          'x-cons-id': ConsId, 'x-timestamp': tmStamp, 'x-signature': encodedSigna,
          user_key: UserKey, 'Content-Type': 'Application/x-www-form-urlencoded', Accept: 'application/json',
        },
      });
      if (getList.data.metaData.code !== '200') {
        res.json({ response: getList.data });
      } else {
        res.json({ response: { metaData: { message: 'Ok', code: 200 }, data: JSON.parse(decryptResponse(getList.data.response, password)) } });
      }
    } catch (err) {
      res.json({ metaData: { message: 'Error Insert SEP', code: 201 } });
    }
  },
};
