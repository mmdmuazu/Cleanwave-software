import api from "../utils/api";

export const adminLogin = async (adminData) => {
  try {
    const response = await api.post("/admin/login", adminData);
    return response.data;
  } catch (error) {
    return error.response?.data?.error || "Admin Login failed";
  }
};
export const adminCheckLogin = async () => {
  try {
    const response = await api.get("/admin/check-login");
    // console.log("Check-login Function:: ", response.data.success);
    return response.data;
  } catch (err) {
    console.log("checklogin ::", err);
    return err.response?.data || "not logged in";
  }
};
export const adminLogout = async () => {
  try {
    const res = await api.post("/admin/logout");
    console.log("Error loginout ", res);
    return res.data;
  } catch (err) {
    console.log("Logout error:", err);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get("/admin/total-users");

    return response.data;
  } catch (error) {
    return error.message || "Failed to fetch Users";
  }
};

export const getAllInfo = async () => {
  try {
    const response = await api.get("/admin/all-info");

    return response.data;
  } catch (error) {
    return error.message || "Failed to fetch feMale users";
  }
};

export const getAllWasteData = async () => {
  try {
    const response = await api.get("/admin/waste-data");

    return response.data;
  } catch (error) {
    return error.message || "Failed to fetch Waste Data";
  }
};

export const updateWasteStatus = async (id, newStatus) => {
  try {
    const response = await api.put(`/admin/waste-status/${id}`, {
      status: newStatus,
    });

    return response.data;
  } catch (error) {
    console.log("Error AdminSevice updateWaste:: ", error);
    return (
      error.response.data.error ||
      error.response.data ||
      "Failed to update Waste Status"
    );
  }
};
