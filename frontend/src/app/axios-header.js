export const getAuth = () => ({
    "Authorization": "Bearer " + localStorage.getItem("token")
})