const getUsername = async (id) => {
    const users = localStorage.getItem("users");
    if (users == null) try {
        const res = await axios.get(`${API_URL}/users/`);
        localStorage.setItem("users", JSON.stringify(res.data));
        return res.data[id].name;
    } catch (error) {
        console.error("Error getting usernames: ", error)
    }
    return JSON.parse(users)[id].name;
}

export default getUsername;
