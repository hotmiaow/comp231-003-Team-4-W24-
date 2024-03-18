import axios from "axios";
import Cookies from "js-cookie";
export const authLogin = async (email, password, url) => {
  try {
    const response = await axios.post("http://localhost:5500/diner/login", {
      email: email,
      password: password,
    });

    console.log(response);

    if (response) {
      console.log(response.data.message);
      console.log(response.data.id);
      console.log(response.data.accessToken);
      console.log(response.data.refreshToken);
      console.log(response.data.type);

      // const cookieExpire = new Date(new Date().getMinutes() + 60);
      // console.log(cookieExpire);

      Cookies.set("accessToken", response.data.accessToken, {
        expires: 1 / 12,
        path: "/",
      });
      Cookies.set("refreshToken", response.data.refreshToken, {
        expires: 1 / 12,
        path: "/",
      });
      Cookies.set("userId", response.data.id, { expires: 1 / 12 });

      Cookies.set("type", response.data.type, { expires: 1 / 12 });


      console.log(Cookies.get());

      console.log("Access Token", Cookies.get("accessToken"));
      console.log("Refresh Token", Cookies.get("refreshToken"));
      console.log("User Id", Cookies.get("userId"));
      console.log("type : ", Cookies.get("type"));
      // navigate(`/diner/${data.id}`)
      console.log(url);
      // window.location.href = url;
    }
  } catch (e) {
    console.log(e);
  }
};
export const authLogout = (navigate) => {
  Cookies.remove("accessToken", { path: "/" });
  Cookies.remove("refreshToken", { path: "/" });
  Cookies.remove("userId", { path: "/" });
  navigate("/login");
};
