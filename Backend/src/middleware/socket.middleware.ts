import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";

const verifyToken = (token: string) => {
  if (token && token.startsWith("Bearer ")) {
    const actualToken = token.split(" ")[1];

    if (actualToken === "valid-token-example") {
      return { userId: "user1234" };
    }
  }
  return null;
};

export const socketAuth = async (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  try {
    // Extract the token from handSHake
    const token =
      socket.handshake.auth.token || socket.handshake.headers["authorization"];

    if (!token) {
      const error = new Error(
        "Authentication error: No token provided"
      ) as ExtendedError;
      error.data = { status: 401 };
      return next(error);
    }

    // Validate the token
    const validToken = verifyToken(token);
    if (!validToken) {
      const error = new Error(
        "Authentication error: Invalid token"
      ) as ExtendedError;
      error.data = { status: 404 };
      return next(error);
    }

    // Attaching User data
    socket.data.user = validToken;
    console.log(
      `Authenticated socket ${socket.id} for user ${validToken.userId}`
    );

    next();
  } catch (error) {
    console.error("Authentication Middleware Error", error);
    const err = new Error("Internal server error") as ExtendedError;
    err.data = { status: 500 };
    return next(err);
  }
};

export default socketAuth;
