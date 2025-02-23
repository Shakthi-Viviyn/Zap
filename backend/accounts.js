import supabase from "./database/client.js";

/*
    Pass userId as number
*/
export async function getAccount(userId){
    const { data, error } = await supabase.from("account").select("*").eq("user_id", userId).limit(1);
    if (error) {
        return null;
    } else {
        return data[0];
    }
}

export async function createAccount({ firstname, lastname, username, email, password }) {
    const {data, error} = await supabase.from("account").insert(
        {
            first_name: firstname,
            last_name: lastname,
            username: username,
            email: email,
            password: password
        }
    ).select("id");

    if (error) {
        throw new Error(`Error creating account: ${error.message}`);
    }
    return data[0];
}