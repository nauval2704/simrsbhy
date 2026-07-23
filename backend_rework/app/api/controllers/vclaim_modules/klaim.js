const axios = require('axios');
const { ConsId, UserKey, BaseUrl, getBpjsAuth, decryptResponse } = require('../../utils/vclaim/auth');

module.exports = {
  vclaimApiMonitoringKlaim: async (req, res) => {
    const { tmStamp, password, encodedSigna } = getBpjsAuth();
    try {
      const getList = await axios.get(
        BaseUrl + 'Monitoring/Klaim/Tanggal/' + req.params.tgl + '/JnsPelayanan/' + req.params.jenis + '/status/' + req.params.status,
        { headers: { 'x-cons-id': ConsId, 'x-timestamp': tmStamp, 'x-signature': encodedSigna, user_key: UserKey } }
      );
      if (getList.data.metaData.code !== '200') {
        res.json({ response: getList.data.metaData.message });
      } else {
        res.json(JSON.parse(decryptResponse(getList.data.response, password)));
      }
    } catch (err) {
      res.json({ metadata: { message: 'Jadwal Tidak Ditemukan', code: 201 } });
    }
  },
};
