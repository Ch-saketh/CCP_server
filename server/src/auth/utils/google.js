const { OAuth2Client } =
  require("google-auth-library");

const client =
  new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
  );

const verifyGoogleToken = async (
  token
) => {

  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error(
      "GOOGLE_CLIENT_ID is not configured"
    );
  }

  const ticket =
    await client.verifyIdToken({

      idToken: token,

      audience:
        process.env.GOOGLE_CLIENT_ID,
    });

  return ticket.getPayload();
};

module.exports =
  verifyGoogleToken;