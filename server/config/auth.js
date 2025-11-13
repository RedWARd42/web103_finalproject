const options = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/github/callback",
};

const verify = async (accessToken, refreshToken, profile, callback) => {
  const {
    _json: { id, name, login, avatar_url },
  } = profile;

  const userData = {
    githubId: id,
    username: login,
    avatarUrl: avatar_url,
    accessToken,
  };

  try {
    const results = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [userData.username]
    );

    const user = results.rows[0];

    if (!user) {
      const results = await pool.query(
        `INSERT INTO users (username, githubid, avatarurl, accesstoken, role, rating, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [userData.username, userData.githubId, userData.avatarUrl, accessToken, 'both', 0, new Date()]
      );

      const newUser = results.rows[0];
      return callback(null, newUser);
    }

    return callback(null, user);
  } catch (e) {
    console.error(e);
    return callback(error)
  }
};

export const GitHub = new GitHubStrategy(options, verify)