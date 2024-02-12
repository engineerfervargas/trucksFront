import axios from "axios";

export const ip = {
  async getIp() {
    let ip = '0.0.0.0'
    await axios.get('https://ipapi.co/json/').then((res) => {
      ip = res.data.ip;
    });
    return ip;
  }
}