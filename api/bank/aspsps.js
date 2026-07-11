// TIJDELIJKE testfunctie (Fase 1) om de Enable Banking-koppeling te verifiëren.
// Haalt de lijst NL-banken op. Wordt verwijderd zodra dit getest is.

const { ebFetch } = require('../_lib/enableBanking');

module.exports = async (req, res) => {
  try {
    const { ok, status, data } = await ebFetch('/aspsps?country=NL');

    if (!ok) {
      return res.status(status).json(data);
    }

    const banken = (data.aspsps || []).map((a) => ({
      naam: a.name,
      land: a.country,
    }));

    return res.status(200).json({ aantal: banken.length, banken });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
