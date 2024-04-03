exports.calculateLevenshteinDistance = (req, res) => {
  try {
    const { chaine1, chaine2 } = req.body;

    if (!chaine1 || !chaine2) {
      return res.status(400).json({ error: "Both strings are required" });
    }

    const minimum = (nb1, nb2, nb3) => {
      return Math.min(nb1, nb2, nb3);
    };

    const LEN_STR_1 = chaine1.length;
    const LEN_STR_2 = chaine2.length;
    let cost = 0;

    // Initialiser la matrice de distances
    const dist = [];
    for (let i = 0; i <= LEN_STR_1; i++) {
      dist[i] = [];
      dist[i][0] = i;
    }
    for (let j = 0; j <= LEN_STR_2; j++) {
      dist[0][j] = j;
    }

    // Calculer la distance de Levenshtein
    for (let i = 1; i <= LEN_STR_1; i++) {
      for (let j = 1; j <= LEN_STR_2; j++) {
        if (chaine1[i - 1] === chaine2[j - 1]) {
          cost = 0;
        } else {
          cost = 1;
        }
        dist[i][j] = minimum(
          dist[i - 1][j] + 1, // Suppression
          dist[i][j - 1] + 1, // Insertion
          dist[i - 1][j - 1] + cost, // Substitution
        );
      }
    }

    res.status(200).json({
      distance: dist[LEN_STR_1][LEN_STR_2],
      percent:
        Math.round(
          (1 - dist[LEN_STR_1][LEN_STR_2] / Math.max(LEN_STR_1, LEN_STR_2)) *
            100 *
            100,
        ) / 100,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
