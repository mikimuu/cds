// pages/api/login.js
import auth0 from '../../lib/auth0'

export default async function login(req, res) {
  try {
    // 認証プロセスを開始
    await auth0.handleLogin(req, res);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
